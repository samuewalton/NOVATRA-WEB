import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, query, body } = req;
    const { id } = query;

    switch (method) {
      case 'GET':
        if (id) {
          // Get single order
          const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (!data) {
            return res.status(404).json({ error: 'Order not found' });
          }

          return res.status(200).json(data);
        } else {
          // Get all orders (with optional filters)
          let query = supabaseAdmin.from('orders').select('*');

          // Filter by user_id if provided
          if (body.user_id) {
            query = query.eq('user_id', body.user_id);
          }

          // Filter by status if provided
          if (body.status) {
            query = query.eq('status', body.status);
          }

          const { data, error } = await query.order('created_at', { ascending: false });

          if (error) throw error;
          return res.status(200).json(data || []);
        }

      case 'POST':
        // Create new order
        const {
          user_id,
          guest_email,
          items,
          subtotal,
          discount_amount,
          total_price,
          coupon_code,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address
        } = body;

        // Validate required fields
        if (!items || !items.length || !customer_name || !customer_email || !customer_phone || !shipping_address) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data: newOrder, error: createError } = await supabaseAdmin
          .from('orders')
          .insert([{
            user_id: user_id || null,
            guest_email: guest_email || null,
            items,
            subtotal: subtotal || 0,
            discount_amount: discount_amount || 0,
            total_price,
            coupon_code: coupon_code || null,
            status: 'pending',
            customer_name,
            customer_email,
            customer_phone,
            shipping_address
          }])
          .select()
          .single();

        if (createError) throw createError;

        // TODO: Send confirmation email
        // TODO: Update product stock

        return res.status(201).json(newOrder);

      case 'PUT':
        // Update order status (admin only - add auth check later)
        if (!id) {
          return res.status(400).json({ error: 'Order ID required' });
        }

        const { status } = body;
        if (!status) {
          return res.status(400).json({ error: 'Status required' });
        }

        const { data: updatedOrder, error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;

        // TODO: Send status update email

        return res.status(200).json(updatedOrder);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('Orders API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side Supabase client (bypasses RLS for admin operations)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
          // Get single product
          const { data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (!data) {
            return res.status(404).json({ error: 'Product not found' });
          }

          return res.status(200).json(data);
        } else {
          // Get all products
          const { data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          return res.status(200).json(data || []);
        }

      case 'POST':
        // Create new product (admin only - add auth check later)
        const { data: newProduct, error: createError } = await supabaseAdmin
          .from('products')
          .insert([body])
          .select()
          .single();

        if (createError) throw createError;
        return res.status(201).json(newProduct);

      case 'PUT':
        // Update product (admin only - add auth check later)
        if (!id) {
          return res.status(400).json({ error: 'Product ID required' });
        }

        const { data: updatedProduct, error: updateError } = await supabaseAdmin
          .from('products')
          .update(body)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        return res.status(200).json(updatedProduct);

      case 'DELETE':
        // Delete product (admin only - add auth check later)
        if (!id) {
          return res.status(400).json({ error: 'Product ID required' });
        }

        const { error: deleteError } = await supabaseAdmin
          .from('products')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('Products API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

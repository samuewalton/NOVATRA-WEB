import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const geminiApiKey = process.env.GEMINI_API_KEY!;
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const ai = new GoogleGenAI({ apiKey: geminiApiKey });
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function declarations for Gemini
const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "searchProducts",
    description: "Search for products by category, price range, or keywords",
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING, description: "Optional. Product category" },
        minPrice: { type: Type.NUMBER, description: "Optional. Minimum price" },
        maxPrice: { type: Type.NUMBER, description: "Optional. Maximum price" },
        keywords: { type: Type.STRING, description: "Optional. Search keywords" }
      }
    }
  },
  {
    name: "getProductDetails",
    description: "Get full details of a specific product",
    parameters: {
      type: Type.OBJECT,
      properties: {
        productId: { type: Type.STRING, description: "Product ID or SKU" }
      },
      required: ["productId"]
    }
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create chat with history
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash-exp',
      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        systemInstruction: `You are Rani, the friendly shopping assistant for NOVATRA - official Veres baby furniture importer in Israel.

Your role:
- Help parents choose the perfect furniture for their baby/child
- Answer questions about products (dimensions, materials, safety, assembly)
- Provide recommendations based on age, budget, room size, style preferences
- Assist with the purchasing process
- Speak naturally in Hebrew, English, or Russian (match user's language)

You have access to functions to search products and get details.
Always be warm, professional, and helpful. Focus on safety and quality.`,
        tools: [{ functionDeclarations }]
      },
      history: history || []
    });

    // Send message
    let response = await chat.sendMessage({ message });

    // Handle function calls
    while (response.functionCalls && response.functionCalls.length > 0) {
      const functionResponseParts = [];

      for (const fc of response.functionCalls) {
        const { name, args } = fc;
        let result: any;

        if (name === 'searchProducts') {
          // Search products in Supabase
          let query = supabase.from('products').select('*');

          if (args.category) {
            query = query.ilike('category->en', `%${args.category}%`);
          }
          if (args.minPrice) {
            query = query.gte('price->ils', args.minPrice);
          }
          if (args.maxPrice) {
            query = query.lte('price->ils', args.maxPrice);
          }
          if (args.keywords) {
            query = query.or(
              `name->en.ilike.%${args.keywords}%,description->en.ilike.%${args.keywords}%`
            );
          }

          const { data, error } = await query.limit(10);
          result = error ? { error: error.message } : data;
        } else if (name === 'getProductDetails') {
          // Get product by ID or SKU
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`id.eq.${args.productId},sku.eq.${args.productId}`)
            .single();

          result = error ? { error: error.message } : data;
        }

        functionResponseParts.push({
          functionResponse: {
            name: fc.name,
            response: { result: JSON.stringify(result) }
          }
        });
      }

      response = await chat.sendMessage({ message: functionResponseParts });
    }

    return res.status(200).json({
      text: response.text
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: error.message || 'Chat failed' });
  }
}

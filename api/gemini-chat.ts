import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';

// Initialize Gemini AI with API key from environment variables
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenAI({ apiKey });
};

// Function declarations for tool calling
const functionDeclarations: FunctionDeclaration[] = [
  {
    name: 'searchProducts',
    description: 'Search for products by category, price range, or keywords',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING, description: 'Optional. Product category (e.g., Baby Cribs, Wardrobes, Dressers).' },
        minPrice: { type: Type.NUMBER, description: 'Optional. The minimum price for the product search.' },
        maxPrice: { type: Type.NUMBER, description: 'Optional. The maximum price for the product search.' },
        keywords: { type: Type.STRING, description: 'Optional. Keywords to search for in product name or description.' }
      },
      propertyOrdering: ['category', 'minPrice', 'maxPrice', 'keywords'],
    }
  },
  {
    name: 'getProductDetails',
    description: 'Get full details of a specific product using its ID or SKU.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        productId: { type: Type.STRING, description: 'The ID or SKU of the product.' }
      },
      required: ['productId']
    }
  },
  {
    name: 'addToCart',
    description: 'Add a product to the users shopping cart.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        productId: { type: Type.STRING, description: 'The ID or SKU of the product to add.' },
        quantity: { type: Type.NUMBER, description: 'The quantity to add. Defaults to 1.' },
        color: { type: Type.STRING, description: 'The selected color for the product, if applicable.' },
        accessories: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'An array of accessory IDs to add with the product.' }
      },
      required: ['productId']
    }
  },
  {
    name: 'getCart',
    description: 'Get the current contents of the users shopping cart.',
    parameters: { type: Type.OBJECT, properties: {} }
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAI();

    // Create chat with history if provided
    const chat = ai.chats.create({
      model: 'gemini-2.5-pro',
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

You have access to functions to:
- Search products by criteria
- Get product details
- Add items to cart
- Check current cart contents

Be warm, professional, and genuinely helpful. Focus on safety and quality.`,
        tools: [{ functionDeclarations }]
      },
      history: history || []
    });

    const response = await chat.sendMessage({ message });

    // Return response with function calls if any
    return res.status(200).json({
      text: response.text,
      functionCalls: response.functionCalls || [],
      candidates: response.candidates
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenAI({ apiKey });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { roomImageBase64, productImage, prompt, productName, productDimensions, colorName } = req.body;

    if (!roomImageBase64 || !prompt || !productName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ai = getAI();

    const fullPrompt = `
You are an expert interior design assistant for NOVATRA.
Task: Edit the user's provided room image.
Action: Place the specified product into the room image realistically.

Product Details:
- Name: ${productName}
- Color: ${colorName || 'default'}
- Dimensions: ${productDimensions || 'standard'}

User's Instruction: "${prompt}"

Instructions for you:
1. Analyze the user's room image for perspective, lighting, and scale.
2. Use the clean product image as a reference for the item to be placed.
3. Place the ${productName} in the ${colorName || 'default'} color into the room according to the user's instruction.
4. Ensure the placed product matches the room's lighting, shadows, and perspective perfectly. The scale must be realistic based on the product's dimensions (${productDimensions || 'standard'}) and other objects in the room.
5. Do NOT add any other objects or text. Only return the edited image.
6. If the user's prompt is unclear, make a reasonable assumption (e.g., place it in the most logical empty space).
    `;

    const roomImagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: roomImageBase64,
      },
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [roomImagePart, { text: fullPrompt }] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return res.status(200).json({ image: part.inlineData.data });
      }
    }

    throw new Error('No image data in API response');

  } catch (error) {
    console.error('Gemini Image API error:', error);
    return res.status(500).json({
      error: 'Failed to generate room preview',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

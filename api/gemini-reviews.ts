import type { VercelRequest, VercelResponse} from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  authorName: string;
  date: string;
}

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
    const { reviews } = req.body;

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ pros: [], cons: [] });
    }

    const reviewsText = reviews.map((r: Review) =>
      `Rating: ${r.rating}/5\nTitle: ${r.title}\nComment: ${r.comment}`
    ).join('\n---\n');

    const prompt = `You are a helpful product review analyst for a baby furniture store. Based on the following customer reviews, please provide a concise summary of the main pros and cons.

Here are the reviews:
${reviewsText}

Please provide the output as a JSON object with two keys: "pros" and "cons". Each key should contain an array of strings, where each string is a distinct positive or negative point mentioned by customers. Focus on the most common themes. If there are no clear pros or cons, return an empty array for the respective key.`;

    const ai = getAI();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A list of positive points or advantages mentioned in the reviews.'
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A list of negative points or disadvantages mentioned in the reviews.'
            }
          },
          required: ['pros', 'cons']
        }
      }
    });

    const jsonStr = response.text.trim();
    const summary = JSON.parse(jsonStr);

    return res.status(200).json(summary);

  } catch (error) {
    console.error('Gemini Review Summary API error:', error);
    return res.status(500).json({
      error: 'Failed to summarize reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

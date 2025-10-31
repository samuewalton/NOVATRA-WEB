
import { GoogleGenAI, Chat, Modality, GenerateContentResponse, Type } from "@google/genai";
import type { Review } from '../types.ts';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSpeechFromText(text: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data in API response.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Gemini TTS API error:", error);
        return "";
    }
}

export async function generateRoomPreview(
    roomImageBase64: string,
    productImage: string,
    prompt: string,
    productName: string,
    productDimensions: string,
    colorName: string
): Promise<string> {
    try {
        const fullPrompt = `
            You are an expert interior design assistant for NOVATRA.
            Task: Edit the user's provided room image.
            Action: Place the specified product into the room image realistically.
            
            Product Details:
            - Name: ${productName}
            - Color: ${colorName}
            - Dimensions: ${productDimensions}
            
            User's Instruction: "${prompt}"

            Instructions for you:
            1.  Analyze the user's room image for perspective, lighting, and scale.
            2.  Use the clean product image as a reference for the item to be placed.
            3.  Place the ${productName} in the ${colorName} color into the room according to the user's instruction.
            4.  Ensure the placed product matches the room's lighting, shadows, and perspective perfectly. The scale must be realistic based on the product's dimensions (${productDimensions}) and other objects in the room.
            5.  Do NOT add any other objects or text. Only return the edited image.
            6.  If the user's prompt is unclear, make a reasonable assumption (e.g., place it in the most logical empty space).
        `;

        const roomImagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: roomImageBase64,
            },
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            // FIX: Updated deprecated model 'gemini-1.5-flash-image' to 'gemini-2.5-flash-image'.
            model: 'gemini-2.5-flash-image',
            contents: { parts: [roomImagePart, { text: fullPrompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data in API response.");

    } catch (error) {
        console.error("Gemini Image Editing API error:", error);
        throw new Error("Failed to generate room preview.");
    }
}

export async function summarizeReviews(reviews: Review[]): Promise<{ pros: string[]; cons: string[] }> {
    if (reviews.length === 0) {
        return { pros: [], cons: [] };
    }

    const reviewsText = reviews.map(r => `Rating: ${r.rating}/5\nTitle: ${r.title}\nComment: ${r.comment}`).join('\n---\n');

    const prompt = `You are a helpful product review analyst for a baby furniture store. Based on the following customer reviews, please provide a concise summary of the main pros and cons.

Here are the reviews:
${reviewsText}

Please provide the output as a JSON object with two keys: "pros" and "cons". Each key should contain an array of strings, where each string is a distinct positive or negative point mentioned by customers. Focus on the most common themes. If there are no clear pros or cons, return an empty array for the respective key.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        pros: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of positive points or advantages mentioned in the reviews."
                        },
                        cons: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of negative points or disadvantages mentioned in the reviews."
                        }
                    },
                    required: ["pros", "cons"]
                }
            }
        });

        const jsonStr = response.text.trim();
        const summary = JSON.parse(jsonStr);
        return summary;
    } catch (error) {
        console.error("Gemini Review Summary API error:", error);
        throw new Error("Failed to summarize reviews.");
    }
}

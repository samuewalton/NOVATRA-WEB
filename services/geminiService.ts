
import type { Review } from '../types.ts';

// All Gemini API calls now go through Vercel serverless functions
// to keep the API key secure server-side

export async function generateSpeechFromText(text: string): Promise<string> {
    try {
        const response = await fetch('/api/gemini-tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.audio || '';
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
        const response = await fetch('/api/gemini-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomImageBase64,
                productImage,
                prompt,
                productName,
                productDimensions,
                colorName
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.image) {
            throw new Error("No image data in API response");
        }

        return data.image;
    } catch (error) {
        console.error("Gemini Image Editing API error:", error);
        throw new Error("Failed to generate room preview.");
    }
}

export async function summarizeReviews(reviews: Review[]): Promise<{ pros: string[]; cons: string[] }> {
    if (reviews.length === 0) {
        return { pros: [], cons: [] };
    }

    try {
        const response = await fetch('/api/gemini-reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviews })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const summary = await response.json();
        return summary;
    } catch (error) {
        console.error("Gemini Review Summary API error:", error);
        throw new Error("Failed to summarize reviews.");
    }
}

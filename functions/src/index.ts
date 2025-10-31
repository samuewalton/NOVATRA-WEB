import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

admin.initializeApp();

const corsHandler = cors({origin: true});

/**
 * Gemini API Proxy Function
 *
 * This function acts as a secure proxy between the frontend and Google's Gemini API.
 * It prevents API key exposure by keeping the key on the backend.
 *
 * Environment Variables Required:
 * - GEMINI_API_KEY: Your Google Gemini API key
 *
 * Usage:
 * POST /api/gemini
 * Body: {
 *   endpoint: string,  // The Gemini API endpoint (e.g., 'generateContent', 'streamGenerateContent')
 *   model: string,     // The model to use (e.g., 'gemini-2.5-pro', 'gemini-2.5-flash')
 *   payload: object    // The request payload to send to Gemini
 * }
 */
export const geminiProxy = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    // Only allow POST requests
    if (request.method !== "POST") {
      response.status(405).json({error: "Method not allowed. Use POST."});
      return;
    }

    // Get API key from Firebase Functions config
    const apiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key;

    if (!apiKey) {
      functions.logger.error("GEMINI_API_KEY not configured");
      response.status(500).json({
        error: "Server configuration error. Please contact administrator.",
      });
      return;
    }

    try {
      const {endpoint, model, payload} = request.body;

      // Validate required fields
      if (!endpoint || !model || !payload) {
        response.status(400).json({
          error: "Missing required fields: endpoint, model, and payload are required.",
        });
        return;
      }

      // Construct the Gemini API URL
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${apiKey}`;

      functions.logger.info(`Proxying request to Gemini API: ${model}:${endpoint}`);

      // Forward the request to Gemini API
      const fetch = (await import("node-fetch")).default;
      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await geminiResponse.json();

      // Check if Gemini API returned an error
      if (!geminiResponse.ok) {
        functions.logger.error("Gemini API error:", responseData);
        response.status(geminiResponse.status).json({
          error: "Gemini API error",
          details: responseData,
        });
        return;
      }

      // Return the successful response
      response.status(200).json(responseData);
    } catch (error) {
      functions.logger.error("Proxy error:", error);
      response.status(500).json({
        error: "Internal server error while proxying request.",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
});

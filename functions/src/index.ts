import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

admin.initializeApp();

const corsHandler = cors({origin: true});

// This is the Gemini API proxy function.
// The actual implementation will be added in the next step per the plan.
export const geminiProxy = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    // TODO: Verify auth, call Gemini, return response
    response.status(501).json({error: "Gemini proxy not implemented yet."});
  });
});

// pages/api/chat.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export default async function handler(req, res) {
  // 1) require a valid session
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method !== "POST")
    return res.status(405).json({ error: "Must POST" });

  const { model, message } = req.body;
  if (!model || !message)
    return res.status(400).json({ error: "Missing model or message" });

  try {
    const result = await hf.textGeneration({
      model,
      inputs: message,
    });
    return res.status(200).json({ text: result.generated_text });
  } catch (error) {
    console.error("HuggingFace error:", error);
    return res.status(500).json({ error: "Error contacting model" });
  }
}

// pages/api/chat.js
import { getServerSession } from "next-auth/next";
import { authOptions }     from "./auth/[...nextauth]";
import { HfInference }     from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export default async function handler(req, res) {
  // ← this will read the same __Secure-next-auth.session-token cookie
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { model, prompt } = req.body;
  try {
    const output = await hf.textGeneration({
      model,
      inputs: prompt,
    });
    return res.json({ text: output.generated_text });
  } catch (e) {
    console.error("HF error:", e);
    return res.status(500).json({ error: "generation_error" });
  }
}

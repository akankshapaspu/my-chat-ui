import { getServerSession } from "next-auth/next";
import { authOptions }     from "./auth/[...nextauth]";
import { HfInference }      from "@huggingface/inference";

export default async function handler(req, res) {
  // 1) ensure only POST
  if (req.method !== "POST") {
    return res.setHeader("Allow", "POST").status(405).end();
  }

  // 2) verify user is signed in
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { model, question } = req.body;
  if (!model || !question) {
    return res.status(400).json({ error: "Missing model or question" });
  }

  try {
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    const result = await hf.textGeneration({
      model,
      inputs: question,
      parameters: { max_new_tokens: 128 },
    });

    return res.status(200).json({ text: result.generated_text });
  } catch (e) {
    console.error("❌ error calling HF:", e);
    return res.status(500).json({ error: "Model request failed" });
  }
}

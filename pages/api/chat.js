import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Not signed in" });
  }

  const { care, prompt } = req.body;
  if (!care || !prompt) {
    return res.status(400).json({ error: "Missing care or prompt" });
  }

  try {
    const hfRes = await fetch(process.env.HF_INFERENCE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: care,
        inputs: prompt,
      }),
    });

    if (!hfRes.ok) {
      const text = await hfRes.text();
      return res.status(500).json({ error: text });
    }

    const json = await hfRes.json();
    return res.status(200).json({ text: json.generated_text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

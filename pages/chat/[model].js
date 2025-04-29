// pages/api/chat/[...model].js
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
  // 1️⃣ extract the slug array from the URL, e.g.
  //    ["Akanksha17","healthcare-postop-model"]
  const { model } = req.query;
  const slug = Array.isArray(model) ? model.join("/") : model;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    // 2️⃣ hit the shared HF Inference API with your single HF token
    const hfRes = await fetch(
      `https://api-inference.huggingface.co/models/${slug}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    if (!hfRes.ok) {
      const err = await hfRes.json().catch(() => ({}));
      return res
        .status(hfRes.status)
        .json({ error: err.error || "Model inference failed" });
    }

    const data = await hfRes.json();
    // most text models return [ { generated_text: "…" } ]
    const text = Array.isArray(data)
      ? data[0]?.generated_text
      : data.generated_text || JSON.stringify(data);

    return res.status(200).json({ text });
  } catch (e) {
    console.error("HuggingFace error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

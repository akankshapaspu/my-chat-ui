// File: /pages/api/chat.js

import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  // 1) must be signed in
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Not signed in" });
  }

  // 2) pull the care‐option (one of "preop","postop","chronic","assisted")
  const { care, prompt } = req.body;
  if (!care || !prompt) {
    return res.status(400).json({ error: "Missing care or prompt" });
  }

  // 3) forward to your single HF inference endpoint,
  //    passing the care‐option as a path or body param
  const hfRes = await fetch(`${process.env.HF_INFERENCE_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // either your endpoint expects model= or route‐prefix,
      // adjust to what your endpoint needs:
      model: care,
      inputs: prompt,
    }),
  });

  if (!hfRes.ok) {
    const text = await hfRes.text();
    return res.status(500).json({ error: text });
  }
  const json = await hfRes.json();
  // assume json.generated_text
  return res.status(200).json({ text: json.generated_text });
}

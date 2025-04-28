import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ error: "Not signed in" })

  const { model, prompt } = req.body
  const hfRes = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 200 } }),
    }
  )
  const json = await hfRes.json()
  res.status(200).json({ text: json.generated_text || json.error || "" })
}

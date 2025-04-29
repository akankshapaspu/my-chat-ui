// File: pages/api/chat.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { HfInference } from '@huggingface/inference'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  // Ensure user is signed in
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { model, messages } = req.body
  if (!model || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing model or messages' })
  }

  console.log('🛰️ Chat request for model:', model)

  try {
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

    // 1) Retrieve relevant docs (replace fakeRetrieve with your vector-DB call)
    const lastUser = messages[messages.length - 1].content
    const docs = await fakeRetrieve(lastUser)        // => [ "doc1…", "doc2…" ]
    const context = docs.join('\n\n')

    // 2) Build RAG prompt
    const prompt = `
You are a ${model} RAG assistant.

Context:
${context}

Question:
${lastUser}
`

    // 3) Generate
    const result = await hf.textGeneration({
      model,
      inputs: prompt,
      parameters: { max_new_tokens: 256, temperature: 0.7 }
    })

    return res.status(200).json({ text: result.generated_text })
  } catch (e) {
    console.error('❌ error calling HF:', e)
    return res.status(500).json({ error: 'Model request failed' })
  }
}

// Stub—swap in your real vector store retrieval logic
async function fakeRetrieve(query) {
  // e.g. Pinecone, Weaviate, etc.
  return [`<Here would be your retrieved snippet for "${query}">`]
}

// File: pages/chat/[model].js
import { useState, useMemo } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function ModelChat() {
  const { data: session } = useSession()
  const router = useRouter()

  // Decode the URL-encoded slug back into "owner/repo-name"
  const { model: encoded } = router.query
  const model = useMemo(() => {
    if (!encoded) return ''
    const raw = Array.isArray(encoded) ? encoded[0] : encoded
    return decodeURIComponent(raw)
  }, [encoded])

  const [messages, setMessages] = useState([])

  const send = async text => {
    if (!session) {
      alert('Please sign in first')
      return
    }
    const newMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, newMsg])

    try {
      const { data } = await axios.post(
        '/api/chat',
        { model, messages: [...messages, newMsg] },
        { withCredentials: true }
      )
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.text }
      ])
    } catch (err) {
      console.error(err)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Error contacting model.' }
      ])
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🤖 Chatbot: {model || 'Loading…'}</h1>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          height: '60vh',
          overflowY: 'auto',
          marginBottom: '1rem'
        }}
      >
        {messages.map((m, i) => (
          <p key={i}>
            <strong>
              {m.role === 'user' ? 'User' : 'Assistant'}:
            </strong>{' '}
            {m.content}
          </p>
        ))}
      </div>

      <form
        onSubmit={e => {
          e.preventDefault()
          const text = e.target.elements.msg.value.trim()
          if (text) {
            send(text)
            e.target.reset()
          }
        }}
      >
        <input
          name="msg"
          placeholder="Type your question…"
          style={{
            width: '80%',
            padding: '.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px 0 0 4px'
          }}
        />
        <button
          type="submit"
          style={{
            width: '18%',
            padding: '.5rem',
            border: '1px solid #0070f3',
            background: '#0070f3',
            color: 'white',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  )
}

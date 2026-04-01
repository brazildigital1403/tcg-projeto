'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ReceberPage() {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [city, setCity] = useState('')
  const [needs, setNeeds] = useState('')
  const [type, setType] = useState('beginner')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: any) {
  e.preventDefault()
  setLoading(true)

  /* INSERT */
  const {
  data: { user },
} = await supabase.auth.getUser()

const { data, error } = await supabase
  .from('receiving_requests')
  .insert({
    user_id: user?.id,
    type: 'cards',
    quantity: 1,
    name,
    whatsapp,
  })

  console.log('DATA:', data)
  console.log('ERROR:', error)

  if (error) {
    alert(error.message)
  } else {
    setSuccess(true)
    setName('')
    setWhatsapp('')
    setCity('')
    setNeeds('')
    setType('beginner')
  }

  setLoading(false)
}

  return (
    <div style={styles.page}>

      {/* BLOCO EMOCIONAL */}
      <div style={styles.hero}>
        <div style={styles.icon}>🎁</div>
        <h1 style={styles.title}>
          Você não precisa começar sozinho
        </h1>
        <p style={styles.subtitle}>
          Tem gente que pode te ajudar com as primeiras cartas. Conta um pouco do que você precisa.
        </p>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        {success && (
          <p style={styles.success}>
            Pedido enviado! 💛
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* NOME */}
          <div style={styles.field}>
            <label style={styles.label}>Seu nome</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* WHATS */}
          <div style={styles.field}>
            <label style={styles.label}>WhatsApp</label>
            <input
              style={styles.input}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
          </div>

          {/* CIDADE */}
          <div style={styles.field}>
            <label style={styles.label}>Cidade</label>
            <input
              style={styles.input}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          {/* NÍVEL */}
          <div style={styles.field}>
            <label style={styles.label}>Seu nível</label>
            <select
              style={styles.input}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="beginner">Iniciante</option>
              <option value="casual">Casual</option>
              <option value="competitivo">Competitivo</option>
            </select>
          </div>

          {/* NECESSIDADE */}
          <div style={styles.field}>
            <label style={styles.label}>O que você precisa?</label>
            <textarea
              style={styles.textarea}
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              required
            />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Enviando...' : 'Quero receber'}
          </button>

          {/* MICRO TEXTO */}
          <p style={styles.helper}>
            A gente vai analisar seu pedido e te conectar com alguém.
          </p>

        </form>
      </div>

    </div>
  )
}

/* ================= STYLES ================= */

const styles: any = {
  page: {
    maxWidth: 520,
    margin: '40px auto',
    padding: '0 16px',
    fontFamily: 'sans-serif',
  },

  hero: {
    textAlign: 'center',
    marginBottom: 32,
  },

  icon: {
    fontSize: 32,
    marginBottom: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
  },

  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
  },

  success: {
    color: 'green',
    marginBottom: 16,
    textAlign: 'center',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
    color: '#444',
  },

  input: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #ddd',
    fontSize: 14,
  },

  textarea: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #ddd',
    fontSize: 14,
    minHeight: 80,
    resize: 'vertical',
  },

  button: {
    marginTop: 8,
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: '#000',
    color: '#fff',
    fontSize: 15,
    cursor: 'pointer',
  },

  helper: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
}
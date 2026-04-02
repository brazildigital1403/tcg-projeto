'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Depoimentos() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    text: '',
    author: '',
    role: '',
    customRole: '',
  })

  const roleOptions = [
    'Família',
    'Educador',
    'Aluno',
    'Coordenador',
    'Voluntário',
    'Outro',
  ]

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    setList(data || [])
    setLoading(false)
  }

  async function create() {
    if (!form.text) return

    const finalRole = form.role === 'Outro' ? form.customRole : form.role

    await supabase.from('testimonials').insert([
      {
        text: form.text,
        author: form.author,
        role: finalRole,
      }
    ])

    setForm({ text: '', author: '', role: '', customRole: '' })
    fetchData()
  }

  async function remove(id: string) {
    await supabase.from('testimonials').delete().eq('id', id)
    fetchData()
  }

  if (loading) return <p style={{ padding: 40 }}>Carregando...</p>

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Depoimentos</h1>

      {/* FORM */}
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Autor"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <select
          style={styles.input}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Selecione o tipo</option>
          {roleOptions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {form.role === 'Outro' && (
          <input
            style={styles.input}
            placeholder="Digite o tipo"
            value={form.customRole}
            onChange={(e) => setForm({ ...form, customRole: e.target.value })}
          />
        )}

        <textarea
          style={styles.textarea}
          placeholder="Texto do depoimento"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
        />

        <button onClick={create} style={styles.button}>Salvar</button>
      </div>

      {/* LISTA */}
      <div style={styles.list}>
        {list.map((t) => (
          <div key={t.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.avatar}>
                {t.author ? t.author.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <p style={styles.metaStrong}>{t.author}</p>
                <p style={styles.meta}>{t.role}</p>
              </div>
            </div>
            <p style={styles.text}>{t.text}</p>
            <div style={styles.actions}>
              <button
                onClick={() => navigator.clipboard.writeText(t.text)}
                style={styles.copyButton}
              >
                Copiar
              </button>
              <button onClick={() => remove(t.id)} style={styles.removeButton}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: any = {
  page: {
    maxWidth: 1000,
    margin: '40px auto',
    padding: '0 16px',
    fontFamily: 'sans-serif',
  },

  title: {
    fontSize: 26,
    fontWeight: 600,
    marginBottom: 24,
  },

  form: {
    background: '#fff',
    padding: 20,
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 30,
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
    minHeight: 120,
    resize: 'vertical',
  },

  button: {
    padding: '12px',
    borderRadius: 12,
    border: 'none',
    background: '#000',
    color: '#fff',
    cursor: 'pointer',
  },

  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },

  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  },

  text: {
    fontSize: 14,
    lineHeight: 1.4,
  },

  meta: {
    fontSize: 12,
    color: '#666',
  },

  removeButton: {
    marginTop: 10,
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#000',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
  },

  metaStrong: {
    fontSize: 13,
    fontWeight: 600,
  },

  actions: {
    display: 'flex',
    gap: 8,
    marginTop: 10,
  },

  copyButton: {
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid #ddd',
    background: '#f5f5f5',
    cursor: 'pointer',
  },
}
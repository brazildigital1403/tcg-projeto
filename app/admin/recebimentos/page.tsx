'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Recebimentos() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    setLoading(true)

    const { data, error } = await supabase
      .from('receiving_requests')
      .select(`
        *,
        profiles (
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro:', error)
    } else {
      setRequests(data || [])
    }

    setLoading(false)
  }

  // 🔥 contador por usuário
  function getUserCount(userId: string) {
    return requests.filter((r) => r.user_id === userId).length
  }

  if (loading) return <p style={{ padding: 40 }}>Carregando...</p>

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Recebimentos</h1>
      <p style={styles.subtitle}>
        Pessoas que estão pedindo cartas
      </p>

      <div style={styles.list}>
        {requests.map((r) => {
          const count = getUserCount(r.user_id)
          const isAbuse = count > 3

          return (
            <div key={r.id} style={styles.card}>

              {/* TOPO */}
              <div style={styles.top}>
                <div>
                  <p style={styles.name}>
                    {r.name || 'Sem nome'}
                  </p>

                  <p style={styles.email}>
                    {r.profiles?.email || 'Sem email'}
                  </p>
                </div>

                <span style={styles.badge}>
                  {r.status}
                </span>
              </div>

              {/* INFO */}
              <div style={styles.info}>
                <p><strong>WhatsApp:</strong> {r.whatsapp || '—'}</p>
                <p><strong>Quantidade:</strong> {r.quantity}</p>
                <p><strong>Tipo:</strong> {r.type}</p>

                <p>
                  <strong>Pedidos desse usuário:</strong> {count}
                </p>

                {isAbuse && (
                  <p style={styles.alert}>
                    ⚠️ Usuário recorrente (possível abuso)
                  </p>
                )}

                <p>
                  <strong>Data:</strong>{' '}
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ================= STYLES ================= */

const styles: any = {
  page: {
    maxWidth: 900,
    margin: '40px auto',
    padding: '0 16px',
    fontFamily: 'sans-serif',
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
    border: '1px solid #eee',
  },

  top: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: 600,
  },

  email: {
    fontSize: 12,
    color: '#666',
  },

  badge: {
    fontSize: 12,
    background: '#eee',
    padding: '6px 12px',
    borderRadius: 999,
  },

  info: {
    fontSize: 13,
    color: '#444',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  alert: {
    marginTop: 6,
    color: '#b00020',
    fontWeight: 600,
  },
}
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Matches() {
  const [matches, setMatches] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)

    const { data: matchesData } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, email')

    const map: any = {}
    profilesData?.forEach((p) => {
      map[p.id] = p.email
    })

    setProfiles(map)
    setMatches(matchesData || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', id)

    if (!error) fetchData()
  }

  function getStatusStyle(status: string) {
    if (status === 'approved') {
      return {
        background: '#d4f5dc',
        color: '#1a7f37',
      }
    }

    if (status === 'pending') {
      return {
        background: '#fff3cd',
        color: '#8a6d3b',
      }
    }

    if (status === 'cancelled') {
      return {
        background: '#f8d7da',
        color: '#842029',
      }
    }

    return {
      background: '#eee',
      color: '#555',
    }
  }

  if (loading) return <p style={{ padding: 40 }}>Carregando...</p>

  return (
    <div style={styles.page}>
      
      {/* TOPO */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Matches</h1>
        <p style={styles.subtitle}>
          Conexões entre quem doou e quem recebeu.
        </p>
      </div>

      {/* LISTA */}
      <div style={styles.list}>
        {matches.map((m) => (
          <div key={m.id} style={styles.card}>

            {/* STATUS */}
            <div style={styles.rowTop}>
              <span
                style={{
                  ...styles.badge,
                  ...getStatusStyle(m.status),
                }}
              >
                {m.status}
              </span>
            </div>

            {/* CONEXÃO */}
            <div style={styles.connection}>
              
              <div style={styles.userBlock}>
                <p style={styles.userLabel}>Doador</p>
                <p style={styles.userName}>
                  {profiles[m.donor_id] || '—'}
                </p>
              </div>

              <div style={styles.arrow}>→</div>

              <div style={styles.userBlock}>
                <p style={styles.userLabel}>Recebedor</p>
                <p style={styles.userName}>
                  {profiles[m.receiver_id] || '—'}
                </p>
              </div>

            </div>

            {/* AÇÕES */}
            <div style={styles.actions}>
              <button
                onClick={() => updateStatus(m.id, 'approved')}
                style={styles.button}
              >
                Aprovar
              </button>

              <button
                onClick={() => updateStatus(m.id, 'cancelled')}
                style={styles.buttonSecondary}
              >
                Cancelar
              </button>
            </div>

          </div>
        ))}

        {matches.length === 0 && (
          <p style={{ color: '#777' }}>
            Nenhum match ainda.
          </p>
        )}
      </div>
    </div>
  )
}

/* ================= STYLES ================= */

const styles: any = {
  page: {
    maxWidth: 800,
    margin: '40px auto',
    padding: '0 16px',
    fontFamily: 'sans-serif',
  },

  hero: {
    marginBottom: 32,
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
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
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  rowTop: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  badge: {
    fontSize: 12,
    padding: '4px 10px',
    borderRadius: 999,
  },

  connection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  userBlock: {
    flex: 1,
  },

  userLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },

  userName: {
    fontSize: 15,
    fontWeight: 600,
  },

  arrow: {
    fontSize: 18,
    color: '#999',
  },

  actions: {
    display: 'flex',
    gap: 10,
  },

  button: {
    padding: '8px 14px',
    borderRadius: 10,
    border: 'none',
    background: '#000',
    color: '#fff',
    cursor: 'pointer',
  },

  buttonSecondary: {
    padding: '8px 14px',
    borderRadius: 10,
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
  },
}
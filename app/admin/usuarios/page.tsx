'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Usuarios() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setUsers(data || [])

    setLoading(false)
  }

  async function deleteUser(id: string) {
    const confirmDelete = confirm('Tem certeza?')

    if (!confirmDelete) return

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao deletar')
    } else {
      fetchUsers()
    }
  }

  if (loading) return <p style={{ padding: 40 }}>Carregando...</p>

  return (
    <div style={styles.page}>
      
      {/* TOPO */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Usuários</h1>
        <p style={styles.subtitle}>
          Gerencie quem está na plataforma.
        </p>
      </div>

      {/* LISTA */}
      <div style={styles.list}>
        {users.map((u) => (
          <div key={u.id} style={styles.card}>

            <div style={styles.row}>
              <div>
                <p style={styles.email}>{u.email}</p>
                <p style={styles.id}>{u.id}</p>
              </div>

              <button
                onClick={() => deleteUser(u.id)}
                style={styles.deleteButton}
              >
                Deletar
              </button>
            </div>

          </div>
        ))}
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
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  email: {
    fontSize: 15,
    fontWeight: 500,
  },

  id: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  deleteButton: {
    padding: '8px 14px',
    borderRadius: 10,
    border: 'none',
    background: '#000',
    color: '#fff',
    cursor: 'pointer',
  },
}
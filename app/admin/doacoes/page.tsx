'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDoacoes() {
  const [donations, setDonations] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    setLoading(true)

    const { data: donationsData } = await supabase.from('donations').select('*')
    const { data: requestsData } = await supabase.from('donation_requests').select('*').eq('status', 'open')
    const { data: matchesData } = await supabase.from('donation_matches').select('*')

    setDonations(donationsData || [])
    setRequests(requestsData || [])
    setMatches(matchesData || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  function findBestMatch(donation: any) {
    const sameCity = requests.filter(
      (r) => r.city?.toLowerCase() === donation.city?.toLowerCase()
    )

    if (sameCity.length > 0) return sameCity[0]
    return requests[0]
  }

  async function autoMatch(donation: any) {
    const best = findBestMatch(donation)

    if (!best) {
      alert('Nenhum pedido disponível')
      return
    }

    const { error } = await supabase
      .from('donation_matches')
      .insert([
        {
          donation_id: donation.id,
          request_id: best.id,
        },
      ])

    if (!error) {
      await supabase.from('donations').update({ status: 'matched' }).eq('id', donation.id)
      await supabase.from('donation_requests').update({ status: 'matched' }).eq('id', best.id)

      alert('Match automático criado')
      fetchData()
    }
  }

  if (loading) return <p style={{ padding: 40 }}>Carregando...</p>

  return (
    <div style={styles.page}>
      
      {/* TOPO */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Painel de doações</h1>
        <p style={styles.subtitle}>
          Veja quem enviou cartas e conecte com quem precisa.
        </p>
      </div>

      {/* DOAÇÕES */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Doações</h2>

        <div style={styles.list}>
          {donations.map((d) => (
            <div key={d.id} style={styles.card}>
              
              <div style={styles.row}>
                <div>
                  <p style={styles.name}>
                    {d.name} <span style={styles.city}>• {d.city}</span>
                  </p>
                </div>

                <span
                  style={{
                    ...styles.badge,
                    background: d.status === 'matched' ? '#d4f5dc' : '#f2f2f2',
                    color: d.status === 'matched' ? '#1a7f37' : '#555',
                  }}
                >
                  {d.status}
                </span>
              </div>

              <button
                onClick={() => autoMatch(d)}
                style={styles.button}
              >
                Auto Match
              </button>

            </div>
          ))}
        </div>
      </div>

      {/* MATCHES */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Matches</h2>

        <div style={styles.list}>
          {matches.map((m) => (
            <div key={m.id} style={styles.cardSmall}>
              <div>
                <p style={styles.matchLabel}>ID</p>
                <p style={styles.matchId}>{m.id}</p>
              </div>

              <span style={styles.badge}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
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

  section: {
    marginBottom: 40,
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
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
    gap: 12,
  },

  cardSmall: {
    background: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 15,
    fontWeight: 500,
  },

  city: {
    fontSize: 13,
    color: '#777',
  },

  badge: {
    fontSize: 12,
    padding: '4px 10px',
    borderRadius: 999,
    background: '#eee',
  },

  button: {
    marginTop: 8,
    padding: '10px',
    borderRadius: 10,
    border: 'none',
    background: '#000',
    color: '#fff',
    cursor: 'pointer',
  },

  matchLabel: {
    fontSize: 11,
    color: '#888',
  },

  matchId: {
    fontSize: 13,
    color: '#333',
  },
}
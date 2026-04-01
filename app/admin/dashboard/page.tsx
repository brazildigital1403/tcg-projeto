'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    donations: 0,
    matches: 0,
    transactions: 0,
  })

  async function loadStats() {
    const { count: donations } = await supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })

    const { count: matches } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })

    const { count: transactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })

    setStats({
      donations: donations || 0,
      matches: matches || 0,
      transactions: transactions || 0,
    })
  }

  useEffect(() => {
    loadStats()
  }, [])

  const total = stats.donations + stats.matches + stats.transactions

  return (
    <div style={styles.page}>
      
      <div style={styles.hero}>
        <h1 style={styles.title}>Visão geral</h1>
        <p style={styles.subtitle}>
          Acompanhe o que está acontecendo agora.
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Doações</p>
          <p style={styles.cardValue}>{stats.donations}</p>
        </div>

        <div style={styles.card}>
          <p style={styles.cardLabel}>Matches</p>
          <p style={styles.cardValue}>{stats.matches}</p>
        </div>

        <div style={styles.card}>
          <p style={styles.cardLabel}>Transações</p>
          <p style={styles.cardValue}>{stats.transactions}</p>
        </div>
      </div>

      <div style={styles.chartCard}>
        <p style={styles.chartTitle}>Distribuição</p>

        <div style={styles.bar}>
          <div
            style={{
              ...styles.barSegment,
              width: total ? `${(stats.donations / total) * 100}%` : '0%',
              background: '#000',
            }}
          />
          <div
            style={{
              ...styles.barSegment,
              width: total ? `${(stats.matches / total) * 100}%` : '0%',
              background: '#bbb',
            }}
          />
          <div
            style={{
              ...styles.barSegment,
              width: total ? `${(stats.transactions / total) * 100}%` : '0%',
              background: '#ddd',
            }}
          />
        </div>

        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <span style={{ ...styles.dot, background: '#000' }} />
            Doações
          </div>

          <div style={styles.legendItem}>
            <span style={{ ...styles.dot, background: '#bbb' }} />
            Matches
          </div>

          <div style={styles.legendItem}>
            <span style={{ ...styles.dot, background: '#ddd' }} />
            Transações
          </div>
        </div>
      </div>

    </div>
  )
}

/* ================= STYLES ================= */

const styles: any = {
  page: {
    maxWidth: 700,
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  cardLabel: {
    fontSize: 13,
    color: '#777',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 600,
  },
  chartCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
  },
  chartTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  bar: {
    display: 'flex',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
    background: '#eee',
  },
  barSegment: {
    height: '100%',
  },
  legend: {
    display: 'flex',
    gap: 16,
    fontSize: 12,
    color: '#555',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
}
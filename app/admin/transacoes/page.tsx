'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Transacoes() {
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setTransactions(data || [])
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('Erro ao atualizar')
    } else {
      fetchTransactions()
    }
  }

  return (
    <div>
      <h1>Transações</h1>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuário</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.user_id}</td>
              <td>R$ {t.amount}</td>
              <td>{t.status}</td>
              <td>
                <button onClick={() => updateStatus(t.id, 'approved')}>
                  Aprovar
                </button>

                <button onClick={() => updateStatus(t.id, 'rejected')}>
                  Rejeitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
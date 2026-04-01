'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const menu = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Doações', path: '/admin/doacoes' },
    { name: 'Recebimentos', path: '/admin/recebimentos' },
    { name: 'Matches', path: '/admin/matches' },
    { name: 'Cartas', path: '/admin/cartas' },
    { name: 'Transações', path: '/admin/transacoes' },
    { name: 'Usuários', path: '/admin/usuarios' },
    { name: 'Configurações', path: '/admin/configuracoes' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#111', color: '#fff', padding: 20 }}>
        <h2 style={{ marginBottom: 20 }}>TCG Admin</h2>

        {menu.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              style={{
                padding: '10px 0',
                cursor: 'pointer',
                opacity: pathname === item.path ? 1 : 0.6,
                fontWeight: pathname === item.path ? 'bold' : 'normal'
              }}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import PackGallery from './[id]/PackGallery'

export default function Pacotes() {
  const [Pacotes, setPacotes] = useState<any[]>([])
  const [selectedPack, setSelectedPack] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)

  const [nome, setNome] = useState('')
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [loadingReview, setLoadingReview] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('Pacotes').select('*')
      setPacotes(data || [])
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedPack) return

    async function loadReviews() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('pack_id', selectedPack.id)
        .order('created_at', { ascending: false })

      setReviews(data || [])
    }

    loadReviews()
    setShowAllReviews(false)
  }, [selectedPack])

  useEffect(() => {
    function handleEsc(e: any) {
      if (e.key === 'Escape') setSelectedPack(null)
    }

    if (selectedPack) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEsc)
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => window.removeEventListener('keydown', handleEsc)
  }, [selectedPack])

  const media =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.nota, 0) / reviews.length
      : 0

  const visibleReviews = showAllReviews
    ? reviews
    : reviews.slice(0, 3)

  async function enviarReview() {
    if (!nome || !comentario) return

    setLoadingReview(true)

    await supabase.from('reviews').insert([
      {
        nome,
        nota,
        comentario,
        pack_id: selectedPack.id
      }
    ])

    setNome('')
    setComentario('')
    setNota(5)
    setLoadingReview(false)

    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('pack_id', selectedPack.id)
      .order('created_at', { ascending: false })

    setReviews(data || [])
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          Pacotes disponíveis
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Pacotes.map((pack) => (
            <motion.div
              key={pack.id}
              layoutId={`card-${pack.id}`}
              onClick={() => setSelectedPack(pack)}
              className="relative cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 md:p-4"
            >

              {pack.mais_vendido && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                  🔥 Mais vendido
                </div>
              )}

              <motion.div
                layoutId={`image-${pack.id}`}
                className="w-full h-32 md:h-40 bg-zinc-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden"
              >
                {pack.imagens?.[0] && (
                  <img src={pack.imagens[0]} className="max-h-full object-contain" />
                )}
              </motion.div>

              <h2 className="text-sm md:text-lg font-medium">{pack.nome}</h2>
              <p className="text-xs text-zinc-500">{pack.quantidade_cartas} cartas</p>
              <p className="font-semibold mt-2">R$ {pack.preco}</p>
            </motion.div>
          ))}
        </div>

        {/* MODAL */}
<AnimatePresence>
  {selectedPack && (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-[9999]"
      onClick={() => setSelectedPack(null)}
    >
      <motion.div
        layoutId={`card-${selectedPack.id}`}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="bg-white w-full md:max-w-5xl h-[100dvh] md:h-[90vh] rounded-t-2xl md:rounded-xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* X DESKTOP */}
        <button
          onClick={() => setSelectedPack(null)}
          className="hidden md:flex absolute top-4 right-4 z-50 bg-white/90 rounded-full w-10 h-10 items-center justify-center shadow"
        >
          ✕
        </button>

        {/* MOBILE HEADER */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <p className="font-medium">{selectedPack.nome}</p>
          <button onClick={() => setSelectedPack(null)}>✕</button>
        </div>

        {/* GRID */}
        <div className="flex-1 grid md:grid-cols-2 overflow-hidden">

          {/* ESQUERDA */}
          <div className="p-4 md:p-6 flex justify-center items-start">
            <div className="w-full max-w-md">
              <PackGallery imagens={selectedPack.imagens} />
            </div>
          </div>

          {/* DIREITA */}
          <div className="flex flex-col h-full overflow-hidden">

            {/* SCROLL REAL */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

              <div>
                <h1 className="text-2xl font-semibold">
                  {selectedPack.nome}
                </h1>

                {reviews.length > 0 && (
                  <p className="text-yellow-500 mt-2">
                    ⭐ {media.toFixed(1)} ({reviews.length})
                  </p>
                )}

                <p className="mt-2 text-zinc-600">
                  {selectedPack.descricao}
                </p>

                <p className="text-sm mt-2 text-zinc-500">
                  {selectedPack.quantidade_cartas} cartas
                </p>

                <p className="text-2xl font-bold mt-4">
                  R$ {selectedPack.preco}
                </p>

                <p className="text-red-500 text-sm mt-2">
                  Restam apenas {selectedPack.estoque} unidades
                </p>

                <p className="text-xs text-zinc-500">
                  {Math.floor(Math.random() * 5) + 3} pessoas vendo agora
                </p>
              </div>

              {/* FORM */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Deixe sua avaliação</h3>

                <input
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />

                <select
                  value={nota}
                  onChange={(e) => setNota(Number(e.target.value))}
                  className="w-full border p-2 rounded mb-2"
                >
                  {[5,4,3,2,1].map(n => (
                    <option key={n} value={n}>{n} estrelas</option>
                  ))}
                </select>

                <textarea
                  placeholder="Comentário"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />

                <button
                  onClick={enviarReview}
                  className="w-full bg-black text-white py-2 rounded"
                >
                  {loadingReview ? 'Enviando...' : 'Enviar avaliação'}
                </button>
              </div>

              {/* REVIEWS */}
              <div>
                {visibleReviews.map((r, i) => (
                  <div key={r.id} className="border-b pb-2 mb-2">
                    <p>{r.nome}</p>

                    {i === 0 && (
                      <span className="text-green-600 text-xs">
                        ⭐ Mais útil
                      </span>
                    )}

                    <p className="text-yellow-500 text-sm">
                      {'★'.repeat(r.nota)}
                      {'☆'.repeat(5 - r.nota)}
                    </p>

                    <p>{r.comentario}</p>
                  </div>
                ))}

                {reviews.length > 3 && (
                  <button onClick={() => setShowAllReviews(!showAllReviews)}>
                    {showAllReviews ? 'Ver menos' : 'Ver mais'}
                  </button>
                )}
              </div>

            </div>

            {/* BOTÃO */}
            <div className="border-t p-4 bg-white">
              <a
                href={selectedPack.link_pagamento}
                target="_blank"
                className="block text-center bg-black text-white py-3 rounded-xl"
              >
                Garantir meu pack
              </a>
            </div>

          </div>

        </div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </div>
  )
}
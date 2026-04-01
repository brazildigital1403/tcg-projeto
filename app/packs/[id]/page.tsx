'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import PackGallery from './PackGallery'

export default function Pacotes() {
  const [Pacotes, setPacotes] = useState<any[]>([])
  const [selectedPack, setSelectedPack] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('Pacotes').select('*')
      setPacotes(data || [])
    }

    load()
  }, [])

  // ESC + SCROLL LOCK
  useEffect(() => {
    function handleEsc(e: any) {
      if (e.key === 'Escape') {
        setSelectedPack(null)
      }
    }

    if (selectedPack) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEsc)
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [selectedPack])

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
              className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 md:p-4"
            >
              <motion.div
                layoutId={`image-${pack.id}`}
                className="w-full h-32 md:h-40 bg-zinc-100 rounded-lg mb-3 md:mb-4 flex items-center justify-center overflow-hidden"
              >
                {pack.imagens?.[0] && (
                  <img
                    src={pack.imagens[0]}
                    className="max-h-full object-contain"
                  />
                )}
              </motion.div>

              <h2 className="font-medium text-sm md:text-lg">
                {pack.nome}
              </h2>

              <p className="text-xs md:text-sm text-zinc-500 mt-1">
                {pack.quantidade_cartas} cartas
              </p>

              <p className="mt-2 md:mt-3 font-semibold text-sm md:text-lg">
                R$ {pack.preco}
              </p>
            </motion.div>
          ))}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {selectedPack && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPack(null)}
            >
              <motion.div
                  layoutId={`card-${selectedPack.id}`}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 300 }}
                  onDragEnd={(event, info) => {
                    if (info.offset.y > 150) {
                      setSelectedPack(null)
                    }
                  }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white w-full md:max-w-5xl rounded-t-2xl md:rounded-xl p-4 md:p-6 pb-24 md:pb-6 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                {/* BOTÃO FECHAR */}
                <button
                  onClick={() => setSelectedPack(null)}
                  className="absolute top-3 right-3 md:top-4 md:right-4 z-50 text-lg md:text-xl bg-white/80 backdrop-blur-md rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
                >
                  ✕
                </button>

                <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10">

                  {/* GALERIA */}
                  <motion.div layoutId={`image-${selectedPack.id}`}>
                    <PackGallery imagens={selectedPack.imagens} />
                  </motion.div>

                  {/* INFO */}
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                      {selectedPack.nome}
                    </h1>

                    <p className="text-zinc-600 mt-2 md:mt-3 text-sm md:text-base">
                      {selectedPack.descricao}
                    </p>

                    <p className="mt-3 md:mt-4 text-xs md:text-sm text-zinc-500">
                      {selectedPack.quantidade_cartas} cartas
                    </p>

                    <p className="text-2xl md:text-3xl font-bold mt-4 md:mt-6">
                      R$ {selectedPack.preco}
                    </p>

                    {/* BOTÃO DESKTOP */}
                    <button className="hidden md:block mt-6 w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition">
                      Comprar agora
                    </button>
                  </div>

                </div>

                {/* BOTÃO FIXO MOBILE */}
                <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t md:hidden z-50">
                  <button className="w-full bg-black text-white py-4 rounded-xl text-lg">
                    Comprar agora
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PackOpening({ cards, onClose }: any) {
  const [step, setStep] = useState<'closed' | 'opening' | 'revealed'>('closed')
  const [revealedCards, setRevealedCards] = useState<any[]>([])

  function openPack() {
    setStep('opening')

    setTimeout(() => {
      const shuffled = [...cards].sort(() => 0.5 - Math.random())
      setRevealedCards(shuffled.slice(0, 5))
      setStep('revealed')
    }, 1200)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]">

      {/* FECHAR */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-xl"
      >
        ✕
      </button>

      {/* CONTEÚDO */}
      <div className="text-center">

        {/* PACK FECHADO */}
        {step === 'closed' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cursor-pointer"
            onClick={openPack}
          >
            <div className="w-40 h-56 bg-yellow-300 rounded-xl flex items-center justify-center shadow-xl">
              <span className="font-bold">PACK</span>
            </div>

            <p className="text-white mt-4">Toque para abrir</p>
          </motion.div>
        )}

        {/* ANIMAÇÃO */}
        {step === 'opening' && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.2, rotate: 5 }}
            transition={{ duration: 0.6, repeat: 1, repeatType: 'reverse' }}
            className="w-40 h-56 bg-yellow-300 rounded-xl flex items-center justify-center shadow-xl"
          >
            <span className="font-bold">Abrindo...</span>
          </motion.div>
        )}

        {/* CARTAS REVELADAS */}
        <AnimatePresence>
          {step === 'revealed' && (
            <motion.div
              className="flex gap-4 mt-6 flex-wrap justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {revealedCards.map((card, index) => (
                <motion.img
                  key={card.id}
                  src={card.imagem}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="w-28 h-40 object-contain bg-white rounded-lg p-2 shadow-lg"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
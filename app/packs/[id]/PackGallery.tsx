'use client'

import { useEffect, useRef, useState } from 'react'

export default function PackGallery({ imagens }: { imagens: string[] }) {
  const [current, setCurrent] = useState(0)
  const thumbsRef = useRef<HTMLDivElement>(null)

  if (!imagens || imagens.length === 0) return null

  function next() {
    setCurrent((prev) => (prev + 1) % imagens.length)
  }

  function prev() {
    setCurrent((prev) =>
      prev === 0 ? imagens.length - 1 : prev - 1
    )
  }

  // autoplay leve
  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  // centraliza thumb ativa
  useEffect(() => {
    const container = thumbsRef.current
    if (!container) return

    const active = container.children[current] as HTMLElement
    if (!active) return

    const offset =
      active.offsetLeft -
      container.offsetWidth / 2 +
      active.offsetWidth / 2

    container.scrollTo({
      left: offset,
      behavior: 'smooth'
    })
  }, [current])

  return (
    <div className="w-[85%] mx-auto">

      {/* IMAGEM PRINCIPAL */}
      <div className="relative">

        <img
          src={imagens[current]}
          className="w-full h-auto object-contain rounded-xl"
        />

        {/* SETAS */}
        {imagens.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow"
            >
              ‹
            </button>

            <button
              onClick={next}
              className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow"
            >
              ›
            </button>
          </>
        )}

        {/* indicador */}
        <div className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
          {current + 1} / {imagens.length}
        </div>
      </div>

      {/* THUMBS */}
      {imagens.length > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide"
        >
          {imagens.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setCurrent(i)}
              className={`w-16 h-20 object-contain rounded-lg cursor-pointer border transition ${
                i === current
                  ? 'border-black scale-105'
                  : 'border-transparent opacity-60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
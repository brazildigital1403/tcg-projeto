

import Link from 'next/link'
import { ui } from '../styles/ui'

export default function Hero() {
  return (
    <section className={`${ui.section} text-center bg-gradient-to-b from-yellow-300 to-yellow-200`}>
      <div className={ui.container}>

        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight mx-auto">
          Cartas que conectam pessoas, histórias e futuros
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl text-gray-800 mx-auto">
          Tornamos o universo dos jogos de cartas acessível, educativo e presente na vida de quem mais precisa.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/conhecer" className={ui.buttonPrimary}>
            Conhecer o projeto
          </Link>

          <Link href="/participar" className={ui.buttonSecondary}>
            Como participar
          </Link>
        </div>

        <div className="mt-16 w-full max-w-4xl mx-auto">
          <img
            src="/hero.jpg"
            alt="Cartas e jogo"
            className="w-full h-[260px] md:h-[360px] object-cover rounded-2xl shadow-md transition duration-300 hover:scale-[1.02]"
          />
        </div>

        <div className="mt-14 grid grid-cols-3 gap-6 text-sm">
          <Stat value="+500" label="Cartas doadas" />
          <Stat value="+120" label="Pessoas impactadas" />
          <Stat value="+10" label="Projetos ativos" />
        </div>

      </div>
    </section>
  )
}

function Stat({ value, label }: any) {
  return (
    <div className="transition hover:scale-105">
      <p className="font-bold text-xl">{value}</p>
      <span className="text-gray-700">{label}</span>
    </div>
  )
}
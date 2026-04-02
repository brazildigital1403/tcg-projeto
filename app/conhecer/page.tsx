import Link from 'next/link'

export default function Conhecer() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-900">

      {/* HERO SPLIT */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              O jogo pode abrir caminhos
            </h1>

            <p className="mt-6 text-lg text-gray-700">
              Quando chega em quem precisa, ele vira aprendizado, conexão e novas possibilidades.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <Link href="/contribuir" className="bg-black text-white px-6 py-3 rounded-full">
                Contribuir
              </Link>

              <Link href="/receber" className="border border-black px-6 py-3 rounded-full">
                Quero receber
              </Link>
            </div>
          </div>

          <div>
            <img
              src="/hero.jpg"
              alt="Projeto"
              className="w-full h-[320px] object-cover rounded-2xl shadow-md"
            />
          </div>

        </div>
      </section>

      {/* TIMELINE */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl font-bold text-center">Como acontece</h2>

          <div className="mt-12 flex flex-col gap-10">

            {[
              { title: 'Doação', text: 'Cartas chegam de pessoas que querem ajudar.' },
              { title: 'Organização', text: 'Montamos kits prontos para uso.' },
              { title: 'Entrega', text: 'Levamos para escolas e projetos.' },
              { title: 'Uso real', text: 'Crianças aprendem jogando e convivendo.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">

                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  {i + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600 mt-1">{item.text}</p>
                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* DIFERENCIAL */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {[
            {
              title: 'Simples',
              text: 'Qualquer pessoa pode participar sem complexidade.',
            },
            {
              title: 'Direto',
              text: 'As cartas chegam rápido em quem realmente precisa.',
            },
            {
              title: 'Humano',
              text: 'Criamos conexões reais, não só distribuição.',
            },
          ].map((item, i) => (
            <div key={i} className="p-6 border rounded-xl">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.text}</p>
            </div>
          ))}

        </div>
      </section>

      {/* BLOCO VISUAL */}
      <section className="px-6 py-20 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold">
            Na prática
          </h2>

          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            Projetos acontecendo, pessoas conectando e aprendizado acontecendo de forma natural.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="overflow-hidden rounded-xl">
                <img
                  src="/hero.jpg"
                  className="w-full h-[200px] object-cover"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">
          Entre nesse ciclo
        </h2>

        <p className="mt-4 text-gray-600">
          Contribua, participe ou leve isso para sua comunidade.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/contribuir" className="bg-black text-white px-8 py-4 rounded-full">
            Contribuir
          </Link>

          <Link href="/receber" className="border border-black px-8 py-4 rounded-full">
            Receber
          </Link>
        </div>
      </section>

    </main>
  )
}
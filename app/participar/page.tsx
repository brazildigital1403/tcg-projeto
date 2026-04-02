import Link from 'next/link'

export default function Participar() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-900">

      {/* HERO SPLIT */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Você pode fazer parte disso
            </h1>

            <p className="mt-6 text-lg text-gray-700">
              Existem diferentes formas de participar. Escolha a que mais faz sentido pra você.
            </p>
          </div>

          <div>
            <img
              src="/hero.jpg"
              className="w-full h-[320px] object-cover rounded-2xl shadow-md"
            />
          </div>

        </div>
      </section>

      {/* CAMINHOS */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">

          {[
            {
              title: 'Doar cartas',
              text: 'Envie cartas que você não usa mais e ajude diretamente quem precisa.',
              link: '/contribuir',
            },
            {
              title: 'Receber cartas',
              text: 'Leve o TCG para sua escola, projeto ou comunidade.',
              link: '/receber',
            },
            {
              title: 'Apoiar projetos',
              text: 'Conecte iniciativas locais e ajude a expandir o impacto.',
              link: '/conhecer',
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-xl shadow-sm">

              <div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-gray-600 max-w-md">{item.text}</p>
              </div>

              <Link
                href={item.link}
                className="bg-black text-white px-6 py-3 rounded-full whitespace-nowrap"
              >
                Acessar
              </Link>

            </div>
          ))}

        </div>
      </section>

      {/* BLOCO CONEXÃO */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-bold">
            Tudo começa com uma conexão
          </h2>

          <p className="mt-6 text-gray-700 text-lg leading-relaxed">
            Uma doação, um projeto, uma pessoa interessada.
            Pequenas ações que juntas criam algo maior.
          </p>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-24 text-center bg-gray-100">
        <h2 className="text-3xl font-bold">
          Escolha como participar
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/contribuir" className="bg-black text-white px-8 py-4 rounded-full">
            Doar cartas
          </Link>

          <Link href="/receber" className="border border-black px-8 py-4 rounded-full">
            Receber cartas
          </Link>
        </div>
      </section>

    </main>
  )
}
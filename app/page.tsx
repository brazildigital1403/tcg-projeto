export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="w-full px-6 py-24 flex flex-col items-center text-center bg-gradient-to-b from-yellow-300 to-yellow-200">
        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
          Cartas que conectam pessoas, histórias e futuros
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl text-gray-800">
          Tornamos o universo dos jogos de cartas acessível, educativo e presente na vida de quem mais precisa.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="bg-black text-white px-6 py-3 rounded-full hover:opacity-90 transition">
            Conhecer o projeto
          </button>

          <button className="border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition">
            Como participar
          </button>
        </div>

        <div className="mt-16 w-full max-w-4xl">
          <img
            src="/hero.jpg"
            alt="Cartas e jogo"
            className="w-full rounded-2xl shadow-md object-cover"
          />
        </div>

        {/* MINI STATS */}
        <div className="mt-14 grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-bold text-xl">+500</p>
            <span className="text-gray-700">Cartas doadas</span>
          </div>
          <div>
            <p className="font-bold text-xl">+120</p>
            <span className="text-gray-700">Pessoas impactadas</span>
          </div>
          <div>
            <p className="font-bold text-xl">+10</p>
            <span className="text-gray-700">Projetos ativos</span>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="w-full px-6 py-20 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Mais do que um jogo
        </h2>

        <p className="mt-6 max-w-3xl text-lg text-gray-700 leading-relaxed">
          Utilizamos jogos de cartas como ferramenta de desenvolvimento. Estimulamos raciocínio lógico,
          tomada de decisão e interação social de forma natural e envolvente.
        </p>

        <p className="mt-4 max-w-3xl text-lg text-gray-700 leading-relaxed">
          Levamos essa experiência para escolas, projetos sociais e comunidades que normalmente não teriam acesso.
        </p>
      </section>

      {/* IMPACTO */}
      <section className="w-full px-6 py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {[
            { title: "Desenvolvimento", text: "Estimula estratégia, foco e resolução de problemas." },
            { title: "Social", text: "Fortalece conexões e senso de comunidade." },
            { title: "Acesso", text: "Leva o TCG para quem nunca teve oportunidade." },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-gray-600">{item.text}</p>
            </div>
          ))}

        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="w-full px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Quem vive o projeto
          </h2>

          <div className="mt-12 flex gap-4 overflow-x-auto pb-4">
            {[
              "Meu filho passou a se concentrar mais e se comunicar melhor.",
              "Eles aprendem estratégia e convivência sem perceber.",
              "Aqui todo mundo se sente parte de algo.",
              "Um ambiente onde todos se sentem incluídos.",
            ].map((text, i) => (
              <div key={i} className="min-w-[260px] p-6 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
                <p className="text-gray-700">"{text}"</p>
                <span className="block mt-4 font-semibold text-sm text-gray-600">
                  Depoimento real
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARCEIROS */}
      <section className="w-full px-6 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Projetos e parcerias
          </h2>

          <p className="mt-6 text-gray-700 max-w-2xl mx-auto">
            Conectamos escolas, instituições e comunidades através do TCG.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Escolas", "Projetos", "ONGs", "Comunidades"].map((item) => (
              <div key={item} className="h-16 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="w-full px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Como funciona
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8">

            {[
              { title: "Você contribui", text: "Doe cartas ou apoie o projeto." },
              { title: "Nós conectamos", text: "Organizamos e direcionamos para quem precisa." },
              { title: "Impacto real", text: "Cartas chegam a escolas e comunidades." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl">
                <div className="text-2xl font-bold mb-3">{i + 1}</div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.text}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="w-full px-6 py-24 flex flex-col items-center text-center bg-yellow-100">
        <h2 className="text-3xl md:text-4xl font-bold">
          Faça parte disso
        </h2>

        <p className="mt-6 text-lg max-w-2xl text-gray-700">
          Você pode ajudar com cartas, apoio ou participação ativa.
        </p>

        <button className="mt-10 bg-black text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition">
          Quero participar
        </button>
      </section>

    </main>
  );
}
"use client";

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-6 text-center space-y-6">

        {/* EMOJI + ANIMAÇÃO LEVE */}
        <div className="text-5xl animate-bounce">
          ❤️
        </div>

        {/* HEADLINE */}
        <div>
          <h1 className="text-2xl font-semibold">
            Você acabou de ajudar alguém a começar
          </h1>

          <p className="text-sm text-zinc-500 mt-2">
            Sua contribuição vai virar novas oportunidades para outros jogadores.
          </p>
        </div>

        {/* BLOCO EMOCIONAL */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-zinc-700">
          Uma carta que pra você estava parada, pode ser a primeira carta de alguém.
        </div>

        {/* MICRO REFORÇO */}
        <p className="text-xs text-zinc-400">
          Em breve entraremos em contato pelo WhatsApp.
        </p>

        {/* AÇÕES */}
        <div className="space-y-3 pt-2">

          <button
            onClick={() => (window.location.href = "/contribuir")}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            Contribuir novamente
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full border py-3 rounded-xl"
          >
            Voltar para home
          </button>

        </div>

      </div>
    </div>
  );
}
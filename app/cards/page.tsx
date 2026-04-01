"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function CardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const [raridades, setRaridades] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("pokedex_asc");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [openFilters, setOpenFilters] = useState(false);
  const totalFiltros = tipos.length + raridades.length;


  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("cards").select("*").limit(2000);

      setCards(data || []);
    }
    load();
  }, []);

  const tiposMap: any = {
    fire: { label: "Fogo", icon: "🔥" },
    water: { label: "Água", icon: "💧" },
    grass: { label: "Planta", icon: "🌿" },
    lightning: { label: "Elétrico", icon: "⚡" },
    psychic: { label: "Psíquico", icon: "🔮" },
    fighting: { label: "Lutador", icon: "🥊" },
    darkness: { label: "Sombrio", icon: "🌑" },
    metal: { label: "Metal", icon: "⚙️" },
    colorless: { label: "Normal", icon: "⚪" },
  };

  const raridadeMap: any = {
    Common: { label: "Comum", color: "bg-zinc-200 text-zinc-700" },
    Uncommon: { label: "Incomum", color: "bg-green-200 text-green-800" },
    Rare: { label: "Rara", color: "bg-yellow-200 text-yellow-800" },
    "Rare Holo": { label: "Holo", color: "bg-purple-200 text-purple-800" },
  };

  function getTipoInfo(tipo: string) {
    return tiposMap[tipo] || { label: tipo, icon: "❓" };
  }

  function getRaridadeInfo(r: string) {
    return (
      raridadeMap[r] || {
        label: r,
        color: "bg-zinc-100 text-zinc-600",
      }
    );
  }

  const tiposUnicos = Array.from(
    new Set(cards.map((c) => c.elemento).filter(Boolean)),
  );
  const raridadesUnicas = Array.from(
    new Set(cards.map((c) => c.raridade).filter(Boolean)),
  );

  const cardsFiltrados = cards
    .filter((c) => {
      const tipo = c.elemento?.toLowerCase();
      const nome = c.nome?.toLowerCase();

      const matchTipo = tipos.length ? tipos.includes(tipo) : true;
      const matchRaridade = raridades.length
        ? raridades.includes(c.raridade)
        : true;
      const matchBusca = busca ? nome.includes(busca.toLowerCase()) : true;

      return matchTipo && matchRaridade && matchBusca;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case "pokedex_asc":
          return (a.pokedex || 0) - (b.pokedex || 0);
        case "pokedex_desc":
          return (b.pokedex || 0) - (a.pokedex || 0);
        case "nome_asc":
          return a.nome.localeCompare(b.nome);
        case "nome_desc":
          return b.nome.localeCompare(a.nome);
        default:
          return 0;
      }
    });

  function toggleTipo(tipo: string) {
    setTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo],
    );
  }

  function toggleRaridade(r: string) {
    setRaridades((prev) =>
      prev.includes(r) ? prev.filter((t) => t !== r) : [...prev, r],
    );
  }

  function navegar(dir: number) {
    const index = cardsFiltrados.findIndex((c) => c.id === selectedCard.id);
    const novo = cardsFiltrados[index + dir];
    if (novo) setSelectedCard(novo);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-4 hidden md:block">
        <h2 className="font-semibold mb-4">Filtros</h2>

        <p className="text-sm text-zinc-500 mb-2">Tipo</p>
        <div className="flex flex-wrap gap-2">
          {tiposUnicos.map((tipo) => {
            const info = getTipoInfo(tipo);
            const ativo = tipos.includes(tipo);

            return (
              <button
                key={tipo}
                onClick={() => toggleTipo(tipo)}
                className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1
                  ${ativo ? "bg-black text-white" : "bg-white"}
                `}
              >
                {info.icon} {info.label}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-zinc-500 mt-4 mb-2">Raridade</p>
        <div className="flex flex-wrap gap-2">
          {raridadesUnicas.map((r) => {
            const ativo = raridades.includes(r);

            return (
              <button
                key={r}
                onClick={() => toggleRaridade(r)}
                className={`px-2 py-1 rounded-full text-xs border
                  ${ativo ? "bg-black text-white" : "bg-white"}
                `}
              >
                {getRaridadeInfo(r).label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-semibold mb-4">Cartas</h1>

        <div className="flex items-center justify-between mb-6 gap-4">
          <input
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          />

          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className="border p-2 rounded text-sm"
          >
            <option value="pokedex_asc">Pokédex ↑</option>
            <option value="pokedex_desc">Pokédex ↓</option>
            <option value="nome_asc">Nome A-Z</option>
            <option value="nome_desc">Nome Z-A</option>
          </select>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cardsFiltrados.map((card) => {
            const tipo = getTipoInfo(card.elemento);
            const raridade = getRaridadeInfo(card.raridade);

            const nome = card.nome?.toLowerCase() || "";
            const isRara =
              nome.includes("ex") || nome.includes("gx") || nome.includes(" v");

            return (
              <motion.div
                key={card.id}
                layoutId={`card-${card.id}`}
                onClick={() => setSelectedCard(card)}
                className={`relative bg-white rounded-xl p-3 cursor-pointer transition
                  ${
                    isRara
                      ? "ring-2 ring-yellow-400 shadow-lg"
                      : "shadow-sm hover:shadow-md"
                  }
                `}
              >
                {/* BRILHO */}
                {isRara && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-yellow-300/10" />
                    <div className="shine-effect" />
                  </div>
                )}

                {/* BADGE */}
                {isRara && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] px-2 py-1 rounded">
                    ✨ Ultra Raro
                  </div>
                )}

                <img
                  src={card.imagem}
                  className="w-full h-40 object-contain mb-2"
                />

                <p className="font-medium text-sm">{card.nome}</p>
                <p className="text-xs text-zinc-500">#{card.pokedex}</p>

                <p className="text-xs mt-1">
                  {tipo.icon} {tipo.label}
                </p>

                <span
                  className={`text-[10px] px-2 py-1 rounded mt-1 inline-block ${raridade.color}`}
                >
                  {raridade.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* BOTÃO FILTRO MOBILE */}
        <div
          className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] ${openFilters || selectedCard ? "hidden" : ""}`}
        >
          <button
            onClick={() => setOpenFilters(true)}
            className="bg-black text-white px-6 py-3 rounded-full shadow-xl"
          >
            Filtros{" "}
            {totalFiltros > 0 && (
              <span className="ml-1 bg-white text-black px-2 py-0.5 rounded-full text-xs">
                {totalFiltros}
              </span>
            )}
          </button>
        </div>

        {/* MODAL FILTRO MOBILE */}
        <AnimatePresence>
          {openFilters && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-[70] flex items-end"
              onClick={() => setOpenFilters(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-white w-full rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Filtros</h2>
                  <button onClick={() => setOpenFilters(false)}>✕</button>
                </div>

                {/* TIPOS */}
                <p className="text-sm text-zinc-500 mb-2">Tipo</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tiposUnicos.map((tipo) => {
                    const info = getTipoInfo(tipo);
                    const ativo = tipos.includes(tipo);

                    return (
                      <button
                        key={tipo}
                        onClick={() => toggleTipo(tipo)}
                        className={`px-3 py-2 rounded-full text-sm border
                  ${ativo ? "bg-black text-white" : "bg-white"}
                `}
                      >
                        {info.icon} {info.label}
                      </button>
                    );
                  })}
                </div>

                {/* RARIDADE */}
                <p className="text-sm text-zinc-500 mb-2">Raridade</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {raridadesUnicas.map((r) => {
                    const ativo = raridades.includes(r);

                    return (
                      <button
                        key={r}
                        onClick={() => toggleRaridade(r)}
                        className={`px-3 py-2 rounded-full text-sm border
                  ${ativo ? "bg-black text-white" : "bg-white"}
                `}
                      >
                        {getRaridadeInfo(r).label}
                      </button>
                    );
                  })}
                </div>

                {/* AÇÕES */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setTipos([]);
                      setRaridades([]);
                    }}
                    className="flex-1 border py-3 rounded-xl"
                  >
                    Limpar
                  </button>

                  <button
                    onClick={() => setOpenFilters(false)}
                    className="flex-1 bg-black text-white py-3 rounded-xl"
                  >
                    Aplicar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
              onClick={() => setSelectedCard(null)}
            >
              <motion.div
                layoutId={`card-${selectedCard.id}`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full md:max-w-6xl h-[100vh] md:h-[90vh] rounded-t-2xl md:rounded-xl overflow-hidden grid md:grid-cols-2 relative mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* IMAGEM */}
                <div className="relative flex items-center justify-center bg-zinc-100 p-2 md:p-4">
                  <img
                    src={selectedCard.imagem}
                    className="w-[70%] max-h-[85vh] object-contain drop-shadow-2xl transition duration-300 hover:scale-[1.05]"
                  />

                  <button
                    onClick={() => navegar(-1)}
                    className="absolute left-4"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => navegar(1)}
                    className="absolute right-4"
                  >
                    ›
                  </button>
                </div>

                {/* INFO */}
                <div className="flex flex-col h-full">
                  {/* BOTÃO FECHAR FIXO */}
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center shadow"
                  >
                    ✕
                  </button>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <p>#{selectedCard.pokedex}</p>

                    <p>
                      {getTipoInfo(selectedCard.elemento).icon}{" "}
                      {getTipoInfo(selectedCard.elemento).label}
                    </p>

                    <p>{selectedCard.set || "Base"}</p>

                    <span
                      className={`px-2 py-1 rounded ${getRaridadeInfo(selectedCard.raridade).color}`}
                    >
                      {getRaridadeInfo(selectedCard.raridade).label}
                    </span>
                  </div>

                  <div className="p-6 border-t">
                    <button className="w-full bg-black text-white py-3 rounded-xl">
                      Ver packs com essa carta
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

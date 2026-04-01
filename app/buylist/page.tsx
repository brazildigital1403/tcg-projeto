"use client";

import { useEffect, useState } from "react";

type Item = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: "avulso" | "bulk" | "selado";
};

const DATA: Item[] = [
  // BULK
  {
    id: 1,
    nome: "1000x Comuns",
    descricao: "Cartas comuns em bom estado",
    preco: 10,
    categoria: "bulk",
  },
  {
    id: 2,
    nome: "1000x Incomuns",
    descricao: "Cartas incomuns",
    preco: 20,
    categoria: "bulk",
  },
  {
    id: 3,
    nome: "Bulk Raro / Mítico",
    descricao: "Cartas raras",
    preco: 0.1,
    categoria: "bulk",
  },

  // AVULSOS
  {
    id: 10,
    nome: "Carta comum",
    descricao: "Venda individual",
    preco: 1,
    categoria: "avulso",
  },
  {
    id: 11,
    nome: "Carta rara",
    descricao: "Carta avulsa rara",
    preco: 5,
    categoria: "avulso",
  },

  // SELADOS
  {
    id: 20,
    nome: "Booster selado",
    descricao: "Produto lacrado",
    preco: 15,
    categoria: "selado",
  },
];

export default function BuylistPage() {
  const [aba, setAba] = useState<"avulso" | "bulk" | "selado">("avulso");
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});
  const [carrinho, setCarrinho] = useState<any[]>([]);

  // 🔁 carregar carrinho salvo
  useEffect(() => {
    const saved = localStorage.getItem("buylist_cart");
    if (saved) setCarrinho(JSON.parse(saved));
  }, []);

  // 💾 salvar carrinho
  useEffect(() => {
    localStorage.setItem("buylist_cart", JSON.stringify(carrinho));
  }, [carrinho]);

  function alterarQuantidade(id: number, delta: number) {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  }

  function adicionar(item: Item) {
    const qtd = quantidades[item.id] || 1;

    setCarrinho((prev) => {
      const existente = prev.find((i) => i.id === item.id);

      if (existente) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantidade: i.quantidade + qtd } : i,
        );
      }

      return [...prev, { ...item, quantidade: qtd }];
    });
  }

  function remover(id: number) {
    setCarrinho((prev) => prev.filter((i) => i.id !== id));
  }

  const itensFiltrados = DATA.filter((i) => i.categoria === aba);

  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-semibold">Venda suas cartas</h1>

        <p className="text-zinc-500 text-sm max-w-xl">
          Venda suas cartas de forma simples. Escolha os itens abaixo e monte
          seu carrinho.
        </p>

        {/* ABAS */}
        <div className="flex gap-2">
          {[
            { key: "avulso", label: "Cards Avulsos" },
            { key: "bulk", label: "Lotes / Bulk" },
            { key: "selado", label: "Produtos Selados" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setAba(tab.key as any)}
              className={`px-4 py-2 rounded-full text-sm border ${
                aba === tab.key ? "bg-black text-white" : "bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LISTA */}
        <div className="space-y-4 pt-4">
          {itensFiltrados.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{item.nome}</p>
                <p className="text-sm text-zinc-500">{item.descricao}</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-semibold min-w-[70px] text-right">
                  R$ {item.preco.toFixed(2)}
                </p>

                {/* STEPPER */}
                <div className="flex border rounded overflow-hidden">
                  <button
                    onClick={() => alterarQuantidade(item.id, -1)}
                    className="px-3"
                  >
                    -
                  </button>

                  <span className="px-4">{quantidades[item.id] || 1}</span>

                  <button
                    onClick={() => alterarQuantidade(item.id, 1)}
                    className="px-3"
                  >
                    +
                  </button>
                </div>

                {/* ADD */}
                <button
                  onClick={() => adicionar(item)}
                  className="bg-black text-white px-4 py-2 rounded-lg"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CARRINHO */}
        {carrinho.length > 0 && (
          <div className="mt-10 bg-white p-5 rounded-2xl shadow space-y-4">
            <h2 className="font-semibold">Seu carrinho</h2>

            <div className="space-y-2">
              {carrinho.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span>
                    {item.nome} x{item.quantidade}
                  </span>

                  <div className="flex items-center gap-3">
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>

                    <button
                      onClick={() => remover(item.id)}
                      className="text-red-500"
                    >
                      remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Total estimado</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                localStorage.setItem(
                  "buylist_checkout",
                  JSON.stringify({
                    carrinho,
                    total,
                  }),
                );

                window.location.href = "/vender/checkout";
              }}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              Continuar venda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

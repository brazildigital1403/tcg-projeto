"use client";

import { useEffect, useState } from "react";

export default function VenderCheckoutPage() {
  const [pedido, setPedido] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // 🔥 CARREGAR CARRINHO
  useEffect(() => {
    const data = localStorage.getItem("buylist_checkout");

    if (!data) {
      // 👉 volta se não tiver itens
      window.location.href = "/vender";
      return;
    }

    const parsed = JSON.parse(data);

    setPedido({
      itens: parsed.carrinho || parsed.itens || [],
    });
  }, []);

  // 📱 MÁSCARA TELEFONE
  function formatPhone(value: string) {
    value = value.replace(/\D/g, "");

    if (value.length <= 10) {
      return value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }

    return value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  function handlePhone(e: any) {
    setWhatsapp(formatPhone(e.target.value));
  }

  // 💰 TOTAL
  const total = pedido?.itens?.reduce(
    (acc: number, item: any) =>
      acc + item.preco * (item.qtd || item.quantidade || 1),
    0,
  );

  // 🚀 FINALIZAR VENDA
  async function finalizar() {
    if (!nome || !whatsapp) {
      alert("Preencha seus dados para continuar");
      return;
    }

    const payload = {
      nome,
      whatsapp,
      itens: pedido.itens.map((item: any) => ({
        ...item,
        qtd: item.qtd || item.quantidade || 1,
      })),
      total,
      status: "aguardando",
      origem: "venda",
      created_at: new Date(),
    };

    // 👉 API (mantém padrão atual)
    await fetch("/api/buylist", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // limpa carrinho
    localStorage.removeItem("buylist_checkout");

    // redireciona
    window.location.href = "/vender/sucesso";
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold">
            Finalizar venda
          </h1>

          <p className="text-sm text-zinc-500">
            Revise seus itens e envie para avaliação
          </p>
        </div>

        {/* RESUMO */}
        {pedido ? (
          <div className="space-y-2 border rounded-lg p-3 bg-zinc-50 text-sm">

            {pedido.itens.map((item: any, i: number) => {
              const quantidade = item.qtd || item.quantidade || 1;

              return (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.nome} x{quantidade}
                  </span>

                  <span>
                    R$ {(item.preco * quantidade).toFixed(2)}
                  </span>
                </div>
              );
            })}

            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total estimado</span>
              <span>R$ {total?.toFixed(2)}</span>
            </div>

          </div>
        ) : (
          <div className="text-center space-y-4">

            <p className="text-sm text-zinc-500">
              Seu carrinho está vazio
            </p>

            <button
              onClick={() => (window.location.href = "/vender")}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Voltar para venda
            </button>

          </div>
        )}

        {/* FORM */}
        <div className="space-y-4">

          <div>
            <label className="text-sm">Seu nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full border p-3 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm">WhatsApp</label>
            <input
              value={whatsapp}
              onChange={handlePhone}
              placeholder="(11) 99999-9999"
              className="w-full border p-3 rounded-lg mt-1"
            />
          </div>

        </div>

        {/* AÇÕES */}
        <div className="space-y-3">

          <button
            onClick={finalizar}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            Enviar para avaliação
          </button>

          <button
            onClick={() => (window.location.href = "/vender")}
            className="w-full border py-3 rounded-xl"
          >
            Voltar e editar itens
          </button>

        </div>

      </div>
    </div>
  );
}
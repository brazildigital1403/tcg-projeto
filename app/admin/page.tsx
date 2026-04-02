"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [dados, setDados] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("eventos_funil")
        .select("*");

      setDados(data || []);
    }

    load();
  }, []);

  function contar(evento: string) {
    return dados.filter((d) => d.evento === evento).length;
  }

  function contarStep(step: number) {
    return dados.filter((d) => d.step === step).length;
  }

  return (
    <div className="min-h-screen p-6 bg-zinc-50 space-y-6">

      <h1 className="text-2xl font-semibold">
        Dashboard do Funil
      </h1>

      {/* FUNIL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Card title="Step 1" value={contarStep(1)} />
        <Card title="Step 2" value={contarStep(2)} />
        <Card title="Step 3" value={contarStep(3)} />
        <Card title="Step 4" value={contarStep(4)} />

      </div>

      {/* EVENTOS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        <Card title="Doação" value={contar("tipo_doacao")} />
        <Card title="Venda" value={contar("tipo_venda")} />
        <Card title="Finalizou" value={contar("finalizou")} />

      </div>

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
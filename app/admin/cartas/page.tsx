"use client";

import { useEffect, useState } from "react";
import {
  getAllCards,
  toggleCard,
  uploadImage,
  createCard,
  Card,
} from "@/services/cards";
import { supabase } from "@/lib/supabase";

export default function CartasAdmin() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [rarity, setRarity] = useState("all");
  const [tipo, setTipo] = useState("all")
  const [tipoOptions, setTipoOptions] = useState<string[]>([])
  const [status, setStatus] = useState("all");

  const [newName, setNewName] = useState("");
  const [newRarity, setNewRarity] = useState("Common");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [estimatedTime, setEstimatedTime] = useState("");

  const TOTAL_PAGES = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchTipos()
  }, [])

  useEffect(() => {
    fetchCards();
  }, [search, rarity, status, tipo]);

  async function fetchTipos() {
    const { data } = await supabase
      .from("cards")
      .select("elemento")

    if (!data) return

    const unique = Array.from(
      new Set(data.map((c: any) => c.elemento).filter(Boolean))
    )

    setTipoOptions(unique.sort())
  }

  async function fetchCards() {
    setLoading(true);
    const data = await getAllCards(search, rarity, status, tipo);
    setCards(data);
    setLoading(false);
  }

  async function updateQuantidade(id: string, value: number) {
    if (value < 0) return;

    const { data } = await supabase
      .from("cards")
      .select("ativo")
      .eq("id", id)
      .single();

    if (!data?.ativo) {
      alert("Ative a carta antes de alterar quantidade");
      return;
    }

    await supabase.from("cards").update({ quantidade: value }).eq("id", id);

    fetchCards();
  }

  async function handleToggle(card: Card, enable: boolean) {
    await toggleCard(card.id, !enable);
    fetchCards();
  }

  async function handleCreate() {
    if (!newName) {
      alert("Digite um nome");
      return;
    }

    try {
      setCreating(true);

      let imageUrl = "";
      if (newImage) imageUrl = await uploadImage(newImage);

      await createCard({
        nome: newName,
        raridade: newRarity,
        imagem: imageUrl,
      });

      setNewName("");
      setNewRarity("Common");
      setNewImage(null);

      fetchCards();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  }

  function formatTime(seconds: number) {
    if (!seconds || !isFinite(seconds)) return "--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  }

  async function handleImport() {
    setImporting(true);
    setProgress(null);
    setEstimatedTime("");

    const start = Date.now();

    try {
      const res = await fetch("/api/import-cards?pages=20");
      const json = await res.json();
      const id = json.id;

      const interval = setInterval(async () => {
        const statusRes = await fetch(`/api/import-status?id=${id}`);
        const status = await statusRes.json();

        setProgress(status);

        if (status.current_page > 0) {
          const elapsed = (Date.now() - start) / 1000;
          const speed = status.current_page / elapsed;

          const remainingPages = TOTAL_PAGES - status.current_page;
          const remainingTime = remainingPages / speed;

          setEstimatedTime(formatTime(remainingTime));
        }

        if (status.status === "concluido") {
          clearInterval(interval);
          setImporting(false);
          setEstimatedTime("Finalizado");
          fetchCards();
        }
      }, 1000);
    } catch (err: any) {
      alert(err.message);
      setImporting(false);
    }
  }

  const activeCards = cards.filter((c) => c.ativo);
  const inactiveCards = cards.filter((c) => !c.ativo);

  if (loading) return <p style={{ padding: 40 }}>Carregando...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Cartas</h1>
        <p style={styles.subtitle}>{cards.length} cartas encontradas</p>
      </div>

      <div style={styles.topGrid}>
        <div style={styles.card}>
          <p style={styles.blockTitle}>Importação</p>

          <button style={styles.primaryButton} onClick={handleImport}>
            {importing ? "Importando..." : "Importar da API"}
          </button>

          {progress && (
            <div style={styles.progressBox}>
              <div style={styles.progressHeader}>
                <span>
                  Página {progress.current_page}/{TOTAL_PAGES}
                </span>
                <span>{estimatedTime || "--"}</span>
              </div>

              <div style={styles.progressBarBg}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${(progress.current_page / TOTAL_PAGES) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <p style={styles.blockTitle}>Criar carta</p>

          <div style={styles.formGrid}>
            <input
              placeholder="Nome da carta"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={styles.input}
            />

            <select
              value={newRarity}
              onChange={(e) => setNewRarity(e.target.value)}
              style={styles.input}
            >
              <option value="Common">Comum</option>
              <option value="Uncommon">Incomum</option>

              <option value="Rare">Rara</option>
              <option value="Rare Holo">Holo</option>
              <option value="Rare Holo EX">Rare Holo EX</option>
              <option value="Rare Holo GX">Rare Holo GX</option>
              <option value="Rare Holo V">Rare Holo V</option>
              <option value="Rare Holo VMAX">Rare Holo VMAX</option>
              <option value="Rare Holo VSTAR">Rare Holo VSTAR</option>

              <option value="Rare Ultra">Ultra Rara</option>
              <option value="Rare Secret">Secreta</option>
              <option value="Rare Rainbow">Rainbow</option>
              <option value="Rare Shiny">Shiny</option>

              <option value="Amazing Rare">Amazing Rare</option>
              <option value="Promo">Promo</option>
            </select>

            <input
              type="file"
              style={styles.file}
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
            />
          </div>

          <button style={styles.primaryButton} onClick={handleCreate}>
            {creating ? "Criando..." : "Criar Carta"}
          </button>
        </div>
      </div>

      <div style={styles.filterGrid}>

        {/* BUSCAS */}
        <input
          placeholder="Buscar carta..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={styles.input}
        />

        {/* LINHA DE FILTROS */}
        <div style={styles.filterRow}>

          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            style={styles.input}
          >
            <option value="all">Raridade</option>
            <option value="Common">Comum</option>
            <option value="Uncommon">Incomum</option>
            <option value="Rare">Rara</option>
            <option value="Rare Holo">Holo</option>
            <option value="Rare Holo EX">Rare Holo EX</option>
            <option value="Rare Holo GX">Rare Holo GX</option>
            <option value="Rare Holo V">Rare Holo V</option>
            <option value="Rare Holo VMAX">Rare Holo VMAX</option>
            <option value="Rare Holo VSTAR">Rare Holo VSTAR</option>
            <option value="Rare Ultra">Ultra Rara</option>
            <option value="Rare Secret">Secreta</option>
            <option value="Rare Rainbow">Rainbow</option>
            <option value="Rare Shiny">Shiny</option>
            <option value="Amazing Rare">Amazing Rare</option>
            <option value="Promo">Promo</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.input}
          >
            <option value="all">Status</option>
            <option value="active">Habilitadas</option>
            <option value="inactive">Desabilitadas</option>
          </select>

        </div>

        {/* TIPOS */}
        <div style={styles.chipsContainer}>
          <button
            onClick={() => setTipo('all')}
            style={{
              ...styles.chip,
              background: tipo === 'all' ? '#000' : '#fff',
              color: tipo === 'all' ? '#fff' : '#000',
            }}
          >
            Todos
          </button>

          {tipoOptions.map((t) => {
            const iconMap: any = {
              fire: '🔥',
              water: '💧',
              grass: '🌿',
              lightning: '⚡',
              psychic: '🔮',
              fighting: '🥊',
              darkness: '🌑',
              metal: '⚙️',
              colorless: '⚪',
            }

            return (
              <button
                key={t}
                onClick={() => setTipo(t)}
                style={{
                  ...styles.chip,
                  background: tipo === t ? '#000' : '#fff',
                  color: tipo === t ? '#fff' : '#000',
                }}
              >
                {iconMap[t] || '❓'} {traduzElemento(t)}
              </button>
            )
          })}
        </div>

      </div>

      <h2 style={styles.sectionTitle}>Cartas habilitadas</h2>
      <div style={styles.grid}>
        {activeCards.map((c) => (
          <CardItem
            key={c.id}
            c={c}
            updateQuantidade={updateQuantidade}
            handleToggle={handleToggle}
          />
        ))}
      </div>

      <h2 style={styles.sectionTitle}>Cartas desabilitadas</h2>
      <div style={styles.grid}>
        {inactiveCards.map((c) => (
          <CardItem
            key={c.id}
            c={c}
            updateQuantidade={updateQuantidade}
            handleToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}

/* Helper functions */

function traduzRaridade(r: string) {
  const map: any = {
    'Common': 'Comum',
    'Uncommon': 'Incomum',
    'Rare': 'Rara',
    'Rare Holo': 'Holo',
    'Rare Holo EX': 'Holo EX',
    'Rare Holo GX': 'Holo GX',
    'Rare Holo V': 'Holo V',
    'Rare Holo VMAX': 'Holo VMAX',
    'Rare Holo VSTAR': 'Holo VSTAR',
    'Rare Ultra': 'Ultra Rara',
    'Rare Secret': 'Secreta',
    'Rare Rainbow': 'Rainbow',
    'Rare Shiny': 'Shiny',
    'Amazing Rare': 'Amazing Rare',
    'Promo': 'Promo'
  }
  return map[r] || r
}

function traduzElemento(e: string) {
  const map: any = {
    fire: 'Fogo',
    water: 'Água',
    grass: 'Grama',
    lightning: 'Elétrico',
    psychic: 'Psíquico',
    fighting: 'Lutador',
    darkness: 'Noturno',
    metal: 'Metal',
    colorless: 'Neutro'
  }
  return map[e] || e
}

/* CARD */

function CardItem({ c, updateQuantidade, handleToggle }: any) {
  return (
    <div style={{ ...styles.cardItem, opacity: c.ativo ? 1 : 0.5 }}>
      <div style={styles.cardHeader}>
        <span style={styles.pokedex}>#{c.pokedex || "--"}</span>
        <span style={styles.badge}>{traduzRaridade(c.raridade)}</span>
      </div>

      {c.imagem && (
        <div style={styles.imageBox}>
          <img src={c.imagem} style={styles.image} />
        </div>
      )}

      <p style={styles.cardName}>{c.nome}</p>

      <p style={styles.meta}>{traduzElemento(c.elemento) || "-"}</p>

      <div style={styles.qtyBox}>
        <button onClick={() => updateQuantidade(c.id, (c.quantidade || 0) - 1)}>
          -
        </button>
        <span>{c.quantidade || 0}</span>
        <button onClick={() => updateQuantidade(c.id, (c.quantidade || 0) + 1)}>
          +
        </button>
      </div>

      <div style={styles.actions}>
        <button
          style={styles.secondaryButton}
          onClick={() => handleToggle(c, true)}
        >
          Habilitar
        </button>
        <button
          style={styles.primaryButton}
          onClick={() => handleToggle(c, false)}
        >
          Desabilitar
        </button>
      </div>
    </div>
  );
}

/* STYLES */

const styles: any = {
  page: {
    maxWidth: 1100,
    margin: "40px auto",
    padding: "0 16px",
    fontFamily: "sans-serif",
  },

  hero: { marginBottom: 28 },

  title: { fontSize: 26, fontWeight: 600 },

  subtitle: {
    fontSize: 14,
    color: "#777",
    fontWeight: 500,
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 24,
  },

  filterGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 28,
  },

  filterRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  },

  blockTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 12,
  },

  input: { padding: "12px", borderRadius: 12, border: "1px solid #ddd" },

  primaryButton: {
    padding: "10px",
    borderRadius: 10,
    background: "#000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "10px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 18,
    marginBottom: 20,
  },

  cardItem: {
    background: "#fff",
    borderRadius: 18,
    padding: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  cardHeader: { display: "flex", justifyContent: "space-between" },

  pokedex: { fontSize: 11, color: "#999" },

  imageBox: { background: "#f6f6f6", borderRadius: 12, padding: 8 },

  image: { width: "100%", height: 120, objectFit: "contain" },

  badge: {
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 999,
    background: "#eee",
  },

  cardName: { fontSize: 14, fontWeight: 600 },

  meta: { fontSize: 12, color: "#666" },

  qtyBox: {
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid #eee",
    borderRadius: 10,
    padding: "6px 10px",
  },

  actions: { display: "flex", gap: 6 },

  progressBox: { marginTop: 12 },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
  },

  progressBarBg: {
    height: 8,
    background: "#eee",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressBar: { height: 8, background: "#000" },

  chipsContainer: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },

  chip: {
    padding: '8px 12px',
    borderRadius: 999,
    border: '1px solid #ddd',
    fontSize: 12,
    cursor: 'pointer',
    background: '#fff',
    transition: '0.2s',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 28,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: '2px solid #eee',
  },
};
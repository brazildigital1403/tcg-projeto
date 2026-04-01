"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContribuirPage() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("donations")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        alert("Erro ao enviar imagem");
        setLoading(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("donations")
        .getPublicUrl(data.path);

      imageUrl = publicUrl.publicUrl;
    }

    const { error } = await supabase.from("donations").insert([
      {
        name,
        whatsapp,
        city,
        type: "cards",
        image_url: imageUrl,
      },
    ]);

    if (error) {
      alert("Erro ao enviar doação");
    } else {
      setSuccess(true);
      setName("");
      setWhatsapp("");
      setCity("");
      setFile(null);
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      {/* BLOCO EMOCIONAL */}
      <div style={styles.hero}>
        <div style={styles.icon}>💛</div>
        <h1 style={styles.title}>Sua carta pode mudar o começo de alguém</h1>
        <p style={styles.subtitle}>
          Tem gente querendo jogar, mas sem nenhuma carta. Você pode ser o
          primeiro passo dessa história.
        </p>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        {success && (
          <p style={styles.success}>
            Doação enviada com sucesso! 💛
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* NOME */}
          <div style={styles.field}>
            <label style={styles.label}>Seu nome</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* WHATS */}
          <div style={styles.field}>
            <label style={styles.label}>WhatsApp</label>
            <input
              style={styles.input}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
          </div>

          {/* CIDADE */}
          <div style={styles.field}>
            <label style={styles.label}>Cidade</label>
            <input
              style={styles.input}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* UPLOAD */}
          <div style={styles.field}>
            <label style={styles.label}>Foto das cartas</label>

            <label style={styles.uploadBox}>
              <input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                style={{ display: "none" }}
              />

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>📦</div>
                <p style={{ margin: "8px 0 4px" }}>
                  Clique para enviar ou arraste
                </p>
                <p style={styles.uploadHint}>
                  JPG ou PNG
                </p>

                {file && (
                  <p style={styles.fileName}>
                    {file.name}
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Enviando..." : "Quero contribuir"}
          </button>

          {/* MICRO TEXTO */}
          <p style={styles.helper}>
            Você não precisa enviar nada agora. A gente entra em contato com você.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

const styles: any = {
  page: {
    maxWidth: 520,
    margin: "40px auto",
    padding: "0 16px",
    fontFamily: "sans-serif",
  },

  hero: {
    textAlign: "center",
    marginBottom: 32,
  },

  icon: {
    fontSize: 32,
    marginBottom: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },

  success: {
    color: "green",
    marginBottom: 16,
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
    color: "#444",
  },

  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
  },

  uploadBox: {
    border: "2px dashed #ddd",
    borderRadius: 12,
    padding: 20,
    cursor: "pointer",
    background: "#fafafa",
  },

  uploadHint: {
    fontSize: 12,
    color: "#888",
  },

  fileName: {
    marginTop: 8,
    fontSize: 12,
    color: "#333",
  },

  button: {
    marginTop: 8,
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "#000",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
  },

  helper: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
};
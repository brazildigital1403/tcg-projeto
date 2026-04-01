"use client";

import { useEffect, useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  // carregar inicial
  useEffect(() => {
    const stored = localStorage.getItem("favorites");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        // 🔥 garante número + remove lixo
        const clean = parsed
          .map((id: any) => Number(id))
          .filter((id: number) => !isNaN(id));

        setFavorites(clean);
      } catch {
        setFavorites([]);
      }
    }

    setLoaded(true);
  }, []);

  function toggleFavorite(id: number) {
    if (!id || isNaN(id)) return;

    setFavorites((prev) => {
      const exists = prev.includes(id);

      const updated = exists
        ? prev.filter((f) => f !== id)
        : [...prev, id];

      localStorage.setItem("favorites", JSON.stringify(updated));

      return updated;
    });
  }

  function isFavorite(id: number) {
    return favorites.includes(id);
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    loaded,
  };
}
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL; // Объявляем глобально

export default function QueryInput({ onPlaylist }: { onPlaylist: (tracks: any[]) => void }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.playlist) onPlaylist(data.playlist);
    } catch {
      alert("Ошибка при получении плейлиста");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="query-form">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Напиши вайб плейлиста (например: для фокуса, лето, вдохновение)"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Генерируем..." : "Сгенерировать"}
      </button>
    </form>
  );
}

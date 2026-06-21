import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function Publisher() {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function publish(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/instagram/publish`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, caption }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Publish failed");
      setMessage(`Published successfully: ${data.mediaId}`);
      setImageUrl("");
      setCaption("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <form onSubmit={publish} style={styles.card}>
        <h1 style={styles.heading}>Post Publisher</h1>
        <p style={styles.copy}>The server handles the configured account authorization. No account password is entered on this page.</p>
        <label style={styles.label}>
          Public HTTPS image URL
          <input style={styles.input} type="url" required value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
        </label>
        <label style={styles.label}>
          Caption
          <textarea style={styles.input} rows="5" value={caption} onChange={(event) => setCaption(event.target.value)} />
        </label>
        <button style={styles.button} type="submit" disabled={loading}>{loading ? "Publishing..." : "Publish"}</button>
        {message && <p style={styles.message}>{message}</p>}
        <a href="/" style={styles.back}>Back to chat preview</a>
      </form>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: 20, display: "grid", placeItems: "center", background: "#f4f4f4", fontFamily: "system-ui, sans-serif" },
  card: { width: "min(100%, 560px)", padding: 28, borderRadius: 20, background: "white", border: "1px solid #ddd", boxShadow: "0 18px 50px rgba(0,0,0,.08)", display: "grid", gap: 16 },
  heading: { margin: 0 },
  copy: { margin: 0, color: "#666", lineHeight: 1.6 },
  label: { display: "grid", gap: 8, fontWeight: 700 },
  input: { width: "100%", padding: 12, border: "1px solid #ccc", borderRadius: 10, font: "inherit" },
  button: { minHeight: 44, padding: "11px 16px", border: 0, borderRadius: 10, background: "#0095f6", color: "white", fontWeight: 700, cursor: "pointer" },
  message: { margin: 0, padding: 12, borderRadius: 10, background: "#f3f3f3" },
  back: { color: "#555" },
};

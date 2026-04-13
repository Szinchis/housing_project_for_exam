import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiBase}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || data.error || "Hát ez nem jött össze...");
        setLoading(false);
        return;
      }

      if (typeof login === "function") {
        login(data.token);
      } else {
        console.warn("AuthContext.login nincs definiálva");
      }

      navigate("/");
    } catch (err) {
      console.error("Login hiba:", err);
      setError("Hálózati hiba történt. Próbáld újra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "420px", margin: "50px auto", padding: "12px" }}>
      <h2>Bejelentkezés</h2>

      <form onSubmit={handleLogin}>
        <label>Felhasználónév</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Jelszó</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Bejelentkezés..." : "Belépés"}
        </button>
      </form>
    </div>
  );
}

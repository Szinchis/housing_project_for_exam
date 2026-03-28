import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || "A regisztráció nem sikerült.");
      return;
    }

    setSuccess("Sikeres regisztráció! Most már bejelentkezhetsz.");
    setTimeout(() => navigate("/login"), 1500);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Regisztráció</h2>

      <form onSubmit={handleRegister}>
        <label>Felhasználónév</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Jelszó</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Regisztráció</button>
      </form>
    </div>
  );
}
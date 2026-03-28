import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Itt is szenvedünk kicsit az AuthContexttel.
import { AuthContext } from "../AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  //Itt az egész async functiont átirjuk, hogy az AuthContext megcsinálja helyette a token mentését és user lekérését, ilyen módon ->
  async function handleLogin(e) {
    e.preventDefault();
    setError("");

  const response = await fetch("http://localhost:8000/api/login/", {
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
    setError(data.detail || "Hát ez nem jött össze...");
    return;
  }

  //Itt hívjuk meg a globális login függvényt
  login(data.token);

  //Átirányítás a főoldalra
  navigate("/");
}

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Bejelentkezés</h2>

      <form onSubmit={handleLogin}>
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

        <button type="submit">Belépés</button>
      </form>
    </div>
  );
}
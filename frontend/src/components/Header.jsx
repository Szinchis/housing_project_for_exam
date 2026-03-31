import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{ padding: "20px", background: "#eee" }}>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/">Főoldal</Link>

        {user ? (
          <>
            <Link to="/profile">Profilom</Link>
            <Link to="/favorites">Kedvencek</Link> 
            <span>Bejelentkezve: {user.username}</span>
            <button onClick={logout}>Kijelentkezés</button>
          </>
        ) : (
          <>
            <Link to="/login">Bejelentkezés</Link>
            <Link to="/register">Regisztráció</Link>
          </>
        )}
      </nav>
    </header>
  );
}
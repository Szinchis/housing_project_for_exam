import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [headerFavorites, setHeaderFavorites] = useState([]);

  // Lekérdezi a kedvenceket (normalizálva decor_id-re)
  async function fetchHeaderFavorites() {
    const token = localStorage.getItem("token");
    if (!token) {
      setHeaderFavorites([]);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/favorites/", {
        headers: { Authorization: `Token ${token}` }
      });
      if (!res.ok) {
        console.error("Header favorites load failed:", res.status);
        setHeaderFavorites([]);
        return;
      }
      const data = await res.json();
      const normalized = data.map(f => ({
        ...f,
        decor_id: typeof f.decor === "object" ? f.decor.id : f.decor
      }));
      setHeaderFavorites(normalized);
    } catch (err) {
      console.error("Header favorites fetch error:", err);
      setHeaderFavorites([]);
    }
  }

  useEffect(() => {
    // Betöltés mountkor
    fetchHeaderFavorites();

    // Eseményfigyelő: Home dispatch-olni fogja ezt, ha változik a favorites
    const handler = () => fetchHeaderFavorites();
    window.addEventListener("favoritesChanged", handler);
    return () => window.removeEventListener("favoritesChanged", handler);
  }, []);

  return (
    <header className="header">
      <nav className="nav-container">

        {/* BAL OLDAL – Főoldal ikon */}
        <div className="nav-left">
          <Link to="/" className="home-icon">
            <img src="/home.png" alt="Home" className="home-img" />
          </Link>
        </div>

        {/* JOBB OLDAL – Login / Register vagy User menü */}
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/profile" className="header-btn">Profilom</Link>
              <Link to="/favorites" className="header-btn">
                Kedvencek{headerFavorites.length ? ` (${headerFavorites.length})` : ""}
              </Link>
              <span className="header-user">Bejelentkezve: {user.username}</span>
              <button onClick={logout} className="header-btn">Kijelentkezés</button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-btn">Bejelentkezés</Link>
              <Link to="/register" className="header-btn">Regisztráció</Link>
            </>
          )}
        </div>

      </nav>
    </header>
  );
}

import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

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
              <Link to="/favorites" className="header-btn">Kedvencek</Link>
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
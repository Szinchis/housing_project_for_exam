import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Favorites() {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  // Kedvencek lekérése
  useEffect(() => {
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/favorites/", {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setFavorites(data));
  }, [token]);

  // Kedvenc törlése
  function removeFavorite(favId) {
    fetch(`http://127.0.0.1:8000/api/favorites/${favId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`
      }
    }).then(() => {
      setFavorites(favorites.filter(f => f.id !== favId));
    });
  }




  // Ez a rész pedig a kedvenceink megjelenítéséért felelős. Itt egy listában jelenítjük meg a favorites state-ben tárolt kedvenceket, és minden kedvenc mellett van egy "Törlés" gomb, amire kattintva meghívjuk a removeFavorite függvényt, ami törli a kedvencet a backendről és frissíti a state-et is.
  return (
    <div style={{ padding: "20px" }}>
      <h1>Kedvenceid</h1>

      {favorites.length === 0 && (
        <p>Hát.. itt nem igazán találtam semmit sem.</p>
      )}

      <ul>
        {favorites.map(fav => (
          <li
            key={fav.id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              background: "#eee",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <p><strong>ID:</strong> {fav.decor.id}</p>
              <p><strong>Culture:</strong> {fav.decor.culture}</p>
              <p><strong>Style:</strong> {fav.decor.style}</p>
            </div>

            <button
              onClick={() => removeFavorite(fav.id)}
              style={{
                background: "none",
                border: "1px solid red",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
                color: "red"
              }}
            >
              Törlés
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
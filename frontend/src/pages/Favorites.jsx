import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Favorites() {
  const { token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token");

  const [favorites, setFavorites] = useState([]); // raw favorite objects
  const [decorList, setDecorList] = useState([]); // teljes dekor lista
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // openId és toggle (ugyanaz, mint a Home-ban)
  const [openId, setOpenId] = useState(null);
  function toggle(id) {
    setOpenId(prev => (prev === id ? null : id));
  }


  // Betöltjük a favorites-t és a teljes dekor listát
  async function loadAll() {
    if (!token) {
      setError("Nincs token");
      setFavorites([]);
      setDecorList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1) favorites
      const favRes = await fetch("http://localhost:8000/api/favorites/", {
        headers: { Authorization: `Token ${token}` }
      });
      if (!favRes.ok) throw new Error(`Favorites load failed: ${favRes.status}`);
      const favData = await favRes.json();
      const normalizedFavs = favData.map(f => ({
        ...f,
        decor_id: typeof f.decor === "object" ? f.decor.id : f.decor
      }));
      setFavorites(normalizedFavs);

      // 2) teljes dekor lista (ugyanaz, mint Home használ)
      const decRes = await fetch("http://localhost:8000/api/decors/");
      if (!decRes.ok) throw new Error(`Decors load failed: ${decRes.status}`);
      const decData = await decRes.json();
      setDecorList(decData);

      setError(null);
    } catch (err) {
      console.error(err);
      setError(String(err));
      setFavorites([]);
      setDecorList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();

    // hallgatunk a favoritesChanged eseményre, ha Home dispatch-olja
    const handler = () => loadAll();
    window.addEventListener("favoritesChanged", handler);
    return () => window.removeEventListener("favoritesChanged", handler);
  }, [token]);

  // Kedvenc törlése (ha kell)
  async function removeFavorite(favId) {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/favorites/${favId}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` }
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", res.status, text);
        return;
      }
      // újratöltjük a listákat (vagy lokálisan filterelhetünk)
      loadAll();
      window.dispatchEvent(new Event("favoritesChanged"));
    } catch (err) {
      console.error("removeFavorite error:", err);
    }
  }

  // Helper: készítünk egy Set-et a favorizált decor id-kból
  const favSet = new Set(favorites.map(f => f.decor_id));

  // Szűrt dekorok: csak a favorizáltak, megtartva a Home kártya classokat
  const favoriteDecors = decorList.filter(d => favSet.has(d.id));

  return (
    <main className="main-content" style={{ padding: 20 }}>
      <h1 className="main-title">Kedvenceid</h1>

      {loading && <p>Betöltés…</p>}
      {error && <p style={{ color: "red" }}>Hiba: {error}</p>}

      {!loading && favoriteDecors.length === 0 && <p>Nincsenek kedvenceid.</p>}

      <ul className="decor-list">
        {favoriteDecors.map(item => (
          <li key={item.id} className={`decor-item ${openId === item.id ? 'open' : ''}`}>
            <div
              className="decor-card"
              onClick={() => toggle(item.id)}
              role="button"
              aria-expanded={openId === item.id}
            >
              <div className="decor-main">
                <h2 className="decor-title">{item.name}</h2>
                <p className="decor-meta">{item.culture_name} • {item.style_name} • {item.expansion_name}</p>
                <p className="decor-submeta">Rarity: {item.rarity} • Patch: {item.patch}</p>
              </div>

              <div className="decor-controls">
                {/* A törlés gombot ne engedd, hogy a kártya toggle-olja a lenyílót */}
                <button
                  className="fav-btn fav"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const favObj = favorites.find(f => f.decor_id === item.id);
                    if (favObj) await removeFavorite(favObj.id);
                  }}
                  aria-label="Remove favorite"
                >
                  Törlés
                </button>

                {item.image && (
                  <img
                    className="decor-thumb"
                    src={item.image.startsWith("http") ? item.image : `http://localhost:8000${item.image}`}
                    alt={item.name}
                  />
                )}
              </div>
            </div>

            {/* lenyíló rész — placeholder mindig látható, nehéz tartalom csak ha open */}
            <div className="decor-details" aria-hidden={openId !== item.id}>
              <div className="details-placeholder">---</div>

              {openId === item.id && (
                <div className="details-heavy">
                  <div className="details-text">
                    <p><strong>Kategóriája:</strong> {item.category_name} / {item.subcategory_name}</p>
                    <p><strong>Kúltúra/Nép:</strong> {item.culture_name}</p>
                    <p><strong>Stílus:</strong> {item.style_name}</p>
                    <p><strong>Méret:</strong> {item.size_name}</p>
                    <p><strong>Expansion/Kieg.:</strong> {item.expansion_name}</p>
                    {item.description && <p className="decor-description">{item.description}</p>}
                  </div>

                  <div className="details-image">
                    {item.image && (
                      <img
                        className="decor-large"
                        src={item.image.startsWith("http") ? item.image : `http://localhost:8000${item.image}`}
                        alt={item.name}
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

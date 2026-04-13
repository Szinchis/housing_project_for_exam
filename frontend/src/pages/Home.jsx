import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";

// Home komponens
export default function Home({ decors }) {
  // Auth token a contextből; ha nincs, fallback localStorage-re
  const { token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token");

  // Alap state-ek
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState({}); // { [decorId]: true/false }

  const [decorList, setDecorList] = useState([]);

  // Szűrők / keresés
  const [search, setSearch] = useState("");
  const [cultureFilter, setCultureFilter] = useState("");
  const [styleFilter, setStyleFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [expansionFilter, setExpansionFilter] = useState("");

  // Dropdown adatok
  const [cultures, setCultures] = useState([]);
  const [styles, setStyles] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [expansions, setExpansions] = useState([]);

  // --- Betöltések -------------------------------------------------------
  // 1) Dekorok betöltése (ha nem propból jön)
  useEffect(() => {
    // Ha decors prop nincs, töltsük le
    if (!decors || decors.length === 0) {
      fetch("http://localhost:8000/api/decors/")
        .then(res => {
          if (!res.ok) throw new Error(`Decors load failed: ${res.status}`);
          return res.json();
        })
        .then(data => setDecorList(data))
        .catch(err => console.error("Failed to load decors:", err));
    } else {
      setDecorList(decors);
    }
  }, [decors]);

  // 2) Kedvencek betöltése (ha van token)
  useEffect(() => {
    if (!token) {
      setFavorites([]);
      return;
    }

    fetch("http://localhost:8000/api/favorites/", {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Favorites load failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Normalizálás: biztosítjuk, hogy minden fav-ban legyen decor_id
        const normalized = data.map(f => ({
          ...f,
          decor_id: typeof f.decor === "object" ? f.decor.id : f.decor
        }));
        setFavorites(normalized);
      })
      .catch(err => {
        console.error("Failed to load favorites:", err);
        setFavorites([]);
      });
  }, [token]);







  // --- Segédfüggvények a favorizáláshoz ---------------------------------

  // isFavorite: kezeli, ha fav.decor lehet id vagy objektum, illetve decor_id mezőt
  function isFavorite(decorId) {
    return favorites.some(fav => {
      if (!fav) return false;
      if (fav.decor_id) return fav.decor_id === decorId;
      if (typeof fav.decor === "number") return fav.decor === decorId;
      if (fav.decor && typeof fav.decor === "object") return fav.decor.id === decorId;
      return false;
    });
  }

  // Egyetlen, teljes toggleFavorite implementáció (POST / DELETE kezelve, favLoading védelem)
  async function toggleFavorite(decorId) {
    if (favLoading[decorId]) return; // már folyamatban van

    const currentToken = ctxToken || localStorage.getItem("token");
    if (!currentToken) {
      console.warn("Nincs token, nem lehet kedvencet módosítani");
      return;
    }

    // Megkeressük a meglévő favorite-ot (ha van)
    const fav = favorites.find(f => {
      if (!f) return false;
      if (f.decor_id) return f.decor_id === decorId;
      if (typeof f.decor === "number") return f.decor === decorId;
      if (f.decor && typeof f.decor === "object") return f.decor.id === decorId;
      return false;
    });

    setFavLoading(prev => ({ ...prev, [decorId]: true }));

    try {
      if (fav) {
        // Törlés
        const res = await fetch(`http://localhost:8000/api/favorites/${fav.id}/`, {
          method: "DELETE",
          headers: { Authorization: `Token ${currentToken}` }
        });

        const text = await res.text();
        console.log("DELETE status:", res.status, "body:", text);

        if (res.ok) {
          setFavorites(prev => prev.filter(f => f.id !== fav.id));
          // miután frissítetted a setFavorites-t (pl. setFavorites(prev => [...prev, normalized]) vagy setFavorites(prev => prev.filter(...)))
          window.dispatchEvent(new Event("favoritesChanged"));

        } else {
          console.error("Delete failed:", res.status, text);
        }
      } else {
        // Helyi ellenőrzés, hogy elkerüljük a duplikátumot
        if (isFavorite(decorId)) {
          console.log("Already favorite (local check)");
        } else {
          // Hozzáadás
          const res = await fetch("http://localhost:8000/api/favorites/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${currentToken}`
            },
            body: JSON.stringify({ decor_id: decorId })
          });

          const text = await res.text();
          console.log("POST status:", res.status, "body:", text);

          if (res.ok) {
            const newFav = JSON.parse(text);
            const normalized = {
              ...newFav,
              decor_id: typeof newFav.decor === "object" ? newFav.decor.id : newFav.decor
            };
            setFavorites(prev => [...prev, normalized]);
            // miután frissítetted a setFavorites-t (pl. setFavorites(prev => [...prev, normalized]) vagy setFavorites(prev => prev.filter(...)))
            window.dispatchEvent(new Event("favoritesChanged"));

          } else {
            // Ha a backend kontrollált hibát ad (pl. már létezik), csak logoljuk
            console.error("Add failed:", res.status, text);
          }
        }
      }
    } catch (err) {
      console.error("toggleFavorite error:", err);
    } finally {
      setFavLoading(prev => ({ ...prev, [decorId]: false }));
    }
  }

  // (A komponens további része itt folytatódik...)








  // Ide pedig a Build Query URL rész jön, ami felépiti az URL-eket a szűrési lehetőségek alapján. Ez a rész azért fontos, mert a backendünk támogatja a szűrést query paraméterekkel, és nekünk ezt ki kell használnunk, hogy a dekorjainkat a szűrési lehetőségek alapján tudjuk megjeleníteni. Ezért minden szűrőváltozáskor újra lekérjük a dekorokat a backendről.
  function buildQueryURL() {
    let url = "http://127.0.0.1:8000/api/decors/?";

    if (search) url += `search=${search}&`;
    if (cultureFilter) url += `culture=${cultureFilter}&`;
    if (styleFilter) url += `style=${styleFilter}&`;
    if (sizeFilter) url += `size=${sizeFilter}&`;
    if (categoryFilter) url += `category=${categoryFilter}&`;
    if (subcategoryFilter) url += `subcategory=${subcategoryFilter}&`;
    if (expansionFilter) url += `expansion=${expansionFilter}&`;

    return url;
  }
  // És ha már itt vagyunk, akkor nem is teszem máshová, mert még a return előtt meg kell hozni a useEffect-et, ami lekéri a dekorokat a backendről a buildQueryURL függvény által generált URL alapján, és beállítja a decorList state-et a kapott adatokkal.
  useEffect(() => {
    const url = buildQueryURL();

    fetch(url)
      .then(res => res.json())
      .then(data => setDecorList(data));
  }, [
    search,
    cultureFilter,
    styleFilter,
    sizeFilter,
    categoryFilter,
    subcategoryFilter,
    expansionFilter
  ]);











  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/culture/")
      .then(res => res.json())
      .then(data => setCultures(data));

    fetch("http://127.0.0.1:8000/api/style/")
      .then(res => res.json())
      .then(data => setStyles(data));

    fetch("http://127.0.0.1:8000/api/size/")
      .then(res => res.json())
      .then(data => setSizes(data));

    fetch("http://127.0.0.1:8000/api/categories/")
      .then(res => res.json())
      .then(data => setCategories(data));

    fetch("http://127.0.0.1:8000/api/subcategories/")
      .then(res => res.json())
      .then(data => setSubcategories(data));

    fetch("http://127.0.0.1:8000/api/expansions/")
      .then(res => res.json())
      .then(data => setExpansions(data));
  }, []);










  // Ez a rész pedig a decorjaink megjelenítéséért felelős. Itt egy listában jelenítjük meg a decors prop-ban kapott dekorációkat, és minden dekorációra kattintva megjelenik egy részletes nézet, ahol láthatjuk a dekoráció ID-jét, kultúráját és stílusát. A toggle függvény segítségével kezeljük, hogy melyik dekoráció részletei vannak éppen megnyitva, ez kattintással változik. Legalább is reméljük.
  const [openId, setOpenId] = useState(null);

  function toggle(id) {
    setOpenId(openId === id ? null : id);
  }

  return (
    <>
      {/* Ez a rész a keresési és szűrési lehetőségek megjelenítéséért felelős. Itt egy keresőmező van, ahol szövegesen kereshetünk a dekorációk között, ezéé lett az elején az a sok sztét! */}
      <div className="search-container">
        <h2>Keresés és szűrés</h2>

        {/* Keresőmező */}
        <input
          type="text"
          placeholder="Keresés..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />

        {/* Kultúra */}
        <select
          value={cultureFilter}
          onChange={(e) => setCultureFilter(e.target.value)}
        >
          <option value="">Összes kultúra</option>
          {cultures.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Stílus */}
        <select
          value={styleFilter}
          onChange={(e) => setStyleFilter(e.target.value)}
        >
          <option value="">Összes stílus</option>
          {styles.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Méret */}
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
        >
          <option value="">Összes méret</option>
          {sizes.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Kategória */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Összes kategória</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Alkategória */}
        <select
          value={subcategoryFilter}
          onChange={(e) => setSubcategoryFilter(e.target.value)}
        >
          <option value="">Összes alkategória</option>
          {subcategories.map(sc => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>

        {/* Expansion */}
        <select
          value={expansionFilter}
          onChange={(e) => setExpansionFilter(e.target.value)}
        >
          <option value="">Összes expansion</option>
          {expansions.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>











      {/* Itten lesznek a decorjaink. */}
      <h1 className="main-title">A DEKOROK LISTÁJA</h1>


      <ul className="decor-list">
        {decorList.map(item => (
          <li key={item.id} className={`decor-item ${openId === item.id ? 'open' : ''}`}>
            <div className="decor-card"
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
                <button
                  className={isFavorite(item.id) ? "fav-btn fav" : "fav-btn"}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                  aria-label="Toggle favorite"
                  disabled={!!favLoading[item.id]}
                >
                  {isFavorite(item.id) ? "❤️" : "🤍"}
                </button>
                {/*Ide cuppantjuk a képeinket -> */}
                {item.image && (
                  <img
                    className="decor-thumb"
                    src={item.image.startsWith("http") ? item.image : `http://localhost:8000${item.image}`}
                    alt={item.name}
                  />
                )}

              </div>
            </div>





            {/* Ebben a részben alapvetően az openId alapján kezeltük a lenyilló rész megjelenitését, viszont most kivettük ebből az adatokat, hogy folyamatosan renderelve legyen az oldalon a részletes nézete és innentől kezdve a CSS-ben fogjuk kezelni, hogy mikor legyen látható ez a rész, és mikor ne. */}

            {/* Kell egy konténer, amiben létrehozok egy egyszerű szöveg-itemet. Igy nem terhelem a teljes rendereléssel a böngészőt */}
            <div className="decor-details" aria-hidden={openId !== item.id}>
              {/* A könnyű placeholder mindig látható */}
              <div className="details-placeholder">---</div>

              {/* Nehéz tartalom csak nyitva renderelődik */}
              {openId === item.id && (
                <div className="details-heavy">
                  <div className="details-text">
                    <p><strong>Kategóriája:</strong> {item.category_name} / {item.subcategory_name}</p>
                    <p><strong>Kúltúra/Nép:</strong> {item.culture_name}</p>
                    <p><strong>Stílus:</strong> {item.style_name}</p>
                    <p><strong>Méret:</strong> {item.size_name}</p>
                    <p><strong>Expansion/Kieg.:</strong> {item.expansion_name}</p>

                    {item.description && (
                      <p className="decor-description">{item.description}</p>
                    )}
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


      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

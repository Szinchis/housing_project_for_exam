import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'

//Ezeket az importálásokat is megcsináltuk, hogy itt legyen, mert az App.jsx már úgy se tud vele épp mit csinálni...

import { useState, useEffect, useContext } from "react";
// Itt kiegészitjük az AuthContext importálását is, a favoritoláshoz.
import { AuthContext } from "../AuthContext";









//Ez maga a "komponensünk", ami a Home oldalunk lesz, és itt fogjuk megjeleníteni a decorjainkat is. A decors prop-ot az App.jsx-ből kapja majd meg, ahol lekérjük az adatokat a backendről.
export default function Home({ decors }) {
  // A favoritoláshoz szükségünk lesz a tokenre, amit az AuthContext-ből fogunk kinyerni, és egy favorites state-re, amiben a kedvenceinket fogjuk tárolni. Az useEffect-ben pedig lekérjük a kedvenceinket a backendről, ha van tokenünk. A segédfüggvények pedig az isFavorite, addFavorite és removeFavorite lesznek, amikkel kezelni tudjuk a kedvenceinket. Ezeket majd a decorjaink megjelenítésekor fogjuk használni, hogy meg tudjuk jeleníteni, melyik decor van a kedvenceink között, és hogy hozzá tudjuk adni vagy eltávolítani őket a kedvenceink közül.
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  //A decors prop helyett a Home.jsx fogja lekérni a dekorokat, ezért kell neki egy State ->
  const [decorList, setDecorList] = useState([]);





  //Ezek pedig a keresési opciók state-jei, amiket majd a dekorjaink szűrésére fogunk használni. Ezeket is a Home komponensben tároljuk, mert itt fogjuk megjeleníteni a dekorjainkat, és itt lesznek a szűrési lehetőségek is.
  // Keresés + szűrők
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

  // Segédfüggvények is IDE jönnek ---------------------------------------

  function isFavorite(decorId) {
    return favorites.some(fav => fav.decor === decorId);
  }

  function addFavorite(decorId) {
    fetch("http://127.0.0.1:8000/api/favorites/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({ decor_id: decorId })
    })
      .then(res => res.json())
      .then(newFav => setFavorites([...favorites, newFav]));
  }

  function removeFavorite(decorId) {
    const fav = favorites.find(f => f.decor === decorId);
    if (!fav) return;

    fetch(`http://127.0.0.1:8000/api/favorites/${fav.id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`
      }
    }).then(() => {
      setFavorites(favorites.filter(f => f.id !== fav.id));
    });
  }





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
      <h1>A DEKOROK LISTÁJA</h1>
      <ul>
        {decorList.map(item => (
          <li key={item.id} style={{ marginBottom: "10px" }}>
            <div
              onClick={() => toggle(item.id)}
              style={{
                cursor: "pointer",
                padding: "10px",
                background: "#111827",
                color: "#e5e7eb",
                borderRadius: "8px",
                border: "1px solid #4b5563",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                {/* FŐ CÍM: DECOR NEVE */}
                <h2 style={{ margin: 0, fontSize: "18px", color: "#fbbf24" }}>
                  {item.name}
                </h2>

                {/* ALÁ: KULTÚRA / STÍLUS / KIEGÉSZÍTŐ */}
                <p style={{ margin: "4px 0", fontSize: "12px", color: "#9ca3af" }}>
                  {item.culture_name} • {item.style_name} • {item.expansion_name}
                </p>

                {/* RITKASÁG + PATCH */}
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                  Rarity: {item.rarity} • Patch: {item.patch}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isFavorite(item.id) ? removeFavorite(item.id) : addFavorite(item.id);
                }}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  color: isFavorite(item.id) ? "red" : "gray"
                }}
              >
                {isFavorite(item.id) ? "❤️" : "🤍"}
              </button>
            </div>

            {openId === item.id && (
              <div
                style={{
                  padding: "10px",
                  background: "#020617",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                  marginTop: "5px",
                  color: "#e5e7eb",
                  fontSize: "12px"
                }}
              >
                <p><strong>ID:</strong> {item.id}</p>
                <p><strong>Category:</strong> {item.category_name} / {item.subcategory_name}</p>
                <p><strong>Culture:</strong> {item.culture_name}</p>
                <p><strong>Style:</strong> {item.style_name}</p>
                <p><strong>Size:</strong> {item.size_name}</p>
                <p><strong>Expansion:</strong> {item.expansion_name}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

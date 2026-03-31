import { useState, useEffect } from 'react'

import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";


//Az app.jsx becsomagolása az AuthProviderbe, hogy minden oldalunkon elérhető legyen a user állapot és a login/logout függvények, amiket majd a headerben fogunk használni, hogy megjelenítsük a bejelentkezett felhasználó nevét és egy kijelentkezés gombot.

import { AuthProvider } from "./AuthContext";


//Itt pedig importáljuk a headerünket ->
import Header from "./components/Header";


//Itt meg regisztrációs weblapot importálgatunk ->
import Register from "./pages/Register";


//Itt a profil oldalt importáljuk ->
import Profile from "./pages/Profile";
//És itt a védett útvonalat, amivel megvédjük a profil oldalunkat, hogy csak bejelentkezve lehessen elérni ->
import ProtectedRoute from "./components/ProtectedRoute";
//És végül a kedvenceink oldalát is importáljuk, ahol megjelenítjük a kedvenceinket, és ahol tudjuk kezelni őket ->
import Favorites from "./pages/Favorites";



function App() {
  const [count, setCount] = useState(0)
  
/*  useEffect(() => {
    fetch("http://localhost:8000/api/test/")
      .then(res => res.json())
      .then(data => console.log("BACKEND OK:", data))
      .catch(err => console.error("HIBA:", err));

    fetch("http://localhost:8000/api/decors/")
      .then(res => res.json())
      .then(data => console.log("DECORS:", data))
      .catch(err => console.error("HIBA:", err));
    //Ezzel megadjuk a decor útvonalát is a tesztelés számára!
  }, []);
*/




/*  
  const [decors, setDecors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/decors/")
      .then(res => res.json())
      .then(data => setDecors(data))
      .catch(err => console.error("HIBA:", err));
  }, []);
*/
//Ezzel megjelenítjük a decorokat a frontend oldalon is, mármint TÉNYLEGES formában, nem csak a konzolon...
//.......és ügye el is tüntetjük, mert a Home.jsx-ben a keresési funkció miatt már nem a decors-t használjuk, hanem a decorList-et, ami a keresési eredményeket tartalmazza, innentől az App már tényleg csak részleges funkciókban fog szerepelni, mint a routerezésnél... ettől függetlenül ezt is itt hagyom, ha esetleges hibafaktorként bármi fellépne a funkciók alatt, akkor ezzel lehet tesztelni, hogy a backend rendben van-e, és hogy a decorok megjelennek-e egyáltalán a frontend oldalon, vagy sem. Erre persze a -<Route path="/" element={<Home decors={decors} />} />-(ez az eredeti)- elemet is a rúútoknál módositom a megfelelő módon.







//Innen meg az alapértelmezett VITE kódsort áttettük a Home.jsx-be, hogy az legyen az alapértelmezett oldalunk, innentől kezdve az APP-ból csak routereket fogunk meghivkálni különböző oldalakra.
//Nah meg azért csak adjon vissza valamit ez is, igy ebbe a "return" részbe fogjuk a routokat megadni.

return (
  <AuthProvider>
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);


}

export default App

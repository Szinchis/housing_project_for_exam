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




  
  const [decors, setDecors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/decors/")
      .then(res => res.json())
      .then(data => setDecors(data))
      .catch(err => console.error("HIBA:", err));
  }, []);
//Ezzel megjelenítjük a decorokat a frontend oldalon is, mármint TÉNYLEGES formában, nem csak a konzolon...







//Innen meg az alapértelmezett VITE kódsort áttettük a Home.jsx-be, hogy az legyen az alapértelmezett oldalunk, innentől kezdve az APP-ból csak routereket fogunk meghivkálni különböző oldalakra.
//Nah meg azért csak adjon vissza valamit ez is, igy ebbe a "return" részbe fogjuk a routokat megadni.

return (
  <AuthProvider>
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home decors={decors} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);


}

export default App

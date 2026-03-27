import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

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






  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>

        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
        </div>
      </section>

      {/* Itten lesznek a decorjaink. */}
      <h1>Decor lista</h1>
      <ul>
        {decors.map(item => (
          <li key={item.id}>
            ID: {item.id} – Culture: {item.culture} – Style: {item.style}
          </li>
        ))}
      </ul>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )

}

export default App

import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'

//Ezeket az importálásokat is megcsináltuk, hogy itt legyen, mert az App.jsx már úgy se tud vele épp mit csinálni...



export default function Home({ decors }) {
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


{/*Itt volt egy counter gomb, de ügye azt kivettem, mert ide már nem kell...*/}



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


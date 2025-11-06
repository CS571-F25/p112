import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>CS571 – Project p112 (Franco Pastor)</h1>
      <p>Proof-of-concept publish via GitHub Pages. Built with Vite + React.</p>

      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div className="card">
        <button onClick={() => setCount(c => c + 1)}>count is {count}</button>
        <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>
    </>
  )
}

export default App

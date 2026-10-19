import { useState } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!searchTerm.trim()) {
      return
    }

    console.log('Searching for:', searchTerm)
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>GitHub Repository Explorer</h1>
        <p>Discover repositories and explore what developers are building.</p>
      </header>

      <section className="search-section">
        <form onSubmit={handleSubmit}>
          <label htmlFor="repository-search">
            Search repositories
          </label>

          <div className="search-form">
            <input
              id="repository-search"
              type="search"
              placeholder="Try React, JavaScript, or Vue..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button type="submit">Search</button>
          </div>
        </form>
      </section>

      <section className="results-section" aria-live="polite">
        <h2>Explore repositories</h2>
        <p>Enter a search term to get started.</p>
      </section>
    </main>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import { searchRepositories } from './services/githubApi'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!searchTerm.trim()) {
      setError('Please enter a search term.')
      setRepositories([])
      return
    }

    setLoading(true)
    setError('')
    setRepositories([])

    try {
      const data = await searchRepositories(searchTerm.trim())
      setRepositories(data.items)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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

            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </section>

      <section className="results-section" aria-live="polite">
        <h2>Search results</h2>

        {loading && <p>Loading repositories...</p>}

        {error && <p className="error-message" role="alert">{error}</p>}

        {!loading && !error && repositories.length === 0 && (
          <p>Search for a topic to discover repositories.</p>
        )}

        {!loading && repositories.length > 0 && (
          <div className="repository-list">
            {repositories.map((repo) => (
              <article className="repository-card" key={repo.id}>
                <div className="repository-owner">
                  <img
                    src={repo.owner.avatar_url}
                    alt={`${repo.owner.login}'s avatar`}
                    className="owner-avatar"
                  />
                  <span>{repo.owner.login}</span>
                </div>

                <h3>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {repo.full_name}
                  </a>
                </h3>

                <p>
                  {repo.description || 'No description provided.'}
                </p>

                <div className="repository-stats">
                  <span>Language: {repo.language || 'Not specified'}</span>
                  <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                  <span>🍴 {repo.forks_count.toLocaleString()}</span>
                  <span>Open issues: {repo.open_issues_count.toLocaleString()}</span>
                </div>

                <small>
                  Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App

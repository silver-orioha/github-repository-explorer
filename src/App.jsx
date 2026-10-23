
import { useState } from 'react'
import './App.css'
import { searchRepositories } from './services/githubApi'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [repositories, setRepositories] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [sortBy, setSortBy] = useState('stars')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!searchTerm.trim()) {
      setError('Please enter a search term.')
      setRepositories([])
      setTotalCount(0)
      return
    }

    setPage(1)
    await fetchRepositories(searchTerm.trim(),1)
  }

  async function fetchRepositories(term, pageNumber) {
    setLoading(true)
    setError('')

    try {
      const data = await searchRepositories(term, pageNumber, sortBy)
      setRepositories(data.items)
      setTotalCount(data.total_count)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setRepositories([])
      setTotalCount(0)
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
  
        <div className="sort-control">
          <label htmlFor="sort-by">Sort repositories by</label>

          <select
            id="sort-by"
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value)
              setPage(1)

              if (searchTerm.trim()) {
                fetchRepositories(searchTerm.trim(), 1)
              }
            }}
          >
            <option value="stars">Most stars</option>
            <option value="updated">Recently updated</option>
          </select>
        </div>
      </section>

      <section className="results-section" aria-live="polite">
        <h2>Search results</h2>

        {loading && <p>Loading repositories...</p>}

        {error && (
        <div className="error-container">
          <p className="error-message" role="alert">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              fetchRepositories(searchTerm.trim(), page)
            }
            disabled={loading}
          >
      {loading ? 'Retrying...' : 'Try again'}
    </button>
  </div>
)}

        {!loading && !error && repositories.length === 0 && (
          <p>
            {searchTerm.trim()
            ? 'No repositories found. Try a a different search term.'
            : 'Search for a topic to discover repositories.'}
          </p>
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
        
        {!loading && repositories.length > 0 && (
          <div className="pagination">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => {
                const previousPage = page - 1
                setPage(previousPage)
                fetchRepositories(searchTerm.trim(), previousPage)
              }}
            >
              Previous
            </button>

            <span>
              Page {page} of {Math.max(1, Math.ceil(Math.min(totalCount, 1000) / 10))}
            </span>

            <button
              type="button"
              disabled={page >= Math.ceil(Math.min(totalCount, 1000) / 10)}
              onClick={() => {
                const nextPage = page + 1
                setPage(nextPage)
                fetchRepositories(searchTerm.trim(), nextPage)
              }}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default App

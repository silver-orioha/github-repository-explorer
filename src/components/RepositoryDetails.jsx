import { useEffect, useState } from 'react'
import { getRepositoryContributors } from '../services/githubApi'

function RepositoryDetails({ repository, onBack }) {

  const [contributors, setContributors] = useState([])
  const [loadingContributors, setLoadingContributors] = useState(true)
  const [contributorError, setContributorError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadContributors() {
      setLoadingContributors(true)
      setContributorError('')
      setContributors([])

      try {
        const data = await getRepositoryContributors(
          repository.owner.login,
          repository.name
        )

        if (!cancelled) {
          setContributors(data)
        }
      } catch (err) {
        if (!cancelled) {
          setContributorError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoadingContributors(false)
        }
      }
    }

    loadContributors()

    return () => {
      cancelled = true
    }
  }, [repository.owner.login, repository.name])

  return (
    <section className="details-container">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Back to results
      </button>

      <div className="details-card">
        <div className="details-owner">
          <img
            src={repository.owner.avatar_url}
            alt={`${repository.owner.login}'s avatar`}
            className="owner-avatar"
          />

          <span>{repository.owner.login}</span>
        </div>

        <h2>{repository.full_name}</h2>

        <p>
          {repository.description || 'No description provided.'}
        </p>

        <div className="details-stats">
          <p>
            <strong>Language:</strong>{' '}
            {repository.language || 'Not specified'}
          </p>

          <p>
            <strong>Stars:</strong>{' '}
            {repository.stargazers_count.toLocaleString()}
          </p>

          <p>
            <strong>Forks:</strong>{' '}
            {repository.forks_count.toLocaleString()}
          </p>

          <p>
            <strong>Watchers:</strong>{' '}
            {repository.subscribers_count?.toLocaleString() ??
              repository.watchers_count.toLocaleString()}
          </p>

          <p>
            <strong>Open issues:</strong>{' '}
            {repository.open_issues_count.toLocaleString()}
          </p>

          <p>
            <strong>Default branch:</strong>{' '}
            {repository.default_branch}
          </p>

          <p>
            <strong>Created:</strong>{' '}
            {new Date(repository.created_at).toLocaleDateString()}
          </p>

          <p>
            <strong>Last updated:</strong>{' '}
            {new Date(repository.updated_at).toLocaleDateString()}
          </p>
        </div>

        <section className="contributors-section">
          <h3>Contributors</h3>

          {loadingContributors && <p>Loading contributors...</p>}

          {contributorError && (
            <p role="alert">{contributorError}</p>
          )}

          {!loadingContributors &&
            !contributorError &&
            (contributors &&
            contributors?.length === 0) && (
              <p>No contributors found.</p>
            )}

          {!loadingContributors && (contributors && contributors?.length > 0) && (
            <ul className="contributors-list">
              {contributors.map((contributor) => (
                <li key={contributor.id}>
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={contributor.avatar_url}
                      alt=""
                      className="contributor-avatar"
                    />
                    <span>{contributor.login}</span>
                  </a>

                  <span>
                    {contributor.contributions.toLocaleString()} contributions
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <a
          className="github-link"
          href={repository.html_url}
          target="_blank"
          rel="noreferrer"
        >
          View repository on GitHub ↗
        </a>
      </div>
    </section>
  )
}

export default RepositoryDetails;
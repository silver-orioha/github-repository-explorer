const GITHUB_API_URL = 'https://api.github.com'

export async function searchRepositories(searchTerm, page = 1, sortBy = 'stars') {
  const params = new URLSearchParams({
    q: searchTerm,
    sort: 'sortBy',
    order: 'desc',
    page: String(page),
    per_page: '12',
  })

  const response = await fetch(
    `${GITHUB_API_URL}/search/repositories?${params}`
  )

  if (!response.ok) {
    throw new Error(
      response.status === 403
        ? 'GitHub API rate limit reached. Please try again later.'
        : `GitHub API request failed (${response.status}).`
    )
  }

  return response.json()
}

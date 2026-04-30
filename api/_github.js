const API = 'https://api.github.com';

export function getConfig() {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !GITHUB_BRANCH) {
    throw new Error('Faltan variables de entorno de GitHub.');
  }
  return { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH };
}

export async function githubRequest(path, options = {}) {
  const { GITHUB_TOKEN } = getConfig();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text.slice(0, 250)}`);
  }
  return res.json();
}

export function repoBase() {
  const { GITHUB_OWNER, GITHUB_REPO } = getConfig();
  return `/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
}

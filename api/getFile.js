const required = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_BRANCH'];
const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
};
const repoBase = () => `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const path = req.query.path;
  if (!path) return res.status(400).json({ error: 'path es requerido' });

  try {
    validateEnv();
    const response = await fetch(`${repoBase()}/contents/${encodeURIComponent(path)}?ref=${process.env.GITHUB_BRANCH}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || 'Error GitHub API' });
    return res.status(200).json({ path, sha: data.sha, content: Buffer.from(data.content || '', 'base64').toString('utf-8') });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error interno' });
  }
}

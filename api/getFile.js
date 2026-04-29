import { getConfig, githubRequest, repoBase } from './_github.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const path = req.query.path;
  if (!path) return res.status(400).json({ error: 'path es requerido' });
  try {
    const { GITHUB_BRANCH } = getConfig();
    const file = await githubRequest(`${repoBase()}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`);
    const content = Buffer.from(file.content, 'base64').toString('utf8');
    return res.status(200).json({ path, sha: file.sha, content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

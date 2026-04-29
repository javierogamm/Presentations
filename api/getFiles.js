import { getConfig, githubRequest, repoBase } from './_github.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { GITHUB_BRANCH } = getConfig();
    const tree = await githubRequest(`${repoBase()}/git/trees/${encodeURIComponent(GITHUB_BRANCH)}?recursive=1`);
    const files = tree.tree
      .filter((item) => item.type === 'blob' && /\.(html|css|js)$/i.test(item.path))
      .map(({ path, sha, size }) => ({ path, sha, size }));
    return res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

import { getConfig, githubRequest, repoBase } from './_github.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { path, content, message = `chore: update ${path}` } = req.body || {};
  if (!path || typeof content !== 'string') return res.status(400).json({ error: 'path y content son requeridos' });

  try {
    const { GITHUB_BRANCH } = getConfig();
    let sha;
    try {
      const current = await githubRequest(`${repoBase()}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`);
      sha = current.sha;
    } catch {
      sha = undefined;
    }

    const payload = {
      message,
      branch: GITHUB_BRANCH,
      content: Buffer.from(content, 'utf8').toString('base64'),
      ...(sha ? { sha } : {}),
    };

    const result = await githubRequest(`${repoBase()}/contents/${encodeURIComponent(path)}`, { method: 'PUT', body: JSON.stringify(payload) });
    return res.status(200).json({ ok: true, commitSha: result.commit.sha });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

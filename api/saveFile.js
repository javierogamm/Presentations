const required = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_BRANCH'];
const headers = () => ({
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
});
const repoBase = () => `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { path, content, message } = req.body || {};
  if (!path || typeof content !== 'string') return res.status(400).json({ error: 'path y content son obligatorios' });

  try {
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length) throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);

    const currentResp = await fetch(`${repoBase()}/contents/${encodeURIComponent(path)}?ref=${process.env.GITHUB_BRANCH}`, { headers: headers() });
    const currentData = await currentResp.json();
    if (!currentResp.ok) return res.status(currentResp.status).json({ error: currentData.message || 'No se pudo leer archivo' });

    const updateResp = await fetch(`${repoBase()}/contents/${encodeURIComponent(path)}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({
        message: message || `Update ${path} from editor`,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        sha: currentData.sha,
        branch: process.env.GITHUB_BRANCH,
      }),
    });
    const updateData = await updateResp.json();
    if (!updateResp.ok) return res.status(updateResp.status).json({ error: updateData.message || 'No se pudo guardar' });

    return res.status(200).json({ ok: true, sha: updateData.content.sha, commit: updateData.commit.sha });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error interno' });
  }
}

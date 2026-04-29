import saveFileHandler from './saveFile.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message = 'chore: batch update', files } = req.body || {};
  if (!Array.isArray(files) || files.length === 0) return res.status(400).json({ error: 'files debe ser un array no vacío' });

  try {
    const results = [];
    for (const file of files) {
      const fakeReq = { method: 'POST', body: { ...file, message } };
      const fakeRes = {
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.payload = payload; return this; },
      };
      await saveFileHandler(fakeReq, fakeRes);
      if (fakeRes.statusCode >= 400) throw new Error(fakeRes.payload?.error || 'Error guardando archivo');
      results.push(fakeRes.payload);
    }
    return res.status(200).json({ ok: true, commitSha: results.at(-1).commitSha, files: results.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function apiGetFiles() {
  const res = await fetch('/api/getFiles');
  if (!res.ok) throw new Error(`Error cargando archivos: ${res.status}`);
  return res.json();
}

export async function apiGetFile(path) {
  const res = await fetch(`/api/getFile?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error(`Error cargando archivo: ${res.status}`);
  return res.json();
}

export async function apiCommitChanges(message, files) {
  const res = await fetch('/api/commitChanges', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, files }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error guardando cambios: ${res.status}`);
  }
  return res.json();
}

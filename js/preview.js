let currentUrl;

export function renderPreview(iframe, html) {
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  const blob = new Blob([html], { type: 'text/html' });
  currentUrl = URL.createObjectURL(blob);
  iframe.src = currentUrl;
}

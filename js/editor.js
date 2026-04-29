import { apiGetFiles, apiGetFile, apiCommitChanges } from '/js/githubService.js';
import { renderPreview } from '/js/preview.js';

const filesListEl = document.getElementById('filesList');
const saveBtn = document.getElementById('saveBtn');
const refreshBtn = document.getElementById('refreshBtn');
const statusEl = document.getElementById('status');
const previewFrame = document.getElementById('previewFrame');

let editor;
let selectedPath = null;
const openFiles = new Map();

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? '#ff7b7b' : '#aeb7c4';
}

function detectLanguage(path) {
  if (path.endsWith('.html')) return 'html';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.js')) return 'javascript';
  return 'plaintext';
}

function updatePreviewIfHtml(path, content) {
  if (path.endsWith('.html')) renderPreview(previewFrame, content);
}

async function loadFile(path) {
  try {
    setStatus(`Cargando ${path}...`);
    const data = await apiGetFile(path);
    selectedPath = path;
    openFiles.set(path, data.content);
    editor.setModel(monaco.editor.createModel(data.content, detectLanguage(path)));
    updatePreviewIfHtml(path, data.content);
    document.querySelectorAll('.file-item').forEach((el) => el.classList.toggle('active', el.dataset.path === path));
    setStatus(`Editando ${path}`);
  } catch (err) {
    setStatus(err.message, true);
  }
}

async function loadFilesList() {
  try {
    setStatus('Cargando lista de archivos...');
    const data = await apiGetFiles();
    filesListEl.innerHTML = '';
    data.files.forEach((f) => {
      const li = document.createElement('li');
      li.className = 'file-item';
      li.dataset.path = f.path;
      li.textContent = f.path;
      li.addEventListener('click', () => loadFile(f.path));
      filesListEl.appendChild(li);
    });
    setStatus(`Archivos cargados: ${data.files.length}`);
  } catch (err) {
    setStatus(err.message, true);
  }
}

async function saveChanges() {
  if (!selectedPath) return setStatus('Selecciona un archivo primero.', true);
  const content = editor.getValue();
  openFiles.set(selectedPath, content);
  try {
    setStatus('Guardando en GitHub...');
    const result = await apiCommitChanges(`edit: actualizar ${selectedPath}`, [{ path: selectedPath, content }]);
    setStatus(`Commit OK: ${result.commitSha.slice(0, 7)}. Vercel redeploy en curso.`);
  } catch (err) {
    setStatus(err.message, true);
  }
}

function setupMonaco() {
  window.require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.52.2/min/vs' } });
  window.require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('editorContainer'), {
      value: '<!-- Selecciona un archivo -->',
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
    });
    editor.onDidChangeModelContent(() => {
      if (!selectedPath) return;
      const content = editor.getValue();
      openFiles.set(selectedPath, content);
      updatePreviewIfHtml(selectedPath, content);
    });
  });
}

saveBtn.addEventListener('click', saveChanges);
refreshBtn.addEventListener('click', loadFilesList);
setupMonaco();
loadFilesList();

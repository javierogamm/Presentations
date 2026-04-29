import { githubService } from '/js/githubService.js';
import { updatePreview } from '/js/preview.js';

let editor;
let currentPath = '';
let currentSha = '';
const state = new Map();

const fileList = document.getElementById('fileList');
const currentFile = document.getElementById('currentFile');
const saveButton = document.getElementById('saveButton');
const status = document.getElementById('status');
const previewFrame = document.getElementById('livePreview');

const extFromPath = (path) => path.split('.').pop() || 'txt';
const setStatus = (text) => { status.textContent = text; };

function createEditor() {
  return new Promise((resolve) => {
    window.require.config({
      paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' },
    });

    window.require(['vs/editor/editor.main'], () => {
      editor = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        language: 'html',
        theme: 'vs-dark',
        automaticLayout: true,
      });
      resolve();
    });
  });
}

function languageFromExt(ext) {
  if (ext === 'html') return 'html';
  if (ext === 'css') return 'css';
  if (ext === 'js') return 'javascript';
  return 'plaintext';
}

async function loadFiles() {
  setStatus('Cargando archivos...');
  const { files } = await githubService.getFiles();
  fileList.innerHTML = '';
  files.forEach((file) => {
    const btn = document.createElement('button');
    btn.className = 'file-item';
    btn.textContent = file.path;
    btn.onclick = () => openFile(file.path, btn);
    fileList.appendChild(btn);
  });
  setStatus(`${files.length} archivos cargados`);
}

async function openFile(path, buttonEl) {
  try {
    setStatus(`Abriendo ${path}...`);
    document.querySelectorAll('.file-item').forEach((el) => el.classList.remove('active'));
    buttonEl.classList.add('active');

    const { content, sha } = await githubService.getFile(path);
    currentPath = path;
    currentSha = sha;
    currentFile.textContent = path;
    editor.setValue(content);
    monaco.editor.setModelLanguage(editor.getModel(), languageFromExt(extFromPath(path)));
    state.set(path, { content, sha });
    updatePreview(content, extFromPath(path), previewFrame);
    setStatus(`Editando ${path}`);
  } catch (error) {
    setStatus(`Error: ${error.message}`);
  }
}

async function saveCurrentFile() {
  if (!currentPath) {
    setStatus('Selecciona un archivo primero');
    return;
  }

  const content = editor.getValue();
  setStatus('Guardando en GitHub...');

  try {
    const message = `Update ${currentPath} from web editor`;
    const result = await githubService.saveFile(currentPath, content, message);
    currentSha = result.sha;
    state.set(currentPath, { content, sha: result.sha });
    await githubService.commitChanges([currentPath]);
    setStatus('Guardado y commit realizados. Vercel redeploy en curso.');
  } catch (error) {
    setStatus(`Error al guardar: ${error.message}`);
  }
}

(async function init() {
  try {
    await createEditor();
    await loadFiles();
    editor.onDidChangeModelContent(() => {
      const content = editor.getValue();
      updatePreview(content, extFromPath(currentPath), previewFrame);
    });
    saveButton.addEventListener('click', saveCurrentFile);
  } catch (error) {
    setStatus(`Error de inicialización: ${error.message}`);
  }
})();

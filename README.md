# Editor de Presentaciones HTML (GitHub + Vercel)

Aplicación web completa para editar archivos HTML/CSS/JS desde navegador, con vista previa en tiempo real y persistencia en GitHub usando API routes seguras en Vercel.

## Estructura

- `public/index.html`: Home
- `public/editor.html`: UI de edición (sidebar + Monaco + preview + guardar)
- `js/app.js`: bootstrap home
- `js/editor.js`: lógica principal del editor
- `js/githubService.js`: cliente frontend para `/api`
- `js/preview.js`: preview en vivo usando Blob + iframe
- `api/getFiles.js`: lista de archivos del repo
- `api/getFile.js`: lectura de archivo
- `api/saveFile.js`: guardado + commit en GitHub
- `api/commitChanges.js`: endpoint de confirmación de commit/redeploy
- `vercel.json`: rutas y configuración de despliegue

## Variables de entorno en Vercel

Configura en Project Settings → Environment Variables:

- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

> Nunca exponer el token en frontend. Solo se usa en `/api` con `process.env`.

## Flujo

1. Abrir `/editor`.
2. El editor carga archivos del repo (`.html`, `.css`, `.js`).
3. Seleccionar archivo.
4. Editar en Monaco.
5. Preview inmediato por iframe + Blob (sin redeploy).
6. Guardar: backend hace commit en GitHub.
7. Vercel detecta commit y redeploya automáticamente.

## Deploy

1. Conecta el repositorio en Vercel.
2. Define las variables de entorno.
3. Haz deploy.


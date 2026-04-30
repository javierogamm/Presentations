# Editor de Presentaciones HTML (Vercel + GitHub)

## Variables de entorno (Vercel)
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

## Flujo
1. Abrir `/editor.html`.
2. Seleccionar archivo HTML/CSS/JS desde GitHub.
3. Editar en Monaco Editor.
4. Ver preview en vivo (Blob + iframe, sin redeploy).
5. Guardar para hacer commit automático en GitHub.
6. Vercel redeploya automáticamente por push al repositorio.

## Estructura
- `/public`: landing y editor.
- `/js`: frontend modular.
- `/api`: rutas serverless seguras con token backend.

## Seguridad
- El token de GitHub se usa solo en backend (`process.env.GITHUB_TOKEN`).
- No se expone ningún secreto en frontend.

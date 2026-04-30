const presentations = [
  { name: 'Configuración de procesos', path: '/Configuracion%20procesos%20-%20Gestiona/Configuraci%C3%B3n%20de%20procesos%20-%20Gestiona.html' },
  { name: 'Archivo electrónico', path: '/ARCHIVO/Archivo%20electronico%20-%20Gestiona.html' },
  { name: 'Archivo electrónico 2', path: '/Archivo%202/Archivo%20electronico%20-%20Gestiona.html' },
];

const list = document.getElementById('presentations-list');

presentations.forEach((p) => {
  const li = document.createElement('li');
  li.className = 'card';
  li.innerHTML = `<h3>${p.name}</h3><a class="btn" target="_blank" rel="noopener" href="${p.path}">Abrir</a>`;
  list.appendChild(li);
});

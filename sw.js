const CACHE_NAME = 'geometry-subway-v1';
// Lista todos tus archivos aquí (importante incluir sonidos e imágenes)
const assets = [
  './',
  './index.html',
  './boot.js',
  './carga.js',
  './inicio.js',
  './juego.js',
  './main.js',
  './manifest.json',
  './sw.js',
  './botonplay.png',
  './Bubble2.png',
  './cubo.jpg',
  './fondete.jpg',
  './fondo.jpg',
  './Fondo1.png',
  './logo.png',
  './obstaculo2.png',
  './obstaculo.png',
  './Piso.png',
  './Plataforma.png',
  './suelo.jpg',
  './spike.png',
  './explosion.mp3' ,
  './Juego.mp3' ,
  './Menu.mp3' ,
  './salto.mp3' 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
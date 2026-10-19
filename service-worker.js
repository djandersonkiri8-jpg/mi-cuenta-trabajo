// Sube este número cada vez que cambies cualquier archivo de la app.
const VERSION='mct-v3';
const ASSETS=['./calculadora-trabajo.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{
  // No usa skipWaiting automático: la versión nueva espera a que el usuario acepte actualizar.
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mct-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data==='SKIP')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith(caches.match('./calculadora-trabajo.html').then(c=>c||fetch(r)));return;
  }
  e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(VERSION).then(ca=>ca.put(r,cp))}return res})));
});

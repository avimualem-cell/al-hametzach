const C='hu-v3',F=['./','index.html','style.css','app.js','data.js','manifest.json','icon.svg','icon-192.png','icon-512.png','apple-touch-icon.png','favicon-32.png','logo.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));

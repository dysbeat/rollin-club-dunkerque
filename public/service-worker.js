!function(){"use strict";const e=["client/chunk.02e5f8c2.js","client/chunk.b30f0ec3.js","client/index.36feecfc.js","client/_layout.05fbb653.js","client/chunk.5985df63.js","client/2016-2017.b6b8ba8b.js","client/2017-2018.6a07519d.js","client/2018-2019.6c4a7ae9.js","client/contact.1a623e59.js","client/index.257a48f9.js","client/chunk.09600617.js","client/equipes.e558fe3e.js","client/client.31214a13.js","client/chunk.9291e025.js"].concat(["service-worker-index.html","favicon.png","global.css","logo.png","manifest.json"]),t=new Set(e);self.addEventListener("install",t=>{t.waitUntil(caches.open("cache1567850556767").then(t=>t.addAll(e)).then(()=>{self.skipWaiting()}))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(async e=>{for(const t of e)"cache1567850556767"!==t&&await caches.delete(t);self.clients.claim()}))}),self.addEventListener("fetch",e=>{if("GET"!==e.request.method||e.request.headers.has("range"))return;const c=new URL(e.request.url);c.protocol.startsWith("http")&&(c.hostname===self.location.hostname&&c.port!==self.location.port||(c.host===self.location.host&&t.has(c.pathname)?e.respondWith(caches.match(e.request)):"only-if-cached"!==e.request.cache&&e.respondWith(caches.open("offline1567850556767").then(async t=>{try{const c=await fetch(e.request);return t.put(e.request,c.clone()),c}catch(c){const n=await t.match(e.request);if(n)return n;throw c}}))))})}();

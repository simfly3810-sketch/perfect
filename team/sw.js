// 오프라인에서도 앱 화면이 열리도록 화면 파일만 보관해요. 인터넷이 되면 항상 최신 파일을 먼저 받아요.
const C='cleanops-team-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  const ok=u.origin===self.location.origin||u.hostname==='www.gstatic.com';
  if(!ok)return;
  e.respondWith(
    fetch(r).then(res=>{
      if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{});}
      return res;
    }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||Response.error()))
  );
});

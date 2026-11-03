/* eslint-disable no-unused-vars, no-empty */
// Scroll-moment analytics helper, installed in the browser only (the site is
// also rendered on the server at build time, where there is no window).
export function installSigTrack() {
  if (typeof window === "undefined") return;
  // Scroll-moment analytics: sends to Caspian's own event log, and to GA4 / Vercel if the page has them.
  (function(){
    if (window.sigTrack) return;
    var URL_ = "https://gjpbiiqkvzysmdpioexk.supabase.co/functions/v1/moment-event";
    var sent = {};
    function vid(){ try{ var v=localStorage.getItem("sig-vid"); if(!v){ v=Math.random().toString(36).slice(2)+Date.now().toString(36); localStorage.setItem("sig-vid",v);} return v; }catch(e){ return "anon"; } }
    window.sigTrack = function(site, ev, meta, repeat){
      if (!repeat) { if (sent[site+ev]) return; sent[site+ev]=1; }
      var body = JSON.stringify({ site:site, event:ev, path:location.pathname, visitor:vid(),
        device: innerWidth<=760 ? "phone":"desk", meta: meta||null });
      try { if (!(navigator.sendBeacon && navigator.sendBeacon(URL_, body))) fetch(URL_, {method:"POST", body:body, keepalive:true}); } catch(e){}
      try { if (window.gtag) window.gtag("event", "moment_"+ev, Object.assign({ site:site }, meta||{})); } catch(e){}
      try { if (window.va) window.va("event", { name:"moment_"+ev, data:Object.assign({ site:site }, meta||{}) }); } catch(e){}
    };
  })();
}

export function sig(ev, meta, repeat) {
  try {
    if (typeof window !== "undefined" && window.sigTrack) window.sigTrack("amreen", ev, meta, repeat);
  } catch { /* never break the page */ }
}

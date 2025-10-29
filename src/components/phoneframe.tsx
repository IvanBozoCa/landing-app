import { useEffect, useRef, useState } from "react";

type Props = { title: string; src: string };

export default function PhoneFrame({ title, src }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const timerIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // reset al cambiar el src
    setLoaded(false);
    setErr(null);

    // timer de seguridad: si no carga en 8s, muestra aviso
    if (timerIdRef.current) clearTimeout(timerIdRef.current);
    timerIdRef.current = window.setTimeout(() => {
      setErr("No se detectó carga en el tiempo esperado (posible bloqueo o login).");
    }, 8000);

    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, [src]); // <-- solo depende de src (sin warnings)

  const forceReload = () => {
    const el = document.getElementById(`frame-${title}`) as HTMLIFrameElement | null;
    if (el) {
      const u = new URL(el.src || src);
      u.searchParams.set("_t", String(Date.now()));
      el.src = u.toString();
      setLoaded(false);
      setErr(null);
    }
  };

  if (!src) {
    return (
      <div style={{
        width:"100%", maxWidth:"min(380px, 90vw)", aspectRatio:"9/16",
        borderRadius:28, border:"1px solid #2b3450", display:"flex",
        alignItems:"center", justifyContent:"center", background:"#1f2937", color:"#fecaca", padding:12
      }}>
        Falta configurar la URL de {title}. Revisa tus variables <code>VITE_*</code>.
      </div>
    );
  }

  return (
    <div
      style={{
        width:"100%", maxWidth:"min(380px, 90vw)", aspectRatio:"9/16",
        borderRadius:28, overflow:"hidden", border:"1px solid #2b3450",
        boxShadow:"0 8px 24px rgba(0,0,0,.25)", position:"relative", background:"#000"
      }}
    >
      {/* barra superior */}
      <div style={{ position:"absolute", top:8, left:8, right:8, display:"flex", justifyContent:"space-between", zIndex:3 }}>
        <div style={{color:"#fff", fontSize:12, opacity:.85}}>{title}</div>
        <div style={{display:"flex", gap:6}}>
          <button onClick={forceReload}
            style={{padding:"4px 8px", borderRadius:8, border:"1px solid #334155", background:"#0f172a", color:"#e2e8f0", fontSize:12, cursor:"pointer"}}
          >
            Recargar
          </button>
          <a href={src} target="_blank" rel="noreferrer"
             style={{padding:"4px 8px", borderRadius:8, border:"1px solid #334155", background:"#0f172a", color:"#e2e8f0", fontSize:12, textDecoration:"none"}}>
            Abrir directo
          </a>
        </div>
      </div>

      {!loaded && !err && (
        <div style={{
          position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          color:"#cbd5e1", fontSize:14, background:"linear-gradient(180deg,#0b1220,#0f172a)", zIndex:1
        }}>
          Cargando…
        </div>
      )}

      {err && (
        <div style={{ position:"absolute", inset:0, padding:16, color:"#fee2e2", background:"#7f1d1d", fontSize:13, lineHeight:1.4, zIndex:2 }}>
          <b>No se pudo visualizar en el iframe.</b>
          <div style={{marginTop:8, opacity:.9}}>
            {err}<br />
            Prueba con “Abrir directo” para descartar cookies/challenge de terceros.
          </div>
        </div>
      )}

      <iframe
        id={`frame-${title}`}
        title={title}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allow="geolocation *; clipboard-read; clipboard-write; fullscreen"
        onLoad={() => {
          if (timerIdRef.current) clearTimeout(timerIdRef.current);
          setLoaded(true);
          setErr(null);
        }}
        onError={() => setErr("El navegador reportó error de red/bloqueo al cargar el documento.")}
      />
    </div>
  );
}

// src/App.tsx
import { useMemo, useState } from "react";
import PhoneFrame from "./components/phoneframe"; // deja tu componente como ya lo tienes

export default function App() {
  // 1) Lee variables de entorno (Vite)
  const envConductor = import.meta.env.VITE_URL_CONDUCTOR as string | undefined;
  const envApoderado = import.meta.env.VITE_URL_APODERADO as string | undefined;
  const envDashboard = import.meta.env.VITE_DASHBOARD_URL as string | undefined;

  // 2) Overrides por query (útil en local para probar rápido)
  const params = new URLSearchParams(window.location.search);
  const qConductor = params.get("conductor") || undefined;
  const qApoderado = params.get("apoderado") || undefined;
  const qSwagger = params.get("swagger") || undefined;

  // 3) Modo proxy (para local). Si luego agregas el proxy en vite.config.ts,
  //    podrás visitar http://localhost:5173/?proxy=1 y ver las apps en "mismo origen".
  const useProxy = import.meta.env.DEV && params.get("proxy") === "1";

  // 4) Resolver URLs finales con prioridad: query > env > (dev+proxy) > vacío
  const conductorURL = useMemo(() => {
    if (qConductor) return qConductor;
    if (envConductor) return envConductor;
    if (useProxy) return "/app-conductor/";
    return "";
  }, [qConductor, envConductor, useProxy]);

  const apoderadoURL = useMemo(() => {
    if (qApoderado) return qApoderado;
    if (envApoderado) return envApoderado;
    if (useProxy) return "/app-apoderado/";
    return "";
  }, [qApoderado, envApoderado, useProxy]);

  const dashboardURL = useMemo(() => {
    if (qSwagger) return qSwagger;
    if (envDashboard) return envDashboard;
    return "";
  }, [qSwagger, envDashboard]);

  // 5) Forzar recarga de ambos iframes
  const [reloadKey, setReloadKey] = useState(0);
  const recargar = () => setReloadKey((v) => v + 1);

  // 6) Debug toggle
  const [showDebug, setShowDebug] = useState(import.meta.env.DEV);

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e7e9ee" }}>
      <div style={{ width: "100%", margin: "0 auto", padding: "16px" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h1 style={{ fontSize: 20, margin: 0 }}>
            Demo Transporte Escolar — Vistas en vivo
          </h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={recargar}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #2b3450",
                background: "#131a2a",
                color: "#e7e9ee",
                cursor: "pointer",
              }}
            >
              Recargar vistas
            </button>

            <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={showDebug}
                onChange={(e) => setShowDebug(e.target.checked)}
              />
              Debug
            </label>
          </div>
        </header>

        {showDebug && (
          <div
            style={{
              fontSize: 12,
              opacity: 0.9,
              marginBottom: 10,
              lineHeight: 1.5,
              background: "#0f172a",
              border: "1px dashed #334155",
              padding: "8px",
              borderRadius: 8,
            }}
          >
            <div><b>Conductor URL:</b> {conductorURL || "(vacío)"} </div>
            <div><b>Apoderado URL:</b> {apoderadoURL || "(vacío)"} </div>
            <div><b>Swagger URL:</b> {dashboardURL || "(vacío)"} </div>
            {useProxy && <div style={{ marginTop: 4 }}>Modo proxy local activo (<code>?proxy=1</code>).</div>}
            {!conductorURL || !apoderadoURL ? (
              <div style={{ color: "#fca5a5", marginTop: 6 }}>
                Faltan URLs. Define <code>VITE_CONDUCTOR_URL</code> y <code>VITE_APODERADO_URL</code> o usa overrides por query.
              </div>
            ) : null}
          </div>
        )}

        {/* 2 "celulares" */}
        <section
          key={reloadKey}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            alignItems: "start",
            justifyItems: "center",
            margin: "12px 0 20px",
          }}
        >
          <PhoneFrame title="Conductor" src={conductorURL} />
          <PhoneFrame title="Apoderado" src={apoderadoURL} />
        </section>

        {/* Swagger / Panel inferior */}
        <section>
          <h2 style={{ fontSize: 18, margin: "12px 0" }}>Panel (Swagger)</h2>
          <div
            style={{
              height: "min(70vh, 560px)",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #2b3450",
              boxShadow: "0 8px 24px rgba(0,0,0,.2)",
              background: "#fff",
            }}
          >
            {dashboardURL ? (
              <iframe
                title="Swagger / Panel"
                src={dashboardURL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
              />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#111827",
                  background: "#f8fafc",
                }}
              >
                Falta configurar <code>VITE_DASHBOARD_URL</code> o usar <code>?swagger=URL</code>.
              </div>
            )}
          </div>
        </section>

        <footer style={{ textAlign: "center", opacity: 0.6, marginTop: 20 }}>
          © {new Date().getFullYear()} Demo Transporte Escolar
        </footer>
      </div>
    </div>
  );
}

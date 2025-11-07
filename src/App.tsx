// ==== INICIO — App.tsx ====
/* src/App.tsx */
import { useMemo, useState } from "react";
import "./App.css";
import PhoneFrame from "./components/phoneframe";

export default function App() {
  // URLs desde .env (dos variantes por cada uno)
  const envConductor = import.meta.env.VITE_URL_CONDUCTOR as string | undefined;
  const envConductorAlt = import.meta.env.VITE_CONDUCTOR_URL as string | undefined;

  const envApoderado = import.meta.env.VITE_URL_APODERADO as string | undefined;
  const envApoderadoAlt = import.meta.env.VITE_APODERADO_URL as string | undefined;

  const envDashboard = import.meta.env.VITE_DASHBOARD_URL as string | undefined;

  // Admin (nuevas variables)
  const envAdmin = import.meta.env.VITE_URL_ADMIN as string | undefined;
  const envAdminAlt = import.meta.env.VITE_ADMIN_URL as string | undefined;

  // Overrides por query
  const params = new URLSearchParams(window.location.search);
  const qConductor = params.get("conductor") || undefined;
  const qApoderado = params.get("apoderado") || undefined;
  const qSwagger = params.get("swagger") || undefined;
  const qAdmin = params.get("admin") || undefined;

  const [reloadKey] = useState(0);

  // Resolución final de URLs
  const conductorURL = useMemo(() => qConductor ?? envConductor ?? envConductorAlt ?? "", [qConductor, envConductor, envConductorAlt]);
  const apoderadoURL = useMemo(() => qApoderado ?? envApoderado ?? envApoderadoAlt ?? "", [qApoderado, envApoderado, envApoderadoAlt]);
  const dashboardURL  = useMemo(() => qSwagger   ?? envDashboard  ?? "",            [qSwagger, envDashboard]);
  const adminURL      = useMemo(() => qAdmin     ?? envAdmin      ?? envAdminAlt ?? "", [qAdmin, envAdmin, envAdminAlt]);

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e7e9ee" }}>
      <div className="appContainer">
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            margin: "8px 0 12px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "clamp(18px, 2.6vw, 24px)" }}>
            Demo — Transporte Escolar
          </h1>
          <div style={{ display: "flex", gap: 8 }} />
        </header>

        {/* Celulares + texto lateral */}
        <section aria-labelledby="demo-hero-title" className="heroGrid" style={{ margin: "12px 0 20px" }}>
          <div
            key={reloadKey}
            className="phonesGrid"
            style={{ display: "grid", gap: 20, alignItems: "start", justifyItems: "center" }}
          >
            {/* CONDUCTOR */}
            <div className="phoneItem" aria-label="Vista Conductor y credenciales">
              <PhoneFrame title="" src={conductorURL} />
              <div className="phoneCreds" role="group" aria-label="Credenciales de prueba - Conductor">
                <ul className="credList">
                  <li><strong>Usuario:</strong> Conductor@gmail.com</li>
                  <li><strong>Clave:</strong> Conductor#123</li>
                </ul>
              </div>
            </div>

            {/* APODERADO */}
            <div className="phoneItem" aria-label="Vista Apoderado y credenciales">
              <PhoneFrame title="" src={apoderadoURL} />
              <div className="phoneCreds" role="group" aria-label="Credenciales de prueba - Apoderado">
                <ul className="credList">
                  <li><strong>Usuario:</strong> Apoderado@gmail.com</li>
                  <li><strong>Clave:</strong> Apoderado#123</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Texto lateral */}
          <aside className="phonesAside" role="complementary" aria-label="Descripción de la demo">
            <h2 id="demo-hero-title" className="heroTitle">Transporte Escolar, claro y en vivo</h2>

            <p className="heroLead">
              Administra rutas del día, asistencia y notificaciones en tiempo real.
              Esta demo muestra el flujo completo entre <strong>Conductor</strong> y <strong>Apoderado</strong>,
              desde iniciar la ruta hasta marcar <em>recogido/entregado</em>.
            </p>

            <ul className="heroList" aria-label="Beneficios principales">
              <li>Rutas del día con un solo clic</li>
              <li>Notificaciones al apoderado en tiempo real</li>
              <li>Recogido/Entregado con trazabilidad</li>
            </ul>

            <ol className="heroTry" aria-label="Prueba rápida">
              <li><strong>Conductor</strong>: genera la <em>Ruta del día</em> y pulsa <em>Iniciar ruta</em>. Marca uno o dos estudiantes como <em>recogidos</em>.</li>
              <li><strong>Apoderado</strong>: observa el cambio de estado en vivo. Si habilitas las notificaciones del navegador en la vista de Apoderado, también recibirás un aviso.</li>
            </ol>
          </aside>
        </section>

        {/* Panel del Administrador */}
        <section aria-labelledby="admin-title" className="adminBlock" style={{ marginTop: 8 }}>
          <div style={{ maxWidth: "min(100vw, 1600px)", margin: "0 auto", padding: "0 16px" }}>
            <div className="adminHeader" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
              <h2 id="admin-title" className="heroTitle" style={{ marginBottom: 0 }}>
                Panel del Administrador
              </h2>
            </div>

            {adminURL ? (
              <>
                <div
                  role="region"
                  aria-label="Vista embebida del Admin"
                  style={{
                    width: "100%",
                    height: "clamp(720px, 85vh, 1400px)",
                    border: "1px solid rgba(231, 233, 238, 0.12)",
                    borderRadius: 12,
                    background: "rgba(231, 233, 238, 0.02)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                >
                  <iframe
                    src={adminURL}
                    title="Admin - Plataforma de gestión"
                    loading="lazy"
                    style={{ width: "100%", height: "100%", border: 0, display: "block" }}
                  />
                </div>

                {/* AJUSTE: credenciales con la MISMA estructura visual que conductor/apoderado */}
                <div className="phoneCreds" role="group" aria-label="Credenciales de prueba - Administrador" style={{ marginTop: 8 }}>
                  <ul className="credList">
                    <li><strong>Usuario:</strong> AdminDemo@gmail.com</li>
                    <li><strong>Clave:</strong> Admindemo#123</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="adminFallback" role="status" aria-live="polite">
                No se encontró <code>VITE_URL_ADMIN</code> / <code>VITE_ADMIN_URL</code>.
                Configura la variable o usa <code>?admin=URL</code>.
              </div>
            )}
          </div>
        </section>

        {/* Swagger */}
        <div style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}>
          <section aria-labelledby="swagger-title" className="swaggerBlock" style={{ marginTop: 24 }}>
            <div style={{ maxWidth: "min(100vw, 1600px)", margin: "0 auto", padding: "0 16px" }}>
              <div className="swaggerHeader" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <h2 id="swagger-title" className="heroTitle" style={{ marginBottom: 0 }}>
                  API de la demo (Swagger)
                </h2>
              </div>

              {dashboardURL ? (
                <div
                  role="region"
                  aria-label="Vista embebida de Swagger"
                  style={{
                    width: "100%",
                    height: "clamp(720px, 85vh, 1400px)",
                    border: "1px solid rgba(231, 233, 238, 0.12)",
                    borderRadius: 12,
                    background: "rgba(231, 233, 238, 0.02)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                >
                  <iframe
                    src={dashboardURL}
                    title="Swagger - API de la demo"
                    loading="lazy"
                    style={{ width: "100%", height: "100%", border: 0, display: "block" }}
                  />
                </div>
              ) : (
                <div className="swaggerFallback" role="status" aria-live="polite">
                  No se encontró <code>VITE_DASHBOARD_URL</code>. Configura la variable o usa <code>?swagger=URL</code>.
                </div>
              )}
            </div>
          </section>
        </div>

        <footer style={{ textAlign: "center", opacity: 0.6, marginTop: 20 }}>
          © {new Date().getFullYear()} Demo Transporte Escolar
        </footer>
      </div>
    </div>
  );
}
// ==== FIN — App.tsx ====

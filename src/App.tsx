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
          <h1 style={{ margin: 0, fontSize: "clamp(18px, 2.6vw, 24px)", alignContent:"center"}}>
            Demo — Transporte Escolar
          </h1>
          <div style={{ display: "flex", gap: 8 }} />
        </header>
          {/* Contexto en rectángulo bajo el título */}
<div
  role="region"
  aria-label="Contexto de la demo"
  style={{
    width: "100%",
    margin: "12px 0 20px",
    padding: "16px 18px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    boxSizing: "border-box",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    hyphens: "auto",
  }}
>
  {/* Columna con ancho consistente para P y UL */}
  <div style={{ maxWidth: "none", width: "100%", display: "grid", rowGap: 10 }}>
  <p className="heroLead" style={{ marginTop: 0, maxWidth: "inherit", lineHeight: 1.6 }}>
    <strong>Contexto real:</strong> Un cliente administrador de transporte escolar no podía delegar
    eficazmente porque las rutas vivían como conocimiento tácito, lo que impedía tomar días libres
    y generaba dependencias. Durante la pandemia, además, las familias solicitaban ubicación por
    WhatsApp, elevando la fricción operativa y el riesgo de errores al compartirla.
  </p>

  <p className="heroLead" style={{ maxWidth: "none", lineHeight: 1.6 }}>
    <strong>Objetivo del proyecto:</strong> profesionalizar la operación con un panel centralizado,
    visibilidad por roles y trazabilidad en tiempo real, reduciendo la coordinación manual vía
    mensajería y permitiendo la delegación segura de las rutas.
  </p>

  <p className="heroLead" style={{ maxWidth: "none", lineHeight: 1.6 }}>
    <strong>Solución implementada:</strong> (1) panel de administración para crear apoderados y
    vincular hijos con conductores; (2) <em>rutas fijas</em> con orden definido por el administrador
    que el conductor activa como <em>Ruta del día</em> (pueden incluir estudiantes de distintos
    colegios y horarios); (3) asistencia declarada por el apoderado que excluye automáticamente a
    los ausentes al iniciar la ruta; (4) generación automática de la <em>ruta de vuelta</em> con el
    orden invertido (<em>ida:</em> 1,2,3 → <em>vuelta:</em> 3,2,1); (5) actualización
  dinámica de ruta activa: al marcar a un estudiante como <em>recogido</em> o
  <em> entregado</em>, se retira de las paradas pendientes y el cambio se refleja de inmediato
  en la vista del conductor y del apoderado.
  </p>

  <div aria-hidden="true" style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "2px 0 6px" }} />

  <h3 style={{ margin: "6px 0 0" }}>Resultados esperados</h3>
  <ul
    className="heroList"
    aria-label="Resultados en la operación diaria"
    style={{
      maxWidth: "none",
      listStyle: "disc",
      listStylePosition: "outside",
      paddingLeft: "1.25rem",
      margin: "6px 0 0",
    }}
  >
    <li style={{ marginBottom: 6 }}>
      <strong>Menos tiempo al teléfono:</strong> el conductor deja de responder llamadas/mensajes
      para confirmar <em>recogido/entregado</em> o llegada; el apoderado lo ve en la aplicación en tiempo real.
    </li>
    <li style={{ marginBottom: 6 }}>
      <strong>Seguimiento claro:</strong> estados por estudiante (<em>recogido</em>/<em>entregado</em>)
      y avance de la ruta visibles según rol. En móvil: notificaciones push (Firebase). En web: actualización en pantalla.
    </li>
    <li style={{ marginBottom: 6 }}>
      <strong>Operación delegable:</strong> las rutas quedan parametrizadas y documentadas; cualquier conductor
      asignado puede iniciar la <em>Ruta del día</em> y ejecutar el recorrido previsto.
    </li>
    <li>
      <strong>Cierre de jornada:</strong> finalización de ruta y registro de eventos, útil para control interno y trazabilidad.
    </li>
  </ul>
</div>

</div>

        {/* Celulares + texto lateral */}
        <section aria-labelledby="demo-hero-title" className="heroGrid" style={{ margin: "12px 0 20px" }}>
          <div
  key={reloadKey}
  className="phonesGrid"
  style={{ display: "grid", gap: 20, alignItems: "start", justifyItems: "center" }}
>
  {/* CONDUCTOR */}
  <div className="phoneItem" aria-label="Vista Conductor y credenciales">
    <h2 id="admin-title" className="heroTitle" style={{ marginBottom: 0, textAlign:"center"}} >
                Conductor
              </h2>
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
    <h2 id="admin-title" className="heroTitle" style={{ marginBottom: 0, textAlign:"center"}} >
                Apoderado
              </h2>
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
  <h2 id="demo-hero-title" className="heroTitle">Qué puedes probar:</h2>

  <p className="heroLead">
    Flujo entre <strong>Conductor</strong> y <strong>Apoderado</strong>: el administrador ya asignó
    <em> rutas fijas</em> al conductor. Desde ellas se genera la <em>Ruta del día</em> con solo los
    estudiantes que <em>asistirán</em> (según marca el apoderado). El apoderado ve en tiempo real
    el estado <em>recogido/entregado</em> de su(s) hijo(s).
  </p>

  <ul className="heroList" aria-label="Qué muestra esta demo">
    <li>Generación de Ruta del día desde rutas fijas asignadas por el administrador</li>
    <li>Filtro automático por asistencia declarada por el apoderado</li>
    <li>Trazabilidad por estudiante: recogido y entregado visibles para el apoderado</li>
  </ul>

  <ol className="heroTry" aria-label="Pasos rápidos (1 minuto)">
    <li><strong>Apoderado:</strong> en su vista, marca la asistencia de su(s) hijo(s). Si no asistirá, selecciona <em>No asiste</em>.</li>
    <li><strong>Conductor:</strong> en su vista, genera la <em>Ruta del día</em> desde su ruta fija y pulsa <em>Iniciar ruta</em>.</li>
    <li><strong>Conductor:</strong> marca a un estudiante como <em>recogido</em> y luego <em>entregado</em>.</li>
    <li><strong>Apoderado:</strong> observa el cambio de estado en vivo en el listado de hijos.</li>
  </ol>

  <p className="heroLead">
    <strong>Notificaciones:</strong> en la app <em>móvil</em> están implementadas las push con Firebase.
    En esta <em>demo web</em> no se envían notificaciones; los cambios se visualizan directamente en pantalla.
  </p>
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

    {/* Layout: 1 col en móvil, 2 cols >=1024px */}
    <style>{`
      @media (min-width: 1024px) {
        .adminGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) clamp(420px, 34vw, 560px); /* ⬅️ sidebar más ancho */
          gap: 18px;                     /* ⬅️ único “margen” entre columnas */
          align-items: start;
        }
      }
    `}</style>

    {adminURL ? (
      <div className="adminGrid">
        {/* Columna izquierda: IFRAME + credenciales */}
        <div>
          <div
            role="region"
            aria-label="Vista embebida del Admin"
            style={{
              width: "100%",
              height: "clamp(640px, 78vh, 1200px)",
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

          {/* Credenciales compactas (cuadro ajustado al contenido) */}
          <div className= "phoneCreds" role="group" aria-label="Credenciales de prueba - Administrador" style={{ marginTop: 10 }}>
            <ul
              className="credList"
            >
              <li><strong>Usuario:</strong> AdminDemo@gmail.com</li>
              <li><strong>Clave:</strong> Admindemo#123</li>
            </ul>
          </div>
        </div>

        {/* Columna derecha: Texto lateral (un solo cuadro, sin relleno gris extra) */}
        
        <aside
          className="phonesAside"
          role="complementary"
          aria-label="Instrucciones del Panel del Administrador"
        >
          <h3 className="heroTitle" style={{ marginTop: 0 }}>Qué puedes gestionar (Administrador):</h3>

          <p className="heroLead">
            Administra <strong>conductores, apoderados y estudiantes</strong>, y define
            <strong> rutas fijas</strong> con un orden de paradas. El panel ofrece CRUD completo.
          </p>

          <ul className="heroList" aria-label="Capacidades del panel" style={{ listStylePosition: "outside", paddingLeft: "1.25rem" }}>
            <li>CRUD de <strong>Conductores</strong>, <strong>Apoderados</strong> y <strong>Estudiantes</strong>.</li>
            <li>Vincular hijos (estudiantes) a un <strong>Conductor</strong>.</li>
            <li>Crear <strong>Rutas fijas</strong> con nombre, conductor y <em>orden</em> de paradas.</li>
            <li>Al guardar la ida, se genera la <strong>ruta de vuelta</strong> en orden invertido (<em>ida:</em> 1,2,3 → <em>vuelta:</em> 3,2,1).</li>
          </ul>

          <ol className="heroTry" aria-label="Recorrido sugerido (2 minutos)">
            <li><strong>Crear Conductor:</strong> “Conductores” → <em>Nuevo</em> → completa formulario → <em>Guardar</em>.</li>
            <li><strong>Crear Apoderado + Estudiante(s):</strong> “Apoderados” → <em>Nuevo</em> → añade hijos y <em>vincúlalos</em> a un conductor.</li>
            <li><strong>Crear Ruta fija (ida):</strong> “Rutas fijas” → <em>Nueva</em> → ingresa <em>nombre</em>, selecciona <em>conductor</em>, define <em>orden</em> (1…n) → <em>Guardar</em>.</li>
            <li><strong>Ver ruta de vuelta:</strong> se crea automáticamente con el orden invertido (n…1).</li>
            <li><strong>Probar CRUD:</strong> edita un registro y elimina otro (con confirmación).</li>
          </ol>

          <p className="heroLead">
            <strong>Tip:</strong> el <em>orden</em> determina la secuencia real de recogida/entrega.
            Reordena y guarda para actualizar la planificación.
          </p>
        </aside>
      </div>
    ) : (
      <div className="adminFallback" role="status" aria-live="polite" style={{ marginTop: 8 }}>
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
          API (Swagger)
        </h2>
      </div>

      {/* Layout: 1 col en móvil, 2 cols >=1024px (igual que Admin) */}
      <style>{`
        @media (min-width: 1024px) {
          .swaggerGrid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) clamp(420px, 34vw, 560px);
            gap: 18px; /* único margen entre columnas */
            align-items: start;
          }
        }

        /* Tipografía del aside un poco más grande */
        #swagger-aside .heroTitle {
          font-size: clamp(18px, 2.2vw, 22px);
        }
        #swagger-aside .heroLead {
          font-size: clamp(15px, 1.35vw, 18px);
          line-height: 1.6;
          max-width: none;
        }
        #swagger-aside .heroList li {
          font-size: clamp(14px, 1.2vw, 17px);
          line-height: 1.55;
          margin-bottom: 8px;
        }
      `}</style>

      {dashboardURL ? (
        <div className="swaggerGrid">
          {/* Columna izquierda: IFRAME */}
          <div>
            <div
              role="region"
              aria-label="Vista embebida de Swagger"
              style={{
                width: "100%",
                height: "clamp(640px, 78vh, 1200px)", // mismo tamaño que Admin
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
          </div>

          {/* Columna derecha: Alcance + Roadmap (un solo cuadro, sin relleno) */}
          <aside
            id="swagger-aside"
            className="phoneCreds"
            role="complementary"
            aria-label="Alcance y próximas iteraciones"
            
          >
            <h3 className="heroTitle" style={{ marginTop: 0 }}>Alcance de esta demo</h3>
            <ul className="heroList" style={{ listStylePosition: "outside", paddingLeft: "1.25rem", marginTop: 6 }}>
              <li>Roles: Administrador, Conductor y Apoderado.</li>
              <li>Rutas fijas con orden definido y <em>Ruta del día</em>.</li>
              <li>Asistencia declarada por el apoderado (incluye solo asistentes).</li>
              <li>Estados por estudiante: <em>recogido</em> / <em>entregado</em>.</li>
              <li>Notificaciones push en <strong>app móvil</strong> (en web, actualización en pantalla).</li>
            </ul>

            <details style={{ marginTop: 10 }}>
              <summary style={{ cursor: "pointer", fontWeight: 600 }}>Próximas iteraciones (roadmap)</summary>
              <ul className="heroList" style={{ listStylePosition: "outside", paddingLeft: "1.25rem", marginTop: 8 }}>
                <li><strong>Proximidad:</strong> estimación de llegada y aviso “próximo a entregar” (geofencing).</li>
                <li><strong>Historial y analítica:</strong> tiempos, recorridos y exportación a Excel.</li>
                <li><strong>Importación desde Excel:</strong> alta masiva de estudiantes/apoderados según planilla del cliente.</li>
                <li><strong>Permisos y auditoría:</strong> bitácora de cambios y permisos granulares por rol.</li>
              </ul>
            </details>
          </aside>
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

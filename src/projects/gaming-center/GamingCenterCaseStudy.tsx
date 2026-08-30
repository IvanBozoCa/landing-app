import "./GamingCenterCaseStudy.css";

function CaseHeader() {
  return (
    <header className="case-header">
      <a className="case-brand" href="/" aria-label="Volver al portfolio">
        <span aria-hidden="true">IB</span>
        <strong>Iván Bozo Catalán</strong>
      </a>
      <a className="case-back" href="/#proyectos">← Volver a proyectos</a>
    </header>
  );
}

function CaseSection({ number, eyebrow, title, children, dark = false }: {
  number: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={`case-section ${dark ? "case-section--dark" : ""}`}>
      <div className="case-section-heading">
        <span>{number}</span>
        <div><p>{eyebrow}</p><h2>{title}</h2></div>
      </div>
      <div className="case-section-body">{children}</div>
    </section>
  );
}

function Evidence({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return <article className="case-evidence"><span>{label}</span><h3>{title}</h3><p>{children}</p></article>;
}

export default function GamingCenterCaseStudy() {
  return (
    <div className="gcms-case">
      <a className="skip-link" href="#caso-contenido">Saltar al contenido</a>
      <CaseHeader />
      <main id="caso-contenido">
        <header className="case-hero">
          <div className="case-hero-meta">
            <span className="case-status">● En desarrollo</span>
            <span>Software de operación · Proyecto personal</span>
          </div>
          <h1>Gaming Center<br />Management System</h1>
          <div className="case-hero-summary">
            <p>Un sistema para centralizar la administración de estaciones, clientes y sesiones de uso en gaming centers.</p>
            <dl>
              <div><dt>Rol</dt><dd>Análisis, diseño e implementación</dd></div>
              <div><dt>Áreas</dt><dd>Backend, frontend y Station Agent</dd></div>
              <div><dt>Estado</dt><dd>Desarrollo incremental</dd></div>
            </dl>
          </div>
          <div className="case-hero-visual" role="img" aria-label="Espacio reservado para una captura real del Gaming Center Management System">
            <span>Visual del producto</span><strong>Captura real pendiente</strong>
            <p>La demostración visual se incorporará cuando el flujo completo esté preparado con datos de prueba.</p>
          </div>
        </header>

        <CaseSection number="01" eyebrow="Contexto" title="El problema que organiza el proyecto">
          <div className="case-prose case-prose--large">
            <p>La operación de un gaming center reúne varias tareas que dependen unas de otras: conocer el estado de cada equipo, administrar clientes, asignar tiempo de uso y seguir sesiones activas.</p>
            <p>GCMS nace para reunir esos flujos en un sistema con una fuente de información común, evitando que la operación dependa de acciones aisladas o de mantener el estado manualmente.</p>
          </div>
        </CaseSection>

        <CaseSection number="02" eyebrow="Producto" title="Una operación centralizada, con dos tipos de sesión">
          <div className="case-split">
            <div className="case-prose"><p>El sistema distingue entre clientes registrados, que mantienen tiempo disponible en una billetera, e invitados, que utilizan tiempo autorizado para una visita específica.</p><p>La sala administrativa permite revisar estaciones y realizar operaciones, mientras el backend conserva la autoridad sobre el estado real de las sesiones.</p></div>
            <div className="session-models">
              <article><span>REGISTERED</span><h3>Cliente registrado</h3><p>Cuenta, billetera de tiempo, movimientos y sesiones asociadas al cliente.</p></article>
              <article><span>GUEST</span><h3>Sesión de invitado</h3><p>Tiempo prepago para una visita, sin crear usuario, billetera ni movimientos de saldo.</p></article>
            </div>
          </div>
        </CaseSection>

        <CaseSection number="03" eyebrow="Funcionamiento" title="Del panel administrativo a la estación" dark>
          <div className="architecture-flow" aria-label="Flujo técnico desde el panel hasta la interfaz de la estación">
            <div><span>01</span><strong>Sala</strong><small>El administrador inicia la operación</small></div><i aria-hidden="true">→</i>
            <div><span>02</span><strong>Backend</strong><small>Valida y guarda el estado autoritativo</small></div><i aria-hidden="true">→</i>
            <div><span>03</span><strong>WebSocket</strong><small>Publica el evento a la estación</small></div><i aria-hidden="true">→</i>
            <div><span>04</span><strong>Station Agent</strong><small>Sincroniza el estado local</small></div><i aria-hidden="true">→</i>
            <div><span>05</span><strong>UI</strong><small>Muestra la sesión y su tiempo</small></div>
          </div>
          <p className="architecture-note">El contador continúa localmente, pero la sesión del backend sigue siendo la fuente de verdad. Al reconectarse, el agente puede reconstruir su estado desde el snapshot vigente.</p>
        </CaseSection>

        <CaseSection number="04" eyebrow="Ingeniería" title="Decisiones que sostienen el comportamiento">
          <div className="decision-list">
            <article><span>Autoridad</span><h3>El backend define el estado</h3><p>La estación no decide por sí sola si una sesión existe. Recibe eventos y puede recuperar el estado vigente al volver a conectarse.</p></article>
            <article><span>Dominio</span><h3>REGISTERED y GUEST son flujos distintos</h3><p>Las reglas de la base de datos impiden combinaciones incoherentes entre el tipo de sesión, el cliente y su billetera.</p></article>
            <article><span>Confiabilidad</span><h3>Eventos repetidos no duplican acciones</h3><p>El procesamiento idempotente permite ignorar eventos duplicados o antiguos sin alterar una sesión válida.</p></article>
            <article><span>Recuperación</span><h3>La conexión puede interrumpirse</h3><p>La sincronización contempla reconexión y reconstrucción de estado, en lugar de asumir una conexión permanente.</p></article>
          </div>
        </CaseSection>

        <CaseSection number="05" eyebrow="Validación" title="Evidencia registrada durante el desarrollo">
          <div className="evidence-grid">
            <Evidence label="Backend" title="299 pruebas aprobadas">Suite completa ejecutada sin fallos en el checkpoint de certificación del Station Agent.</Evidence>
            <Evidence label="Agente Windows" title="Tests y build Release">El servicio, sus contratos y la interfaz fueron comprobados mediante pruebas y compilación Release.</Evidence>
            <Evidence label="Estabilidad" title="Certificación prolongada: PASS">Se verificó el funcionamiento sostenido del agente y su consumo de recursos durante juegos.</Evidence>
            <Evidence label="Rendimiento" title="Comparación con CS2: PASS">Se comparó el comportamiento del equipo con y sin el agente activo en una estación de prueba.</Evidence>
            <Evidence label="Recuperación" title="Reconexión y reinicio">El diseño contempla recuperar la sesión activa desde el backend sin duplicar ni perder el estado.</Evidence>
            <Evidence label="Calidad" title="Frontend lint y build">El panel administrativo completó sus validaciones estáticas y su compilación de producción.</Evidence>
          </div>
          <p className="evidence-disclaimer">Estos resultados corresponden a checkpoints técnicos del desarrollo. No representan métricas comerciales ni uso en producción.</p>
        </CaseSection>

        <CaseSection number="06" eyebrow="Stack" title="Tecnologías elegidas para cada responsabilidad" dark>
          <div className="stack-grid">
            <div><span>Backend</span><p>Python · FastAPI · PostgreSQL · SQLAlchemy</p></div>
            <div><span>Panel administrativo</span><p>React · TypeScript</p></div>
            <div><span>Comunicación</span><p>REST · WebSockets · IPC</p></div>
            <div><span>Station Agent</span><p>.NET 10 · servicio e interfaz para Windows</p></div>
            <div><span>Calidad</span><p>Pytest · pruebas .NET · lint · builds Release</p></div>
            <div><span>Proceso</span><p>Scrum · Jira · Git · GitHub · revisión por checkpoints</p></div>
          </div>
        </CaseSection>

        <CaseSection number="07" eyebrow="Estado actual" title="Lo construido y lo que todavía continúa">
          <div className="status-columns">
            <div><span>Disponible</span><ul><li>Administración de estaciones y clientes</li><li>Sesiones registradas y de invitados</li><li>Operaciones de inicio, extensión y cierre</li><li>Comunicación en tiempo real con Station Agent</li><li>Sincronización y recuperación de estado</li><li>Sala operativa en el frontend</li></ul></div>
            <div><span>En desarrollo</span><ul><li>Integración completa de todos los flujos desde Sala</li><li>Política al finalizar el tiempo autorizado</li><li>Control del entorno de Windows</li><li>Inicio autónomo para clientes registrados</li><li>Preparación de una demo pública</li></ul></div>
          </div>
        </CaseSection>

        <section className="case-closing">
          <p>Próximo paso</p><h2>Convertir la implementación actual en una experiencia demostrable de extremo a extremo.</h2>
          <a href="/#proyectos">Volver al portfolio <span aria-hidden="true">→</span></a>
        </section>
      </main>
      <footer className="case-footer"><p>© {new Date().getFullYear()} Iván Bozo Catalán</p><a href="#caso-contenido">Volver arriba ↑</a></footer>
    </div>
  );
}

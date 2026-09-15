import "./HelloPage.css";
import { contactRoute, routes } from "../app/routes";

const entryPoints = [
  {
    number: "01",
    topic: "website",
    title: "Quiero presentar mejor mi negocio",
    description: "Para explicar con claridad lo que haces, transmitir confianza y facilitar que una visita se convierta en una consulta.",
    examples: "Sitio comercial · Landing · Presencia profesional",
  },
  {
    number: "02",
    topic: "software",
    title: "Quiero ordenar un proceso",
    description: "Para reunir información, responsables y tareas que hoy dependen de planillas, mensajes o pasos manuales.",
    examples: "Sistema de gestión · Panel interno · Automatización",
  },
  {
    number: "03",
    topic: "mvp",
    title: "Quiero probar una idea",
    description: "Para transformar una necesidad en una primera versión funcional y aprender antes de invertir en más funcionalidades.",
    examples: "Diagnóstico · Prototipo · MVP",
  },
] as const;

function visitOrigin() {
  const value = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("origen")?.trim();
  return value && /^[a-z0-9_-]{1,40}$/i.test(value) ? value : "hola";
}

function HelloHeader() {
  return <header className="hello-header"><a className="hello-brand" href={routes.home} aria-label="IB — Iván Bozo Catalán — ir al portfolio"><span aria-hidden="true">IB</span><strong>Iván Bozo Catalán</strong></a><nav aria-label="Navegación de esta página"><a href="#como-puedo-ayudarte">Cómo puedo ayudarte</a><a href="#evidencia">Trabajos</a></nav><a className="hello-portfolio" href={routes.home}>Ver portfolio <span aria-hidden="true">↗</span></a></header>;
}

export default function HelloPage() {
  const origin = visitOrigin();

  return <div className="hello-page">
    <a className="skip-link" href="#hello-content">Saltar al contenido</a>
    <HelloHeader />
    <main id="hello-content">
      <section className="hello-hero" aria-labelledby="hello-title">
        <div className="hello-hero-copy"><p className="hello-eyebrow">Soluciones digitales para necesidades reales</p><h1 id="hello-title">Si algo en tu negocio es lento, manual o difícil de organizar, conversemos.</h1><p className="hello-lead">No necesitas saber qué tecnología usar. Puedes comenzar contándome cómo trabajas hoy, qué está dificultando el avance y qué te gustaría mejorar.</p><div className="hello-actions"><a className="hello-button hello-button--primary" href="#como-puedo-ayudarte">Encontrar un punto de partida <span aria-hidden="true">↓</span></a><a className="hello-button hello-button--text" href="#evidencia">Ver trabajos <span aria-hidden="true">→</span></a></div></div>
        <aside className="hello-question" aria-label="Preguntas para comenzar"><span>Un buen comienzo</span><strong>No hace falta llegar con una solución definida.</strong><ul><li>¿Qué te quita tiempo?</li><li>¿Qué información cuesta encontrar?</li><li>¿Qué te gustaría ofrecer mejor?</li></ul></aside>
      </section>

      <section className="hello-needs" id="como-puedo-ayudarte" aria-labelledby="hello-needs-title">
        <div className="hello-section-heading"><p>Elige la situación más cercana</p><h2 id="hello-needs-title">Tres formas de comenzar una conversación.</h2></div>
        <div className="hello-needs-grid">{entryPoints.map((entry) => <article key={entry.number}><div className="hello-card-number">{entry.number}</div><h3>{entry.title}</h3><p>{entry.description}</p><small>{entry.examples}</small><a href={contactRoute(entry.topic, origin)}>Esto se parece a lo que necesito <span aria-hidden="true">→</span></a></article>)}</div>
      </section>

      <section className="hello-proof" id="evidencia" aria-labelledby="hello-proof-title">
        <div className="hello-proof-intro"><p>Trabajo comprobable</p><h2 id="hello-proof-title">Puedes revisar cómo abordo un problema antes de escribirme.</h2><p>Estos proyectos muestran el contexto, las decisiones, lo que ya está implementado y también sus límites actuales.</p></div>
        <div className="hello-proof-list"><a href={routes.gcms}><span>01 / Operación de gaming centers</span><strong>GCMS</strong><p>Estaciones, clientes y sesiones reunidos en un sistema con reglas de negocio comprobadas.</p><i aria-hidden="true">Ver caso →</i></a><a href={routes.eunomi}><span>02 / Coordinación de transporte escolar</span><strong>Eunomi Escolar</strong><p>Rutas, asistencia y seguimiento organizados para administración, conductores y familias.</p><i aria-hidden="true">Ver caso →</i></a></div>
      </section>

      <section className="hello-process" aria-labelledby="hello-process-title"><div><p>Qué sucede después</p><h2 id="hello-process-title">Primero vemos si realmente puedo aportar.</h2></div><ol><li><span>01</span><p>Me cuentas brevemente qué ocurre hoy.</p></li><li><span>02</span><p>Ordenamos el problema y el resultado esperado.</p></li><li><span>03</span><p>Definimos un siguiente paso o reconocemos que aún no conviene construir.</p></li></ol></section>

      <section className="hello-contact"><p>Una primera conversación</p><h2>No necesitas preparar una propuesta técnica.</h2><p>Cuéntame el contexto con tus propias palabras. La consulta se prepara en tu dispositivo y podrás revisarla antes de enviarla.</p><a href={contactRoute(undefined, origin)}>Contarme qué necesitas <span aria-hidden="true">→</span></a></section>
    </main>
    <footer className="hello-footer"><p>© {new Date().getFullYear()} Iván Bozo Catalán</p><a href="#hello-content">Volver arriba ↑</a></footer>
  </div>;
}

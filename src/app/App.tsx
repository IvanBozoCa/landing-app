import SchoolTransportPage from "../projects/school-transport/SchoolTransportPage";
import "./PortfolioPage.css";

type ActionLinkProps = { children: React.ReactNode; href: string; variant?: "primary" | "secondary" | "text"; external?: boolean };

function ActionLink({ children, href, variant = "text", external = false }: ActionLinkProps) {
  return <a className={`action-link action-link--${variant}`} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}<span aria-hidden="true">{external ? " ↗" : " →"}</span></a>;
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "accent" }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

function SectionHeading({ eyebrow, title, titleId, intro }: { eyebrow: string; title: string; titleId: string; intro?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2 id={titleId}>{title}</h2>{intro && <p className="section-intro">{intro}</p>}</div>;
}

function SiteHeader() {
  return <header className="site-header"><a className="brand" href="#inicio" aria-label="Ir al inicio"><span className="brand-mark" aria-hidden="true">IB</span><span>Iván Bozo Catalán</span></a><nav aria-label="Navegación principal"><a href="#proyectos">Proyectos</a><a href="#enfoque">Enfoque</a><a href="#sobre-mi">Sobre mí</a><a href="#contacto">Contacto</a></nav></header>;
}

function FeaturedProject({ project }: { project: "gcms" | "transport" }) {
  const gcms = project === "gcms";
  return <article className={`featured-project ${gcms ? "featured-project--dark" : ""}`}>
    <div className="project-copy">
      <div className="project-meta"><span>0{gcms ? "1" : "2"}</span><Badge tone={gcms ? "accent" : "default"}>{gcms ? "En desarrollo" : "Proyecto de título"}</Badge></div>
      <p className="project-context">{gcms ? "Software de operación" : "Plataforma de coordinación"}</p>
      <h3>{gcms ? "Gaming Center Management System" : "Transporte Escolar"}</h3>
      <div className="project-story">
        <div><span>Problema</span><p>{gcms ? "Administrar estaciones, clientes y sesiones desde herramientas separadas dificulta tener una visión clara de la operación diaria." : "Las rutas dependían de conocimiento tácito y la coordinación manual dificultaba delegar y mantener informadas a las familias."}</p></div>
        <div><span>Solución</span><p>{gcms ? "Un sistema centralizado para gestionar estaciones, clientes y sesiones, tanto de usuarios registrados como de invitados." : "Una plataforma por roles con rutas definidas, control de asistencia y seguimiento para conductores, apoderados y administración."}</p></div>
      </div>
      <p className="project-role"><strong>Mi trabajo:</strong> análisis del problema, diseño del sistema e implementación.</p>
      <div className="project-evidence"><span className="evidence-label">Evidencia disponible</span><p>{gcms ? "Los flujos de sesiones registradas y de invitados cuentan con pruebas de reglas de negocio, permisos, base de datos y concurrencia." : "Demo navegable con vistas de conductor, apoderado, administración y documentación de la API."}</p></div>
      {gcms ? <span className="pending-link" aria-label="Caso de estudio de GCMS pendiente">Caso de estudio en preparación</span> : <ActionLink href="?project=school-transport" variant="secondary">Abrir demo del proyecto</ActionLink>}
    </div>
    <div className="project-visual" aria-label={gcms ? "Captura de GCMS pendiente" : "Vista previa editorial de Transporte Escolar"}>
      {gcms ? <div className="visual-placeholder"><span>Visual del producto</span><strong>Captura real pendiente</strong><p>Este espacio se reserva para una vista validada del panel, sin representar una interfaz ficticia.</p></div> : <div className="transport-preview"><div className="route-line" aria-hidden="true"><i /><i /><i /><i /></div><div><span>Demo funcional</span><strong>Ruta, asistencia y seguimiento</strong><p>Experiencia completa preservada en su landing original.</p></div></div>}
    </div>
  </article>;
}

function SiteFooter() {
  return <footer className="site-footer"><p>© {new Date().getFullYear()} Iván Bozo Catalán</p><a href="#inicio">Volver arriba ↑</a></footer>;
}

function PortfolioHome() {
  return <div className="portfolio-shell">
    <a className="skip-link" href="#contenido">Saltar al contenido</a><SiteHeader />
    <main id="contenido">
      <section className="hero" id="inicio" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">Ingeniería de software · Backend · Datos e IA</p><h1 id="hero-title">Diseño y construyo software para resolver problemas reales de operación.</h1><p className="hero-lead">Soy Iván Bozo Catalán, Ingeniero Civil en Computación. Trabajo con backend, datos e integración de sistemas, buscando que cada solución sea clara, útil y comprobable.</p><div className="hero-actions"><ActionLink href="#proyectos" variant="primary">Ver proyectos</ActionLink><ActionLink href="#contacto" variant="text">Contacto</ActionLink></div></div><aside className="hero-note" aria-label="Principio de trabajo"><span>01 / Enfoque</span><p>Problema</p><i aria-hidden="true" /><p>Solución</p><i aria-hidden="true" /><p>Implementación</p><i aria-hidden="true" /><p>Validación</p></aside></section>
      <section className="projects-section" id="proyectos" aria-labelledby="projects-title"><SectionHeading eyebrow="Proyectos destacados" title="Dos sistemas, desde el problema hasta la implementación" titleId="projects-title" intro="Una selección de proyectos donde se puede ver qué necesidad aborda cada sistema, cómo fue construido y qué partes ya están funcionando." /><div className="projects-list"><FeaturedProject project="gcms" /><FeaturedProject project="transport" /></div></section>
      <section className="approach-section" id="enfoque" aria-labelledby="approach-title"><SectionHeading eyebrow="Cómo trabajo" title="Primero entiendo el contexto; después construyo" titleId="approach-title" /><ol className="process-list"><li><span>01</span><div><h3>Entender el problema</h3><p>Reviso quiénes usarán la solución, cómo trabajan hoy y qué restricciones existen.</p></div></li><li><span>02</span><div><h3>Diseñar una solución</h3><p>Organizo las reglas del negocio y defino las responsabilidades de cada parte del sistema.</p></div></li><li><span>03</span><div><h3>Construir por etapas</h3><p>Avanzo en incrementos pequeños que permitan revisar el resultado y ajustar el rumbo.</p></div></li><li><span>04</span><div><h3>Comprobar que funciona</h3><p>Pruebo los flujos principales, los errores esperables y las condiciones que podrían afectar la operación.</p></div></li></ol></section>
      <section className="capabilities-section" aria-labelledby="capabilities-title"><SectionHeading eyebrow="Experiencia técnica" title="Áreas en las que he trabajado" titleId="capabilities-title" /><div className="capabilities-grid"><div><span>01</span><h3>Backend y APIs</h3><p>Desarrollo de servicios con Python y FastAPI, reglas de negocio, autenticación y bases de datos.</p></div><div><span>02</span><h3>Datos y automatización</h3><p>Procesamiento y análisis con Python, Pandas, SQL, MongoDB y Amazon Redshift.</p></div><div><span>03</span><h3>Integración de sistemas</h3><p>Comunicación entre servicios, sincronización de estado y flujos con distintos tipos de usuario.</p></div><div><span>04</span><h3>Inteligencia Artificial</h3><p>Proyectos de clasificación, detección de fraude, redes neuronales y aprendizaje semi-supervisado.</p></div></div></section>
      <section className="about-section" id="sobre-mi" aria-labelledby="about-title"><div><p className="eyebrow">Sobre mí</p><h2 id="about-title">Me interesa entender cómo funciona un sistema completo, no solo una parte del código.</h2></div><div className="about-copy"><p>Mi experiencia combina desarrollo backend, procesamiento de datos y proyectos de Inteligencia Artificial. Me gusta trabajar desde una necesidad concreta y entender cómo cada decisión técnica afecta a quienes usarán el sistema.</p><p>En este portfolio muestro proyectos en distintos estados de avance, separando con claridad lo que ya está implementado, la evidencia disponible y el trabajo que todavía continúa.</p></div></section>
      <section className="journey-section" aria-labelledby="journey-title"><SectionHeading eyebrow="Trayectoria" title="Experiencia profesional y académica" titleId="journey-title" /><div className="journey-line"><article><span>2023 — 2024 · Práctica profesional</span><h3>Datos y automatización · WherEx</h3><p>Automaticé y analicé procesos de datos con Python, Pandas, MongoDB, SQL y Amazon Redshift para necesidades del área de Producto.</p></article><article><span>2023 — 2025 · Universidad de O’Higgins</span><h3>Ayudantía de programación y datos</h3><p>Apoyé cursos de programación y procesamiento masivo de datos, incluyendo programación orientada a objetos y programación paralela.</p></article></div></section>
      <section className="contact-section" id="contacto" aria-labelledby="contact-title"><p className="eyebrow">Contacto</p><h2 id="contact-title">¿Quieres conversar sobre mi trabajo?</h2><p>Puedes revisar el código público y seguir la evolución de mis proyectos en GitHub.</p><ActionLink href="https://github.com/IvanBozoCa" variant="primary" external>Visitar GitHub</ActionLink></section>
    </main><SiteFooter />
  </div>;
}

export default function App() {
  return new URLSearchParams(window.location.search).get("project") === "school-transport" ? <SchoolTransportPage /> : <PortfolioHome />;
}

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
        <div><span>Problema</span><p>{gcms ? "La operación de un gaming center requiere coordinar estaciones, clientes y sesiones desde un único flujo administrativo." : "Las rutas dependían de conocimiento tácito y la coordinación manual dificultaba delegar y mantener informadas a las familias."}</p></div>
        <div><span>Solución</span><p>{gcms ? "Un sistema que modela estaciones, clientes y sesiones registradas o invitadas, con una base preparada para el panel de administración y el control de equipos." : "Una plataforma por roles con rutas parametrizadas, asistencia, trazabilidad del recorrido y actualizaciones para conductor, apoderado y administración."}</p></div>
      </div>
      <p className="project-role"><strong>Participación:</strong> análisis del problema, diseño de la solución e implementación.</p>
      <div className="project-evidence"><span className="evidence-label">Evidencia disponible</span><p>{gcms ? "Ciclo de sesiones REGISTERED y GUEST respaldado por pruebas de dominio, API, permisos, constraints y concurrencia." : "Demo navegable con vistas de conductor, apoderado, administración y documentación Swagger."}</p></div>
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
      <section className="hero" id="inicio" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">Ingeniería de software · Producto · Sistemas</p><h1 id="hero-title">Construyo software para convertir problemas operativos en sistemas claros y funcionales.</h1><p className="hero-lead">Soy Iván Bozo Catalán, Ingeniero Civil en Computación. Me enfoco en entender cada problema, diseñar una solución clara y construir software que funcione en la práctica.</p><div className="hero-actions"><ActionLink href="#proyectos" variant="primary">Ver proyectos</ActionLink><ActionLink href="#contacto" variant="text">Contacto</ActionLink></div></div><aside className="hero-note" aria-label="Principio de trabajo"><span>01 / Enfoque</span><p>Problema</p><i aria-hidden="true" /><p>Solución</p><i aria-hidden="true" /><p>Implementación</p><i aria-hidden="true" /><p>Validación</p></aside></section>
      <section className="projects-section" id="proyectos" aria-labelledby="projects-title"><SectionHeading eyebrow="Trabajo seleccionado" title="Proyectos que explican cómo pienso y construyo" titleId="projects-title" intro="Cada proyecto se presenta desde el problema y la solución; la ingeniería aparece como evidencia, no como decoración." /><div className="projects-list"><FeaturedProject project="gcms" /><FeaturedProject project="transport" /></div></section>
      <section className="approach-section" id="enfoque" aria-labelledby="approach-title"><SectionHeading eyebrow="Cómo trabajo" title="De una necesidad concreta a una solución verificable" titleId="approach-title" /><ol className="process-list"><li><span>01</span><div><h3>Entender el problema</h3><p>Identifico actores, restricciones y el flujo operativo antes de definir tecnología.</p></div></li><li><span>02</span><div><h3>Diseñar el sistema</h3><p>Convierto la necesidad en dominio, responsabilidades y decisiones técnicas explícitas.</p></div></li><li><span>03</span><div><h3>Construir por etapas</h3><p>Implemento incrementos acotados, preservando trazabilidad y alcance.</p></div></li><li><span>04</span><div><h3>Validar el comportamiento</h3><p>Compruebo flujos, errores y condiciones críticas con evidencia adecuada al proyecto.</p></div></li></ol></section>
      <section className="capabilities-section" aria-labelledby="capabilities-title"><SectionHeading eyebrow="Capacidades" title="Trabajo entre producto e ingeniería" titleId="capabilities-title" /><div className="capabilities-grid"><div><span>01</span><h3>Software Engineering</h3><p>Modelado de problemas, arquitectura y evolución incremental de sistemas.</p></div><div><span>02</span><h3>Backend Development</h3><p>APIs, reglas de negocio, persistencia, autenticación y manejo de concurrencia.</p></div><div><span>03</span><h3>Systems Integration</h3><p>Coordinación entre aplicaciones, servicios y experiencias con distintos roles.</p></div><div><span>04</span><h3>Data &amp; AI</h3><p>Área de formación y desarrollo que se incorporará con proyectos respaldados por evidencia.</p></div></div></section>
      <section className="about-section" id="sobre-mi" aria-labelledby="about-title"><div><p className="eyebrow">Sobre mí</p><h2 id="about-title">Una mirada de ingeniería con atención al producto.</h2></div><div className="about-copy"><p>Mi trabajo parte por comprender cómo opera un problema real y qué necesita cada persona involucrada. Desde ahí diseño e implemento software con responsabilidades claras.</p><p>Este portfolio documenta proyectos en distintos estados de madurez con una regla simple: distinguir lo construido, lo validado y lo que todavía está en desarrollo.</p></div></section>
      <section className="journey-section" aria-labelledby="journey-title"><SectionHeading eyebrow="Trayectoria" title="Experiencia construida a través de proyectos" titleId="journey-title" /><div className="journey-line"><article><span>Proyecto de título</span><h3>Transporte Escolar</h3><p>Sistema funcional orientado a coordinación de rutas, asistencia y seguimiento por roles.</p></article><article><span>En desarrollo</span><h3>Gaming Center Management System</h3><p>Producto de software construido progresivamente desde el dominio y sus validaciones.</p></article></div></section>
      <section className="contact-section" id="contacto" aria-labelledby="contact-title"><p className="eyebrow">Contacto</p><h2 id="contact-title">¿Quieres conversar sobre mi trabajo?</h2><p>Puedes revisar el código público y seguir la evolución de mis proyectos en GitHub.</p><ActionLink href="https://github.com/IvanBozoCa" variant="primary" external>Visitar GitHub</ActionLink></section>
    </main><SiteFooter />
  </div>;
}

export default function App() {
  return new URLSearchParams(window.location.search).get("project") === "school-transport" ? <SchoolTransportPage /> : <PortfolioHome />;
}

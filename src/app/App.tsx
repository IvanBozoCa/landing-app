import SchoolTransportPage from "../projects/school-transport/SchoolTransportPage";
import SchoolTransportCaseStudy from "../projects/school-transport/SchoolTransportCaseStudy";
import GamingCenterCaseStudy from "../projects/gaming-center/GamingCenterCaseStudy";
import ServicesPage from "../services/ServicesPage";
import ProductsPage from "../products/ProductsPage";
import ContactPage from "../contact/ContactPage";
import { useEffect } from "react";
import "./PortfolioPage.css";

type PageMetadataProps = { title: string; description: string };

function PageMetadata({ title, description }: PageMetadataProps) {
  useEffect(() => {
    document.title = title;

    const metadata = [
      ["name", "description", description],
      ["property", "og:title", title],
      ["property", "og:description", description],
    ] as const;

    metadata.forEach(([attribute, value, content]) => {
      const element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);
      element?.setAttribute("content", content);
    });
  }, [description, title]);

  return null;
}

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
  return <header className="site-header"><a className="brand" href="#inicio" aria-label="Ir al inicio"><span className="brand-mark" aria-hidden="true">IB</span><span>Iván Bozo Catalán</span></a><nav aria-label="Navegación principal"><a href="#servicios">Servicios</a><a href="#productos">Productos</a><a href="#proyectos">Proyectos</a><a href="#sobre-mi">Sobre mí</a><a href="?page=contact">Contacto</a></nav></header>;
}

function ServicesOverview() {
  const services = [
    { number: "01", title: "Sitios web comerciales", description: "Páginas para presentar un negocio o servicio con claridad, adaptadas a móvil y preparadas para convertir visitas en conversaciones." },
    { number: "02", title: "Software de gestión a medida", description: "Sistemas para centralizar información, usuarios y operaciones que hoy dependen de planillas, mensajes o tareas manuales." },
    { number: "03", title: "MVP y modernización", description: "Primeras versiones funcionales e incrementos para conectar frontend, backend, datos e integraciones sin intentar resolver todo de una vez." },
  ];

  return <section className="services-section" id="servicios" aria-labelledby="services-title"><SectionHeading eyebrow="Servicios" title="Soluciones digitales construidas alrededor de una necesidad concreta" titleId="services-title" intro="Puedo ayudarte a presentar mejor un servicio, ordenar una operación o convertir una idea en una primera versión funcional." /><div className="services-grid">{services.map((service, index) => <article key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.description}</p><a href={"?page=services#" + ["sitios-web", "software-gestion", "mvp-modernizacion"][index]}>Conocer el servicio <span aria-hidden="true">→</span></a></article>)}</div></section>;
}

function ProductsOverview() {
  return <section className="products-section" id="productos" aria-labelledby="products-title"><SectionHeading eyebrow="Productos propios" title="Software que estoy convirtiendo en productos reales" titleId="products-title" intro="Cada producto parte de un problema específico. Muestro con transparencia qué está funcionando, qué sigue en desarrollo y qué puede revisarse hoy." /><div className="products-grid"><article className="product-card product-card--eunomi"><div className="product-card-top"><span>01 / En desarrollo</span><strong>Producto para transporte escolar</strong></div><div><p className="product-name">Eunomi Escolar</p><h3>Rutas, asistencia y avisos en un mismo lugar.</h3><p>Una solución para ayudar a transportistas a organizar sus recorridos y mantener informadas a las familias.</p><ActionLink href="?page=products#eunomi" variant="secondary">Conocer producto</ActionLink></div></article><article className="product-card product-card--gcms"><div className="product-card-top"><span>02 / En desarrollo</span><strong>Producto para gaming centers</strong></div><div><p className="product-name">GCMS</p><h3>La operación diaria, centralizada.</h3><p>Gestión de estaciones, clientes y sesiones con reglas de negocio comprobadas y una base preparada para seguir creciendo.</p><ActionLink href="?page=products#gcms-product" variant="secondary">Conocer producto</ActionLink></div></article></div></section>;
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
      {gcms ? <ActionLink href="?project=gcms" variant="secondary">Ver caso de estudio</ActionLink> : <ActionLink href="?project=school-transport" variant="secondary">Ver caso de estudio</ActionLink>}
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
    <PageMetadata title="Iván Bozo Catalán | Software, productos y sitios web" description="Servicios de desarrollo de software y sitios web, productos propios y casos de estudio de Iván Bozo Catalán, Ingeniero Civil en Computación." />
    <a className="skip-link" href="#contenido">Saltar al contenido</a><SiteHeader />
    <main id="contenido">
      <section className="hero" id="inicio" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">Software a medida · Productos digitales · Sitios web</p><h1 id="hero-title">Desarrollo soluciones digitales para negocios e ideas que necesitan avanzar.</h1><p className="hero-lead">Soy Iván Bozo Catalán, Ingeniero Civil en Computación. Construyo sitios web, sistemas de gestión y productos funcionales partiendo de una necesidad concreta.</p><div className="hero-actions"><ActionLink href="#servicios" variant="primary">Conocer servicios</ActionLink><ActionLink href="#productos" variant="text">Ver productos</ActionLink></div></div><aside className="hero-note" aria-label="Principio de trabajo"><span>01 / De la necesidad al resultado</span><p>Entender</p><i aria-hidden="true" /><p>Diseñar</p><i aria-hidden="true" /><p>Construir</p><i aria-hidden="true" /><p>Comprobar</p></aside></section>
      <ServicesOverview />
      <ProductsOverview />
      <section className="projects-section" id="proyectos" aria-labelledby="projects-title"><SectionHeading eyebrow="Casos de estudio" title="El trabajo detrás de cada solución" titleId="projects-title" intro="Estos proyectos muestran el problema abordado, las decisiones tomadas, la implementación disponible y los límites actuales de cada solución." /><div className="projects-list"><FeaturedProject project="gcms" /><FeaturedProject project="transport" /></div></section>
      <section className="approach-section" id="enfoque" aria-labelledby="approach-title"><SectionHeading eyebrow="Cómo trabajo" title="Primero entiendo el contexto; después construyo" titleId="approach-title" /><ol className="process-list"><li><span>01</span><div><h3>Entender el problema</h3><p>Reviso quiénes usarán la solución, cómo trabajan hoy y qué restricciones existen.</p></div></li><li><span>02</span><div><h3>Diseñar una solución</h3><p>Organizo las reglas del negocio y defino las responsabilidades de cada parte del sistema.</p></div></li><li><span>03</span><div><h3>Construir por etapas</h3><p>Avanzo en incrementos pequeños que permitan revisar el resultado y ajustar el rumbo.</p></div></li><li><span>04</span><div><h3>Comprobar que funciona</h3><p>Pruebo los flujos principales, los errores esperables y las condiciones que podrían afectar la operación.</p></div></li></ol></section>
      <section className="capabilities-section" aria-labelledby="capabilities-title"><SectionHeading eyebrow="Experiencia técnica" title="Áreas en las que he trabajado" titleId="capabilities-title" /><div className="capabilities-grid"><div><span>01</span><h3>Backend y APIs</h3><p>Desarrollo de servicios con Python y FastAPI, reglas de negocio, autenticación y bases de datos.</p></div><div><span>02</span><h3>Datos y automatización</h3><p>Procesamiento y análisis con Python, Pandas, SQL, MongoDB y Amazon Redshift.</p></div><div><span>03</span><h3>Integración de sistemas</h3><p>Comunicación entre servicios, sincronización de estado y flujos con distintos tipos de usuario.</p></div><div><span>04</span><h3>Inteligencia Artificial</h3><p>Proyectos de clasificación, detección de fraude, redes neuronales y aprendizaje semi-supervisado.</p></div></div></section>
      <section className="about-section" id="sobre-mi" aria-labelledby="about-title"><div><p className="eyebrow">Sobre mí</p><h2 id="about-title">Me interesa entender cómo funciona un sistema completo, no solo una parte del código.</h2></div><div className="about-copy"><p>Mi experiencia combina desarrollo backend, procesamiento de datos y proyectos de Inteligencia Artificial. Me gusta trabajar desde una necesidad concreta y entender cómo cada decisión técnica afecta a quienes usarán el sistema.</p><p>En este portfolio muestro proyectos en distintos estados de avance, separando con claridad lo que ya está implementado, la evidencia disponible y el trabajo que todavía continúa.</p></div></section>
      <section className="journey-section" aria-labelledby="journey-title"><SectionHeading eyebrow="Trayectoria" title="Experiencia profesional y académica" titleId="journey-title" /><div className="journey-line"><article><span>2023 — 2024 · Práctica profesional</span><h3>Datos y automatización · WherEx</h3><p>Automaticé y analicé procesos de datos con Python, Pandas, MongoDB, SQL y Amazon Redshift para necesidades del área de Producto.</p></article><article><span>2023 — 2025 · Universidad de O’Higgins</span><h3>Ayudantía de programación y datos</h3><p>Apoyé cursos de programación y procesamiento masivo de datos, incluyendo programación orientada a objetos y programación paralela.</p></article></div></section>
      <section className="contact-section" id="contacto" aria-labelledby="contact-title"><p className="eyebrow">Contacto</p><h2 id="contact-title">Cuéntame qué necesitas resolver.</h2><p>Si tienes un negocio, un proceso que quieres ordenar o una idea que necesita su primera versión, podemos conversar sobre el problema y evaluar el siguiente paso.</p><div className="contact-actions"><ActionLink href="?page=contact" variant="primary">Preparar una consulta</ActionLink><ActionLink href="https://github.com/IvanBozoCa" variant="text" external>Revisar GitHub</ActionLink></div></section>
    </main><SiteFooter />
  </div>;
}

export default function App() {
  const project = new URLSearchParams(window.location.search).get("project");
  const page = new URLSearchParams(window.location.search).get("page");
  if (page === "services") return <><PageMetadata title="Servicios de desarrollo web y software | Iván Bozo Catalán" description="Sitios web comerciales, software de gestión a medida, MVP y modernización de aplicaciones desarrollados por Iván Bozo Catalán." /><ServicesPage /></>;
  if (page === "products") return <><PageMetadata title="Productos de software | Iván Bozo Catalán" description="Eunomi Escolar y Gaming Center Management System: productos de software en desarrollo, con estado y evidencia disponibles." /><ProductsPage /></>;
  if (page === "contact") return <><PageMetadata title="Contacto | Iván Bozo Catalán" description="Cuéntame qué necesitas resolver y prepara una consulta sobre desarrollo web, software a medida, MVP o Eunomi Escolar." /><ContactPage /></>;
  if (project === "school-transport") return <><PageMetadata title="Transporte Escolar | Iván Bozo Catalán" description="Caso de estudio de una plataforma para coordinar rutas, asistencia y seguimiento entre administración, conductores y apoderados." /><SchoolTransportCaseStudy /></>;
  if (project === "school-transport-demo") return <><PageMetadata title="Demo Transporte Escolar | Iván Bozo Catalán" description="Demo funcional con vistas de administración, conductor, apoderado y documentación de la API." /><SchoolTransportPage /></>;
  if (project === "gcms") return <><PageMetadata title="Gaming Center Management System | Iván Bozo Catalán" description="Caso de estudio de un sistema para administrar estaciones, clientes y sesiones de uso en gaming centers." /><GamingCenterCaseStudy /></>;
  return <PortfolioHome />;
}

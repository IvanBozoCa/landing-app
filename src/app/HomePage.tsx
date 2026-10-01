import { routes } from "./routes";
import { profileLinks, profilePhoto, type ProjectStatus } from "./profile";
import "./HomePage.css";

type ExternalLinkProps = { href: string; children: React.ReactNode; className?: string };

function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
    </a>
  );
}

function CvLink({ className }: { className?: string }) {
  if (profileLinks.cv) {
    return <a className={className} href={profileLinks.cv} download>Descargar CV <span aria-hidden="true">↓</span></a>;
  }
  return <span className={`${className ?? ""} is-pending`}>CV disponible próximamente</span>;
}

function SectionLabel({ number, label, id, title }: { number: string; label: string; id: string; title: string }) {
  return (
    <div className="home-section-label">
      <p className="home-eyebrow"><span>{number}</span>{label}</p>
      <h2 id={id}>{title}</h2>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="home-header">
      <div className="home-container home-header-inner">
        <a className="home-brand" href="#inicio">
          <span className="home-brand-mark" aria-hidden="true">IB</span>
          <span>Iván Bozo Catalán</span>
        </a>
        <nav aria-label="Secciones">
          <ul>
            <li><a href="#trabajo">Trabajo</a></li>
            <li><a href="#sobre-mi">Sobre mí</a></li>
            <li><a href="#eunomi">Eunomi</a></li>
            <li><a href="#experiencia">Experiencia</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Portrait() {
  if (profilePhoto) {
    return (
      <figure className="home-portrait">
        <img src={profilePhoto.src} width={profilePhoto.width} height={profilePhoto.height} alt="Iván Bozo Catalán" fetchPriority="high" />
      </figure>
    );
  }

  // Espacio reservado para una fotografía real. No se usa imagen generada ni de stock.
  return (
    <figure className="home-portrait home-portrait--placeholder" aria-hidden="true">
      <span>IB</span>
    </figure>
  );
}

function Hero() {
  return (
    <section className="home-hero" id="inicio" aria-labelledby="hero-title">
      <div className="home-container home-hero-grid">
        <div className="home-hero-copy">
          <p className="home-hero-kicker">Ingeniero Civil en Computación · Pichilemu, Chile</p>
          <h1 id="hero-title">Iván Bozo Catalán</h1>
          <p className="home-hero-roles">
            Desarrollador de soluciones de software
            <span aria-hidden="true"> · </span>
            <br className="home-break" />
            Fundador de <a href={profileLinks.eunomi} target="_blank" rel="noopener noreferrer">Eunomi<span className="visually-hidden"> (se abre en una pestaña nueva)</span></a>
          </p>
          <p className="home-hero-lead">
            Convierto necesidades reales de personas y negocios en software que funciona: entiendo el proceso, diseño la solución, la construyo y compruebo que resuelve el problema.
          </p>
          <div className="home-hero-actions">
            <a className="home-button home-button--primary" href="#trabajo">Ver mi trabajo</a>
            <a className="home-button home-button--ghost" href="#sobre-mi">Sobre mí</a>
          </div>
          <ul className="home-profile-links" aria-label="Perfiles y CV">
            <li><ExternalLink href={profileLinks.linkedin}>LinkedIn</ExternalLink></li>
            <li><ExternalLink href={profileLinks.github}>GitHub</ExternalLink></li>
            <li><CvLink /></li>
          </ul>
        </div>
        <Portrait />
      </div>
    </section>
  );
}

const principles = [
  { title: "Entender", text: "Usuarios, negocio, procesos y restricciones. Qué se hace hoy, quién lo hace y qué ocurre cuando algo falla." },
  { title: "Diseñar", text: "Datos, reglas y arquitectura. Qué parte del sistema es responsable de qué y dónde vive la información confiable." },
  { title: "Construir", text: "Implementación por etapas pequeñas, cada una revisable y desplegable, para ajustar el rumbo con evidencia." },
  { title: "Comprobar", text: "Pruebas, validación con casos reales y límites explícitos sobre lo que todavía no está resuelto." },
] as const;

function Approach() {
  return (
    <section className="home-section" id="forma-de-trabajo" aria-labelledby="approach-title">
      <div className="home-container">
        <SectionLabel number="01" label="Forma de trabajo" id="approach-title" title="Entender → Diseñar → Construir → Comprobar" />
        <blockquote className="home-quote">
          <p>«Me interesa entender cómo funciona un sistema completo, no solo una parte del código.»</p>
        </blockquote>
        <ol className="home-principles">
          {principles.map((principle, index) => (
            <li key={principle.title}>
              <span className="home-principles-number" aria-hidden="true">0{index + 1}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type WorkLink = { label: string; href: string; external?: boolean };

type WorkItem = {
  id: string;
  name: string;
  kind: string;
  status: ProjectStatus[];
  statusNote: string;
  problem: string;
  responsibility: string;
  solution: string;
  result: string;
  stack: string;
  links: WorkLink[];
};

const work: WorkItem[] = [
  {
    id: "eunomi-escolar",
    name: "Eunomi Escolar · Transporte Escolar",
    kind: "Producto completo: backend, app móvil e integración",
    status: ["Proyecto académico", "En desarrollo"],
    statusNote: "Nació como proyecto de título y hoy evoluciona como producto de Eunomi.",
    problem: "Las rutas de un transporte escolar vivían en la memoria de quien las administraba. Era difícil delegarlas y las familias pedían la ubicación por WhatsApp mientras el conductor manejaba.",
    responsibility: "El ciclo completo: análisis de la necesidad, modelado de roles y datos, API, aplicación móvil, notificaciones y despliegue de la demo.",
    solution: "Una plataforma por roles —administración, conductor y apoderado— con autenticación, rutas fijas, asistencia declarada por las familias, generación de la ruta del día y avisos push cuando cambia el estado de cada estudiante.",
    result: "Demo funcional con API documentada. Como Eunomi Escolar está en desarrollo y abierto a un piloto; todavía no está disponible para uso general.",
    stack: "Python · FastAPI · PostgreSQL · SQLAlchemy · Alembic · JWT · Flutter · Firebase Cloud Messaging · OpenRouteService · Render",
    links: [
      { label: "Ver caso de estudio", href: routes.eunomi },
      { label: "Probar la demo", href: routes.eunomiDemo },
      { label: "Eunomi Escolar", href: profileLinks.eunomiEscolar, external: true },
    ],
  },
  {
    id: "gcms",
    name: "Gaming Center Management System",
    kind: "Sistema distribuido: backend, servicio Windows y tiempo real",
    status: ["En desarrollo"],
    statusNote: "Proyecto propio en desarrollo incremental.",
    problem: "Un gaming center necesita saber en todo momento qué estación está ocupada, por quién y cuánto tiempo queda. Si ese estado vive en cada equipo, un corte de red o un reinicio lo descuadra.",
    responsibility: "Análisis, arquitectura e implementación del backend, el panel administrativo y el agente de estación para Windows, además de la estrategia de pruebas.",
    solution: "Un backend que mantiene la verdad sobre cada sesión y un agente en cada estación —servicio Windows e interfaz WPF comunicados por IPC— que se sincroniza por WebSockets, procesa eventos de forma idempotente y reconstruye su estado al reconectarse.",
    result: "299 pruebas de backend aprobadas en el último checkpoint registrado y certificación prolongada del agente en una estación de prueba. Aún sin uso comercial.",
    stack: "Python · FastAPI · PostgreSQL · React · TypeScript · .NET · Windows Service · WPF · WebSockets · IPC · Pytest",
    links: [{ label: "Ver caso de estudio", href: routes.gcms }],
  },
  {
    id: "fragan",
    name: "Fragan Pinturas",
    kind: "Sitio comercial para cliente",
    status: ["Producción"],
    statusNote: "Publicado con dominio propio.",
    problem: "Una empresa de pintura de Santiago necesitaba explicar sus servicios y recibir solicitudes de presupuesto desde un sitio propio que pudiera encontrarse en buscadores.",
    responsibility: "Desarrollo de la landing, configuración del dominio, despliegue y publicación en producción, SEO técnico y registro en Google Search Console.",
    solution: "Una landing responsive organizada en servicios, ambientes trabajados, proceso y contacto, con metadata y estructura preparadas para búsquedas locales.",
    result: "En producción en fraganpinturas.cl.",
    stack: "Vercel · dominio propio · SEO técnico · Google Search Console",
    links: [{ label: "Visitar fraganpinturas.cl", href: profileLinks.fragan, external: true }],
  },
];

function WorkEntry({ item, index }: { item: WorkItem; index: number }) {
  const titleId = `work-${item.id}-title`;
  return (
    <article className="home-work-item" aria-labelledby={titleId}>
      <header className="home-work-meta">
        <span className="home-work-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <ul className="home-status" aria-label="Estado">
          {item.status.map((status) => <li key={status}>{status}</li>)}
        </ul>
        <p>{item.statusNote}</p>
      </header>
      <div className="home-work-body">
        <p className="home-work-kind">{item.kind}</p>
        <h3 id={titleId}>{item.name}</h3>
        <dl className="home-work-story">
          <div><dt>Problema</dt><dd>{item.problem}</dd></div>
          <div><dt>Mi responsabilidad</dt><dd>{item.responsibility}</dd></div>
          <div><dt>Solución</dt><dd>{item.solution}</dd></div>
          <div><dt>Resultado / estado</dt><dd>{item.result}</dd></div>
        </dl>
        <p className="home-work-stack"><span className="visually-hidden">Tecnologías: </span>{item.stack}</p>
        <ul className="home-work-links">
          {item.links.map((link) => (
            <li key={link.href}>
              {link.external
                ? <ExternalLink href={link.href}>{link.label}</ExternalLink>
                : <a href={link.href}>{link.label} <span aria-hidden="true">→</span></a>}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function SelectedWork() {
  return (
    <section className="home-section" id="trabajo" aria-labelledby="work-title">
      <div className="home-container">
        <SectionLabel number="02" label="Trabajo seleccionado" id="work-title" title="Proyectos que muestran capacidades distintas" />
        <p className="home-section-intro">Un producto completo, un sistema distribuido y un sitio publicado para un cliente. Cada uno declara su estado real: producción, piloto, prototipo, desarrollo o proyecto académico.</p>
        <div className="home-work-list">
          {work.map((item, index) => <WorkEntry key={item.id} item={item} index={index} />)}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="home-section home-section--tinted" id="sobre-mi" aria-labelledby="about-title">
      <div className="home-container">
        <SectionLabel number="03" label="Sobre mí" id="about-title" title="De escribir código a entender el sistema completo" />
        <div className="home-about-grid">
          <div className="home-prose">
            <p className="home-prose-lead">Soy Ingeniero Civil en Computación de la Universidad de O'Higgins. Vivo y trabajo en Pichilemu, Chile.</p>
            <p>Empecé por la programación, los datos y el backend: automatizar procesos, modelar información y construir APIs. Con cada proyecto me fue importando más lo que ocurre antes del código —quién usará el sistema, cómo funciona hoy el proceso y qué restricciones existen— porque ahí se decide si una solución sirve.</p>
            <p>Hoy desarrollo productos propios y soluciones para necesidades reales a través de Eunomi, la empresa que fundé. Me interesa todo el recorrido: desde la conversación con quien tiene el problema hasta el despliegue y la comprobación de que funciona.</p>
          </div>
          <dl className="home-facts">
            <div><dt>Formación</dt><dd>Ingeniería Civil en Computación<br />Universidad de O'Higgins</dd></div>
            <div><dt>Base</dt><dd>Pichilemu, Chile · trabajo remoto</dd></div>
            <div><dt>Foco</dt><dd>Backend, datos y desarrollo de productos</dd></div>
            <div><dt>Actualmente</dt><dd>Fundador de Eunomi</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

const eunomiLines = [
  { name: "Eunomi Escolar", status: "En desarrollo · abierto a un piloto" },
  { name: "Barberías", status: "Primer piloto en preparación" },
  { name: "Restaurantes", status: "Prototipo en validación" },
  { name: "A medida", status: "Según cada caso" },
] as const;

function EunomiFounder() {
  return (
    <section className="home-section home-section--dark" id="eunomi" aria-labelledby="eunomi-title">
      <div className="home-container">
        <SectionLabel number="04" label="Fundador de Eunomi" id="eunomi-title" title="Eunomi: buen orden para negocios y servicios" />
        <div className="home-eunomi-grid">
          <div className="home-prose">
            <p className="home-prose-lead">Eunomi viene de <em>eunomía</em>, «buen orden». Es la empresa que fundé para desarrollar soluciones tecnológicas adaptadas a problemas reales de negocios y servicios.</p>
            <p>La idea es simple: primero entender cómo opera cada negocio y después decidir qué vale la pena construir. Muchas veces ordenar bien un proceso importa más que agregar tecnología compleja.</p>
            <h3 className="home-subheading">Mi trabajo en Eunomi</h3>
            <ul className="home-checklist">
              <li>Crear y dirigir la empresa.</li>
              <li>Conversar con negocios y potenciales clientes para entender cómo operan.</li>
              <li>Investigar problemas antes de proponer software.</li>
              <li>Diseñar los productos y desarrollar la tecnología.</li>
            </ul>
          </div>
          <div className="home-eunomi-lines">
            <h3 className="home-subheading">Líneas de trabajo</h3>
            <table>
              <caption className="visually-hidden">Líneas de trabajo de Eunomi y su estado actual</caption>
              <thead><tr><th scope="col">Línea</th><th scope="col">Estado</th></tr></thead>
              <tbody>
                {eunomiLines.map((line) => <tr key={line.name}><th scope="row">{line.name}</th><td>{line.status}</td></tr>)}
              </tbody>
            </table>
            <p className="home-note">Estados según eunomi.cl. Ningún producto se presenta como terminado si sigue en investigación, prototipo o piloto.</p>
          </div>
        </div>
        <div className="home-eunomi-cta">
          <p>Para proyectos comerciales y soluciones para negocios, trabajo a través de Eunomi.</p>
          <ExternalLink className="home-button home-button--light" href={profileLinks.eunomi}>Ir a eunomi.cl</ExternalLink>
        </div>
      </div>
    </section>
  );
}

const experience = [
  {
    org: "Eunomi",
    role: "Fundador · Desarrollo de soluciones de software",
    period: "Actualidad",
    text: "Investigación de problemas junto a negocios, diseño de productos y desarrollo de software de punta a punta.",
  },
  {
    org: "WherEx",
    role: "Práctica profesional · Datos y automatización",
    period: "2023 — 2024",
    text: "Automatización y análisis de procesos de datos con Python, Pandas, MongoDB, SQL y Amazon Redshift para necesidades del área de Producto.",
  },
  {
    org: "Universidad de O'Higgins",
    role: "Ayudante · Programación y procesamiento masivo de datos",
    period: "2023 — 2025",
    text: "Apoyo en cursos de programación orientada a objetos y programación paralela, con C, Pthreads y OpenMP.",
  },
] as const;

function Experience() {
  return (
    <section className="home-section" id="experiencia" aria-labelledby="experience-title">
      <div className="home-container">
        <SectionLabel number="05" label="Experiencia" id="experience-title" title="Experiencia profesional y académica" />
        <ol className="home-timeline">
          {experience.map((item) => (
            <li key={item.org}>
              <p className="home-timeline-period">{item.period}</p>
              <div>
                <h3>{item.org}</h3>
                <p className="home-timeline-role">{item.role}</p>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const capabilities = [
  { area: "Backend", items: ["Python", "FastAPI", "REST APIs", "SQLAlchemy", "Pydantic", "JWT", "Alembic"] },
  { area: "Datos", items: ["PostgreSQL", "MongoDB", "SQL", "Amazon Redshift", "Pandas"] },
  { area: "Integraciones", items: ["Firebase", "FCM", "WebSockets", "APIs externas", "OpenRouteService"] },
  { area: "Frontend y móvil", items: ["Flutter", "React", "TypeScript", "Vite"] },
  { area: "Sistemas", items: [".NET", "Windows Service", "WPF", "IPC", "C · Pthreads · OpenMP"] },
  { area: "Herramientas y proceso", items: ["Git", "GitHub", "Pytest", "Jira", "Scrum", "Vercel", "Render"] },
] as const;

function Capabilities() {
  return (
    <section className="home-section" id="capacidades" aria-labelledby="capabilities-title">
      <div className="home-container">
        <SectionLabel number="06" label="Capacidades técnicas" id="capabilities-title" title="Herramientas que he usado en proyectos reales" />
        <dl className="home-capabilities">
          {capabilities.map((group) => (
            <div key={group.area}>
              <dt>{group.area}</dt>
              <dd>{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="home-section home-contact" id="contacto" aria-labelledby="contact-title">
      <div className="home-container">
        <SectionLabel number="07" label="Contacto" id="contact-title" title="Conversemos" />
        <div className="home-contact-grid">
          <p className="home-prose-lead">Si estás formando un equipo, buscas a alguien para un proyecto técnico o quieres conocer al fundador de Eunomi, escríbeme.</p>
          <ul className="home-contact-list">
            <li><span>Correo</span><a href={`mailto:${profileLinks.email}`}>{profileLinks.email}</a></li>
            <li><span>LinkedIn</span><ExternalLink href={profileLinks.linkedin}>ivanbozocatalan</ExternalLink></li>
            <li><span>GitHub</span><ExternalLink href={profileLinks.github}>IvanBozoCa</ExternalLink></li>
            <li><span>CV</span><CvLink /></li>
          </ul>
        </div>
        <p className="home-contact-eunomi">
          ¿Necesitas una solución para tu negocio? Para proyectos comerciales trabajo a través de Eunomi:{" "}
          <ExternalLink href={profileLinks.eunomi}>eunomi.cl</ExternalLink>
        </p>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="home-footer">
      <div className="home-container home-footer-inner">
        <p>© {new Date().getFullYear()} Iván Bozo Catalán · Ingeniero Civil en Computación</p>
        <ul>
          <li><ExternalLink href={profileLinks.linkedin}>LinkedIn</ExternalLink></li>
          <li><ExternalLink href={profileLinks.github}>GitHub</ExternalLink></li>
          <li><ExternalLink href={profileLinks.eunomi}>Eunomi</ExternalLink></li>
          <li><a href="#inicio">Volver arriba <span aria-hidden="true">↑</span></a></li>
        </ul>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="home">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <Approach />
        <SelectedWork />
        <About />
        <EunomiFounder />
        <Experience />
        <Capabilities />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

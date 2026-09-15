import "./ServicesPage.css";
import { contactRoute, routes } from "../app/routes";

const services = [
  { id: "sitios-web", topic: "website", number: "01", title: "Sitios web comerciales", promise: "Presenta lo que haces con claridad y facilita que una visita se convierta en una conversación.", forWhom: "Negocios, profesionales y servicios que necesitan una presencia digital clara, adaptable y fácil de compartir.", needs: ["Explicar una oferta sin depender solo de redes sociales", "Ordenar información dispersa sobre servicios", "Facilitar consultas por correo o mensajería"], includes: ["Estructura y redacción inicial de la propuesta", "Diseño adaptable a escritorio y móvil", "Desarrollo, validación y preparación para publicación"] },
  { id: "software-gestion", topic: "software", number: "02", title: "Software de gestión a medida", promise: "Reúne información, usuarios y tareas operativas en una solución diseñada para tu forma de trabajar.", forWhom: "Equipos que coordinan su operación mediante planillas, mensajes o herramientas separadas y necesitan una fuente común.", needs: ["Centralizar datos y responsabilidades", "Reducir pasos manuales repetitivos", "Definir roles, reglas y estados de una operación"], includes: ["Análisis del proceso y sus restricciones", "Diseño de flujos, datos y responsabilidades", "Implementación incremental con validación de reglas"] },
  { id: "mvp-modernizacion", topic: "mvp", number: "03", title: "MVP y modernización", promise: "Convierte una idea o un sistema existente en un siguiente paso concreto, revisable y técnicamente sostenible.", forWhom: "Personas o equipos que necesitan comprobar una idea, conectar componentes existentes o mejorar una aplicación por etapas.", needs: ["Construir una primera versión funcional", "Integrar frontend, backend, datos o servicios", "Ordenar deuda técnica sin detener todo el producto"], includes: ["Definición del alcance inicial", "Incrementos pequeños con evidencia funcional", "Documentación de decisiones y trabajo pendiente"] },
] as const;

const businessSituations = [
  {
    number: "01",
    topic: "software",
    title: "La operación depende de recordar y preguntar",
    description: "Hay tareas que se repiten, responsables que deben confirmarse y pasos que solo algunas personas conocen. Un sistema puede ayudar a convertir ese recorrido en un proceso visible.",
    action: "Quiero ordenar este proceso",
  },
  {
    number: "02",
    topic: "website",
    title: "Tu presencia digital no explica bien lo que ofreces",
    description: "Cuando una persona debe preguntar lo básico o revisar varias redes para entender el servicio, una página clara puede presentar la oferta y facilitar el primer contacto.",
    action: "Quiero presentar mejor mi negocio",
  },
  {
    number: "03",
    topic: "software",
    title: "La información está repartida en demasiados lugares",
    description: "Planillas, mensajes y documentos separados dificultan saber qué está actualizado. Centralizar lo necesario puede dar una referencia común sin cambiar todo de una vez.",
    action: "Quiero reunir la información",
  },
  {
    number: "04",
    topic: "mvp",
    title: "Tienes una idea, pero aún necesitas comprobarla",
    description: "Antes de invertir en una solución completa, podemos definir la parte más importante y construir una primera versión que permita aprender con evidencia real.",
    action: "Quiero evaluar esta idea",
  },
] as const;

function ServicesHeader() {
  return <header className="services-page-header"><a className="services-brand" href={routes.home} aria-label="IB — Iván Bozo Catalán — volver al inicio"><span aria-hidden="true">IB</span><strong>Iván Bozo Catalán</strong></a><nav aria-label="Navegación de servicios"><a href="#servicios-detalle">Servicios</a><a href="#proceso">Proceso</a><a href="#preguntas">Preguntas</a></nav><a className="services-back" href={routes.home}>← Portfolio</a></header>;
}

function ServiceBlock({ service }: { service: (typeof services)[number] }) {
  return <article className="service-detail" id={service.id}><div className="service-detail-heading"><span>{service.number}</span><div><p>Servicio</p><h2>{service.title}</h2></div></div><p className="service-promise">{service.promise}</p><div className="service-detail-grid"><div><h3>Para quién puede ser útil</h3><p>{service.forWhom}</p></div><div><h3>Necesidades que puede abordar</h3><ul>{service.needs.map((need) => <li key={need}>{need}</li>)}</ul></div><div><h3>Qué puede incluir</h3><ul>{service.includes.map((item) => <li key={item}>{item}</li>)}</ul></div></div><a className="services-text-link" href={contactRoute(service.topic, "servicios")}>Conversar sobre este servicio <span aria-hidden="true">→</span></a></article>;
}

export default function ServicesPage() {
  return <div className="services-page">
    <a className="skip-link" href="#services-content">Saltar al contenido</a><ServicesHeader />
    <main id="services-content">
      <header className="services-hero"><div className="services-hero-meta"><span>Servicios profesionales</span><span>Desarrollo web y software</span></div><div className="services-hero-grid"><div><h1>Una solución útil empieza por entender bien el problema.</h1><p>Trabajo contigo para convertir una necesidad en un alcance claro, construir por etapas y comprobar cada avance antes de seguir creciendo.</p><a href="#servicios-detalle">Explorar servicios <span aria-hidden="true">↓</span></a></div><aside><span>Principio de trabajo</span><strong>No parto de una tecnología.</strong><p>Primero revisamos qué necesitas resolver, quién utilizará la solución y qué resultado sería realmente valioso.</p></aside></div></header>
      <section className="services-intro" id="servicios-detalle" aria-labelledby="services-detail-title"><p>Cómo puedo ayudarte</p><h2 id="services-detail-title">Tres formas de convertir una necesidad en un avance concreto.</h2></section>
      <section className="services-situations" aria-labelledby="services-situations-title"><div className="services-situations-heading"><p>Situaciones que podemos revisar</p><h2 id="services-situations-title">Quizás no necesitas pedir “un software”; basta con reconocer qué está dificultando el trabajo.</h2></div><div className="services-situations-grid">{businessSituations.map((situation) => <article key={situation.number}><span>{situation.number}</span><h3>{situation.title}</h3><p>{situation.description}</p><a href={contactRoute(situation.topic, "servicios")}>{situation.action} <i aria-hidden="true">→</i></a></article>)}</div></section>
      <div className="service-details">{services.map((service) => <ServiceBlock key={service.id} service={service} />)}</div>
      <section className="services-process" id="proceso" aria-labelledby="services-process-title"><div className="services-section-heading"><p>Proceso</p><h2 id="services-process-title">Un recorrido visible de principio a fin.</h2></div><ol><li><span>01</span><div><h3>Conversamos sobre el contexto</h3><p>Revisamos el problema, las personas involucradas, las herramientas actuales y las restricciones conocidas.</p></div></li><li><span>02</span><div><h3>Definimos un primer alcance</h3><p>Separamos lo esencial de lo que puede esperar y acordamos qué resultado permitirá validar el avance.</p></div></li><li><span>03</span><div><h3>Construyo y muestro incrementos</h3><p>La solución avanza en partes revisables, con espacio para corregir decisiones antes de que sean costosas.</p></div></li><li><span>04</span><div><h3>Validamos y documentamos</h3><p>Comprobamos los flujos principales y dejamos claro qué se entregó, cómo funciona y qué podría continuar.</p></div></li></ol></section>
      <section className="services-fit" aria-labelledby="services-fit-title"><div><p>Antes de comenzar</p><h2 id="services-fit-title">No necesitas llegar con una especificación técnica.</h2></div><div><p>Puedes comenzar explicando cómo trabajas hoy, qué te quita tiempo o qué quieres ofrecer. A partir de esa conversación podemos determinar si una página, un sistema o un primer prototipo es el paso adecuado.</p><p>Si el problema requiere otra especialidad o todavía no está listo para desarrollarse, también es mejor detectarlo al comienzo.</p></div></section>
      <section className="services-faq" id="preguntas" aria-labelledby="services-faq-title"><div className="services-section-heading"><p>Preguntas frecuentes</p><h2 id="services-faq-title">Lo importante antes de conversar.</h2></div><div className="services-questions"><details><summary>¿Trabajas con una solución ya existente?</summary><p>Sí. Primero revisaría su estado, tecnologías, documentación y principales problemas para proponer un alcance realista de modernización o integración.</p></details><details><summary>¿Cuánto cuesta y cuánto demora?</summary><p>Depende del alcance, la complejidad y el estado inicial. No publico una cifra genérica porque una landing y un sistema operativo requieren trabajos distintos. La estimación se define después de entender la necesidad.</p></details><details><summary>¿Puedo comenzar solo con una idea?</summary><p>Sí. El primer trabajo puede ser ordenar la idea, definir usuarios y priorizar una versión pequeña que permita aprender antes de invertir en más funcionalidades.</p></details><details><summary>¿Qué recibiré al finalizar?</summary><p>Los entregables se acuerdan antes de comenzar. Pueden incluir código, sitio publicado, documentación, configuración y una explicación de lo construido y del trabajo pendiente.</p></details></div></section>
      <section className="services-contact" id="contacto-servicios"><p>Hablemos de tu necesidad</p><h2>Cuéntame cómo trabajas hoy y qué te gustaría mejorar.</h2><p>No necesitas definir la tecnología. Basta con explicar el contexto y el resultado que buscas.</p><a href={contactRoute(undefined, "servicios")}>Preparar una consulta <span aria-hidden="true">→</span></a></section>
    </main>
    <footer className="services-page-footer"><p>© {new Date().getFullYear()} Iván Bozo Catalán</p><a href="#services-content">Volver arriba ↑</a></footer>
  </div>;
}

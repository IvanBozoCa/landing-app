import { contactRoute, routes } from "../app/routes";
import "./PichilemuServicesPage.css";

const needs = [
  {
    number: "01",
    title: "Presentar mejor un negocio o servicio",
    description: "Un sitio claro puede reunir tu propuesta, responder las primeras preguntas y facilitar que una persona te escriba desde su celular.",
    link: `${routes.services}#sitios-web`,
    action: "Conocer sitios web comerciales",
  },
  {
    number: "02",
    title: "Ordenar una operación que depende de tareas manuales",
    description: "Si la información vive en planillas, mensajes y documentos separados, podemos revisar qué parte conviene centralizar primero.",
    link: `${routes.services}#software-gestion`,
    action: "Conocer software de gestión",
  },
  {
    number: "03",
    title: "Convertir una idea en algo que se pueda probar",
    description: "Una primera versión pequeña permite validar el recorrido principal antes de comprometer tiempo y presupuesto en una solución completa.",
    link: `${routes.services}#mvp-modernizacion`,
    action: "Conocer MVP y modernización",
  },
] as const;

function LocalHeader() {
  return <header className="local-header"><a className="local-brand" href={routes.home} aria-label="IB — Iván Bozo Catalán — volver al inicio"><span aria-hidden="true">IB</span><strong>Iván Bozo Catalán</strong></a><nav aria-label="Navegación de servicios en Pichilemu"><a href="#necesidades">Necesidades</a><a href="#forma-de-trabajo">Cómo trabajo</a><a href="#preguntas">Preguntas</a></nav><a className="local-back" href={routes.services}>Ver servicios <span aria-hidden="true">→</span></a></header>;
}

export default function PichilemuServicesPage() {
  return <div className="local-page">
    <a className="skip-link" href="#local-content">Saltar al contenido</a>
    <LocalHeader />
    <main id="local-content">
      <header className="local-hero">
        <div className="local-hero-copy"><p className="local-kicker">Desarrollo web y software · Pichilemu</p><h1>Soluciones digitales para negocios que necesitan avanzar.</h1><p>Soy Iván Bozo Catalán, Ingeniero Civil en Computación. Trabajo desde Pichilemu desarrollando sitios web, sistemas de gestión y primeras versiones funcionales a partir de una necesidad concreta.</p><div className="local-actions"><a href={contactRoute(undefined, "seo-pichilemu")}>Cuéntame qué necesitas <span aria-hidden="true">→</span></a><a href="#necesidades">Revisar situaciones <span aria-hidden="true">↓</span></a></div></div>
        <aside><span>Un punto de partida simple</span><strong>No necesitas llegar pidiendo una tecnología.</strong><p>Podemos comenzar revisando qué está dificultando tu trabajo, qué necesita entender tu cliente o qué idea quieres comprobar.</p></aside>
      </header>

      <section className="local-context" aria-labelledby="local-context-title"><p>Trabajar desde el contexto</p><div><h2 id="local-context-title">Una solución útil debe adaptarse a la realidad del negocio.</h2><p>En Pichilemu conviven servicios turísticos, transporte, comercio, gastronomía y emprendimientos que trabajan con ritmos y necesidades distintas. Mi trabajo comienza entendiendo ese recorrido antes de definir qué conviene construir.</p><p>La solución puede ser una página que explique mejor tu oferta, una herramienta para ordenar información o una primera versión que permita probar una idea sin intentar resolver todo de una vez.</p></div></section>

      <section className="local-needs" id="necesidades" aria-labelledby="local-needs-title"><div className="local-section-heading"><p>Situaciones que podemos revisar</p><h2 id="local-needs-title">¿Qué está frenando hoy a tu negocio?</h2></div><div className="local-needs-grid">{needs.map((need) => <article key={need.number}><span>{need.number}</span><h3>{need.title}</h3><p>{need.description}</p><a href={need.link}>{need.action} <i aria-hidden="true">→</i></a></article>)}</div></section>

      <section className="local-process" id="forma-de-trabajo" aria-labelledby="local-process-title"><div className="local-section-heading"><p>Cómo trabajo</p><h2 id="local-process-title">Primero aclaramos el problema. Después definimos el siguiente paso.</h2></div><ol><li><span>01</span><div><h3>Conversamos sobre el contexto</h3><p>Me cuentas cómo funciona hoy el negocio, quiénes participan y dónde aparecen las principales dificultades.</p></div></li><li><span>02</span><div><h3>Priorizamos una necesidad</h3><p>Separamos lo importante de lo accesorio y acordamos un resultado concreto que podamos revisar.</p></div></li><li><span>03</span><div><h3>Construyo por etapas</h3><p>Cada avance se presenta y se comprueba antes de seguir agregando complejidad.</p></div></li></ol></section>

      <section className="local-proof" aria-labelledby="local-proof-title"><div><p>Trabajo comprobable</p><h2 id="local-proof-title">Puedes revisar cómo abordo problemas reales.</h2></div><div><a href={routes.eunomi}><span>Coordinación de transporte escolar</span><strong>Eunomi Escolar</strong><i aria-hidden="true">Ver caso →</i></a><a href={routes.gcms}><span>Operación de gaming centers</span><strong>GCMS</strong><i aria-hidden="true">Ver caso →</i></a></div></section>

      <section className="local-faq" id="preguntas" aria-labelledby="local-faq-title"><div className="local-section-heading"><p>Preguntas frecuentes</p><h2 id="local-faq-title">Antes de conversar.</h2></div><div className="local-questions"><details><summary>¿Trabajas solamente con negocios de Pichilemu?</summary><p>No. Trabajo desde Pichilemu y también puedo colaborar de manera remota con personas y equipos de otras zonas de Chile.</p></details><details><summary>¿Necesito saber qué software quiero?</summary><p>No. Es suficiente explicar el problema, cómo trabajas actualmente y qué resultado esperas. La tecnología se evalúa después.</p></details><details><summary>¿Puedes mejorar algo que ya existe?</summary><p>Sí. Primero revisaría su estado, tecnologías y restricciones para determinar si conviene corregir, integrar o reconstruir una parte.</p></details></div></section>

      <section className="local-contact"><p>Primera conversación</p><h2>Cuéntame qué te gustaría mejorar.</h2><p>Podemos revisar el contexto y determinar si una página, un sistema o una primera versión funcional es el paso adecuado.</p><a href={contactRoute(undefined, "seo-pichilemu")}>Preparar una consulta <span aria-hidden="true">→</span></a></section>
    </main>
    <footer className="local-footer"><p>© {new Date().getFullYear()} Iván Bozo Catalán · Pichilemu, Chile</p><a href="#local-content">Volver arriba ↑</a></footer>
  </div>;
}

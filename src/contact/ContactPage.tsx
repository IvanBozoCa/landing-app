import { useState, type FormEvent } from "react";
import "./ContactPage.css";

const CONTACT_EMAIL = "iv.bozo.catalan@gmail.com";

const topics = [
  { value: "general", label: "Una necesidad o idea" },
  { value: "website", label: "Un sitio web comercial" },
  { value: "software", label: "Software de gestión a medida" },
  { value: "mvp", label: "Un MVP o modernización" },
  { value: "eunomi", label: "Eunomi Escolar" },
] as const;

type Topic = (typeof topics)[number]["value"];

function initialTopic(): Topic {
  const value = new URLSearchParams(window.location.search).get("topic");
  return topics.some((topic) => topic.value === value) ? value as Topic : "general";
}

function ContactHeader() {
  return <header className="contact-page-header"><a className="contact-brand" href="/" aria-label="Volver al inicio"><span aria-hidden="true">IB</span><strong>Iván Bozo Catalán</strong></a><nav aria-label="Navegación de contacto"><a href="?page=services">Servicios</a><a href="?page=products">Productos</a><a href="#como-funciona">Cómo funciona</a></nav><a className="contact-back" href="/">← Portfolio</a></header>;
}

export default function ContactPage() {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [constraints, setConstraints] = useState("");

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const topicLabel = topics.find((option) => option.value === topic)?.label ?? topics[0].label;
    const subject = `Consulta desde el portfolio · ${topicLabel}`;
    const body = [
      `Hola Iván, soy ${name.trim()}.`,
      "",
      `Quiero conversar sobre: ${topicLabel}.`,
      "",
      "Contexto y resultado que busco:",
      context.trim(),
      "",
      "Plazo, presupuesto o restricciones que debería considerar:",
      constraints.trim() || "Aún por definir.",
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return <div className="contact-page">
    <a className="skip-link" href="#contact-content">Saltar al contenido</a><ContactHeader />
    <main id="contact-content">
      <header className="contact-hero"><div className="contact-hero-meta"><span>Contacto</span><span>Una conversación antes que una propuesta</span></div><div className="contact-hero-grid"><div><h1>Cuéntame qué necesitas resolver.</h1><p>No necesitas llegar con una especificación técnica. El contexto, las personas involucradas y el resultado que buscas son un mejor punto de partida.</p><a href="#mensaje">Preparar mi consulta <span aria-hidden="true">↓</span></a></div><aside><span>Antes de escribir</span><strong>Una buena primera consulta puede ser breve.</strong><p>Explica cómo funciona hoy, qué está dificultando el trabajo y qué cambio sería valioso para ti.</p></aside></div></header>

      <section className="contact-workspace" id="mensaje" aria-labelledby="contact-form-title">
        <div className="contact-form-intro"><p>Tu consulta</p><h2 id="contact-form-title">Ordenemos el contexto.</h2><p>Estos datos se utilizan solamente para preparar un correo en tu dispositivo. El sitio no los envía ni los almacena.</p></div>
        <form className="contact-form" onSubmit={prepareEmail}>
          <label><span>Tu nombre</span><input name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Cómo prefieres que te llame" required /></label>
          <label><span>Quiero conversar sobre</span><select name="topic" value={topic} onChange={(event) => setTopic(event.target.value as Topic)}>{topics.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label className="contact-field-wide"><span>¿Qué ocurre hoy y qué resultado buscas?</span><textarea name="context" rows={7} value={context} onChange={(event) => setContext(event.target.value)} placeholder="Describe el problema, quiénes participan y qué te gustaría mejorar." required /></label>
          <label className="contact-field-wide"><span>Plazo, presupuesto o restricciones <small>Opcional</small></span><textarea name="constraints" rows={4} value={constraints} onChange={(event) => setConstraints(event.target.value)} placeholder="Puedes dejarlo en blanco si todavía no está definido." /></label>
          <div className="contact-form-action"><button type="submit">Preparar correo <span aria-hidden="true">→</span></button><p>Se abrirá tu aplicación de correo con el mensaje preparado. Podrás revisarlo antes de enviarlo.</p></div>
        </form>
      </section>

      <section className="contact-process" id="como-funciona" aria-labelledby="contact-process-title"><div><p>Qué sucede después</p><h2 id="contact-process-title">Primero comprobamos si tiene sentido avanzar.</h2></div><ol><li><span>01</span><div><h3>Reviso el contexto</h3><p>El problema, las personas involucradas, las restricciones y el resultado esperado.</p></div></li><li><span>02</span><div><h3>Aclaramos lo necesario</h3><p>Si falta información, la conversación sirve para ordenar el alcance antes de hablar de tecnología.</p></div></li><li><span>03</span><div><h3>Definimos un siguiente paso</h3><p>Puede ser una propuesta, una revisión más profunda o reconocer que todavía no conviene construir.</p></div></li></ol></section>

      <section className="contact-proof" aria-labelledby="contact-proof-title"><div><p>Antes de decidir</p><h2 id="contact-proof-title">Puedes revisar cómo pienso y construyo.</h2></div><div className="contact-proof-links"><a href="/#proyectos"><span>Casos de estudio</span><strong>Problemas, decisiones y evidencia disponible.</strong><i aria-hidden="true">→</i></a><a href="https://github.com/IvanBozoCa" target="_blank" rel="noreferrer"><span>GitHub</span><strong>Código y proyectos públicos.</strong><i aria-hidden="true">↗</i></a></div></section>

      <section className="contact-direct"><p>¿Prefieres escribir directamente?</p><h2>{CONTACT_EMAIL}</h2><a href={`mailto:${CONTACT_EMAIL}`}>Abrir correo <span aria-hidden="true">→</span></a></section>
    </main>
    <footer className="contact-page-footer"><p>© {new Date().getFullYear()} Iván Bozo Catalán</p><a href="#contact-content">Volver arriba ↑</a></footer>
  </div>;
}

import { useState, type FormEvent } from "react";
import "./ContactPage.css";
import "./EunomiContactPage.css";
import { routes } from "../app/routes";
import { CONTACT_EMAIL, configuredWhatsAppNumber, consultationMessage, whatsappConsultationUrl } from "./contactChannels";

const topics = [
  { value: "general", label: "Una necesidad o problema del negocio" },
  { value: "loyalty", label: "Fidelización de clientes" },
  { value: "software", label: "Software de gestión" },
  { value: "website", label: "Sitio web y presencia digital" },
  { value: "automation", label: "Automatización o mejora de un proceso" },
] as const;

type Topic = (typeof topics)[number]["value"];

function initialTopic(): Topic {
  const value = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("topic");
  return topics.some((topic) => topic.value === value) ? value as Topic : "general";
}

function consultationOrigin() {
  const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const value = (params.get("origin") ?? params.get("ref"))?.trim();
  return value && /^[a-z0-9_-]{1,40}$/i.test(value) ? value : "eunomi";
}

function EunomiHeader() {
  return <header className="contact-page-header eunomi-contact-header">
    <a className="contact-brand eunomi-contact-brand" href={routes.eunomiContact} aria-label="Eunomi — contacto">
      <img src="/eunomi-mark.svg" width="38" height="38" alt="" aria-hidden="true" />
      <span><strong>Eunomi</strong><small>Buen orden para tu negocio</small></span>
    </a>
    <nav aria-label="Navegación de contacto de Eunomi">
      <a href="#mensaje">Conversemos</a>
      <a href="#como-funciona">Cómo trabajamos</a>
      <a href="#evidencia">Trabajo real</a>
    </nav>
    <a className="contact-back" href="/#proyectos">Ver trabajos <span aria-hidden="true">↗</span></a>
  </header>;
}

export default function EunomiContactPage() {
  const origin = consultationOrigin();
  const whatsappAvailable = configuredWhatsAppNumber() !== null;
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [constraints, setConstraints] = useState("");

  function prepareConsultation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const topicLabel = topics.find((option) => option.value === topic)?.label ?? topics[0].label;
    const subject = `Consulta a Eunomi · ${topicLabel}`;
    const body = consultationMessage({ name, topic: topicLabel, context, constraints, origin });
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;

    if (submitter?.value === "whatsapp") {
      const whatsappUrl = whatsappConsultationUrl(body);
      if (whatsappUrl) {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        return;
      }
    }

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return <div className="contact-page contact-page--eunomi">
    <a className="skip-link" href="#contact-content">Saltar al contenido</a>
    <EunomiHeader />
    <main id="contact-content">
      <header className="contact-hero">
        <div className="contact-hero-meta"><span>Eunomi · Pichilemu</span><span>Orden · Gestión · Mejora</span></div>
        <div className="contact-hero-grid">
          <div>
            <h1>Cuéntanos qué necesitas ordenar o mejorar.</h1>
            <p>No partimos por venderte un programa. Primero entendemos cómo funciona tu negocio, qué está dificultando el trabajo y dónde una solución digital podría aportar valor real.</p>
            <a href="#mensaje">Contarnos el contexto <span aria-hidden="true">↓</span></a>
          </div>
          <aside>
            <span>Antes de hablar de software</span>
            <strong>Una buena solución empieza entendiendo el negocio.</strong>
            <p>No necesitas saber qué tecnología usar. Cuéntanos cómo trabajan hoy y qué te gustaría que funcionara mejor.</p>
          </aside>
        </div>
      </header>

      <section className="contact-workspace" id="mensaje" aria-labelledby="eunomi-contact-form-title">
        <div className="contact-form-intro">
          <p>Primera conversación</p>
          <h2 id="eunomi-contact-form-title">Ordenemos el contexto.</h2>
          <p>Estos datos se utilizan solamente para preparar el mensaje en tu dispositivo. El sitio no los envía ni los almacena.</p>
        </div>
        <form className="contact-form" onSubmit={prepareConsultation}>
          <label><span>Tu nombre</span><input name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Cómo prefieres que te llamemos" required /></label>
          <label><span>Quiero conversar sobre</span><select name="topic" value={topic} onChange={(event) => setTopic(event.target.value as Topic)}>{topics.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label className="contact-field-wide"><span>¿Qué ocurre hoy y qué te gustaría mejorar?</span><textarea name="context" rows={7} value={context} onChange={(event) => setContext(event.target.value)} placeholder="Cuéntanos cómo funciona hoy, dónde aparece el problema y qué resultado sería valioso para tu negocio." required /></label>
          <label className="contact-field-wide"><span>Plazo, presupuesto o restricciones <small>Opcional</small></span><textarea name="constraints" rows={4} value={constraints} onChange={(event) => setConstraints(event.target.value)} placeholder="Puedes dejarlo en blanco si todavía no está definido." /></label>
          <div className="contact-form-action">
            <div className="contact-form-buttons">
              {whatsappAvailable ? <button type="submit" name="channel" value="whatsapp" aria-describedby="eunomi-contact-channel-note">Enviar por WhatsApp <span aria-hidden="true">↗</span></button> : null}
              <button className={whatsappAvailable ? "contact-email-button" : undefined} type="submit" name="channel" value="email" aria-describedby="eunomi-contact-channel-note">Preparar correo <span aria-hidden="true">→</span></button>
            </div>
            <p id="eunomi-contact-channel-note">{whatsappAvailable ? "El mensaje se prepara en tu dispositivo. Podrás revisarlo antes de enviarlo por WhatsApp o correo." : "Se abrirá tu aplicación de correo con el mensaje preparado. Podrás revisarlo antes de enviarlo."}</p>
          </div>
        </form>
      </section>

      <section className="contact-process" id="como-funciona" aria-labelledby="eunomi-process-title">
        <div><p>Cómo trabaja Eunomi</p><h2 id="eunomi-process-title">Primero entendemos. Después proponemos.</h2></div>
        <ol>
          <li><span>01</span><div><h3>Conocemos el negocio</h3><p>Cómo trabajan hoy, quiénes participan y dónde aparecen esperas, tareas manuales o información difícil de ordenar.</p></div></li>
          <li><span>02</span><div><h3>Identificamos una mejora concreta</h3><p>No todo problema necesita software. Buscamos primero dónde la tecnología realmente puede simplificar, ordenar o aportar información útil.</p></div></li>
          <li><span>03</span><div><h3>Definimos el siguiente paso</h3><p>Puede ser una propuesta, un prototipo, una mejora web o simplemente reconocer que todavía no conviene construir.</p></div></li>
        </ol>
      </section>

      <section className="contact-proof" id="evidencia" aria-labelledby="eunomi-proof-title">
        <div><p>Trabajo real</p><h2 id="eunomi-proof-title">Puedes revisar lo que ya estamos construyendo.</h2></div>
        <div className="contact-proof-links">
          <a href="/#proyectos"><span>Casos y productos</span><strong>Problemas, decisiones, software y evidencia disponible.</strong><i aria-hidden="true">→</i></a>
          <a href="https://github.com/IvanBozoCa" target="_blank" rel="noreferrer"><span>GitHub</span><strong>Código y proyectos públicos del fundador.</strong><i aria-hidden="true">↗</i></a>
        </div>
      </section>

      <section className="contact-direct">
        <p>Contacto directo</p>
        <h2>{CONTACT_EMAIL}</h2>
        <p className="eunomi-contact-signoff">Eunomi · Soluciones digitales para negocios · Pichilemu, Chile</p>
        <a href={`mailto:${CONTACT_EMAIL}`}>Abrir correo <span aria-hidden="true">→</span></a>
      </section>
    </main>
    <footer className="contact-page-footer"><p>© {new Date().getFullYear()} Eunomi · Iván Bozo Catalán</p><a href="#contact-content">Volver arriba ↑</a></footer>
  </div>;
}

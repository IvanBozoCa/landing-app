import "./SchoolTransportCaseStudy.css";
import { routes } from "../../app/routes";
import { profileLinks } from "../../app/profile";

function TransportHeader() {
  return <header className="transport-case-header"><a href={routes.home} aria-label="IB — Iván Bozo Catalán — volver al inicio"><span aria-hidden="true">IB</span><strong>Iván Bozo Catalán</strong></a><nav aria-label="Navegación del caso de estudio"><a className="transport-case-back" href={`${routes.home}#trabajo`}>← Volver al trabajo seleccionado</a></nav></header>;
}

function TransportSection({ number, eyebrow, title, children, dark = false, wide = false }: { number: string; eyebrow: string; title: string; children: React.ReactNode; dark?: boolean; wide?: boolean }) {
  return <section className={`transport-case-section ${dark ? "transport-case-section--dark" : ""}`}><div className="transport-section-title"><span>{number}</span><div><p>{eyebrow}</p><h2>{title}</h2></div></div><div className={`transport-section-content ${wide ? "transport-section-content--wide" : ""}`}>{children}</div></section>;
}

export default function SchoolTransportCaseStudy() {
  return <div className="transport-case">
    <a className="skip-link" href="#transport-case-content">Saltar al contenido</a>
    <TransportHeader />
    <main id="transport-case-content">
      <header className="transport-case-hero">
        <div className="transport-hero-meta"><span>Trabajo de título (2025) · hoy Eunomi Escolar en producción</span><span>Piloto con un transportista · Demo disponible</span></div>
        <div className="transport-hero-grid">
          <div><h1>Transporte<br />Escolar</h1><p>Una plataforma para organizar rutas, asistencia y seguimiento entre administración, conductores y apoderados.</p><a href={routes.eunomiLanding} target="_blank" rel="noopener noreferrer">Conocer Eunomi Escolar en eunomi.cl <span aria-hidden="true">↗</span></a></div>
          <div className="transport-hero-art"><picture><source type="image/webp" srcSet="/movilapp-256.webp 256w, /movilapp-384.webp 384w, /movilapp-509.webp 509w" sizes="(max-width: 480px) 200px, 330px" /><img src="/movilapp.png" width="509" height="490" decoding="async" fetchPriority="high" alt="Ícono de la aplicación Transporte Escolar: un bus protegido por un escudo" /></picture><div aria-hidden="true"><i /><i /><i /><i /></div></div>
        </div>
      </header>

      <TransportSection number="01" eyebrow="Contexto" title="Una operación que dependía de conocimiento tácito">
        <div className="transport-large-copy"><p>Las rutas vivían principalmente en la experiencia del administrador. Esto dificultaba delegar el trabajo a otro conductor y hacía que la operación dependiera de una sola persona.</p><p>Durante la pandemia, las familias también solicitaban la ubicación por WhatsApp. Responder mensajes mientras se realizaba el recorrido aumentaba la fricción y el riesgo de errores.</p></div>
      </TransportSection>

      <TransportSection number="02" eyebrow="Objetivo" title="Hacer que las rutas fueran visibles, delegables y trazables">
        <div className="transport-objectives"><article><span>01</span><h3>Centralizar</h3><p>Administrar conductores, apoderados, estudiantes y rutas desde un panel común.</p></article><article><span>02</span><h3>Coordinar</h3><p>Preparar la ruta del día usando la asistencia declarada por cada apoderado.</p></article><article><span>03</span><h3>Informar</h3><p>Mostrar el avance y los estados de cada estudiante según el rol del usuario.</p></article></div>
      </TransportSection>

      <section className="transport-screens" aria-labelledby="transport-screens-title">
        <h2 id="transport-screens-title">El producto hoy</h2>
        <p>Capturas reales de Eunomi Escolar con datos ficticios de la organización de demostración.</p>
        <div className="transport-screens-grid">
          <figure className="transport-screens-wide"><img src="/capturas/eunomi/admin-recorrido-en-vivo.webp" width="1200" height="698" loading="lazy" decoding="async" alt="Panel de administración mostrando un recorrido de vuelta en curso con el furgón en el mapa de Pichilemu" /><figcaption>Administración: recorrido en vivo con seguimiento GPS.</figcaption></figure>
          <figure><img src="/capturas/eunomi/conductor-proxima-entrega.webp" width="520" height="1125" loading="lazy" decoding="async" alt="App del conductor con la próxima entrega, tiempo estimado, mapa y el control deslizable para confirmar la entrega" /><figcaption>Conductor: próxima entrega y confirmación por deslizamiento.</figcaption></figure>
          <figure><img src="/capturas/eunomi/apoderado-seguimiento.webp" width="520" height="1125" loading="lazy" decoding="async" alt="Web del apoderado indicando que el furgón llega a su parada en unos 4 minutos, con el mapa del recorrido" /><figcaption>Apoderado: el furgón viene a su parada.</figcaption></figure>
        </div>
      </section>

      <TransportSection number="03" eyebrow="Producto" title="Tres roles conectados por el mismo recorrido" dark wide>
        <div className="role-flow"><article><span>Administración</span><h3>Prepara la operación</h3><ul><li>Gestiona usuarios y estudiantes</li><li>Vincula estudiantes con conductores</li><li>Define rutas fijas y el orden de paradas</li></ul></article><i aria-hidden="true">→</i><article><span>Conductor</span><h3>Ejecuta la ruta del día</h3><ul><li>Genera el recorrido desde una ruta fija</li><li>Inicia la ruta</li><li>Marca estudiantes recogidos y entregados</li></ul></article><i aria-hidden="true">→</i><article><span>Apoderado</span><h3>Declara y consulta</h3><ul><li>Informa la asistencia</li><li>Revisa el estado de sus hijos</li><li>Recibe notificaciones en la aplicación móvil</li></ul></article></div>
      </TransportSection>

      <TransportSection number="04" eyebrow="Flujo principal" title="De una ruta fija al seguimiento diario">
        <ol className="daily-route"><li><span>01</span><div><h3>La administración define la ruta fija</h3><p>El conductor y el orden de las paradas quedan registrados para que el recorrido no dependa de la memoria de una persona.</p></div></li><li><span>02</span><div><h3>El apoderado informa la asistencia</h3><p>Al iniciar la ruta se incluyen solamente los estudiantes que asistirán ese día.</p></div></li><li><span>03</span><div><h3>El conductor genera la ruta del día</h3><p>La ida conserva el orden definido y la vuelta se genera automáticamente en el orden inverso.</p></div></li><li><span>04</span><div><h3>Los estados se actualizan durante el recorrido</h3><p>Cuando un estudiante es recogido o entregado deja de aparecer entre las paradas pendientes y el cambio se refleja para conductor y apoderado.</p></div></li></ol>
      </TransportSection>

      <TransportSection number="05" eyebrow="Ingeniería" title="Componentes que sostienen la solución" dark>
        <div className="transport-stack"><div><span>API</span><p>FastAPI · Pydantic · autenticación JWT</p></div><div><span>Persistencia</span><p>PostgreSQL en Supabase · SQLAlchemy · Alembic</p></div><div><span>Tiempo real</span><p>Ubicación del furgón cada 5 segundos · avisos push con Firebase</p></div><div><span>Experiencias</span><p>Panel admin en React · app del conductor en Flutter (Android y web) · web de apoderados con Google Sign-In</p></div><div><span>Privacidad</span><p>Consentimiento informado, retiro del consentimiento y acceso según rol y organización</p></div><div><span>Operación</span><p>Despliegues en Vercel · APK firmado con GitHub Actions · migraciones versionadas</p></div></div>
      </TransportSection>

      <TransportSection number="06" eyebrow="Evidencia" title="Qué puede comprobarse hoy">
        <div className="transport-evidence"><article><span>Demo por roles</span><h3>Conductor y apoderado</h3><p>El recorrido permite declarar asistencia, generar la ruta del día y observar cambios de estado.</p></article><article><span>Administración</span><h3>Panel de gestión</h3><p>La demo incluye operaciones sobre conductores, apoderados, estudiantes y rutas fijas.</p></article><article><span>API</span><h3>Swagger navegable</h3><p>Los endpoints del backend pueden revisarse desde la documentación interactiva disponible.</p></article><article><span>Producción</span><h3>Uso real</h3><p>Un transportista opera sus recorridos diarios de IDA y VUELTA con la plataforma y las familias siguen el furgón en vivo.</p></article></div>
        <div className="transport-boundary"><strong>Una distinción importante</strong><p>La plataforma ya funciona en una operación real, pero con un solo transportista (1 conductor, 9 estudiantes). Todavía no presento métricas como reducción de llamadas: el piloto es pequeño para afirmarlas.</p></div>
      </TransportSection>

      <TransportSection number="07" eyebrow="Participación" title="Mi trabajo en el proyecto">
        <div className="transport-large-copy"><p>Desarrollé la primera versión como trabajo de título en 2025: levanté requerimientos con un transportista escolar, diseñé la base de datos y construí la API en FastAPI.</p><p>Desde septiembre de 2025 lo convertí en Eunomi Escolar, el producto principal de Eunomi, la empresa que fundé. Hice el backend, el panel administrativo, la app del conductor y la web de apoderados, y hoy opero la plataforma en producción: despliegues, migraciones, soporte a conductores y apoderados y priorización de cambios según lo que reportan.</p><p>Lo construyo con asistentes de IA: defino las tareas, reviso cada cambio, lo pruebo con pytest y en el entorno de demostración, y solo después lo publico.</p></div>
      </TransportSection>

      <section className="transport-case-closing"><p>Demo y contacto</p><h2>Prueba Eunomi Escolar o conversemos.</h2><div className="transport-closing-actions"><a href={profileLinks.eunomiEscolarDemo} target="_blank" rel="noopener noreferrer">Abrir la demo <span aria-hidden="true">↗</span></a>{profileLinks.cv && <a className="transport-closing-secondary" href={profileLinks.cv} download>Descargar CV <span aria-hidden="true">↓</span></a>}<a className="transport-closing-secondary" href={`${routes.home}#contacto`}>Contactarme <span aria-hidden="true">→</span></a></div></section>
    </main>
    <footer className="transport-case-footer"><p>© {new Date().getFullYear()} Iván Bozo Catalán</p><a href="#transport-case-content">Volver arriba ↑</a></footer>
  </div>;
}

import "./SchoolTransportCaseStudy.css";

function TransportHeader() {
  return <header className="transport-case-header"><a href="/" aria-label="Volver al portfolio"><span aria-hidden="true">IB</span><strong>Iván Bozo Catalán</strong></a><a href="/#proyectos">← Volver a proyectos</a></header>;
}

function TransportSection({ number, eyebrow, title, children, dark = false }: { number: string; eyebrow: string; title: string; children: React.ReactNode; dark?: boolean }) {
  return <section className={`transport-case-section ${dark ? "transport-case-section--dark" : ""}`}><div className="transport-section-title"><span>{number}</span><div><p>{eyebrow}</p><h2>{title}</h2></div></div><div className="transport-section-content">{children}</div></section>;
}

export default function SchoolTransportCaseStudy() {
  return <div className="transport-case">
    <a className="skip-link" href="#transport-case-content">Saltar al contenido</a>
    <TransportHeader />
    <main id="transport-case-content">
      <header className="transport-case-hero">
        <div className="transport-hero-meta"><span>Proyecto de título</span><span>Plataforma por roles · Demo disponible</span></div>
        <div className="transport-hero-grid">
          <div><h1>Transporte<br />Escolar</h1><p>Una plataforma para organizar rutas, asistencia y seguimiento entre administración, conductores y apoderados.</p><a href="?project=school-transport-demo">Abrir demo completa <span aria-hidden="true">→</span></a></div>
          <div className="transport-hero-art"><img src="/movilapp.png" alt="Ícono de la aplicación Transporte Escolar: un bus protegido por un escudo" /><div aria-hidden="true"><i /><i /><i /><i /></div></div>
        </div>
      </header>

      <TransportSection number="01" eyebrow="Contexto" title="Una operación que dependía de conocimiento tácito">
        <div className="transport-large-copy"><p>Las rutas vivían principalmente en la experiencia del administrador. Esto dificultaba delegar el trabajo a otro conductor y hacía que la operación dependiera de una sola persona.</p><p>Durante la pandemia, las familias también solicitaban la ubicación por WhatsApp. Responder mensajes mientras se realizaba el recorrido aumentaba la fricción y el riesgo de errores.</p></div>
      </TransportSection>

      <TransportSection number="02" eyebrow="Objetivo" title="Hacer que las rutas fueran visibles, delegables y trazables">
        <div className="transport-objectives"><article><span>01</span><h3>Centralizar</h3><p>Administrar conductores, apoderados, estudiantes y rutas desde un panel común.</p></article><article><span>02</span><h3>Coordinar</h3><p>Preparar la ruta del día usando la asistencia declarada por cada apoderado.</p></article><article><span>03</span><h3>Informar</h3><p>Mostrar el avance y los estados de cada estudiante según el rol del usuario.</p></article></div>
      </TransportSection>

      <section className="transport-visual-break" aria-label="Ilustraciones utilizadas por el proyecto"><img src="/movil.png" alt="Ilustración de un vehículo amarillo de transporte" /><img src="/movil2.png" alt="Ilustración de un bus escolar amarillo" /></section>

      <TransportSection number="03" eyebrow="Producto" title="Tres roles conectados por el mismo recorrido" dark>
        <div className="role-flow"><article><span>Administración</span><h3>Prepara la operación</h3><ul><li>Gestiona usuarios y estudiantes</li><li>Vincula estudiantes con conductores</li><li>Define rutas fijas y el orden de paradas</li></ul></article><i aria-hidden="true">→</i><article><span>Conductor</span><h3>Ejecuta la ruta del día</h3><ul><li>Genera el recorrido desde una ruta fija</li><li>Inicia la ruta</li><li>Marca estudiantes recogidos y entregados</li></ul></article><i aria-hidden="true">→</i><article><span>Apoderado</span><h3>Declara y consulta</h3><ul><li>Informa la asistencia</li><li>Revisa el estado de sus hijos</li><li>Recibe notificaciones en la aplicación móvil</li></ul></article></div>
      </TransportSection>

      <TransportSection number="04" eyebrow="Flujo principal" title="De una ruta fija al seguimiento diario">
        <ol className="daily-route"><li><span>01</span><div><h3>La administración define la ruta fija</h3><p>El conductor y el orden de las paradas quedan registrados para que el recorrido no dependa de la memoria de una persona.</p></div></li><li><span>02</span><div><h3>El apoderado informa la asistencia</h3><p>Al iniciar la ruta se incluyen solamente los estudiantes que asistirán ese día.</p></div></li><li><span>03</span><div><h3>El conductor genera la ruta del día</h3><p>La ida conserva el orden definido y la vuelta se genera automáticamente en el orden inverso.</p></div></li><li><span>04</span><div><h3>Los estados se actualizan durante el recorrido</h3><p>Cuando un estudiante es recogido o entregado deja de aparecer entre las paradas pendientes y el cambio se refleja para conductor y apoderado.</p></div></li></ol>
      </TransportSection>

      <TransportSection number="05" eyebrow="Ingeniería" title="Componentes que sostienen la solución" dark>
        <div className="transport-stack"><div><span>API</span><p>FastAPI · Pydantic · autenticación JWT</p></div><div><span>Persistencia</span><p>PostgreSQL · SQLAlchemy · Alembic</p></div><div><span>Notificaciones</span><p>Firebase Cloud Messaging para la aplicación móvil</p></div><div><span>Experiencias</span><p>Vistas para administración, conductor y apoderado</p></div><div><span>Documentación</span><p>Contrato de API disponible mediante Swagger</p></div><div><span>Operación</span><p>Configuración por entorno y servicios desplegados para la demo</p></div></div>
      </TransportSection>

      <TransportSection number="06" eyebrow="Evidencia" title="Qué puede comprobarse hoy">
        <div className="transport-evidence"><article><span>Demo por roles</span><h3>Conductor y apoderado</h3><p>El recorrido permite declarar asistencia, generar la ruta del día y observar cambios de estado.</p></article><article><span>Administración</span><h3>Panel de gestión</h3><p>La demo incluye operaciones sobre conductores, apoderados, estudiantes y rutas fijas.</p></article><article><span>API</span><h3>Swagger navegable</h3><p>Los endpoints del backend pueden revisarse desde la documentación interactiva disponible.</p></article><article><span>Móvil</span><h3>Notificaciones Firebase</h3><p>Las notificaciones push están implementadas en la aplicación móvil; la demo web refleja los cambios en pantalla.</p></article></div>
        <div className="transport-boundary"><strong>Una distinción importante</strong><p>La reducción de llamadas, la mejora en el seguimiento y la delegación de rutas son resultados esperados del diseño. Todavía no se presentan como métricas medidas en una operación real.</p></div>
      </TransportSection>

      <TransportSection number="07" eyebrow="Participación" title="Mi trabajo en el proyecto">
        <div className="transport-large-copy"><p>Desarrollé este sistema como proyecto de título, desde el análisis de la necesidad y el modelado de los roles hasta la implementación del backend, las experiencias de usuario y la integración de notificaciones.</p><p>El proyecto continúa en modernización. La versión actual permite demostrar el flujo funcional y, al mismo tiempo, mantiene documentada la deuda técnica que debe abordarse antes de considerarlo un producto preparado para una operación más amplia.</p></div>
      </TransportSection>

      <section className="transport-case-closing"><p>Demo funcional</p><h2>Prueba el flujo preservado de Transporte Escolar.</h2><a href="?project=school-transport-demo">Abrir demo completa <span aria-hidden="true">→</span></a></section>
    </main>
    <footer className="transport-case-footer"><p>© {new Date().getFullYear()} Iván Bozo Catalán</p><a href="#transport-case-content">Volver arriba ↑</a></footer>
  </div>;
}

import "./ProductsPage.css";
import { contactRoute, routes } from "../app/routes";

function ProductsHeader() {
  return <header className="products-page-header"><a className="products-brand" href={routes.home} aria-label="IB — Iván Bozo Catalán — volver al inicio"><span aria-hidden="true">IB</span><strong>Iván Bozo Catalán</strong></a><nav aria-label="Navegación de productos"><a href="#eunomi">Eunomi</a><a href="#gcms-product">GCMS</a><a href="#producto-o-servicio">Producto o servicio</a></nav><a className="products-back" href={routes.home}>← Portfolio</a></header>;
}

function Status({ children }: { children: React.ReactNode }) {
  return <span className="product-status"><i aria-hidden="true" />{children}</span>;
}

export default function ProductsPage() {
  return <div className="products-page">
    <a className="skip-link" href="#products-content">Saltar al contenido</a><ProductsHeader />
    <main id="products-content">
      <header className="products-hero"><div className="products-hero-meta"><span>Productos propios</span><span>Construcción incremental · Estado visible</span></div><div className="products-hero-grid"><div><h1>Software que nace de problemas concretos.</h1><p>Estoy desarrollando productos para operaciones que necesitan más orden, visibilidad y continuidad. Aquí puedes conocer su propósito y comprobar qué existe hoy.</p><a href="#eunomi">Conocer productos <span aria-hidden="true">↓</span></a></div><aside><span>Compromiso editorial</span><strong>Mostrar el avance sin adelantar la realidad.</strong><p>Una idea, un prototipo y un producto disponible no son lo mismo. Por eso cada iniciativa declara su estado y evidencia.</p></aside></div></header>

      <article className="product-feature product-feature--eunomi" id="eunomi">
        <div className="product-feature-copy"><div className="product-feature-meta"><span>01 / Transporte escolar</span><Status>En desarrollo</Status></div><p className="product-feature-name">Eunomi Escolar</p><h2>Organizar recorridos y mantener informadas a las familias.</h2><p className="product-feature-lead">Eunomi busca reunir rutas, asistencia y avisos de recogida y entrega para acompañar el servicio de transporte escolar.</p><dl><div><dt>Para quién</dt><dd>Transportistas escolares; conductores y apoderados participan por invitación.</dd></div><div><dt>Qué existe hoy</dt><dd>Base funcional por roles, aplicación móvil, panel administrativo, backend y una demo preservada.</dd></div><div><dt>Qué continúa</dt><dd>Modernización, validación comercial e integración definitiva de su landing al dominio.</dd></div></dl><div className="product-feature-actions"><a href={routes.eunomi}>Ver caso de estudio <span aria-hidden="true">→</span></a><a href={contactRoute("eunomi")}>Consultar por Eunomi</a></div></div>
        <div className="product-feature-art"><span>Identidad del producto</span><picture><source type="image/webp" srcSet="/movilapp-256.webp 256w, /movilapp-384.webp 384w, /movilapp-509.webp 509w" sizes="(max-width: 480px) 180px, 330px" /><img src="/movilapp.png" width="509" height="490" loading="lazy" decoding="async" alt="Ícono de Eunomi Escolar con un bus protegido por un escudo" /></picture><div className="product-route" aria-hidden="true"><i /><i /><i /><i /></div><small>La imagen corresponde a la identidad visual; no es una captura de la interfaz.</small></div>
      </article>

      <article className="product-feature product-feature--gcms" id="gcms-product">
        <div className="product-feature-copy"><div className="product-feature-meta"><span>02 / Gaming centers</span><Status>En desarrollo</Status></div><p className="product-feature-name">Gaming Center Management System</p><h2>Centralizar estaciones, clientes y sesiones de uso.</h2><p className="product-feature-lead">GCMS organiza la operación diaria de un gaming center y conecta el panel administrativo con el estado de cada estación.</p><dl><div><dt>Para quién</dt><dd>Operadores de gaming centers que necesitan administrar equipos, clientes y tiempo de uso.</dd></div><div><dt>Qué existe hoy</dt><dd>Backend, panel administrativo, Station Agent, reglas de negocio y checkpoints técnicos documentados.</dd></div><div><dt>Qué continúa</dt><dd>Experiencia completa de extremo a extremo, políticas operativas y preparación de una demo pública.</dd></div></dl><div className="product-feature-actions"><a href={routes.gcms}>Ver caso de estudio <span aria-hidden="true">→</span></a><span>Consulta comercial aún no habilitada</span></div></div>
        <div className="product-feature-art product-feature-art--gcms"><span>Estado visual</span><div className="gcms-symbol" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><strong>Demo pública en preparación</strong><small>Este recurso representa el sistema de estaciones; no simula una interfaz inexistente.</small></div>
      </article>

      <section className="product-or-service" id="producto-o-servicio" aria-labelledby="product-or-service-title"><div><p>Una diferencia útil</p><h2 id="product-or-service-title">¿Necesitas uno de estos productos o una solución para tu propio problema?</h2></div><div className="choice-grid"><article><span>Producto</span><h3>Una necesidad compartida</h3><p>Un producto se construye para un problema y un público definidos. Su evolución considera necesidades comunes de varios usuarios.</p><a href="#eunomi">Revisar productos ↑</a></article><article><span>Servicio</span><h3>Tu contexto particular</h3><p>Un servicio comienza revisando cómo trabajas tú y qué solución necesita tu operación, negocio o idea.</p><a href={routes.services}>Conocer servicios →</a></article></div></section>

      <section className="products-contact"><p>¿Te interesa seguir un producto?</p><h2>Podemos conversar sobre el problema que quieres resolver.</h2><p>Las consultas no implican disponibilidad inmediata ni una contratación. Sirven para conocer el contexto y evaluar si existe un siguiente paso razonable.</p><a href={contactRoute()}>Preparar una consulta <span aria-hidden="true">→</span></a></section>
    </main>
    <footer className="products-page-footer"><p>© {new Date().getFullYear()} Iván Bozo Catalán</p><a href="#products-content">Volver arriba ↑</a></footer>
  </div>;
}

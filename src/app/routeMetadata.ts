import { routes } from "./routes";

type RouteMetadata = { title: string; description: string; noIndex?: boolean };

export const routeMetadata: Record<(typeof routes)[Exclude<keyof typeof routes, "eunomiLanding">], RouteMetadata> = {
  [routes.home]: { title: "Iván Bozo Catalán · Desarrollador full stack (Python, React, Flutter)", description: "Ingeniero Civil en Computación y desarrollador full stack. Construí y opero Eunomi Escolar, una plataforma de transporte escolar en producción con FastAPI, React y Flutter." },
  [routes.services]: { title: "Servicios de desarrollo web y software | Iván Bozo Catalán", description: "Sitios web comerciales, software de gestión a medida, MVP y modernización de aplicaciones desarrollados por Iván Bozo Catalán." },
  [routes.products]: { title: "Productos de software | Iván Bozo Catalán", description: "Eunomi Escolar y Gaming Center Management System: productos de software en desarrollo, con estado y evidencia disponibles." },
  [routes.contact]: { title: "Contacto | Iván Bozo Catalán", description: "Cuéntame qué necesitas resolver y prepara una consulta sobre desarrollo web, software a medida, MVP o Eunomi Escolar." },
  [routes.hello]: { title: "Hablemos de tu negocio | Iván Bozo Catalán", description: "Identifica un problema de tu negocio, revisa soluciones y prepara una primera conversación con Iván Bozo Catalán." },
  [routes.pichilemu]: { title: "Desarrollo web y software en Pichilemu | Iván Bozo Catalán", description: "Desarrollo de sitios web, software de gestión y primeras versiones de productos digitales para negocios y emprendedores de Pichilemu." },
  [routes.eunomi]: { title: "Eunomi Escolar: caso de estudio | Iván Bozo Catalán", description: "Caso de estudio de Eunomi Escolar: de trabajo de título a plataforma en producción con panel admin, app del conductor y seguimiento en vivo para apoderados." },
  [routes.gcms]: { title: "Gaming Center Management System: caso de estudio | Iván Bozo Catalán", description: "Caso de estudio de un sistema distribuido para gaming centers: backend autoritativo, agente Windows, WebSockets, sincronización y recuperación de estado." },
};

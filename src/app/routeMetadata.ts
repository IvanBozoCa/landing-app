import { routes } from "./routes";

export const routeMetadata = {
  [routes.home]: { title: "Iván Bozo Catalán | Desarrollo web y software en Pichilemu", description: "Ingeniero Civil en Computación en Pichilemu. Desarrollo sitios web, software de gestión y productos digitales para negocios y proyectos de todo Chile." },
  [routes.services]: { title: "Servicios de desarrollo web y software | Iván Bozo Catalán", description: "Sitios web comerciales, software de gestión a medida, MVP y modernización de aplicaciones desarrollados por Iván Bozo Catalán." },
  [routes.products]: { title: "Productos de software | Iván Bozo Catalán", description: "Eunomi Escolar y Gaming Center Management System: productos de software en desarrollo, con estado y evidencia disponibles." },
  [routes.contact]: { title: "Contacto | Iván Bozo Catalán", description: "Cuéntame qué necesitas resolver y prepara una consulta sobre desarrollo web, software a medida, MVP o Eunomi Escolar." },
  [routes.hello]: { title: "Hablemos de tu negocio | Iván Bozo Catalán", description: "Identifica un problema de tu negocio, revisa soluciones y prepara una primera conversación con Iván Bozo Catalán." },
  [routes.pichilemu]: { title: "Desarrollo web y software en Pichilemu | Iván Bozo Catalán", description: "Desarrollo de sitios web, software de gestión y primeras versiones de productos digitales para negocios y emprendedores de Pichilemu." },
  [routes.eunomi]: { title: "Eunomi Escolar | Iván Bozo Catalán", description: "Caso de estudio de una plataforma para coordinar rutas, asistencia y seguimiento entre administración, conductores y apoderados." },
  [routes.eunomiDemo]: { title: "Demo Eunomi Escolar | Iván Bozo Catalán", description: "Demo funcional con vistas de administración, conductor, apoderado y documentación de la API." },
  [routes.gcms]: { title: "Gaming Center Management System | Iván Bozo Catalán", description: "Caso de estudio de un sistema para administrar estaciones, clientes y sesiones de uso en gaming centers." },
} as const;

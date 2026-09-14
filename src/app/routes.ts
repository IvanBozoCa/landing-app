export const routes = {
  home: "/",
  services: "/servicios",
  products: "/productos",
  contact: "/contacto",
  gcms: "/proyectos/gcms",
  eunomi: "/proyectos/eunomi",
  eunomiDemo: "/proyectos/eunomi/demo",
} as const;

export function contactRoute(topic?: string) {
  return topic ? `${routes.contact}?topic=${encodeURIComponent(topic)}` : routes.contact;
}

export function normalizePath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || routes.home;
}

export const routes = {
  home: "/",
  services: "/servicios",
  products: "/productos",
  contact: "/contacto",
  hello: "/hola",
  pichilemu: "/desarrollo-software-pichilemu",
  gcms: "/proyectos/gcms",
  eunomi: "/proyectos/eunomi",
  eunomiDemo: "/proyectos/eunomi/demo",
  eunomiLanding: "/eunomi-escolar",
} as const;

export function contactRoute(topic?: string, origin?: string) {
  const search = new URLSearchParams();
  if (topic) search.set("topic", topic);
  if (origin) search.set("origin", origin);
  const query = search.toString();
  return query ? `${routes.contact}?${query}` : routes.contact;
}

export function normalizePath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || routes.home;
}

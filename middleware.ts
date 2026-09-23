import { next, rewrite } from "@vercel/functions";

const EUNOMI_HOSTS = new Set(["eunomi.cl", "www.eunomi.cl"]);

export const config = {
  matcher: "/",
};

export default function routeEunomiHomepage(request: Request) {
  const url = new URL(request.url);

  if (EUNOMI_HOSTS.has(url.hostname)) {
    return rewrite(new URL("/eunomi-escolar/", request.url));
  }

  return next();
}

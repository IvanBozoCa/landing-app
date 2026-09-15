import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const siteUrl = "https://ivanbozocatalan.com";
const clientTemplatePath = resolve("dist/index.html");
const serverBundlePath = resolve(".prerender/entry-server.js");
const { render, routeMetadata } = await import(pathToFileURL(serverBundlePath).href);
const template = await readFile(clientTemplatePath, "utf8");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceMeta(html, attribute, name, content) {
  const pattern = new RegExp(`(<meta\\s+${attribute}="${name}"\\s+content=")[^"]*("\\s*/?>)`);
  return html.replace(pattern, `$1${escapeHtml(content)}$2`);
}

function pageDocument(pathname, metadata, robots = "index, follow") {
  const canonicalUrl = new URL(pathname, siteUrl).href;
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace('<div id="root"></div>', `<div id="root">${render(pathname)}</div>`);

  html = replaceMeta(html, "name", "description", metadata.description);
  html = replaceMeta(html, "name", "robots", robots);
  html = replaceMeta(html, "property", "og:title", metadata.title);
  html = replaceMeta(html, "property", "og:description", metadata.description);
  html = replaceMeta(html, "property", "og:url", canonicalUrl);
  html = replaceMeta(html, "name", "twitter:title", metadata.title);
  html = replaceMeta(html, "name", "twitter:description", metadata.description);
  return html;
}

for (const [pathname, metadata] of Object.entries(routeMetadata)) {
  const outputPath = pathname === "/"
    ? clientTemplatePath
    : resolve(`dist${pathname}.html`);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, pageDocument(pathname, metadata), "utf8");
}

const notFoundMetadata = {
  title: "Página no encontrada | Iván Bozo Catalán",
  description: "La dirección solicitada no corresponde a una página disponible del portfolio.",
};
await writeFile(resolve("dist/404.html"), pageDocument("/404", notFoundMetadata, "noindex, follow"), "utf8");
await rm(resolve(".prerender"), { recursive: true, force: true });

import SchoolTransportPage from "../projects/school-transport/SchoolTransportPage";
import SchoolTransportCaseStudy from "../projects/school-transport/SchoolTransportCaseStudy";
import GamingCenterCaseStudy from "../projects/gaming-center/GamingCenterCaseStudy";
import ServicesPage from "../services/ServicesPage";
import ProductsPage from "../products/ProductsPage";
import ContactPage from "../contact/ContactPage";
import HelloPage from "../hello/HelloPage";
import PichilemuServicesPage from "../local/PichilemuServicesPage";
import SiteStructuredData from "../seo/SiteStructuredData";
import NotFoundPage from "./NotFoundPage";
import { normalizePath, routes } from "./routes";
import { routeMetadata } from "./routeMetadata";
import { useEffect } from "react";
import HomePage from "./HomePage";
import "./global.css";

const SOCIAL_IMAGE_ALT = "Iván Bozo Catalán — Ingeniero Civil en Computación, desarrollador de soluciones de software y fundador de Eunomi";

type PageMetadataProps = { title: string; description: string; canonicalPath: string; noIndex?: boolean };

function PageMetadata({ title, description, canonicalPath, noIndex = false }: PageMetadataProps) {
  useEffect(() => {
    document.title = title;
    const canonicalUrl = new URL(canonicalPath, window.location.origin).href;
    const socialImageUrl = new URL("/og-cover.png", window.location.origin).href;

    const metadata = [
      ["name", "description", description],
      ["name", "robots", noIndex ? "noindex, follow" : "index, follow"],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:url", canonicalUrl],
      ["property", "og:image", socialImageUrl],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
      ["property", "og:image:alt", SOCIAL_IMAGE_ALT],
      ["name", "twitter:image", socialImageUrl],
      ["name", "twitter:image:alt", SOCIAL_IMAGE_ALT],
    ] as const;

    metadata.forEach(([attribute, value, content]) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    });

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [canonicalPath, description, noIndex, title]);

  return null;
}

function MetadataForRoute({ path }: { path: keyof typeof routeMetadata }) {
  const metadata = routeMetadata[path];
  return <PageMetadata {...metadata} canonicalPath={path} />;
}

export default function App({ pathname, search }: { pathname?: string; search?: string } = {}) {
  const path = normalizePath(pathname ?? (typeof window === "undefined" ? routes.home : window.location.pathname));
  const searchParams = new URLSearchParams(search ?? (typeof window === "undefined" ? "" : window.location.search));
  const project = searchParams.get("project");
  const page = searchParams.get("page");
  const legacyRoute = path === routes.home;
  let pageContent: React.ReactNode;
  if (path === routes.services || (legacyRoute && page === "services")) pageContent = <><MetadataForRoute path={routes.services} /><ServicesPage /></>;
  else if (path === routes.products || (legacyRoute && page === "products")) pageContent = <><MetadataForRoute path={routes.products} /><ProductsPage /></>;
  else if (path === routes.contact || (legacyRoute && page === "contact")) pageContent = <><MetadataForRoute path={routes.contact} /><ContactPage /></>;
  else if (path === routes.hello) pageContent = <><MetadataForRoute path={routes.hello} /><HelloPage /></>;
  else if (path === routes.pichilemu) pageContent = <><MetadataForRoute path={routes.pichilemu} /><PichilemuServicesPage /></>;
  else if (path === routes.eunomi || (legacyRoute && project === "school-transport")) pageContent = <><MetadataForRoute path={routes.eunomi} /><SchoolTransportCaseStudy /></>;
  else if (path === routes.eunomiDemo || (legacyRoute && project === "school-transport-demo")) pageContent = <><MetadataForRoute path={routes.eunomiDemo} /><SchoolTransportPage /></>;
  else if (path === routes.gcms || (legacyRoute && project === "gcms")) pageContent = <><MetadataForRoute path={routes.gcms} /><GamingCenterCaseStudy /></>;
  else if (path === routes.home) pageContent = <><MetadataForRoute path={routes.home} /><HomePage /></>;
  else pageContent = <><PageMetadata title="Página no encontrada | Iván Bozo Catalán" description="La dirección solicitada no corresponde a una página disponible del portfolio." canonicalPath={path} noIndex /><NotFoundPage /></>;

  return <><SiteStructuredData path={path} />{pageContent}</>;
}

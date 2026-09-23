import { routes } from "../app/routes";

const personId = "https://ivanbozocatalan.com/#ivan-bozo";

const person = {
  "@type": "Person",
  "@id": personId,
  name: "Iván Bozo Catalán",
  url: "https://ivanbozocatalan.com/",
  jobTitle: "Ingeniero Civil en Computación",
  homeLocation: {
    "@type": "Place",
    name: "Pichilemu, Región de O'Higgins, Chile",
  },
  sameAs: [
    "https://cl.linkedin.com/in/ivanbozocatalan",
    "https://github.com/IvanBozoCa",
  ],
  knowsAbout: [
    "Desarrollo de software",
    "Desarrollo web",
    "Software de gestión",
    "Backend y APIs",
    "Datos e inteligencia artificial",
  ],
};

const website = {
  "@type": "WebSite",
  "@id": "https://ivanbozocatalan.com/#website",
  url: "https://ivanbozocatalan.com/",
  name: "Iván Bozo Catalán",
  inLanguage: "es-CL",
  author: { "@id": personId },
};

const localService = {
  "@type": "Service",
  "@id": `https://ivanbozocatalan.com${routes.pichilemu}#servicio`,
  name: "Desarrollo web y software en Pichilemu",
  url: `https://ivanbozocatalan.com${routes.pichilemu}`,
  serviceType: "Desarrollo de sitios web, software de gestión y productos digitales",
  provider: { "@id": personId },
  areaServed: {
    "@type": "City",
    name: "Pichilemu",
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Región de O'Higgins, Chile",
    },
  },
};

export default function SiteStructuredData({ path }: { path: string }) {
  const graph = path === routes.pichilemu ? [person, website, localService] : [person, website];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />;
}

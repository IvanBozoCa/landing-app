import { routes } from "../app/routes";
import { EUNOMI_URL, SITE_URL, profileLinks } from "../app/profile";

// Dos entidades distintas:
//  - Person: Iván Bozo Catalán (este sitio).
//  - Organization: Eunomi (empresa, sitio propio en eunomi.cl).
// Se enlazan por @id; Eunomi no se describe aquí como si fuera este sitio.

const personId = `${SITE_URL}/#ivan-bozo`;
const eunomiId = `${EUNOMI_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

const person = {
  "@type": "Person",
  "@id": personId,
  name: "Iván Bozo Catalán",
  givenName: "Iván",
  familyName: "Bozo Catalán",
  url: `${SITE_URL}/`,
  email: `mailto:${profileLinks.email}`,
  jobTitle: ["Ingeniero Civil en Computación", "Desarrollador de soluciones de software", "Fundador de Eunomi"],
  description: "Ingeniero Civil en Computación, desarrollador de soluciones de software y fundador de Eunomi.",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universidad de O'Higgins",
  },
  worksFor: { "@id": eunomiId },
  homeLocation: {
    "@type": "Place",
    name: "Pichilemu, Región de O'Higgins, Chile",
  },
  sameAs: [profileLinks.linkedin, profileLinks.github],
  knowsAbout: [
    "Desarrollo de software",
    "Backend y APIs",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Procesamiento de datos",
    "Sistemas distribuidos",
    "Desarrollo de productos digitales",
  ],
};

const eunomi = {
  "@type": "Organization",
  "@id": eunomiId,
  name: "Eunomi",
  url: `${EUNOMI_URL}/`,
  founder: { "@id": personId },
};

const website = {
  "@type": "WebSite",
  "@id": websiteId,
  url: `${SITE_URL}/`,
  name: "Iván Bozo Catalán",
  inLanguage: "es-CL",
  author: { "@id": personId },
  publisher: { "@id": personId },
};

const profilePage = {
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profile`,
  url: `${SITE_URL}/`,
  name: "Iván Bozo Catalán · Ingeniero Civil en Computación y fundador de Eunomi",
  inLanguage: "es-CL",
  isPartOf: { "@id": websiteId },
  mainEntity: { "@id": personId },
};

const localService = {
  "@type": "Service",
  "@id": `${SITE_URL}${routes.pichilemu}#servicio`,
  name: "Desarrollo web y software en Pichilemu",
  url: `${SITE_URL}${routes.pichilemu}`,
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
  const graph: object[] = [person, eunomi, website];
  if (path === routes.home) graph.push(profilePage);
  if (path === routes.pichilemu) graph.push(localService);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />;
}

// Datos profesionales de Iván Bozo Catalán.
// Regla: nada de lo que aparece aquí debe inventarse. Si un dato no está confirmado,
// se deja en `null` y la interfaz lo muestra como pendiente.

export const SITE_URL = "https://ivanbozocatalan.com";
export const EUNOMI_URL = "https://eunomi.cl";

export const profileLinks = {
  email: "iv.bozo.catalan@gmail.com",
  github: "https://github.com/IvanBozoCa",
  // Enlace ya utilizado en el JSON-LD original del sitio. Confirmar que sea el perfil público vigente.
  linkedin: "https://cl.linkedin.com/in/ivanbozocatalan",
  // Versión web del CV 2026-10, sin número de teléfono.
  cv: "/cv/ivan-bozo-catalan.pdf" as string | null,
  eunomi: EUNOMI_URL,
  eunomiEscolar: `${EUNOMI_URL}/escolar`,
  eunomiEscolarDemo: `${EUNOMI_URL}/demo/escolar`,
  fragan: "https://fraganpinturas.cl",
} as const;

// Misma fotografía del CV 2026-10.
export const profilePhoto: { src: string; width: number; height: number } | null = { src: "/profile/ivan-bozo-catalan.webp", width: 360, height: 360 };

export type ProjectStatus = "Producción" | "Piloto" | "Prototipo" | "Investigación" | "En desarrollo" | "Proyecto académico" | "Piloto con cliente real";

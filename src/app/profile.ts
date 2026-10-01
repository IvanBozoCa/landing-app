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
  // Pendiente: subir el CV (por ejemplo a /cv/ivan-bozo-catalan.pdf) y reemplazar `null` por la ruta.
  cv: null as string | null,
  eunomi: EUNOMI_URL,
  eunomiEscolar: `${EUNOMI_URL}/escolar`,
  fragan: "https://fraganpinturas.cl",
} as const;

// Pendiente: agregar una fotografía real en /public/profile/ y reemplazar `null` por su ruta.
// Formato sugerido: WebP vertical 4:5, mínimo 800 × 1000 px.
export const profilePhoto: { src: string; width: number; height: number } | null = null;

export type ProjectStatus = "Producción" | "Piloto" | "Prototipo" | "Investigación" | "En desarrollo" | "Proyecto académico";

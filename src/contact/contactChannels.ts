export const CONTACT_EMAIL = "iv.bozo.catalan@gmail.com";

const INTERNATIONAL_PHONE = /^[1-9]\d{7,14}$/;

export function configuredWhatsAppNumber(value = import.meta.env.VITE_WHATSAPP_NUMBER): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return null;

  const digits = trimmed.replace(/\D/g, "");
  return INTERNATIONAL_PHONE.test(digits) ? digits : null;
}

export function consultationMessage({
  name,
  topic,
  context,
  constraints,
  origin,
}: {
  name: string;
  topic: string;
  context: string;
  constraints: string;
  origin: string | null;
}) {
  return [
    `Hola Iván, soy ${name.trim()}.`,
    "",
    `Quiero conversar sobre: ${topic}.`,
    "",
    "Contexto y resultado que busco:",
    context.trim(),
    "",
    "Plazo, presupuesto o restricciones que debería considerar:",
    constraints.trim() || "Aún por definir.",
    ...(origin ? ["", `Origen de la consulta: ${origin}.`] : []),
  ].join("\n");
}

export function whatsappConsultationUrl(message: string) {
  const number = configuredWhatsAppNumber();
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}

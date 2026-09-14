export const contact = {
  email: 'iv.bozo.catalan@gmail.com',
  whatsapp: '56941068150',
} as const;

export type Profile = 'transportista' | 'conductor' | 'apoderado';

export const profiles: Record<Profile, { description: string; message: string }> = {
  transportista: {
    description: 'Una visión de la operación para coordinar el día.',
    message: 'Hola, soy transportista y me interesa conocer Eunomi Escolar. Quisiera conversar sobre cómo podría ayudarme a organizar mi servicio.',
  },
  conductor: {
    description: 'La información del recorrido y los registros que harías como conductor.',
    message: 'Hola, soy conductor de transporte escolar y me interesa conocer la propuesta de Eunomi Escolar para el recorrido diario.',
  },
  apoderado: {
    description: 'La información que podrías consultar sobre el trayecto de tu estudiante.',
    message: 'Hola, soy apoderado y me interesa conocer cómo Eunomi Escolar podría mantenerme informado del transporte de mi estudiante.',
  },
};

type Step = { title: string; description: string; benefits: Record<Profile, string> };

export const steps: readonly Step[] = [
  {
    title: 'Hoy un estudiante no asistirá',
    description: 'En este ejemplo, una familia informa una ausencia antes de la salida. El transportista y el conductor consultan la asistencia para preparar el recorrido de quienes sí viajarán.',
    benefits: {
      transportista: 'Tener el aviso junto a la información del recorrido, en lugar de buscarlo entre conversaciones.',
      conductor: 'Consultar quién viajará ese día antes de iniciar el recorrido.',
      apoderado: 'Informar que tu estudiante no viajará para que el transportista lo tenga en cuenta.',
    },
  },
  {
    title: 'Registrar la recogida',
    description: 'En este ejemplo, el conductor registra la recogida de un estudiante cuando el vehículo está detenido.',
    benefits: {
      transportista: 'Contar con un registro de las recogidas realizadas.',
      conductor: 'Distinguir las recogidas realizadas de las paradas que aún quedan.',
      apoderado: 'Consultar que el conductor registró la recogida de tu estudiante.',
    },
  },
  {
    title: 'Acompañar el trayecto',
    description: 'La propuesta contempla seguimiento del recorrido y avisos relevantes durante el trayecto.',
    benefits: {
      transportista: 'Tener visibilidad del avance del recorrido.',
      conductor: 'Compartir el avance a través de la app y reducir consultas por mensajes.',
      apoderado: 'Consultar el avance del recorrido de tu estudiante sin preguntar por cada etapa.',
    },
  },
  {
    title: 'Registrar la entrega',
    description: 'El conductor registra la entrega en el colegio y la familia puede consultar esa actualización.',
    benefits: {
      transportista: 'Contar con los registros de entrega para revisar el recorrido.',
      conductor: 'Identificar las entregas completadas y las que aún están pendientes.',
      apoderado: 'Saber que el conductor registró la entrega de tu estudiante.',
    },
  },
];

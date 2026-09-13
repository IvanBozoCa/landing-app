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
    title: 'Preparar la salida',
    description: 'El transportista organiza la ruta y consulta la asistencia del día.',
    benefits: {
      transportista: 'Reunir la ruta y la asistencia para coordinar la salida.',
      conductor: 'Consultar qué estudiantes forman parte del recorrido del día.',
      apoderado: 'Informar la asistencia de tu estudiante para que se considere al organizar la ruta.',
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

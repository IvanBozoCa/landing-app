// Estado simulado de la demo de Eunomi Escolar.
// Textos alineados con la app del conductor, la web de familias
// (familias/src/experience.ts) y el panel del administrador.
// Valentina (0) y Diego (1) viajan; Tomás no asiste hoy (aviso de su familia).

export const riders = [
  { name: 'Valentina Rojas', first: 'Valentina', initials: 'VR', course: '3°B', stop: 'Los Aromos 245' },
  { name: 'Diego Rojas', first: 'Diego', initials: 'DR', course: '5°B', stop: 'Los Aromos 245 · pasaje 2' },
];
export const absent = { name: 'Tomás Pérez', course: '4°A', family: 'Javier Pérez' };

export const steps = [
  { id: 'prep', phase: 0, title: 'El administrador deja todo listo', copy: 'Andrea inscribió a cada familia con su Gmail y armó la Ruta Playa Hermosa. La familia de Tomás avisó desde la web que hoy no va. Entra como conductor para revisar quiénes asisten.' },
  { id: 'review', phase: 0, title: 'Revisar antes de salir', copy: 'El conductor ve 2 de 3 estudiantes: Tomás aparece como «No asiste» porque su familia lo avisó. Inicia el recorrido de ida.' },
  { id: 'toV', phase: 1, title: 'Rumbo a la primera parada', copy: 'El conductor ve la próxima parada y el tiempo estimado. La familia de Valentina ve que el furgón viene a su parada. Desliza para confirmar el abordaje.' },
  { id: 'toD', phase: 1, title: 'Valentina ya está a bordo', copy: 'La familia lo ve al instante. Diego, su hermano, es la siguiente parada y conserva su propio estado.' },
  { id: 'toSchool', phase: 1, title: 'Camino al colegio', copy: 'Ambos están a bordo. Al llegar, el conductor desliza para confirmar la llegada al colegio.' },
  { id: 'atSchool', phase: 2, title: 'Llegaron al colegio', copy: 'La familia ya ve «En el colegio» y el seguimiento se detiene. El conductor finaliza la ida.' },
  { id: 'idaDone', phase: 2, title: 'Ida completada', copy: 'Si un estudiante no vuelve en el furgón, la familia puede avisarlo desde la web. Por la tarde, el conductor revisa la vuelta.' },
  { id: 'returnReview', phase: 3, title: 'Revisar la vuelta', copy: 'Antes de salir del colegio, el conductor confirma quiénes regresan. Inicia la vuelta.' },
  { id: 'returnBoarding', phase: 3, title: 'Abordaje en el colegio', copy: 'Confirma a cada estudiante cuando suba, en el orden en que lleguen. La familia ve quién ya está a bordo.' },
  { id: 'deliverD', phase: 3, title: 'De vuelta a casa', copy: 'Diego es la primera entrega. Su familia ve el tiempo estimado. Desliza para confirmar la entrega.' },
  { id: 'deliverV', phase: 3, title: 'Una entrega confirmada', copy: 'Diego llegó a casa y su seguimiento terminó. Valentina sigue a bordo hasta su parada.' },
  { id: 'allDelivered', phase: 4, title: 'Sin entregas pendientes', copy: 'Todos fueron entregados. Desliza para finalizar el recorrido de vuelta.' },
  { id: 'done', phase: 4, title: 'Jornada completada', copy: 'Ida y vuelta completadas. Revisa el resumen del administrador o reinicia la demo para mostrarla a otra persona.' },
];

export const phases = ['Preparación', 'Ida', 'Colegio', 'Vuelta', 'Cierre'];

export function initialState() {
  return { step: 0, returnBoarded: [false, false] };
}

export const stepId = (state) => steps[state.step].id;
const at = (state, ...ids) => ids.includes(stepId(state));
const after = (state, id) => state.step >= steps.findIndex((s) => s.id === id);

/** Avanza un paso lineal. El abordaje de la vuelta se hace con boardReturn. */
export function advance(state) {
  if (at(state, 'returnBoarding', 'done')) return state;
  return { ...state, step: state.step + 1 };
}

/** Abordaje de la vuelta en cualquier orden. Con ambos a bordo comienza el regreso. */
export function boardReturn(state, index) {
  if (!at(state, 'returnBoarding') || state.returnBoarded[index]) return state;
  const returnBoarded = state.returnBoarded.map((v, i) => v || i === index);
  return { ...state, returnBoarded, step: returnBoarded.every(Boolean) ? state.step + 1 : state.step };
}

function exp(phase, label, title, message, eta = null) {
  return { phase, label, title, message, eta };
}

/** Lo que ve la familia (mismos criterios que la web familias.eunomi.cl). */
export function guardianView(state, i) {
  const id = stepId(state);
  const boarding = exp('outboundToSchool', 'En camino al colegio', 'Ya está a bordo', 'El furgón va hacia el colegio.');
  const waiting = exp('outboundWaitingPickup', 'Ida en curso', 'El recorrido al colegio ya comenzó', 'El furgón pasa primero por otras paradas.');
  const nextPickup = (eta) => exp('outboundWaitingPickup', 'Próximo abordaje', 'El furgón viene a tu parada', 'Ten todo listo para subir al furgón.', eta);
  const school = exp('atSchool', 'En el colegio', 'Llegó al colegio', 'La ida terminó. Aquí puedes revisar su regreso de hoy.');
  const home = exp('dayCompleted', 'Entregado', 'Llegó a casa', 'El seguimiento de hoy terminó.');
  const onWayHome = (eta) => exp('returnToHome', 'En camino a casa', 'Ya está a bordo', 'El furgón sigue el recorrido de regreso.', eta);
  const nextDrop = (eta) => exp('returnToHome', 'Próxima entrega', 'El furgón viene a tu parada', 'Ten a un adulto esperando en la parada.', eta);

  switch (id) {
    case 'prep':
    case 'review':
      return exp('beforeOutbound', 'Hoy', 'Hoy va en el furgón', 'El conductor lo pasará a buscar como siempre.');
    case 'toV':
      return i === 0 ? nextPickup(3) : waiting;
    case 'toD':
      return i === 0 ? { ...boarding, eta: 12 } : nextPickup(4);
    case 'toSchool':
      return { ...boarding, eta: 8 };
    case 'atSchool':
    case 'idaDone':
    case 'returnReview':
      return school;
    case 'returnBoarding':
      return state.returnBoarded[i]
        ? exp('returnPreparing', 'Preparando regreso', 'Ya está a bordo', 'El conductor sigue confirmando que todos subieron antes de salir.')
        : exp('returnPreparing', 'Preparando regreso', 'Aún está en el colegio', 'La vuelta comenzó y el conductor está confirmando quiénes suben.');
    case 'deliverD':
      return i === 1 ? nextDrop(4) : onWayHome(9);
    case 'deliverV':
      return i === 1 ? home : nextDrop(3);
    default:
      return home;
  }
}

export const trackingPhases = ['outboundWaitingPickup', 'outboundToSchool', 'returnToHome'];

/** Estado de cada estudiante en la app del conductor y en el panel. */
export function riderStatus(state, i) {
  const id = stepId(state);
  if (at(state, 'prep', 'review')) return 'Asiste';
  if (id === 'toV') return 'Pendiente';
  if (id === 'toD') return i === 0 ? 'A bordo' : 'Pendiente';
  if (id === 'toSchool') return 'A bordo';
  if (at(state, 'atSchool', 'idaDone', 'returnReview')) return 'En el colegio';
  if (id === 'returnBoarding') return state.returnBoarded[i] ? 'A bordo' : 'En el colegio';
  if (id === 'deliverD') return 'A bordo';
  if (id === 'deliverV') return i === 1 ? 'Entregado' : 'A bordo';
  return 'Entregado';
}

/** Estado de cada recorrido del día para el administrador. */
export function routeStatus(state) {
  const outbound = after(state, 'idaDone') ? 'Completado' : after(state, 'toV') ? 'En curso' : 'Programado';
  const ret = at(state, 'done') ? 'Completado' : after(state, 'returnBoarding') ? 'En curso' : 'Programado';
  return { outbound, ret };
}

export function metrics(state) {
  const { outbound, ret } = routeStatus(state);
  const routes = [outbound, ret];
  const onboard = [0, 1].filter((i) => riderStatus(state, i) === 'A bordo').length;
  return {
    routes: 2,
    active: routes.filter((r) => r === 'En curso').length,
    completed: routes.filter((r) => r === 'Completado').length,
    onboard,
    absences: 1,
  };
}

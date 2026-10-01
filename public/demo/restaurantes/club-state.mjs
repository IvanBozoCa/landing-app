// Estado simulado de la demo de Eunomi Restaurantes (club de clientes).
// Reglas tomadas de la app (club.eunomi.cl): 1 punto por cada $1.000 de la boleta, la boleta suma una vez,
// boletas ingresadas a mano quedan en revisión del local, +50 puntos por contar con quién vino (al confirmarse),
// la encuesta no da puntos, códigos de canje de 6 caracteres que valida el personal, promociones dentro del club.

export const LOCAL = { name: 'Local Demo', slug: 'demo', pesosPorPunto: 1000, puntosContexto: 50, vigenciaMin: 120 };

export const menu = [
  { sec: 'Café', items: [{ id: 'p1', name: 'Espresso', price: 2200 }, { id: 'p2', name: 'Cappuccino', price: 3200 }, { id: 'p3', name: 'Latte de vainilla', price: 3600 }] },
  { sec: 'Para comer', items: [{ id: 'p4', name: 'Sándwich de pollo pesto', price: 7900 }, { id: 'p5', name: 'Pasta del día', price: 9800 }, { id: 'p6', name: 'Ensalada de quinoa', price: 8200 }] },
  { sec: 'Postres', items: [{ id: 'p7', name: 'Cheesecake de maracuyá', price: 4200 }, { id: 'p8', name: 'Brownie con helado', price: 3900 }, { id: 'p9', name: 'Tiramisú', price: 4400 }] },
];
export const products = menu.flatMap((s) => s.items);
export const productById = (id) => products.find((p) => p.id === id);

export const rewards = [
  { id: 'b1', name: 'Bebida de la casa', cost: 30 },
  { id: 'b2', name: 'Postre a elección', cost: 60 },
  { id: 'b3', name: '10% en tu cuenta', cost: 120 },
];

export const SEGMENTS = [
  { id: 'todos', name: 'Todos los inscritos' },
  { id: 'habituales', name: 'Habituales' },
  { id: 'novuelven', name: 'Clientes que no vuelven' },
  { id: 'turistas', name: 'Turistas' },
];

export const pesos = (n) => `$${Math.round(n).toLocaleString('es-CL')}`;

/** Clientes ficticios del panel (además de quien prueba la demo). */
const BASE_MEMBERS = [
  { id: 'm1', name: 'Cliente ficticio 01', seg: 'habituales', visits: 9, days: 3, promos: true },
  { id: 'm2', name: 'Cliente ficticio 02', seg: 'habituales', visits: 7, days: 6, promos: false },
  { id: 'm3', name: 'Cliente ficticio 14', seg: 'novuelven', visits: 4, days: 52, promos: true },
  { id: 'm4', name: 'Cliente ficticio 17', seg: 'novuelven', visits: 3, days: 47, promos: true },
  { id: 'm5', name: 'Cliente ficticio 25', seg: 'nuevos', visits: 1, days: 9, promos: true },
  { id: 'm6', name: 'Cliente ficticio 36', seg: 'turistas', visits: 1, days: 12, promos: false },
];
const SEGMENT_COUNTS = { todos: 45, habituales: 12, novuelven: 8, nuevos: 12, turistas: 13 };

export function initialState() {
  return {
    member: null, // quien prueba la demo como cliente
    points: 0,
    pendingPoints: 0,
    history: [],
    codes: [], // { code, kind: 'premio'|'promo', what, refId, status: 'activo'|'entregado' }
    receipts: [], // { folio, amount, via: 'timbre'|'manual', status: 'confirmada'|'en_revision'|'rechazada', surveyed, context }
    nextFolio: 4861,
    reviews: { // nota de 1 a 5 por producto (suma y cantidad)
      p2: [83, 18], p4: [43, 11], p5: [27, 8], p7: [40, 9], p8: [29, 6], p9: [13, 4], p1: [22, 5],
    },
    comments: ['Excelente café (ficticio)', 'La atención fue lenta (ficticio)', 'Volveremos (ficticio)'],
    week: { visits: 38, joined: 6, redeemed: 4, promosUsed: 2 },
    promos: [], // { id, title, benefit, segment, reach, seen, used }
    seq: 1,
  };
}

const code6 = (n) => {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let x = (n * 7919 + 104729) % 2147483647, s = '';
  for (let i = 0; i < 6; i++) { x = (x * 48271) % 2147483647; s += abc[x % abc.length]; }
  return s;
};

export function join(state, { name, phone, acceptsClub, acceptsPromos, origin }) {
  if (!acceptsClub) return { state, error: 'Para unirte, acepta ser parte del club.' };
  if (!name?.trim()) return { state, error: 'Escribe tu nombre.' };
  if ((phone || '').replace(/\D/g, '').length < 8) return { state, error: 'Escribe tu teléfono, por ejemplo 9 1234 5678.' };
  const member = { id: 'yo', name: name.trim(), phone, promos: !!acceptsPromos, origin: origin || null, seg: 'nuevos' };
  return { state: { ...state, member, week: { ...state.week, joined: state.week.joined + 1 } } };
}

/** Boleta escaneada (timbre): se confirma sola y suma 1 punto por cada $1.000. Ingresada a mano: queda en revisión. */
export function addReceipt(state, { amount, via }) {
  if (!state.member) return { state, error: 'Primero únete al club.' };
  const folio = state.nextFolio;
  const pts = Math.floor(amount / LOCAL.pesosPorPunto);
  const receipt = { folio, amount, via, status: via === 'timbre' ? 'confirmada' : 'en_revision', points: pts, surveyed: false, context: false };
  let s = { ...state, nextFolio: folio + 1, receipts: [...state.receipts, receipt] };
  if (receipt.status === 'confirmada') {
    s = { ...s, points: s.points + pts, history: [{ kind: 'suma', text: `Boleta N° ${folio}`, pts }, ...s.history], week: { ...s.week, visits: s.week.visits + 1 }, member: { ...s.member, seg: 'nuevos' } };
  } else {
    s = { ...s, pendingPoints: s.pendingPoints + pts };
  }
  return { state: s, receipt };
}

/** Encuesta: no da puntos. Contar con quién vino suma el bono cuando la boleta está confirmada. */
export function answerSurvey(state, folio, { ratings = {}, party = null, comment = '' }) {
  const r = state.receipts.find((x) => x.folio === folio);
  if (!r || r.surveyed) return { state, error: 'Esta visita ya tiene respuestas.' };
  const reviews = { ...state.reviews };
  for (const [pid, v] of Object.entries(ratings)) {
    const [sum, n] = reviews[pid] || [0, 0];
    reviews[pid] = [sum + v, n + 1];
  }
  const told = !!party && (party.adults + party.kids + party.seniors) > 0;
  const receipts = state.receipts.map((x) => (x.folio === folio ? { ...x, surveyed: true, context: told } : x));
  let s = { ...state, reviews, receipts, comments: comment.trim() ? [comment.trim(), ...state.comments] : state.comments };
  let bonus = 0, bonusPending = false;
  if (told) {
    if (r.status === 'confirmada') { bonus = LOCAL.puntosContexto; s = { ...s, points: s.points + bonus, history: [{ kind: 'bono', text: 'Contaste con quién viniste', pts: bonus }, ...s.history] }; }
    else bonusPending = true;
  }
  return { state: s, bonus, bonusPending };
}

/** El dueño revisa una boleta ingresada a mano. */
export function reviewReceipt(state, folio, approve) {
  const r = state.receipts.find((x) => x.folio === folio && x.status === 'en_revision');
  if (!r) return state;
  const receipts = state.receipts.map((x) => (x.folio === folio ? { ...x, status: approve ? 'confirmada' : 'rechazada' } : x));
  let s = { ...state, receipts, pendingPoints: state.pendingPoints - r.points };
  if (approve) {
    const bonus = r.context ? LOCAL.puntosContexto : 0;
    s = { ...s, points: s.points + r.points + bonus, week: { ...s.week, visits: s.week.visits + 1 },
      history: [...(bonus ? [{ kind: 'bono', text: 'Contaste con quién viniste', pts: bonus }] : []), { kind: 'suma', text: `Boleta N° ${folio} (revisada)`, pts: r.points }, ...s.history] };
  }
  return s;
}

export function requestReward(state, rewardId) {
  const rw = rewards.find((x) => x.id === rewardId);
  if (!state.member || state.points < rw.cost) return { state, error: 'Aún no tienes los puntos para este premio.' };
  const code = code6(state.seq + 17);
  return {
    state: { ...state, seq: state.seq + 1, points: state.points - rw.cost,
      history: [{ kind: 'canje', text: `Canje: ${rw.name}`, pts: -rw.cost }, ...state.history],
      codes: [{ code, kind: 'premio', what: rw.name, refId: rw.id, status: 'activo' }, ...state.codes] },
    code,
  };
}

/** Quién está en cada grupo. La persona que prueba la demo es "nueva": no está en "no vuelven". */
export function segmentCount(state, seg) {
  const me = state.member ? 1 : 0;
  if (seg === 'todos') return SEGMENT_COUNTS.todos + me;
  return SEGMENT_COUNTS[seg] + (seg === 'nuevos' ? me : 0);
}
export function memberInSegment(state, seg) {
  return !!state.member && (seg === 'todos' || seg === state.member.seg);
}
export function membersOf(state, seg) {
  const list = BASE_MEMBERS.filter((m) => seg === 'todos' || m.seg === seg);
  return memberInSegment(state, seg) ? [{ id: 'yo', name: `${state.member.name} (tú)`, seg: state.member.seg, visits: state.receipts.filter((r) => r.status === 'confirmada').length, days: 0, promos: state.member.promos }, ...list] : list;
}

export function createPromo(state, { title, benefit, segment }) {
  if (!title?.trim()) return { state, error: 'Escribe el título que verán tus clientes.' };
  const p = { id: `pr${state.seq}`, title: title.trim(), benefit, segment, reach: segmentCount(state, segment), seen: 0, used: 0 };
  return { state: { ...state, seq: state.seq + 1, promos: [p, ...state.promos] }, promo: p };
}
export function visiblePromos(state) {
  return state.promos.filter((p) => memberInSegment(state, p.segment));
}
export function markSeen(state) {
  const ids = new Set(visiblePromos(state).filter((p) => !p._seenByMe).map((p) => p.id));
  if (!ids.size) return state;
  return { ...state, promos: state.promos.map((p) => (ids.has(p.id) ? { ...p, seen: p.seen + 1, _seenByMe: true } : p)) };
}
export function requestPromo(state, promoId) {
  const p = visiblePromos(state).find((x) => x.id === promoId);
  if (!p) return { state, error: 'Esta promoción no está disponible para ti.' };
  if (state.codes.some((c) => c.refId === promoId)) return { state, error: 'Ya pediste esta promoción.' };
  const code = code6(state.seq + 31);
  return { state: { ...state, seq: state.seq + 1, codes: [{ code, kind: 'promo', what: `${p.title} · ${p.benefit}`, refId: p.id, status: 'activo' }, ...state.codes] }, code };
}

/** El personal valida el código que muestra el cliente y entrega el beneficio. */
export function lookupCode(state, code) {
  const c = state.codes.find((x) => x.code === code.trim().toUpperCase());
  if (!c) return { error: 'No encontramos ese código. Revisa que tenga 6 caracteres.' };
  if (c.status !== 'activo') return { error: 'Ese código ya se usó.' };
  return { entry: c };
}
export function deliver(state, code) {
  const c = state.codes.find((x) => x.code === code && x.status === 'activo');
  if (!c) return state;
  const codes = state.codes.map((x) => (x.code === code ? { ...x, status: 'entregado' } : x));
  const week = c.kind === 'premio' ? { ...state.week, redeemed: state.week.redeemed + 1 } : { ...state.week, promosUsed: state.week.promosUsed + 1 };
  const promos = c.kind === 'promo' ? state.promos.map((p) => (p.id === c.refId ? { ...p, used: p.used + 1 } : p)) : state.promos;
  return { ...state, codes, week, promos };
}

export function avg(state, pid) {
  const [sum, n] = state.reviews[pid] || [0, 0];
  return n ? { avg: Math.round((sum / n) * 10) / 10, n } : { avg: null, n: 0 };
}

/** Progreso hacia el próximo premio (la tarjeta muestra 10 sellos). */
export function nextReward(state) {
  const goal = rewards.find((r) => r.cost > state.points) ?? null;
  const ready = rewards.filter((r) => r.cost <= state.points);
  return { goal, ready, missing: goal ? goal.cost - state.points : 0 };
}

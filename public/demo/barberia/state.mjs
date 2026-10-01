// Estado simulado de la demo de Eunomi Barberías.
// Reglas y textos tomados de la app (barberia.eunomi.cl): agenda por día con espacios libres,
// reserva desde el enlace con retención de 2 minutos, anotar, bloquear, cierre del día,
// tarjeta de sellos y promociones enviadas uno por uno solo a quien aceptó recibirlas.

export const SHOP = { name: 'Barbería Demo', barber: 'Matías', link: 'barberia.eunomi.cl/r/demo' };
export const SHIFTS = [[600, 840], [900, 1140]]; // 10:00–14:00 y 15:00–19:00
export const NOW = 13 * 60 + 10; // hora simulada de hoy: 13:10
export const HOLD_SECONDS = 120;
export const STAMPS = { goal: 6, prize: 'Corte gratis' };

export const services = [
  { id: 'clasico', name: 'Corte clásico', min: 30, price: 8000 },
  { id: 'degradado', name: 'Corte degradado', min: 45, price: 12000 },
  { id: 'barba', name: 'Barba', min: 30, price: 6000 },
  { id: 'combo', name: 'Corte + barba', min: 60, price: 16000 },
];
export const serviceById = (id) => services.find((s) => s.id === id);

export const CHANNELS = { online: 'Enlace', whatsapp: 'WhatsApp', instagram: 'Instagram', llamada: 'llamada', presencial: 'en persona' };

export const pad = (n) => String(n).padStart(2, '0');
export const hhmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
export const clp = (n) => `$${Math.round(n).toLocaleString('es-CL')}`;
export const dur = (m) => (m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`);

/** closedDays: días (0–6) en que la barbería no trabaja; sus reservas de ejemplo pasan al día siguiente. */
export function initialState(closedDays = []) {
  const clients = [
    { id: 'c1', name: 'Felipe Soto', phone: '+56 9 1111 0101', promos: true, visits: 8, spent: 92000, last: 21, stamps: 2, notes: 'Degradado bajo. Viene con su hijo los sábados.' },
    { id: 'c2', name: 'Diego Araya', phone: '+56 9 1111 0102', promos: false, visits: 3, spent: 42000, last: 35, stamps: 3, notes: '' },
    { id: 'c3', name: 'Andrés Muñoz', phone: '+56 9 1111 0103', promos: true, visits: 0, spent: 0, last: null, stamps: 0, notes: '' },
    { id: 'c4', name: 'Joaquín Reyes', phone: '+56 9 1111 0104', promos: true, visits: 12, spent: 120000, last: 14, stamps: 6, notes: 'Prefiere tijera arriba.' },
    { id: 'c5', name: 'Ignacio Pérez', phone: '+56 9 1111 0105', promos: true, visits: 5, spent: 60000, last: 42, stamps: 5, notes: '' },
    { id: 'c6', name: 'Martín Rojas', phone: '+56 9 1111 0106', promos: false, visits: 1, spent: 8000, last: 60, stamps: 1, notes: '' },
  ];
  const r = (id, day, start, service, client, canal, estado = 'CONFIRMADA') => ({ id, day, start, service, client, canal, estado, promo: 0 });
  const reservations = [
    r('r1', 0, 600, 'degradado', 'c1', 'whatsapp'),
    r('r2', 0, 660, 'combo', 'c2', 'online'),
    r('r3', 0, 765, 'barba', 'c3', 'presencial'),
    r('r4', 0, 930, 'clasico', 'c4', 'online'),
    r('r5', 0, 1020, 'degradado', 'c5', 'instagram'),
    r('r6', 1, 630, 'degradado', 'c6', 'online'),
    r('r7', 1, 960, 'combo', 'c1', 'whatsapp'),
    r('r8', 2, 720, 'clasico', 'c2', 'online'),
    r('r9', 3, 900, 'barba', 'c5', 'llamada'),
    r('r10', 4, 600, 'combo', 'c4', 'online'),
    r('r11', 5, 1050, 'degradado', 'c3', 'instagram'),
  ];
  const moved = reservations
    .map((x) => { let d = x.day; while (closedDays.includes(d)) d += 1; return { ...x, day: d }; })
    .filter((x) => x.day <= 6);
  return { clients, reservations: moved, blocks: [], promo: null, seq: 100 };
}

/** Días cerrados: domingos (salvo hoy, para que la demo siempre tenga agenda). */
export function isClosed(date, day) {
  return day > 0 && date.getDay() === 0;
}

const BUSY = new Set(['CONFIRMADA', 'RETENIDA', 'ATENDIDA', 'NO_ASISTIO', 'PENDIENTE_APROBACION']);
export const endOf = (r) => r.start + serviceById(r.service).min;

export function busyRanges(state, day) {
  return [
    ...state.reservations.filter((r) => r.day === day && BUSY.has(r.estado)).map((r) => [r.start, endOf(r)]),
    ...state.blocks.filter((b) => b.day === day).map((b) => [b.start, b.end]),
  ].sort((a, b) => a[0] - b[0]);
}

/** Espacios libres del día. Hoy se recorta lo que ya pasó y se redondea a 15 min (como al compartir). */
export function freeGaps(state, day, closed = false) {
  if (closed) return [];
  const busy = busyRanges(state, day);
  const gaps = [];
  for (const [s0, e] of SHIFTS) {
    let cursor = s0;
    if (day === 0 && cursor < NOW) cursor = Math.max(cursor, Math.ceil(NOW / 15) * 15);
    for (const [bs, be] of busy) {
      if (be <= cursor || bs >= e) continue;
      if (bs > cursor) gaps.push([cursor, Math.min(bs, e)]);
      cursor = Math.max(cursor, be);
    }
    if (cursor < e) gaps.push([cursor, e]);
  }
  return gaps.filter(([a, b]) => b - a >= 15);
}

/** Horas que se ofrecen para un servicio: cada 15 min donde el servicio cabe completo. */
export function slots(state, day, minutes, closed = false) {
  const out = [];
  for (const [a, b] of freeGaps(state, day, closed)) {
    for (let t = a; t + minutes <= b; t += 15) out.push(t);
  }
  return out;
}

export function occupancy(state, day, closed = false) {
  if (closed) return 0;
  const total = SHIFTS.reduce((s, [a, b]) => s + b - a, 0);
  const busy = busyRanges(state, day).reduce((s, [a, b]) => s + Math.max(0, b - a), 0);
  return Math.min(100, Math.round((busy / total) * 100));
}

export const clientById = (state, id) => state.clients.find((c) => c.id === id);
export const prizeReady = (state, clientId) => (clientById(state, clientId)?.stamps ?? 0) >= STAMPS.goal;

/** Precio con la promoción activa (descuento en pesos, para todos los servicios). */
export function priceWithPromo(state, service) {
  const d = state.promo ? Math.min(state.promo.discount, service.price) : 0;
  return { price: service.price - d, discount: d };
}

function nextId(state, prefix) {
  return `${prefix}${state.seq + 1}`;
}

/** El cliente toma una hora: queda retenida 2 minutos mientras completa sus datos. */
export function hold(state, day, start, serviceId) {
  const s = serviceById(serviceId);
  if (!slots(state, day, s.min).includes(start)) return { state, error: 'Alguien acaba de tomar esa hora. Elige otra.' };
  const id = nextId(state, 'r');
  const res = { id, day, start, service: serviceId, client: null, canal: 'online', estado: 'RETENIDA', promo: 0 };
  return { state: { ...state, seq: state.seq + 1, reservations: [...state.reservations, res] }, id };
}

export function release(state, id) {
  return { ...state, reservations: state.reservations.filter((r) => !(r.id === id && r.estado === 'RETENIDA')) };
}

const normPhone = (p) => p.replace(/\D/g, '');

/** Completa la reserva retenida con nombre y celular. Un celular solo puede tener una hora futura online. */
export function complete(state, id, { name, phone, promos }) {
  const res = state.reservations.find((r) => r.id === id);
  if (!res || res.estado !== 'RETENIDA') return { state, error: 'Esa hora ya no está disponible. Elige otra.' };
  if (!name.trim() || normPhone(phone).length < 11) return { state, error: 'Escribe tu nombre y tu celular completo, por ejemplo +56 9 1234 5678.' };
  let clients = state.clients;
  let client = clients.find((c) => normPhone(c.phone) === normPhone(phone));
  if (client) {
    const future = state.reservations.some((r) => r.client === client.id && r.canal === 'online' && r.estado === 'CONFIRMADA' && (r.day > 0 || r.start > NOW));
    if (future) return { state, error: 'Ya tienes una hora reservada. Si quieres cambiarla, avísale al barbero.' };
    if (promos && !client.promos) clients = clients.map((c) => (c.id === client.id ? { ...c, promos: true } : c));
  } else {
    client = { id: nextId(state, 'c'), name: name.trim(), phone, promos, visits: 0, spent: 0, last: null, stamps: 0, notes: '' };
    clients = [...clients, client];
  }
  const discount = priceWithPromo(state, serviceById(res.service)).discount;
  const reservations = state.reservations.map((r) => (r.id === id ? { ...r, client: client.id, estado: 'CONFIRMADA', promo: discount } : r));
  return { state: { ...state, seq: state.seq + 1, clients, reservations }, clientId: client.id };
}

/** El barbero anota una hora pedida por otro canal. */
export function annotate(state, { day, start, serviceId, clientId, newClient, canal, usePromo }) {
  const s = serviceById(serviceId);
  if (!clientId && !(newClient?.name?.trim() && normPhone(newClient.phone ?? '').length >= 11)) return { state, error: 'Completa nombre y celular' };
  if (!slots(state, day, s.min).includes(start)) return { state, error: 'Esa hora se acaba de ocupar. Elige otra.' };
  let clients = state.clients;
  let seq = state.seq;
  let cid = clientId;
  if (!cid) {
    seq += 1;
    cid = `c${seq}`;
    clients = [...clients, { id: cid, name: newClient.name.trim(), phone: newClient.phone, promos: !!newClient.promos, visits: 0, spent: 0, last: null, stamps: 0, notes: '' }];
  }
  seq += 1;
  const promo = usePromo ? priceWithPromo(state, s).discount : 0;
  const res = { id: `r${seq}`, day, start, service: serviceId, client: cid, canal, estado: 'CONFIRMADA', promo };
  return { state: { ...state, seq, clients, reservations: [...state.reservations, res] }, id: res.id };
}

export function cancel(state, id) {
  return { ...state, reservations: state.reservations.map((r) => (r.id === id ? { ...r, estado: 'CANCELADA' } : r)) };
}

/** Bloquea un tramo: deja de ofrecerse en el enlace. No se puede bloquear encima de una reserva. */
export function block(state, { day, start, end, reason }) {
  const clash = state.reservations.some((r) => r.day === day && BUSY.has(r.estado) && r.start < end && endOf(r) > start);
  if (clash) return { state, error: 'Ese tiempo tiene una reserva. Muévela o anúlala antes de bloquearlo.' };
  const b = { id: `b${state.seq + 1}`, day, start, end, reason: reason?.trim() ?? '' };
  return { state: { ...state, seq: state.seq + 1, blocks: [...state.blocks, b] } };
}
export function unblock(state, id) {
  return { ...state, blocks: state.blocks.filter((b) => b.id !== id) };
}

/** Horas de hoy ya terminadas que falta confirmar (¿Vinieron todos?). */
export function toClose(state) {
  return state.reservations.filter((r) => r.day === 0 && r.estado === 'CONFIRMADA' && endOf(r) <= NOW);
}

/** Cierre del día: lo atendido suma visitas, gasto y sellos; lo que no vino no suma nada. */
export function closeDay(state, noShowIds) {
  const ids = new Set(toClose(state).map((r) => r.id));
  let clients = state.clients;
  const reservations = state.reservations.map((r) => {
    if (!ids.has(r.id)) return r;
    if (noShowIds.includes(r.id)) return { ...r, estado: 'NO_ASISTIO' };
    const paid = serviceById(r.service).price - (r.promo || 0);
    clients = clients.map((c) => (c.id === r.client ? { ...c, visits: c.visits + 1, spent: c.spent + paid, last: 0, stamps: c.stamps + 1 } : c));
    return { ...r, estado: 'ATENDIDA' };
  });
  return { ...state, clients, reservations };
}

export function givePrize(state, clientId) {
  if (!prizeReady(state, clientId)) return state;
  return { ...state, clients: state.clients.map((c) => (c.id === clientId ? { ...c, stamps: c.stamps - STAMPS.goal } : c)) };
}

export function updateClient(state, clientId, patch) {
  return { ...state, clients: state.clients.map((c) => (c.id === clientId ? { ...c, ...patch } : c)) };
}

/** Promoción: solo se ofrece a quienes aceptaron recibir promociones. */
export function createPromo(state, { title, discount, message }) {
  if (!title.trim() || !(discount > 0)) return { state, error: 'Ponle un nombre y un descuento.' };
  return { state: { ...state, promo: { title: title.trim(), discount: Math.round(discount), message, sent: {} } } };
}
export const promoRecipients = (state) => state.clients.filter((c) => c.promos);
export function markSent(state, clientId) {
  if (!state.promo) return state;
  return { ...state, promo: { ...state.promo, sent: { ...state.promo.sent, [clientId]: true } } };
}

export function shareText(state, day, dateLabel) {
  const gaps = freeGaps(state, day);
  if (!gaps.length) return `No me quedan horas libres el ${dateLabel}.`;
  return [`Horas disponibles el ${dateLabel}:`, ...gaps.map(([a, b]) => `• ${hhmm(a)} a ${hhmm(b)}`), `Reserva aquí: https://${SHOP.link}`].join('\n');
}

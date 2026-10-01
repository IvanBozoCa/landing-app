import {
  SHOP, NOW, HOLD_SECONDS, STAMPS, CHANNELS, services, serviceById, hhmm, clp, dur, endOf,
  initialState, isClosed, freeGaps, slots, occupancy, clientById, prizeReady, priceWithPromo,
  hold, release, complete, annotate, cancel, block, unblock, toClose, closeDay, givePrize, updateClient,
  createPromo, promoRecipients, markSent, shareText,
} from './state.mjs';

const screen = document.querySelector('#screen');
const feedback = document.querySelector('#feedback');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---------- fechas reales para que la demo se vea al día ----------
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const base = new Date(); base.setHours(12, 0, 0, 0);
const dateOf = (i) => { const d = new Date(base); d.setDate(d.getDate() + i); return d; };
const longDate = (i) => { const d = dateOf(i); return `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`; };
const shortDay = (i) => (i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : DAYS[dateOf(i).getDay()].slice(0, 3).replace('mié', 'mié'));
const closed = (i) => isClosed(dateOf(i), i);

// ---------- tareas sugeridas ----------
const TASKS = [
  { id: 'reserva', title: 'Reserva una hora como cliente', hint: 'Desde el enlace, sin cuenta ni app. Después mira cómo aparece en la agenda.', go: { role: 'client' } },
  { id: 'anotar', title: 'Anota una hora que te pidieron por WhatsApp', hint: 'Toca un espacio libre o «+ Anotar».', go: { role: 'barber', view: 'day', day: 0 } },
  { id: 'bloquear', title: 'Bloquea un horario que no puedes atender', hint: 'Deja de ofrecerse en tu enlace al instante.', go: { role: 'barber', view: 'day', day: 0 } },
  { id: 'cierre', title: 'Confirma quién vino hoy', hint: 'Solo lo atendido suma visitas, gasto y sellos.', go: { role: 'barber', view: 'day', day: 0 } },
  { id: 'premio', title: 'Entrega un premio de la tarjeta de sellos', hint: 'Joaquín ya juntó sus 6 sellos.', go: { role: 'barber', view: 'clientes' } },
  { id: 'promo', title: 'Prepara una promoción y envíala', hint: 'Solo a clientes que aceptaron recibirlas, uno por uno.', go: { role: 'barber', view: 'clientes' } },
];

let state, role, ui, done, timer;
const EXAMPLES = [
  { name: 'Lucas Fuentes', phone: '+56 9 2222 0301' },
  { name: 'Benjamín Castro', phone: '+56 9 2222 0302' },
  { name: 'Vicente Lagos', phone: '+56 9 2222 0303' },
];
function reset() {
  state = initialState([0, 1, 2, 3, 4, 5, 6].filter((i) => closed(i)));
  role = 'barber';
  done = new Set();
  ui = { view: 'day', day: 0, sheet: null, filter: 'todos', search: '', client: { step: 'pick', service: null, day: 0, hold: null, holdUntil: 0, error: '', result: null, example: 0 } };
  clearInterval(timer);
}
reset();

function finish(task, message) {
  done.add(task);
  say(message);
}
function say(text) { feedback.textContent = text; }

// ---------- piezas comunes ----------
const frame = (url, body) => `<div class="browser"><div class="browser-bar"><span></span><span></span><span></span><div class="url">🔒 ${url}</div></div>${body}</div>`;
const tag = (text, kind = '') => `<span class="etiqueta ${kind}">${text}</span>`;
function sheet(title, body) {
  return `<div class="sheet-back" data-action="close-sheet"><section class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}" data-stop><div class="sheet-head"><h2>${esc(title)}</h2><button class="boton-texto" data-action="close-sheet">Cerrar</button></div>${body}</section></div>`;
}

// ---------- barbero ----------
function barber() {
  const tabs = [['day0', 'Hoy'], ['day1', 'Mañana'], ['semana', 'Semana'], ['clientes', 'Clientes'], ['enlace', 'Enlace']];
  const active = ui.view === 'day' ? (ui.day <= 1 ? `day${ui.day}` : 'semana') : ui.view;
  const nav = tabs.map(([k, l]) => `<button class="pestana" data-tab="${k}" aria-pressed="${active === k}">${l}</button>`).join('');
  let body = '';
  if (ui.view === 'day') body = dayView(ui.day);
  else if (ui.view === 'semana') body = weekView();
  else if (ui.view === 'clientes') body = clientsView();
  else body = linkView();
  return frame('barberia.eunomi.cl', `<div class="app barbero"><header class="cabecera"><div class="encabezado"><div class="marca">${SHOP.name} <span>· ${SHOP.barber}</span></div><span class="hora-demo">${hhmm(NOW)}</span></div><nav class="pestanas" aria-label="Vista de la agenda">${nav}</nav></header><main>${body}</main>${sheetView()}</div>`);
}

function dayView(day) {
  const title = day === 0 ? 'Hoy · ' : day === 1 ? 'Mañana · ' : '';
  const isClosedDay = closed(day);
  const head = `<h1 class="titulo">${title}<span class="capital">${longDate(day)}</span></h1>`;
  if (isClosedDay) return `${head}<p class="vacio">No trabajas este día. Si quieres abrir horas, cambia el horario de este día.</p>`;
  const res = state.reservations.filter((r) => r.day === day && r.estado !== 'CANCELADA');
  const active = res.filter((r) => ['CONFIRMADA', 'RETENIDA', 'ATENDIDA', 'NO_ASISTIO'].includes(r.estado));
  const gaps = freeGaps(state, day);
  const freeMin = gaps.reduce((s, [a, b]) => s + b - a, 0);
  const cancelled = state.reservations.filter((r) => r.day === day && r.estado === 'CANCELADA').length;
  const closing = day === 0 ? toClose(state) : [];
  const items = [
    ...active.map((r) => ({ t: r.start, html: reservationRow(r, day) })),
    ...gaps.map(([a, b]) => ({ t: a, html: `<li><button class="fila libre" data-free="${a}"><span class="hora">${hhmm(a)}</span><span class="detalle"><b>Libre</b><small>${dur(b - a)} · toca para anotar</small></span></button></li>` })),
    ...state.blocks.filter((b) => b.day === day).map((b) => ({ t: b.start, html: `<li><button class="fila bloqueada" data-block="${b.id}"><span class="hora">${hhmm(b.start)}</span><span class="detalle"><b>Bloqueado</b><small>hasta las ${hhmm(b.end)}${b.reason ? ` · ${esc(b.reason)}` : ''} · no se ofrece a clientes</small></span></button></li>` })),
  ].sort((a, b) => a.t - b.t);
  return `${head}
${closing.length ? `<button class="aviso-cierre" data-action="cierre"><span class="detalle"><b>¿Vinieron todos?</b><small>${closing.length} ${closing.length === 1 ? 'hora por confirmar' : 'horas por confirmar'} · solo lo atendido suma visitas</small></span>${tag('Confirmar')}</button>` : ''}
<p class="resumen">${active.length} ${active.length === 1 ? 'reserva' : 'reservas'} · ${gaps.length} ${gaps.length === 1 ? 'espacio libre' : 'espacios libres'}${freeMin ? ` (${dur(freeMin)})` : ''} · <strong>${occupancy(state, day)} %</strong> agenda llena</p>
${gaps.length ? `<div class="compartir-horas"><span class="compartir-etiqueta">Compartir horas libres</span><div class="compartir-botones"><button class="boton-compartir whatsapp" data-action="share">WhatsApp</button><button class="boton-compartir" data-action="copy-share">Copiar</button></div></div><button class="boton-texto bloquear-enlace" data-action="bloquear">Bloquear horas que no puedes atender</button>` : ''}
<ol class="linea">${items.map((i) => i.html).join('')}</ol>
${cancelled ? `<p class="suave">${cancelled} ${cancelled === 1 ? 'reserva anulada' : 'reservas anuladas'} este día.</p>` : ''}
<p class="pista">Actualizado a las ${hhmm(NOW)} · se actualiza solo</p>
<button class="boton-flotante" data-action="anotar">+ Anotar</button>`;
}

function reservationRow(r, day) {
  const s = serviceById(r.service);
  const c = clientById(state, r.client);
  const now = day === 0 && r.start <= NOW && NOW < endOf(r);
  const labels = { RETENIDA: 'reservando…', ATENDIDA: 'atendido', NO_ASISTIO: 'no vino' };
  return `<li><button class="fila${now ? ' ahora' : ''}${r.estado === 'RETENIDA' ? ' pendiente' : ''}" data-res="${r.id}"><span class="hora">${hhmm(r.start)}</span><span class="detalle"><b>${c ? esc(c.name) : 'Cliente sin datos'}${now ? ' · ahora' : ''}</b><small>${s.name} · ${dur(s.min)} · ${CHANNELS[r.canal]}</small></span>${r.estado === 'CONFIRMADA' && prizeReady(state, r.client) ? tag('Premio', 'premio') : ''}${r.promo ? tag('Promo', 'promo') : ''}${labels[r.estado] ? tag(labels[r.estado]) : ''}</button></li>`;
}

function weekView() {
  return `<h1 class="titulo">Próximos 7 días</h1><ul class="semana">${Array.from({ length: 7 }, (_, i) => {
    const name = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : longDate(i).split(' ').slice(0, 2).join(' ');
    if (closed(i)) return `<li><button class="dia-semana" data-day="${i}"><span class="capital nombre">${name}</span><span class="suave">No trabaja</span></button></li>`;
    const pct = occupancy(state, i);
    const gaps = freeGaps(state, i).length;
    return `<li><button class="dia-semana" data-day="${i}"><span class="capital nombre">${name}</span><span class="barra" aria-hidden="true"><span style="width:${pct}%"></span></span><span class="cifra">${pct} % · ${gaps} ${gaps === 1 ? 'espacio' : 'espacios'}</span></button></li>`;
  }).join('')}</ul>`;
}

const FILTERS = [
  ['todos', 'Todos', () => true],
  ['hora', 'Con hora', (c) => state.reservations.some((r) => r.client === c.id && r.estado === 'CONFIRMADA' && (r.day > 0 || r.start > NOW))],
  ['frecuentes', 'Frecuentes', (c) => c.visits >= 5],
  ['nuevos', 'Nuevos', (c) => c.visits <= 1],
  ['lejos', 'Hace +30 días', (c) => c.last != null && c.last > 30],
  ['promos', 'Aceptan promos', (c) => c.promos],
];
function clientsView() {
  const f = FILTERS.find((x) => x[0] === ui.filter);
  const q = ui.search.trim().toLowerCase();
  const list = state.clients.filter(f[2]).filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '') || '§'));
  const promo = state.promo
    ? `<div class="tarjeta"><div class="fila-titulo"><b>Promociones</b>${tag('Activa', 'ok')}</div><p><b>${esc(state.promo.title)}</b> · ${clp(state.promo.discount)} de descuento en todos los servicios.</p><p class="suave">${Object.keys(state.promo.sent).length} de ${promoRecipients(state).length} enviados.</p><button class="boton-secundario" data-action="promo-send">Seguir enviando</button></div>`
    : `<div class="tarjeta"><div class="fila-titulo"><b>Promociones</b><button class="boton-principal chico" data-action="promo-new">Crear</button></div><p class="suave">Crea una y envíala a tus clientes por WhatsApp.</p></div>`;
  return `<h1 class="titulo">Clientes</h1>${promo}
<div class="tarjeta"><div class="fila-titulo"><b>Tarjeta de sellos</b>${tag('Activa', 'ok')}</div><p class="suave">Cada ${STAMPS.goal} visitas: ${STAMPS.prize}. Solo suman las atenciones confirmadas.</p></div>
<input class="buscar" id="buscar-cliente" placeholder="Buscar por nombre o celular" aria-label="Buscar cliente" value="${esc(ui.search)}">
<div class="chips" role="group" aria-label="Filtrar clientes">${FILTERS.map(([k, l]) => `<button class="chip" data-filter="${k}" aria-pressed="${ui.filter === k}">${l}</button>`).join('')}</div>
<ul class="clientes">${list.length ? list.map((c) => `<li><button class="fila" data-client="${c.id}"><span class="detalle"><b>${esc(c.name)}</b><small>${c.visits ? `${c.visits} ${c.visits === 1 ? 'visita' : 'visitas'} · última ${c.last === 0 ? 'hoy' : `hace ${c.last} días`}` : 'Sin visitas aún'}</small></span>${prizeReady(state, c.id) ? tag('Premio', 'premio') : ''}${c.notes ? tag('Nota') : ''}</button></li>`).join('') : '<li class="vacio">No hay clientes con ese filtro.</li>'}</ul>`;
}

function linkView() {
  return `<h1 class="titulo">Tu enlace de reservas</h1><p class="suave">Tus clientes eligen servicio, día y hora, y la reserva aparece al tiro en tu agenda.</p>
<div class="tarjeta enlace"><code>${SHOP.link}</code><div class="qr" role="img" aria-label="Código QR de ejemplo">${qrPattern()}</div><small class="suave">QR de ejemplo</small>
<div class="compartir-botones"><button class="boton-compartir whatsapp" data-action="share-link">Compartir enlace</button><button class="boton-compartir" data-action="copy-link">Copiar enlace</button></div></div>
<p class="suave">Ponlo en la bio de Instagram, en tu estado de WhatsApp o pega el QR en el espejo.</p>
<button class="boton-principal ancho" data-go-role="client">Ver cómo lo ven tus clientes →</button>`;
}
function qrPattern() {
  let cells = '';
  let seed = 7;
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    let on;
    if (finder) { const fx = x > 13 ? x - 14 : x; const fy = y > 13 ? y - 14 : y; on = fx === 0 || fy === 0 || fx === 6 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5); }
    else { seed = (seed * 9301 + 49297) % 233280; on = seed / 233280 > 0.55; }
    if (on) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  return `<svg viewBox="-1 -1 23 23" aria-hidden="true"><rect x="-1" y="-1" width="23" height="23" fill="#fff"/><g fill="#172126">${cells}</g></svg>`;
}

// ---------- hojas del barbero ----------
function sheetView() {
  const s = ui.sheet;
  if (!s) return '';
  if (s.type === 'anotar') return anotarSheet(s);
  if (s.type === 'res') return resSheet(s);
  if (s.type === 'bloquear') return blockSheet(s);
  if (s.type === 'bloqueo') {
    const b = state.blocks.find((x) => x.id === s.id);
    return sheet(`Bloqueado · ${hhmm(b.start)} a ${hhmm(b.end)}`, `<p class="suave">Mientras esté bloqueado, tus clientes no pueden reservar en este horario.</p><button class="boton-secundario ancho" data-action="unblock">Liberar este horario</button>`);
  }
  if (s.type === 'cierre') return closeSheet(s);
  if (s.type === 'ficha') return clientSheet(s);
  if (s.type === 'promo-new') return promoNewSheet(s);
  if (s.type === 'promo-send') return promoSendSheet();
  if (s.type === 'share') return sheet('Mensaje para compartir', `<pre class="mensaje">${esc(shareText(state, ui.day, longDate(ui.day)))}</pre><p class="suave">En la app se abre WhatsApp con este texto listo. En la demo no se envía nada.</p>`);
  return '';
}

function anotarSheet(s) {
  const svc = serviceById(s.service);
  const times = svc ? slots(state, ui.day, svc.min) : [];
  const q = (s.query || '').toLowerCase();
  const matches = q.length >= 2 ? state.clients.filter((c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '') || '§')) : [];
  const chosen = clientById(state, s.clientId);
  const clientPart = chosen
    ? `<div class="elegido"><b>${esc(chosen.name)}</b><small>${esc(chosen.phone)}</small><button class="boton-texto" data-action="anotar-clear">Cambiar</button></div>`
    : s.isNew
      ? `<label class="campo">Nombre<input id="an-nombre" value="${esc(s.newName || '')}" autocomplete="off"></label><label class="campo">Celular<input id="an-cel" inputmode="tel" value="${esc(s.newPhone || '+56 9 ')}"></label><label class="casilla"><input type="checkbox" id="an-promos" ${s.newPromos ? 'checked' : ''}><span>Acepta recibir promociones por WhatsApp<small>Pregúntale. Márcalo solo si te dijo que sí.</small></span></label><button class="boton-texto" data-action="anotar-existing">← Buscar un cliente existente</button>`
      : `<input class="buscar" id="an-buscar" placeholder="Nombre o celular" aria-label="Buscar cliente por nombre o celular" value="${esc(s.query || '')}" autocomplete="off">${matches.length ? `<p class="suave">Toca al cliente para elegirlo:</p><ul class="resultados">${matches.map((c) => `<li><button class="fila" data-pick="${c.id}"><span class="detalle"><b>${esc(c.name)}</b><small>${esc(c.phone)}</small></span>${tag('Elegir')}</button></li>`).join('')}</ul>` : q.length >= 2 ? '<p class="suave">No hay clientes con ese nombre o celular.</p>' : '<p class="suave">Escribe al menos 2 letras. Prueba «Fel» o «Joa».</p>'}<button class="boton-texto" data-action="anotar-new">+ Cliente nuevo</button>`;
  return sheet(`Anotar · ${ui.day === 0 ? 'hoy' : longDate(ui.day)}`, `
<p class="pequeno-titulo">Cliente</p>${clientPart}
<p class="pequeno-titulo">¿Qué se hace?</p><div class="chips">${services.map((x) => `<button class="chip" data-an-service="${x.id}" aria-pressed="${s.service === x.id}">${x.name}</button>`).join('')}</div>
${state.promo ? `<p class="pequeno-titulo">Promoción</p><div class="chips"><button class="chip" data-an-promo="0" aria-pressed="${!s.usePromo}">Sin promo</button><button class="chip" data-an-promo="1" aria-pressed="${!!s.usePromo}">${esc(state.promo.title)}</button></div>` : ''}
<p class="pequeno-titulo">Hora</p>${svc ? (times.length ? `<div class="horas">${times.map((t) => `<button class="hora-libre" data-an-time="${t}" aria-pressed="${s.time === t}">${hhmm(t)}</button>`).join('')}</div>` : '<p class="suave">No hay horas donde quepa este servicio. Prueba otro día o abre una hora extra.</p>') : '<p class="suave">Primero elige qué se hace.</p>'}
<p class="pequeno-titulo">¿Por dónde te escribió?</p><div class="chips">${['whatsapp', 'instagram', 'llamada', 'presencial'].map((k) => `<button class="chip" data-an-canal="${k}" aria-pressed="${s.canal === k}">${k === 'presencial' ? 'En persona' : k === 'llamada' ? 'Llamada' : CHANNELS[k]}</button>`).join('')}</div>
${s.error ? `<p class="alerta" role="alert">${esc(s.error)}</p>` : ''}
<button class="boton-principal ancho" data-action="anotar-save">${!chosen && !s.isNew ? 'Primero elige o crea el cliente' : s.time == null ? 'Elige una hora' : `Anotar a las ${hhmm(s.time)}`}</button>
<button class="boton-texto" data-action="bloquear">¿No puedes atender a esa hora? Bloquéala sin cliente →</button>`);
}

function resSheet(s) {
  const r = state.reservations.find((x) => x.id === s.id);
  const svc = serviceById(r.service);
  const c = clientById(state, r.client);
  const future = r.day > 0 || r.start > NOW;
  let actions = '';
  if (r.estado === 'RETENIDA') actions = '<p class="suave">El cliente está completando sus datos en el enlace. La hora queda guardada por 2 minutos.</p>';
  else if (r.estado === 'CONFIRMADA' && future) actions = s.confirmCancel
    ? `<p class="alerta">¿Anular la reserva de ${esc(c.name)}? Se abre WhatsApp con la disculpa y tu enlace para que elija otra hora.</p><button class="boton-peligro ancho" data-action="cancel-yes">Sí, anular</button><button class="boton-texto" data-action="cancel-no">No, mantener</button>`
    : '<button class="boton-secundario ancho" data-action="cancel-ask">Anular reserva</button>';
  else if (r.estado === 'CONFIRMADA') actions = '<p class="suave">Se confirma en «¿Vinieron todos?», al terminar la hora.</p>';
  else actions = `<p class="suave">${r.estado === 'ATENDIDA' ? 'Atendido. Ya sumó la visita y el sello.' : r.estado === 'NO_ASISTIO' ? 'Marcado como no vino.' : ''}</p>`;
  return sheet(`${hhmm(r.start)} · ${c ? c.name : 'Cliente sin datos'}`, `<p class="resumen">${svc.name} · ${dur(svc.min)} · ${clp(svc.price - (r.promo || 0))}${r.promo ? ` (promo, antes ${clp(svc.price)})` : ''}<br>Reservó por ${CHANNELS[r.canal]}${c ? ` · ${esc(c.phone)}` : ''}</p>${c && prizeReady(state, c.id) && r.estado === 'CONFIRMADA' ? `<p class="aviso-premio">Tiene un premio listo: ${STAMPS.prize}. Entrégalo desde su ficha en Clientes.</p>` : ''}${actions}`);
}

function blockSheet(s) {
  const starts = freeGaps(state, ui.day).flatMap(([a, b]) => { const o = []; for (let t = a; t + 15 <= b; t += 15) o.push(t); return o; });
  const gapOf = (t) => freeGaps(state, ui.day).find(([a, b]) => t >= a && t < b);
  const durations = [[30, '30 min'], [60, '1 hora'], ['turno', 'Hasta que termine ese turno']];
  let end = null;
  if (s.start != null) {
    const g = gapOf(s.start);
    end = s.len === 'turno' ? g[1] : Math.min(g[1], s.start + (s.len || 30));
  }
  return sheet('Bloquear horas', `<p class="suave">El tiempo bloqueado deja de ofrecerse en tu enlace de reservas. Tus clientes no ven el motivo.</p>
${starts.length ? `<p class="pequeno-titulo">Desde</p><div class="horas">${starts.map((t) => `<button class="hora-libre" data-bl-start="${t}" aria-pressed="${s.start === t}">${hhmm(t)}</button>`).join('')}</div>
<p class="pequeno-titulo">¿Cuánto tiempo?</p><div class="chips">${durations.map(([k, l]) => `<button class="chip" data-bl-len="${k}" aria-pressed="${(s.len || 30) === k}">${l}</button>`).join('')}</div>
<label class="campo">Motivo (opcional)<input id="bl-motivo" placeholder="Ej.: trámite, almuerzo largo" value="${esc(s.reason || '')}"></label>
${s.error ? `<p class="alerta" role="alert">${esc(s.error)}</p>` : ''}
<button class="boton-principal ancho" data-action="block-save">${end ? `Bloquear de ${hhmm(s.start)} a ${hhmm(end)}` : 'Elige desde qué hora'}</button>` : '<p class="vacio">No tienes horas libres que bloquear este día.</p>'}`);
}

function closeSheet(s) {
  const list = toClose(state);
  const vinieron = list.length - s.noShow.length;
  return sheet('¿Vinieron todos?', `<p class="suave">Marca solo a quien no vino. Lo atendido suma visitas, gasto y sellos del cliente.</p><ul class="cierre">${list.map((r) => {
    const c = clientById(state, r.client);
    const no = s.noShow.includes(r.id);
    return `<li><span class="detalle"><b>${hhmm(r.start)} · ${c ? esc(c.name) : 'Cliente sin datos'}</b><small>${serviceById(r.service).name}</small></span><div class="segmento"><button data-cl="${r.id}" data-v="1" aria-pressed="${!no}">Vino</button><button data-cl="${r.id}" data-v="0" aria-pressed="${no}">No vino</button></div></li>`;
  }).join('')}</ul><button class="boton-principal ancho" data-action="close-save">${s.noShow.length ? `Guardar · ${vinieron} ${vinieron === 1 ? 'vino' : 'vinieron'}, ${s.noShow.length} no ${s.noShow.length === 1 ? 'vino' : 'vinieron'}` : list.length === 1 ? 'Sí, vino' : `Sí, vinieron los ${list.length}`}</button>`);
}

function clientSheet(s) {
  const c = clientById(state, s.id);
  const upcoming = state.reservations.filter((r) => r.client === c.id && r.estado === 'CONFIRMADA' && (r.day > 0 || r.start > NOW));
  const dots = Array.from({ length: STAMPS.goal }, (_, i) => `<span class="sello${i < Math.min(c.stamps, STAMPS.goal) ? ' lleno' : ''}"></span>`).join('');
  return sheet(c.name, `<p class="suave">${esc(c.phone)}</p><div class="compartir-botones"><button class="boton-compartir whatsapp" data-action="sim" data-msg="En la app se abre WhatsApp con ${esc(c.name.split(' ')[0])}.">WhatsApp</button><button class="boton-compartir" data-action="sim" data-msg="En la app se abre la llamada.">Llamar</button></div>
<div class="cifras"><div><b>${c.visits}</b><small>visitas</small></div><div><b>${clp(c.spent)}</b><small>gastado</small></div><div><b>${c.last == null ? '—' : c.last === 0 ? 'hoy' : `${c.last} d`}</b><small>última visita</small></div></div>
<div class="tarjeta"><b>Sellos · ${Math.min(c.stamps, STAMPS.goal)} de ${STAMPS.goal}</b><div class="sellos">${dots}</div>${prizeReady(state, c.id) ? (s.confirmPrize ? `<p>¿Le entregaste «${STAMPS.prize}»?</p><button class="boton-principal ancho" data-action="prize-yes">Sí, se lo entregué</button><button class="boton-texto" data-action="prize-no">No todavía</button>` : `<button class="boton-principal ancho" data-action="prize-ask">Entregar premio</button>`) : `<small class="suave">Le faltan ${STAMPS.goal - c.stamps} para «${STAMPS.prize}».</small>`}</div>
<label class="campo">Notas del cliente<textarea id="notas" rows="3" placeholder="Ej.: degradado bajo, viene con sus hijos…">${esc(c.notes)}</textarea><small class="suave">Solo lo ve el equipo de tu barbería, nunca el cliente. No anotes salud, religión, política ni datos delicados.</small></label>
<button class="boton-secundario" data-action="notes-save">${s.saved ? 'Guardado ✓' : 'Guardar notas'}</button>
<label class="casilla"><input type="checkbox" id="ficha-promos" ${c.promos ? 'checked' : ''}><span>Acepta recibir promociones por WhatsApp<small>Márcalo solo si te dijo que sí.</small></span></label>
<p class="pequeno-titulo">Próximas horas</p>${upcoming.length ? `<ul class="mini-lista">${upcoming.map((r) => `<li class="capital">${r.day === 0 ? 'Hoy' : longDate(r.day)} · ${hhmm(r.start)} · ${serviceById(r.service).name}</li>`).join('')}</ul>` : '<p class="suave">Sin horas agendadas.</p>'}`);
}

const IDEAS = [
  ['Semana tranquila', 'Hola {nombre}, esta semana tengo horas libres y te las dejo con descuento.'],
  ['Te extrañamos', 'Hola {nombre}, hace tiempo que no te veo por la barbería. Te tengo un descuento para tu próximo corte.'],
];
function promoNewSheet(s) {
  return sheet('Nueva promoción', `<p class="pequeno-titulo">Ideas</p><div class="chips">${IDEAS.map(([t], i) => `<button class="chip" data-idea="${i}" aria-pressed="${s.title === t}">${t}</button>`).join('')}</div>
<label class="campo">Nombre<input id="pr-titulo" placeholder="Ej.: Semana tranquila" value="${esc(s.title || '')}"></label>
<label class="campo">Descuento en pesos<input id="pr-desc" inputmode="numeric" value="${esc(s.discount ?? 2000)}"></label>
<p class="suave">Vale para todos los servicios y para horas de esta semana.</p>
<label class="campo">Mensaje para tus clientes<textarea id="pr-msg" rows="3">${esc(s.message || 'Hola {nombre}, ')}</textarea></label>
${s.error ? `<p class="alerta" role="alert">${esc(s.error)}</p>` : ''}
<button class="boton-principal ancho" data-action="promo-create">Crear y enviar</button>`);
}
function promoSendSheet() {
  const p = state.promo;
  const list = promoRecipients(state);
  return sheet(`Enviar «${p.title}»`, `<p class="suave">Solo se envían a clientes que aceptaron recibirlas: ${list.length} de ${state.clients.length}. Uno por uno, desde tu WhatsApp.</p>
<pre class="mensaje">${esc(p.message.replace('{nombre}', list[0]?.name.split(' ')[0] ?? 'Felipe'))}\nReserva con descuento: https://${SHOP.link}?promo=SEMANA</pre>
<ul class="cierre">${list.map((c) => `<li><span class="detalle"><b>${esc(c.name)}</b><small>${esc(c.phone)}</small></span>${p.sent[c.id] ? tag('Enviado', 'ok') : `<button class="boton-compartir whatsapp" data-send="${c.id}">Enviar</button>`}</li>`).join('')}</ul>
<p class="pista">La promoción ya se ve en tu enlace: pruébalo como cliente.</p>`);
}

// ---------- cliente ----------
function client() {
  const c = ui.client;
  const head = `<header class="cliente-cabecera"><div class="marca">${SHOP.name} <span>· reserva tu hora</span></div></header>`;
  if (c.step === 'done') {
    const r = state.reservations.find((x) => x.id === c.result.id);
    const s = serviceById(r.service);
    const cl = clientById(state, r.client);
    return frame(`${SHOP.link}`, `<div class="app cliente">${head}<main><section class="confirmacion"><div class="check" aria-hidden="true">✓</div><h1 class="titulo">¡Listo, ${esc(cl.name.split(' ')[0])}!</h1><p class="resumen capital">${r.day === 0 ? 'hoy' : longDate(r.day)} a las <b>${hhmm(r.start)}</b><br>${s.name} · ${clp(s.price - (r.promo || 0))}${r.promo ? `<br>Con tu promo «${esc(state.promo.title)}»: ${clp(r.promo)} de descuento` : ''}</p>
<button class="boton-compartir whatsapp aviso-wa" data-action="sim" data-msg="En la app se abre tu WhatsApp con el mensaje listo para el barbero. En la demo no se envía nada.">Avisar al barbero por WhatsApp</button><p class="pista">Se abre tu WhatsApp con el mensaje listo; solo toca Enviar.</p>
<p class="suave">Te esperamos. Si no puedes venir, avísale al barbero para liberar la hora.</p>
<button class="boton-principal ancho" data-go-role="barber">Ver la reserva en la agenda del barbero →</button><button class="boton-texto" data-action="client-again">Reservar otra hora</button></section></main></div>`);
  }
  if (c.step === 'data') {
    const r = state.reservations.find((x) => x.id === c.hold);
    const s = serviceById(r.service);
    const { price, discount } = priceWithPromo(state, s);
    const left = Math.max(0, Math.round((c.holdUntil - Date.now()) / 1000));
    const ex = EXAMPLES[c.example % EXAMPLES.length];
    return frame(`${SHOP.link}`, `<div class="app cliente">${head}<main><form class="datos" id="datos" novalidate><p class="suave"><button type="button" class="boton-texto" data-action="client-back">← Cambiar hora</button></p>
<h1 class="titulo capital">${r.day === 0 ? 'hoy' : longDate(r.day)} · ${hhmm(r.start)}</h1><p class="resumen">${s.name} · ${clp(price)}${discount ? ` (antes ${clp(s.price)})` : ''}</p>
<p class="guardada" id="cuenta">${left > 0 ? `Te guardamos esta hora por ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : 'El tiempo se acabó, pero si nadie la tomó igual puedes confirmar.'}</p>
<label class="campo">Tu nombre<input id="cl-nombre" required value="${esc(ex.name)}" autocomplete="off"></label>
<label class="campo">Tu celular<input id="cl-cel" required inputmode="tel" value="${esc(ex.phone)}" autocomplete="off"></label>
<label class="casilla"><input type="checkbox" id="cl-promos"><span>Quiero recibir promociones de ${SHOP.name} por WhatsApp<small>Opcional. Puedes pedir que te saquen cuando quieras.</small></span></label>
<p class="privacidad">Usamos tu nombre y celular solo para tu reserva y para que la barbería pueda contactarte. Datos de ejemplo: puedes cambiarlos.</p>
${c.error ? `<p class="alerta" role="alert">${esc(c.error)}</p>` : ''}
<button class="boton-principal ancho">Confirmar reserva</button></form></main></div>`);
  }
  const s = serviceById(c.service);
  const days = Array.from({ length: 7 }, (_, i) => `<button class="dia" data-cday="${i}" aria-selected="${c.day === i}"><small class="capital">${shortDay(i)}</small><b>${dateOf(i).getDate()}</b>${i === 0 || dateOf(i).getDate() === 1 ? `<small class="mes">${MONTHS[dateOf(i).getMonth()].slice(0, 3)}</small>` : ''}</button>`).join('');
  const times = s ? slots(state, c.day, s.min, closed(c.day)) : [];
  const promo = state.promo;
  return frame(`${SHOP.link}`, `<div class="app cliente">${head}<main><h1 class="titulo">Reserva tu hora</h1>
${promo ? `<div class="banner-promo"><b>${esc(promo.title)}: ${clp(promo.discount)} de descuento</b><small>En todos los servicios · para horas de esta semana</small></div>` : ''}
<h2 class="subtitulo">1. ¿Qué te vas a hacer?</h2><ul class="opciones">${services.map((x) => { const p = priceWithPromo(state, x); return `<li><button class="opcion" data-service="${x.id}" aria-pressed="${c.service === x.id}"><span class="marca-opcion" aria-hidden="true"></span><span class="detalle"><b>${x.name}</b><small>aprox. ${dur(x.min)}</small></span><span class="precio">${p.discount ? `<span class="precio-tachado">${clp(x.price)}</span>` : ''}${clp(p.price)}</span></button></li>`; }).join('')}</ul>
<h2 class="subtitulo">2. Elige día y hora</h2><div class="dias" role="listbox" aria-label="Día">${days}</div>
${c.error ? `<p class="alerta" role="alert">${esc(c.error)}</p>` : ''}
${!s ? '<p class="vacio">Primero elige qué te vas a hacer para ver las horas disponibles.</p>' : times.length ? `<div class="horas">${times.map((t) => `<button class="hora-libre" data-ctime="${t}">${hhmm(t)}</button>`).join('')}</div>` : `<div class="vacio"><p>No quedan horas este día.</p>${c.day < 6 ? '<button class="boton-secundario" data-action="client-next-day">Ver el día siguiente</button>' : ''}</div>`}
</main></div>`);
}

// ---------- render ----------
function renderGuide() {
  document.querySelector('#progress').textContent = `${done.size} DE ${TASKS.length} PROBADAS`;
  document.querySelector('#tasks').innerHTML = TASKS.map((t) => `<li class="${done.has(t.id) ? 'done' : ''}"><button data-task="${t.id}"><span class="check-tarea" aria-hidden="true">${done.has(t.id) ? '✓' : ''}</span><span><b>${t.title}</b><small>${t.hint}</small></span></button></li>`).join('');
}
function render() {
  renderGuide();
  document.querySelectorAll('[data-role]').forEach((b) => { b.setAttribute('aria-selected', String(b.dataset.role === role)); b.tabIndex = b.dataset.role === role ? 0 : -1; });
  screen.setAttribute('aria-labelledby', `tab-${role}`);
  screen.innerHTML = role === 'barber' ? barber() : client();
  screen.querySelector('.sheet')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function setRole(r) {
  role = r;
  if (r === 'barber' && ui.client.step === 'done') ui.view = 'day', ui.day = ui.client.result ? state.reservations.find((x) => x.id === ui.client.result.id).day : ui.day;
  render();
}
function go(target) {
  if (target.view) { ui.view = target.view; if (target.day != null) ui.day = target.day; ui.sheet = null; }
  setRole(target.role);
  document.querySelector('#experiencia').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- eventos ----------
document.querySelector('.role-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-role]'); if (b) setRole(b.dataset.role); });
document.querySelector('#tasks').addEventListener('click', (e) => { const b = e.target.closest('[data-task]'); if (b) go(TASKS.find((t) => t.id === b.dataset.task).go); });
document.querySelector('#reset').addEventListener('click', () => { reset(); say('Demo reiniciada.'); render(); });

screen.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'buscar-cliente') { ui.search = t.value; const pos = t.selectionStart; render(); const n = screen.querySelector('#buscar-cliente'); n.focus(); n.setSelectionRange(pos, pos); }
  if (t.id === 'an-buscar') { ui.sheet.query = t.value; const pos = t.selectionStart; render(); const n = screen.querySelector('#an-buscar'); n.focus(); n.setSelectionRange(pos, pos); }
  if (t.id === 'an-nombre') ui.sheet.newName = t.value;
  if (t.id === 'an-cel') ui.sheet.newPhone = t.value;
  if (t.id === 'bl-motivo') ui.sheet.reason = t.value;
  if (t.id === 'pr-titulo') ui.sheet.title = t.value;
  if (t.id === 'pr-desc') ui.sheet.discount = t.value;
  if (t.id === 'pr-msg') ui.sheet.message = t.value;
});
screen.addEventListener('change', (e) => {
  const t = e.target;
  if (t.id === 'an-promos') ui.sheet.newPromos = t.checked;
  if (t.id === 'ficha-promos') { state = updateClient(state, ui.sheet.id, { promos: t.checked }); say(t.checked ? 'Anotado: acepta recibir promociones.' : 'Listo: ya no recibirá promociones.'); render(); }
});
screen.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target.id !== 'datos') return;
  const c = ui.client;
  const out = complete(state, c.hold, { name: screen.querySelector('#cl-nombre').value, phone: screen.querySelector('#cl-cel').value, promos: screen.querySelector('#cl-promos').checked });
  if (out.error) { c.error = out.error; render(); return; }
  state = out.state;
  clearInterval(timer);
  c.result = { id: c.hold };
  c.step = 'done'; c.error = ''; c.example += 1;
  finish('reserva', 'Reserva confirmada. Ya aparece en la agenda del barbero, en su día y hora.');
  render();
});

screen.addEventListener('click', (e) => {
  const t = e.target;
  if (t.closest('.sheet-back') && !t.closest('[data-stop]') ) { ui.sheet = null; render(); return; }
  const el = (sel) => t.closest(sel);
  let b;
  if ((b = el('[data-go-role]'))) { setRole(b.dataset.goRole); return; }
  if ((b = el('[data-tab]'))) {
    const k = b.dataset.tab; ui.sheet = null;
    if (k.startsWith('day')) { ui.view = 'day'; ui.day = Number(k.slice(3)); } else ui.view = k;
    render(); return;
  }
  if ((b = el('[data-day]'))) { ui.view = 'day'; ui.day = Number(b.dataset.day); render(); return; }
  if ((b = el('[data-free]'))) { ui.sheet = { type: 'anotar', time: Number(b.dataset.free), canal: 'whatsapp' }; render(); return; }
  if ((b = el('[data-res]'))) { ui.sheet = { type: 'res', id: b.dataset.res }; render(); return; }
  if ((b = el('[data-block]'))) { ui.sheet = { type: 'bloqueo', id: b.dataset.block }; render(); return; }
  if ((b = el('[data-client]'))) { ui.sheet = { type: 'ficha', id: b.dataset.client }; render(); return; }
  if ((b = el('[data-filter]'))) { ui.filter = b.dataset.filter; render(); return; }
  if ((b = el('[data-pick]'))) { ui.sheet.clientId = b.dataset.pick; render(); return; }
  if ((b = el('[data-an-service]'))) { ui.sheet.service = b.dataset.anService; const svc = serviceById(ui.sheet.service); if (ui.sheet.time != null && !slots(state, ui.day, svc.min).includes(ui.sheet.time)) ui.sheet.time = null; render(); return; }
  if ((b = el('[data-an-time]'))) { ui.sheet.time = Number(b.dataset.anTime); render(); return; }
  if ((b = el('[data-an-canal]'))) { ui.sheet.canal = b.dataset.anCanal; render(); return; }
  if ((b = el('[data-an-promo]'))) { ui.sheet.usePromo = b.dataset.anPromo === '1'; render(); return; }
  if ((b = el('[data-bl-start]'))) { ui.sheet.start = Number(b.dataset.blStart); render(); return; }
  if ((b = el('[data-bl-len]'))) { const v = b.dataset.blLen; ui.sheet.len = v === 'turno' ? v : Number(v); render(); return; }
  if ((b = el('[data-cl]'))) { const id = b.dataset.cl; const no = ui.sheet.noShow.filter((x) => x !== id); if (b.dataset.v === '0') no.push(id); ui.sheet.noShow = no; render(); return; }
  if ((b = el('[data-idea]'))) { const [title, message] = IDEAS[Number(b.dataset.idea)]; Object.assign(ui.sheet, { title, message }); render(); return; }
  if ((b = el('[data-send]'))) { const c = clientById(state, b.dataset.send); state = markSent(state, c.id); say(`En la app se abre WhatsApp con el mensaje para ${c.name.split(' ')[0]}; tú tocas Enviar.`); if (Object.keys(state.promo.sent).length >= 1) done.add('promo'); render(); return; }
  if ((b = el('[data-service]'))) { ui.client.service = b.dataset.service; ui.client.error = ''; render(); return; }
  if ((b = el('[data-cday]'))) { ui.client.day = Number(b.dataset.cday); ui.client.error = ''; render(); return; }
  if ((b = el('[data-ctime]'))) {
    const c = ui.client;
    const out = hold(state, c.day, Number(b.dataset.ctime), c.service);
    if (out.error) { c.error = out.error; render(); return; }
    state = out.state; c.hold = out.id; c.step = 'data'; c.error = ''; c.holdUntil = Date.now() + HOLD_SECONDS * 1000;
    say('La hora quedó guardada 2 minutos. En la agenda del barbero aparece como «reservando…».');
    clearInterval(timer);
    timer = setInterval(() => {
      const n = screen.querySelector('#cuenta'); if (!n) return;
      const left = Math.max(0, Math.round((c.holdUntil - Date.now()) / 1000));
      n.textContent = left > 0 ? `Te guardamos esta hora por ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : 'El tiempo se acabó, pero si nadie la tomó igual puedes confirmar.';
    }, 1000);
    render(); return;
  }
  if (!(b = el('[data-action]'))) return;
  action(b.dataset.action, b);
});

async function copy(text, ok) {
  try { await navigator.clipboard.writeText(text); say(ok); } catch { say('No se pudo copiar desde este navegador.'); }
}

function action(a, b) {
  const s = ui.sheet;
  switch (a) {
    case 'close-sheet': ui.sheet = null; break;
    case 'sim': say(b.dataset.msg); return;
    case 'share': ui.sheet = { type: 'share' }; break;
    case 'copy-share': copy(shareText(state, ui.day, longDate(ui.day)), 'Copiado: el mensaje con tus horas libres y tu enlace.'); return;
    case 'share-link': say('En la app se abre WhatsApp para compartir tu enlace. En la demo no se envía nada.'); return;
    case 'copy-link': copy(`https://${SHOP.link}`, '¡Copiado! Es el enlace de la barbería de ejemplo.'); return;
    case 'anotar': ui.sheet = { type: 'anotar', canal: 'whatsapp' }; break;
    case 'anotar-new': s.isNew = true; break;
    case 'anotar-existing': s.isNew = false; break;
    case 'anotar-clear': s.clientId = null; break;
    case 'anotar-save': {
      if (!s.clientId && !s.isNew) { s.error = 'Primero elige o crea el cliente'; break; }
      if (!s.service) { s.error = 'Elige qué se hace.'; break; }
      if (s.time == null) { s.error = 'Elige una hora'; break; }
      const out = annotate(state, { day: ui.day, start: s.time, serviceId: s.service, clientId: s.clientId, newClient: { name: s.newName, phone: s.newPhone, promos: s.newPromos }, canal: s.canal, usePromo: s.usePromo });
      if (out.error) { s.error = out.error; break; }
      state = out.state; ui.sheet = null;
      finish('anotar', `Anotado a las ${hhmm(s.time)}. Esa hora ya no se ofrece en tu enlace.`);
      break;
    }
    case 'bloquear': ui.sheet = { type: 'bloquear', len: 30 }; break;
    case 'block-save': {
      if (s.start == null) { s.error = 'Elige desde qué hora'; break; }
      const g = freeGaps(state, ui.day).find(([x, y]) => s.start >= x && s.start < y);
      const end = s.len === 'turno' ? g[1] : Math.min(g[1], s.start + (s.len || 30));
      const out = block(state, { day: ui.day, start: s.start, end, reason: s.reason });
      if (out.error) { s.error = out.error; break; }
      state = out.state; ui.sheet = null;
      finish('bloquear', `Bloqueado de ${hhmm(s.start)} a ${hhmm(end)}. Tus clientes ya no pueden reservar en ese horario.`);
      break;
    }
    case 'unblock': state = unblock(state, s.id); ui.sheet = null; say('Horario liberado: vuelve a ofrecerse en tu enlace.'); break;
    case 'cierre': ui.sheet = { type: 'cierre', noShow: [] }; break;
    case 'close-save': {
      const n = toClose(state).length - s.noShow.length;
      state = closeDay(state, s.noShow); ui.sheet = null;
      finish('cierre', `Listo: ${n} ${n === 1 ? 'atención suma' : 'atenciones suman'} visita y sello${s.noShow.length ? `; ${s.noShow.length} no vino y no suma nada` : ''}.`);
      break;
    }
    case 'cancel-ask': s.confirmCancel = true; break;
    case 'cancel-no': s.confirmCancel = false; break;
    case 'cancel-yes': state = cancel(state, s.id); ui.sheet = null; say('Reserva anulada. En la app se abre WhatsApp con la disculpa y tu enlace para que elija otra hora.'); break;
    case 'prize-ask': s.confirmPrize = true; break;
    case 'prize-no': s.confirmPrize = false; break;
    case 'prize-yes': state = givePrize(state, s.id); s.confirmPrize = false; finish('premio', `Premio entregado. Sus sellos vuelven a contar desde cero; no pierde las visitas.`); break;
    case 'notes-save': state = updateClient(state, s.id, { notes: screen.querySelector('#notas').value.slice(0, 500) }); s.saved = true; break;
    case 'promo-new': ui.sheet = { type: 'promo-new', discount: 2000 }; break;
    case 'promo-send': ui.sheet = { type: 'promo-send' }; break;
    case 'promo-create': {
      const out = createPromo(state, { title: s.title || '', discount: Number(String(s.discount).replace(/\D/g, '')), message: s.message || 'Hola {nombre}, ' });
      if (out.error) { s.error = out.error; break; }
      state = out.state; ui.sheet = { type: 'promo-send' };
      say('Promoción creada. Envíala uno por uno; también se ve en tu enlace de reservas.');
      break;
    }
    case 'client-back': state = release(state, ui.client.hold); clearInterval(timer); Object.assign(ui.client, { step: 'pick', hold: null, error: '' }); say('Hora liberada.'); break;
    case 'client-again': Object.assign(ui.client, { step: 'pick', service: null, hold: null, result: null, error: '' }); break;
    case 'client-next-day': ui.client.day = Math.min(6, ui.client.day + 1); break;
    default: return;
  }
  render();
}

render();

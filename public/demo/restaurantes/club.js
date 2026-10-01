import {
  LOCAL, menu, products, productById, rewards, SEGMENTS, pesos, initialState, join, addReceipt, answerSurvey,
  reviewReceipt, requestReward, segmentCount, membersOf, createPromo, visiblePromos, markSeen, requestPromo,
  lookupCode, deliver, avg, nextReward,
} from './club-state.mjs';

const screen = document.querySelector('#screen');
const feedback = document.querySelector('#feedback');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const num = (n) => Number(n).toLocaleString('es-CL');

const TASKS = [
  { id: 'unirse', title: 'Únete al club desde el QR de la mesa', hint: 'Sin descargar nada. Es opcional para el cliente.', go: { role: 'client', view: 'club' } },
  { id: 'boleta', title: 'Escanea tu boleta y suma puntos', hint: '1 punto por cada $1.000. Cada boleta suma una vez.', go: { role: 'client', view: 'club' } },
  { id: 'encuesta', title: 'Cuenta cómo estuvo tu visita', hint: 'El dueño ve la nota de cada plato. No da puntos.', go: { role: 'client', view: 'club' } },
  { id: 'canje', title: 'Canjea un premio y entrégalo en caja', hint: 'El cliente muestra su código; el personal lo valida.', go: { role: 'client', view: 'club' } },
  { id: 'revision', title: 'Revisa una boleta ingresada a mano', hint: 'Ingresa una a mano como cliente y apruébala como dueño.', go: { role: 'owner', tab: 'boletas' } },
  { id: 'promo', title: 'Crea una promoción para un grupo', hint: 'Elige a quién va dirigida y mira quién la usa.', go: { role: 'owner', tab: 'promos' } },
];

let state, role, ui, done;
function reset() {
  state = initialState();
  role = 'client';
  done = new Set();
  ui = {
    client: { view: 'carta', step: null, joinMode: 'elegir', form: { name: 'Camila Torres', phone: '9 2222 0401', club: false, promos: false, origin: null }, error: '', lastReceipt: null, survey: null, showCode: null, confirm: null },
    staff: { code: '', found: null, error: '', delivered: null },
    owner: { tab: 'resumen', seg: 'todos', promo: null, reject: null },
  };
}
reset();

const say = (t) => { feedback.textContent = t; };
const finish = (task, t) => { done.add(task); say(t); };
const frame = (url, body) => `<div class="browser"><div class="browser-bar"><span></span><span></span><span></span><div class="url">🔒 ${url}</div></div>${body}</div>`;
const chip = (t, k = '') => `<span class="chip ${k}">${t}</span>`;

// ---------- cliente ----------
function clientView() {
  const c = ui.client;
  const tabs = `<div class="pestanas"><button data-cview="carta" aria-pressed="${c.view === 'carta'}">Carta</button><button data-cview="club" aria-pressed="${c.view === 'club'}">${state.member ? 'Mi club' : 'Hazte parte del club'}</button></div>`;
  const portada = `<header class="portada"><div class="logo-local" aria-hidden="true">LD</div><div><h1 class="letrero">${LOCAL.name}</h1><small>Café · Pichilemu · ejemplo</small></div></header><p class="aviso-demo"><b>Datos de ejemplo.</b> Esta es una demostración; nada de lo que ves es real.</p>`;
  let body = '';
  if (c.view === 'carta') body = carta();
  else if (!state.member) body = unirse();
  else if (c.step === 'escanear') body = escanear();
  else if (c.step === 'manual') body = manual();
  else if (c.step === 'resultado') body = resultado();
  else if (c.step === 'encuesta') body = encuesta();
  else if (c.step === 'gracias') body = gracias();
  else body = miClub();
  return frame('club.eunomi.cl/demo', `<div class="club-app">${portada}${tabs}${body}<p class="firma">Club con tecnología Eunomi</p></div>`);
}

function carta() {
  return `${state.member ? '' : `<div class="invitacion"><b>¿Vienes seguido?</b><p>Suma puntos con tu boleta y canjéalos por premios. Es opcional.</p><button class="btn prim" data-cview="club">Hazte parte del club</button></div>`}
${menu.map((s) => `<div class="tarjeta"><h2 class="letrero">${s.sec}</h2><ul class="lista">${s.items.map((i) => `<li class="plato"><span class="inicial" aria-hidden="true">${i.name[0]}</span><b>${i.name}</b><span class="precio">${pesos(i.price)}</span></li>`).join('')}</ul></div>`).join('')}`;
}

function unirse() {
  const c = ui.client;
  if (c.joinMode === 'elegir') {
    return `<section class="tarjeta"><h3>Hazte parte del club</h3><p class="sec">Sumas puntos escaneando tu boleta y los canjeas por premios del local. Si nos cuentas cómo te fue, el local puede mejorar.</p>
<button class="btn google" data-action="join-google"><span class="g" aria-hidden="true">G</span> Continuar con Google</button>
<button class="btn sec bloque" data-action="join-phone">Unirme con mi teléfono</button>
<p class="leyenda">Con Google entras en un toque y recuperas tu club en otro celular.</p></section>`;
  }
  const f = c.form;
  return `<form class="tarjeta" id="unirse" novalidate><h3>${c.joinMode === 'google' ? `Hola, ${esc(f.name.split(' ')[0])}` : 'Tus datos'}</h3>
${c.joinMode === 'google' ? '<p class="sec chico">Entraste con Google (simulado en la demo). Solo confirma lo de abajo.</p>' : ''}
<label class="campo"><span>Tu nombre</span><input id="j-nombre" value="${esc(f.name)}" autocomplete="off"></label>
<label class="campo"><span>Tu teléfono</span><input id="j-tel" inputmode="tel" value="${esc(f.phone)}" autocomplete="off"></label>
<p class="mini-titulo">¿Vives aquí o estás de visita? (opcional)</p><div class="opciones">${[['local', 'Vivo aquí'], ['visita', 'Estoy de visita']].map(([v, t]) => `<button type="button" class="opcion" data-origin="${v}" aria-pressed="${f.origin === v}">${t}</button>`).join('')}</div>
<label class="check"><input type="checkbox" id="j-club" ${f.club ? 'checked' : ''}><span>Quiero ser parte del club de ${LOCAL.name} y que guarde mis visitas y puntos.</span></label>
<label class="check"><input type="checkbox" id="j-promos" ${f.promos ? 'checked' : ''}><span>Quiero recibir promociones por mensaje. <span class="sec">(Opcional. Puedes cambiarlo cuando quieras.)</span></span></label>
<p class="leyenda">El local es responsable de tus datos y Eunomi los procesa por encargo. En la demo no se guarda nada.</p>
${c.error ? `<p class="error">${esc(c.error)}</p>` : ''}
<button class="btn prim bloque" ${f.club ? '' : 'disabled'}>Unirme al club</button><button type="button" class="btn tenue" data-action="join-back">Volver</button></form>`;
}

function tarjetaClub() {
  const { goal, missing } = nextReward(state);
  const llenos = goal ? Math.round(((goal.cost - missing) / goal.cost) * 10) : 10;
  return `<section class="club"><div class="hola">Hola, ${esc(state.member.name.split(' ')[0])}. Tienes</div><div class="pts"><b>${num(state.points)}</b><span>puntos</span></div>
<div class="sellos" role="img" aria-label="${llenos} de 10 sellos">${Array.from({ length: 10 }, (_, i) => `<span class="${i < llenos ? 'lleno' : ''}"></span>`).join('')}</div>
<div class="meta">${goal ? `Te faltan ${num(missing)} puntos para ${goal.name}` : '¡Ya puedes canjear todos los premios!'}</div>
<div class="leyenda-club">${state.pendingPoints ? `+${num(state.pendingPoints)} en revisión por el local` : `1 punto por cada ${pesos(LOCAL.pesosPorPunto)} de tu boleta`}</div></section>`;
}

function miClub() {
  const c = ui.client;
  state = markSeen(state);
  const active = state.codes.filter((x) => x.status === 'activo');
  const promos = visiblePromos(state);
  const pending = state.receipts.filter((r) => r.status === 'en_revision');
  return `${tarjetaClub()}
<button class="btn prim bloque grande" data-action="scan">Escanear mi boleta</button>
${active.length ? `<section class="tarjeta"><h2>Tus códigos para canjear</h2>${active.map((x) => `<div class="codigo"><div class="fila"><b>${esc(x.what)}</b>${chip(`vence en ${LOCAL.vigenciaMin / 60} h`)}</div><div class="cod">${x.code}</div><p class="sec chico centro">Muéstralo al garzón o en caja.</p><button class="btn tenue bloque" data-go-staff="${x.code}">Ir a la vista del personal →</button></div>`).join('')}</section>` : ''}
${promos.length ? `<section class="tarjeta"><h2>Promociones del club</h2>${promos.map((p) => { const used = state.codes.find((x) => x.refId === p.id); return `<div class="promo"><b>${esc(p.title)}</b><p class="sec chico">${esc(p.benefit)}</p>${used ? (used.status === 'entregado' ? chip('Ya la usaste', 'ok') : chip('Código listo arriba')) : `<button class="btn sec" data-promo="${p.id}">Usar esta promoción</button>`}</div>`; }).join('')}</section>` : ''}
<section class="tarjeta"><h2 class="letrero">Tus premios</h2>${rewards.map((r) => {
    const falta = Math.max(0, r.cost - state.points);
    const confirm = c.confirm === r.id;
    return `<div class="premio"><div class="fila"><b>${r.name}</b>${falta === 0 ? '<span class="listo">¡Ya puedes canjearlo!</span>' : `<span class="sec chico">Te faltan ${falta} de ${r.cost} puntos</span>`}</div><div class="avance"><span style="width:${Math.min(100, (Math.min(state.points, r.cost) / r.cost) * 100)}%"></span></div>${falta === 0 ? (confirm ? `<div class="aviso">¿Canjear por ${r.cost} puntos? Te daremos un código para mostrar en el local.<div class="fila2"><button class="btn prim" data-reward="${r.id}">Sí, canjear</button><button class="btn tenue" data-action="reward-no">No</button></div></div>` : `<button class="btn prim" data-reward-ask="${r.id}">Canjear</button>`) : ''}</div>`;
  }).join('')}</section>
${pending.length ? `<section class="tarjeta"><h2>Boletas en revisión</h2>${pending.map((b) => `<div class="fila"><span>Boleta ${b.folio} · ${pesos(b.amount)}</span>${chip('en revisión', 'adv')}</div>`).join('')}</section>` : ''}
<section class="tarjeta"><h2>Historial</h2>${state.history.length ? `<ul class="lista">${state.history.map((h) => `<li class="fila"><span>${esc(h.text)}</span><b class="${h.pts < 0 ? 'neg' : 'pos'}">${h.pts > 0 ? '+' : ''}${h.pts}</b></li>`).join('')}</ul>` : '<p class="sec">Aún no hay movimientos.</p>'}</section>`;
}

function escanear() {
  const folio = state.nextFolio;
  return `<section class="tarjeta"><h2>Escanea tu boleta</h2><p class="sec chico">Apunta al código de barras grande (el timbre electrónico) que está al final de la boleta.</p>
<div class="boleta" aria-label="Boleta de ejemplo"><div class="b-cab"><b>${LOCAL.name.toUpperCase()}</b><span>BOLETA ELECTRÓNICA N° ${num(folio)}</span></div><div class="b-linea"><span>Cappuccino</span><span>$3.200</span></div><div class="b-linea"><span>Sándwich de pollo pesto</span><span>$7.900</span></div><div class="b-linea"><span>Cheesecake de maracuyá</span><span>$4.200</span></div><div class="b-total"><span>TOTAL</span><span>$15.300</span></div><div class="timbre" aria-hidden="true"></div><small>Timbre electrónico SII · ejemplo</small></div>
<button class="btn prim bloque" data-action="scan-ok">Simular escaneo del timbre</button>
<button class="btn tenue bloque" data-action="manual">No puedo escanear: ingresar a mano</button><button class="btn tenue bloque" data-action="club-home">Volver a mi club</button></section>`;
}
function manual() {
  return `<form class="tarjeta" id="manual"><h3>Ingresar la boleta a mano</h3><p class="sec chico">La revisará el local antes de sumar tus puntos.</p>
<label class="campo"><span>Número de boleta (folio)</span><input id="m-folio" inputmode="numeric" value="${state.nextFolio}" readonly></label>
<label class="campo"><span>Monto total</span><input id="m-monto" inputmode="numeric" value="$ 12.500"></label>
<button class="btn prim bloque">Enviar a revisión</button><button type="button" class="btn tenue" data-action="scan">Volver</button></form>`;
}
function resultado() {
  const r = state.receipts.find((x) => x.folio === ui.client.lastReceipt.folio);
  const ok = r.status === 'confirmada';
  return `<section class="tarjeta resultado"><div class="estado ${ok ? 'ok' : 'adv'}">${ok ? '✓ Boleta confirmada' : r.status === 'rechazada' ? 'No pudimos sumarla' : 'En revisión'}</div><div class="b-mini"><span>BOLETA</span><span>N° ${num(r.folio)}</span><span>${pesos(r.amount)}</span></div>
${ok ? `<div class="suma"><b>+${r.points}</b><span>puntos para tu club</span></div>` : (r.status === 'rechazada' ? '<p class="sec">El local la revisó y no sumó puntos.</p>' : '<p class="sec">El local la revisará y te sumará los puntos si la aprueba. Motivo: se ingresó a mano.</p>')}
${r.surveyed ? '' : '<button class="btn prim bloque" data-action="survey">Contar cómo estuvo (1 minuto)</button>'}<button class="btn tenue bloque" data-action="club-home">Volver a mi club</button></section>`;
}
const PALABRAS = ['Mala', 'Regular', 'Buena', 'Muy buena', 'Excelente'];
function stars(group, value, label) {
  return `<div class="estrellas" role="group" aria-label="${esc(label)}">${[1, 2, 3, 4, 5].map((v) => `<button type="button" data-star="${group}" data-v="${v}" aria-pressed="${value >= v}" aria-label="${v} de 5, ${PALABRAS[v - 1]}">★</button>`).join('')}</div>`;
}
function encuesta() {
  const s = ui.client.survey;
  const ordered = ['p2', 'p4', 'p7'];
  return `<section class="tarjeta"><h1 class="letrero">¿Cómo estuvo todo?</h1><p class="sec chico">Todo es opcional. El local lo lee para mejorar cada plato.</p>
<h3>¿Qué pediste?</h3><p class="sec chico">Toca lo que pediste y ponle nota. El local lo ve para mejorar cada plato.</p>
${ordered.map((pid) => `<div class="fila"><span>${productById(pid).name}</span>${stars(pid, s.ratings[pid] || 0, `Nota para ${productById(pid).name}`)}</div>`).join('')}
<h3>¿Con quién nos visitaste hoy?</h3><p class="sec chico">Si respondes, sumas ${LOCAL.puntosContexto} puntos cuando tu boleta quede confirmada.</p>
${[['adults', 'Adultos'], ['kids', 'Niños'], ['seniors', 'Adultos mayores']].map(([k, t]) => `<div class="contador"><span>${t}</span><button type="button" data-cnt="${k}" data-d="-1" aria-label="Menos ${t}">−</button><output>${s.party[k]}</output><button type="button" data-cnt="${k}" data-d="1" aria-label="Más ${t}">+</button></div>`).join('')}
<p class="leyenda">Solo guardamos cuántas personas, nunca quiénes.</p>
<label class="campo"><span>¿Algo que podamos mejorar?</span><input id="s-coment" maxlength="140" value="${esc(s.comment)}" placeholder="Opcional"></label>
<button class="btn prim bloque" data-action="survey-send">Enviar</button><button class="btn tenue bloque" data-action="club-home">Ahora no</button></section>`;
}
function gracias() {
  const g = ui.client.thanks;
  return `<section class="tarjeta"><div class="aviso ok"><b>¡Gracias!</b>${g.bonus ? `<div>Sumaste ${g.bonus} puntos por contarnos con quién viniste.</div>` : ''}${g.bonusPending ? '<div>Los puntos por tu respuesta se suman cuando el local confirme tu boleta.</div>' : ''}</div>
<h3>¿Te gustó tu visita?</h3><p class="sec chico">Si quieres, cuéntalo en Google. Es opcional y no da puntos.</p><button class="btn sec bloque" data-action="sim" data-msg="En la app se abre la ficha de Google del local. La reseña nunca se premia.">Déjanos tu reseña en Google</button>
<button class="btn prim bloque" data-action="club-home">Volver a mi club</button></section>`;
}

// ---------- personal ----------
function staffView() {
  const s = ui.staff;
  const active = state.codes.filter((x) => x.status === 'activo');
  let body = `<h1 class="letrero">Validar código</h1><p class="sec chico">El personal no acredita compras: el cliente escanea su boleta.</p>
<label class="campo"><span>Código del cliente</span><input id="st-code" maxlength="6" value="${esc(s.code)}" placeholder="6 caracteres" autocomplete="off" style="text-transform:uppercase;letter-spacing:4px;font-weight:700"></label>
${active.length && !s.found ? `<p class="sec chico">Código que generó el cliente en esta demo: ${active.map((x) => `<button class="enlace-codigo" data-fill="${x.code}">${x.code}</button>`).join(' ')}</p>` : !active.length && !s.found ? '<p class="sec chico">Aún no hay códigos. Canjea un premio o usa una promoción en la vista del cliente.</p>' : ''}
${s.error ? `<p class="error">${esc(s.error)}</p>` : ''}
${s.found ? '' : '<button class="btn prim bloque" data-action="staff-check">Revisar</button>'}`;
  if (s.found) {
    const c = s.found;
    body += `<section class="tarjeta destacada"><p class="mini-titulo">${c.kind === 'premio' ? 'Premio' : 'Promoción'}</p><h2>${esc(c.what)}</h2><div class="fila"><span class="sec">Cliente</span><b>${esc(state.member.name)}</b></div><div class="fila"><span class="sec">Código válido por</span><b>${LOCAL.vigenciaMin / 60} horas</b></div>
<p class="aviso adv">${c.kind === 'promo' ? 'Confirma solo si el cliente está comprando hoy.' : 'Revisa que se cumplan las condiciones antes de entregar.'}</p>
<button class="btn prim bloque" data-action="staff-deliver">Confirmar y entregar</button><button class="btn tenue bloque" data-action="staff-cancel">Cancelar</button></section>`;
  }
  if (s.delivered) body += `<div class="aviso ok"><b>Entregado.</b> ${esc(s.delivered)} <button class="btn tenue" data-action="staff-cancel">Probar otro código</button></div>`;
  return frame('club.eunomi.cl/demo/personal', `<div class="club-app personal"><header class="barra-personal"><b>${LOCAL.name}</b><span>Personal · Garzón</span></header>${body}</div>`);
}

// ---------- dueño ----------
function ownerView() {
  const o = ui.owner;
  const tabs = [['resumen', 'Tu clientela'], ['clientes', 'Clientes'], ['opiniones', 'Opiniones'], ['boletas', 'Boletas'], ['promos', 'Promociones'], ['premios', 'Premios']];
  const pend = state.receipts.filter((r) => r.status === 'en_revision').length;
  let body = '';
  if (o.tab === 'resumen') body = resumen(pend);
  else if (o.tab === 'clientes') body = clientes();
  else if (o.tab === 'opiniones') body = opiniones();
  else if (o.tab === 'boletas') body = boletas();
  else if (o.tab === 'promos') body = promociones();
  else body = premios();
  return frame('club.eunomi.cl/demo/admin', `<div class="panel"><header class="panel-top"><b>Panel del local</b><span>${LOCAL.name} · Dueño</span></header><nav class="panel-tabs">${tabs.map(([k, l]) => `<button data-otab="${k}" aria-pressed="${o.tab === k}">${l}${k === 'boletas' && pend ? ` <span class="badge-num">${pend}</span>` : ''}</button>`).join('')}</nav><div class="panel-body">${body}</div></div>`);
}
function resumen(pend) {
  const w = state.week;
  const h = new Date().getHours();
  return `<h1 class="letrero">${h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'}</h1><p class="sec">Esto pasó en tu club los últimos 7 días.</p>
${pend ? `<button class="alerta" data-otab="boletas"><b>${pend} ${pend === 1 ? 'boleta espera' : 'boletas esperan'}</b> que la revises. <span>Revisar</span></button>` : ''}
<div class="kpis"><div><b>${w.visits}</b><span>visitas con boleta</span></div><div><b>${w.joined}</b><span>se unieron al club</span></div><div><b>${w.redeemed}</b><span>premios canjeados</span></div><div><b>${w.promosUsed}</b><span>promociones usadas</span></div></div>
<p class="leyenda">Solo cuenta a miembros del club que escanearon su boleta; no es el total de ventas del local.</p>
<div class="tarjeta"><div class="fila"><div><b>Clientes que no vuelven</b><p class="sec chico">${segmentCount(state, 'novuelven')} personas no vienen hace más de 21 días.</p></div><button class="btn sec" data-new-promo="novuelven">Crear oferta para este grupo</button></div></div>
<div class="tarjeta"><h3>Lo que piden y cómo lo evalúan</h3><p class="sec chico">Nota de 1 a 5 de los últimos 30 días</p>${['p2', 'p4', 'p7', 'p5'].map((pid) => { const a = avg(state, pid); return `<div class="fila"><span>${productById(pid).name}</span><span class="nota ${a.avg < 3.5 ? 'baja' : ''}">${a.avg ?? '—'} <small>(${a.n})</small></span></div>`; }).join('')}<button class="btn tenue" data-otab="opiniones">Ver todas las opiniones</button></div>`;
}
function clientes() {
  const o = ui.owner;
  const list = membersOf(state, o.seg);
  return `<h2>Clientes</h2><div class="opciones">${SEGMENTS.map((s) => `<button class="opcion" data-seg="${s.id}" aria-pressed="${o.seg === s.id}">${s.name} · ${segmentCount(state, s.id)}</button>`).join('')}</div>
<ul class="lista">${list.map((m) => `<li class="fila"><div><b>${esc(m.name)}</b><p class="sec chico">${m.visits} ${m.visits === 1 ? 'visita' : 'visitas'} · ${m.days === 0 ? 'hoy' : `última hace ${m.days} días`}</p></div><div>${m.seg === 'habituales' ? chip('Habitual', 'ok') : m.seg === 'novuelven' ? chip('No vuelve', 'adv') : m.seg === 'turistas' ? chip('Turista') : chip('Nuevo')}${m.promos ? chip('Acepta mensajes') : ''}</div></li>`).join('')}</ul>
<p class="leyenda">Se muestran algunos ejemplos de cada grupo. Los nombres son ficticios.</p>`;
}
function opiniones() {
  return `<h2>Opiniones</h2><p class="sec chico">Nota de 1 a 5 que dieron los clientes a lo que pidieron. Con pocas opiniones, el promedio todavía puede cambiar mucho.</p>
<table class="tabla"><thead><tr><th>Producto</th><th>Nota</th><th>Opiniones</th></tr></thead><tbody>${products.filter((p) => avg(state, p.id).n).sort((a, b) => avg(state, b.id).avg - avg(state, a.id).avg).map((p) => { const a = avg(state, p.id); return `<tr><td>${p.name}</td><td class="nota ${a.avg < 3.5 ? 'baja' : ''}">${a.avg}</td><td>${a.n}</td></tr>`; }).join('')}</tbody></table>
<h3>Comentarios recientes</h3><ul class="lista">${state.comments.slice(0, 5).map((c) => `<li class="comentario">“${esc(c)}”</li>`).join('')}</ul>`;
}
const CHECKS_MANUAL = [['ok', 'Es de tu local'], ['ok', 'El número está dentro de los folios autorizados'], ['ok', 'El número va con lo que lleva tu caja'], ['ok', 'El monto está bajo tu tope'], ['adv', 'Se ingresó a mano: compárala con tu caja']];
function boletas() {
  const o = ui.owner;
  const list = state.receipts.filter((r) => r.status === 'en_revision');
  if (!list.length) return `<h2>Boletas</h2><p class="vacio">No hay boletas esperando. Las que pasan todas las revisiones suman solas.</p>${state.member ? '<p class="sec chico">Para probar: como cliente, toca «Escanear mi boleta» y luego «No puedo escanear: ingresar a mano».</p>' : '<p class="sec chico">Para probar: únete al club como cliente e ingresa una boleta a mano.</p>'}`;
  return `<h2>Boletas</h2>${list.map((r) => `<div class="tarjeta"><div class="fila"><b>Boleta ${r.folio} · ${pesos(r.amount)}</b>${chip('en revisión', 'adv')}</div><p class="sec chico">${esc(state.member.name)} · ingresada a mano hoy</p><ul class="checks">${CHECKS_MANUAL.map(([k, t]) => `<li class="${k}"><span>${k === 'ok' ? '✓' : '!'}</span>${t}</li>`).join('')}</ul>
${o.reject === r.folio ? `<p class="sec chico">¿Por qué la rechazas? El cliente verá que no sumó puntos.</p><div class="opciones">${['No calza con la caja', 'Ya se usó para sumar puntos', 'No hubo esa venta'].map((m) => `<button class="opcion" data-reject="${r.folio}">${m}</button>`).join('')}</div><button class="btn tenue" data-action="reject-cancel">Volver</button>` : `<div class="fila2"><button class="btn prim" data-approve="${r.folio}">Aprobar</button><button class="btn tenue" data-reject-ask="${r.folio}">Rechazar</button></div>`}</div>`).join('')}`;
}
function promociones() {
  const o = ui.owner;
  if (o.promo) {
    const p = o.promo;
    return `<h2>Nueva promoción</h2>
<p class="mini-titulo">1 · ¿Sobre qué?</p><div class="opciones"><button class="opcion" aria-pressed="true">Toda la cuenta</button></div>
<p class="mini-titulo">2 · ¿Qué beneficio?</p><div class="opciones">${[['10% de descuento', '% de descuento'], ['Postre de regalo', 'De regalo'], ['Doble de puntos', 'Puntos extra']].map(([v, t]) => `<button class="opcion" data-benefit="${v}" aria-pressed="${p.benefit === v}">${t}</button>`).join('')}</div>
<p class="mini-titulo">3 · ¿Para quién?</p><div class="opciones">${SEGMENTS.map((s) => `<button class="opcion" data-pseg="${s.id}" aria-pressed="${p.segment === s.id}">${s.name} · ${segmentCount(state, s.id)}</button>`).join('')}</div>
<p class="mini-titulo">4 · ¿Cuándo parte y cuánto dura?</p><div class="opciones"><button class="opcion" aria-pressed="true">Ahora · 7 días</button></div>
<label class="campo"><span>Así la verán tus clientes</span><input id="pr-title" value="${esc(p.title)}" placeholder="Título de la promoción"></label>
${p.segment !== 'todos' && state.member && p.segment !== state.member.seg ? '<p class="aviso adv">Tu cliente de la demo es nuevo: no la verá. Elige «Todos los inscritos» para probarla como cliente.</p>' : ''}
<p class="leyenda">Las promociones se usan dentro del club. El envío por mensaje todavía no está disponible.</p>
${p.error ? `<p class="error">${esc(p.error)}</p>` : ''}
<button class="btn prim bloque" data-action="promo-publish">Publicar promoción</button><button class="btn tenue bloque" data-action="promo-cancel">Cancelar</button>`;
  }
  return `<h2>Promociones</h2><button class="btn prim" data-new-promo="todos">Crear promoción</button><p class="leyenda">Las promociones se usan dentro del club.</p>
${state.promos.length ? state.promos.map((p) => `<div class="tarjeta"><div class="fila"><b>${esc(p.title)}</b>${chip('Activa', 'ok')}</div><p class="sec chico">${esc(p.benefit)} · Iba dirigida a: ${SEGMENTS.find((s) => s.id === p.segment).name}</p><p class="cifras-promo">Personas alcanzadas <b>${p.reach}</b> · la vieron en pantalla <b>${p.seen}</b> · la usaron <b>${p.used}</b></p><button class="btn tenue" data-action="sim" data-msg="En la app se genera una imagen con QR para Instagram o WhatsApp, y se cuentan las llegadas desde cada red.">Compartir en redes</button></div>`).join('') : '<p class="vacio">Aún no tienes promociones.</p>'}`;
}
function premios() {
  return `<h2>Premios</h2>${rewards.map((r) => `<div class="tarjeta fila"><div><b>${r.name}</b><p class="sec chico">${r.cost} puntos</p></div><button class="btn tenue" data-action="sim" data-msg="En la app editas nombre, puntos y costo aproximado. Puedes crearlos desde tu carta: te sugerimos los puntos.">Editar</button></div>`).join('')}<p class="leyenda">Ticket promedio del club (90 días): ${pesos(16400)} · ejemplo.</p>`;
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
  screen.innerHTML = role === 'client' ? clientView() : role === 'staff' ? staffView() : ownerView();
}
function go(t) {
  role = t.role;
  if (t.view) { ui.client.view = t.view; ui.client.step = null; }
  if (t.tab) ui.owner.tab = t.tab;
  render();
  document.querySelector('#experiencia').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelector('.role-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-role]'); if (b) { role = b.dataset.role; render(); } });
document.querySelector('#tasks').addEventListener('click', (e) => { const b = e.target.closest('[data-task]'); if (b) go(TASKS.find((t) => t.id === b.dataset.task).go); });
document.querySelector('#reset').addEventListener('click', () => { reset(); say('Demo reiniciada.'); render(); });

screen.addEventListener('input', (e) => {
  const t = e.target, f = ui.client.form;
  if (t.id === 'j-nombre') f.name = t.value;
  if (t.id === 'j-tel') f.phone = t.value;
  if (t.id === 'st-code') ui.staff.code = t.value.toUpperCase();
  if (t.id === 'pr-title' && ui.owner.promo) ui.owner.promo.title = t.value;
  if (t.id === 's-coment') ui.client.survey.comment = t.value;
});
screen.addEventListener('change', (e) => {
  const t = e.target, f = ui.client.form;
  if (t.id === 'j-club') { f.club = t.checked; render(); }
  if (t.id === 'j-promos') f.promos = t.checked;
});
screen.addEventListener('submit', (e) => {
  e.preventDefault();
  const c = ui.client;
  if (e.target.id === 'unirse') {
    const out = join(state, { name: c.form.name, phone: c.form.phone, acceptsClub: c.form.club, acceptsPromos: c.form.promos, origin: c.form.origin });
    if (out.error) { c.error = out.error; render(); return; }
    state = out.state; c.error = '';
    finish('unirse', `Listo, ${state.member.name.split(' ')[0]}: ya eres parte del club. El dueño te ve entre los clientes nuevos.`);
    render();
  }
  if (e.target.id === 'manual') {
    const amount = Number(screen.querySelector('#m-monto').value.replace(/\D/g, '')) || 0;
    if (amount < 1000) { say('Escribe el monto total de la boleta.'); return; }
    const out = addReceipt(state, { amount, via: 'manual' });
    state = out.state; c.lastReceipt = out.receipt; c.step = 'resultado';
    say('Boleta enviada a revisión. Ahora apruébala en la vista del dueño (pestaña Boletas).');
    render();
  }
});

screen.addEventListener('click', (e) => {
  const t = e.target;
  const el = (s) => t.closest(s);
  const c = ui.client, s = ui.staff, o = ui.owner;
  let b;
  if ((b = el('[data-cview]'))) { c.view = b.dataset.cview; c.step = null; render(); return; }
  if ((b = el('[data-origin]'))) { c.form.origin = c.form.origin === b.dataset.origin ? null : b.dataset.origin; render(); return; }
  if ((b = el('[data-reward-ask]'))) { c.confirm = b.dataset.rewardAsk; render(); return; }
  if ((b = el('[data-reward]'))) {
    const out = requestReward(state, b.dataset.reward);
    if (out.error) { say(out.error); return; }
    state = out.state; c.confirm = null;
    say(`Código ${out.code} listo. Muéstralo en caja: pasa a la vista del personal para validarlo.`);
    render(); return;
  }
  if ((b = el('[data-promo]'))) {
    const out = requestPromo(state, b.dataset.promo);
    if (out.error) { say(out.error); return; }
    state = out.state; say(`Código ${out.code} listo para usar la promoción hoy.`); render(); return;
  }
  if ((b = el('[data-go-staff]'))) { role = 'staff'; Object.assign(s, { code: b.dataset.goStaff, found: null, error: '', delivered: null }); render(); return; }
  if ((b = el('[data-fill]'))) { s.code = b.dataset.fill; s.error = ''; render(); return; }
  if ((b = el('[data-star]'))) { c.survey.ratings[b.dataset.star] = Number(b.dataset.v); render(); return; }
  if ((b = el('[data-cnt]'))) { const k = b.dataset.cnt; c.survey.party[k] = Math.max(0, Math.min(30, c.survey.party[k] + Number(b.dataset.d))); render(); return; }
  if ((b = el('[data-otab]'))) { o.tab = b.dataset.otab; o.promo = null; render(); return; }
  if ((b = el('[data-seg]'))) { o.seg = b.dataset.seg; render(); return; }
  if ((b = el('[data-new-promo]'))) { o.tab = 'promos'; o.promo = { title: b.dataset.newPromo === 'novuelven' ? 'Te extrañamos: 10% en tu próxima visita' : 'Esta semana: 10% en tu cuenta', benefit: '10% de descuento', segment: b.dataset.newPromo }; render(); return; }
  if ((b = el('[data-benefit]'))) { o.promo.benefit = b.dataset.benefit; render(); return; }
  if ((b = el('[data-pseg]'))) { o.promo.segment = b.dataset.pseg; render(); return; }
  if ((b = el('[data-approve]'))) {
    state = reviewReceipt(state, Number(b.dataset.approve), true);
    finish('revision', 'Boleta aprobada. Los puntos ya aparecen en el club del cliente.'); render(); return;
  }
  if ((b = el('[data-reject-ask]'))) { o.reject = Number(b.dataset.rejectAsk); render(); return; }
  if ((b = el('[data-reject]'))) {
    state = reviewReceipt(state, Number(b.dataset.reject), false); o.reject = null;
    finish('revision', 'Boleta rechazada. El cliente ve que no sumó puntos.'); render(); return;
  }
  if (!(b = el('[data-action]'))) return;
  switch (b.dataset.action) {
    case 'sim': say(b.dataset.msg); return;
    case 'join-google': c.joinMode = 'google'; break;
    case 'join-phone': c.joinMode = 'telefono'; break;
    case 'join-back': c.joinMode = 'elegir'; c.error = ''; break;
    case 'scan': c.step = 'escanear'; break;
    case 'manual': c.step = 'manual'; break;
    case 'club-home': c.step = null; break;
    case 'reward-no': c.confirm = null; break;
    case 'scan-ok': {
      const out = addReceipt(state, { amount: 15300, via: 'timbre' });
      if (out.error) { say(out.error); return; }
      state = out.state; c.lastReceipt = out.receipt; c.step = 'resultado';
      finish('boleta', `Boleta confirmada: +${out.receipt.points} puntos. El timbre del SII se revisa solo; sin trabajo para el garzón.`);
      break;
    }
    case 'survey': c.survey = { folio: c.lastReceipt.folio, ratings: {}, party: { adults: 0, kids: 0, seniors: 0 }, comment: '' }; c.step = 'encuesta'; break;
    case 'survey-send': {
      const sv = c.survey;
      const out = answerSurvey(state, sv.folio, { ratings: sv.ratings, party: sv.party, comment: sv.comment });
      if (out.error) { say(out.error); c.step = null; break; }
      state = out.state; c.thanks = { bonus: out.bonus, bonusPending: out.bonusPending };
      c.lastReceipt = state.receipts.find((r) => r.folio === sv.folio);
      c.step = 'gracias';
      finish('encuesta', Object.keys(sv.ratings).length ? 'Gracias. Tus notas ya aparecen en Opiniones del dueño, por producto.' : 'Gracias por responder.');
      break;
    }
    case 'staff-check': {
      const r = lookupCode(state, s.code);
      if (r.error) { s.error = r.error; s.found = null; } else { s.found = r.entry; s.error = ''; s.delivered = null; }
      break;
    }
    case 'staff-deliver': {
      const what = s.found.what, kind = s.found.kind;
      state = deliver(state, s.found.code);
      s.delivered = what; s.found = null; s.code = '';
      if (kind === 'premio') finish('canje', 'Premio entregado. El dueño lo ve en «premios canjeados».');
      else { done.add('promo'); say('Promoción usada. El dueño lo ve en «la usaron».'); }
      break;
    }
    case 'staff-cancel': Object.assign(s, { found: null, error: '', delivered: null, code: '' }); break;
    case 'promo-cancel': o.promo = null; break;
    case 'promo-publish': {
      const out = createPromo(state, o.promo);
      if (out.error) { o.promo.error = out.error; break; }
      state = out.state; o.promo = null;
      finish('promo', `Promoción publicada para ${out.promo.reach} personas. Se ve dentro del club de cada una.`);
      break;
    }
    case 'reject-cancel': o.reject = null; break;
    default: return;
  }
  render();
});

render();

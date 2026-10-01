import { steps, phases, riders, absent, initialState, advance, boardReturn, stepId, guardianView, trackingPhases, riderStatus, routeStatus, metrics } from './state.mjs';

// Modo incrustado (?embed): se muestra solo la demo y se informa la altura a la página que la contiene.
const EMBED = new URLSearchParams(location.search).has('embed');
if (EMBED) {
  document.documentElement.classList.add('embed');
  const report = () => parent.postMessage({ type: 'eunomi-demo-height', height: Math.ceil(document.body.getBoundingClientRect().height) + 8 }, location.origin);
  new ResizeObserver(report).observe(document.body);
  window.addEventListener('load', report);
}

const roleNames = { admin: 'Administrador', driver: 'Conductor', guardian: 'Apoderado' };
const screen = document.querySelector('#screen');
const feedback = document.querySelector('#feedback');

let state = initialState();
let role = 'admin';
let ui = freshUi();

function freshUi() {
  return { adminTab: 'inicio', showLive: false, signedIn: false, openMap: null, sheet: null, daysOff: {} };
}

// ---------- utilidades ----------
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
function upcomingDays() {
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  const today = { key: 'hoy', label: 'Hoy', n: d.getDate(), today: true };
  let offset = 0;
  while (out.length < 4) {
    d.setDate(d.getDate() + 1);
    offset += 1;
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    out.push({ key: `d${offset}`, label: offset === 1 ? 'Mañana' : WEEKDAYS[d.getDay()], n: d.getDate() });
  }
  return [today, ...out];
}
const eta = (min) => (min == null ? '' : min === 1 ? 'Llega en 1 minuto aprox.' : `Llega en ${min} minutos aprox.`);
const clock = () => new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
const id = () => stepId(state);
const badgeTone = (s) => (s === 'Entregado' || s === 'Completado' ? 'ok' : s === 'A bordo' || s === 'En curso' ? 'live' : s === 'No asiste' ? 'warn' : 'idle');

// ---------- mapa esquemático ----------
const vehicle = {
  prep: [90, 205], review: [90, 205], toV: [112, 165], toD: [175, 150], toSchool: [265, 80],
  atSchool: [300, 64], idaDone: [300, 64], returnReview: [300, 64], returnBoarding: [300, 64],
  deliverD: [220, 105], deliverV: [120, 165], allDelivered: [78, 165], done: [78, 165],
};
function map() {
  const [x, y] = vehicle[id()];
  const isReturn = steps[state.step].phase >= 3;
  return `<div class="map"><svg viewBox="0 0 380 220" role="img" aria-label="Mapa esquemático: paradas de Valentina y Diego e Instituto Railef. Posición simulada del furgón.">
<rect width="380" height="220" fill="#e8f0ee"/><path d="M0 0H48L25 220H0Z" fill="#b9dde0"/>
<g stroke="#fff" stroke-width="13" fill="none"><path d="M40 45H355M35 105H355M30 165H355M90 0V220M175 0V220M265 0V220M325 0V220"/></g>
<g fill="#d5e5dd"><rect x="110" y="15" width="40" height="20" rx="5"/><rect x="195" y="130" width="47" height="22" rx="5"/><rect x="280" y="178" width="26" height="27" rx="5"/></g>
<path d="M70 165H175V105H265V64H300" stroke="#077580" stroke-width="5" fill="none" stroke-linejoin="round" ${isReturn ? 'stroke-dasharray="9 6"' : ''}/>
<g fill="#fff" stroke="#077580" stroke-width="2"><circle cx="70" cy="165" r="12"/><circle cx="175" cy="118" r="12"/><rect x="295" y="49" width="30" height="30" rx="7"/></g>
<g font-family="Figtree,system-ui" font-size="10" fill="#1d3c40" text-anchor="middle"><text x="70" y="169">1</text><text x="175" y="122">2</text><text x="310" y="68">C</text><text x="70" y="194">Valentina</text><text x="150" y="140">Diego</text><text x="306" y="35">Instituto Railef</text><text x="128" y="85" fill="#6a8285">Pichilemu · ejemplo</text></g>
<g transform="translate(${x} ${y})"><circle r="17" fill="#077580" stroke="#fff" stroke-width="3"/><rect x="-8" y="-8" width="16" height="14" rx="3" fill="#fff"/><rect x="-5" y="-5" width="10" height="5" rx="1" fill="#077580"/><circle cx="-4" cy="9" r="2" fill="#fff"/><circle cx="4" cy="9" r="2" fill="#fff"/></g>
</svg><div class="map-note">Mapa esquemático · posición simulada · ${isReturn ? 'vuelta' : 'ida'} · ubicación de las ${clock()}</div></div>`;
}

function swipe(label, action, extra = '') {
  return `<div class="swipe" role="button" tabindex="0" data-swipe="${action}" ${extra} aria-label="${label}. Desliza el círculo hasta el final o presiona Enter."><span class="swipe-fill"></span><span class="swipe-label">${label}</span><span class="swipe-thumb" aria-hidden="true">›</span></div>`;
}
const frame = (url, body, cls = '') => `<div class="browser ${cls}"><div class="browser-bar"><span></span><span></span><span></span><div class="url">🔒 ${url}</div></div>${body}</div>`;
const phone = (title, sub, body) => `<div class="phone"><div class="app-header"><span>${title}</span><small>${sub}</small></div><div class="app-body">${body}</div></div>`;

// ---------- administrador ----------
function admin() {
  const m = metrics(state);
  const r = routeStatus(state);
  const tabs = [['inicio', 'Inicio'], ['familias', 'Familias'], ['conductores', 'Conductores']]
    .map(([k, l]) => `<button class="admin-tab" data-admin-tab="${k}" aria-pressed="${ui.adminTab === k}">${l}</button>`).join('');
  let body = '';
  if (ui.adminTab === 'inicio') {
    const live = r.outbound === 'En curso' || r.ret === 'En curso';
    const routeRow = (tag, time, status) => `<div class="row"><div><span class="kind">${tag}</span> <strong>Ruta Playa Hermosa</strong><small>${time} · Carlos Muñoz · DE33MO</small></div><span class="badge ${badgeTone(status)}">${status}</span></div>`;
    body = `<p class="sub">Andrea Silva · Administración · Eunomi Demo</p>
<div class="metrics"><div class="metric"><small>Recorridos hoy</small><strong>${m.routes}</strong></div><div class="metric"><small>En curso</small><strong>${m.active}</strong></div><div class="metric"><small>Completados</small><strong>${m.completed}</strong></div><div class="metric"><small>A bordo</small><strong>${m.onboard}</strong></div></div>
<div class="card"><span class="tag">RECORRIDOS DE HOY</span>${routeRow('IDA', '07:10', r.outbound)}${routeRow('VUELTA', '16:30', r.ret)}
${live ? `<button class="secondary" data-action="live" aria-expanded="${ui.showLive}">${ui.showLive ? 'Ocultar seguimiento en vivo' : 'Ver seguimiento en vivo'}</button>${ui.showLive ? map() + riders.map((s, i) => `<div class="row"><div><strong>${s.name}</strong><small>${s.course} · Instituto Railef</small></div><span class="badge ${badgeTone(riderStatus(state, i))}">${riderStatus(state, i)}</span></div>`).join('') : ''}` : `<p class="hint">${m.completed === 2 ? 'Ida y vuelta completadas. Dos entregas confirmadas.' : 'El seguimiento en vivo aparece cuando el conductor inicia un recorrido.'}</p>`}</div>
<div class="card"><span class="tag">NOVEDADES</span><div class="row"><div><strong>${absent.name} no asiste hoy</strong><small>Avisado por su apoderado desde la web · ${absent.course}</small></div><span class="badge warn">Ausencia</span></div>${m.completed === 2 ? '<div class="row"><div><strong>Jornada sin incidencias</strong><small>Todas las entregas fueron confirmadas por el conductor.</small></div><span class="badge ok">Al día</span></div>' : ''}</div>`;
  } else if (ui.adminTab === 'familias') {
    body = `<p class="sub">Las familias entran con el Gmail que inscribes. Sin descargar nada y sin contraseñas.</p>
<div class="card"><div class="family"><span class="avatar">CR</span><div><strong>Carolina Rojas</strong><small>Apoderada · Gmail inscrito: caro•••@gmail.com</small></div></div><div class="row"><div><strong>Valentina Rojas</strong><small>3°B · Instituto Railef</small></div><span class="badge idle">Ruta Playa Hermosa</span></div><div class="row"><div><strong>Diego Rojas</strong><small>5°B · Instituto Railef</small></div><span class="badge idle">Ruta Playa Hermosa</span></div></div>
<div class="card"><div class="family"><span class="avatar">JP</span><div><strong>Javier Pérez</strong><small>Apoderado · Gmail inscrito: jav•••@gmail.com</small></div></div><div class="row"><div><strong>${absent.name}</strong><small>${absent.course} · Instituto Railef</small></div><span class="badge warn">Hoy no va</span></div></div>
<div class="card soft"><span class="tag">ACCESO SOLO PARA INSCRITOS</span><p>Envía a cada familia el enlace por WhatsApp. Quien entra con un Gmail no inscrito solo ve un aviso: no accede a ningún dato.</p></div>`;
  } else {
    body = `<p class="sub">Conductores y furgones de la organización.</p>
<div class="card"><div class="row"><div><strong>Carlos Muñoz</strong><small>Furgón DE33MO · Ruta Playa Hermosa (ida y vuelta)</small></div><span class="badge ${badgeTone(r.outbound === 'En curso' || r.ret === 'En curso' ? 'En curso' : '')}">${r.outbound === 'En curso' || r.ret === 'En curso' ? 'En ruta' : 'Disponible'}</span></div></div>
<div class="card soft"><span class="tag">¿TAMBIÉN MANEJAS TÚ?</span><p>Muchos transportistas administran y conducen. Con «Yo también manejo» registras tu furgón y entras a la app del conductor con el mismo Gmail.</p></div>`;
  }
  return frame('admin.eunomi.cl', `<div class="admin"><div class="admin-top"><strong>Eunomi Escolar</strong><nav>${tabs}</nav></div><div class="admin-body">${body}<button class="primary action" data-role-go="driver">${id() === 'done' ? 'Ver cierre del conductor' : 'Seguir como conductor →'}</button></div></div>`, 'wide');
}

// ---------- conductor ----------
function stopCard(label, title, sub, min, swipeLabel, extra = '') {
  return `<div class="card"><span class="tag">${label}</span><h3>${title}</h3><p>${sub}</p><div class="eta-row"><span>Llegada aproximada</span><strong>${min} min</strong></div>${map()}${swipe(swipeLabel, 'advance')}${extra}</div>`;
}
function driverMetrics(onboard, pending, min) {
  return `<div class="metrics three"><div class="metric"><small>A bordo</small><strong>${onboard}</strong></div><div class="metric"><small>Por visitar</small><strong>${pending}</strong></div><div class="metric"><small>Tiempo aprox.</small><strong>${min} min</strong></div></div>`;
}
const noShow = '<button class="text-button" data-action="noshow">No se presentó</button>';
function driver() {
  const s = id();
  const go = '<button class="secondary action" data-role-go="guardian">Ver qué ve la familia →</button>';
  const list = (statusFor) => riders.map((r, i) => `<div class="row"><div><strong>${i + 1}. ${r.name}</strong><small>${r.course} · ${r.stop}</small></div><span class="badge ${badgeTone(statusFor(i))}">${statusFor(i)}</span></div>`).join('');
  switch (s) {
    case 'prep':
      return phone('Jornada de hoy', 'Carlos Muñoz · DE33MO', `<div class="card teal"><span class="tag">IDA AL COLEGIO · 07:10</span><h3>Ruta Playa Hermosa</h3><p>3 estudiantes asignados · Instituto Railef</p><p class="note">Antes de iniciar podrás revisar quiénes asisten hoy.</p><button class="light action" data-action="advance">Revisar recorrido</button></div><div class="card"><span class="tag">OTROS RECORRIDOS DE HOY</span><div class="row"><div><strong>Vuelta a casa · 16:30</strong><small>Ruta Playa Hermosa</small></div><span class="badge idle">Vuelta aún no disponible</span></div></div>`);
    case 'review':
      return phone('Revisar recorrido', 'Ruta Playa Hermosa · Ida', `<div class="card"><h3>2 de 3 asisten · 1 no asiste</h3><p>Puede cambiar hasta que inicies el recorrido.</p></div><div class="card"><span class="tag">ORDEN DE ABORDAJE</span>${list(() => 'Asiste')}<div class="row muted-row"><div><strong>${absent.name}</strong><small>${absent.course} · Avisado por su apoderado</small></div><span class="badge warn">No asiste</span></div></div><button class="primary action" data-action="advance">Iniciar recorrido</button>`);
    case 'toV':
      return phone('Recorrido en curso', 'Ida · Ruta Playa Hermosa', driverMetrics(0, 3, 14) + stopCard('PRÓXIMA PARADA · 1 DE 2', riders[0].name, `${riders[0].course} · ${riders[0].stop}`, 3, 'Desliza para confirmar abordaje', noShow) + go);
    case 'toD':
      return phone('Recorrido en curso', 'Ida · Ruta Playa Hermosa', `<p class="toast-inline">Valentina Rojas está a bordo.</p>` + driverMetrics(1, 2, 12) + stopCard('PRÓXIMA PARADA · 2 DE 2', riders[1].name, `${riders[1].course} · ${riders[1].stop}`, 4, 'Desliza para confirmar abordaje', noShow) + go);
    case 'toSchool':
      return phone('Recorrido en curso', 'Ida · Ruta Playa Hermosa', `<p class="toast-inline">Todos a bordo.</p>` + driverMetrics(2, 1, 8) + `<div class="card"><span class="tag">DESTINO FINAL</span><h3>Instituto Railef</h3><p>Al llegar al colegio confirma la llegada.</p><div class="eta-row"><span>Llegada aproximada</span><strong>8 min</strong></div>${map()}${swipe('Desliza para confirmar llegada', 'advance')}</div>` + go);
    case 'atSchool':
      return phone('Recorrido en curso', 'Ida · Ruta Playa Hermosa', `<div class="card ok"><span class="tag">LLEGADA CONFIRMADA</span><h3>Todos los estudiantes llegaron al colegio.</h3><p>Finaliza el recorrido para cerrar la ida.</p>${swipe('Desliza para finalizar recorrido', 'advance')}</div><div class="card"><span class="tag">ESTUDIANTES</span>${list((i) => riderStatus(state, i))}</div>` + go);
    case 'idaDone':
      return phone('Jornada de hoy', 'Carlos Muñoz · DE33MO', `<div class="card ok"><span class="tag">IDA COMPLETADA · 07:42</span><h3>Ruta Playa Hermosa</h3><p>2 estudiantes llegaron al colegio.</p></div><div class="card teal"><span class="tag">VUELTA A CASA · 16:30</span><h3>Ruta Playa Hermosa</h3><p>Incluye los cambios confirmados por los apoderados.</p><button class="light action" data-action="advance">Revisar vuelta</button></div>` + go);
    case 'returnReview':
      return phone('Revisar vuelta', 'Ruta Playa Hermosa · Vuelta', `<div class="card"><h3>2 de 2 regresan</h3><p>Sin cambios informados para el regreso.</p></div><div class="card"><span class="tag">ORDEN DE ENTREGA</span>${[1, 0].map((i, n) => `<div class="row"><div><strong>${n + 1}. ${riders[i].name}</strong><small>${riders[i].course} · ${riders[i].stop}</small></div><span class="badge idle">Regresa</span></div>`).join('')}</div><button class="primary action" data-action="advance">Iniciar vuelta</button>`);
    case 'returnBoarding':
      return phone('Recorrido de vuelta', 'Abordaje en el colegio', `<div class="card"><span class="tag">ABORDAJE EN EL COLEGIO</span><h3>Confirma a cada estudiante cuando suba</h3><p>En el orden en que lleguen.</p>${riders.map((r, i) => `<div class="row"><div><strong>${r.name}</strong><small>${r.course} · Instituto Railef</small></div>${state.returnBoarded[i] ? '<span class="badge live">A bordo</span>' : `<button class="mini" data-board="${i}">A bordo</button>`}</div>`).join('')}</div>` + go);
    case 'deliverD':
      return phone('Recorrido de vuelta', 'Ruta Playa Hermosa', `<p class="toast-inline">Todos a bordo. Comienzan las entregas.</p>` + driverMetrics(2, 2, 9) + stopCard('PRÓXIMA ENTREGA · 1 DE 2', riders[1].name, `${riders[1].course} · ${riders[1].stop}`, 4, 'Desliza para confirmar entrega') + go);
    case 'deliverV':
      return phone('Recorrido de vuelta', 'Ruta Playa Hermosa', `<p class="toast-inline">Entrega de Diego Rojas confirmada.</p>` + driverMetrics(1, 1, 3) + stopCard('PRÓXIMA ENTREGA · 2 DE 2', riders[0].name, `${riders[0].course} · ${riders[0].stop}`, 3, 'Desliza para confirmar entrega') + go);
    case 'allDelivered':
      return phone('Recorrido de vuelta', 'Ruta Playa Hermosa', `<p class="toast-inline">Entrega de Valentina Rojas confirmada.</p><div class="card ok"><span class="tag">SIN ENTREGAS PENDIENTES</span><h3>Se completaron todas las entregas.</h3><p>Finaliza el recorrido para cerrar la vuelta.</p>${swipe('Desliza para finalizar recorrido', 'advance')}</div><div class="card"><span class="tag">ESTUDIANTES</span>${list((i) => riderStatus(state, i))}</div>` + go);
    default:
      return phone('Jornada de hoy', 'Carlos Muñoz · DE33MO', `<div class="card ok"><span class="tag">JORNADA COMPLETADA</span><h3>Ida y vuelta completadas</h3><p>2 abordajes y 2 entregas confirmadas. No quedan recorridos para hoy.</p></div><button class="primary action" data-role-go="admin">Ver resumen del administrador</button>` + go);
  }
}

// ---------- apoderado (web familias.eunomi.cl) ----------
function guardian() {
  if (!ui.signedIn) {
    return frame('familias.eunomi.cl', `<div class="fam center"><div class="signin"><img src="/eunomi-escolar/logo-web.png" width="56" height="56" alt=""><p class="eyebrow">EUNOMI ESCOLAR</p><h3>Sigue el furgón de tus hijos</h3><p>Mira cuándo llega el furgón, si tu hijo ya subió o llegó, y avisa los días que no irá.</p><button class="google" data-action="signin"><span class="g" aria-hidden="true">G</span> Continuar con Google</button><p class="small">Solo necesitas tu cuenta Google. Entra con el Gmail que le diste a tu transportista. Sin descargar ninguna app.</p><p class="small demo-tag">En la demo el ingreso es simulado: no se usa tu cuenta.</p></div></div>`);
  }
  const days = upcomingDays();
  const cards = riders.map((r, i) => {
    const e = guardianView(state, i);
    const tracking = trackingPhases.includes(e.phase);
    const canChangeReturn = e.phase === 'atSchool' && ['idaDone', 'returnReview', 'atSchool'].includes(id());
    return `<section class="fcard ${e.phase}"><div class="fhead"><div><h3>${r.first} Rojas</h3><small>${r.course} · Instituto Railef</small></div>${e.phase !== 'beforeOutbound' ? `<span class="badge ${tracking ? 'live' : e.phase === 'dayCompleted' || e.phase === 'atSchool' ? 'ok' : 'idle'}">${e.label}</span>` : ''}</div>
<div class="status"><strong>${e.title}</strong><p>${e.message}</p>${e.eta ? `<p class="eta">${eta(e.eta)}</p>` : ''}</div>
${tracking ? `<button class="secondary" data-map="${i}">${ui.openMap === i ? 'Ocultar mapa' : 'Ver el furgón en el mapa'}</button>${ui.openMap === i ? map() : ''}` : ''}
${canChangeReturn ? `<button class="secondary" data-action="returnplan" data-student="${i}">Hoy no vuelve en el furgón</button>` : ''}
<div class="days"><p class="days-title">Asistencia al furgón</p><p class="small">Toca un día para avisar que no irá. Mejor si avisas el día anterior.</p><div class="days-grid">${days.map((d) => {
      const off = !!ui.daysOff[`${i}-${d.key}`];
      return `<button class="day ${off ? 'off' : ''} ${d.label === 'Mañana' ? 'next' : ''}" ${d.today ? 'disabled title="Hoy queda fijo en la demo para seguir la jornada completa"' : `data-day="${d.key}" data-student="${i}" data-label="${d.label}" data-n="${d.n}"`} aria-label="${d.label} ${d.n}: ${off ? 'no va' : 'va'}"><span>${d.label}</span><strong>${d.n}</strong><small>${off ? 'No va' : 'Va'}</small></button>`;
    }).join('')}</div></div></section>`;
  }).join('');
  const sheet = ui.sheet ? `<div class="sheet-back"><section class="sheet" role="dialog" aria-modal="true" aria-label="${ui.sheet.title}"><h3>${ui.sheet.title}</h3>${ui.sheet.body}<button class="ghost" data-action="closesheet">Cancelar</button></section></div>` : '';
  return frame('familias.eunomi.cl', `<div class="fam"><div class="ftop"><span class="logo">E</span><div><strong>Eunomi Escolar</strong><small>Actualizado ${clock()}</small></div><button class="text-button" data-action="signout">Salir</button></div>${cards}<section class="fcard driver-card"><small>Conductor</small><strong>Carlos Muñoz</strong><small>Furgón · DE33MO</small></section><button class="secondary action" data-role-go="driver">Continuar como conductor →</button>${sheet}</div>`);
}

// ---------- render ----------
function render() {
  const s = steps[state.step];
  document.querySelector('#step-count').textContent = `PASO ${state.step + 1} DE ${steps.length}`;
  document.querySelector('#step-title').textContent = s.title;
  document.querySelector('#step-copy').textContent = s.copy;
  document.querySelector('#timeline').innerHTML = phases.map((p, i) => `<li class="${i < s.phase ? 'done' : i === s.phase ? 'current' : ''}" ${i === s.phase ? 'aria-current="step"' : ''}><span>${i < s.phase ? '✓' : i + 1}</span>${p}</li>`).join('');
  document.querySelectorAll('[data-role]').forEach((b) => { b.setAttribute('aria-selected', String(b.dataset.role === role)); b.tabIndex = b.dataset.role === role ? 0 : -1; });
  screen.setAttribute('aria-labelledby', `tab-${role}`);
  screen.innerHTML = ({ admin, driver, guardian })[role]();
  screen.querySelector('.sheet')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function say(text) { feedback.textContent = text; }
function changeRole(value) { role = value; ui.sheet = null; render(); }

const afterMessages = {
  review: 'Revisión lista: 2 de 3 asisten. Tomás no asiste por aviso de su familia.',
  toV: 'Recorrido de ida iniciado. La familia ya ve que el furgón viene en camino.',
  toD: 'Abordaje de Valentina confirmado. La familia y el administrador ya lo ven.',
  toSchool: 'Abordaje de Diego confirmado. Todos a bordo rumbo al colegio.',
  atSchool: 'Llegada al colegio confirmada. Las familias ven «En el colegio».',
  idaDone: 'Ida finalizada. El administrador la ve como completada.',
  returnReview: 'Vuelta lista para revisar.',
  returnBoarding: 'Vuelta iniciada. Confirma los abordajes en el colegio.',
  deliverV: 'Entrega de Diego confirmada. Su seguimiento terminó.',
  allDelivered: 'Entrega de Valentina confirmada.',
  done: 'Recorrido de vuelta finalizado. Jornada completada.',
};
function doAdvance() {
  state = advance(state);
  ui.openMap = null;
  say(afterMessages[id()] ?? steps[state.step].title);
  render();
}

document.querySelector('.role-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-role]'); if (b) changeRole(b.dataset.role); });
document.querySelector('.role-tabs').addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const roles = Object.keys(roleNames);
  let i = roles.indexOf(role);
  i = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
  changeRole(roles[i]);
  document.querySelector(`#tab-${role}`).focus();
});

screen.addEventListener('click', (e) => {
  const t = e.target;
  const go = t.closest('[data-role-go]');
  if (go) { changeRole(go.dataset.roleGo); screen.focus({ preventScroll: true }); return; }
  const tab = t.closest('[data-admin-tab]');
  if (tab) { ui.adminTab = tab.dataset.adminTab; render(); return; }
  const board = t.closest('[data-board]');
  if (board) {
    const i = Number(board.dataset.board);
    state = boardReturn(state, i);
    say(id() === 'deliverD' ? `${riders[i].name} está a bordo. Todos a bordo: comienzan las entregas.` : `${riders[i].name} está a bordo. Su familia ya lo ve.`);
    render();
    return;
  }
  const mapBtn = t.closest('[data-map]');
  if (mapBtn) { const i = Number(mapBtn.dataset.map); ui.openMap = ui.openMap === i ? null : i; render(); return; }
  const day = t.closest('[data-day]');
  if (day) {
    const key = `${day.dataset.student}-${day.dataset.day}`;
    const name = riders[Number(day.dataset.student)].first;
    const off = !!ui.daysOff[key];
    const when = day.dataset.label === 'Mañana' ? 'mañana' : `el ${day.dataset.label.toLowerCase()} ${day.dataset.n}`;
    ui.sheet = {
      title: off ? `¿${name} sí irá ${when}?` : `¿${name} no irá ${when}?`,
      body: `<p>${off ? 'El conductor lo esperará como de costumbre.' : 'El conductor no lo esperará ese día. Puedes cambiarlo hasta que empiece la ida.'}</p><button class="${off ? 'primary' : 'btn-warn'} action" data-confirm-day="${key}" data-when="${when}" data-name="${name}">${off ? 'Sí, irá' : 'No irá'}</button>`,
    };
    render();
    return;
  }
  const confirmDay = t.closest('[data-confirm-day]');
  if (confirmDay) {
    const key = confirmDay.dataset.confirmDay;
    ui.daysOff[key] = !ui.daysOff[key];
    ui.sheet = null;
    say(ui.daysOff[key] ? `Listo: el conductor sabe que ${confirmDay.dataset.name} no irá ${confirmDay.dataset.when}. Ese día aparecerá como «No asiste» al revisar su recorrido.` : `Listo: ${confirmDay.dataset.name} irá ${confirmDay.dataset.when}.`);
    render();
    return;
  }
  const a = t.closest('[data-action]');
  if (!a) return;
  switch (a.dataset.action) {
    case 'advance': doAdvance(); return;
    case 'live': ui.showLive = !ui.showLive; break;
    case 'signin': ui.signedIn = true; say('Ingreso simulado con Google. En Eunomi solo entra el Gmail que inscribió el transportista.'); break;
    case 'signout': ui.signedIn = false; ui.openMap = null; break;
    case 'closesheet': ui.sheet = null; break;
    case 'noshow': say('En la app, el conductor registra que no se presentó y la familia recibe el aviso. En esta demo, el estudiante sí está en la parada.'); return;
    case 'returnplan': {
      const name = riders[Number(a.dataset.student)].first;
      ui.sheet = {
        title: `¿Cómo vuelve ${name} hoy?`,
        body: `<p>Avísale al conductor antes de la vuelta. En esta demo el aviso no cambia el recorrido.</p><div class="options"><button class="option" data-action="plan"><strong>Lo retiraré del colegio</strong><span>Un adulto autorizado lo retirará.</span></button><button class="option" data-action="plan"><strong>Se irá por sus propios medios</strong></button><button class="option" data-action="plan"><strong>Saldrá acompañado o con amigos</strong></button></div>`,
      };
      break;
    }
    case 'plan': ui.sheet = null; say('En la app, el aviso llega al conductor y lo confirma al revisar la vuelta. En esta demo ambos hermanos vuelven en el furgón.'); break;
    default: return;
  }
  render();
});

// ---------- control deslizante ----------
let drag = null;
screen.addEventListener('pointerdown', (e) => {
  const track = e.target.closest('.swipe');
  if (!track) return;
  const thumb = track.querySelector('.swipe-thumb');
  const max = track.clientWidth - thumb.offsetWidth - 8;
  drag = { track, thumb, startX: e.clientX, dx: 0, max };
  track.setPointerCapture(e.pointerId);
  track.classList.add('dragging');
});
screen.addEventListener('pointermove', (e) => {
  if (!drag) return;
  drag.dx = Math.max(0, Math.min(drag.max, e.clientX - drag.startX));
  drag.thumb.style.transform = `translateX(${drag.dx}px)`;
  drag.track.querySelector('.swipe-fill').style.width = `${drag.dx + drag.thumb.offsetWidth}px`;
});
function endDrag() {
  if (!drag) return;
  const { track, thumb, dx, max } = drag;
  drag = null;
  track.classList.remove('dragging');
  if (dx >= max * 0.85) { doAdvance(); return; }
  thumb.style.transform = '';
  track.querySelector('.swipe-fill').style.width = '';
  if (dx < 6) say('Desliza el círculo hasta el final para confirmar. Así se evitan toques accidentales mientras se conduce.');
}
screen.addEventListener('pointerup', endDrag);
screen.addEventListener('pointercancel', endDrag);
screen.addEventListener('keydown', (e) => {
  const track = e.target.closest?.('.swipe');
  if (track && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); doAdvance(); screen.focus({ preventScroll: true }); }
});

document.querySelector('#reset').addEventListener('click', () => {
  state = initialState();
  role = 'admin';
  ui = freshUi();
  say('Demo reiniciada. Puedes comenzar otra jornada.');
  render();
});

render();

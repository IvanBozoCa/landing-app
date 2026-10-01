import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialState, freeGaps, slots, hold, release, complete, annotate, block, toClose, closeDay,
  givePrize, prizeReady, createPromo, priceWithPromo, serviceById, clientById, shareText, NOW,
} from '../public/demo/barberia/state.mjs';

test('hoy solo ofrece horas desde ahora y donde el servicio cabe', () => {
  const s = initialState();
  assert.deepEqual(freeGaps(s, 0), [[795, 840], [900, 930], [960, 1020], [1065, 1140]]);
  const t = slots(s, 0, 45);
  assert.ok(t.every((x) => x >= NOW));
  assert.ok(t.includes(795) && !t.includes(900), 'un corte de 45 min no cabe entre 15:00 y 15:30');
});

test('la retención ocupa la hora y liberarla la devuelve', () => {
  let s = initialState();
  const out = hold(s, 0, 960, 'clasico');
  s = out.state;
  assert.ok(!slots(s, 0, 30).includes(960));
  assert.equal(hold(s, 0, 960, 'clasico').error, 'Alguien acaba de tomar esa hora. Elige otra.');
  s = release(s, out.id);
  assert.ok(slots(s, 0, 30).includes(960));
});

test('completar crea el cliente y un celular no puede tener dos horas futuras online', () => {
  let s = initialState();
  let o = hold(s, 0, 960, 'clasico'); s = o.state;
  const r = complete(s, o.id, { name: 'Lucas Fuentes', phone: '+56 9 2222 0301', promos: true });
  s = r.state;
  assert.equal(clientById(s, r.clientId).promos, true);
  o = hold(s, 1, 900, 'barba'); s = o.state;
  assert.match(complete(s, o.id, { name: 'Lucas', phone: '+56922220301', promos: false }).error, /Ya tienes una hora/);
});

test('bloquear quita horas del enlace y no se puede bloquear encima de una reserva', () => {
  let s = initialState();
  assert.match(block(s, { day: 0, start: 930, end: 990 }).error, /tiene una reserva/);
  s = block(s, { day: 0, start: 1065, end: 1140, reason: 'trámite' }).state;
  assert.ok(slots(s, 0, 30).every((t) => t < 1065));
});

test('anotar ocupa la hora; el cierre solo suma lo atendido', () => {
  let s = initialState();
  s = annotate(s, { day: 0, start: 795, serviceId: 'clasico', clientId: 'c6', canal: 'whatsapp' }).state;
  assert.ok(!slots(s, 0, 30).includes(795));
  const pending = toClose(s).map((r) => r.id);
  assert.deepEqual(pending, ['r1', 'r2']);
  const felipe = clientById(s, 'c1');
  s = closeDay(s, ['r2']);
  assert.equal(clientById(s, 'c1').visits, felipe.visits + 1);
  assert.equal(clientById(s, 'c1').stamps, felipe.stamps + 1);
  assert.equal(clientById(s, 'c2').visits, 3, 'quien no vino no suma');
  assert.equal(toClose(s).length, 0);
});

test('premio y promoción', () => {
  let s = initialState();
  assert.ok(prizeReady(s, 'c4'));
  s = givePrize(s, 'c4');
  assert.equal(clientById(s, 'c4').stamps, 0);
  assert.ok(!prizeReady(s, 'c4'));
  assert.equal(createPromo(s, { title: '', discount: 0, message: '' }).error, 'Ponle un nombre y un descuento.');
  s = createPromo(s, { title: 'Semana tranquila', discount: 2000, message: 'Hola {nombre}' }).state;
  assert.deepEqual(priceWithPromo(s, serviceById('degradado')), { price: 10000, discount: 2000 });
});

test('texto para compartir las horas libres', () => {
  const t = shareText(initialState(), 0, 'miércoles 1 de octubre');
  assert.match(t, /^Horas disponibles el miércoles 1 de octubre:/);
  assert.match(t, /• 13:15 a 14:00/);
  assert.match(t, /Reserva aquí: https:\/\/barberia\.eunomi\.cl\/r\/demo$/);
});

test('las reservas de ejemplo no caen en días cerrados', () => {
  const s = initialState([3]);
  assert.ok(s.reservations.every((r) => r.day !== 3));
  assert.ok(s.reservations.some((r) => r.id === 'r9' && r.day === 4));
});

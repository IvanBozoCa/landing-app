import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialState, join, addReceipt, answerSurvey, reviewReceipt, requestReward, createPromo, visiblePromos,
  requestPromo, lookupCode, deliver, avg, segmentCount,
} from '../public/demo/restaurantes/club-state.mjs';

const member = () => join(initialState(), { name: 'Camila Torres', phone: '9 2222 0401', acceptsClub: true }).state;

test('unirse exige aceptar el club y deja al cliente como nuevo', () => {
  assert.match(join(initialState(), { name: 'Ana', phone: '9 1111 1111', acceptsClub: false }).error, /acepta/);
  const s = member();
  assert.equal(s.member.seg, 'nuevos');
  assert.equal(segmentCount(s, 'todos'), 46);
});

test('boleta con timbre suma 1 punto por cada $1.000; a mano queda en revisión', () => {
  let s = member();
  s = addReceipt(s, { amount: 15300, via: 'timbre' }).state;
  assert.equal(s.points, 15);
  const out = addReceipt(s, { amount: 12500, via: 'manual' });
  assert.equal(out.receipt.status, 'en_revision');
  assert.equal(out.state.points, 15);
  assert.equal(out.state.pendingPoints, 12);
});

test('la encuesta no da puntos; contar con quién vino suma 50 al estar confirmada', () => {
  let s = member();
  const r = addReceipt(s, { amount: 15300, via: 'timbre' }); s = r.state;
  const before = avg(s, 'p2');
  const a = answerSurvey(s, r.receipt.folio, { ratings: { p2: 5 }, party: { adults: 2, kids: 1, seniors: 0 } });
  assert.equal(a.bonus, 50);
  assert.equal(a.state.points, 65);
  assert.equal(avg(a.state, 'p2').n, before.n + 1);
  const b = answerSurvey(s, r.receipt.folio, { ratings: { p2: 5 }, party: null });
  assert.equal(b.bonus, 0);
  assert.equal(b.state.points, 15);
});

test('el bono de una boleta en revisión se suma recién cuando el dueño la aprueba', () => {
  let s = member();
  const r = addReceipt(s, { amount: 12500, via: 'manual' }); s = r.state;
  const a = answerSurvey(s, r.receipt.folio, { party: { adults: 1, kids: 0, seniors: 0 } });
  assert.equal(a.bonusPending, true);
  s = reviewReceipt(a.state, r.receipt.folio, true);
  assert.equal(s.points, 62);
  assert.equal(s.pendingPoints, 0);
  const rej = reviewReceipt(r.state, r.receipt.folio, false);
  assert.equal(rej.points, 0);
});

test('canje: el código se valida una sola vez en caja', () => {
  let s = member();
  s = addReceipt(s, { amount: 35000, via: 'timbre' }).state;
  assert.match(requestReward(s, 'b2').error, /puntos/);
  const out = requestReward(s, 'b1'); s = out.state;
  assert.equal(s.points, 5);
  assert.equal(lookupCode(s, out.code.toLowerCase()).entry.what, 'Bebida de la casa');
  s = deliver(s, out.code);
  assert.match(lookupCode(s, out.code).error, /ya se usó/);
  assert.equal(s.week.redeemed, 5);
});

test('una promoción solo la ve quien está en el grupo elegido', () => {
  let s = member();
  s = createPromo(s, { title: 'Te extrañamos', benefit: '10% de descuento', segment: 'novuelven' }).state;
  assert.equal(visiblePromos(s).length, 0);
  s = createPromo(s, { title: 'Esta semana', benefit: '10% de descuento', segment: 'todos' }).state;
  assert.equal(visiblePromos(s).length, 1);
  const out = requestPromo(s, visiblePromos(s)[0].id);
  s = deliver(out.state, out.code);
  assert.equal(s.promos.find((p) => p.segment === 'todos').used, 1);
  assert.match(requestPromo(s, visiblePromos(s)[0].id).error, /Ya pediste/);
});

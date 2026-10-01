import { test } from 'node:test';
import assert from 'node:assert/strict';
import { steps, initialState, advance, boardReturn, stepId, guardianView, riderStatus, routeStatus, metrics } from '../public/demo/escolar/state.mjs';

const goTo = (id) => {
  let s = initialState();
  while (stepId(s) !== id) {
    const next = stepId(s) === 'returnBoarding' ? boardReturn(boardReturn(s, 0), 1) : advance(s);
    assert.notEqual(next.step, s.step, `no se pudo avanzar desde ${stepId(s)}`);
    s = next;
  }
  return s;
};

test('antes de salir nadie aparece en ruta', () => {
  for (const id of ['prep', 'review']) {
    const s = goTo(id);
    assert.equal(guardianView(s, 0).phase, 'beforeOutbound');
    assert.equal(routeStatus(s).outbound, 'Programado');
    assert.equal(metrics(s).active, 0);
  }
});

test('un abordaje actualiza solo al estudiante correspondiente', () => {
  let s = goTo('toV');
  assert.equal(guardianView(s, 0).label, 'Próximo abordaje');
  assert.equal(guardianView(s, 1).label, 'Ida en curso');
  s = advance(s);
  assert.equal(riderStatus(s, 0), 'A bordo');
  assert.equal(guardianView(s, 0).label, 'En camino al colegio');
  assert.equal(guardianView(s, 1).label, 'Próximo abordaje');
  assert.equal(metrics(s).onboard, 1);
});

test('la llegada al colegio detiene el seguimiento y la ida se completa al finalizar', () => {
  let s = goTo('atSchool');
  assert.equal(guardianView(s, 0).phase, 'atSchool');
  assert.equal(routeStatus(s).outbound, 'En curso');
  s = advance(s);
  assert.equal(routeStatus(s).outbound, 'Completado');
  assert.equal(metrics(s).onboard, 0);
});

test('abordaje de la vuelta en cualquier orden', () => {
  let s = goTo('returnBoarding');
  assert.equal(advance(s), s, 'no se avanza sin confirmar abordajes');
  s = boardReturn(s, 1);
  assert.equal(stepId(s), 'returnBoarding');
  assert.equal(guardianView(s, 1).title, 'Ya está a bordo');
  assert.equal(guardianView(s, 0).title, 'Aún está en el colegio');
  assert.equal(boardReturn(s, 1), s, 'confirmar dos veces no cambia nada');
  s = boardReturn(s, 0);
  assert.equal(stepId(s), 'deliverD');
  assert.equal(metrics(s).onboard, 2);
});

test('cada hermano conserva su estado en las entregas', () => {
  const s = goTo('deliverV');
  assert.equal(riderStatus(s, 1), 'Entregado');
  assert.equal(guardianView(s, 1).phase, 'dayCompleted');
  assert.equal(riderStatus(s, 0), 'A bordo');
  assert.equal(guardianView(s, 0).label, 'Próxima entrega');
  assert.equal(routeStatus(s).ret, 'En curso');
});

test('cierre coherente y límite de jornada', () => {
  let s = goTo('done');
  assert.equal(s.step, steps.length - 1);
  assert.equal(advance(s), s);
  for (const i of [0, 1]) {
    assert.equal(riderStatus(s, i), 'Entregado');
    assert.equal(guardianView(s, i).phase, 'dayCompleted');
  }
  assert.deepEqual(metrics(s), { routes: 2, active: 0, completed: 2, onboard: 0, absences: 1 });
});

test('la vista de la familia nunca usa "recogida"', () => {
  let s = initialState();
  for (let n = 0; n < steps.length; n++) {
    for (const i of [0, 1]) {
      const e = guardianView(s, i);
      assert.doesNotMatch(`${e.label} ${e.title} ${e.message}`, /recog/i);
    }
    s = stepId(s) === 'returnBoarding' ? boardReturn(boardReturn(s, 0), 1) : advance(s);
  }
  assert.doesNotMatch(steps.map((x) => x.title + x.copy).join(' '), /recog/i);
});

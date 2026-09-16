import test from 'node:test';
import assert from 'node:assert/strict';
import { initialQuality, pixelRatioFor, QualityMonitor } from '../components/holocloth/performance.mjs';
import { HoloApp } from '../components/holocloth/scene.js';

function feed(monitor, fps, seconds, interacting = false) {
  const changes = [];
  for (let i = 0; i < fps * seconds; i++) {
    const next = monitor.sample(1 / fps, interacting);
    if (next) changes.push(next);
  }
  return changes;
}

test('constrained hardware starts light, including touch devices without memory hints', () => {
  assert.equal(initialQuality({ cores: 4 }), 'Low');
  assert.equal(initialQuality({ cores: 12, memory: 4 }), 'Low');
  assert.equal(initialQuality({ cores: 8, coarsePointer: true }), 'Medium');
  assert.equal(initialQuality({}), 'Medium');
  assert.equal(initialQuality({ cores: 12, memory: 16 }), 'High');
});

test('large and high-density screens stay within the rendering budget', () => {
  const ratio = pixelRatioFor('Low', 3, 3840, 2160);
  assert.ok(3840 * 2160 * ratio * ratio <= 1000001);
  assert.equal(pixelRatioFor('Low', 3, 390, 844), 1);
  assert.equal(pixelRatioFor('High', 1, 1280, 720), 1);
});

test('steady rendering and short stalls do not downgrade quality', () => {
  const monitor = new QualityMonitor('High');
  assert.deepEqual(feed(monitor, 60, 10), []);
  assert.deepEqual(feed(monitor, 30, 1), []);
  assert.deepEqual(feed(monitor, 60, 5), []);
  monitor.sample(10);
  assert.deepEqual(feed(monitor, 30, 2), []);
});

test('sustained slow frames downgrade stepwise and stop at Low', () => {
  const monitor = new QualityMonitor('High');
  assert.deepEqual(feed(monitor, 30, 7), ['Medium']);
  assert.deepEqual(feed(monitor, 30, 7), ['Low']);
  assert.deepEqual(feed(monitor, 30, 10), []);
});

test('quality transitions wait for drag release and reset on tab resume', () => {
  const monitor = new QualityMonitor('High');
  assert.deepEqual(feed(monitor, 30, 10, true), []);
  assert.deepEqual(feed(monitor, 30, 2), ['Medium']);
  monitor.reset();
  assert.deepEqual(feed(monitor, 30, 2), []);
});

test('runtime downgrade preserves the cloth and reduces solver and GPU work', () => {
  const oldWindow = globalThis.window;
  globalThis.window = { devicePixelRatio: 3 };
  try {
    const sim = { positions: new Float32Array([1, 2, 3]) };
    let disposed = 0;
    const target = () => ({ samples: 8, dispose() { disposed++; } });
    const app = {
      host: { clientWidth: 390, clientHeight: 844 },
      renderer: { capabilities: { maxSamples: 4 }, setPixelRatio() {}, setSize() {} },
      composer: { renderTarget1: target(), renderTarget2: target(), setPixelRatio() {}, setSize() {} },
      bloomPass: { enabled: true },
      params: { physics: { iterations: 14, viscosity: 0.6 } },
      sim,
      buildCloth() { assert.fail('must not reset the cloth during adaptation'); },
    };
    HoloApp.prototype.applyPerfProfile.call(app, 'Low');
    assert.equal(app.sim, sim);
    assert.deepEqual([...app.sim.positions], [1, 2, 3]);
    assert.equal(app.physicsParams.iterations, 7);
    assert.equal(app.physicsParams.viscosity, 0.6);
    assert.equal(app.bloomPass.enabled, false);
    assert.equal(app.currentPR, 1);
    assert.equal(disposed, 2);
  } finally {
    if (oldWindow === undefined) delete globalThis.window;
    else globalThis.window = oldWindow;
  }
});

test('cloth remains finite through drag and release at each quality tier', async () => {
  const { ClothSim } = await import('../components/holocloth/cloth.js');
  const { QUALITY } = await import('../components/holocloth/performance.mjs');
  const { Vector3 } = await import('three');
  for (const quality of Object.values(QUALITY)) {
    const sim = new ClothSim(2.1, 3, Math.round(quality.segments * 0.7), quality.segments);
    const center = Math.floor(sim.count / 2) * 3;
    const point = new Vector3(...sim.positions.slice(center, center + 3));
    assert.equal(sim.startGrab(point, 0.27), true);
    sim.moveGrab(point.clone().add(new Vector3(0.3, 0.2, 0)));
    const physics = { viscosity: 0.6, stiffness: 1, smoothing: 0.045, iterations: quality.iterations };
    for (let i = 0; i < 60; i++) sim.step(1 / 30, physics);
    sim.endGrab();
    for (let i = 0; i < 60; i++) sim.step(1 / 30, physics);
    assert.ok(sim.positions.every(Number.isFinite));
    assert.equal(sim.isGrabbing, false);
    sim.reset();
    assert.deepEqual(sim.positions, sim.prev);
  }
});

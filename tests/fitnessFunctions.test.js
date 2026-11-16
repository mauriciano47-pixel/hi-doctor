/**
 * HiDoctor — Performance Budgets & Zero-Leakage Fitness Functions
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Fitness 1: Presupuesto Estricto de Rendimiento en Módulos de Dominio', () => {
  const rumSize = fs.statSync(path.resolve('public/rumBeacon.js')).size;
  const contractsSize = fs.statSync(path.resolve('src/runtimeContracts.js')).size;
  const pharmaSize = fs.statSync(path.resolve('src/utils/clinicalPharmacology.js')).size;

  assert.ok(rumSize <= 5 * 1024, `public/rumBeacon.js excede 5 KB (${rumSize} B)`);
  assert.ok(contractsSize <= 10 * 1024, `src/runtimeContracts.js excede 10 KB (${contractsSize} B)`);
  assert.ok(pharmaSize <= 20 * 1024, `src/utils/clinicalPharmacology.js excede 20 KB (${pharmaSize} B)`);
});

test('Fitness 2: Control Anti-God File en Núcleo Clínico (<= 450 líneas)', () => {
  const utilsDir = path.resolve('src/utils');
  const files = fs.readdirSync(utilsDir).filter(f => f.endsWith('.js'));
  for (const f of files) {
    const lines = fs.readFileSync(path.join(utilsDir, f), 'utf8').split(/\r?\n/).length;
    assert.ok(lines <= 450, `src/utils/${f} supera límite de 450 líneas (${lines})`);
  }
});

test('Fitness 3: Auditoría Zero-Leakage en Núcleo de Dominio', () => {
  const files = [
    path.resolve('src/runtimeContracts.js'),
    ...fs.readdirSync(path.resolve('src/utils')).filter(f => f.endsWith('.js')).map(f => path.resolve('src/utils', f))
  ];
  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf8');
    assert.doesNotMatch(raw, /(?:sk_live|ghp_|AIza)[0-9a-zA-Z-_]{10,}/, `Posible secreto expuesto en ${f}`);
  }
});

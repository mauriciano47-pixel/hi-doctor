/**
 * 🩺 HiDoctor — Suite de Aptitud Arquitectónica (Architectural Fitness Functions)
 * Autor: Mauricio Uribe Maldonado | Estándar M&A Turnkey & Clean Architecture
 * 
 * Audita formalmente que la farmacología pediátrica, triaje clínico y contratos
 * mantengan un desacoplamiento estricto respecto a componentes de presentación React.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('HiDoctor — Fronteras Arquitectónicas & Pureza Clínica (Clean Architecture)', () => {
  const utilsDir = path.resolve('src/utils');
  const srcDir = path.resolve('src');

  // Módulos clínicos y de triaje puro
  const pureClinicalModules = [
    'clinicalPharmacology.js',
    'pediatricTriage.js',
    'clinicalHelpers.js'
  ];

  it('1. Módulos farmacológicos y de triaje no deben importar React ni componentes JSX', () => {
    for (const modName of pureClinicalModules) {
      const filePath = path.join(utilsDir, modName);
      if (!fs.existsSync(filePath)) continue;

      const code = fs.readFileSync(filePath, 'utf-8');
      
      const importsReact = /import\s+.*from\s+['"]react['"]/.test(code);
      assert.equal(
        importsReact,
        false,
        `Violación Arquitectónica: Módulo clínico ${modName} acoplado a React`
      );

      const hasJsxTag = /<[A-Z][a-zA-Z0-9]*\s*\/?>/.test(code);
      assert.equal(
        hasJsxTag,
        false,
        `Violación Arquitectónica: Módulo clínico ${modName} contiene sintaxis JSX`
      );
    }
  });

  it('2. El módulo de pagos (stripeService.js) no debe exponer secretos ni depender de UI', () => {
    const stripePath = path.join(utilsDir, 'stripeService.js');
    assert.ok(fs.existsSync(stripePath), 'stripeService.js debe existir');

    const code = fs.readFileSync(stripePath, 'utf-8');
    assert.doesNotMatch(code, /sk_live_[0-9a-zA-Z]+/, 'stripeService jamás debe tener llaves live secretas en cliente');
    assert.doesNotMatch(code, /import\s+.*from\s+['"]react['"]/, 'stripeService debe ser una librería de servicio desacoplada');
  });

  it('3. Los contratos en tiempo de ejecución (runtimeContracts.js) deben ser independientes y portables', () => {
    const contractsPath = path.join(srcDir, 'runtimeContracts.js');
    assert.ok(fs.existsSync(contractsPath), 'runtimeContracts.js debe existir');

    const code = fs.readFileSync(contractsPath, 'utf-8');
    assert.doesNotMatch(code, /import\s+.*from\s+['"]react['"]/, 'runtimeContracts no debe depender de React');
  });
});

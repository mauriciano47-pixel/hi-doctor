import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  clampFiniteNumber,
  sanitizeStringField,
  sanitizeAndValidateTemperature,
  sanitizeAndValidateDoseCalculation,
  sanitizeAndValidateTriageSymptoms
} from '../src/runtimeContracts.js';

describe('🧬 HiDoctor — Property-Based Testing & Fuzzing Matemático', () => {

  const extremeVectors = [
    NaN, Infinity, -Infinity, null, undefined, '', '   ',
    'NaN', 'Infinity', '-Infinity', '37.5', '42.99', '-10',
    -999999, 999999, 0, -0, 0.0000001, -0.0000001,
    Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER,
    Number.MAX_VALUE, Number.MIN_VALUE,
    1e308, -1e308, 1e-308,
    '<script>alert("xss")</script>', "'; DROP TABLE pacientes; --",
    {}, [], [1, 2, 3], { temp: 37 }, () => {}, true, false
  ];

  it('Invariante de Temperatura: Siempre retorna número finito acotado en [34.0, 43.0]', () => {
    for (const vec of extremeVectors) {
      const res = sanitizeAndValidateTemperature(vec);
      assert.equal(typeof res.valid, 'boolean');
      assert.equal(typeof res.data.temperature, 'number');
      assert.equal(Number.isFinite(res.data.temperature), true);
      assert.equal(res.data.temperature >= 34.0 && res.data.temperature <= 43.0, true);
      assert.equal(['normal', 'febrícula', 'fiebre', 'hipotermia'].includes(res.data.classification), true);
    }
  });

  it('Invariante de Dosificación Pediátrica: Dosis por toma jamás es NaN ni negativa', () => {
    const drugs = ['paracetamol', 'ibuprofeno', 'desconocido', '', null, undefined, 123];

    for (const weight of extremeVectors) {
      for (const drug of drugs) {
        const res = sanitizeAndValidateDoseCalculation({ weightKg: weight, drug });
        assert.equal(typeof res.valid, 'boolean');
        assert.equal(Number.isFinite(res.data.singleDoseMg), true);
        assert.equal(Number.isFinite(res.data.maxDailyDoseMg), true);
        assert.equal(res.data.singleDoseMg >= 0, true);
        assert.equal(res.data.maxDailyDoseMg >= res.data.singleDoseMg, true);
      }
    }
  });

  it('Invariante de Triaje Pediátrico: Lista de síntomas soporta entradas arbitrarias sin degradar', () => {
    const symptomMatrix = [
      extremeVectors,
      ['fiebre', null, undefined, 42, { flag: 'convulsión' }],
      ['letargia extrema', 'dificultad respiratoria'],
      [],
      null,
      undefined
    ];

    for (const testCase of symptomMatrix) {
      const res = sanitizeAndValidateTriageSymptoms(testCase);
      assert.equal(typeof res.valid, 'boolean');
      assert.equal(typeof res.data.isEmergency, 'boolean');
      assert.equal(['CRITICO_RED_FLAG', 'AMBULATORIO_OBSERVACION'].includes(res.data.triageLevel), true);
      assert.equal(Array.isArray(res.data.detectedRedFlags), true);
    }
  });

  it('Fuzzing Estocástico: 500 vectores aleatorios de peso y temperatura', () => {
    for (let i = 0; i < 500; i++) {
      const randomWeight = (Math.random() - 0.2) * 150; // -30 a 120 kg aprox
      const randomTemp = 30 + Math.random() * 15; // 30 a 45 °C

      const doseRes = sanitizeAndValidateDoseCalculation({ weightKg: randomWeight, drug: 'paracetamol' });
      assert.equal(Number.isFinite(doseRes.data.singleDoseMg), true);
      assert.equal(doseRes.data.weightKg >= 1.0 && doseRes.data.weightKg <= 120.0, true);

      const tempRes = sanitizeAndValidateTemperature(randomTemp);
      assert.equal(Number.isFinite(tempRes.data.temperature), true);
      assert.equal(tempRes.data.temperature >= 34.0 && tempRes.data.temperature <= 43.0, true);
    }
  });

});

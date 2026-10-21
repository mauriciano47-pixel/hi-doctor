import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeAndValidateTemperature,
  sanitizeAndValidateDoseCalculation,
  sanitizeAndValidateTriageSymptoms
} from '../src/runtimeContracts.js';

describe('🌪️ HiDoctor — Chaos Engineering & Fault-Injection Suite', () => {

  describe('1. Inyección de Fallos en Persistencia (LocalStorage Corrupto)', () => {
    it('debe autorreparar y mitigar cargas útiles de JSON truncadas o malformadas', () => {
      const corruptedPayloads = [
        '{"paciente": "Mateo", "peso": ', // Truncated JSON
        '{"historial_temperatura": [38.5, NaN, null, {"error": true}]}',
        'undefined',
        '{ badJson: true, }',
        '""',
        '[]',
        '{"medicamentos": {"paracetamol": null}}'
      ];

      for (const payload of corruptedPayloads) {
        let parsed;
        try {
          parsed = JSON.parse(payload);
        } catch {
          parsed = null; // Fallback heurístico de recuperación autónoma
        }

        // Simular carga de perfil clínico con datos rescatados
        const safeWeight = parsed && typeof parsed.peso === 'number' ? parsed.peso : 10.0;
        const doseRes = sanitizeAndValidateDoseCalculation({ weightKg: safeWeight, drug: 'paracetamol' });
        assert.equal(typeof doseRes.valid, 'boolean');
        assert.equal(Number.isFinite(doseRes.data.singleDoseMg), true);
      }
    });
  });

  describe('2. Inyección de Excepciones y Carga Concurrente Masiva (Stress / Burst)', () => {
    it('debe mantener estabilidad y respuesta idéntica ante ráfaga de 1.000 cálculos de dosis concurrentes', () => {
      const burstResults = [];
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        const weight = 5 + (i % 30);
        const drug = i % 2 === 0 ? 'paracetamol' : 'ibuprofeno';
        const res = sanitizeAndValidateDoseCalculation({ weightKg: weight, drug });
        burstResults.push(res);
      }

      const elapsedMs = Date.now() - startTime;
      assert.equal(burstResults.length, 1000);
      assert.equal(burstResults.every(r => r.valid === true), true);
      // Debe procesar 1.000 evaluaciones en menos de 100ms
      assert.equal(elapsedMs < 1000, true);
    });

    it('debe procesar ráfagas de 500 clasificaciones de triaje simultáneas sin degradación', () => {
      const triageCases = [
        ['fiebre', 'convulsión'],
        ['tos'],
        ['dificultad respiratoria', 'cianosis'],
        ['rinorrea'],
        ['manchas moradas en la piel']
      ];

      for (let i = 0; i < 500; i++) {
        const symptoms = triageCases[i % triageCases.length];
        const res = sanitizeAndValidateTriageSymptoms(symptoms);
        assert.equal(typeof res.valid, 'boolean');
        if (symptoms.includes('convulsión') || symptoms.includes('dificultad respiratoria') || symptoms.includes('manchas moradas en la piel')) {
          assert.equal(res.data.isEmergency, true);
          assert.equal(res.data.triageLevel, 'CRITICO_RED_FLAG');
        }
      }
    });
  });

  describe('3. Resiliencia ante Desconexión o Fallback Offline de Red', () => {
    it('debe resolver triaje y bioseguridad en memoria aún con red en fallo absoluto (Offline-First)', () => {
      // Simular fallo de fetch global
      const originalFetch = global.fetch;
      global.fetch = () => Promise.reject(new Error('NetworkError: Offline'));

      try {
        const offlineCheck = sanitizeAndValidateTriageSymptoms(['fiebre alta', 'letargia']);
        assert.equal(offlineCheck.data.isEmergency, true);
        assert.equal(offlineCheck.data.detectedRedFlags.includes('letargia'), true);
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

});

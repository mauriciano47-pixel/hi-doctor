import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  clampFiniteNumber,
  sanitizeStringField,
  validateContract,
  sanitizeAndValidateTemperature,
  sanitizeAndValidateDoseCalculation,
  sanitizeAndValidateTriageSymptoms
} from '../src/runtimeContracts.js';

describe('🛡️ HiDoctor — Guardián de Contratos Clínicos (Zero-Trust Runtime I/O)', () => {

  describe('1. Sanitizadores Numéricos y de Cadenas', () => {
    it('clampFiniteNumber debe acotar valores dentro de [min, max] y retornar fallback si es inválido', () => {
      assert.equal(clampFiniteNumber(38.5, 37.0, 34.0, 43.0), 38.5);
      assert.equal(clampFiniteNumber(50.0, 37.0, 34.0, 43.0), 43.0);
      assert.equal(clampFiniteNumber(20.0, 37.0, 34.0, 43.0), 34.0);
      assert.equal(clampFiniteNumber(NaN, 37.0, 34.0, 43.0), 37.0);
      assert.equal(clampFiniteNumber(Infinity, 37.0, 34.0, 43.0), 37.0);
      assert.equal(clampFiniteNumber('invalido', 37.0, 34.0, 43.0), 37.0);
    });

    it('sanitizeStringField debe recortar espacios y longitud máxima', () => {
      assert.equal(sanitizeStringField('  paracetamol  ', 'default'), 'paracetamol');
      assert.equal(sanitizeStringField('', 'default'), 'default');
      assert.equal(sanitizeStringField(null, 'default'), 'default');
      assert.equal(sanitizeStringField('a'.repeat(300), 'default', 10), 'a'.repeat(10));
    });

    it('validateContract debe atrapar errores sin romper el flujo de ejecución', () => {
      const ok = validateContract('test', v => ({ valid: true, data: v.toUpperCase() }));
      assert.equal(ok.valid, true);
      assert.equal(ok.data, 'TEST');

      const broken = validateContract(null, () => { throw new Error('Boom'); });
      assert.equal(broken.valid, false);
      assert.equal(broken.errors[0], 'Boom');
    });
  });

  describe('2. Contrato de Temperatura Fisiológica Pediátrica', () => {
    it('debe validar temperaturas pediátricas en rango normal y clasificar fiebre', () => {
      const normal = sanitizeAndValidateTemperature(36.8);
      assert.equal(normal.valid, true);
      assert.equal(normal.data.temperature, 36.8);
      assert.equal(normal.data.classification, 'normal');

      const febricula = sanitizeAndValidateTemperature(37.8);
      assert.equal(febricula.valid, true);
      assert.equal(febricula.data.classification, 'febrícula');

      const fiebre = sanitizeAndValidateTemperature(39.2);
      assert.equal(fiebre.valid, true);
      assert.equal(fiebre.data.classification, 'fiebre');

      const hipotermia = sanitizeAndValidateTemperature(35.0);
      assert.equal(hipotermia.valid, true);
      assert.equal(hipotermia.data.classification, 'hipotermia');
    });

    it('debe rechazar temperaturas biológicamente incompatibles con la vida (<34 o >43)', () => {
      const low = sanitizeAndValidateTemperature(32.0);
      assert.equal(low.valid, false);
      assert.equal(low.data.temperature, 34.0); // clampeado
      assert.equal(low.errors.length, 1);

      const high = sanitizeAndValidateTemperature(45.0);
      assert.equal(high.valid, false);
      assert.equal(high.data.temperature, 43.0);
      assert.equal(high.errors.length, 1);
    });
  });

  describe('3. Contrato de Dosificación Farmacológica Milimétrica', () => {
    it('debe calcular dosis exacta de Paracetamol (15 mg/kg) e intervalo de 6h', () => {
      const res = sanitizeAndValidateDoseCalculation({ weightKg: 10, drug: 'paracetamol' });
      assert.equal(res.valid, true);
      assert.equal(res.data.singleDoseMg, 150.0);
      assert.equal(res.data.maxDailyDoseMg, 600.0);
      assert.equal(res.data.recommendedIntervalHours, 6);
    });

    it('debe calcular dosis exacta de Ibuprofeno (10 mg/kg) e intervalo de 8h', () => {
      const res = sanitizeAndValidateDoseCalculation({ weightKg: 12, drug: 'ibuprofeno' });
      assert.equal(res.valid, true);
      assert.equal(res.data.singleDoseMg, 120.0);
      assert.equal(res.data.maxDailyDoseMg, 480.0);
      assert.equal(res.data.recommendedIntervalHours, 8);
    });

    it('debe rechazar pesos pediátricos fuera del rango seguro [1.0 - 120.0 kg]', () => {
      const resZero = sanitizeAndValidateDoseCalculation({ weightKg: 0, drug: 'paracetamol' });
      assert.equal(resZero.valid, false);
      assert.equal(resZero.errors.length > 0, true);

      const resExtreme = sanitizeAndValidateDoseCalculation({ weightKg: 150, drug: 'paracetamol' });
      assert.equal(resExtreme.valid, false);
    });
  });

  describe('4. Contrato de Banderas Rojas y Triaje Pediátrico', () => {
    it('debe marcar CRITICO_RED_FLAG ante síntomas de alerta de emergencia vital', () => {
      const res = sanitizeAndValidateTriageSymptoms(['fiebre', 'convulsión', 'somnolencia']);
      assert.equal(res.valid, true);
      assert.equal(res.data.isEmergency, true);
      assert.equal(res.data.triageLevel, 'CRITICO_RED_FLAG');
      assert.equal(res.data.detectedRedFlags.includes('convulsión'), true);
    });

    it('debe clasificar AMBULATORIO_OBSERVACION ante síntomas leves sin banderas rojas', () => {
      const res = sanitizeAndValidateTriageSymptoms(['congestion nasal', 'tos leve']);
      assert.equal(res.valid, true);
      assert.equal(res.data.isEmergency, false);
      assert.equal(res.data.triageLevel, 'AMBULATORIO_OBSERVACION');
      assert.equal(res.data.detectedRedFlags.length, 0);
    });

    it('debe ser resiliente ante entradas no arreglos o vacías', () => {
      const resNull = sanitizeAndValidateTriageSymptoms(null);
      assert.equal(resNull.valid, true);
      assert.equal(resNull.data.isEmergency, false);
    });
  });

});

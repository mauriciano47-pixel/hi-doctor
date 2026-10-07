import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularDosisMilimetrica,
  detectarAlergiaCruzadaAINE,
  normalizarCadenaClinica,
  FARMACOS_CONFIG,
  TAXONOMIA_AINES
} from '../src/utils/clinicalPharmacology.js';

describe('🔬 HiDoctor — Suite Farmacológica Pediátrica & Bioseguridad', () => {

  describe('1. Normalización de Cadenas Clínicas', () => {
    it('debe limpiar tildes, mayúsculas y espacios en blanco', () => {
      assert.equal(normalizarCadenaClinica('  ÁCIDO ACETILSALICÍLICO  '), 'acido acetilsalicilico');
      assert.equal(normalizarCadenaClinica('Ibupènó'), 'ibupeno');
      assert.equal(normalizarCadenaClinica(''), '');
      assert.equal(normalizarCadenaClinica(null), '');
      assert.equal(normalizarCadenaClinica(undefined), '');
    });
  });

  describe('2. Algoritmo de Dosificación de Paracetamol', () => {
    it('debe calcular correctamente dosis recomendada para 10 kg (12.5 mg/kg = 125 mg)', () => {
      // 10 kg * 12.5 = 125 mg. Presentación jarabe 120mg/5ml = 24 mg/ml. Volumen = 125 / 24 = 5.2 ml
      const res = calcularDosisMilimetrica(10, 'paracetamol', 24, false);
      assert.equal(res.valido, true);
      assert.equal(res.dosisMg, 125);
      assert.equal(res.dosisMl, 5.2);
      assert.equal(res.dosisTechoAplicada, false);
      assert.equal(res.farmaco, 'Paracetamol');
      assert.equal(res.intervaloRecomendadoHoras, 6);
    });

    it('debe calcular correctamente gotas para lactante de 5 kg con gotas 100 mg/ml', () => {
      // 5 kg * 12.5 = 62.5 -> round: 63 mg.
      // Gotas: 62.5 / (100 / 24) = 62.5 / 4.1667 = 15 gotas
      const res = calcularDosisMilimetrica(5, 'paracetamol', 100, true);
      assert.equal(res.valido, true);
      assert.equal(res.dosisMg, 63);
      assert.equal(res.esGotas, true);
      assert.equal(res.dosisGotas, 15);
      assert.equal(res.dosisTechoAplicada, false);
    });

    it('debe aplicar CLAMP de dosis techo a 500 mg para paciente de 45 kg (calculado daría 562.5 mg)', () => {
      const res = calcularDosisMilimetrica(45, 'paracetamol', 24, false);
      assert.equal(res.valido, true);
      assert.equal(res.dosisTechoAplicada, true);
      assert.equal(res.dosisMg, 500); // Tope estricto de seguridad pediátrica
      assert.equal(res.maxDosisUnicaMg, 500);
      assert.equal(res.dosisCalculadaSinTopeMg, 563);
      assert.ok(res.advertenciaSeguridad.includes('500 mg'));
    });
  });

  describe('3. Algoritmo de Dosificación de Ibuprofeno', () => {
    it('debe calcular dosis recomendada para 12 kg (7.5 mg/kg = 90 mg) con jarabe 20 mg/ml', () => {
      // 12 kg * 7.5 = 90 mg. 90 / 20 = 4.5 ml
      const res = calcularDosisMilimetrica(12, 'ibuprofeno', 20, false);
      assert.equal(res.valido, true);
      assert.equal(res.dosisMg, 90);
      assert.equal(res.dosisMl, 4.5);
      assert.equal(res.dosisTechoAplicada, false);
      assert.equal(res.farmaco, 'Ibuprofeno');
      assert.equal(res.intervaloRecomendadoHoras, 8);
    });

    it('debe aplicar CLAMP de dosis techo a 400 mg para paciente de 60 kg (calculado daría 450 mg)', () => {
      const res = calcularDosisMilimetrica(60, 'ibuprofeno', 40, false);
      assert.equal(res.valido, true);
      assert.equal(res.dosisTechoAplicada, true);
      assert.equal(res.dosisMg, 400); // Tope estricto por toma
      assert.equal(res.maxDosisUnicaMg, 400);
      assert.equal(res.maxDosisDiariaMg, 1200);
    });
  });

  describe('4. Guardas Biométricas & Entradas Inválidas', () => {
    it('debe rechazar peso 0 kg', () => {
      const res = calcularDosisMilimetrica(0, 'paracetamol', 24);
      assert.equal(res.valido, false);
      assert.ok(res.error.includes('inválido'));
    });

    it('debe rechazar peso negativo (-8 kg)', () => {
      const res = calcularDosisMilimetrica(-8, 'paracetamol', 24);
      assert.equal(res.valido, false);
      assert.ok(res.error.includes('inválido'));
    });

    it('debe rechazar peso no numérico ("diez")', () => {
      const res = calcularDosisMilimetrica('diez', 'paracetamol', 24);
      assert.equal(res.valido, false);
      assert.ok(res.error.includes('inválido'));
    });

    it('debe rechazar concentración <= 0', () => {
      const res = calcularDosisMilimetrica(10, 'paracetamol', 0);
      assert.equal(res.valido, false);
      assert.ok(res.error.includes('Concentración'));
    });

    it('debe rechazar fármaco desconocido', () => {
      const res = calcularDosisMilimetrica(10, 'amoxicilina_invalida', 50);
      assert.equal(res.valido, false);
      assert.ok(res.error.includes('no soportado'));
    });
  });

  describe('5. Detección de Reactividad Cruzada de AINEs (Código ATC M01A)', () => {
    it('debe detectar alergia a principio activo explícito (ej. naproxeno)', () => {
      const res = detectarAlergiaCruzadaAINE(['alergia a naproxeno sódico']);
      assert.equal(res.tieneAlergia, true);
      assert.equal(res.terminoDetectado, 'naproxeno');
      assert.ok(res.motivo.includes('M01A'));
    });

    it('debe detectar marcas comerciales de AINEs (ej. Actron, Flanax, Advil)', () => {
      const res1 = detectarAlergiaCruzadaAINE(['reacción adversa a actron']);
      assert.equal(res1.tieneAlergia, true);
      assert.equal(res1.terminoDetectado, 'actron');

      const res2 = detectarAlergiaCruzadaAINE(['intolerancia severa a Advil infantil']);
      assert.equal(res2.tieneAlergia, true);
      assert.equal(res2.terminoDetectado, 'advil');

      const res3 = detectarAlergiaCruzadaAINE(['flanax']);
      assert.equal(res3.tieneAlergia, true);
      assert.equal(res3.terminoDetectado, 'flanax');
    });

    it('debe detectar términos genéricos ("alergia a antiinflamatorios" / "aines")', () => {
      const res1 = detectarAlergiaCruzadaAINE(['alergico a los aines']);
      assert.equal(res1.tieneAlergia, true);
      assert.ok(res1.terminoDetectado.startsWith('aine'));

      const res2 = detectarAlergiaCruzadaAINE(['no tolero ningun antiinflamatorio']);
      assert.equal(res2.tieneAlergia, true);
      assert.equal(res2.terminoDetectado, 'antiinflamatorio');
    });

    it('no debe dar falso positivo con "sin alergias", "penicilina" o "mariscos"', () => {
      const res1 = detectarAlergiaCruzadaAINE(['sin alergias conocidas']);
      assert.equal(res1.tieneAlergia, false);

      const res2 = detectarAlergiaCruzadaAINE(['alergia a la penicilina']);
      assert.equal(res2.tieneAlergia, false);

      const res3 = detectarAlergiaCruzadaAINE(['intolerancia a la lactosa', 'mariscos']);
      assert.equal(res3.tieneAlergia, false);

      const res4 = detectarAlergiaCruzadaAINE([]);
      assert.equal(res4.tieneAlergia, false);

      const res5 = detectarAlergiaCruzadaAINE(null);
      assert.equal(res5.tieneAlergia, false);
    });
  });

  describe('6. Descargos Médicos y Conformidad Regulatoria', () => {
    it('todo cálculo válido debe incluir descargo de responsabilidad y requerir confirmación médica', () => {
      const res = calcularDosisMilimetrica(14, 'paracetamol', 24);
      assert.equal(res.requiereConfirmacionMedica, true);
      assert.ok(res.descargoResponsabilidad.length > 20);
      assert.ok(res.aviso.length > 10);
    });
  });

});

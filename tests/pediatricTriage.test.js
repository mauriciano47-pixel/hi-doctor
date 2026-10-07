import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  clasificarTemperatura,
  evaluarTriajePediatrico,
  obtenerDirectorioPais,
  RANGOS_TEMPERATURA,
  NUMEROS_EMERGENCIA
} from '../src/utils/pediatricTriage.js';

describe('🚨 HiDoctor — Suite de Triaje Pediátrico & Banderas Rojas', () => {

  describe('1. Clasificación Fisiológica de Temperatura', () => {
    it('debe clasificar 36.6°C como NORMAL', () => {
      const res = clasificarTemperatura(36.6);
      assert.equal(res.id, 'normal');
      assert.equal(res.nivel, 'normal');
    });

    it('debe clasificar 37.7°C como FEBRÍCULA', () => {
      const res = clasificarTemperatura(37.7);
      assert.equal(res.id, 'febricula');
      assert.equal(res.nivel, 'observar');
    });

    it('debe clasificar 38.5°C como FIEBRE MODERADA', () => {
      const res = clasificarTemperatura(38.5);
      assert.equal(res.id, 'fiebre_mod');
      assert.equal(res.nivel, 'fiebre');
    });

    it('debe clasificar 39.3°C como FIEBRE ALTA', () => {
      const res = clasificarTemperatura(39.3);
      assert.equal(res.id, 'fiebre_alta');
      assert.equal(res.nivel, 'fiebre_alta');
    });

    it('debe clasificar 40.2°C como HIPERTERMIA CRÍTICA', () => {
      const res = clasificarTemperatura(40.2);
      assert.equal(res.id, 'hipertermia');
      assert.equal(res.nivel, 'emergencia');
    });

    it('debe marcar error para temperaturas fuera de rango fisiológico humano (<30°C o >45°C)', () => {
      assert.equal(clasificarTemperatura(25).nivel, 'error');
      assert.equal(clasificarTemperatura(50).nivel, 'error');
      assert.equal(clasificarTemperatura('invalido').nivel, 'error');
    });
  });

  describe('2. Evaluación de Triaje & Criterio de Riesgo Inmediato', () => {
    it('debe activar ALERTA ROJA (urgencia) para lactante de 2 meses con 38.2°C', () => {
      const triaje = evaluarTriajePediatrico({
        edadMeses: 2,
        temperatura: 38.2,
        sintomas: ['decaimiento']
      });
      assert.equal(triaje.nivelTriaje, 'rojo');
      assert.equal(triaje.esUrgencia, true);
      const alertaEdad = triaje.alertas.find(a => a.tipo === 'CRITICO_EDAD');
      assert.ok(alertaEdad);
      assert.ok(alertaEdad.mensaje.includes('menor de 3 meses'));
    });

    it('debe activar ALERTA ROJA ante hipertermia extrema (≥ 40.0°C)', () => {
      const triaje = evaluarTriajePediatrico({
        edadMeses: 24,
        temperatura: 40.5,
        sintomas: ['fiebre']
      });
      assert.equal(triaje.nivelTriaje, 'rojo');
      assert.equal(triaje.esUrgencia, true);
      const alertaHiper = triaje.alertas.find(a => a.tipo === 'HIPERTERMIA_EXTREMA');
      assert.ok(alertaHiper);
    });

    it('debe activar ALERTA ROJA ante banderas rojas (dificultad respiratoria, convulsiones)', () => {
      const triaje = evaluarTriajePediatrico({
        edadMeses: 18,
        temperatura: 37.2,
        sintomas: ['tos', 'dificultad para respirar']
      });
      assert.equal(triaje.nivelTriaje, 'rojo');
      assert.equal(triaje.esUrgencia, true);
      const banderaRoja = triaje.alertas.find(a => a.tipo === 'BANDERA_ROJA');
      assert.ok(banderaRoja);
      assert.ok(banderaRoja.mensaje.includes('dificultad para respirar'));
    });

    it('debe marcar nivel VERDE para síntomas leves sin fiebre alta en niño mayor de 3 meses', () => {
      const triaje = evaluarTriajePediatrico({
        edadMeses: 36,
        temperatura: 36.8,
        sintomas: ['congestión nasal']
      });
      assert.equal(triaje.nivelTriaje, 'verde');
      assert.equal(triaje.esUrgencia, false);
      assert.equal(triaje.totalAlertas, 0);
    });
  });

  describe('3. Directorio de Urgencias Multipaís', () => {
    it('debe tener los 9 países canónicos con números válidos', () => {
      const paises = ['Chile', 'México', 'Colombia', 'Argentina', 'Perú', 'España', 'Ecuador', 'Venezuela', 'Rep. Dominicana'];
      for (const pais of paises) {
        const directorio = obtenerDirectorioPais(pais);
        assert.ok(Array.isArray(directorio), `Directorio de ${pais} no es array`);
        assert.ok(directorio.length >= 2, `Directorio de ${pais} tiene menos de 2 números`);
        // Verificar que cada contacto tenga nombre y número
        for (const contacto of directorio) {
          assert.ok(contacto.nombre.length > 0);
          assert.ok(contacto.numero.length >= 3);
        }
      }
    });

    it('debe retornar Chile como fallback seguro ante país desconocido', () => {
      const fallback = obtenerDirectorioPais('PaisDesconocido');
      assert.deepEqual(fallback, NUMEROS_EMERGENCIA['Chile']);
    });
  });

});

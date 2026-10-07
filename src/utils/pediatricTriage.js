/**
 * ============================================================================
 * HiDoc — Motor de Triaje Clínico Pediátrico & Directorio de Emergencias (EMR)
 * Versión: 2.6.0
 * ============================================================================
 */

export const RANGOS_TEMPERATURA = {
  HIPOTERMIA: { id: 'hipotermia', min: 0, max: 35.4, nivel: 'alerta', texto: 'Hipotermia (<35.5°C)' },
  NORMAL: { id: 'normal', min: 35.5, max: 37.4, nivel: 'normal', texto: 'Temperatura Normal (35.5°C - 37.4°C)' },
  FEBRICULA: { id: 'febricula', min: 37.5, max: 37.9, nivel: 'observar', texto: 'Febrícula (37.5°C - 37.9°C)' },
  FIEBRE_MODERADA: { id: 'fiebre_mod', min: 38.0, max: 38.9, nivel: 'fiebre', texto: 'Fiebre Moderada (38.0°C - 38.9°C)' },
  FIEBRE_ALTA: { id: 'fiebre_alta', min: 39.0, max: 39.9, nivel: 'fiebre_alta', texto: 'Fiebre Alta (39.0°C - 39.9°C)' },
  HIPERTERMIA_CRITICA: { id: 'hipertermia', min: 40.0, max: 45.0, nivel: 'emergencia', texto: 'Hipertermia / Fiebre Crítica (≥40.0°C)' }
};

export const SINTOMAS_BANDERA_ROJA = [
  'dificultad para respirar',
  'respiracion muy rapida o silbante',
  'labios o cara con color azulado o grisaceo',
  'cianosis',
  'convulsiones',
  'letargo extremo',
  'dificultad para despertar',
  'falta de respuesta',
  'rigidez de cuello',
  'manchas en la piel que no desaparecen al presionar',
  'petequias',
  'deshidratacion severa'
];

export const NUMEROS_EMERGENCIA = {
  'Chile': [
    { nombre: 'Ambulancia (SAMU)', numero: '131', display: '131', tipo: 'emergencia' },
    { nombre: 'Bomberos', numero: '132', display: '132', tipo: 'emergencia' },
    { nombre: 'Carabineros', numero: '133', display: '133', tipo: 'emergencia' },
    { nombre: 'Salud Responde', numero: '6003607777', display: '600 360 7777', tipo: 'consulta' }
  ],
  'México': [
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '065', display: '065', tipo: 'emergencia' },
    { nombre: 'SAPTEL (apoyo emocional)', numero: '5552598121', display: '55 5259-8121', tipo: 'consulta' }
  ],
  'Colombia': [
    { nombre: 'Línea de emergencias', numero: '123', display: '123', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '132', display: '132', tipo: 'emergencia' },
    { nombre: 'Línea de la salud', numero: '106', display: '106', tipo: 'consulta' }
  ],
  'Argentina': [
    { nombre: 'SAME (emergencias médicas)', numero: '107', display: '107', tipo: 'emergencia' },
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Centro de Intoxicaciones', numero: '08003330160', display: '0800-333-0160', tipo: 'consulta' }
  ],
  'Perú': [
    { nombre: 'SAMU', numero: '106', display: '106', tipo: 'emergencia' },
    { nombre: 'Bomberos', numero: '116', display: '116', tipo: 'emergencia' },
    { nombre: 'Policía', numero: '105', display: '105', tipo: 'emergencia' }
  ],
  'España': [
    { nombre: 'Emergencias', numero: '112', display: '112', tipo: 'emergencia' },
    { nombre: 'Urgencias sanitarias', numero: '061', display: '061', tipo: 'emergencia' }
  ],
  'Ecuador': [
    { nombre: 'ECU 911', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '131', display: '131', tipo: 'emergencia' }
  ],
  'Venezuela': [
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Bomberos', numero: '171', display: '171', tipo: 'emergencia' }
  ],
  'Rep. Dominicana': [
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '8092211000', display: '809-221-1000', tipo: 'emergencia' }
  ]
};

/**
 * Clasifica un valor numérico de temperatura en grados Celsius.
 */
export function clasificarTemperatura(tempC) {
  const tempNum = Number(tempC);
  if (isNaN(tempNum) || tempNum < 30 || tempNum > 45) {
    return { id: 'invalida', texto: 'Temperatura fuera de rango fisiológico', nivel: 'error' };
  }

  if (tempNum <= 35.4) return RANGOS_TEMPERATURA.HIPOTERMIA;
  if (tempNum <= 37.4) return RANGOS_TEMPERATURA.NORMAL;
  if (tempNum <= 37.9) return RANGOS_TEMPERATURA.FEBRICULA;
  if (tempNum <= 38.9) return RANGOS_TEMPERATURA.FIEBRE_MODERADA;
  if (tempNum <= 39.9) return RANGOS_TEMPERATURA.FIEBRE_ALTA;
  return RANGOS_TEMPERATURA.HIPERTERMIA_CRITICA;
}

/**
 * Evalúa los parámetros del paciente infantil para emitir un triaje de bioseguridad.
 *
 * @param {object} params
 * @param {number} params.edadMeses - Edad en meses del paciente
 * @param {number|string} params.temperatura - Temperatura en °C
 * @param {Array<string>} params.sintomas - Lista de síntomas observados
 * @returns {object} Contrato de triaje pediátrico
 */
export function evaluarTriajePediatrico({ edadMeses = 12, temperatura = 37.0, sintomas = [] }) {
  const edad = Number(edadMeses);
  const temp = Number(temperatura);
  const listaSintomas = Array.isArray(sintomas) ? sintomas : [];

  const alertas = [];
  let nivelTriaje = 'verde'; // verde | amarillo | rojo

  // Regla 1: Lactante < 3 meses con fiebre (Criterio de Riesgo Inmediato de Sepsis)
  if (edad < 3 && temp >= 38.0) {
    nivelTriaje = 'rojo';
    alertas.push({
      tipo: 'CRITICO_EDAD',
      mensaje: 'URGENCIA PEDIÁTRICA: Lactante menor de 3 meses con temperatura ≥ 38.0°C requiere evaluación médica hospitalaria inmediata.'
    });
  }

  // Regla 2: Hipertermia extrema
  if (temp >= 40.0) {
    nivelTriaje = 'rojo';
    alertas.push({
      tipo: 'HIPERTERMIA_EXTREMA',
      mensaje: 'Fiebre muy alta (≥ 40.0°C). Alto riesgo de deshidratación y convulsión febril. Acuda a urgencias.'
    });
  }

  // Regla 3: Detección de Banderas Rojas (Red Flags)
  for (const s of listaSintomas) {
    const sNorm = (s || '').toLowerCase().trim();
    for (const flag of SINTOMAS_BANDERA_ROJA) {
      if (sNorm.includes(flag)) {
        nivelTriaje = 'rojo';
        alertas.push({
          tipo: 'BANDERA_ROJA',
          mensaje: `Signo de alarma detectado: "${s}". Requiere atención médica presencial urgente.`
        });
        break;
      }
    }
  }

  // Regla 4: Alerta moderada (Febrícula o Fiebre en niños mayores de 3 meses)
  if (nivelTriaje !== 'rojo') {
    if (temp >= 38.0) {
      nivelTriaje = 'amarillo';
      alertas.push({
        tipo: 'FIEBRE_MODERADA',
        mensaje: 'Fiebre activa. Mantenga hidratación abundante y monitoree curva térmica cada 4-6 horas.'
      });
    } else if (temp >= 37.5) {
      nivelTriaje = 'amarillo';
      alertas.push({
        tipo: 'FEBRICULA',
        mensaje: 'Febrícula. Observe evolución clínica y mantenga al niño en reposo ligero.'
      });
    }
  }

  return {
    nivelTriaje, // 'verde' | 'amarillo' | 'rojo'
    esUrgencia: nivelTriaje === 'rojo',
    temperaturaClasificacion: clasificarTemperatura(temp),
    alertas,
    totalAlertas: alertas.length,
    fechaEvaluacion: new Date().toISOString(),
    descargoLegal: 'Este triaje es orientativo y no reemplaza el criterio médico profesional presencial.'
  };
}

/**
 * Retorna los números de emergencia para el país seleccionado.
 */
export function obtenerDirectorioPais(pais) {
  const pNorm = (pais || '').trim();
  return NUMEROS_EMERGENCIA[pNorm] || NUMEROS_EMERGENCIA['Chile'];
}

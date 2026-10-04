/**
 * ============================================================================
 * HiDoc — Motor Farmacológico Pediátrico & Taxonomía de Bioseguridad (EMR Pro)
 * Versión: 2.6.0 (Due Diligence & HealthTech Standard)
 * ============================================================================
 * Cumple con estándares de:
 * 1. Dosis techo absolutas por toma y día (prevención de toxicidad hepática/renal).
 * 2. Taxonomía de reactividad cruzada de AINEs (código ATC M01A).
 * 3. Guardas biométricas estrictas contra valores no numéricos, <=0 o atípicos.
 * 4. Contratos de verificación y descargo médico explícito.
 */

// --- Taxonomía Farmacológica de AINEs y Reactividad Cruzada Pediátrica (ATC M01A) ---
export const TAXONOMIA_AINES = {
  codigoATC: 'M01A',
  claseTerapeutica: 'Antiinflamatorios y antirreumáticos no esteroideos (AINEs)',
  principiosActivos: [
    'ibuprofeno',
    'ketoprofeno',
    'dexketoprofeno',
    'diclofenaco',
    'naproxeno',
    'aspirina',
    'acido acetilsalicilico',
    'celecoxib',
    'meloxicam',
    'piroxicam',
    'indometacina',
    'ketorolaco',
    'clonixinato de lisina',
    'flurbiprofeno',
    'etoricoxib',
    'acido mefenamico',
    'mefenamico',
    'metamizol',
    'dipirona'
  ],
  marcasComerciales: [
    'actron',
    'advil',
    'nurofen',
    'motrin',
    'biroflen',
    'ibupirac',
    'flanax',
    'apronax',
    'ponstan',
    'voltaren',
    'cataflam',
    'dolalgial',
    'neobrufen',
    'espirfen',
    'doloflan',
    'enantyum',
    'paduden',
    'febridol',
    'dolpiret'
  ],
  terminosGenericos: [
    'aine',
    'aines',
    'nsaid',
    'nsaids',
    'antiinflamatorio',
    'anti-inflamatorio',
    'antiinflamatorios'
  ]
};

export function normalizarCadenaClinica(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Evalúa si una lista de antecedentes alérgicos contiene algún compuesto
 * o marca comercial perteneciente a la familia de los AINEs.
 */
export function detectarAlergiaCruzadaAINE(alergias) {
  if (!alergias || !Array.isArray(alergias) || alergias.length === 0) {
    return { tieneAlergia: false, motivo: null, coincidencia: null, terminoDetectado: null };
  }

  const taxonomiaNormalizada = [
    ...TAXONOMIA_AINES.principiosActivos,
    ...TAXONOMIA_AINES.marcasComerciales,
    ...TAXONOMIA_AINES.terminosGenericos
  ].map(normalizarCadenaClinica);

  for (const item of alergias) {
    const itemNorm = normalizarCadenaClinica(item);
    if (!itemNorm || itemNorm.includes('sin alergias')) continue;

    for (const termino of taxonomiaNormalizada) {
      if (itemNorm.includes(termino)) {
        return {
          tieneAlergia: true,
          motivo: `Contraindicación médica: Reactividad cruzada detectada en familia farmacológica ATC M01A (AINEs).`,
          coincidencia: item,
          terminoDetectado: termino
        };
      }
    }
  }

  return { tieneAlergia: false, motivo: null, coincidencia: null, terminoDetectado: null };
}

// ---------- Configuración Farmacológica y Límites Techo ----------
export const FARMACOS_CONFIG = {
  paracetamol: {
    nombre: 'Paracetamol',
    mgPorKgMin: 10,
    mgPorKgRec: 12.5,
    mgPorKgMax: 15,
    maxDosisUnicaMg: 500,     // Dosis techo pediátrica estándar por toma (tope de seguridad)
    maxDosisDiariaMg: 2000,   // Dosis diaria acumulada pediátrica máxima (máx 60 mg/kg/día sin superar 2000 mg)
    intervaloMinHoras: 6,
    intervaloMaxHoras: 8,
    maxTomasPorDia: 4,
    aviso: 'Dosis máxima segura: 60 mg/kg en 24 horas (techo absoluto 2000 mg/día). Administrar siempre con jeringa graduada oral.'
  },
  ibuprofeno: {
    nombre: 'Ibuprofeno',
    mgPorKgMin: 5,
    mgPorKgRec: 7.5,
    mgPorKgMax: 10,
    maxDosisUnicaMg: 400,     // Dosis techo por toma
    maxDosisDiariaMg: 1200,   // Dosis diaria pediátrica máxima segura (máx 30-40 mg/kg/día sin superar 1200 mg)
    intervaloMinHoras: 8,
    intervaloMaxHoras: 8,
    maxTomasPorDia: 3,
    aviso: '⚠️ Solo para niños mayores de 6 meses o >5 kg de peso. No usar si hay deshidratación severa sin supervisión médica.'
  }
};

export const PRESENTACIONES_DOSIS = {
  paracetamol: [
    { id: 'gotas100', nombre: 'Gotas Pediátricas (100 mg/ml)', mgPorMl: 100, esGotas: true },
    { id: 'jarabe120', nombre: 'Jarabe Pediátrico (120 mg / 5 ml) [24 mg/ml]', mgPorMl: 24, esGotas: false },
    { id: 'jarabe160', nombre: 'Jarabe Pediátrico (160 mg / 5 ml) [32 mg/ml]', mgPorMl: 32, esGotas: false },
    { id: 'jarabe250', nombre: 'Jarabe Forte (250 mg / 5 ml) [50 mg/ml]', mgPorMl: 50, esGotas: false },
  ],
  ibuprofeno: [
    { id: 'jarabe100', nombre: 'Jarabe Infantil (100 mg / 5 ml) [20 mg/ml]', mgPorMl: 20, esGotas: false },
    { id: 'jarabe200', nombre: 'Jarabe Forte (200 mg / 5 ml) [40 mg/ml]', mgPorMl: 40, esGotas: false },
    { id: 'gotas40', nombre: 'Gotas Pediátricas (40 mg/ml)', mgPorMl: 40, esGotas: true },
  ],
};

/**
 * Algoritmo Clínico de Dosificación por Peso Real con Dosis Techo y Guardas.
 *
 * @param {number|string} pesoKg - Peso corporal del paciente infantil en kilogramos
 * @param {string} farmaco - Nombre clave del fármaco ('paracetamol' o 'ibuprofeno')
 * @param {number} presentacionMgPorMl - Concentración de la formulación (mg/ml)
 * @param {boolean} esGotas - Si la formulación es dispensada en gotas
 * @returns {object} Contrato clínico auditado
 */
export function calcularDosisMilimetrica(pesoKg, farmaco, presentacionMgPorMl, esGotas = false) {
  const pesoNum = Number(pesoKg);
  const presMgPorMl = Number(presentacionMgPorMl);

  // Guardas de bioseguridad para entradas inválidas o desbordes biométricos
  if (!pesoNum || isNaN(pesoNum) || pesoNum <= 0 || pesoNum > 150) {
    return {
      valido: false,
      error: 'Parámetro biométrico inválido. Debe registrar un peso numérico mayor a 0 kg.',
      farmaco: farmaco || 'Fármaco',
      pesoBaseKg: 0,
      dosisMg: 0,
      rangoMg: '0 mg',
      dosisMl: 0,
      dosisGotas: 0,
      esGotas,
      dosisTechoAplicada: false,
      dosisCalculadaSinTopeMg: 0,
      maxDosisUnicaMg: 0,
      maxDosisDiariaMg: 0,
      intervaloRecomendadoHoras: 8,
      intervaloTexto: 'Cada 8 horas',
      aviso: 'Ingrese un peso válido para calcular la dosificación.',
      proximaDosisEstimada: new Date().toISOString(),
      requiereConfirmacionMedica: true,
      descargoResponsabilidad: 'Cálculo orientativo según peso registrado. Verifique siempre con el prospecto o su pediatra.'
    };
  }

  if (!presMgPorMl || isNaN(presMgPorMl) || presMgPorMl <= 0) {
    return {
      valido: false,
      error: 'Concentración farmacológica inválida (> 0 mg/ml).',
      farmaco: farmaco || 'Fármaco',
      pesoBaseKg: pesoNum,
      dosisMg: 0,
      rangoMg: '0 mg',
      dosisMl: 0,
      dosisGotas: 0,
      esGotas,
      dosisTechoAplicada: false,
      dosisCalculadaSinTopeMg: 0,
      maxDosisUnicaMg: 0,
      maxDosisDiariaMg: 0,
      intervaloRecomendadoHoras: 8,
      intervaloTexto: 'Cada 8 horas',
      aviso: 'Seleccione una presentación farmacéutica válida.',
      proximaDosisEstimada: new Date().toISOString(),
      requiereConfirmacionMedica: true,
      descargoResponsabilidad: 'Cálculo orientativo según peso registrado. Verifique siempre con el prospecto o su pediatra.'
    };
  }

  const farmacoKey = (farmaco || '').toLowerCase().trim();
  const cfg = FARMACOS_CONFIG[farmacoKey];
  if (!cfg) {
    return {
      valido: false,
      error: `Fármaco no soportado por el calculador clínico: ${farmaco}`,
      farmaco: farmaco || 'Desconocido',
      pesoBaseKg: pesoNum,
      dosisMg: 0,
      rangoMg: '0 mg',
      dosisMl: 0,
      dosisGotas: 0,
      esGotas,
      dosisTechoAplicada: false,
      dosisCalculadaSinTopeMg: 0,
      maxDosisUnicaMg: 0,
      maxDosisDiariaMg: 0,
      intervaloRecomendadoHoras: 8,
      intervaloTexto: 'Cada 8 horas',
      aviso: 'Fármaco no soportado.',
      proximaDosisEstimada: new Date().toISOString(),
      requiereConfirmacionMedica: true,
      descargoResponsabilidad: 'Cálculo orientativo según peso registrado. Verifique siempre con el prospecto o su pediatra.'
    };
  }

  // Cálculo según miligramaje biométrico pediátrico
  const minMgCalculado = pesoNum * cfg.mgPorKgMin;
  const recMgCalculado = pesoNum * cfg.mgPorKgRec;
  const maxMgCalculado = pesoNum * cfg.mgPorKgMax;

  // Aplicación estricta de dosis techo (Clamp Clínico)
  const recMgFinal = Math.min(recMgCalculado, cfg.maxDosisUnicaMg);
  const minMgFinal = Math.min(minMgCalculado, cfg.maxDosisUnicaMg);
  const maxMgFinal = Math.min(maxMgCalculado, cfg.maxDosisUnicaMg);

  const dosisTechoAplicada = recMgCalculado > cfg.maxDosisUnicaMg;

  // Conversión matemática a volumen (ml o gotas)
  const volumenMl = Number((recMgFinal / presMgPorMl).toFixed(1));
  const gotasPorToma = Math.round(recMgFinal / (presMgPorMl / 24)); // Factor estándar pediátrico ~24 gotas/ml

  return {
    valido: true,
    farmaco: cfg.nombre,
    pesoBaseKg: pesoNum,
    dosisMg: Math.round(recMgFinal),
    rangoMg: `${minMgFinal.toFixed(1)} - ${maxMgFinal.toFixed(1)} mg`,
    dosisMl: volumenMl,
    dosisGotas: gotasPorToma,
    esGotas,
    dosisTechoAplicada,
    dosisCalculadaSinTopeMg: Math.round(recMgCalculado),
    maxDosisUnicaMg: cfg.maxDosisUnicaMg,
    maxDosisDiariaMg: cfg.maxDosisDiariaMg,
    intervaloRecomendadoHoras: cfg.intervaloMinHoras,
    intervaloTexto: farmacoKey === 'paracetamol' ? 'Cada 6 a 8 horas (máximo 4 tomas al día)' : 'Cada 8 horas (máximo 3 tomas al día)',
    aviso: cfg.aviso,
    proximaDosisEstimada: new Date(Date.now() + cfg.intervaloMinHoras * 3600000).toISOString(),
    // Contrato Legal y Regulatorio de Due Diligence
    requiereConfirmacionMedica: true,
    descargoResponsabilidad: 'Cálculo orientativo según peso registrado. Verifique siempre con el prospecto o su pediatra antes de administrar.',
    advertenciaSeguridad: dosisTechoAplicada
      ? `🛡️ Se aplicó dosis techo de seguridad pediátrica (${cfg.maxDosisUnicaMg} mg) por peso corporal elevado.`
      : 'Verifique siempre la concentración exacta del envase antes de administrar.'
  };
}

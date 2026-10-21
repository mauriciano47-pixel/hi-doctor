/**
 * HIDOCTOR — Guardián de Contratos Clínicos en Tiempo de Ejecución (Zero-Trust Runtime I/O)
 * Valida y sanitiza en tiempo de ejecución:
 * 1. Temperaturas de curva térmica pediátrica [34.0 - 43.0 °C].
 * 2. Peso del infante [1.0 - 120.0 kg] y cálculo de dosis farmacológica milimétrica.
 * 3. Banderas rojas de triaje clínico pediátrico (convulsión, letargia, dificultad respiratoria).
 */

export function clampFiniteNumber(val, fallback, min, max) {
  const num = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

export function sanitizeStringField(val, fallback, maxLength = 250) {
  if (typeof val !== 'string') return fallback;
  const trimmed = val.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLength);
}

export function validateContract(raw, validator) {
  try {
    return validator(raw);
  } catch (err) {
    return {
      valid: false,
      data: null,
      errors: [err instanceof Error ? err.message : 'Unknown runtime contract error']
    };
  }
}

export function sanitizeAndValidateTemperature(tempCelsius) {
  const cleanTemp = clampFiniteNumber(tempCelsius, 37.0, 34.0, 43.0);
  const isValid = Number.isFinite(Number(tempCelsius)) && tempCelsius >= 34.0 && tempCelsius <= 43.0;

  let classification = 'normal';
  if (cleanTemp >= 38.0) classification = 'fiebre';
  else if (cleanTemp >= 37.5) classification = 'febrícula';
  else if (cleanTemp < 35.5) classification = 'hipotermia';

  return {
    valid: isValid,
    data: { temperature: cleanTemp, classification },
    errors: isValid ? [] : ['Temperatura fuera de rango biológico pediátrico viable (34.0 - 43.0 °C)']
  };
}

export function sanitizeAndValidateDoseCalculation(rawInput) {
  const raw = (typeof rawInput === 'object' && rawInput !== null ? rawInput : {});
  const errors = [];

  const weightKg = clampFiniteNumber(raw.weightKg, 10.0, 1.0, 120.0);
  if (!raw.weightKg || raw.weightKg < 1.0 || raw.weightKg > 120.0) {
    errors.push('Peso del paciente fuera de rango pediátrico válido (1.0 - 120.0 kg)');
  }

  const drug = sanitizeStringField(raw.drug, 'paracetamol', 50).toLowerCase();
  let doseMgPerKg = 15.0; // Paracetamol estándar 10-15 mg/kg

  if (drug === 'ibuprofeno') {
    doseMgPerKg = 10.0; // Ibuprofeno estándar 5-10 mg/kg
  }

  const singleDoseMg = Number((weightKg * doseMgPerKg).toFixed(1));
  const maxDailyDoseMg = Number((singleDoseMg * 4).toFixed(1));

  return {
    valid: errors.length === 0,
    data: {
      drug,
      weightKg,
      singleDoseMg,
      maxDailyDoseMg,
      recommendedIntervalHours: drug === 'ibuprofeno' ? 8 : 6
    },
    errors
  };
}

export function sanitizeAndValidateTriageSymptoms(symptomsList) {
  const list = Array.isArray(symptomsList) ? symptomsList : [];
  const validSymptoms = list.map(s => String(s || '').trim().toLowerCase()).filter(Boolean);

  const RED_FLAGS = [
    'convulsion', 'convulsión', 'letargia', 'inconsciente',
    'dificultad respiratoria', 'cianosis', 'manchas moradas', 'petequias'
  ];

  const detectedRedFlags = validSymptoms.filter(s =>
    RED_FLAGS.some(flag => s.includes(flag))
  );

  return {
    valid: true,
    data: {
      isEmergency: detectedRedFlags.length > 0,
      triageLevel: detectedRedFlags.length > 0 ? 'CRITICO_RED_FLAG' : 'AMBULATORIO_OBSERVACION',
      detectedRedFlags
    },
    errors: []
  };
}

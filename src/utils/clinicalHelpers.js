/**
 * ============================================================================
 * HiDoc — Funciones Utilitarias Clínicas, Biometría & Fechas (EMR)
 * ============================================================================
 */

export function calcularEdadDetallada(fechaNacStr) {
  if (!fechaNacStr) return { texto: 'Sin fecha registrada', grupoEtario: 'No determinado', mesesTotales: 0, anios: 0 };
  const nac = new Date(fechaNacStr);
  if (isNaN(nac.getTime())) return { texto: 'Fecha no válida', grupoEtario: 'No determinado', mesesTotales: 0, anios: 0 };
  const hoy = new Date();

  let anios = hoy.getFullYear() - nac.getFullYear();
  let meses = hoy.getMonth() - nac.getMonth();
  let dias = hoy.getDate() - nac.getDate();

  if (dias < 0) {
    meses -= 1;
    const ultMes = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
    dias += ultMes.getDate();
  }
  if (meses < 0) {
    anios -= 1;
    meses += 12;
  }

  const diasTotales = Math.max(0, Math.floor((hoy - nac) / (1000 * 60 * 60 * 24)));
  const mesesTotales = anios * 12 + meses;

  let grupoEtario;
  if (diasTotales <= 28) {
    grupoEtario = 'Neonato (<28 días)';
  } else if (mesesTotales < 12) {
    grupoEtario = 'Lactante Menor (1 a 11 meses)';
  } else if (mesesTotales < 24) {
    grupoEtario = 'Lactante Mayor (1 a 2 años)';
  } else if (anios < 6) {
    grupoEtario = 'Preescolar (2 a 5 años)';
  } else if (anios < 12) {
    grupoEtario = 'Escolar (6 a 11 años)';
  } else {
    grupoEtario = 'Adolescente (12+ años)';
  }

  let texto;
  if (diasTotales <= 28) texto = `${diasTotales} días`;
  else if (anios === 0) texto = `${meses} meses ${dias > 0 ? `y ${dias} d` : ''}`.trim();
  else texto = `${anios} años ${meses > 0 ? `y ${meses} m` : ''}`.trim();

  return { texto, grupoEtario, anios, meses, dias, diasTotales, mesesTotales };
}

export function calcularIMC(pesoKg, tallaCm) {
  const p = parseFloat(pesoKg);
  const t = parseFloat(tallaCm);
  if (!p || !t || t <= 0) return { valor: null, clasificacion: 'Requiere peso y talla' };
  const m = t / 100;
  const imc = (p / (m * m)).toFixed(1);
  const val = parseFloat(imc);

  let clasificacion;
  if (val < 13.5) clasificacion = 'Bajo peso para la edad';
  else if (val <= 17.5) clasificacion = 'Rango saludable / Eutrófico';
  else if (val <= 19.5) clasificacion = 'Riesgo de sobrepeso';
  else clasificacion = 'Sobrepeso (requiere control)';

  return { valor: imc, clasificacion };
}

export function generarCodigoExpediente() {
  const num = Math.floor(1000 + Math.random() * 9000);
  const anio = new Date().getFullYear();
  return `HC-PED-${anio}-${num}`;
}

export function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const formatFecha = (iso) => {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'Fecha pendiente';
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) + ' ' +
      d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Fecha pendiente';
  }
};

export const formatFechaCorta = (iso) => {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '--/--';
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
  } catch {
    return '--/--';
  }
};

export function calcularProximaDosis(med) {
  if (!med || !med.ultimaHora || !med.intervaloHoras) return null;
  const d = new Date(new Date(med.ultimaHora).getTime() + med.intervaloHoras * 60 * 60 * 1000);
  return isNaN(d.getTime()) ? null : d;
}

export function detectarPatrones(registros) {
  const patrones = [];
  if (!registros || registros.length === 0) return patrones;

  const fiebresNocturnas = registros.filter(r => {
    if (!r.fiebre) return false;
    const h = new Date(r.fecha).getHours();
    return h >= 20 || h < 6;
  });
  if (fiebresNocturnas.length >= 2) {
    patrones.push({ tipo: 'fiebre_nocturna', texto: `Fiebre nocturna registrada ${fiebresNocturnas.length} veces` });
  }

  const conFiebre = registros.filter(r => r.fiebre && r.temperatura).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  if (conFiebre.length >= 3) {
    const t = conFiebre.slice(-3).map(r => parseFloat(r.temperatura));
    if (t[2] > t[1] && t[1] > t[0]) patrones.push({ tipo: 'tendencia_subida', texto: 'La temperatura muestra tendencia al alza' });
    else if (t[2] < t[1] && t[1] < t[0]) patrones.push({ tipo: 'tendencia_bajada', texto: 'La temperatura muestra tendencia a la baja' });
  }

  const conteo = {};
  registros.forEach(r => (r.sintomas || []).forEach(s => { conteo[s] = (conteo[s] || 0) + 1; }));
  Object.entries(conteo).forEach(([s, c]) => {
    if (c >= 3) patrones.push({ tipo: 'sintoma_repetido', texto: `"${s}" se repite en ${c} registros` });
  });

  const fechas = registros.map(r => new Date(r.fecha)).sort((a, b) => a - b);
  if (fechas.length >= 2) {
    const dias = Math.max(1, Math.round((fechas[fechas.length - 1] - fechas[0]) / 86400000));
    if (dias >= 2) patrones.push({ tipo: 'duracion', texto: `Los síntomas llevan ${dias} días de evolución` });
  }
  return patrones;
}

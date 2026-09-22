import { useState, useEffect, useMemo, useRef } from 'react';

const COLORS = {
  cream: '#FFF7F0',
  sage: '#E07A5F',
  sageLight: '#F0B8A8',
  sageDark: '#C4624A',
  terracotta: '#F2A65A',
  terracottaDark: '#D88C3D',
  ink: '#2D2926',
  inkLight: '#8A7F77',
  border: '#F0E4DA',
  white: '#FFFFFF',
  alert: '#D95550',
  alertBg: '#FDE8E7',
  emerald: '#2A9D8F',
  emeraldLight: '#E8F5F3',
};

const SYMPTOM_OPTIONS = [
  'Fiebre', 'Tos', 'Vómito', 'Diarrea', 'Dolor de panza', 'Dolor de cabeza',
  'Dolor de garganta', 'Erupción en la piel', 'Congestión nasal', 'Decaimiento',
  'Pérdida de apetito', 'Dolor de oído', 'Llanto inusual', 'Dificultad para dormir', 'Otro'
];

const UNIT_OPTIONS = ['ml', 'mg', 'gotas', 'cucharadita', 'cucharada', 'comprimido', 'sobre'];

const GUIA_EDUCATIVA = [
  {
    titulo: 'Busca atención médica urgente si el niño presenta:',
    nivel: 'alerta',
    items: [
      'Dificultad para respirar, respiración muy rápida o silbante',
      'Labios o cara con color azulado o grisáceo',
      'Fiebre en un bebé menor de 3 meses (cualquier temperatura sobre 38°C)',
      'Fiebre muy alta (40°C o más) que no baja con medicación',
      'Letargo extremo, dificultad para despertar o falta de respuesta',
      'Rigidez de cuello, manchas en la piel que no desaparecen al presionar',
      'Vómitos o diarrea con signos de deshidratación (boca seca, sin lágrimas, orina muy escasa)',
      'Convulsiones',
      'Dolor abdominal intenso y persistente',
      'Erupción que se extiende rápido junto con fiebre',
    ]
  },
  {
    titulo: 'Puedes observar en casa, pero consulta si no mejora, cuando el niño presenta:',
    nivel: 'observar',
    items: [
      'Fiebre leve o moderada en un niño que sigue jugando, comiendo y reactivo',
      'Tos o congestión nasal sin dificultad para respirar',
      'Vómito o diarrea aislados, sin signos de deshidratación',
      'Síntomas leves que duran menos de 2-3 días sin empeorar',
      'Erupciones leves y localizadas sin fiebre alta asociada',
    ]
  },
  {
    titulo: 'Como referencia general (esto no sustituye la evaluación de un profesional):',
    nivel: 'info',
    items: [
      'Anota cuánto dura cada síntoma, no solo si aparece',
      'Lleva el registro de temperatura y medicación a la consulta médica',
      'Si tienes dudas, siempre es válido llamar o consultar a tu pediatra',
    ]
  },
];

const NUMEROS_EMERGENCIA = {
  'Chile': [
    { nombre: 'Ambulancia (SAMU)', numero: '131', display: '131', tipo: 'emergencia' },
    { nombre: 'Bomberos', numero: '132', display: '132', tipo: 'emergencia' },
    { nombre: 'Carabineros', numero: '133', display: '133', tipo: 'emergencia' },
    { nombre: 'Salud Responde', numero: '6003607777', display: '600 360 7777', tipo: 'consulta' },
  ],
  'México': [
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '065', display: '065', tipo: 'emergencia' },
    { nombre: 'SAPTEL (apoyo emocional)', numero: '5552598121', display: '55 5259-8121', tipo: 'consulta' },
  ],
  'Colombia': [
    { nombre: 'Línea de emergencias', numero: '123', display: '123', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '132', display: '132', tipo: 'emergencia' },
    { nombre: 'Línea de la salud', numero: '106', display: '106', tipo: 'consulta' },
  ],
  'Argentina': [
    { nombre: 'SAME (emergencias médicas)', numero: '107', display: '107', tipo: 'emergencia' },
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Centro de Intoxicaciones', numero: '08003330160', display: '0800-333-0160', tipo: 'consulta' },
  ],
  'Perú': [
    { nombre: 'SAMU', numero: '106', display: '106', tipo: 'emergencia' },
    { nombre: 'Bomberos', numero: '116', display: '116', tipo: 'emergencia' },
    { nombre: 'Policía', numero: '105', display: '105', tipo: 'emergencia' },
  ],
  'España': [
    { nombre: 'Emergencias', numero: '112', display: '112', tipo: 'emergencia' },
    { nombre: 'Urgencias sanitarias', numero: '061', display: '061', tipo: 'emergencia' },
  ],
  'Ecuador': [
    { nombre: 'ECU 911', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '131', display: '131', tipo: 'emergencia' },
  ],
  'Venezuela': [
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Bomberos', numero: '171', display: '171', tipo: 'emergencia' },
  ],
  'Rep. Dominicana': [
    { nombre: 'Emergencias', numero: '911', display: '911', tipo: 'emergencia' },
    { nombre: 'Cruz Roja', numero: '8092211000', display: '809-221-1000', tipo: 'emergencia' },
  ],
};

const TIPOS_CONTACTO = {
  pediatra: '👨‍⚕️ Pediatra',
  hospital: '🏥 Hospital / Clínica',
  farmacia: '💊 Farmacia',
  otro: '📋 Otro contacto',
};

const TIPOS_LUGAR = {
  hospital: '🏥 Hospital',
  clinic: '🩺 Clínica',
  pharmacy: '💊 Farmacia',
  doctors: '👨‍⚕️ Consultorio',
};

// Datos clínicos iniciales de demostración para evaluación inmediata en Vitrina
const DEMO_PACIENTE_ID = 'paciente-demo-sofia';
const DEMO_DATA = {
  perfiles: [
    { id: DEMO_PACIENTE_ID, nombre: 'Sofía (3 años)', creado: new Date(Date.now() - 86400000 * 2).toISOString(), pesoKg: 14 }
  ],
  registros: [
    {
      id: 'reg-demo-1',
      perfilId: DEMO_PACIENTE_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      sintomas: ['Congestión nasal', 'Decaimiento'],
      fiebre: true,
      temperatura: '37.8',
      nota: 'Comenzó con moquitos y decaimiento leve por la tarde.',
      foto: null,
      medicamento: null,
    },
    {
      id: 'reg-demo-2',
      perfilId: DEMO_PACIENTE_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString(),
      sintomas: ['Fiebre', 'Tos', 'Pérdida de apetito'],
      fiebre: true,
      temperatura: '38.6',
      nota: 'Temperatura elevada en la noche. Se administró antipirético según indicación.',
      foto: null,
      medicamento: {
        nombre: 'Paracetamol Jarabe (120 mg/5 ml)',
        dosis: '8.7',
        unidad: 'ml',
        intervaloHoras: 8,
        ultimaHora: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
    },
    {
      id: 'reg-demo-3',
      perfilId: DEMO_PACIENTE_ID,
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      sintomas: ['Fiebre', 'Tos'],
      fiebre: true,
      temperatura: '38.1',
      nota: 'Fiebre cediendo con hidratación y ropa ligera. Sigue con tos.',
      foto: null,
      medicamento: null,
    },
  ],
  contactos: [
    {
      id: 'c-demo-1',
      tipo: 'pediatra',
      nombre: 'Dra. Francisca Morales (Pediatra)',
      telefono: '+56 9 8765 4321',
      direccion: 'Centro Médico Infantil, Consulta 402',
      nota: 'Atiende lunes a viernes 09:00 a 17:00',
    },
    {
      id: 'c-demo-2',
      tipo: 'hospital',
      nombre: 'Urgencia Pediátrica Clínica Santa María',
      telefono: '+56 2 2913 0000',
      direccion: 'Av. Santa María 0500, Providencia',
      nota: 'Servicio de urgencia pediátrica 24/7',
    },
  ],
  pais: 'Chile',
};

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const formatFecha = (iso) => {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'Fecha pendiente';
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) + ' ' +
      d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Fecha pendiente';
  }
};

const formatFechaCorta = (iso) => {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '--/--';
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
  } catch {
    return '--/--';
  }
};

function calcularProximaDosis(med) {
  if (!med || !med.ultimaHora || !med.intervaloHoras) return null;
  const d = new Date(new Date(med.ultimaHora).getTime() + med.intervaloHoras * 60 * 60 * 1000);
  return isNaN(d.getTime()) ? null : d;
}

function detectarPatrones(registros) {
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

function useFonts() {
  useEffect(() => {
    if (!document.getElementById('st-fonts')) {
      const link = document.createElement('link');
      link.id = 'st-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);
}

function GraficaTemperatura({ registros }) {
  const conTemp = useMemo(() => (registros || []).filter(r => r.temperatura)
    .map(r => ({ fecha: new Date(r.fecha), temp: parseFloat(r.temperatura) }))
    .filter(r => !isNaN(r.temp) && !isNaN(r.fecha.getTime()))
    .sort((a, b) => a.fecha - b.fecha), [registros]);

  if (conTemp.length < 2) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: COLORS.inkLight, fontSize: 13.5 }}>
        ℹ️ Necesitas al menos 2 registros con temperatura para trazar la curva térmica.
      </div>
    );
  }

  const width = 600, height = 220, padding = { top: 24, right: 20, bottom: 36, left: 42 };
  const innerW = width - padding.left - padding.right, innerH = height - padding.top - padding.bottom;
  const temps = conTemp.map(p => p.temp);
  const minTemp = Math.min(35.5, Math.floor(Math.min(...temps) * 2) / 2 - 0.5);
  const maxTemp = Math.max(39.5, Math.ceil(Math.max(...temps) * 2) / 2 + 0.5);
  const minFecha = conTemp[0].fecha.getTime(), maxFecha = conTemp[conTemp.length - 1].fecha.getTime();
  const rangoFecha = Math.max(maxFecha - minFecha, 1);
  const x = (f) => padding.left + ((f.getTime() - minFecha) / rangoFecha) * innerW;
  const y = (t) => padding.top + innerH - ((t - minTemp) / (maxTemp - minTemp)) * innerH;
  const puntos = conTemp.map(p => `${x(p.fecha)},${y(p.temp)}`).join(' ');
  const yFiebreLinea = y(38);
  const yTicks = [];
  for (let t = Math.ceil(minTemp); t <= maxTemp; t++) yTicks.push(t);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Curva térmica interactiva de temperatura corporal">
      {/* Línea de alerta de 38°C */}
      <line x1={padding.left} y1={yFiebreLinea} x2={width - padding.right} y2={yFiebreLinea}
        stroke={COLORS.alert} strokeWidth="1.5" strokeDasharray="4,4" opacity="0.8" />
      <text x={width - padding.right} y={yFiebreLinea - 5} textAnchor="end" fontSize="10"
        fontWeight="bold" fill={COLORS.alert} fontFamily="Nunito, sans-serif">Límite Fiebre 38°C</text>

      {/* Ticks de temperatura */}
      {yTicks.map(t => (
        <g key={t}>
          <line x1={padding.left} y1={y(t)} x2={width - padding.right} y2={y(t)} stroke={COLORS.border} strokeWidth="1" />
          <text x={padding.left - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill={COLORS.inkLight} fontFamily="Nunito, sans-serif">{t}°</text>
        </g>
      ))}

      {/* Fechas en eje X */}
      {conTemp.map((p, i) => (i === 0 || i === conTemp.length - 1 || i % Math.ceil(conTemp.length / 5) === 0) && (
        <text key={i} x={x(p.fecha)} y={height - padding.bottom + 16} textAnchor="middle" fontSize="9"
          fill={COLORS.inkLight} fontFamily="Nunito, sans-serif">{formatFechaCorta(p.fecha)}</text>
      ))}

      {/* Línea de evolución */}
      <polyline points={puntos} fill="none" stroke={COLORS.sage} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />

      {/* Puntos térmicos */}
      {conTemp.map((p, i) => (
        <g key={i}>
          <circle cx={x(p.fecha)} cy={y(p.temp)} r="5" fill={p.temp >= 38 ? COLORS.alert : COLORS.sage} stroke={COLORS.white} strokeWidth="2" />
          <text x={x(p.fecha)} y={y(p.temp) - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill={p.temp >= 38 ? COLORS.alert : COLORS.ink} fontFamily="Nunito, sans-serif">
            {p.temp}°
          </text>
        </g>
      ))}
    </svg>
  );
}

// Estilos compartidos optimizados para pantallas táctiles y escritorio
const S = {
  app: { fontFamily: 'Nunito, sans-serif', background: COLORS.cream, minHeight: '100vh', color: COLORS.ink, padding: '20px 16px 95px' },
  h1: { fontFamily: 'Quicksand, sans-serif', fontSize: 23, fontWeight: 700, margin: '0 0 4px', color: COLORS.ink },
  h2: { fontFamily: 'Quicksand, sans-serif', fontSize: 17.5, fontWeight: 700, margin: '0 0 12px', color: COLORS.ink },
  sub: { fontSize: 13.5, color: COLORS.inkLight, margin: '0 0 18px', lineHeight: 1.5 },
  card: { background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' },
  btn: { background: COLORS.sage, color: COLORS.white, border: 'none', borderRadius: 12, padding: '11px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnOutline: { background: 'transparent', color: COLORS.sageDark, border: `1.5px solid ${COLORS.sage}`, borderRadius: 12, padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnTerracotta: { background: COLORS.terracotta, color: COLORS.white, border: 'none', borderRadius: 12, padding: '11px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' },
  input: { width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: 10, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: 'Nunito, sans-serif', background: COLORS.white, color: COLORS.ink },
  label: { fontSize: 13, color: COLORS.inkLight, marginBottom: 5, display: 'block', fontWeight: 600, fontFamily: 'Nunito, sans-serif' },
  chip: (active) => ({
    padding: '6px 13px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontWeight: 600,
    border: `1.5px solid ${active ? COLORS.sage : COLORS.border}`,
    background: active ? COLORS.sage : COLORS.white, color: active ? COLORS.white : COLORS.ink,
    fontFamily: 'Nunito, sans-serif', transition: 'all 0.15s ease',
  }),
  bottomNav: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    maxWidth: 560, margin: '0 auto',
    display: 'flex', background: COLORS.white,
    borderTop: `1px solid ${COLORS.border}`,
    padding: '6px 0 12px', zIndex: 100,
    boxShadow: '0 -2px 14px rgba(0,0,0,0.06)',
  },
  navBtn: (active) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    padding: '4px 0', fontSize: 10, fontWeight: active ? 700 : 500,
    color: active ? COLORS.sage : COLORS.inkLight, cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif', background: 'none', border: 'none',
  }),
};

const STORAGE_KEY = 'bitacora-sintomas-data-v1';

export default function App() {
  useFonts();

  const [data, setData] = useState(() => {
    try {
      const res = window.localStorage.getItem(STORAGE_KEY);
      if (res) {
        const parsed = JSON.parse(res);
        if (parsed && Array.isArray(parsed.perfiles) && parsed.perfiles.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback a demo data
    }
    return DEMO_DATA;
  });

  const perfiles = data.perfiles || [];
  const [perfilActivoId, setPerfilActivoId] = useState(() => perfiles[0]?.id || DEMO_PACIENTE_ID);
  const [vista, setVista] = useState('registro'); // registro | historial | dosis | ia | guia | resumen | ayuda
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarNuevoPerfil, setMostrarNuevoPerfil] = useState(false);
  const [prefillMedicamento, setPrefillMedicamento] = useState(null);

  // Asegurar persistencia y fallback seguro
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // safe storage fallback
    }
  }, [data]);

  // Fallback seguro inquebrantable para perfilActivo
  const perfilActivo = useMemo(() => {
    return perfiles.find(p => p.id === perfilActivoId) || perfiles[0] || null;
  }, [perfiles, perfilActivoId]);

  // Si no hay perfil seleccionado válido pero existen perfiles, sincronizar ID
  useEffect(() => {
    if (perfilActivo && perfilActivo.id !== perfilActivoId) {
      setPerfilActivoId(perfilActivo.id);
    }
  }, [perfilActivo, perfilActivoId]);

  const registrosDelPerfil = useMemo(() => {
    const regs = data.registros || [];
    if (!perfilActivo) return [];
    return regs.filter(r => r.perfilId === perfilActivo.id).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [data.registros, perfilActivo]);

  const patrones = useMemo(() => detectarPatrones(registrosDelPerfil), [registrosDelPerfil]);

  function crearPerfil(nombre, pesoKg = 14) {
    const nuevo = { id: uid(), nombre, pesoKg: parseFloat(pesoKg) || 14, creado: new Date().toISOString() };
    setData(d => ({ ...d, perfiles: [...(d.perfiles || []), nuevo] }));
    setPerfilActivoId(nuevo.id);
    setMostrarNuevoPerfil(false);
  }

  function agregarRegistro(registro) {
    if (!perfilActivo) return;
    setData(d => ({
      ...d,
      registros: [...(d.registros || []), { ...registro, id: uid(), perfilId: perfilActivo.id }]
    }));
    setMostrarForm(false);
    setPrefillMedicamento(null);
  }

  function eliminarRegistro(id) {
    setData(d => ({ ...d, registros: (d.registros || []).filter(r => r.id !== id) }));
  }

  function agregarContacto(contacto) {
    setData(d => ({ ...d, contactos: [...(d.contactos || []), { ...contacto, id: uid() }] }));
  }

  function eliminarContacto(id) {
    setData(d => ({ ...d, contactos: (d.contactos || []).filter(c => c.id !== id) }));
  }

  function setPais(pais) {
    setData(d => ({ ...d, pais }));
  }

  function restablecerDatosDemo() {
    setData(DEMO_DATA);
    setPerfilActivoId(DEMO_PACIENTE_ID);
    setMostrarForm(false);
    setMostrarNuevoPerfil(false);
    setVista('registro');
  }

  function transferirDosisARegistro(dosisData) {
    setPrefillMedicamento(dosisData);
    setVista('registro');
    setMostrarForm(true);
  }

  return (
    <div style={S.app}>
      {/* Barra de estado / Marca */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h1 style={S.h1}>🩺 HiDoctor</h1>
          <p style={{ ...S.sub, margin: 0, fontSize: 12.5 }}>Bitácora Pediátrica & Doctor IA</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={restablecerDatosDemo}
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: '5px 9px',
              fontSize: 11,
              color: COLORS.sageDark,
              cursor: 'pointer',
              fontWeight: 600
            }}
            title="Cargar o reiniciar datos de demostración médica"
            aria-label="Reiniciar caso de demostración"
          >
            🔄 Caso Demo
          </button>
        </div>
      </header>

      {/* Selector de perfil o aviso de bienvenida */}
      <nav aria-label="Perfiles de pacientes" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {perfiles.map(p => (
          <button
            key={p.id}
            onClick={() => setPerfilActivoId(p.id)}
            style={S.chip(p.id === perfilActivo?.id)}
            aria-pressed={p.id === perfilActivo?.id}
          >
            🧒 {p.nombre}
          </button>
        ))}
        {!mostrarNuevoPerfil ? (
          <button
            onClick={() => setMostrarNuevoPerfil(true)}
            style={{ ...S.chip(false), borderStyle: 'dashed', color: COLORS.sageDark }}
            aria-label="Agregar nuevo paciente"
          >
            + Paciente
          </button>
        ) : null}
      </nav>

      {mostrarNuevoPerfil && (
        <div style={S.card}>
          <PerfilForm onCrear={crearPerfil} onCancelar={() => setMostrarNuevoPerfil(false)} />
        </div>
      )}

      {/* Contenido según la pestaña activa */}
      <main>
        {vista === 'registro' && (
          <VistaRegistro
            perfilActivo={perfilActivo}
            mostrarForm={mostrarForm}
            setMostrarForm={setMostrarForm}
            agregarRegistro={agregarRegistro}
            registrosDelPerfil={registrosDelPerfil}
            patrones={patrones}
            prefillMedicamento={prefillMedicamento}
            onCrearPerfilPrimero={() => setMostrarNuevoPerfil(true)}
          />
        )}

        {vista === 'historial' && (
          <VistaHistorial
            perfilActivo={perfilActivo}
            registrosDelPerfil={registrosDelPerfil}
            eliminarRegistro={eliminarRegistro}
            onVerResumen={() => setVista('resumen')}
          />
        )}

        {vista === 'dosis' && (
          <VistaCalculadoraDosis
            perfilActivo={perfilActivo}
            onTransferirDosis={transferirDosisARegistro}
          />
        )}

        {vista === 'ia' && (
          <VistaAsistenteIA
            perfilActivo={perfilActivo}
            registrosDelPerfil={registrosDelPerfil}
            patrones={patrones}
          />
        )}

        {vista === 'guia' && <VistaGuia />}

        {vista === 'resumen' && (
          <VistaResumen
            perfilActivo={perfilActivo}
            registrosDelPerfil={registrosDelPerfil}
            patrones={patrones}
            onVolver={() => setVista('historial')}
          />
        )}

        {vista === 'ayuda' && (
          <VistaAyuda
            contactos={data.contactos || []}
            agregarContacto={agregarContacto}
            eliminarContacto={eliminarContacto}
            paisSeleccionado={data.pais || 'Chile'}
            setPaisSeleccionado={setPais}
          />
        )}
      </main>

      {/* Firma de Titularidad Canónica */}
      <footer style={{ textAlign: 'center', marginTop: 32, marginBottom: 8 }}>
        <p style={{
          fontSize: 11.5,
          letterSpacing: 0.5,
          color: COLORS.inkLight,
          fontFamily: 'Nunito, sans-serif'
        }}>
          HiDoctor · Desarrollado por Mauricio Uribe Maldonado · Privacidad Local 100% Offline-First
        </p>
      </footer>

      {/* Barra de Navegación Inferior Siempre Operativa */}
      <nav style={S.bottomNav} aria-label="Navegación principal de HiDoctor">
        <button style={S.navBtn(vista === 'registro')} onClick={() => setVista('registro')} aria-label="Pestaña Registro">
          <span style={{ fontSize: 19 }}>📝</span>
          <span>Registro</span>
        </button>
        <button style={S.navBtn(vista === 'historial')} onClick={() => setVista('historial')} aria-label="Pestaña Curva e Historial">
          <span style={{ fontSize: 19 }}>📊</span>
          <span>Curva</span>
        </button>
        <button style={S.navBtn(vista === 'dosis')} onClick={() => setVista('dosis')} aria-label="Pestaña Calculadora de Dosis por Peso">
          <span style={{ fontSize: 19 }}>💊</span>
          <span>Dosis</span>
        </button>
        <button style={S.navBtn(vista === 'ia')} onClick={() => setVista('ia')} aria-label="Pestaña Doctor IA">
          <span style={{ fontSize: 19 }}>🤖</span>
          <span>Doctor IA</span>
        </button>
        <button style={S.navBtn(vista === 'guia')} onClick={() => setVista('guia')} aria-label="Pestaña Guía de Alarma">
          <span style={{ fontSize: 19 }}>📖</span>
          <span>Guía</span>
        </button>
        <button style={S.navBtn(vista === 'ayuda')} onClick={() => setVista('ayuda')} aria-label="Pestaña Emergencias y Ayuda">
          <span style={{ fontSize: 19 }}>🆘</span>
          <span>Ayuda</span>
        </button>
      </nav>
    </div>
  );
}

function PerfilForm({ onCrear, onCancelar }) {
  const [nombre, setNombre] = useState('');
  const [peso, setPeso] = useState('14');

  return (
    <div>
      <h2 style={{ ...S.h2, fontSize: 16 }}>Nuevo Paciente Infantil</h2>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="perfil-nombre" style={S.label}>Nombre del niño o niña</label>
        <input
          id="perfil-nombre"
          style={S.input}
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ej. Sofía, Mateo, Lucas"
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="perfil-peso" style={S.label}>Peso aproximado en kilogramos (opcional)</label>
        <input
          id="perfil-peso"
          type="number"
          step="0.5"
          style={S.input}
          value={peso}
          onChange={e => setPeso(e.target.value)}
          placeholder="Ej. 14"
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{ ...S.btn, flex: 1 }}
          onClick={() => nombre.trim() && onCrear(nombre.trim(), peso)}
          disabled={!nombre.trim()}
        >
          Guardar paciente
        </button>
        {onCancelar && (
          <button style={{ ...S.btnOutline, flex: 1 }} onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

function VistaRegistro({
  perfilActivo,
  mostrarForm,
  setMostrarForm,
  agregarRegistro,
  registrosDelPerfil,
  patrones,
  prefillMedicamento,
  onCrearPerfilPrimero
}) {
  if (!perfilActivo) {
    return (
      <div style={S.card}>
        <h2 style={S.h2}>No hay pacientes registrados</h2>
        <p style={{ fontSize: 13.5, color: COLORS.inkLight, marginBottom: 14 }}>
          Crea el perfil de tu hijo/a o carga el caso de demostración clínica para comenzar.
        </p>
        <button style={S.btn} onClick={onCrearPerfilPrimero}>+ Crear perfil de paciente</button>
      </div>
    );
  }

  return (
    <div>
      {/* Alerta de patrones clínicos detectados */}
      {patrones.length > 0 && (
        <div style={{ ...S.card, background: COLORS.alertBg, borderLeft: `4px solid ${COLORS.alert}`, padding: '12px 16px' }}>
          <h2 style={{ ...S.h2, fontSize: 14, color: COLORS.alert, margin: '0 0 6px' }}>
            ⚠️ Patrones Clínicos en {perfilActivo.nombre}:
          </h2>
          {patrones.map((p, i) => (
            <p key={i} style={{ fontSize: 13, margin: '3px 0', color: COLORS.ink }}>• {p.texto}</p>
          ))}
        </div>
      )}

      {/* Botón para nuevo registro o formulario activo */}
      {!mostrarForm ? (
        <button
          style={{ ...S.btn, width: '100%', padding: '14px 18px', fontSize: 15 }}
          onClick={() => setMostrarForm(true)}
          aria-label={`Nuevo registro para ${perfilActivo.nombre}`}
        >
          ➕ Nuevo Registro de {perfilActivo.nombre}
        </button>
      ) : (
        <NuevoRegistroForm
          key={prefillMedicamento ? `prefill-${prefillMedicamento.nombre}-${prefillMedicamento.dosis}` : 'form-nuevo'}
          onGuardar={agregarRegistro}
          onCancelar={() => setMostrarForm(false)}
          prefillMedicamento={prefillMedicamento}
          nombrePaciente={perfilActivo.nombre}
        />
      )}

      {/* Lista rápida de los últimos registros */}
      <div style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ ...S.h2, margin: 0 }}>Últimos registros</h2>
          <span style={{ fontSize: 12, color: COLORS.inkLight }}>{registrosDelPerfil.length} anotaciones</span>
        </div>

        {registrosDelPerfil.slice(0, 3).map(r => (
          <RegistroCard key={r.id} registro={r} />
        ))}

        {registrosDelPerfil.length === 0 && (
          <div style={{ ...S.card, textAlign: 'center', padding: 24, color: COLORS.inkLight }}>
            <p style={{ margin: 0, fontSize: 13.5 }}>No hay registros para {perfilActivo.nombre}. ¡Comienza anotando sus síntomas o temperatura!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NuevoRegistroForm({ onGuardar, onCancelar, prefillMedicamento, nombrePaciente }) {
  const [sintomas, setSintomas] = useState([]);
  const [fiebre, setFiebre] = useState(false);
  const [temperatura, setTemperatura] = useState('');
  const [nota, setNota] = useState('');
  const [foto, setFoto] = useState(null);
  const [medNombre, setMedNombre] = useState(() => prefillMedicamento?.nombre || '');
  const [medDosis, setMedDosis] = useState(() => prefillMedicamento?.dosis || '');
  const [medUnidad, setMedUnidad] = useState(() => prefillMedicamento?.unidad || 'ml');
  const [medIntervalo, setMedIntervalo] = useState(() => prefillMedicamento?.intervaloHoras ? String(prefillMedicamento.intervaloHoras) : '8');
  const [agregarMed, setAgregarMed] = useState(() => Boolean(prefillMedicamento));
  const fileRef = useRef(null);

  function toggleSintoma(s) {
    setSintomas(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function handleFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFoto({ data: reader.result, timestamp: new Date().toISOString() });
    reader.readAsDataURL(file);
  }

  function guardar() {
    const tieneContenido = sintomas.length > 0 || (fiebre && temperatura) || nota.trim() || foto || (agregarMed && medNombre.trim());
    if (!tieneContenido) {
      alert('Por favor selecciona al menos un síntoma, indica temperatura, anota una observación o agrega un medicamento.');
      return;
    }
    const registro = {
      fecha: new Date().toISOString(),
      sintomas,
      fiebre,
      temperatura: fiebre && temperatura ? temperatura.replace(',', '.') : '',
      nota: nota.trim(),
      foto,
      medicamento: agregarMed && medNombre.trim() ? {
        nombre: medNombre.trim(),
        dosis: medDosis.trim(),
        unidad: medUnidad,
        intervaloHoras: parseFloat(medIntervalo) || null,
        ultimaHora: new Date().toISOString(),
      } : null,
    };
    onGuardar(registro);
  }

  return (
    <div style={S.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ ...S.h2, margin: 0, fontSize: 16 }}>Anotar Síntomas de {nombrePaciente}</h2>
        <button
          onClick={onCancelar}
          style={{ background: 'none', border: 'none', color: COLORS.inkLight, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
          aria-label="Cerrar formulario"
        >
          ✕ Cancelar
        </button>
      </div>

      <label style={S.label}>Selecciona los síntomas observados:</label>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {SYMPTOM_OPTIONS.map(s => (
          <button
            type="button"
            key={s}
            style={S.chip(sintomas.includes(s))}
            onClick={() => toggleSintoma(s)}
            aria-pressed={sintomas.includes(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Fiebre */}
      <div style={{ background: COLORS.cream, borderRadius: 10, padding: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="chk-fiebre"
            checked={fiebre}
            onChange={e => setFiebre(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="chk-fiebre" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            🌡️ Tiene temperatura elevada / fiebre
          </label>
        </div>

        {fiebre && (
          <div style={{ marginTop: 10 }}>
            <label htmlFor="inp-temp" style={S.label}>Temperatura marcada en termómetro (°C)</label>
            <input
              id="inp-temp"
              style={{ ...S.input, fontSize: 16, fontWeight: 600 }}
              type="number"
              step="0.1"
              value={temperatura}
              onChange={e => setTemperatura(e.target.value)}
              placeholder="Ej. 38.5"
            />
          </div>
        )}
      </div>

      {/* Medicación */}
      <div style={{ background: '#F8F9FA', borderRadius: 10, padding: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="chk-med"
            checked={agregarMed}
            onChange={e => setAgregarMed(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="chk-med" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            💊 Administré un medicamento ahora
          </label>
        </div>

        {agregarMed && (
          <div style={{ marginTop: 10 }}>
            <label htmlFor="med-nombre" style={S.label}>Fármaco / Remedio</label>
            <input
              id="med-nombre"
              style={{ ...S.input, marginBottom: 8 }}
              value={medNombre}
              onChange={e => setMedNombre(e.target.value)}
              placeholder="Ej. Paracetamol Jarabe 120mg/5ml"
            />
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="med-dosis" style={S.label}>Dosis administrada</label>
                <input
                  id="med-dosis"
                  style={S.input}
                  type="number"
                  step="0.1"
                  value={medDosis}
                  onChange={e => setMedDosis(e.target.value)}
                  placeholder="Ej. 5"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="med-unidad" style={S.label}>Unidad</label>
                <select
                  id="med-unidad"
                  style={S.input}
                  value={medUnidad}
                  onChange={e => setMedUnidad(e.target.value)}
                >
                  {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <label htmlFor="med-intervalo" style={S.label}>Cada cuántas horas se repite (Intervalo)</label>
            <input
              id="med-intervalo"
              style={S.input}
              type="number"
              value={medIntervalo}
              onChange={e => setMedIntervalo(e.target.value)}
              placeholder="Ej. 6 u 8"
            />
          </div>
        )}
      </div>

      {/* Nota libre */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="reg-nota" style={S.label}>Observaciones o notas adicionales</label>
        <textarea
          id="reg-nota"
          style={{ ...S.input, minHeight: 65, resize: 'vertical' }}
          value={nota}
          onChange={e => setNota(e.target.value)}
          placeholder="¿Comió bien? ¿Está decaído o irritable? ¿Alguna erupción?"
        />
      </div>

      {/* Foto opcional */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="reg-foto" style={S.label}>Foto opcional (útil para erupciones en la piel)</label>
        <input
          id="reg-foto"
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFoto}
          style={{ fontSize: 13 }}
        />
        {foto && (
          <img src={foto.data} alt="Foto del registro" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ ...S.btn, flex: 2 }} onClick={guardar}>
          💾 Guardar registro
        </button>
        <button style={{ ...S.btnOutline, flex: 1 }} onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function RegistroCard({ registro }) {
  const proximaDosis = registro.medicamento ? calcularProximaDosis(registro.medicamento) : null;
  const tempNum = parseFloat(registro.temperatura);

  return (
    <article style={S.card} aria-label={`Registro del ${formatFecha(registro.fecha)}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 12.5, color: COLORS.inkLight }}>🕒 {formatFecha(registro.fecha)}</span>
        {registro.fiebre && registro.temperatura && (
          <span style={{
            fontSize: 13.5,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 6,
            background: tempNum >= 38 ? COLORS.alertBg : '#E8F5E9',
            color: tempNum >= 38 ? COLORS.alert : '#2E7D32',
          }}>
            🌡️ {registro.temperatura}°C
          </span>
        )}
      </div>

      {registro.sintomas && registro.sintomas.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', margin: '8px 0' }}>
          {registro.sintomas.map(s => (
            <span key={s} style={{
              fontSize: 11.5,
              background: COLORS.cream,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: '2px 8px',
              color: COLORS.ink
            }}>
              {s}
            </span>
          ))}
        </div>
      )}

      {registro.nota && (
        <p style={{ fontSize: 13.5, margin: '6px 0', color: COLORS.ink, lineHeight: 1.4 }}>
          {registro.nota}
        </p>
      )}

      {registro.foto && (
        <img src={registro.foto.data} alt="Foto adjunta al registro" style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, marginTop: 6 }} />
      )}

      {registro.medicamento && (
        <div style={{
          marginTop: 8,
          fontSize: 12.5,
          color: COLORS.sageDark,
          background: '#F9EDE9',
          borderRadius: 8,
          padding: '7px 10px',
          borderLeft: `3px solid ${COLORS.sage}`
        }}>
          <strong>💊 {registro.medicamento.nombre}:</strong> {registro.medicamento.dosis} {registro.medicamento.unidad}
          {proximaDosis && (
            <div style={{ marginTop: 2, fontSize: 11.5, color: COLORS.inkLight }}>
              ⏰ Próxima toma sugerida: <strong>{formatFecha(proximaDosis.toISOString())}</strong>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function VistaHistorial({ perfilActivo, registrosDelPerfil, eliminarRegistro, onVerResumen }) {
  if (!perfilActivo) {
    return <div style={S.card}><p style={{ margin: 0, color: COLORS.inkLight }}>Selecciona o crea un paciente para revisar su historial.</p></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ ...S.h2, margin: 0 }}>Historial Clínico: {perfilActivo.nombre}</h2>
        <span style={{ fontSize: 12, color: COLORS.inkLight }}>{registrosDelPerfil.length} eventos</span>
      </div>

      {/* Botón para generar resumen médico en 30 segundos */}
      {onVerResumen && (
        <button
          style={{
            ...S.btnTerracotta,
            width: '100%',
            marginBottom: 14,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 2px 6px rgba(242, 166, 90, 0.25)'
          }}
          onClick={onVerResumen}
          aria-label="Generar resumen para el médico pediatra"
        >
          <span style={{ fontSize: 18 }}>📋</span>
          <span>Generar Resumen Médico Pediátrico (30 Segundos)</span>
        </button>
      )}

      {/* Gráfica interactiva si hay registros con temperatura */}
      <div style={S.card}>
        <h3 style={{ ...S.h2, fontSize: 14, marginBottom: 8, color: COLORS.ink }}>
          📈 Curva Térmica Vectorial SVG (Evolución de la Fiebre)
        </h3>
        <GraficaTemperatura registros={registrosDelPerfil} />
      </div>

      {/* Listado completo con opción de eliminación */}
      <h3 style={{ ...S.h2, fontSize: 15, marginTop: 20, marginBottom: 10 }}>Cronología de eventos</h3>
      {registrosDelPerfil.map(r => (
        <div key={r.id} style={{ position: 'relative' }}>
          <RegistroCard registro={r} />
          <button
            onClick={() => eliminarRegistro(r.id)}
            style={{
              position: 'absolute', top: 12, right: 12, background: 'none', border: 'none',
              color: COLORS.inkLight, fontSize: 11.5, cursor: 'pointer', textDecoration: 'underline'
            }}
            aria-label="Eliminar este registro"
          >
            eliminar
          </button>
        </div>
      ))}

      {registrosDelPerfil.length === 0 && (
        <p style={{ fontSize: 13.5, color: COLORS.inkLight, textAlign: 'center', padding: 20 }}>
          No hay registros clínicos guardados para {perfilActivo.nombre}.
        </p>
      )}
    </div>
  );
}

// ---------- Calculadora Canónica de Dosis por Peso ----------
function VistaCalculadoraDosis({ perfilActivo, onTransferirDosis }) {
  const [farmaco, setFarmaco] = useState('paracetamol'); // paracetamol | ibuprofeno
  const [pesoKg, setPesoKg] = useState(() => perfilActivo?.pesoKg ? String(perfilActivo.pesoKg) : '14');
  const [presentacion, setPresentacion] = useState('jarabe120');

  const PRESENTACIONES = {
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

  const listaPres = PRESENTACIONES[farmaco];
  const presActual = listaPres.find(p => p.id === presentacion) || listaPres[0];

  const pKg = Math.max(1, parseFloat(pesoKg) || 0);

  // Paracetamol: 10 a 15 mg/kg cada 6-8h. Máx 60 mg/kg/día.
  // Ibuprofeno: 5 a 10 mg/kg cada 8h. Máx 40 mg/kg/día. (>6 meses)
  const calculo = useMemo(() => {
    if (farmaco === 'paracetamol') {
      const minMg = (pKg * 10).toFixed(1);
      const recMg = (pKg * 12.5).toFixed(1);
      const maxMg = (pKg * 15).toFixed(1);
      const mlPorToma = (recMg / presActual.mgPorMl).toFixed(1);
      const gotasPorToma = Math.round(recMg / (presActual.mgPorMl / 24)); // aprox 24 gotas = 1 ml
      return {
        rangoMg: `${minMg} - ${maxMg} mg`,
        dosisSugeridaMg: recMg,
        dosisMl: mlPorToma,
        dosisGotas: gotasPorToma,
        intervalo: 'Cada 6 a 8 horas (máximo 4 tomas al día)',
        aviso: 'Dosis máxima segura: 60 mg/kg en 24 horas. Usar siempre jeringa graduada.',
      };
    } else {
      const minMg = (pKg * 5).toFixed(1);
      const recMg = (pKg * 7.5).toFixed(1);
      const maxMg = (pKg * 10).toFixed(1);
      const mlPorToma = (recMg / presActual.mgPorMl).toFixed(1);
      const gotasPorToma = Math.round(recMg / (presActual.mgPorMl / 24));
      return {
        rangoMg: `${minMg} - ${maxMg} mg`,
        dosisSugeridaMg: recMg,
        dosisMl: mlPorToma,
        dosisGotas: gotasPorToma,
        intervalo: 'Cada 8 horas (máximo 3 tomas al día)',
        aviso: '⚠️ Solo para niños mayores de 6 meses o más de 5 kg de peso. No usar si hay deshidratación severa sin supervisión médica.',
      };
    }
  }, [farmaco, pKg, presActual]);

  function aplicarARegistro() {
    onTransferirDosis({
      nombre: `${farmaco === 'paracetamol' ? 'Paracetamol' : 'Ibuprofeno'} (${presActual.nombre})`,
      dosis: presActual.esGotas ? String(calculo.dosisGotas) : String(calculo.dosisMl),
      unidad: presActual.esGotas ? 'gotas' : 'ml',
      intervaloHoras: farmaco === 'paracetamol' ? 8 : 8,
    });
  }

  return (
    <div>
      <div style={S.card}>
        <h2 style={{ ...S.h2, fontSize: 17, marginBottom: 4 }}>
          ⚖️ Calculadora Pediátrica de Dosis por Peso
        </h2>
        <p style={{ fontSize: 13, color: COLORS.inkLight, margin: '0 0 16px', lineHeight: 1.5 }}>
          La dosis pediátrica exacta se calcula estrictamente por el <strong>peso real en kg</strong>, no por la edad.
        </p>

        {/* Selector de Fármaco */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button
            style={{
              ...S.btn,
              flex: 1,
              background: farmaco === 'paracetamol' ? COLORS.sage : COLORS.white,
              color: farmaco === 'paracetamol' ? COLORS.white : COLORS.ink,
              border: `1.5px solid ${COLORS.sage}`,
            }}
            onClick={() => { setFarmaco('paracetamol'); setPresentacion('jarabe120'); }}
          >
            🌡️ Paracetamol
          </button>
          <button
            style={{
              ...S.btn,
              flex: 1,
              background: farmaco === 'ibuprofeno' ? COLORS.sage : COLORS.white,
              color: farmaco === 'ibuprofeno' ? COLORS.white : COLORS.ink,
              border: `1.5px solid ${COLORS.sage}`,
            }}
            onClick={() => { setFarmaco('ibuprofeno'); setPresentacion('jarabe100'); }}
          >
            🔥 Ibuprofeno
          </button>
        </div>

        {/* Input de Peso */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label htmlFor="calc-peso" style={{ ...S.label, margin: 0 }}>Peso del niño/a (en kilogramos):</label>
            <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.sageDark }}>{pKg} kg</span>
          </div>
          <input
            id="calc-peso"
            type="number"
            step="0.5"
            min="2"
            max="60"
            style={{ ...S.input, fontSize: 16, fontWeight: 600 }}
            value={pesoKg}
            onChange={e => setPesoKg(e.target.value)}
          />
          <input
            type="range"
            min="3"
            max="40"
            step="0.5"
            value={pKg}
            onChange={e => setPesoKg(e.target.value)}
            style={{ width: '100%', marginTop: 8, accentColor: COLORS.sage, cursor: 'pointer' }}
            aria-label="Selector deslizante de peso en kg"
          />
        </div>

        {/* Selector de Presentación Farmacéutica */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="calc-pres" style={S.label}>Presentación comercial del envase:</label>
          <select
            id="calc-pres"
            style={S.input}
            value={presentacion}
            onChange={e => setPresentacion(e.target.value)}
          >
            {listaPres.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        {/* Resultado Destacado */}
        <div style={{
          background: '#FFF4EE',
          border: `2px solid ${COLORS.sageLight}`,
          borderRadius: 14,
          padding: 16,
          marginBottom: 16,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 12, color: COLORS.sageDark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Dosis Recomendada por Toma
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.sageDark, margin: '6px 0' }}>
            {presActual.esGotas ? `${calculo.dosisGotas} gotas` : `${calculo.dosisMl} ml`}
          </div>
          <div style={{ fontSize: 13, color: COLORS.ink, fontWeight: 600 }}>
            Equivalente a ≈ {calculo.dosisSugeridaMg} mg ({calculo.rangoMg})
          </div>
          <div style={{ fontSize: 12, color: COLORS.inkLight, marginTop: 4 }}>
            🕒 {calculo.intervalo}
          </div>
        </div>

        <div style={{
          background: farmaco === 'ibuprofeno' ? COLORS.alertBg : '#F4F5F7',
          borderLeft: `3px solid ${farmaco === 'ibuprofeno' ? COLORS.alert : COLORS.inkLight}`,
          padding: '10px 12px',
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 12,
          lineHeight: 1.4,
          color: COLORS.ink
        }}>
          {calculo.aviso}
        </div>

        <button
          style={{ ...S.btn, width: '100%', padding: '12px 16px' }}
          onClick={aplicarARegistro}
        >
          📋 Registrar esta dosis en la bitácora de {perfilActivo?.nombre || 'paciente'}
        </button>
      </div>
    </div>
  );
}

function VistaGuia() {
  return (
    <div>
      <div style={{ ...S.card, background: '#F4F3EE', marginBottom: 14, borderLeft: `4px solid ${COLORS.terracotta}` }}>
        <p style={{ fontSize: 13, color: COLORS.ink, margin: 0, lineHeight: 1.5 }}>
          📖 <strong>Guía Pediátrica de Banderas Rojas:</strong> Diseñada con lineamientos de la Academia Americana de Pediatría (AAP) y guías clínicas para orientar a padres en situaciones críticas. No sustituye la evaluación médica presencial.
        </p>
      </div>

      {GUIA_EDUCATIVA.map((seccion, i) => (
        <div key={i} style={{
          ...S.card,
          borderLeft: `4px solid ${seccion.nivel === 'alerta' ? COLORS.alert : seccion.nivel === 'observar' ? COLORS.terracotta : COLORS.emerald}`,
        }}>
          <h2 style={{ ...S.h2, fontSize: 15, color: seccion.nivel === 'alerta' ? COLORS.alert : COLORS.ink }}>
            {seccion.titulo}
          </h2>
          {seccion.items.map((item, j) => (
            <p key={j} style={{ fontSize: 13, margin: '6px 0', color: COLORS.ink, lineHeight: 1.5 }}>
              • {item}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

function VistaResumen({ perfilActivo, registrosDelPerfil, patrones, onVolver }) {
  const [copiado, setCopiado] = useState(false);

  const textoResumen = useMemo(() => {
    const nombre = perfilActivo?.nombre || 'Paciente';
    let texto = `📋 RESUMEN CLÍNICO PEDIÁTRICO — ${nombre}\n`;
    texto += `Generado el ${new Date().toLocaleDateString('es-CL')} con HiDoctor\n`;
    texto += `----------------------------------------\n\n`;

    if (patrones.length > 0) {
      texto += `PATRONES OBSERVADOS:\n`;
      patrones.forEach(p => { texto += `• ${p.texto}\n`; });
      texto += `\n`;
    }

    texto += `CRONOLOGÍA DE REGISTROS (${registrosDelPerfil.length}):\n`;
    registrosDelPerfil.slice().reverse().forEach(r => {
      texto += `\n📅 ${formatFecha(r.fecha)}\n`;
      if (r.temperatura) texto += `   Temperatura: ${r.temperatura}°C\n`;
      if (r.sintomas && r.sintomas.length) texto += `   Síntomas: ${r.sintomas.join(', ')}\n`;
      if (r.medicamento) texto += `   Medicación: ${r.medicamento.nombre} (${r.medicamento.dosis} ${r.medicamento.unidad})\n`;
      if (r.nota) texto += `   Nota: ${r.nota}\n`;
    });

    return texto;
  }, [perfilActivo, registrosDelPerfil, patrones]);

  function fallbackCopiar(texto) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = texto;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // sin fallo
    }
  }

  function copiar() {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textoResumen).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }).catch(() => fallbackCopiar(textoResumen));
    } else {
      fallbackCopiar(textoResumen);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ ...S.h2, margin: 0 }}>Resumen para el Médico Pediatra</h2>
        {onVolver && (
          <button style={S.btnOutline} onClick={onVolver} aria-label="Volver al historial clínico">
            ← Volver
          </button>
        )}
      </div>

      <p style={{ fontSize: 13.5, color: COLORS.inkLight, marginBottom: 14 }}>
        Coloca la pantalla de tu móvil en manos del pediatra en la consulta o copia el texto estructurado:
      </p>

      <div style={{
        ...S.card,
        whiteSpace: 'pre-wrap',
        fontSize: 12.5,
        fontFamily: 'monospace',
        background: '#FAF8F5',
        lineHeight: 1.6,
        maxHeight: 320,
        overflowY: 'auto'
      }}>
        {textoResumen}
      </div>

      <button style={{ ...S.btnTerracotta, width: '100%', marginTop: 8 }} onClick={copiar}>
        {copiado ? '✓ ¡Resumen Copiado al Portapapeles!' : '📋 Copiar Resumen para WhatsApp o Pediatra'}
      </button>
    </div>
  );
}

function VistaAyuda({ contactos, agregarContacto, eliminarContacto, paisSeleccionado, setPaisSeleccionado }) {
  const [mostrarFormContacto, setMostrarFormContacto] = useState(false);
  const [clinicasCercanas, setClinicasCercanas] = useState([]);
  const [buscandoCercanas, setBuscandoCercanas] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState('');

  const numerosActuales = NUMEROS_EMERGENCIA[paisSeleccionado] || [];

  function buscarCercanos() {
    setBuscandoCercanas(true);
    setErrorUbicacion('');
    setClinicasCercanas([]);

    if (!navigator.geolocation) {
      setErrorUbicacion('Tu navegador no soporta geolocalización.');
      setBuscandoCercanas(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const query = `[out:json][timeout:10];(node["amenity"="hospital"](around:5000,${latitude},${longitude});node["amenity"="clinic"](around:5000,${latitude},${longitude});node["amenity"="pharmacy"](around:5000,${latitude},${longitude});node["amenity"="doctors"](around:5000,${latitude},${longitude}););out body;`;

        fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
          .then(r => r.json())
          .then(result => {
            const resultados = (result.elements || [])
              .filter(e => e.tags && e.tags.name)
              .map(e => ({
                nombre: e.tags.name,
                tipo: e.tags.amenity || 'salud',
                telefono: e.tags.phone || e.tags['contact:phone'] || null,
                direccion: e.tags['addr:street']
                  ? `${e.tags['addr:street']} ${e.tags['addr:housenumber'] || ''}`.trim()
                  : null,
                lat: e.lat,
                lon: e.lon,
                distancia: calcularDistancia(latitude, longitude, e.lat, e.lon),
              }))
              .sort((a, b) => a.distancia - b.distancia)
              .slice(0, 15);
            setClinicasCercanas(resultados);
            setBuscandoCercanas(false);
          })
          .catch(() => {
            setErrorUbicacion('No se pudieron obtener resultados geodésicos en este momento.');
            setBuscandoCercanas(false);
          });
      },
      () => {
        setErrorUbicacion('No se pudo acceder a tu ubicación GPS. Revisa los permisos de ubicación en tu navegador.');
        setBuscandoCercanas(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  return (
    <div>
      {/* Mensaje tranquilizador */}
      <div style={{ ...S.card, background: '#EEF3EE', borderLeft: `4px solid ${COLORS.emerald}`, marginBottom: 16 }}>
        <p style={{ fontSize: 13.5, color: COLORS.ink, margin: 0, lineHeight: 1.6 }}>
          💚 <strong>Respira hondo y mantén la calma.</strong> Aquí tienes los números oficiales de urgencia médica y tus contactos pediátricos directos.
        </p>
      </div>

      {/* Selector de país */}
      <h2 style={S.h2}>Directorio de Urgencias Multipaís</h2>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="sel-pais" style={S.label}>Selecciona tu país:</label>
        <select
          id="sel-pais"
          style={S.input}
          value={paisSeleccionado}
          onChange={e => setPaisSeleccionado(e.target.value)}
        >
          {Object.keys(NUMEROS_EMERGENCIA).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {numerosActuales.map((n, i) => (
        <a
          key={i}
          href={`tel:${n.numero}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
            ...S.card, textDecoration: 'none', color: COLORS.ink,
            background: n.tipo === 'emergencia' ? COLORS.alertBg : COLORS.white,
            borderLeft: n.tipo === 'emergencia' ? `4px solid ${COLORS.alert}` : `4px solid ${COLORS.emerald}`,
          }}
          aria-label={`Llamar a ${n.nombre}`}
        >
          <div style={{ fontSize: 24 }}>{n.tipo === 'emergencia' ? '🚨' : '📞'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{n.nombre}</div>
            <div style={{ fontSize: 13.5, color: COLORS.inkLight, fontWeight: 600 }}>{n.display}</div>
          </div>
          <div style={{ ...S.btnTerracotta, padding: '7px 14px', fontSize: 13, borderRadius: 8 }}>Llamar</div>
        </a>
      ))}

      {/* Mis contactos guardados */}
      <h2 style={{ ...S.h2, marginTop: 24 }}>Contactos Pediátricos Guardados</h2>
      {contactos.map(c => (
        <div key={c.id} style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: COLORS.sageDark, fontWeight: 700, textTransform: 'uppercase' }}>
                {TIPOS_CONTACTO[c.tipo] || TIPOS_CONTACTO.otro}
              </span>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 2 }}>{c.nombre}</div>
              {c.telefono && <div style={{ fontSize: 13, color: COLORS.inkLight, marginTop: 2 }}>📞 {c.telefono}</div>}
              {c.direccion && <div style={{ fontSize: 12.5, color: COLORS.inkLight, marginTop: 2 }}>📍 {c.direccion}</div>}
              {c.nota && <div style={{ fontSize: 12, color: COLORS.inkLight, marginTop: 2, fontStyle: 'italic' }}>{c.nota}</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 8 }}>
              {c.telefono && (
                <a href={`tel:${c.telefono}`} style={{ ...S.btn, padding: '6px 12px', fontSize: 12, textDecoration: 'none' }}>
                  Llamar
                </a>
              )}
              <button
                onClick={() => eliminarContacto(c.id)}
                style={{ background: 'none', border: 'none', color: COLORS.inkLight, fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
              >
                eliminar
              </button>
            </div>
          </div>
        </div>
      ))}

      {!mostrarFormContacto ? (
        <button style={{ ...S.btnOutline, width: '100%', marginBottom: 20 }} onClick={() => setMostrarFormContacto(true)}>
          + Agregar Nuevo Contacto
        </button>
      ) : (
        <ContactoForm
          onGuardar={(c) => { agregarContacto(c); setMostrarFormContacto(false); }}
          onCancelar={() => setMostrarFormContacto(false)}
        />
      )}

      {/* Centros de salud cercanos */}
      <h2 style={{ ...S.h2, marginTop: 20 }}>Centros de Salud Cercanos (GPS)</h2>
      <button
        style={{ ...S.btn, width: '100%', opacity: buscandoCercanas ? 0.7 : 1 }}
        onClick={buscarCercanos}
        disabled={buscandoCercanas}
      >
        {buscandoCercanas ? '⏳ Buscando centros de urgencia…' : '📍 Localizar Hospitales y Farmacias Cercanos'}
      </button>

      {errorUbicacion && (
        <div style={{ ...S.card, background: COLORS.alertBg, borderLeft: `4px solid ${COLORS.alert}`, marginTop: 12 }}>
          <p style={{ fontSize: 13, color: COLORS.ink, margin: 0 }}>{errorUbicacion}</p>
        </div>
      )}

      {clinicasCercanas.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {clinicasCercanas.map((c, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{c.nombre}</div>
              <div style={{ fontSize: 12, color: COLORS.sageDark, fontWeight: 600 }}>
                {TIPOS_LUGAR[c.tipo] || '🏥 Centro de salud'} · {c.distancia < 1 ? `${(c.distancia * 1000).toFixed(0)} m` : `${c.distancia.toFixed(1)} km`}
              </div>
              {c.direccion && <div style={{ fontSize: 12.5, color: COLORS.inkLight, marginTop: 2 }}>📍 {c.direccion}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {c.telefono && (
                  <a href={`tel:${c.telefono}`} style={{ ...S.btn, padding: '6px 12px', fontSize: 12, textDecoration: 'none', flex: 1, textAlign: 'center' }}>
                    📞 Llamar
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...S.btnOutline, padding: '6px 12px', fontSize: 12, textDecoration: 'none', flex: 1, textAlign: 'center' }}
                >
                  🗺️ Cómo llegar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactoForm({ onGuardar, onCancelar }) {
  const [tipo, setTipo] = useState('pediatra');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [nota, setNota] = useState('');

  function guardar() {
    if (!nombre.trim()) return;
    onGuardar({
      tipo,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      nota: nota.trim(),
    });
  }

  return (
    <div style={{ ...S.card, marginBottom: 20 }}>
      <h3 style={{ ...S.h2, fontSize: 15 }}>Nuevo Contacto Médico</h3>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="c-tipo" style={S.label}>Tipo de contacto</label>
        <select id="c-tipo" style={S.input} value={tipo} onChange={e => setTipo(e.target.value)}>
          {Object.entries(TIPOS_CONTACTO).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="c-nombre" style={S.label}>Nombre completo o institución</label>
        <input id="c-nombre" style={S.input} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Dr. Carlos Ruiz" />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="c-tel" style={S.label}>Teléfono de contacto</label>
        <input id="c-tel" style={S.input} type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej. +56 9 1234 5678" />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="c-dir" style={S.label}>Dirección (opcional)</label>
        <input id="c-dir" style={S.input} value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Ej. Av. Providencia 1234" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="c-nota" style={S.label}>Nota u horario (opcional)</label>
        <input id="c-nota" style={S.input} value={nota} onChange={e => setNota(e.target.value)} placeholder="Ej. Horario de urgencias" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ ...S.btn, flex: 1 }} onClick={guardar} disabled={!nombre.trim()}>Guardar</button>
        <button style={{ ...S.btnOutline, flex: 1 }} onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}

// ---------- Asistente Doctor IA Pediátrico & Triaje Clínico Dual ----------
function generarRespuestaOffline(pregunta, perfilActivo, registrosDelPerfil, patrones) {
  const p = (pregunta || '').toLowerCase();
  const nombre = perfilActivo?.nombre || 'el niño/a';
  const ultimosRegistros = registrosDelPerfil?.slice(0, 3) || [];
  const ultimaTemp = ultimosRegistros.find(r => r.temperatura)?.temperatura;
  const sintomasRecientes = Array.from(new Set(ultimosRegistros.flatMap(r => r.sintomas || [])));

  let respuesta;
  let esAlerta = false;

  if (p.includes('respir') || p.includes('silb') || p.includes('ahog') || p.includes('tiraje') || p.includes('pecho')) {
    esAlerta = true;
    respuesta = `🚨 ATENCIÓN INMEDIATA — SIGNOS RESPIRATORIOS CRÍTICOS\n\nSi notas que ${nombre} presenta:\n• Hundimiento de costillas o hueco de la garganta al respirar (tiraje).\n• Respiración agitada, muy rápida o silbidos en el pecho.\n• Color azulado o pálido en labios o uñas.\n\n👉 ACUDE DE INMEDIATO A URGENCIAS o llama al servicio de emergencias de tu país (Pestaña 🆘 Ayuda).`;
  } else if (p.includes('fiebre') || p.includes('temperatura') || p.includes('calentur') || p.includes('38') || p.includes('39') || p.includes('40')) {
    const tempTexto = ultimaTemp ? ` (Última temperatura de ${nombre}: ${ultimaTemp}°C)` : '';
    if (parseFloat(ultimaTemp || 0) >= 39.5 || p.includes('40')) esAlerta = true;

    respuesta = `🌡️ Manejo Seguro de la Fiebre Pediátrica${tempTexto}\n\n1. Medidas de confort:\n• Viste a ${nombre} con ropa ligera de algodón.\n• No uses baños de agua fría ni alcohol (provocan temblores y vasoconstricción).\n• Ofrece líquidos con frecuencia en pequeños sorbos.\n2. Dosis por Peso:\n• El paracetamol e ibuprofeno se calculan por los kg de peso (revisa la pestaña 💊 Dosis).\n3. 🚨 Acude a Urgencias si:\n• Bebé menor de 3 meses con 38°C o más.\n• Fiebre que no cede tras 72 horas o manchas que no desaparecen al presionar con un vaso.`;
  } else if (p.includes('vomit') || p.includes('diarrea') || p.includes('deshidrat') || p.includes('suero')) {
    respuesta = `💧 Hidratación y Control Gastrointestinal\n\nPara ${nombre}, la prioridad es evitar la deshidratación:\n1. Ofrece Solución de Rehidratación Oral (SRO) en pequeñas dosis: 1 cucharadita (5 ml) cada 5-10 minutos.\n2. Evita jugos industriales o gaseosas.\n3. 🚨 Banderas Rojas:\n• Llanto sin lágrimas.\n• Boca y lengua secas.\n• Más de 6-8 horas sin mojar el pañal u orina muy oscura.`;
  } else if (p.includes('dosis') || p.includes('paracetamol') || p.includes('ibuprofeno') || p.includes('jarabe')) {
    respuesta = `💊 Dosificación Pediátrica Segura\n\nEn pediatría, las dosis dependen estrictamente del peso real del niño en kilogramos, nunca de la edad.\n\nPuedes calcular los mililitros exactos para ${nombre} en nuestra pestaña 💊 Dosis con las presentaciones comerciales de gotas y jarabe.`;
  } else {
    respuesta = `📋 Orientación Pediátrica para ${nombre}\n\nAntecedentes en su bitácora:\n${sintomasRecientes.length > 0 ? `• Síntomas recientes: ${sintomasRecientes.join(', ')}` : '• Sin síntomas graves registrados.'}\n${ultimaTemp ? `• Última temperatura: ${ultimaTemp}°C` : ''}\n${patrones.length > 0 ? `• Patrones detectados: ${patrones.map(pat => pat.texto).join('; ')}\n` : ''}\nRecomendaciones:\n1. Mantén a ${nombre} hidratado y en reposo cómodo.\n2. Continúa registrando la evolución en HiDoctor para que el médico tenga la cronología exacta.\n3. Si notas dificultad para respirar, letargo o fiebre alta continua, acude a urgencias.`;
  }

  return { texto: respuesta, esAlerta };
}

function VistaAsistenteIA({ perfilActivo, registrosDelPerfil, patrones }) {
  const [mensajes, setMensajes] = useState([
    {
      id: 'init-1',
      emisor: 'asistente',
      texto: `👋 ¡Hola! Soy tu Doctor IA, asistente de triaje pediátrico de HiDoctor.\n\nEstoy aquí para orientarte ante síntomas de ${perfilActivo?.nombre || 'tu hijo/a'}, identificar señales de alarma y preparar la consulta médica.\n\n¿Qué síntomas observas en este momento?`,
      hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      esAlerta: false,
    }
  ]);
  const [inputTexto, setInputTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarConfigKey, setMostrarConfigKey] = useState(false);
  const [customKey, setCustomKey] = useState(() => {
    try { return window.localStorage.getItem('hidoctor_gemini_api_key') || ''; } catch { return ''; }
  });
  const mensajesEndRef = useRef(null);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  const ultimosSintomas = useMemo(() => {
    const todos = registrosDelPerfil.flatMap(r => r.sintomas || []);
    return Array.from(new Set(todos)).slice(0, 4);
  }, [registrosDelPerfil]);

  const ultimaTemp = useMemo(() => {
    const conT = registrosDelPerfil.find(r => r.temperatura);
    return conT ? conT.temperatura : null;
  }, [registrosDelPerfil]);

  async function enviarPregunta(texto) {
    const consulta = (texto || inputTexto).trim();
    if (!consulta || cargando) return;

    const userMsg = {
      id: uid(),
      emisor: 'user',
      texto: consulta,
      hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    };

    setMensajes(prev => [...prev, userMsg]);
    setInputTexto('');
    setCargando(true);

    const apiKey = customKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';

    // Intento con Gemini API (timeout estricto 8.000 ms per standard)
    if (apiKey) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const promptSistema = `Eres el Asistente Pediátrico de HiDoctor.
Paciente: ${perfilActivo?.nombre || 'Niño/a'}, peso: ${perfilActivo?.pesoKg || 14} kg.
Última temperatura: ${ultimaTemp ? ultimaTemp + '°C' : 'Sin registro'}.
Síntomas: ${ultimosSintomas.join(', ') || 'Ninguno reciente'}.
Patrones: ${patrones.map(p => p.texto).join('; ') || 'Ninguno'}.
Instrucciones:
1. Responde en español empático, claro y breve (<200 palabras).
2. Si hay signos de riesgo vital (dificultad respiratoria, somnolencia extrema, fiebre >40°C, manchas rojas fijas), indícalo en el primer párrafo en MAYÚSCULAS y aconseja urgencias.
3. Este asistente orienta pero no reemplaza la atención médica.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { parts: [{ text: promptSistema }, { text: `Consulta de los padres: ${consulta}` }] }
              ]
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const resData = await response.json();
          const respuestaTexto = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (respuestaTexto) {
            setMensajes(prev => [
              ...prev,
              {
                id: uid(),
                emisor: 'asistente',
                texto: respuestaTexto,
                fuente: '⚡ Gemini IA',
                hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
                esAlerta: respuestaTexto.includes('URGENCIAS') || respuestaTexto.includes('🚨'),
              }
            ]);
            setCargando(false);
            return;
          }
        }
      } catch {
        // Fallback inmediato a simulación guiada
      }
    }

    // Fallback autónomo offline de triaje
    setTimeout(() => {
      const { texto: respuestaOffline, esAlerta } = generarRespuestaOffline(
        consulta,
        perfilActivo,
        registrosDelPerfil,
        patrones
      );
      setMensajes(prev => [
        ...prev,
        {
          id: uid(),
          emisor: 'asistente',
          texto: respuestaOffline,
          fuente: '🛡️ Triaje Experto Offline',
          hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
          esAlerta,
        }
      ]);
      setCargando(false);
    }, 400);
  }

  function guardarApiKey(key) {
    setCustomKey(key);
    try { window.localStorage.setItem('hidoctor_gemini_api_key', key); } catch {}
    setMostrarConfigKey(false);
  }

  const SUGERENCIAS = [
    '🌡️ ¿Cómo bajar una fiebre de más de 38.5°C?',
    '🚨 ¿Cuáles son los signos de alarma para ir a urgencias?',
    '💧 Signos de deshidratación por vómitos o diarrea',
    '💨 Dificultad para respirar y silbidos',
    '💊 ¿Cómo se calculan las dosis de medicamentos?',
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ ...S.h2, margin: 0 }}>🤖 Doctor IA — Triaje & Soporte</h2>
        <button
          onClick={() => setMostrarConfigKey(!mostrarConfigKey)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
          title="Configurar Gemini API Key"
          aria-label="Configuración de clave API de Gemini"
        >
          ⚙️
        </button>
      </div>

      {mostrarConfigKey && (
        <div style={{ ...S.card, background: COLORS.cream, border: `1.5px dashed ${COLORS.sage}`, marginBottom: 12 }}>
          <label htmlFor="gemini-key" style={S.label}>Google Gemini API Key (Opcional)</label>
          <p style={{ fontSize: 12, color: COLORS.inkLight, margin: '0 0 8px' }}>
            Si deseas conectar IA en vivo, ingresa tu clave. De lo contrario, HiDoctor opera con su base de triaje pediátrico offline 100% autónoma.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="gemini-key"
              type="password"
              style={S.input}
              placeholder="AIzaSy..."
              value={customKey}
              onChange={e => setCustomKey(e.target.value)}
            />
            <button style={S.btn} onClick={() => guardarApiKey(customKey)}>Guardar</button>
          </div>
        </div>
      )}

      {/* Chip de contexto del paciente */}
      <div style={{
        ...S.card,
        padding: '10px 14px',
        marginBottom: 10,
        background: '#FAF5EE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 6
      }}>
        <div style={{ fontSize: 12.5, color: COLORS.ink }}>
          🧒 <strong>{perfilActivo?.nombre}</strong>
          {ultimaTemp && <span> · 🌡️ {ultimaTemp}°C</span>}
          {ultimosSintomas.length > 0 && <span> · 📋 {ultimosSintomas.join(', ')}</span>}
        </div>
        <div style={{ fontSize: 11, color: COLORS.sageDark, fontWeight: 700 }}>
          {customKey ? '🟢 Gemini Conectado' : '🛡️ Triaje Clínico Autónomo'}
        </div>
      </div>

      {/* Caja de mensajes */}
      <div style={{
        ...S.card,
        padding: 12,
        minHeight: 280,
        maxHeight: 380,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {mensajes.map(m => (
          <div
            key={m.id}
            style={{
              alignSelf: m.emisor === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              background: m.emisor === 'user'
                ? COLORS.sage
                : (m.esAlerta ? '#FFF0F0' : COLORS.white),
              color: m.emisor === 'user' ? COLORS.white : COLORS.ink,
              border: m.emisor === 'user'
                ? 'none'
                : `1px solid ${m.esAlerta ? COLORS.alert : COLORS.border}`,
              borderRadius: m.emisor === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              padding: '10px 13px',
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: 'pre-line'
            }}
          >
            {m.texto}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 6,
              fontSize: 9.5,
              opacity: 0.8,
              color: m.emisor === 'user' ? COLORS.white : COLORS.inkLight
            }}>
              <span>{m.fuente || (m.emisor === 'user' ? 'Tú' : 'Doctor IA')}</span>
              <span>{m.hora}</span>
            </div>
          </div>
        ))}

        {cargando && (
          <div style={{
            alignSelf: 'flex-start',
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '14px 14px 14px 2px',
            padding: '8px 12px',
            fontSize: 12.5,
            color: COLORS.inkLight,
            fontStyle: 'italic'
          }}>
            ⏳ Evaluando parámetros clínicos de {perfilActivo?.nombre}...
          </div>
        )}
        <div ref={mensajesEndRef} />
      </div>

      {/* Sugerencias rápidas */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 8 }}>
        {SUGERENCIAS.map((sug, i) => (
          <button
            key={i}
            onClick={() => enviarPregunta(sug)}
            style={{
              whiteSpace: 'nowrap',
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: '5px 11px',
              fontSize: 11.5,
              cursor: 'pointer',
              color: COLORS.ink,
              fontWeight: 600,
              flexShrink: 0
            }}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input de consulta */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder={`Escribe tu consulta sobre ${perfilActivo?.nombre || 'el paciente'}...`}
          value={inputTexto}
          onChange={e => setInputTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviarPregunta()}
          aria-label="Pregunta al Doctor IA"
        />
        <button
          style={{ ...S.btn, padding: '11px 16px', opacity: cargando || !inputTexto.trim() ? 0.6 : 1 }}
          disabled={cargando || !inputTexto.trim()}
          onClick={() => enviarPregunta()}
        >
          Consultar
        </button>
      </div>
    </div>
  );
}

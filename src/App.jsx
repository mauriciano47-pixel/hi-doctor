import { useState, useEffect, useMemo, useRef } from 'react';

const COLORS = {
  cream: '#FFF7F0', sage: '#E07A5F', sageLight: '#F0B8A8', sageDark: '#C4624A',
  terracotta: '#F2A65A', terracottaDark: '#D88C3D', ink: '#2D2926', inkLight: '#8A7F77',
  border: '#F0E4DA', white: '#FFFFFF', alert: '#D95550', alertBg: '#FDE8E7',
};

const SYMPTOM_OPTIONS = ['Fiebre', 'Tos', 'Vómito', 'Diarrea', 'Dolor de panza', 'Dolor de cabeza',
  'Dolor de garganta', 'Erupción en la piel', 'Congestión nasal', 'Decaimiento',
  'Pérdida de apetito', 'Dolor de oído', 'Llanto inusual', 'Dificultad para dormir', 'Otro'];

const UNIT_OPTIONS = ['ml', 'mg', 'gotas', 'cucharadita', 'cucharada', 'comprimido', 'sobre'];

const GUIA_EDUCATIVA = [
  { titulo: 'Busca atención médica urgente si el niño presenta:', nivel: 'alerta', items: [
    'Dificultad para respirar, respiración muy rápida o silbante',
    'Labios o cara con color azulado o grisáceo',
    'Fiebre en un bebé menor de 3 meses (cualquier temperatura sobre 38°C)',
    'Fiebre muy alta (40°C o más) que no baja con medicación',
    'Letargo extremo, dificultad para despertar o falta de respuesta',
    'Rigidez de cuello, manchas en la piel que no desaparecen al presionar',
    'Vómitos o diarrea con signos de deshidratación (boca seca, sin lágrimas, orina muy escasa)',
    'Convulsiones', 'Dolor abdominal intenso y persistente',
    'Erupción que se extiende rápido junto con fiebre',
  ]},
  { titulo: 'Puedes observar en casa, pero consulta si no mejora, cuando el niño presenta:', nivel: 'observar', items: [
    'Fiebre leve o moderada en un niño que sigue jugando, comiendo y reactivo',
    'Tos o congestión nasal sin dificultad para respirar',
    'Vómito o diarrea aislados, sin signos de deshidratación',
    'Síntomas leves que duran menos de 2-3 días sin empeorar',
    'Erupciones leves y localizadas sin fiebre alta asociada',
  ]},
  { titulo: 'Como referencia general (esto no sustituye la evaluación de un profesional):', nivel: 'info', items: [
    'Anota cuánto dura cada síntoma, no solo si aparece',
    'Lleva el registro de temperatura y medicación a la consulta médica',
    'Si tienes dudas, siempre es válido llamar o consultar a tu pediatra',
  ]},
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
  const d = new Date(iso);
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }) + ' ' +
    d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
};
const formatFechaCorta = (iso) => new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });

function calcularProximaDosis(med) {
  if (!med.ultimaHora || !med.intervaloHoras) return null;
  return new Date(new Date(med.ultimaHora).getTime() + med.intervaloHoras * 60 * 60 * 1000);
}

function detectarPatrones(registros) {
  const patrones = [];
  if (registros.length === 0) return patrones;
  const fiebresNocturnas = registros.filter(r => {
    if (!r.fiebre) return false;
    const h = new Date(r.fecha).getHours();
    return h >= 20 || h < 6;
  });
  if (fiebresNocturnas.length >= 2) patrones.push({ tipo: 'fiebre_nocturna', texto: `Fiebre nocturna registrada ${fiebresNocturnas.length} veces` });

  const conFiebre = registros.filter(r => r.fiebre && r.temperatura).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  if (conFiebre.length >= 3) {
    const t = conFiebre.slice(-3).map(r => parseFloat(r.temperatura));
    if (t[2] > t[1] && t[1] > t[0]) patrones.push({ tipo: 'tendencia_subida', texto: 'La temperatura muestra tendencia al alza' });
    else if (t[2] < t[1] && t[1] < t[0]) patrones.push({ tipo: 'tendencia_bajada', texto: 'La temperatura muestra tendencia a la baja' });
  }

  const conteo = {};
  registros.forEach(r => (r.sintomas || []).forEach(s => { conteo[s] = (conteo[s] || 0) + 1; }));
  Object.entries(conteo).forEach(([s, c]) => { if (c >= 3) patrones.push({ tipo: 'sintoma_repetido', texto: `"${s}" se repite en ${c} registros` }); });

  const fechas = registros.map(r => new Date(r.fecha)).sort((a, b) => a - b);
  if (fechas.length >= 2) {
    const dias = Math.round((fechas[fechas.length - 1] - fechas[0]) / 86400000);
    if (dias >= 3) patrones.push({ tipo: 'duracion', texto: `Los síntomas llevan ${dias} días registrados` });
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
  const conTemp = useMemo(() => registros.filter(r => r.temperatura)
    .map(r => ({ fecha: new Date(r.fecha), temp: parseFloat(r.temperatura) }))
    .sort((a, b) => a.fecha - b.fecha), [registros]);

  if (conTemp.length < 2) {
    return <div style={{ padding: 24, textAlign: 'center', color: COLORS.inkLight, fontFamily: 'Source Sans 3, sans-serif', fontSize: 14 }}>
      Necesitas al menos 2 registros con temperatura para ver la gráfica.
    </div>;
  }

  const width = 600, height = 220, padding = { top: 20, right: 20, bottom: 36, left: 40 };
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
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <line x1={padding.left} y1={yFiebreLinea} x2={width - padding.right} y2={yFiebreLinea}
        stroke={COLORS.terracotta} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
      <text x={width - padding.right} y={yFiebreLinea - 4} textAnchor="end" fontSize="10"
        fill={COLORS.terracottaDark} fontFamily="Source Sans 3, sans-serif">38°C</text>
      {yTicks.map(t => (
        <g key={t}>
          <line x1={padding.left} y1={y(t)} x2={width - padding.right} y2={y(t)} stroke={COLORS.border} strokeWidth="1" />
          <text x={padding.left - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill={COLORS.inkLight} fontFamily="Source Sans 3, sans-serif">{t}°</text>
        </g>
      ))}
      {conTemp.map((p, i) => i % Math.ceil(conTemp.length / 6) === 0 && (
        <text key={i} x={x(p.fecha)} y={height - padding.bottom + 16} textAnchor="middle" fontSize="9"
          fill={COLORS.inkLight} fontFamily="Source Sans 3, sans-serif">{formatFechaCorta(p.fecha)}</text>
      ))}
      <polyline points={puntos} fill="none" stroke={COLORS.sage} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {conTemp.map((p, i) => (
        <circle key={i} cx={x(p.fecha)} cy={y(p.temp)} r="4" fill={p.temp >= 38 ? COLORS.terracotta : COLORS.sage} stroke={COLORS.white} strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ---------- Estilos compartidos ----------
const S = {
  app: { fontFamily: 'Nunito, sans-serif', background: COLORS.cream, minHeight: '100%', color: COLORS.ink, padding: '20px 16px 90px' },
  h1: { fontFamily: 'Quicksand, sans-serif', fontSize: 24, fontWeight: 700, margin: '0 0 4px', color: COLORS.ink },
  h2: { fontFamily: 'Quicksand, sans-serif', fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: COLORS.ink },
  sub: { fontSize: 13.5, color: COLORS.inkLight, margin: '0 0 20px', lineHeight: 1.5 },
  card: { background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 18, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  btn: { background: COLORS.sage, color: COLORS.white, border: 'none', borderRadius: 14, padding: '12px 18px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' },
  btnOutline: { background: 'transparent', color: COLORS.sageDark, border: `1.5px solid ${COLORS.sage}`, borderRadius: 14, padding: '11px 17px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' },
  btnTerracotta: { background: COLORS.terracotta, color: COLORS.white, border: 'none', borderRadius: 14, padding: '12px 18px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' },
  input: { width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 12, border: `1.5px solid ${COLORS.border}`, fontSize: 14.5, fontFamily: 'Nunito, sans-serif', background: COLORS.white, color: COLORS.ink },
  label: { fontSize: 13, color: COLORS.inkLight, marginBottom: 5, display: 'block', fontWeight: 600, fontFamily: 'Nunito, sans-serif' },
  chip: (active) => ({
    padding: '7px 14px', borderRadius: 24, fontSize: 13.5, cursor: 'pointer', fontWeight: 600,
    border: `1.5px solid ${active ? COLORS.sage : COLORS.border}`,
    background: active ? COLORS.sage : COLORS.white, color: active ? COLORS.white : COLORS.ink,
    fontFamily: 'Nunito, sans-serif', transition: 'all 0.2s',
  }),
  bottomNav: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    display: 'flex', background: COLORS.white,
    borderTop: `1px solid ${COLORS.border}`,
    padding: '6px 0 14px', zIndex: 100,
    boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
  },
  navBtn: (active) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    padding: '4px 0', fontSize: 10.5, fontWeight: active ? 700 : 500,
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
      if (res) return JSON.parse(res);
    } catch {
      // sin datos previos
    }
    return { perfiles: [], registros: [], contactos: [], pais: 'Chile' };
  });
  const [perfilActivoId, setPerfilActivoId] = useState(() => data.perfiles?.[0]?.id || null);
  const [vista, setVista] = useState('registro'); // registro | historial | guia | resumen | ayuda | ia
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarNuevoPerfil, setMostrarNuevoPerfil] = useState(false);

  // Guardar datos
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // manejo de almacenamiento local
    }
  }, [data]);

  const perfiles = data.perfiles || [];
  const perfilActivo = perfiles.find(p => p.id === perfilActivoId);
  const registrosDelPerfil = useMemo(() => {
    const regs = data.registros || [];
    return regs.filter(r => r.perfilId === perfilActivoId).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [data.registros, perfilActivoId]);
  const patrones = useMemo(() => detectarPatrones(registrosDelPerfil), [registrosDelPerfil]);

  function crearPerfil(nombre) {
    const nuevo = { id: uid(), nombre, creado: new Date().toISOString() };
    setData(d => ({ ...d, perfiles: [...(d.perfiles || []), nuevo] }));
    setPerfilActivoId(nuevo.id);
    setMostrarNuevoPerfil(false);
  }

  function agregarRegistro(registro) {
    setData(d => ({ ...d, registros: [...(d.registros || []), { ...registro, id: uid(), perfilId: perfilActivoId }] }));
    setMostrarForm(false);
  }

  function eliminarRegistro(id) {
    setData(d => ({ ...d, registros: d.registros.filter(r => r.id !== id) }));
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

  if (perfiles.length === 0) {
    return (
      <div style={S.app}>
        <h1 style={S.h1}>👋 Hi Doctor</h1>
        <p style={S.sub}>Estamos contigo. Registra y organiza los síntomas de tus hijos para llegar preparado a la consulta.</p>
        <div style={S.card}>
          <h2 style={S.h2}>Crea el primer perfil</h2>
          <PerfilForm onCrear={crearPerfil} />
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <h1 style={S.h1}>👋 Hola, estamos contigo</h1>
      <p style={S.sub}>Hi Doctor · Registra lo que observas para conversar mejor con el pediatra.</p>

      {/* Selector de perfil */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {perfiles.map(p => (
          <div key={p.id} onClick={() => setPerfilActivoId(p.id)} style={S.chip(p.id === perfilActivoId)}>
            {p.nombre}
          </div>
        ))}
        {!mostrarNuevoPerfil ? (
          <div onClick={() => setMostrarNuevoPerfil(true)} style={{ ...S.chip(false), borderStyle: 'dashed', color: COLORS.sageDark }}>
            + Agregar
          </div>
        ) : null}
      </div>

      {mostrarNuevoPerfil && (
        <div style={S.card}>
          <PerfilForm onCrear={crearPerfil} onCancelar={() => setMostrarNuevoPerfil(false)} />
        </div>
      )}

      {perfilActivo && (
        <>


          {vista === 'registro' && (
            <VistaRegistro
              perfilActivo={perfilActivo}
              mostrarForm={mostrarForm}
              setMostrarForm={setMostrarForm}
              agregarRegistro={agregarRegistro}
              registrosDelPerfil={registrosDelPerfil}
              patrones={patrones}
            />
          )}

          {vista === 'historial' && (
            <VistaHistorial registrosDelPerfil={registrosDelPerfil} eliminarRegistro={eliminarRegistro} />
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
            <VistaResumen perfilActivo={perfilActivo} registrosDelPerfil={registrosDelPerfil} patrones={patrones} />
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

          {/* Firma del desarrollador */}
          <div style={{ textAlign: 'center', marginTop: 30, marginBottom: 10 }}>
            <div style={{
              fontSize: 12,
              letterSpacing: 0.8,
              textTransform: 'capitalize',
              opacity: 0.75,
              display: 'inline-block',
              color: COLORS.inkLight,
              fontFamily: 'Nunito, sans-serif'
            }}>desarrollado por mauricio uribe maldonado</div>
          </div>

          {/* Navegación inferior con iconos */}
          <div style={S.bottomNav}>
            <div style={S.navBtn(vista === 'registro')} onClick={() => setVista('registro')}>
              <span style={{ fontSize: 20 }}>📝</span>
              <span>Registrar</span>
            </div>
            <div style={S.navBtn(vista === 'historial')} onClick={() => setVista('historial')}>
              <span style={{ fontSize: 20 }}>📊</span>
              <span>Historial</span>
            </div>
            <div style={S.navBtn(vista === 'ia')} onClick={() => setVista('ia')}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <span>Doctor IA</span>
            </div>
            <div style={S.navBtn(vista === 'guia')} onClick={() => setVista('guia')}>
              <span style={{ fontSize: 20 }}>📖</span>
              <span>Guía</span>
            </div>
            <div style={S.navBtn(vista === 'resumen')} onClick={() => setVista('resumen')}>
              <span style={{ fontSize: 20 }}>📋</span>
              <span>Resumen</span>
            </div>
            <div style={S.navBtn(vista === 'ayuda')} onClick={() => setVista('ayuda')}>
              <span style={{ fontSize: 20 }}>🆘</span>
              <span>Ayuda</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PerfilForm({ onCrear, onCancelar }) {
  const [nombre, setNombre] = useState('');
  return (
    <div>
      <label style={S.label}>Nombre del niño o niña</label>
      <input style={S.input} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Sofía" />
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button style={S.btn} onClick={() => nombre.trim() && onCrear(nombre.trim())}>Crear perfil</button>
        {onCancelar && <button style={S.btnOutline} onClick={onCancelar}>Cancelar</button>}
      </div>
    </div>
  );
}

function VistaRegistro({ perfilActivo, mostrarForm, setMostrarForm, agregarRegistro, registrosDelPerfil, patrones }) {
  return (
    <div>
      {patrones.length > 0 && (
        <div style={{ ...S.card, background: COLORS.alertBg, border: `1px solid ${COLORS.terracotta}` }}>
          <h2 style={{ ...S.h2, fontSize: 15, color: COLORS.terracottaDark }}>Patrones detectados</h2>
          {patrones.map((p, i) => (
            <p key={i} style={{ fontSize: 13.5, margin: '4px 0', color: COLORS.ink }}>• {p.texto}</p>
          ))}
        </div>
      )}

      {!mostrarForm ? (
        <button style={{ ...S.btn, width: '100%' }} onClick={() => setMostrarForm(true)}>
          + Nuevo registro de {perfilActivo.nombre}
        </button>
      ) : (
        <NuevoRegistroForm onGuardar={agregarRegistro} onCancelar={() => setMostrarForm(false)} />
      )}

      <div style={{ marginTop: 20 }}>
        <h2 style={S.h2}>Últimos registros</h2>
        {registrosDelPerfil.slice(0, 3).map(r => <RegistroCard key={r.id} registro={r} />)}
        {registrosDelPerfil.length === 0 && (
          <p style={{ fontSize: 13.5, color: COLORS.inkLight }}>Aún no hay registros para {perfilActivo.nombre}.</p>
        )}
      </div>
    </div>
  );
}

function NuevoRegistroForm({ onGuardar }) {
  const [sintomas, setSintomas] = useState([]);
  const [fiebre, setFiebre] = useState(false);
  const [temperatura, setTemperatura] = useState('');
  const [nota, setNota] = useState('');
  const [foto, setFoto] = useState(null);
  const [medNombre, setMedNombre] = useState('');
  const [medDosis, setMedDosis] = useState('');
  const [medUnidad, setMedUnidad] = useState('ml');
  const [medIntervalo, setMedIntervalo] = useState('');
  const [agregarMed, setAgregarMed] = useState(false);
  const fileRef = useRef(null);

  function toggleSintoma(s) {
    setSintomas(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function handleFoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFoto({ data: reader.result, timestamp: new Date().toISOString() });
    reader.readAsDataURL(file);
  }

  function guardar() {
    const registro = {
      fecha: new Date().toISOString(),
      sintomas, fiebre, temperatura: fiebre ? temperatura : '',
      nota, foto,
      medicamento: agregarMed && medNombre ? {
        nombre: medNombre, dosis: medDosis, unidad: medUnidad,
        intervaloHoras: parseFloat(medIntervalo) || null, ultimaHora: new Date().toISOString(),
      } : null,
    };
    onGuardar(registro);
  }

  return (
    <div style={S.card}>
      <h2 style={S.h2}>Nuevo registro</h2>

      <label style={S.label}>Síntomas observados</label>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {SYMPTOM_OPTIONS.map(s => (
          <div key={s} style={S.chip(sintomas.includes(s))} onClick={() => toggleSintoma(s)}>{s}</div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <input type="checkbox" id="fiebre" checked={fiebre} onChange={e => setFiebre(e.target.checked)} />
        <label htmlFor="fiebre" style={{ fontSize: 14 }}>Tiene fiebre</label>
      </div>

      {fiebre && (
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Temperatura (°C)</label>
          <input style={S.input} type="number" step="0.1" value={temperatura} onChange={e => setTemperatura(e.target.value)} placeholder="Ej. 38.5" />
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Nota libre</label>
        <textarea style={{ ...S.input, minHeight: 60, resize: 'vertical' }} value={nota} onChange={e => setNota(e.target.value)} placeholder="¿Algo más que observaste?" />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Foto (útil para erupciones)</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{ fontSize: 13 }} />
        {foto && <img src={foto.data} alt="Registro" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="med" checked={agregarMed} onChange={e => setAgregarMed(e.target.checked)} />
          <label htmlFor="med" style={{ fontSize: 14 }}>Administré un medicamento ahora</label>
        </div>
      </div>

      {agregarMed && (
        <div style={{ marginBottom: 10, paddingLeft: 4 }}>
          <label style={S.label}>Nombre del medicamento</label>
          <input style={{ ...S.input, marginBottom: 8 }} value={medNombre} onChange={e => setMedNombre(e.target.value)} placeholder="Ej. Paracetamol" />
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Dosis</label>
              <input style={S.input} type="number" value={medDosis} onChange={e => setMedDosis(e.target.value)} placeholder="5" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Unidad</label>
              <select style={S.input} value={medUnidad} onChange={e => setMedUnidad(e.target.value)}>
                {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <label style={S.label}>Intervalo entre dosis (horas)</label>
          <input style={S.input} type="number" value={medIntervalo} onChange={e => setMedIntervalo(e.target.value)} placeholder="Ej. 8" />
        </div>
      )}

      <button style={{ ...S.btn, width: '100%', marginTop: 8 }} onClick={guardar}>Guardar registro</button>
    </div>
  );
}

function RegistroCard({ registro }) {
  const proximaDosis = registro.medicamento ? calcularProximaDosis(registro.medicamento) : null;
  return (
    <div style={S.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 13, color: COLORS.inkLight }}>{formatFecha(registro.fecha)}</span>
        {registro.fiebre && registro.temperatura && (
          <span style={{ fontSize: 13, fontWeight: 600, color: parseFloat(registro.temperatura) >= 38 ? COLORS.terracottaDark : COLORS.sageDark }}>
            {registro.temperatura}°C
          </span>
        )}
      </div>
      {registro.sintomas && registro.sintomas.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', margin: '8px 0' }}>
          {registro.sintomas.map(s => (
            <span key={s} style={{ fontSize: 11.5, background: COLORS.cream, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '2px 9px', color: COLORS.ink }}>{s}</span>
          ))}
        </div>
      )}
      {registro.nota && <p style={{ fontSize: 13.5, margin: '6px 0', color: COLORS.ink }}>{registro.nota}</p>}
      {registro.foto && <img src={registro.foto.data} alt="Foto del registro" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, marginTop: 6 }} />}
      {registro.medicamento && (
        <div style={{ marginTop: 8, fontSize: 12.5, color: COLORS.sageDark, background: '#EEF3EE', borderRadius: 8, padding: '6px 10px' }}>
          {registro.medicamento.nombre} — {registro.medicamento.dosis} {registro.medicamento.unidad}
          {proximaDosis && <span> · próxima dosis aprox. {formatFecha(proximaDosis.toISOString())}</span>}
        </div>
      )}
    </div>
  );
}

function VistaHistorial({ registrosDelPerfil, eliminarRegistro }) {
  return (
    <div>
      <h2 style={S.h2}>Historial completo</h2>
      {registrosDelPerfil.map(r => (
        <div key={r.id} style={{ position: 'relative' }}>
          <RegistroCard registro={r} />
          <button onClick={() => eliminarRegistro(r.id)} style={{
            position: 'absolute', top: 12, right: 12, background: 'none', border: 'none',
            color: COLORS.inkLight, fontSize: 12, cursor: 'pointer', textDecoration: 'underline',
          }}>eliminar</button>
        </div>
      ))}
      {registrosDelPerfil.length === 0 && <p style={{ fontSize: 13.5, color: COLORS.inkLight }}>No hay registros aún.</p>}

      {registrosDelPerfil.length >= 2 && (
        <div style={{ marginTop: 24 }}>
          <h2 style={S.h2}>Temperatura en el tiempo</h2>
          <div style={S.card}>
            <GraficaTemperatura registros={registrosDelPerfil} />
          </div>
        </div>
      )}
    </div>
  );
}

function VistaGuia() {
  return (
    <div>
      <div style={{ ...S.card, background: '#F2F0E8', marginBottom: 18 }}>
        <p style={{ fontSize: 12.5, color: COLORS.inkLight, margin: 0, lineHeight: 1.5 }}>
          Esta guía es información educativa general (no personalizada y no generada por inteligencia artificial),
          basada en lineamientos públicos de organismos de salud pediátrica. No sustituye la evaluación de un profesional.
        </p>
      </div>
      {GUIA_EDUCATIVA.map((seccion, i) => (
        <div key={i} style={{
          ...S.card,
          borderLeft: `4px solid ${seccion.nivel === 'alerta' ? COLORS.alert : seccion.nivel === 'observar' ? COLORS.terracotta : COLORS.sage}`,
        }}>
          <h2 style={{ ...S.h2, fontSize: 15.5 }}>{seccion.titulo}</h2>
          {seccion.items.map((item, j) => (
            <p key={j} style={{ fontSize: 13.5, margin: '6px 0', color: COLORS.ink, lineHeight: 1.5 }}>• {item}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

function VistaResumen({ perfilActivo, registrosDelPerfil, patrones }) {
  const [copiado, setCopiado] = useState(false);

  const textoResumen = useMemo(() => {
    let texto = `Resumen de síntomas — ${perfilActivo.nombre}\n`;
    texto += `Generado el ${new Date().toLocaleDateString('es-CL')}\n\n`;
    if (patrones.length > 0) {
      texto += 'Patrones observados:\n';
      patrones.forEach(p => { texto += `- ${p.texto}\n`; });
      texto += '\n';
    }
    texto += `Registros (${registrosDelPerfil.length}):\n`;
    registrosDelPerfil.slice().reverse().forEach(r => {
      texto += `\n${formatFecha(r.fecha)}\n`;
      if (r.sintomas && r.sintomas.length) texto += `  Síntomas: ${r.sintomas.join(', ')}\n`;
      if (r.fiebre && r.temperatura) texto += `  Temperatura: ${r.temperatura}°C\n`;
      if (r.nota) texto += `  Nota: ${r.nota}\n`;
      if (r.medicamento) texto += `  Medicamento: ${r.medicamento.nombre} (${r.medicamento.dosis} ${r.medicamento.unidad})\n`;
    });
    return texto;
  }, [perfilActivo, registrosDelPerfil, patrones]);

  function copiar() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textoResumen).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      });
    }
  }

  return (
    <div>
      <h2 style={S.h2}>Resumen para el doctor</h2>
      <p style={{ fontSize: 13.5, color: COLORS.inkLight, marginBottom: 14 }}>
        Copia este resumen y llévalo a la consulta de {perfilActivo.nombre}.
      </p>
      <div style={{ ...S.card, whiteSpace: 'pre-wrap', fontSize: 13, fontFamily: 'Source Sans 3, sans-serif', lineHeight: 1.6, maxHeight: 360, overflowY: 'auto' }}>
        {textoResumen}
      </div>
      <button style={{ ...S.btnTerracotta, width: '100%', marginTop: 12 }} onClick={copiar}>
        {copiado ? 'Copiado ✓' : 'Copiar resumen'}
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
            setErrorUbicacion('No se pudieron obtener resultados. Verifica tu conexión a internet.');
            setBuscandoCercanas(false);
          });
      },
      () => {
        setErrorUbicacion('No se pudo acceder a tu ubicación. Activa el GPS o los permisos de ubicación e intenta de nuevo.');
        setBuscandoCercanas(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  return (
    <div>
      {/* Mensaje tranquilizador */}
      <div style={{ ...S.card, background: '#EEF3EE', borderLeft: `4px solid ${COLORS.sage}`, marginBottom: 18 }}>
        <p style={{ fontSize: 14.5, color: COLORS.ink, margin: 0, lineHeight: 1.7 }}>
          💚 <strong>Respira profundo.</strong> Estás haciendo lo correcto al buscar ayuda para tu hijo.
          Aquí tienes los números y contactos que puedes necesitar. Todo va a estar bien.
        </p>
      </div>

      {/* Números de emergencia */}
      <h2 style={S.h2}>Números de emergencia</h2>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Selecciona tu país</label>
        <select style={S.input} value={paisSeleccionado} onChange={e => setPaisSeleccionado(e.target.value)}>
          {Object.keys(NUMEROS_EMERGENCIA).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {numerosActuales.map((n, i) => (
        <a key={i} href={`tel:${n.numero}`} style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
          ...S.card, textDecoration: 'none', color: COLORS.ink, cursor: 'pointer',
          background: n.tipo === 'emergencia' ? COLORS.alertBg : COLORS.white,
          borderLeft: n.tipo === 'emergencia' ? `4px solid ${COLORS.alert}` : `4px solid ${COLORS.sage}`,
        }}>
          <div style={{ fontSize: 22 }}>{n.tipo === 'emergencia' ? '🚨' : '📞'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14.5 }}>{n.nombre}</div>
            <div style={{ fontSize: 14, color: COLORS.inkLight, fontWeight: 500 }}>{n.display}</div>
          </div>
          <div style={{ ...S.btnTerracotta, padding: '7px 14px', fontSize: 13, borderRadius: 8 }}>Llamar</div>
        </a>
      ))}

      {/* Mis contactos guardados */}
      <h2 style={{ ...S.h2, marginTop: 28 }}>Mis contactos guardados</h2>
      <p style={{ fontSize: 13.5, color: COLORS.inkLight, marginBottom: 14, marginTop: 0 }}>
        Guarda los datos de tu pediatra, clínica o farmacia de confianza para tenerlos siempre a mano.
      </p>

      {contactos.map(c => (
        <div key={c.id} style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <span style={{
                fontSize: 11, color: COLORS.sageDark, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {TIPOS_CONTACTO[c.tipo] || TIPOS_CONTACTO.otro}
              </span>
              <div style={{ fontWeight: 600, fontSize: 15, marginTop: 2 }}>{c.nombre}</div>
              {c.telefono && (
                <div style={{ fontSize: 13.5, color: COLORS.inkLight, marginTop: 4 }}>📞 {c.telefono}</div>
              )}
              {c.direccion && (
                <div style={{ fontSize: 13.5, color: COLORS.inkLight, marginTop: 2 }}>📍 {c.direccion}</div>
              )}
              {c.nota && (
                <div style={{ fontSize: 13, color: COLORS.inkLight, marginTop: 4, fontStyle: 'italic' }}>{c.nota}</div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 8 }}>
              {c.telefono && (
                <a href={`tel:${c.telefono}`} style={{
                  ...S.btn, padding: '6px 12px', fontSize: 12,
                  textDecoration: 'none', textAlign: 'center',
                }}>
                  Llamar
                </a>
              )}
              <button onClick={() => eliminarContacto(c.id)} style={{
                background: 'none', border: 'none', color: COLORS.inkLight,
                fontSize: 11.5, cursor: 'pointer', textDecoration: 'underline', padding: 0,
              }}>eliminar</button>
            </div>
          </div>
        </div>
      ))}

      {!mostrarFormContacto ? (
        <button style={{ ...S.btnOutline, width: '100%' }} onClick={() => setMostrarFormContacto(true)}>
          + Agregar contacto
        </button>
      ) : (
        <ContactoForm
          onGuardar={(c) => { agregarContacto(c); setMostrarFormContacto(false); }}
          onCancelar={() => setMostrarFormContacto(false)}
        />
      )}

      {/* Centros de salud cercanos */}
      <h2 style={{ ...S.h2, marginTop: 28 }}>Centros de salud cercanos</h2>
      <p style={{ fontSize: 13.5, color: COLORS.inkLight, marginBottom: 14, marginTop: 0 }}>
        Busca hospitales, clínicas y farmacias cerca de tu ubicación actual.
      </p>
      <button
        style={{ ...S.btn, width: '100%', opacity: buscandoCercanas ? 0.7 : 1 }}
        onClick={buscarCercanos}
        disabled={buscandoCercanas}
      >
        {buscandoCercanas ? '⏳ Buscando…' : '📍 Buscar centros de salud cercanos'}
      </button>

      {errorUbicacion && (
        <div style={{ ...S.card, background: COLORS.alertBg, borderLeft: `4px solid ${COLORS.alert}`, marginTop: 12 }}>
          <p style={{ fontSize: 13.5, color: COLORS.ink, margin: 0 }}>{errorUbicacion}</p>
        </div>
      )}

      {clinicasCercanas.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 12.5, color: COLORS.inkLight, marginBottom: 10 }}>
            Se encontraron {clinicasCercanas.length} resultados en un radio de 5 km:
          </p>
          {clinicasCercanas.map((c, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, color: COLORS.sageDark, fontWeight: 600 }}>
                    {TIPOS_LUGAR[c.tipo] || '🏥 Centro de salud'}
                  </span>
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>{c.nombre}</div>
                  {c.direccion && (
                    <div style={{ fontSize: 13, color: COLORS.inkLight, marginTop: 3 }}>📍 {c.direccion}</div>
                  )}
                  <div style={{ fontSize: 12.5, color: COLORS.sage, fontWeight: 500, marginTop: 3 }}>
                    {c.distancia < 1 ? `${(c.distancia * 1000).toFixed(0)} m` : `${c.distancia.toFixed(1)} km`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {c.telefono && (
                  <a href={`tel:${c.telefono}`} style={{
                    ...S.btn, padding: '6px 14px', fontSize: 12.5,
                    textDecoration: 'none', flex: 1, textAlign: 'center',
                  }}>
                    📞 Llamar
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...S.btnOutline, padding: '6px 14px', fontSize: 12.5,
                    textDecoration: 'none', flex: 1, textAlign: 'center',
                  }}
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
    <div style={S.card}>
      <h2 style={{ ...S.h2, fontSize: 16 }}>Nuevo contacto</h2>
      <div style={{ marginBottom: 10 }}>
        <label style={S.label}>Tipo</label>
        <select style={S.input} value={tipo} onChange={e => setTipo(e.target.value)}>
          {Object.entries(TIPOS_CONTACTO).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={S.label}>Nombre</label>
        <input style={S.input} value={nombre} onChange={e => setNombre(e.target.value)}
          placeholder="Ej. Dra. María López" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={S.label}>Teléfono</label>
        <input style={S.input} type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
          placeholder="Ej. +56 9 1234 5678" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={S.label}>Dirección (opcional)</label>
        <input style={S.input} value={direccion} onChange={e => setDireccion(e.target.value)}
          placeholder="Ej. Av. Providencia 1234" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={S.label}>Nota (opcional)</label>
        <input style={S.input} value={nota} onChange={e => setNota(e.target.value)}
          placeholder="Ej. Atiende lunes a viernes" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ ...S.btn, flex: 1 }} onClick={guardar}>Guardar contacto</button>
        <button style={{ ...S.btnOutline, flex: 1 }} onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}

// ---------- Asistente IA Pediátrico & Triaje Inteligente ----------
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
    respuesta = `🚨 **ATENCIÓN INMEDIATA — SIGNOS RESPIRATORIOS CRÍTICOS**

Si notas que **${nombre}** presenta:
- Hundimiento de costillas o el hueco del cuello al respirar (tiraje).
- Respiración agitada, muy rápida o jadeante.
- Silbidos audibles en el pecho (sibilancias) o estridor al inhalar.
- Color azulado o grisáceo alrededor de los labios o uñas.

👉 **ACUDE A URGENCIAS DE INMEDIATO o llama al servicio de emergencias de tu país (pestaña 🆘 Ayuda).**
Mantén a ${nombre} en posición sentada o semisentada, no le des líquidos a la fuerza si le cuesta respirar y acude al centro asistencial más cercano.`;
  } else if (p.includes('fiebre') || p.includes('temperatura') || p.includes('calentur') || p.includes('38') || p.includes('39') || p.includes('40')) {
    const tempTexto = ultimaTemp ? ` (Último registro de ${nombre}: ${ultimaTemp}°C)` : '';
    if (parseFloat(ultimaTemp || 0) >= 39.5 || p.includes('40')) esAlerta = true;

    respuesta = `🌡️ **Manejo Seguro de Fiebre en Niños**${tempTexto}

La fiebre es un mecanismo de defensa natural del cuerpo contra infecciones:
1. **Medidas de Confort Físico:**
   - Viste a ${nombre} con ropa ligera de algodón, mantén la habitación ventilada y a temperatura templada (~21-22°C).
   - **No uses baños con agua fría ni alcohol**: provocan escalofríos y vasoconstricción, lo que puede elevar más la temperatura interna.
   - Ofrece líquidos con frecuencia (leche materna, agua o suero de rehidratación en pequeños sorbos).
2. **Medicación Antitérmica:**
   - La dosis de paracetamol o ibuprofeno se calcula **estrictamente por el peso en kg**, no por la edad. Revisa la indicación de su pediatra.
3. **🚨 ¿Cuándo acudir a Urgencias?**
   - Bebés menores de 3 meses con temperatura de 38°C o más.
   - Fiebre de 40°C o más persistente.
   - Si se acompaña de manchas rojas/púrpuras en la piel, rigidez de nuca, vómitos reiterados o somnolencia extrema sin respuesta.
   - Fiebre continua por más de 72 horas.`;
  } else if (p.includes('vomit') || p.includes('diarrea') || p.includes('deshidrat') || p.includes('suero') || p.includes('panza') || p.includes('estomago')) {
    respuesta = `💧 **Prevención de Deshidratación & Trastornos Gastrointestinales**

Para **${nombre}**, la prioridad número 1 es reponer líquidos y electrolitos:
1. **Regla de Oro: Hidratación Fraccionada:**
   - Ofrece **Solución de Rehidratación Oral (SRO)** en pequeños volúmenes: 1 cucharadita (5 ml) cada 5 a 10 minutos.
   - Beber grandes volúmenes de golpe puede reactivar el reflejo del vómito.
2. **Evitar:**
   - Bebidas azucaradas, jugos industriales, refrescos o bebidas isotónicas para deportistas (empeoran la diarrea osmótica).
3. **🚨 Banderas Rojas de Deshidratación Severa:**
   - Llanto sin lágrimas.
   - Boca, lengua y labios muy secos.
   - Más de 6 a 8 horas sin mojar el pañal u orina muy concentrada y oscura.
   - Ojos hundidos o fontanela (mollera) deprimida en lactantes.
   - Decaimiento extremo o falta de energía para sostener la mirada.
Si detectas estos signos, consulta en un centro médico sin demora.`;
  } else if (p.includes('tos') || p.includes('moco') || p.includes('resfri') || p.includes('congestion') || p.includes('garganta')) {
    respuesta = `💨 **Alivio de Congestión y Cuadros Respiratorios Altos**

Recomendaciones para el confort de **${nombre}**:
1. **Higiene Nasal:**
   - Realiza lavados nasales suaves con suero fisiológico (solución salina al 0.9%) antes de comer y antes de dormir para despejar las vías respiratorias.
2. **Posición de Descanso:**
   - Eleva ligeramente la cabecera del colchón (unos 15-20 grados) colocando una toalla debajo del colchón (nunca almohadas altas dentro de la cuna en bebés).
3. **Ambiente:**
   - Mantén el aire humectado y libre de humo de tabaco o químicos de limpieza.
4. **⚠️ Precaución con Medicamentos:**
   - No administres jarabes antitusivos ni descongestionantes de venta libre a menores de 6 años sin indicación médica explícita.
5. **🚨 Consulta de Inmediato si:**
   - La tos suena como ladrido o foca (posible laringitis/crup).
   - Aparece dificultad respiratoria o quejido continuo.`;
  } else if (p.includes('erupcion') || p.includes('mancha') || p.includes('piel') || p.includes('roncha') || p.includes('granit')) {
    respuesta = `🔍 **Erupciones Cutáneas y Manchas en la Piel**

1. **La Prueba del Vaso (Vitropresión):**
   - Presiona suavemente el fondo de un vaso de vidrio transparente contra la mancha o erupción.
   - **Normal:** Si la mancha desaparece temporalmente bajo la presión y luego vuelve, suele ser un exantema benigno.
   - **🚨 ALERTA ROJA:** Si la mancha **NO desaparece al presionar** (petequias/púrpura) y además hay fiebre o decaimiento, acude de inmediato a urgencias.
2. **Cuidados Generales:**
   - Ropa holgada de algodón que no roce la piel.
   - Baños templados cortos sin frotar con esponjas.
   - Registra en HiDoctor la evolución de las zonas donde aparece la erupción para mostrárselo al pediatra.`;
  } else if (p.includes('dosis') || p.includes('paracetamol') || p.includes('ibuprofeno') || p.includes('medicamento') || p.includes('remedio') || p.includes('jarabe')) {
    respuesta = `💊 **Guía de Seguridad en Medicación Pediátrica**

1. **La Dosis Siempre Depende del Peso:**
   - En pediatría las dosis se calculan por **miligramos por kilogramo de peso real (mg/kg)**, jamás únicamente por la edad.
2. **Verificación de Seguridad:**
   - Utiliza siempre la jeringa dosificadora o pipeta graduada del medicamento, nunca cucharas domésticas.
   - Guarda el registro exacto aquí en HiDoctor (pestaña **Registrar**) para saber con exactitud la hora de la última toma y evitar sobredosificaciones accidentales.
3. **⚠️ Intervalos Mínimos:**
   - Respeta estrictamente el intervalo fijado por tu pediatra (habitualmente cada 6 u 8 horas). No alternes fármacos sin autorización médica expresa.`;
  } else if (p.includes('urgencia') || p.includes('emergencia') || p.includes('hospital') || p.includes('alarma')) {
    esAlerta = true;
    respuesta = `🚨 **LOS 7 SIGNOS DE ALARMA PEDIÁTRICA OBLIGATORIOS DE CONSULTA URGENTE:**

1. **Dificultad respiratoria evidente:** Aleteo nasal, hundimiento de costillas o respiración acelerada.
2. **Color de la piel:** Labios o lengua azulados, piel muy pálida o moteada.
3. **Estado neurológico:** Imposibilidad para despertar, letargo profundo, confusión o convulsiones.
4. **Fiebre alta en lactantes:** Menores de 3 meses con más de 38°C.
5. **Erupciones tipo petequias:** Manchas rojas que no desaparecen al presionar con un vaso de vidrio.
6. **Vómitos incesantes:** Imposibilidad total de retener líquidos durante más de 4 horas.
7. **Llanto inconsolable o dolor agudo e inusual.**

👉 Utiliza la pestaña **🆘 Ayuda** para llamar directamente a ambulancia SAMU/911 o localizar el hospital más cercano.`;
  } else {
    respuesta = `📋 **Recomendaciones de Acompañamiento para ${nombre}**

He revisado los antecedentes disponibles en su bitácora:
${sintomasRecientes.length > 0 ? `• Síntomas recientes reportados: **${sintomasRecientes.join(', ')}**` : '• No hay síntomas recientes reportados en las últimas horas.'}
${ultimaTemp ? `• Última temperatura corporal registrada: **${ultimaTemp}°C**` : ''}
${(patrones && patrones.length > 0) ? `• Patrones de salud identificados: **${patrones.map(pat => pat.texto).join('; ')}**\n` : ''}
**Pasos a seguir recomendados:**
1. Mantén a ${nombre} bien hidratado y en reposo confortable.
2. Continúa anotando en HiDoctor cualquier cambio de temperatura o síntoma nuevo (la cronología es la herramienta más valiosa para el médico).
3. Si el cuadro no mejora en 48-72 horas o aparecen banderas rojas (dificultad respiratoria, decaimiento extremo, vómitos continuos), consulta presencialmente con tu pediatra.

¿Deseas orientación sobre algún síntoma específico como **fiebre, tos, vómitos o pautas de urgencia**?`;
  }

  return { texto: respuesta, esAlerta };
}

function VistaAsistenteIA({ perfilActivo, registrosDelPerfil, patrones }) {
  const [mensajes, setMensajes] = useState([
    {
      id: 'init-1',
      emisor: 'asistente',
      texto: `👋 ¡Hola! Soy tu **Doctor IA**, asistente de orientación pediátrica de **HiDoctor**.

Estoy aquí para ayudarte a interpretar síntomas, reconocer señales de alarma y cuidar a **${perfilActivo?.nombre || 'tu hijo/a'}** mientras consultas a su pediatra.

¿Qué síntomas estás observando o sobre qué necesitas orientación?`,
      hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      esAlerta: false,
    }
  ]);
  const [inputTexto, setInputTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarConfigKey, setMostrarConfigKey] = useState(false);
  const [customKey, setCustomKey] = useState(() => window.localStorage.getItem('hidoctor_gemini_api_key') || '');
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

    // Intentar llamada a Gemini si existe key con timeout estricto de 8000ms
    if (apiKey) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const promptSistema = `Eres el Asistente Pediátrico de la aplicación HiDoctor.
Tu objetivo es dar orientación preventiva, empática y rigurosa a los padres.
Paciente activo: ${perfilActivo?.nombre || 'Niño/a'}.
Última temperatura: ${ultimaTemp ? ultimaTemp + '°C' : 'No registrada'}.
Síntomas recientes: ${ultimosSintomas.join(', ') || 'Ninguno registrado'}.
Patrones observados: ${patrones.map(p => p.texto).join('; ') || 'Ninguno'}.

INSTRUCCIONES CLÍNICAS OBLIGATORIAS:
1. Responde en español claro, cálido y comprensible.
2. Comienza evaluando si la consulta involucra una potencial emergencia médica.
3. Si hay signos de peligro (dificultad respiratoria, somnolencia extrema, fiebre >40°C, petequias, menor de 3 meses con fiebre), indícalo en el primer párrafo en MAYÚSCULAS y aconseja ir a urgencias.
4. Ofrece medidas de soporte en el hogar (hidratación, ropa ligera, confort).
5. Enfatiza que este asistente orienta y no sustituye al pediatra.
Mantén la respuesta menor a 220 palabras.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: promptSistema },
                    { text: `Pregunta de los padres: ${consulta}` }
                  ]
                }
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
        // Fallback silencioso por timeout o error de conexión
      }
    }

    // Fallback inmediato a simulación guiada de triaje clínico
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
    }, 450);
  }

  function guardarApiKey(key) {
    setCustomKey(key);
    window.localStorage.setItem('hidoctor_gemini_api_key', key);
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
      {/* Encabezado y Contexto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ ...S.h2, margin: 0 }}>🤖 Doctor IA — Triaje & Soporte</h2>
        <button
          onClick={() => setMostrarConfigKey(!mostrarConfigKey)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
          title="Configurar Gemini API Key"
        >
          ⚙️
        </button>
      </div>

      {mostrarConfigKey && (
        <div style={{ ...S.card, background: COLORS.cream, border: `1.5px dashed ${COLORS.sage}` }}>
          <label style={S.label}>Opcional: Tu Google Gemini API Key</label>
          <p style={{ fontSize: 12, color: COLORS.inkLight, margin: '0 0 8px' }}>
            Si deseas conectar la IA generativa en vivo, ingresa tu clave. Si la dejas en blanco, HiDoctor operará con su base clínica de triaje offline 100% segura.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
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

      {/* Tarjeta de contexto del paciente */}
      <div style={{
        ...S.card,
        padding: '10px 14px',
        marginBottom: 12,
        background: '#FAF5EE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 6
      }}>
        <div style={{ fontSize: 12.5, color: COLORS.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>🧒 <strong>{perfilActivo?.nombre}</strong></span>
          {ultimaTemp && <span>· 🌡️ {ultimaTemp}°C</span>}
          {ultimosSintomas.length > 0 && <span>· 📋 {ultimosSintomas.join(', ')}</span>}
        </div>
        <div style={{ fontSize: 11, color: COLORS.sageDark, fontWeight: 600 }}>
          {customKey ? '🟢 Gemini Conectado' : '🛡️ Triaje Autónomo'}
        </div>
      </div>

      {/* Aviso de responsabilidad médica */}
      <div style={{
        background: COLORS.alertBg,
        borderLeft: `3px solid ${COLORS.alert}`,
        padding: '8px 12px',
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 11.5,
        color: COLORS.ink,
        lineHeight: 1.4
      }}>
        ⚠️ <strong>Orientación Preventiva:</strong> Este asistente no reemplaza el diagnóstico de un médico. Si observas riesgo vital o dificultad para respirar, acude de inmediato a urgencias.
      </div>

      {/* Caja de mensajes */}
      <div style={{
        ...S.card,
        padding: 12,
        minHeight: 280,
        maxHeight: 420,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
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
              borderRadius: m.emisor === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
              padding: '10px 14px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              fontSize: 13.5,
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
              fontSize: 10,
              opacity: 0.75,
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
            borderRadius: '16px 16px 16px 2px',
            padding: '10px 14px',
            fontSize: 13,
            color: COLORS.inkLight,
            fontStyle: 'italic'
          }}>
            ⏳ Evaluando parámetros clínicos de {perfilActivo?.nombre}...
          </div>
        )}
        <div ref={mensajesEndRef} />
      </div>

      {/* Carrusel de sugerencias rápidas */}
      <div style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 8,
        marginBottom: 10
      }}>
        {SUGERENCIAS.map((sug, i) => (
          <button
            key={i}
            onClick={() => enviarPregunta(sug)}
            style={{
              whiteSpace: 'nowrap',
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 20,
              padding: '6px 12px',
              fontSize: 12,
              cursor: 'pointer',
              color: COLORS.ink,
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 500,
              flexShrink: 0
            }}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Barra de entrada de texto */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder={`Consulta síntomas o dudas sobre ${perfilActivo?.nombre || 'el paciente'}...`}
          value={inputTexto}
          onChange={e => setInputTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviarPregunta()}
        />
        <button
          style={{
            ...S.btn,
            opacity: cargando || !inputTexto.trim() ? 0.6 : 1,
            padding: '11px 18px'
          }}
          disabled={cargando || !inputTexto.trim()}
          onClick={() => enviarPregunta()}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

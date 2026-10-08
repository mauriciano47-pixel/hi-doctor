import { useState, useEffect, useMemo, useRef } from 'react';
import { COLORS, S } from '../styles/theme';
import { uid } from '../utils/clinicalHelpers';

/**
 * ============================================================================
 * HiDoc — Motor de Triaje Clínico Offline Autónomo
 * ============================================================================
 */
export function generarRespuestaOffline(pregunta, perfilActivo, registrosDelPerfil, patrones) {
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
    respuesta = `📋 Orientación Pediátrica para ${nombre}\n\nAntecedentes en su bitácora:\n${sintomasRecientes.length > 0 ? `• Síntomas recientes: ${sintomasRecientes.join(', ')}` : '• Sin síntomas graves registrados.'}\n${ultimaTemp ? `• Última temperatura: ${ultimaTemp}°C` : ''}\n${patrones.length > 0 ? `• Patrones detectados: ${patrones.map(pat => pat.texto).join('; ')}\n` : ''}\nRecomendaciones:\n1. Mantén a ${nombre} hidratado y en reposo cómodo.\n2. Continúa registrando la evolución en HiDoc para que el médico tenga la cronología exacta.\n3. Si notas dificultad para respirar, letargo o fiebre alta continua, acude a urgencias.`;
  }

  return { texto: respuesta, esAlerta };
}

/**
 * ============================================================================
 * HiDoc — Vista de Asistente Doctor IA & Triaje Pediátrico Dual (Gemini / Offline)
 * ============================================================================
 */
export default function VistaAsistenteIA({ perfilActivo, registrosDelPerfil, patrones }) {
  const [mensajes, setMensajes] = useState([
    {
      id: 'init-1',
      emisor: 'asistente',
      texto: `👋 ¡Hola! Soy tu Doctor IA, asistente de triaje pediátrico de HiDoc.\n\nEstoy aquí para orientarte ante síntomas de ${perfilActivo?.nombre || 'tu hijo/a'}, identificar señales de alarma y preparar la consulta médica.\n\n¿Qué síntomas observas en este momento?`,
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

    // Arquitectura Híbrida & B2B Due Diligence: Soporte de Gateway/Proxy Sanitizado y Gemini Directo
    const proxyUrl = import.meta.env.VITE_AI_PROXY_URL || '';
    const apiKey = customKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';

    // Intento con IA en vivo (timeout estricto 8.000 ms per standard clínico)
    if (proxyUrl || apiKey) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const promptSistema = `Eres el Asistente Pediátrico de HiDoc.
Paciente: ${perfilActivo?.nombre || 'Niño/a'}, peso: ${perfilActivo?.pesoKg || 14} kg.
Última temperatura: ${ultimaTemp ? ultimaTemp + '°C' : 'Sin registro'}.
Síntomas: ${ultimosSintomas.join(', ') || 'Ninguno reciente'}.
Patrones: ${patrones.map(p => p.texto).join('; ') || 'Ninguno'}.
Instrucciones:
1. Responde en español empático, claro y breve (<200 palabras).
2. Si hay signos de riesgo vital (dificultad respiratoria, somnolencia extrema, fiebre >40°C, manchas rojas fijas), indícalo en el primer párrafo en MAYÚSCULAS y aconseja urgencias.
3. Este asistente orienta pero no reemplaza la atención médica.`;

        const targetUrl = proxyUrl
          ? `${proxyUrl}/api/pediatric-triage`
          : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const requestBody = proxyUrl
          ? JSON.stringify({
              consulta,
              contextoClinico: {
                paciente: perfilActivo?.nombre,
                pesoKg: perfilActivo?.pesoKg,
                ultimaTemp,
                sintomas: ultimosSintomas,
                patrones: patrones.map(p => p.texto)
              }
            })
          : JSON.stringify({
              contents: [
                { parts: [{ text: promptSistema }, { text: `Consulta de los padres: ${consulta}` }] }
              ]
            });

        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const resData = await response.json();
          const respuestaTexto = proxyUrl
            ? (resData?.respuesta || resData?.texto)
            : resData?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (respuestaTexto) {
            setMensajes(prev => [
              ...prev,
              {
                id: uid(),
                emisor: 'asistente',
                texto: respuestaTexto,
                fuente: proxyUrl ? '🛡️ Gateway B2B IA' : '⚡ Gemini IA',
                hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
                esAlerta: respuestaTexto.includes('URGENCIAS') || respuestaTexto.includes('🚨'),
              }
            ]);
            setCargando(false);
            return;
          }
        }
      } catch {
        // Fallback inmediato a triaje pediátrico offline autónomo
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
    try { window.localStorage.setItem('hidoctor_gemini_api_key', key); } catch (err) { void err; }
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
            Si deseas conectar IA en vivo, ingresa tu clave. De lo contrario, HiDoc opera con su base de triaje pediátrico offline 100% autónoma.
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

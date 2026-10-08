import { useState } from 'react';
import { COLORS, S } from '../styles/theme';
import { calcularDistancia } from '../utils/clinicalHelpers';
import { NUMEROS_EMERGENCIA, TIPOS_CONTACTO, TIPOS_LUGAR } from '../data/clinicalData';

/**
 * ============================================================================
 * HiDoc — Formulario para Registrar Nuevo Contacto Médico
 * ============================================================================
 */
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
        <select id="c-tipo" aria-label="Tipo de contacto médico" style={S.input} value={tipo} onChange={e => setTipo(e.target.value)}>
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

/**
 * ============================================================================
 * HiDoc — Vista de Directorio de Urgencias, Contactos & Geolocalización (GPS)
 * ============================================================================
 */
export default function VistaAyuda({ contactos, agregarContacto, eliminarContacto, paisSeleccionado, setPaisSeleccionado }) {
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
          aria-label="País para directorio de emergencias"
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

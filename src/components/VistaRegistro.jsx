import { useState, useRef } from 'react';
import { COLORS, S } from '../styles/theme';
import { SYMPTOM_OPTIONS, UNIT_OPTIONS } from '../data/clinicalData';
import RegistroCard from './RegistroCard';

/**
 * ============================================================================
 * HiDoc — Formulario para Anotar Síntomas y Medicamentos de un Paciente
 * ============================================================================
 */
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
        pesoBaseKg: prefillMedicamento?.pesoBaseKg || null,
        dosisMg: prefillMedicamento?.dosisMg || null,
        dosisTechoAplicada: Boolean(prefillMedicamento?.dosisTechoAplicada),
        requiereConfirmacionMedica: prefillMedicamento?.requiereConfirmacionMedica ?? true,
        descargoResponsabilidad: prefillMedicamento?.descargoResponsabilidad || 'Cálculo orientativo según peso registrado.',
        proximaDosisEstimada: prefillMedicamento?.proximaDosisEstimada || null,
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
            {prefillMedicamento?.dosisTechoAplicada && (
              <div style={{
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                borderRadius: 8,
                padding: '7px 10px',
                marginBottom: 10,
                fontSize: 11.5,
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span>🛡️</span>
                <span><strong>Dosis Techo Aplicada:</strong> Dosis ajustada al tope pediátrico seguro de {prefillMedicamento.dosisMg} mg para {prefillMedicamento.pesoBaseKg} kg.</span>
              </div>
            )}
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
                  aria-label="Unidad de medida del medicamento"
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

/**
 * ============================================================================
 * HiDoc — Vista de Registro de Síntomas & Monitoreo del Paciente
 * ============================================================================
 */
export default function VistaRegistro({
  perfilActivo,
  mostrarForm,
  setMostrarForm,
  agregarRegistro,
  registrosDelPerfil,
  patrones,
  prefillMedicamento,
  onCrearPerfilPrimero,
  onVerExpediente,
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

  const tieneAlergias = perfilActivo.alergias && perfilActivo.alergias.length > 0 && !perfilActivo.alergias.includes('Sin alergias conocidas');

  return (
    <div>
      {/* Banner Resumen EMR del Paciente */}
      <div style={{
        ...S.card,
        padding: '12px 16px',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#FAF8F5',
        borderLeft: `4px solid ${tieneAlergias ? COLORS.alert : COLORS.emerald}`
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.ink }}>{perfilActivo.nombre}</span>
            <span style={{
              fontSize: 10,
              background: '#E2E8F0',
              padding: '2px 6px',
              borderRadius: 6,
              fontWeight: 700,
              color: '#334155',
              fontFamily: 'monospace'
            }}>
              {perfilActivo.codigoExpediente || 'EXP-CLINICO'}
            </span>
            <span style={{ fontSize: 11, color: COLORS.sageDark, fontWeight: 700 }}>
              🩸 {perfilActivo.grupoSanguineo || 'O+'}
            </span>
          </div>
          <div style={{ fontSize: 11.5, color: COLORS.inkLight, marginTop: 2 }}>
            {perfilActivo.edadTexto || perfilActivo.edad || '3 años'} · {perfilActivo.pesoKg} kg
            {perfilActivo.tallaCm ? ` · ${perfilActivo.tallaCm} cm` : ''}
            {perfilActivo.imc ? ` · IMC ${perfilActivo.imc}` : ''}
          </div>
          {tieneAlergias && (
            <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {perfilActivo.alergias.map((a, i) => (
                <span key={i} style={{ fontSize: 10, background: '#FFECEC', color: '#D90429', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                  ⚠️ Alergia: {a}
                </span>
              ))}
            </div>
          )}
        </div>
        {onVerExpediente && (
          <button
            onClick={onVerExpediente}
            style={{
              background: COLORS.white,
              border: `1.5px solid ${COLORS.sage}`,
              color: COLORS.sageDark,
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            📁 Ficha EMR
          </button>
        )}
      </div>
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

import { useState } from 'react';
import { COLORS, S } from '../styles/theme';

export default function CredencialClinicaPediatrica({ perfilActivo, onEditar, onNuevoPaciente, onIrABitacora }) {
  const [copiado, setCopiado] = useState(false);

  if (!perfilActivo) {
    return (
      <div style={S.card}>
        <p style={{ margin: 0, color: COLORS.inkLight }}>No hay expediente seleccionado.</p>
      </div>
    );
  }

  const tieneAlergias = perfilActivo.alergias && perfilActivo.alergias.length > 0 && !perfilActivo.alergias.includes('Sin alergias conocidas');

  function copiarExpedienteTexto() {
    let t = `📋 EXPEDIENTE CLÍNICO PEDIÁTRICO\n`;
    t += `Código: ${perfilActivo.codigoExpediente || 'S/N'}\n`;
    t += `Paciente: ${perfilActivo.nombre} (${perfilActivo.edadTexto || perfilActivo.edad || 'N/A'})\n`;
    t += `Grupo Etario: ${perfilActivo.grupoEtario || 'N/A'} | Sexo: ${perfilActivo.sexo || 'N/A'}\n`;
    t += `Somatometría: ${perfilActivo.pesoKg} kg | Talla: ${perfilActivo.tallaCm || '--'} cm | IMC: ${perfilActivo.imc || '--'}\n`;
    t += `Grupo Sanguíneo: ${perfilActivo.grupoSanguineo || 'No determinado'}\n`;
    t += `Alergias: ${(perfilActivo.alergias || []).join(', ') || 'Sin alergias declaradas'}\n`;
    t += `Antecedentes: ${(perfilActivo.antecedentes || []).join(', ') || 'Sin antecedentes patológicos'}\n`;
    t += `Vacunación: ${perfilActivo.vacunasAlDia ? 'Al día' : 'Pendiente'}\n`;
    t += `Tutor: ${perfilActivo.tutor} (${perfilActivo.parentesco || 'Tutor'}) - Tel: ${perfilActivo.telefonoUrgencia || 'N/A'}\n`;
    t += `Centro de Referencia: ${perfilActivo.centroSalud || 'No registrado'}\n`;
    t += `Previsión: ${perfilActivo.seguroSalud || 'Fonasa'}\n`;
    t += `Fecha de Emisión: ${new Date().toLocaleDateString('es-CL')} (HiDoc EMR Pro)`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(t).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    } else {
      try {
        const ta = document.createElement('textarea');
        ta.value = t;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      } catch (err) { void err; }
    }
  }

  return (
    <div>
      {/* Tarjeta Credencial Médica Hospitalaria */}
      <div style={{
        ...S.card,
        padding: 0,
        overflow: 'hidden',
        border: `1.5px solid ${COLORS.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        marginBottom: 16
      }}>
        {/* Cabecera Estilo Hospitalario */}
        <div style={{
          background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
          color: COLORS.white,
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.85, fontWeight: 700 }}>
              Ficha Clínica EMR · HiDoc
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Quicksand, sans-serif' }}>
              Expediente Clínico Pediátrico
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 8,
            padding: '4px 8px',
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'monospace'
          }}>
            {perfilActivo.codigoExpediente || 'HC-PED-2026-9481'}
          </div>
        </div>

        <div style={{ padding: 18 }}>
          {/* Fila Principal de Identidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: perfilActivo.sexo === 'Masculino' ? '#E3F2FD' : '#FCE4EC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              flexShrink: 0
            }}>
              {perfilActivo.sexo === 'Masculino' ? '🧒' : '👧'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h2 style={{ ...S.h2, fontSize: 18, margin: 0 }}>{perfilActivo.nombre}</h2>
                <span style={{
                  fontSize: 11,
                  background: COLORS.cream,
                  border: `1px solid ${COLORS.border}`,
                  padding: '2px 7px',
                  borderRadius: 10,
                  fontWeight: 700,
                  color: COLORS.sageDark
                }}>
                  🩸 {perfilActivo.grupoSanguineo || 'O+'}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: COLORS.inkLight, marginTop: 3 }}>
                {perfilActivo.edadTexto || perfilActivo.edad || '3 años'} · {perfilActivo.grupoEtario || 'Preescolar'} · {perfilActivo.sexo || 'Femenino'}
              </div>
            </div>
          </div>

          {/* Cuadrícula Somatométrica */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
            marginBottom: 16
          }}>
            <div style={{ background: '#FFF8F4', borderRadius: 10, padding: '10px 8px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 10, color: COLORS.sageDark, fontWeight: 700, textTransform: 'uppercase' }}>Peso Real</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.ink, margin: '2px 0' }}>{perfilActivo.pesoKg} <span style={{ fontSize: 12 }}>kg</span></div>
              <div style={{ fontSize: 10, color: COLORS.inkLight }}>Para dosis exactas</div>
            </div>
            <div style={{ background: '#FFF8F4', borderRadius: 10, padding: '10px 8px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 10, color: COLORS.sageDark, fontWeight: 700, textTransform: 'uppercase' }}>Estatura</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.ink, margin: '2px 0' }}>{perfilActivo.tallaCm || '--'} <span style={{ fontSize: 12 }}>cm</span></div>
              <div style={{ fontSize: 10, color: COLORS.inkLight }}>Crecimiento</div>
            </div>
            <div style={{ background: '#FFF8F4', borderRadius: 10, padding: '10px 8px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 10, color: COLORS.sageDark, fontWeight: 700, textTransform: 'uppercase' }}>IMC Estimado</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.ink, margin: '2px 0' }}>{perfilActivo.imc || '--'}</div>
              <div style={{ fontSize: 10, color: '#2A9D8F', fontWeight: 600 }}>{perfilActivo.clasificacionIMC ? perfilActivo.clasificacionIMC.slice(0, 12) : 'Normal'}</div>
            </div>
          </div>

          {/* Banda de Alergias & Bioseguridad Hospitalaria */}
          <div style={{
            background: tieneAlergias ? '#FFF5F5' : '#F0FDF4',
            borderLeft: `4px solid ${tieneAlergias ? COLORS.alert : '#2A9D8F'}`,
            borderRadius: 8,
            padding: '10px 12px',
            marginBottom: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span>{tieneAlergias ? '⚠️' : '✓'}</span>
              <strong style={{ fontSize: 12, color: tieneAlergias ? COLORS.alert : '#1B4332', textTransform: 'uppercase' }}>
                {tieneAlergias ? 'Alertas de Alergia Registradas:' : 'Bioseguridad Médica:'}
              </strong>
            </div>
            {tieneAlergias ? (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                {perfilActivo.alergias.map((a, i) => (
                  <span key={i} style={{
                    background: '#FFE3E3',
                    color: '#D90429',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    border: '1px solid #FFC9C9'
                  }}>
                    {a}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: '#1B4332' }}>
                Sin alergias medicamentosas ni alimentarias declaradas.
              </p>
            )}
          </div>

          {/* Antecedentes y Vacunación */}
          <div style={{ background: '#FAF9F6', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 12.5 }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: COLORS.inkLight, fontWeight: 600 }}>Antecedentes clínicos: </span>
              <strong style={{ color: COLORS.ink }}>
                {perfilActivo.antecedentes && perfilActivo.antecedentes.length > 0 ? perfilActivo.antecedentes.join(', ') : 'Sin antecedentes patológicos declarados'}
              </strong>
            </div>
            <div>
              <span style={{ color: COLORS.inkLight, fontWeight: 600 }}>Esquema de Vacunación: </span>
              <strong style={{ color: perfilActivo.vacunasAlDia !== false ? '#2A9D8F' : COLORS.alert }}>
                {perfilActivo.vacunasAlDia !== false ? '✓ Al día para su edad' : '⚠️ Dosis de vacunación pendiente'}
              </strong>
            </div>
          </div>

          {/* Tutor y Cobertura de Urgencia */}
          <div style={{ background: '#FAF9F6', borderRadius: 10, padding: '12px 14px', marginBottom: 18, fontSize: 12.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <span style={{ color: COLORS.inkLight }}>Tutor responsable: </span>
                <strong>{perfilActivo.tutor || 'Familia'} ({perfilActivo.parentesco || 'Tutor'})</strong>
              </div>
              {perfilActivo.telefonoUrgencia && (
                <a href={`tel:${perfilActivo.telefonoUrgencia}`} style={{ color: COLORS.sageDark, fontWeight: 700, textDecoration: 'none' }}>
                  📞 {perfilActivo.telefonoUrgencia}
                </a>
              )}
            </div>
            <div>
              <span style={{ color: COLORS.inkLight }}>Centro de referencia: </span>
              <strong>{perfilActivo.centroSalud || 'No registrado'}</strong>
              {perfilActivo.seguroSalud && <span style={{ color: COLORS.inkLight }}> · {perfilActivo.seguroSalud}</span>}
            </div>
          </div>

          {/* Botonera de Acciones EMR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={onEditar}
                style={{ ...S.btn, flex: 1, padding: '12px', fontSize: 13 }}
              >
                ✏️ Modificar Ficha Clínica
              </button>
              <button
                onClick={copiarExpedienteTexto}
                style={{ ...S.btnOutline, flex: 1, padding: '12px', fontSize: 13 }}
              >
                {copiado ? '✓ ¡Copiado!' : '📋 Copiar Ficha'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={onNuevoPaciente}
                style={{ ...S.btnOutline, flex: 1, padding: '10px', fontSize: 12.5, color: COLORS.ink }}
              >
                ➕ Agregar Hermano/a (Nuevo Paciente)
              </button>
              <button
                onClick={onIrABitacora}
                style={{ ...S.btnTerracotta, flex: 1, padding: '10px', fontSize: 12.5, textAlign: 'center' }}
              >
                📝 Ir a Bitácora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

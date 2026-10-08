import { useState, useMemo } from 'react';
import { COLORS, S } from '../styles/theme';
import {
  detectarAlergiaCruzadaAINE,
  PRESENTACIONES_DOSIS,
  calcularDosisMilimetrica
} from '../utils/clinicalPharmacology';

/**
 * ============================================================================
 * HiDoc — Calculadora Canónica de Dosis Pediátrica por Peso (Algoritmo ATC Safe)
 * ============================================================================
 */
export default function VistaCalculadoraDosis({ perfilActivo, onTransferirDosis }) {
  const [farmaco, setFarmaco] = useState('paracetamol'); // paracetamol | ibuprofeno
  const [pesoKg, setPesoKg] = useState(() => perfilActivo?.pesoKg ? String(perfilActivo.pesoKg) : '14');
  const [presentacion, setPresentacion] = useState('jarabe120');
  const [confirmacionLeida, setConfirmacionLeida] = useState(false);

  // Detección avanzada de alergias y reactividad cruzada con taxonomía ATC M01A
  const alergiaCruzada = useMemo(() => {
    return detectarAlergiaCruzadaAINE(perfilActivo?.alergias);
  }, [perfilActivo?.alergias]);

  const bloqueadoPorAlergia = farmaco === 'ibuprofeno' && alergiaCruzada.tieneAlergia;

  const listaPres = PRESENTACIONES_DOSIS[farmaco] || PRESENTACIONES_DOSIS.paracetamol;
  const presActual = useMemo(() => {
    return listaPres.find(p => p.id === presentacion) || listaPres[0];
  }, [listaPres, presentacion]);

  const pKg = Math.max(1, parseFloat(pesoKg) || 0);

  // Cálculo canónico con algoritmo farmacológico blindado
  const calculo = useMemo(() => {
    return calcularDosisMilimetrica(pKg, farmaco, presActual.mgPorMl, presActual.esGotas);
  }, [farmaco, pKg, presActual]);

  function aplicarARegistro() {
    if (bloqueadoPorAlergia || !confirmacionLeida || !calculo.valido) return;
    onTransferirDosis({
      nombre: `${calculo.farmaco} (${presActual.nombre})`,
      dosis: presActual.esGotas ? String(calculo.dosisGotas) : String(calculo.dosisMl),
      unidad: presActual.esGotas ? 'gotas' : 'ml',
      intervaloHoras: calculo.intervaloRecomendadoHoras,
      pesoBaseKg: calculo.pesoBaseKg,
      dosisMg: calculo.dosisMg,
      dosisTechoAplicada: calculo.dosisTechoAplicada,
      requiereConfirmacionMedica: calculo.requiereConfirmacionMedica,
      descargoResponsabilidad: calculo.descargoResponsabilidad,
      proximaDosisEstimada: calculo.proximaDosisEstimada,
      maxDosisDiariaMg: calculo.maxDosisDiariaMg
    });
  }

  return (
    <div>
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h2 style={{ ...S.h2, fontSize: 17, margin: 0 }}>
            ⚖️ Calculadora Pediátrica de Dosis por Peso
          </h2>
          <span style={{ fontSize: 11, background: '#E0F2FE', color: '#0369A1', padding: '3px 7px', borderRadius: 6, fontWeight: 700 }}>
            Algoritmo ATC Safe v2.6.0
          </span>
        </div>
        <p style={{ fontSize: 13, color: COLORS.inkLight, margin: '0 0 16px', lineHeight: 1.5 }}>
          La dosificación pediátrica se calcula estrictamente por el <strong>peso real en kg</strong> con aplicación automática de <strong>dosis techo</strong> para evitar sobredosis.
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
              background: farmaco === 'ibuprofeno' ? (alergiaCruzada.tieneAlergia ? COLORS.alert : COLORS.sage) : COLORS.white,
              color: farmaco === 'ibuprofeno' ? COLORS.white : (alergiaCruzada.tieneAlergia ? COLORS.alert : COLORS.ink),
              border: `1.5px solid ${alergiaCruzada.tieneAlergia ? COLORS.alert : COLORS.sage}`,
            }}
            onClick={() => { setFarmaco('ibuprofeno'); setPresentacion('jarabe100'); }}
          >
            🔥 Ibuprofeno {alergiaCruzada.tieneAlergia ? '⚠️ (Alergia Cruzada)' : ''}
          </button>
        </div>

        {/* Alerta de Contraindicación Médica Estricta por Taxonomía de Alergias */}
        {bloqueadoPorAlergia && (
          <div style={{
            background: '#FFF1F2',
            border: '2px solid #E11D48',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 16,
            color: '#881337'
          }}>
            <div style={{ fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              🚨 CONTRAINDICACIÓN MÉDICA CRÍTICA (ATC M01A)
            </div>
            <p style={{ fontSize: 12.5, margin: '6px 0 0', lineHeight: 1.45 }}>
              <strong>{perfilActivo?.nombre}</strong> tiene registrada una alergia a <strong>&quot;{alergiaCruzada.coincidencia}&quot;</strong> en su Ficha Clínica.
              Debido al riesgo severo de reactividad cruzada en la familia de Antiinflamatorios No Esteroideos (AINEs), la administración de <strong>Ibuprofeno queda bloqueada</strong> por seguridad clínica. Utilice Paracetamol previa indicación o consulte de urgencia a su pediatra.
            </p>
          </div>
        )}

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
            max="45"
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
            aria-label="Presentación comercial del envase"
            style={S.input}
            value={presentacion}
            onChange={e => setPresentacion(e.target.value)}
          >
            {listaPres.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        {/* Alerta Destacada de Dosis Techo Aplicada */}
        {calculo.dosisTechoAplicada && (
          <div style={{
            background: '#FEF3C7',
            border: '1.5px solid #F59E0B',
            borderRadius: 10,
            padding: '10px 12px',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            color: '#92400E'
          }}>
            <span style={{ fontSize: 16 }}>🛡️</span>
            <div style={{ fontSize: 12, lineHeight: 1.45 }}>
              <strong>Dosis Techo Aplicada por Seguridad Pediátrica:</strong> Para {pKg} kg, el cálculo teórico multiplicativo ({calculo.dosisCalculadaSinTopeMg} mg) superó el límite pediátrico de seguridad por toma ({calculo.maxDosisUnicaMg} mg). Se ajustó automáticamente al techo seguro para prevenir sobredosis hepática o renal.
            </div>
          </div>
        )}

        {/* Resultado Destacado */}
        <div style={{
          background: '#FFF4EE',
          border: `2px solid ${calculo.dosisTechoAplicada ? '#F59E0B' : COLORS.sageLight}`,
          borderRadius: 14,
          padding: 16,
          marginBottom: 16,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 12, color: COLORS.sageDark, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Dosis Recomendada por Toma {calculo.dosisTechoAplicada ? '(Tope Seguro)' : ''}
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: COLORS.sageDark, margin: '6px 0' }}>
            {presActual.esGotas ? `${calculo.dosisGotas} gotas` : `${calculo.dosisMl} ml`}
          </div>
          <div style={{ fontSize: 13, color: COLORS.ink, fontWeight: 600 }}>
            Equivalente a ≈ {calculo.dosisMg} mg ({calculo.rangoMg})
          </div>
          <div style={{ fontSize: 12, color: COLORS.inkLight, marginTop: 4 }}>
            🕒 {calculo.intervaloTexto}
          </div>
          <div style={{ fontSize: 11.5, color: COLORS.inkLight, marginTop: 6, borderTop: '1px dashed #CBD5E1', paddingTop: 6 }}>
            📊 Límite acumulado seguro: Máximo {calculo.maxDosisDiariaMg} mg en 24 horas ({farmaco === 'paracetamol' ? '60 mg/kg/día' : '30-40 mg/kg/día'})
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

        {/* Checkbox de Confirmación y Consentimiento Clínico Responsable */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #CBD5E1',
          borderRadius: 10,
          padding: '11px 13px',
          marginBottom: 16
        }}>
          <label htmlFor="chk-verificacion-clinica" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', margin: 0 }}>
            <input
              type="checkbox"
              id="chk-verificacion-clinica"
              checked={confirmacionLeida}
              onChange={e => setConfirmacionLeida(e.target.checked)}
              style={{ marginTop: 2, accentColor: COLORS.sage, width: 17, height: 17, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 12, color: COLORS.ink, lineHeight: 1.45 }}>
              <strong>Cotejo y Responsabilidad Médica:</strong> Confirmo que el peso ({pKg} kg) es actual y he cotejado en el envase físico que la concentración es exactamente <em>{presActual.nombre}</em>. Entiendo que este cálculo es un asistente orientativo y no reemplaza la indicación del pediatra ni el prospecto oficial.
            </span>
          </label>
        </div>

        <button
          style={{
            ...S.btn,
            width: '100%',
            padding: '12px 16px',
            background: bloqueadoPorAlergia ? '#9E2A2B' : (!confirmacionLeida ? '#94A3B8' : COLORS.sage),
            opacity: bloqueadoPorAlergia ? 0.7 : (!confirmacionLeida ? 0.85 : 1),
            cursor: (bloqueadoPorAlergia || !confirmacionLeida) ? 'not-allowed' : 'pointer',
            color: '#FFFFFF'
          }}
          onClick={aplicarARegistro}
          disabled={bloqueadoPorAlergia || !confirmacionLeida}
        >
          {bloqueadoPorAlergia
            ? '❌ Fármaco Contraindicado por Alergia Cruzada'
            : (!confirmacionLeida
              ? '⚠️ Confirme la verificación del envase arriba para registrar'
              : `📋 Registrar esta dosis en la bitácora de ${perfilActivo?.nombre || 'paciente'}`)}
        </button>
      </div>
    </div>
  );
}

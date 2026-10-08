import { COLORS, S } from '../styles/theme';
import { calcularProximaDosis, formatFecha } from '../utils/clinicalHelpers';

/**
 * ============================================================================
 * HiDoc — Tarjeta de Registro Clínico (Event Card)
 * ============================================================================
 */
export default function RegistroCard({ registro }) {
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
          {registro.medicamento.dosisTechoAplicada && (
            <span style={{ marginLeft: 6, fontSize: 10.5, background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
              🛡️ Dosis Techo Segura
            </span>
          )}
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

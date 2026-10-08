import { COLORS, S } from '../styles/theme';
import GraficaTemperatura from './GraficaTemperatura';
import RegistroCard from './RegistroCard';

/**
 * ============================================================================
 * HiDoc — Vista de Historial Clínico, Cronología y Curva Térmica
 * ============================================================================
 */
export default function VistaHistorial({ perfilActivo, registrosDelPerfil, eliminarRegistro, onVerResumen }) {
  if (!perfilActivo) {
    return (
      <div style={S.card}>
        <p style={{ margin: 0, color: COLORS.inkLight }}>Selecciona o crea un paciente para revisar su historial.</p>
      </div>
    );
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

import { COLORS, S } from '../styles/theme';
import { GUIA_EDUCATIVA } from '../data/clinicalData';

/**
 * ============================================================================
 * HiDoc — Vista de Guía de Banderas Rojas y Signos de Alarma Pediátricos
 * ============================================================================
 */
export default function VistaGuia() {
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

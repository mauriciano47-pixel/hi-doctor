import { COLORS } from '../styles/theme';

/**
 * ============================================================================
 * HiDoc — Pie de Página, Accesos Directos PWA / B2B y Titularidad Canónica
 * ============================================================================
 */
export default function FooterEMR({ marcaBlanca, onAbrirMarcaBlanca, esPremiumActivo, onAbrirPremium }) {
  return (
    <footer style={{ textAlign: 'center', marginTop: 28, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
        <a
          href="./download.html"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.sage,
            textDecoration: 'none',
            padding: '5px 12px',
            borderRadius: 20,
            background: '#FFF0EA',
            border: `1px solid ${COLORS.sage}`
          }}
        >
          📲 Instalar como App PWA
        </a>
        <button
          onClick={onAbrirMarcaBlanca}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 700,
            color: '#2A9D8F',
            background: '#E8F5F3',
            border: '1px solid #2A9D8F',
            borderRadius: 20,
            padding: '5px 12px',
            cursor: 'pointer'
          }}
          aria-label="Abrir configuración de Marca Blanca o Clínica"
        >
          🏥 {marcaBlanca?.activo ? 'Clínica Activa' : 'Modo Clínica B2B'}
        </button>
        <button
          onClick={onAbrirPremium}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 700,
            color: '#C4624A',
            background: '#FFF4EE',
            border: '1px solid #F2A65A',
            borderRadius: 20,
            padding: '5px 12px',
            cursor: 'pointer'
          }}
          aria-label="Ver planes de suscripción familiar y monetización"
        >
          ⭐ {esPremiumActivo ? 'Plan Pro Activo' : 'Planes & Precios B2C'}
        </button>
      </div>
      <p style={{
        fontSize: 11.5,
        letterSpacing: 0.5,
        color: COLORS.inkLight,
        fontFamily: 'Nunito, sans-serif'
      }}>
        HiDoc · Desarrollado por Mauricio Uribe Maldonado · Privacidad Local 100% Offline-First
      </p>
    </footer>
  );
}

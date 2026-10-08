import { S } from '../styles/theme';

/**
 * ============================================================================
 * HiDoc — Barra de Navegación Inferior Móvil / PWA Persistente
 * ============================================================================
 */
export default function NavbarEMR({ vista, cambiarVista, onIrAExpediente }) {
  return (
    <nav style={S.bottomNav} aria-label="Navegación principal de HiDoc">
      <button style={S.navBtn(vista === 'expediente')} onClick={onIrAExpediente} aria-label="Pestaña Expediente Clínico">
        <span style={{ fontSize: 18 }}>📁</span>
        <span>Ficha</span>
      </button>
      <button style={S.navBtn(vista === 'registro')} onClick={() => cambiarVista('registro')} aria-label="Pestaña Registro">
        <span style={{ fontSize: 18 }}>📝</span>
        <span>Registro</span>
      </button>
      <button style={S.navBtn(vista === 'historial')} onClick={() => cambiarVista('historial')} aria-label="Pestaña Curva e Historial">
        <span style={{ fontSize: 18 }}>📊</span>
        <span>Curva</span>
      </button>
      <button style={S.navBtn(vista === 'dosis')} onClick={() => cambiarVista('dosis')} aria-label="Pestaña Calculadora de Dosis por Peso">
        <span style={{ fontSize: 18 }}>💊</span>
        <span>Dosis</span>
      </button>
      <button style={S.navBtn(vista === 'ia')} onClick={() => cambiarVista('ia')} aria-label="Pestaña Doctor IA">
        <span style={{ fontSize: 18 }}>🤖</span>
        <span>Doctor IA</span>
      </button>
      <button style={S.navBtn(vista === 'ayuda')} onClick={() => cambiarVista('ayuda')} aria-label="Pestaña Emergencias y Ayuda">
        <span style={{ fontSize: 18 }}>🆘</span>
        <span>Ayuda</span>
      </button>
    </nav>
  );
}

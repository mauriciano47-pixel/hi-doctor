/**
 * ============================================================================
 * HiDoc — Sistema de Diseño, Paleta de Color & Estilos Compartidos (Theme)
 * ============================================================================
 */

export const COLORS = {
  cream: '#FFF7F0',
  sage: '#E07A5F',
  sageLight: '#F0B8A8',
  sageDark: '#C4624A',
  terracotta: '#F2A65A',
  terracottaDark: '#D88C3D',
  ink: '#2D2926',
  inkLight: '#59524D',
  border: '#F0E4DA',
  white: '#FFFFFF',
  alert: '#D95550',
  alertBg: '#FDE8E7',
  emerald: '#2A9D8F',
  emeraldLight: '#E8F5F3',
};

// Estilos compartidos optimizados para pantallas táctiles y escritorio
export const S = {
  app: { fontFamily: 'Nunito, sans-serif', background: COLORS.cream, minHeight: '100vh', color: COLORS.ink, padding: '20px 16px 95px' },
  h1: { fontFamily: 'Quicksand, sans-serif', fontSize: 23, fontWeight: 700, margin: '0 0 4px', color: COLORS.ink },
  h2: { fontFamily: 'Quicksand, sans-serif', fontSize: 17.5, fontWeight: 700, margin: '0 0 12px', color: COLORS.ink },
  sub: { fontSize: 13.5, color: COLORS.inkLight, margin: '0 0 18px', lineHeight: 1.5 },
  card: { background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' },
  btn: { background: COLORS.sage, color: COLORS.white, border: 'none', borderRadius: 12, padding: '11px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnOutline: { background: 'transparent', color: COLORS.sageDark, border: `1.5px solid ${COLORS.sage}`, borderRadius: 12, padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnTerracotta: { background: COLORS.terracotta, color: COLORS.white, border: 'none', borderRadius: 12, padding: '11px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' },
  input: { width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: 10, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: 'Nunito, sans-serif', background: COLORS.white, color: COLORS.ink },
  label: { fontSize: 13, color: COLORS.inkLight, marginBottom: 5, display: 'block', fontWeight: 600, fontFamily: 'Nunito, sans-serif' },
  chip: (active) => ({
    padding: '6px 13px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontWeight: 600,
    border: `1.5px solid ${active ? COLORS.sage : COLORS.border}`,
    background: active ? COLORS.sage : COLORS.white, color: active ? COLORS.white : COLORS.ink,
    fontFamily: 'Nunito, sans-serif', transition: 'all 0.15s ease',
  }),
  bottomNav: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    maxWidth: 560, margin: '0 auto',
    display: 'flex', background: COLORS.white,
    borderTop: `1px solid ${COLORS.border}`,
    padding: '6px 0 12px', zIndex: 100,
    boxShadow: '0 -2px 14px rgba(0,0,0,0.06)',
  },
  navBtn: (active) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    padding: '4px 0', fontSize: 10, fontWeight: active ? 700 : 500,
    color: active ? COLORS.sage : COLORS.inkLight, cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif', background: 'none', border: 'none',
  }),
};

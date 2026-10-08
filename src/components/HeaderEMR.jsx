import { COLORS } from '../styles/theme';

/**
 * ============================================================================
 * HiDoc — Cabecera de Identidad Clínica Pediátrica, Sesión y Acciones Rápidas
 * ============================================================================
 */
export default function HeaderEMR({
  perfilActivo,
  usuarioAutenticado,
  onLogout,
  esPremiumActivo,
  onAbrirPremium,
  marcaBlanca,
  onAbrirMarcaBlanca,
  vista,
  onVerExpediente,
  onCargarDemo,
  onSimularEvolucion,
}) {
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 23, fontWeight: 700, margin: '0 0 4px', color: COLORS.ink, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="28">
              <rect width="512" height="512" rx="128" fill="#E07A5F"/>
              <path d="M256,416 C256,416 112,288 112,176 C112,105 170,48 240,48 C251,48 256,53 256,53 C256,53 261,48 272,48 C342,48 400,105 400,176 C400,288 256,416 256,416 Z" fill="#FFF7F0"/>
              <rect x="224" y="128" width="64" height="160" rx="16" fill="#2A9D8F"/>
              <rect x="176" y="176" width="160" height="64" rx="16" fill="#2A9D8F"/>
            </svg>
            HiDoc
          </h1>
          <p style={{ fontSize: 12, color: COLORS.inkLight, margin: 0, lineHeight: 1.5 }}>
            {perfilActivo ? (
              <span>
                <strong>{perfilActivo.nombre}</strong> · {perfilActivo.codigoExpediente || 'EXP-CLINICO'}
              </span>
            ) : (
              'Expediente Pediátrico Hospitalario & Doctor IA'
            )}
          </p>
          {usuarioAutenticado && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <span style={{ fontSize: 11, color: COLORS.inkLight, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {usuarioAutenticado.proveedor === 'google' ? '🟢 Google:' : '👤'} <strong>{usuarioAutenticado.nombre.split(' ')[0]}</strong>
              </span>
              <button
                type="button"
                onClick={onLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.sageDark,
                  fontSize: 10.5,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
                title="Cerrar sesión familiar y volver al lobby"
              >
                (Salir)
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            onClick={onAbrirPremium}
            style={{
              background: esPremiumActivo ? 'linear-gradient(135deg, #F2A65A, #E07A5F)' : COLORS.white,
              color: esPremiumActivo ? '#FFF' : '#C4624A',
              border: '1.5px solid #F2A65A',
              borderRadius: 8,
              padding: '6px 9px',
              fontSize: 11.5,
              cursor: 'pointer',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            title="Ver planes de suscripción familiar y monetización B2C"
            aria-label="Abrir planes de monetización"
          >
            ⭐ {esPremiumActivo ? 'Pro Activo' : 'Planes / SaaS'}
          </button>
          <button
            onClick={onAbrirMarcaBlanca}
            style={{
              background: marcaBlanca?.activo ? '#2A9D8F' : COLORS.white,
              color: marcaBlanca?.activo ? COLORS.white : '#2A9D8F',
              border: '1.5px solid #2A9D8F',
              borderRadius: 8,
              padding: '6px 9px',
              fontSize: 11.5,
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            title="Personalizar modo marca blanca / clínica B2B"
            aria-label="Abrir personalización de marca blanca o clínica"
          >
            🏥 {marcaBlanca?.activo ? 'Clínica ON' : 'B2B'}
          </button>
          <button
            onClick={onVerExpediente}
            style={{
              background: vista === 'expediente' ? COLORS.sage : COLORS.white,
              color: vista === 'expediente' ? COLORS.white : COLORS.ink,
              border: `1.5px solid ${COLORS.sage}`,
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 11.5,
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            title="Ver expediente clínico y credencial médica"
            aria-label="Ver expediente clínico completo"
          >
            📋 Ficha EMR
          </button>
          <button
            onClick={onCargarDemo}
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: '6px 9px',
              fontSize: 11.5,
              color: COLORS.sageDark,
              cursor: 'pointer',
              fontWeight: 600
            }}
            title="Cargar cohorte de 4 casos clínicos pediátricos (Sofía, Mateo, Lucas, Emma)"
            aria-label="Cargar casos clínicos de prueba"
          >
            🧪 4 Casos Clínicos
          </button>
          <button
            onClick={onSimularEvolucion}
            style={{
              background: 'rgba(42, 157, 143, 0.1)',
              border: '1px solid #2A9D8F',
              borderRadius: 8,
              padding: '6px 9px',
              fontSize: 11.5,
              color: '#2A9D8F',
              cursor: 'pointer',
              fontWeight: 700
            }}
            title="Simular un nuevo registro clínico hoy para alimentar la curva térmica en tiempo real"
            aria-label="Simular nuevo registro clínico hoy"
          >
            ⚡ +1 Registro Hoy
          </button>
        </div>
      </header>

      {/* Banner de Modo Clínica / Marca Blanca Institucional */}
      {marcaBlanca?.activo && (
        <div style={{
          background: 'linear-gradient(135deg, #2A9D8F, #1E7268)',
          color: '#FFFFFF',
          padding: '10px 14px',
          borderRadius: 12,
          marginBottom: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          boxShadow: '0 2px 8px rgba(42, 157, 143, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🏥</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13 }}>
                {marcaBlanca.nombreClinica || 'Centro Pediátrico Especializado'}
              </div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>
                Servicio Institucional · Guardia 24/7:{' '}
                <a href={`tel:${marcaBlanca.telefonoUrgencia || '+56987654321'}`} style={{ color: '#FFF', fontWeight: 700, textDecoration: 'underline' }}>
                  {marcaBlanca.telefonoUrgencia || '+56 9 8765 4321'}
                </a>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {marcaBlanca.linkReserva && (
              <a
                href={marcaBlanca.linkReserva}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#FFFFFF',
                  color: '#2A9D8F',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '5px 10px',
                  borderRadius: 6,
                  textDecoration: 'none'
                }}
              >
                📅 Reservar Hora
              </a>
            )}
            <button
              onClick={onAbrirMarcaBlanca}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 11,
                fontWeight: 700,
                padding: '5px 8px',
                borderRadius: 6,
                cursor: 'pointer'
              }}
              aria-label="Ajustar configuración de Modo Clínica"
            >
              ⚙️
            </button>
          </div>
        </div>
      )}
    </>
  );
}

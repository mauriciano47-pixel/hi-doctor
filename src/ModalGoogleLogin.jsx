export default function ModalGoogleLogin({
  cargandoGoogle,
  confirmarLoginGoogle,
  modoCustomGoogle,
  setModoCustomGoogle,
  correoGoogleCustom,
  setCorreoGoogleCustom,
  onCerrar
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16
      }}
      onClick={onCerrar}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '24px 22px',
          maxWidth: 380,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid #E5E7EB'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" style={{ margin: '0 auto 8px' }}>
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.97 0 12s.45 3.85 1.24 5.42l4.04-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 4px', color: '#1F2937' }}>
            Acceder con Google
          </h2>
          <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
            para continuar en <strong style={{ color: '#111827' }}>HiDoc Pediátrico</strong>
          </p>
        </div>

        {cargandoGoogle ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: 32,
                height: 32,
                border: '3px solid #E5E7EB',
                borderTopColor: '#4285F4',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 12px'
              }}
            />
            <p style={{ fontSize: 13, color: '#4B5563', fontWeight: 600, margin: 0 }}>
              Conectando con Google Identity Services...
            </p>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() =>
                confirmarLoginGoogle({
                  nombre: 'Mauricio Uribe Maldonado',
                  email: 'maurouribe602@gmail.com',
                  avatar: 'https://lh3.googleusercontent.com/a/default-user'
                })
              }
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid #E5E7EB',
                background: '#F9FAFB',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: 10,
                transition: 'background 0.15s ease'
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4285F4, #34A853)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16
                }}
              >
                M
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827' }}>
                  Mauricio Uribe Maldonado
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  maurouribe602@gmail.com
                </div>
              </div>
            </button>

            {!modoCustomGoogle ? (
              <button
                type="button"
                onClick={() => setModoCustomGoogle(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 12,
                  border: '1px dashed #D1D5DB',
                  background: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#4B5563',
                  marginBottom: 16
                }}
              >
                <span style={{ fontSize: 18 }}>➕</span>
                <span>Usar otra cuenta de Google</span>
              </button>
            ) : (
              <div style={{ marginBottom: 14, background: '#F9FAFB', padding: 12, borderRadius: 12 }}>
                <label htmlFor="google-custom-email" style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Ingresa tu correo @gmail.com:
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    id="google-custom-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="usuario@gmail.com"
                    value={correoGoogleCustom}
                    onChange={(e) => setCorreoGoogleCustom(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid #D1D5DB',
                      fontSize: 13
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (correoGoogleCustom && correoGoogleCustom.includes('@')) {
                        confirmarLoginGoogle({
                          nombre: correoGoogleCustom.split('@')[0],
                          email: correoGoogleCustom.trim().toLowerCase(),
                          avatar: 'https://lh3.googleusercontent.com/a/default-user'
                        });
                      }
                    }}
                    style={{
                      background: '#4285F4',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Entrar
                  </button>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <button
                type="button"
                onClick={onCerrar}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

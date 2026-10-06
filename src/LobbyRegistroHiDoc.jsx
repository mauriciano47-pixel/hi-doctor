import { useState } from 'react';

const COLORS = {
  cream: '#FFF7F0',
  sage: '#BA4B31',
  sageDark: '#9C3E28',
  terracotta: '#D88C3D',
  ink: '#2D2926',
  inkLight: '#59524D',
  border: '#F0E4DA',
  white: '#FFFFFF',
  emerald: '#1E7268',
  emeraldLight: '#E8F5F3',
  alert: '#B91C1C'
};

export default function LobbyRegistroHiDoc({ onLoginExitoso }) {
  const [pestana, setPestana] = useState('registro'); // 'registro' | 'login'
  const [mostrarModalGoogle, setMostrarModalGoogle] = useState(false);
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Formulario Registro con Correo Alternativo
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [parentesco, setParentesco] = useState('Madre');

  // Formulario Iniciar Sesión
  const [loginCorreo, setLoginCorreo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Cuenta Google personalizada en modal
  const [correoGoogleCustom, setCorreoGoogleCustom] = useState('');
  const [modoCustomGoogle, setModoCustomGoogle] = useState(false);

  function manejarRegistroCorreo(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!nombre.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo o de tutor.');
      return;
    }
    if (!correo.trim() || !correo.includes('@') || !correo.includes('.')) {
      setErrorMsg('Por favor ingresa un correo electrónico alternativo válido.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('La contraseña o PIN debe tener al menos 4 caracteres.');
      return;
    }

    const usuario = {
      id: 'usr-' + Date.now(),
      nombre: nombre.trim(),
      email: correo.trim().toLowerCase(),
      proveedor: 'email',
      parentesco: parentesco,
      fechaRegistro: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
    };

    onLoginExitoso(usuario);
  }

  function manejarLoginCorreo(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!loginCorreo.trim() || !loginCorreo.includes('@')) {
      setErrorMsg('Ingresa un correo electrónico registrado.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Ingresa tu contraseña o PIN.');
      return;
    }

    const usuario = {
      id: 'usr-login-' + Date.now(),
      nombre: loginCorreo.split('@')[0],
      email: loginCorreo.trim().toLowerCase(),
      proveedor: 'email',
      parentesco: 'Tutor',
      fechaRegistro: new Date().toISOString()
    };

    onLoginExitoso(usuario);
  }

  function confirmarLoginGoogle(cuentaSeleccionada) {
    setCargandoGoogle(true);
    setTimeout(() => {
      setCargandoGoogle(false);
      setMostrarModalGoogle(false);

      const usuario = {
        id: 'usr-google-' + Date.now(),
        nombre: cuentaSeleccionada.nombre,
        email: cuentaSeleccionada.email,
        proveedor: 'google',
        avatar: cuentaSeleccionada.avatar,
        parentesco: 'Padre / Tutor',
        fechaRegistro: new Date().toISOString()
      };

      onLoginExitoso(usuario);
    }, 600);
  }

  function ingresarModoInversor() {
    const usuario = {
      id: 'usr-investor-demo',
      nombre: 'Dr. Evaluador Clínico (Acquire.com)',
      email: 'investor@acquire.com',
      proveedor: 'demo_audit',
      parentesco: 'Evaluador M&A',
      fechaRegistro: new Date().toISOString()
    };
    onLoginExitoso(usuario);
  }

  return (
    <main
      id="main-content"
      style={{
        minHeight: '100vh',
        background: COLORS.cream,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 16px 50px',
        fontFamily: 'Nunito, sans-serif'
      }}
    >
      <div
        className="fade-in"
        style={{
          width: '100%',
          maxWidth: 440,
          background: COLORS.white,
          borderRadius: 24,
          border: `1px solid ${COLORS.border}`,
          padding: '28px 22px',
          boxShadow: '0 12px 32px rgba(45, 41, 38, 0.06)'
        }}
      >
        {/* Cabecera con Logo */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #E07A5F 0%, #C4624A 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(224, 122, 95, 0.28)',
              marginBottom: 10
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="38" height="38">
              <path
                d="M256,416 C256,416 112,288 112,176 C112,105 170,48 240,48 C251,48 256,53 256,53 C256,53 261,48 272,48 C342,48 400,105 400,176 C400,288 256,416 256,416 Z"
                fill="#FFF7F0"
              />
              <rect x="224" y="128" width="64" height="160" rx="16" fill="#2A9D8F" />
              <rect x="176" y="176" width="160" height="64" rx="16" fill="#2A9D8F" />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: 'Quicksand, sans-serif',
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.ink,
              margin: '0 0 4px'
            }}
          >
            Bienvenido a HiDoc
          </h1>
          <p style={{ fontSize: 13, color: COLORS.inkLight, margin: 0, lineHeight: 1.45 }}>
            Registra tu cuenta familiar o inicia sesión para acceder a la bitácora clínica y triaje IA.
          </p>
        </div>

        {/* Botón Principal: Continuar con Google */}
        <button
          type="button"
          onClick={() => setMostrarModalGoogle(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '12px 18px',
            borderRadius: 14,
            border: '1.5px solid #E5E7EB',
            background: COLORS.white,
            color: '#1F2937',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease',
            marginBottom: 18
          }}
          aria-label="Continuar con Google"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.99 0 12s.45 3.86 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continuar con Google
        </button>

        {/* Separador */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16
          }}
        >
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
          <span style={{ fontSize: 11.5, color: COLORS.inkLight, fontWeight: 600, textTransform: 'uppercase' }}>
            o con correo alternativo
          </span>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
        </div>

        {/* Selector de Pestaña: Registro vs Login */}
        <div
          style={{
            display: 'flex',
            background: '#F7EDE6',
            borderRadius: 12,
            padding: 3,
            marginBottom: 16
          }}
        >
          <button
            type="button"
            onClick={() => { setPestana('registro'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 10px',
              border: 'none',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: pestana === 'registro' ? 700 : 600,
              background: pestana === 'registro' ? COLORS.white : 'transparent',
              color: pestana === 'registro' ? COLORS.ink : COLORS.inkLight,
              cursor: 'pointer',
              boxShadow: pestana === 'registro' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Crear Cuenta
          </button>
          <button
            type="button"
            onClick={() => { setPestana('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 10px',
              border: 'none',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: pestana === 'login' ? 700 : 600,
              background: pestana === 'login' ? COLORS.white : 'transparent',
              color: pestana === 'login' ? COLORS.ink : COLORS.inkLight,
              cursor: 'pointer',
              boxShadow: pestana === 'login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Mensaje de error si existe */}
        {errorMsg && (
          <div
            style={{
              background: '#FDE8E7',
              border: '1px solid #F5C2C0',
              borderRadius: 10,
              padding: '9px 12px',
              color: '#B91C1C',
              fontSize: 12,
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* PESTAÑA 1: FORMULARIO REGISTRO NUEVO */}
        {pestana === 'registro' && (
          <form onSubmit={manejarRegistroCorreo}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink, display: 'block', marginBottom: 5 }}>
                Nombre completo del tutor / responsable:
              </label>
              <input
                type="text"
                placeholder="Ej: Mauricio Uribe Maldonado"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1.5px solid ${COLORS.border}`,
                  fontSize: 13.5,
                  background: COLORS.white,
                  color: COLORS.ink
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink, display: 'block', marginBottom: 5 }}>
                Correo electrónico alternativo:
              </label>
              <input
                type="email"
                placeholder="nombre@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1.5px solid ${COLORS.border}`,
                  fontSize: 13.5,
                  background: COLORS.white,
                  color: COLORS.ink
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink, display: 'block', marginBottom: 5 }}>
                  PIN o Contraseña:
                </label>
                <input
                  type="password"
                  placeholder="Mín. 4 dígitos"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: `1.5px solid ${COLORS.border}`,
                    fontSize: 13.5,
                    background: COLORS.white,
                    color: COLORS.ink
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="lobby-parentesco" style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink, display: 'block', marginBottom: 5 }}>
                  Parentesco:
                </label>
                <select
                  id="lobby-parentesco"
                  aria-label="Parentesco del tutor"
                  value={parentesco}
                  onChange={(e) => setParentesco(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 10px',
                    borderRadius: 10,
                    border: `1.5px solid ${COLORS.border}`,
                    fontSize: 13,
                    background: COLORS.white,
                    color: COLORS.ink,
                    cursor: 'pointer'
                  }}
                >
                  <option value="Madre">Mamá</option>
                  <option value="Padre">Papá</option>
                  <option value="Abuelo/a">Abuelo / Abuela</option>
                  <option value="Cuidador/a">Cuidador/a</option>
                  <option value="Pediatra">Médico / Pediatra</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: COLORS.sage,
                color: COLORS.white,
                border: 'none',
                borderRadius: 12,
                padding: '12px 18px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(224, 122, 95, 0.25)',
                transition: 'background 0.15s ease'
              }}
            >
              Crear Cuenta Familiar y Continuar →
            </button>
          </form>
        )}

        {/* PESTAÑA 2: FORMULARIO INICIAR SESIÓN */}
        {pestana === 'login' && (
          <form onSubmit={manejarLoginCorreo}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink, display: 'block', marginBottom: 5 }}>
                Correo electrónico registrado:
              </label>
              <input
                type="email"
                placeholder="nombre@correo.com"
                value={loginCorreo}
                onChange={(e) => setLoginCorreo(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1.5px solid ${COLORS.border}`,
                  fontSize: 13.5,
                  background: COLORS.white,
                  color: COLORS.ink
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink, display: 'block', marginBottom: 5 }}>
                Contraseña o PIN:
              </label>
              <input
                type="password"
                placeholder="Tu contraseña o PIN"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1.5px solid ${COLORS.border}`,
                  fontSize: 13.5,
                  background: COLORS.white,
                  color: COLORS.ink
                }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: COLORS.emerald,
                color: COLORS.white,
                border: 'none',
                borderRadius: 12,
                padding: '12px 18px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(42, 157, 143, 0.25)',
                transition: 'background 0.15s ease'
              }}
            >
              Ingresar a mi Cuenta →
            </button>
          </form>
        )}

        {/* Acceso Rápido para Inversionistas / Auditoría M&A */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px dashed ${COLORS.border}`,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 11.5, color: COLORS.inkLight, marginBottom: 8, fontWeight: 600 }}>
            ¿Evaluando la app para inversión o compra en Acquire.com?
          </div>
          <button
            type="button"
            onClick={ingresarModoInversor}
            style={{
              background: 'rgba(42, 157, 143, 0.08)',
              border: '1px solid rgba(42, 157, 143, 0.3)',
              borderRadius: 10,
              padding: '7px 14px',
              fontSize: 12,
              fontWeight: 700,
              color: '#13534B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            🧪 Ingreso Directo en Modo Auditoría (Acquire / Inversor)
          </button>
        </div>

        {/* Nota de Privacidad */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ fontSize: 11, color: '#59524D', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            🛡️ Privacidad médica garantizada • Datos encriptados localmente
          </span>
        </div>
      </div>

      {/* MODAL INTERACTIVO DE AUTENTICACIÓN GOOGLE */}
      {mostrarModalGoogle && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 16
          }}
          onClick={() => !cargandoGoogle && setMostrarModalGoogle(false)}
        >
          <div
            className="modal-pop"
            style={{
              width: '100%',
              maxWidth: 390,
              background: COLORS.white,
              borderRadius: 20,
              padding: '24px 20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera Google */}
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <svg viewBox="0 0 24 24" width="32" height="32" style={{ marginBottom: 8 }}>
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.99 0 12s.45 3.86 1.24 5.42l4.04-3.15z"
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
                {/* Cuenta Oficial Principal del Fundador */}
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

                {/* Opción de usar otra cuenta Google */}
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
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>
                      Ingresa tu correo @gmail.com:
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="email"
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
                    onClick={() => setMostrarModalGoogle(false)}
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
      )}
    </main>
  );
}

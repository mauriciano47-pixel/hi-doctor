import { useState, useEffect } from 'react';

export default function SplashScreenHiDoc({ onSaltar }) {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    // Contador ágil de bienvenida (350ms para óptimo LCP)
    const inicio = Date.now();
    const duracion = 350;
    const intervalo = setInterval(() => {
      const transcurrido = Date.now() - inicio;
      const pct = Math.min(100, Math.round((transcurrido / duracion) * 100));
      setProgreso(pct);
      if (transcurrido >= duracion) {
        clearInterval(intervalo);
      }
    }, 15);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: 'radial-gradient(circle at 50% 32%, #FFF7F0 0%, #FDF1E7 60%, #F5E5D5 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'Nunito, sans-serif',
        userSelect: 'none'
      }}
      aria-label="Pantalla de inicio HiDoc"
      onClick={onSaltar}
    >
      {/* Botón discreto para omitir si el usuario tiene prisa */}
      <button
        type="button"
        onClick={onSaltar}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(240, 228, 218, 0.9)',
          borderRadius: 20,
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 700,
          color: '#59524D',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease'
        }}
        aria-label="Saltar bienvenida"
        title="Omitir pantalla de bienvenida"
      >
        Saltar »
      </button>

      {/* Tarjeta central con animación de pulso y presencia */}
      <div
        className="splash-pulse"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 380,
          width: '100%'
        }}
      >
        {/* Emblema Oficial HiDoc */}
        <div
          style={{
            position: 'relative',
            width: 104,
            height: 104,
            borderRadius: 28,
            background: 'linear-gradient(135deg, #E07A5F 0%, #C4624A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 36px rgba(224, 122, 95, 0.32)',
            marginBottom: 20
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="66" height="66">
            <path
              d="M256,416 C256,416 112,288 112,176 C112,105 170,48 240,48 C251,48 256,53 256,53 C256,53 261,48 272,48 C342,48 400,105 400,176 C400,288 256,416 256,416 Z"
              fill="#FFF7F0"
            />
            <rect x="224" y="128" width="64" height="160" rx="16" fill="#2A9D8F" />
            <rect x="176" y="176" width="160" height="64" rx="16" fill="#2A9D8F" />
          </svg>
        </div>

        {/* Nombre de la Marca */}
        <h1
          style={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: 42,
            fontWeight: 800,
            color: '#2D2926',
            margin: '0 0 6px',
            letterSpacing: '-0.5px'
          }}
        >
          HiDoc
        </h1>

        {/* Badge Clínico Pediátrico */}
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              background: 'rgba(42, 157, 143, 0.14)',
              color: '#1E7268',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.4px',
              textTransform: 'uppercase'
            }}
          >
            Bitácora Pediátrica & Doctor IA
          </span>
        </div>

        <p
          style={{
            fontSize: 13.5,
            color: '#59524D',
            margin: '0 0 28px',
            lineHeight: 1.5,
            fontWeight: 500
          }}
        >
          Acompañamiento clínico familiar, curva térmica y dosis precisas minuto a minuto.
        </p>

        {/* Barra de progreso de 650ms */}
        <div style={{ width: '100%', maxWidth: 260, marginBottom: 10 }}>
          <div
            style={{
              height: 5,
              width: '100%',
              background: 'rgba(240, 228, 218, 0.85)',
              borderRadius: 10,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progreso}%`,
                background: 'linear-gradient(90deg, #E07A5F 0%, #2A9D8F 100%)',
                borderRadius: 10,
                transition: 'width 0.04s linear'
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
              fontSize: 11,
              color: '#59524D',
              fontWeight: 600
            }}
          >
            <span>Iniciando entorno pediátrico seguro...</span>
            <span>{progreso}%</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#59524D',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 12
          }}
        >
          <span>🛡️ Arquitectura Offline-First & Privacidad Médica Blindada</span>
        </div>
      </div>
    </div>
  );
}

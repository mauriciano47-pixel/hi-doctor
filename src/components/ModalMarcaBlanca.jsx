import { useState } from 'react';

/**
 * ============================================================================
 * HiDoc — Modal de Personalización de Marca Blanca B2B (Modo Clínica)
 * ============================================================================
 */
export default function ModalMarcaBlanca({ marcaBlanca, onGuardar, onClose }) {
  const [activo, setActivo] = useState(marcaBlanca?.activo || false);
  const [nombreClinica, setNombreClinica] = useState(marcaBlanca?.nombreClinica || '');
  const [telefonoUrgencia, setTelefonoUrgencia] = useState(marcaBlanca?.telefonoUrgencia || '');
  const [linkReserva, setLinkReserva] = useState(marcaBlanca?.linkReserva || '');

  function handleGuardar(e) {
    e.preventDefault();
    onGuardar({
      activo,
      nombreClinica: nombreClinica.trim(),
      telefonoUrgencia: telefonoUrgencia.trim(),
      linkReserva: linkReserva.trim(),
    });
    onClose();
  }

  function cargarDemoSantaMaria() {
    setActivo(true);
    setNombreClinica('Clínica Pediátrica Santa María');
    setTelefonoUrgencia('+56 2 2913 0000');
    setLinkReserva('https://www.clinicasantamaria.cl/urgencia-pediatrica');
  }

  function restablecerDefault() {
    setActivo(false);
    setNombreClinica('');
    setTelefonoUrgencia('');
    setLinkReserva('');
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      zIndex: 9999,
      backdropFilter: 'blur(3px)'
    }}>
      <div style={{
        background: '#FFF7F0',
        borderRadius: 16,
        padding: 24,
        maxWidth: 480,
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        border: '2px solid #E07A5F',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, color: '#2D2926', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            🏥 Modo Clínica / Marca Blanca B2B
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: '#59524D',
              padding: 4
            }}
            aria-label="Cerrar modal de personalización"
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: 13, color: '#59524D', lineHeight: 1.5, marginBottom: 16 }}>
          Adapta HiDoc con la identidad visual y canales directos de tu clínica, hospital o consulta pediátrica privada para ofrecerlo a tus pacientes o inversores.
        </p>

        {/* Demo Rápido para Compradores / Inversores */}
        <div style={{
          background: '#E8F5F3',
          border: '1px solid #2A9D8F',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>✨</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1E7268' }}>
              Demostración Lista para Inversores y Adquirentes
            </span>
          </div>
          <p style={{ fontSize: 11.5, color: '#2D2926', margin: 0, lineHeight: 1.4 }}>
            Carga un preset institucional real en 1 clic para ver cómo la app se viste con la marca de una clínica:
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              type="button"
              onClick={cargarDemoSantaMaria}
              style={{
                flex: 1,
                background: '#2A9D8F',
                color: '#FFF',
                border: 'none',
                borderRadius: 6,
                padding: '6px 10px',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🧪 Cargar Demo (Clínica Santa María)
            </button>
            <button
              type="button"
              onClick={restablecerDefault}
              style={{
                background: 'transparent',
                color: '#59524D',
                border: '1px solid #CCC',
                borderRadius: 6,
                padding: '6px 10px',
                fontSize: 11.5,
                cursor: 'pointer'
              }}
            >
              🔄 Restablecer
            </button>
          </div>
        </div>

        <form onSubmit={handleGuardar}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: '#2D2926', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={activo}
                onChange={e => setActivo(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#2A9D8F' }}
              />
              Activar Modo Clínica Institucional
            </label>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="mb-nombre" style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#2D2926', marginBottom: 4 }}>
              Nombre de la Clínica o Centro Médico:
            </label>
            <input
              id="mb-nombre"
              type="text"
              value={nombreClinica}
              onChange={e => setNombreClinica(e.target.value)}
              placeholder="Ej: Clínica Pediátrica Santa María"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1.5px solid #F0E4DA',
                fontSize: 13,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="mb-tel" style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#2D2926', marginBottom: 4 }}>
              Teléfono de Urgencias 24/7 (Llamada Rápida):
            </label>
            <input
              id="mb-tel"
              type="tel"
              value={telefonoUrgencia}
              onChange={e => setTelefonoUrgencia(e.target.value)}
              placeholder="Ej: +56 2 2913 0000"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1.5px solid #F0E4DA',
                fontSize: 13,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label htmlFor="mb-link" style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#2D2926', marginBottom: 4 }}>
              Enlace de Reserva de Horas / Portal Paciente:
            </label>
            <input
              id="mb-link"
              type="url"
              value={linkReserva}
              onChange={e => setLinkReserva(e.target.value)}
              placeholder="Ej: https://santamaria.cl/reservas"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1.5px solid #F0E4DA',
                fontSize: 13,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: 8,
                border: '1px solid #CCC',
                background: '#FFF',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: 'none',
                background: '#E07A5F',
                color: '#FFF',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  STRIPE_PLANS,
  getSubscriptionStatus,
  setSubscriptionStatus,
  redirigirCheckoutStripe
} from './utils/stripeService';

export default function ModalSuscripcionPro({ isOpen, onClose }) {
  const [periodo, setPeriodo] = useState('mensual'); // 'mensual' | 'anual'
  const [subStatus, setSubStatus] = useState(getSubscriptionStatus());
  const [procesando, setProcesando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSubStatus(getSubscriptionStatus());
      setMensajeExito(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const planSeleccionado = periodo === 'anual' ? STRIPE_PLANS.PRO_ANUAL : STRIPE_PLANS.PRO_MENSUAL;

  const handleCheckoutStripe = () => {
    setProcesando(true);
    try {
      const res = redirigirCheckoutStripe(planSeleccionado.id);
      // Simulación de checkout seguro / redirección Stripe
      window.open(res.url, '_blank', 'noopener,noreferrer');
      // Activar Pro en almacenamiento local de la PWA
      setSubscriptionStatus(true, planSeleccionado.id, 'stripe');
      setSubStatus(getSubscriptionStatus());
      setMensajeExito(`¡Suscripción ${planSeleccionado.nombre} activada con éxito! Acceso ilimitado habilitado.`);
    } catch (err) {
      alert(`Error al procesar el checkout: ${err.message}`);
    } finally {
      setProcesando(false);
    }
  };

  const handleCancelarSuscripcion = () => {
    if (confirm('¿Deseas volver al plan gratuito básico?')) {
      setSubscriptionStatus(false);
      setSubStatus(getSubscriptionStatus());
      setMensajeExito('Has vuelto al plan gratuito básico.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(45, 41, 38, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }} role="dialog" aria-modal="true" aria-labelledby="modal-pro-title">
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        maxWidth: 480,
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        border: '1px solid #F0E4DA',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Encabezado Visual */}
        <div style={{
          background: 'linear-gradient(135deg, #2A9D8F, #1E7268)',
          color: '#FFFFFF',
          padding: '24px 20px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              color: '#FFFFFF',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
          <div style={{ fontSize: 40, marginBottom: 6 }}>👑</div>
          <h2 id="modal-pro-title" style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
            HiDoc Pro Familiar
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, opacity: 0.9 }}>
            Tranquilidad médica pediátrica total minuto a minuto para toda tu familia
          </p>
        </div>

        {/* Cuerpo del Modal */}
        <div style={{ padding: '20px 24px' }}>
          {mensajeExito && (
            <div style={{
              backgroundColor: '#E8F5F3',
              border: '1px solid #2A9D8F',
              color: '#1E7268',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 600,
              marginBottom: 16,
              textAlign: 'center'
            }}>
              ✅ {mensajeExito}
            </div>
          )}

          {/* Toggle Mensual / Anual */}
          <div style={{
            display: 'flex',
            backgroundColor: '#FFF7F0',
            border: '1px solid #F0E4DA',
            borderRadius: 12,
            padding: 4,
            marginBottom: 20
          }}>
            <button
              onClick={() => setPeriodo('mensual')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: periodo === 'mensual' ? '#2A9D8F' : 'transparent',
                color: periodo === 'mensual' ? '#FFFFFF' : '#59524D',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Facturación Mensual
            </button>
            <button
              onClick={() => setPeriodo('anual')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: periodo === 'anual' ? '#2A9D8F' : 'transparent',
                color: periodo === 'anual' ? '#FFFFFF' : '#59524D',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.15s ease'
              }}
            >
              <span>Facturación Anual</span>
              <span style={{
                backgroundColor: '#F2A65A',
                color: '#2D2926',
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 6
              }}>
                -33% Ahorro
              </span>
            </button>
          </div>

          {/* Caja de Precio */}
          <div style={{
            textAlign: 'center',
            marginBottom: 20,
            padding: '14px',
            backgroundColor: '#FAF5F0',
            borderRadius: 14,
            border: '1px solid #F0E4DA'
          }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#2D2926' }}>
              {planSeleccionado.precioTexto}
            </div>
            <div style={{ fontSize: 11.5, color: '#59524D', marginTop: 4 }}>
              {periodo === 'anual'
                ? 'Equivalente a $3.33 USD/mes · Cancela cuando quieras'
                : 'Sin compromiso de permanencia · Facturado a través de Stripe'}
            </div>
          </div>

          {/* Lista de Beneficios */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#2D2926' }}>
              <span style={{ color: '#2A9D8F', fontSize: 16 }}>✓</span>
              <span><strong>Múltiples Hijos Ilimitados:</strong> Fichas clínicas de todos tus hijos en un solo lugar.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#2D2926' }}>
              <span style={{ color: '#2A9D8F', fontSize: 16 }}>✓</span>
              <span><strong>Curva Térmica Vectorial SVG:</strong> Historial térmico continuo sin límite de días.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#2D2926' }}>
              <span style={{ color: '#2A9D8F', fontSize: 16 }}>✓</span>
              <span><strong>Triaje Doctor IA Ilimitado:</strong> Evaluaciones asistidas con Gemini Flash 2.0.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#2D2926' }}>
              <span style={{ color: '#2A9D8F', fontSize: 16 }}>✓</span>
              <span><strong>Exportación a PDF Clínico:</strong> Envío directo al pediatra en un solo clic.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#2D2926' }}>
              <span style={{ color: '#2A9D8F', fontSize: 16 }}>✓</span>
              <span><strong>Seguridad Bancaria PCI-DSS:</strong> Pagos procesados por Stripe.</span>
            </div>
          </div>

          {/* Botón de Acción Principal */}
          {subStatus.esPro ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                backgroundColor: '#E8F5F3',
                color: '#1E7268',
                padding: '12px',
                borderRadius: 12,
                fontWeight: 700,
                textAlign: 'center',
                fontSize: 13
              }}>
                ✨ Eres miembro HiDoc Pro activo
              </div>
              <button
                onClick={handleCancelarSuscripcion}
                style={{
                  background: 'transparent',
                  border: '1px solid #D95550',
                  color: '#D95550',
                  padding: '8px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar Suscripción
              </button>
            </div>
          ) : (
            <button
              onClick={handleCheckoutStripe}
              disabled={procesando}
              style={{
                width: '100%',
                backgroundColor: '#2A9D8F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                padding: '14px',
                fontSize: 15,
                fontWeight: 800,
                cursor: procesando ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(42, 157, 143, 0.4)',
                transition: 'transform 0.1s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <span>💳</span>
              <span>{procesando ? 'Conectando con Stripe...' : `Comenzar con Stripe (${planSeleccionado.precioTexto})`}</span>
            </button>
          )}

          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: '#8C827A' }}>
            🔒 Cifrado SSL de 256 bits · Garantía de devolución de 14 días
          </div>
        </div>
      </div>
    </div>
  );
}

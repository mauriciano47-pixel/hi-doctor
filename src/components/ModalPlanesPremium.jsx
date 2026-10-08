import { useState } from 'react';
import { STRIPE_PLANS, redirigirCheckoutStripe, setSubscriptionStatus } from '../utils/stripeService';

/**
 * ============================================================================
 * HiDoc — Modal de Planes y Monetización B2C SaaS / Suscripción Familiar Stripe
 * ============================================================================
 */
export default function ModalPlanesPremium({ esPremiumActivo, onTogglePremium, onAbrirMarcaBlanca, onClose }) {
  const [periodo, setPeriodo] = useState('anual'); // mensual | anual

  const handleCheckoutStripe = () => {
    try {
      const planId = periodo === 'anual' ? STRIPE_PLANS.PRO_ANUAL.id : STRIPE_PLANS.PRO_MENSUAL.id;
      const checkout = redirigirCheckoutStripe(planId);
      window.open(checkout.url, '_blank', 'noopener,noreferrer');
      setSubscriptionStatus(true, planId, 'stripe');
      onTogglePremium();
    } catch (err) {
      alert(`Error al iniciar checkout: ${err.message}`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#FFF7F0',
        borderRadius: 18,
        padding: 24,
        maxWidth: 520,
        width: '100%',
        boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
        border: '2.5px solid #F2A65A',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>⭐</span>
            <h2 style={{ fontSize: 19, color: '#2D2926', margin: 0, fontWeight: 800 }}>
              HiDoc — Planes & Monetización
            </h2>
          </div>
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
            aria-label="Cerrar modal de planes"
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: 13, color: '#59524D', lineHeight: 1.5, margin: '0 0 16px' }}>
          Modelo SaaS con margen bruto superior al 95%: suscripción familiar recurrente para padres y licenciamiento B2B llave en mano para clínicas pediátricas.
        </p>

        {/* Selector Mensual / Anual */}
        <div style={{
          display: 'flex',
          background: '#F0E4DA',
          borderRadius: 10,
          padding: 3,
          marginBottom: 16,
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={() => setPeriodo('mensual')}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: 8,
              border: 'none',
              background: periodo === 'mensual' ? '#FFF' : 'transparent',
              color: periodo === 'mensual' ? '#2D2926' : '#59524D',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer'
            }}
          >
            Facturación Mensual
          </button>
          <button
            type="button"
            onClick={() => setPeriodo('anual')}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: 8,
              border: 'none',
              background: periodo === 'anual' ? '#FFF' : 'transparent',
              color: periodo === 'anual' ? '#2D2926' : '#59524D',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            Anual (Ahorra 33%) <span style={{ background: '#2A9D8F', color: '#FFF', fontSize: 10, padding: '1px 5px', borderRadius: 4 }}>OFERTA</span>
          </button>
        </div>

        {/* Tarjetas de Planes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {/* Plan Básico */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #E5D5C8',
            borderRadius: 12,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#59524D', textTransform: 'uppercase' }}>Comunitario</span>
              <h3 style={{ fontSize: 16, margin: '4px 0', color: '#2D2926' }}>Plan Gratuito</h3>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#2D2926', marginBottom: 10 }}>
                $0 <span style={{ fontSize: 11, fontWeight: 500, color: '#59524D' }}>/ siempre</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: '#555', lineHeight: 1.6 }}>
                <li>1 perfil pediátrico</li>
                <li>Curva térmica vectorial SVG</li>
                <li>Dosis por peso en kg</li>
                <li>Directorio 9 países</li>
              </ul>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#2A9D8F', fontWeight: 700, textAlign: 'center' }}>
              ✓ Activo por defecto
            </div>
          </div>

          {/* Plan Familiar Pro */}
          <div style={{
            background: 'linear-gradient(135deg, #FFF9F5, #FFF0EA)',
            border: '2px solid #E07A5F',
            borderRadius: 12,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 14px rgba(224, 122, 95, 0.15)',
            position: 'relative'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#E07A5F', textTransform: 'uppercase' }}>Familiar</span>
                <span style={{ background: '#E07A5F', color: '#FFF', fontSize: 9.5, padding: '2px 6px', borderRadius: 10, fontWeight: 800 }}>POPULAR</span>
              </div>
              <h3 style={{ fontSize: 16, margin: '4px 0', color: '#2D2926' }}>Familiar Pro</h3>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#E07A5F', marginBottom: 10 }}>
                {periodo === 'mensual' ? '$4.99' : '$3.33'} <span style={{ fontSize: 11, fontWeight: 500, color: '#59524D' }}>USD/mes</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: '#333', lineHeight: 1.6 }}>
                <li><strong>Perfiles ilimitados</strong> (hermanos)</li>
                <li><strong>Doctor IA</strong> consultas 24/7</li>
                <li><strong>Exportación PDF A4</strong> médica</li>
                <li>Envío directo a WhatsApp</li>
                <li>Detección de patrones críticos</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={handleCheckoutStripe}
              style={{
                marginTop: 12,
                background: esPremiumActivo ? '#2A9D8F' : 'linear-gradient(135deg, #2A9D8F, #1E7268)',
                color: '#FFF',
                border: 'none',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(42, 157, 143, 0.3)'
              }}
            >
              <span>💳</span>
              <span>{esPremiumActivo ? '✓ Suscripción Pro Activa (Stripe)' : `Activar con Stripe (${periodo === 'mensual' ? '$4.99/mes' : '$39.99/año'})`}</span>
            </button>
          </div>
        </div>

        {/* Bloque B2B / Institucional para Clínicas */}
        <div style={{
          background: '#E8F5F3',
          border: '1.5px solid #2A9D8F',
          borderRadius: 12,
          padding: '12px 14px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🏥</span>
              <strong style={{ fontSize: 13, color: '#1B4332' }}>Licencia B2B Institucional (Marca Blanca)</strong>
            </div>
            <p style={{ fontSize: 11.5, color: '#2D2926', margin: '3px 0 0', lineHeight: 1.4 }}>
              Para clínicas privadas y aseguradoras: despliega la app con tu propio logotipo, teléfono y agenda por <strong>$3.500 USD / $3.2M CLP</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onAbrirMarcaBlanca}
            style={{
              background: '#2A9D8F',
              color: '#FFF',
              border: 'none',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Configurar Marca Blanca
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #CCC',
              borderRadius: 8,
              padding: '8px 20px',
              fontSize: 12.5,
              color: '#59524D',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Volver a la App
          </button>
        </div>
      </div>
    </div>
  );
}

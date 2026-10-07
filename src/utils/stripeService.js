/**
 * ============================================================================
 * HiDoc — Servicio de Monetización, Suscripciones y Checkout (Stripe & SaaS)
 * Versión: 2.6.0
 * ============================================================================
 * Arquitectura de cobro recurrente para validación comercial en M&A / Acquire.com
 */

export const STRIPE_PLANS = {
  FREE: {
    id: 'free',
    nombre: 'HiDoc Básico',
    precioMensualUsd: 0,
    precioTexto: 'Gratis',
    limiteHijos: 1,
    historialDias: 7,
    triajeIA: 'Básico (3 consultas/semana)',
    exportacionPDF: false,
    curvaTermicaAvanzada: false
  },
  PRO_MENSUAL: {
    id: 'prod_hidoc_pro_monthly',
    priceId: 'price_hidoc_pro_monthly_499',
    nombre: 'HiDoc Pro Familiar (Mensual)',
    precioMensualUsd: 4.99,
    precioTexto: '$4.99 USD / mes',
    periodo: 'mensual',
    limiteHijos: 99,
    historialDias: 9999,
    triajeIA: 'Ilimitado con Gemini IA',
    exportacionPDF: true,
    curvaTermicaAvanzada: true,
    stripeCheckoutUrl: 'https://buy.stripe.com/test_hidoc_pro_monthly'
  },
  PRO_ANUAL: {
    id: 'prod_hidoc_pro_annual',
    priceId: 'price_hidoc_pro_annual_3999',
    nombre: 'HiDoc Pro Familiar (Anual - Ahorro 33%)',
    precioMensualUsd: 3.33,
    precioAnualUsd: 39.99,
    precioTexto: '$39.99 USD / año',
    periodo: 'anual',
    limiteHijos: 99,
    historialDias: 9999,
    triajeIA: 'Ilimitado con Gemini IA',
    exportacionPDF: true,
    curvaTermicaAvanzada: true,
    stripeCheckoutUrl: 'https://buy.stripe.com/test_hidoc_pro_annual'
  }
};

const STORAGE_KEY_SUBSCRIPTION = 'hidoc_subscription_status';

/**
 * Obtiene el estado actual de la suscripción local.
 */
export function getSubscriptionStatus() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIPTION);
    if (!raw) {
      return {
        esPro: false,
        plan: STRIPE_PLANS.FREE,
        activoDesde: null,
        metodo: 'ninguno'
      };
    }
    const parsed = JSON.parse(raw);
    return {
      esPro: parsed.esPro === true,
      plan: parsed.planId === STRIPE_PLANS.PRO_ANUAL.id ? STRIPE_PLANS.PRO_ANUAL : (parsed.esPro ? STRIPE_PLANS.PRO_MENSUAL : STRIPE_PLANS.FREE),
      activoDesde: parsed.activoDesde || null,
      metodo: parsed.metodo || 'stripe'
    };
  } catch {
    return {
      esPro: false,
      plan: STRIPE_PLANS.FREE,
      activoDesde: null,
      metodo: 'ninguno'
    };
  }
}

/**
 * Guarda o actualiza el estado de la suscripción.
 */
export function setSubscriptionStatus(esPro, planId = STRIPE_PLANS.PRO_MENSUAL.id, metodo = 'stripe') {
  try {
    const data = {
      esPro,
      planId,
      activoDesde: new Date().toISOString(),
      metodo
    };
    localStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/**
 * Inicia el redireccionamiento seguro al Checkout de Stripe.
 */
export function redirigirCheckoutStripe(planId, email = '') {
  const plan = planId === STRIPE_PLANS.PRO_ANUAL.id ? STRIPE_PLANS.PRO_ANUAL : STRIPE_PLANS.PRO_MENSUAL;
  
  if (!plan.stripeCheckoutUrl) {
    throw new Error('Configuración de URL de Stripe no encontrada para el plan seleccionado.');
  }

  const url = new URL(plan.stripeCheckoutUrl);
  if (email) {
    url.searchParams.set('prefilled_email', email);
  }
  url.searchParams.set('client_reference_id', `hidoc_${Date.now()}`);

  return {
    url: url.toString(),
    planSeleccionado: plan.nombre,
    precio: plan.precioTexto
  };
}

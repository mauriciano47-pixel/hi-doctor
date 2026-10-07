import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  STRIPE_PLANS,
  getSubscriptionStatus,
  setSubscriptionStatus,
  redirigirCheckoutStripe
} from '../src/utils/stripeService.js';

// Mock de localStorage para entorno Node puro
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    clear: () => { store = {}; }
  };
})();
global.localStorage = mockLocalStorage;

describe('💳 HiDoctor — Suite de Monetización, Suscripciones & Stripe', () => {

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('1. Catálogo de Planes y Parámetros Comerciales', () => {
    it('debe tener definido el Plan Gratuito con límites correctos', () => {
      const free = STRIPE_PLANS.FREE;
      assert.equal(free.precioMensualUsd, 0);
      assert.equal(free.limiteHijos, 1);
      assert.equal(free.historialDias, 7);
      assert.equal(free.exportacionPDF, false);
    });

    it('debe tener definido el Plan Pro Mensual a $4.99 USD', () => {
      const pro = STRIPE_PLANS.PRO_MENSUAL;
      assert.equal(pro.precioMensualUsd, 4.99);
      assert.equal(pro.periodo, 'mensual');
      assert.equal(pro.exportacionPDF, true);
      assert.ok(pro.priceId.includes('price_'));
      assert.ok(pro.stripeCheckoutUrl.startsWith('https://buy.stripe.com/'));
    });

    it('debe tener definido el Plan Pro Anual con ahorro a $39.99 USD', () => {
      const anual = STRIPE_PLANS.PRO_ANUAL;
      assert.equal(anual.precioAnualUsd, 39.99);
      assert.equal(anual.periodo, 'anual');
      assert.ok(anual.precioMensualUsd < STRIPE_PLANS.PRO_MENSUAL.precioMensualUsd);
    });
  });

  describe('2. Generador de Checkout Sessions Seguras', () => {
    it('debe generar URL de checkout válida con email prellenado', () => {
      const checkout = redirigirCheckoutStripe(STRIPE_PLANS.PRO_MENSUAL.id, 'mama@ejemplo.com');
      assert.ok(checkout.url.includes('prefilled_email=mama%40ejemplo.com'));
      assert.ok(checkout.url.includes('client_reference_id=hidoc_'));
      assert.equal(checkout.precio, '$4.99 USD / mes');
    });

    it('debe soportar checkout del plan anual', () => {
      const checkout = redirigirCheckoutStripe(STRIPE_PLANS.PRO_ANUAL.id);
      assert.ok(checkout.url.includes('test_hidoc_pro_annual'));
      assert.equal(checkout.precio, '$39.99 USD / año');
    });
  });

  describe('3. Persistencia de Estado de Suscripción', () => {
    it('debe devolver Plan Gratuito por defecto si no hay compra previa', () => {
      const status = getSubscriptionStatus();
      assert.equal(status.esPro, false);
      assert.equal(status.plan.id, 'free');
    });

    it('debe activar y persistir correctamente el estatus Pro tras compra', () => {
      setSubscriptionStatus(true, STRIPE_PLANS.PRO_MENSUAL.id, 'stripe');
      const status = getSubscriptionStatus();
      assert.equal(status.esPro, true);
      assert.equal(status.plan.id, STRIPE_PLANS.PRO_MENSUAL.id);
      assert.ok(status.activoDesde);
    });
  });

});

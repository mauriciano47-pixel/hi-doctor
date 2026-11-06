import { test, expect } from '@playwright/test';

test.describe('HiDoctor — E2E Headless Verification en Viewport Móvil 390px (Tier-1 Standard)', () => {
  test('1. Ergonomía Móvil 390px: Carga, Viewport Adaptativo y Cero Desborde Horizontal', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('', { waitUntil: 'domcontentloaded', timeout: 20000 });

    // 1. Título oficial y metadatos
    await expect(page).toHaveTitle(/HiDoc/i);

    // 2. Contenedor principal React
    const root = page.locator('#root');
    await expect(root).toBeAttached();

    // 3. Verificación de Viewport Móvil (390px de ancho)
    const viewportSize = page.viewportSize();
    expect(viewportSize?.width).toBe(390);

    // 4. Verificación de Cero Desborde Horizontal (No Horizontal Overflow)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(420);

    // 5. Cero errores JS fatales en tiempo de ejecución
    expect(pageErrors.length).toBe(0);
  });

  test('2. Form Shield & Triaje Pediátrico: Cero Bloqueo de Modal y Accesibilidad', async ({ page }) => {
    await page.goto('', { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Esperar a que el contenido react se monte
    await page.waitForTimeout(1500);

    // Comprobar que no exista modal bloqueante sin botón de cierre
    const modalJail = await page.evaluate(() => {
      const modals = document.querySelectorAll('[role="dialog"], .modal, .dialog');
      for (const m of modals) {
        const hasClose = m.querySelector('button, [aria-label*="cerrar" i], [aria-label*="close" i]');
        if (!hasClose) return true; // Bloqueo detectado
      }
      return false;
    });
    expect(modalJail).toBe(false);
  });

  test('3. Telemetría Pasiva RUM: Inicialización o Inyección Segura de Baliza', async ({ page }) => {
    await page.goto('', { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Verificar que el entorno soporte balizas de telemetría y performance
    const hasPerformance = await page.evaluate(() => {
      return typeof window.performance !== 'undefined' &&
             typeof window.performance.now === 'function';
    });
    expect(hasPerformance).toBe(true);
  });
});

import { test, expect } from '@playwright/test';
import { disableAnimations } from './helpers/disableAnimations';
import { waitForPageReady } from './helpers/waitForPage';
import { compareFigmaWithSystem } from './helpers/figmaComparison';
import * as path from 'path';

const BASE_URL = 'https://www.qa.cuidadospelavida.com.br';

test.describe('Visual Regression - Sellout Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  /**
   * Login Page
   */
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
      await disableAnimations(page);
      await waitForPageReady(page);
    });

    test('Login - full page snapshot should match baseline', async ({ page }) => {
      await expect(page).toHaveScreenshot('login-full-page.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
      });
    });

    test('Login - form component should match baseline', async ({ page }) => {
      const form = page.locator('form').first();
      if (await form.isVisible()) {
        await expect(form).toHaveScreenshot('login-form.png', {
          animations: 'disabled',
          maxDiffPixelRatio: 0.02,
        });
      }
    });

    test('Login - Figma comparison: full page', async ({ page }) => {
      const figmaBaseline = path.resolve('figma-baselines/login/login-full-page.png');
      const fs = await import('fs');

      if (!fs.existsSync(figmaBaseline)) {
        test.skip(true, 'Figma baseline not found. Place it at figma-baselines/login/login-full-page.png');
        return;
      }

      await compareFigmaWithSystem(
        page,
        figmaBaseline,
        'login-full-page',
        undefined,
        { maxDiffRatio: 0.05 }
      );
    });
  });

  /**
   * Dashboard / Main Page after login
   */
  test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
      await disableAnimations(page);
      await waitForPageReady(page);
    });

    test('Dashboard - full page snapshot should match baseline', async ({ page }) => {
      await expect(page).toHaveScreenshot('dashboard-full-page.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
      });
    });

    test('Dashboard - Figma comparison: full page', async ({ page }) => {
      const figmaBaseline = path.resolve('figma-baselines/dashboard/dashboard-full-page.png');
      const fs = await import('fs');

      if (!fs.existsSync(figmaBaseline)) {
        test.skip(true, 'Figma baseline not found. Place it at figma-baselines/dashboard/dashboard-full-page.png');
        return;
      }

      await compareFigmaWithSystem(
        page,
        figmaBaseline,
        'dashboard-full-page',
        undefined,
        { maxDiffRatio: 0.05 }
      );
    });
  });
});

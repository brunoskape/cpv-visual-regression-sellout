import { test, expect } from '@playwright/test';
import { disableAnimations } from './helpers/disableAnimations';
import { waitForPageReady } from './helpers/waitForPage';
import { compareFigmaWithSystem } from './helpers/figmaComparison';
import * as path from 'path';

const BASE_URL = 'https://www.qa.cuidadospelavida.com.br';

test.describe('Visual Regression - Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'load' });
    await disableAnimations(page);
    await waitForPageReady(page);
  });

  test('Home - full page snapshot should match baseline', async ({ page }) => {
    await expect(page).toHaveScreenshot('home-full-page.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test('Home - header should match baseline', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    await expect(header).toHaveScreenshot('home-header.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test('Home - hero/banner section should match baseline', async ({ page }) => {
    // Captures the first visible large section (hero/banner)
    const hero = page.locator('main section').first();
    if (await hero.isVisible()) {
      await expect(hero).toHaveScreenshot('home-hero-section.png', {
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
      });
    } else {
      // Fallback: screenshot the top portion of the page
      await expect(page).toHaveScreenshot('home-top-viewport.png', {
        clip: { x: 0, y: 0, width: 1440, height: 900 },
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
      });
    }
  });

  test('Home - footer should match baseline', async ({ page }) => {
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(footer).toHaveScreenshot('home-footer.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  /**
   * FIGMA COMPARISON TEST
   *
   * This test compares the actual rendered page with a Figma-exported PNG.
   * To use:
   *   1. Export the Figma frame as PNG (1440px wide) to: figma-baselines/home/home-full-page.png
   *   2. Run: npm run test:visual
   *
   * The test will SKIP automatically if no Figma baseline file is found.
   */
  test('Home - Figma comparison: full page', async ({ page }) => {
    const figmaBaseline = path.resolve('figma-baselines/home/home-full-page.png');
    const fs = await import('fs');

    if (!fs.existsSync(figmaBaseline)) {
      test.skip(true, 'Figma baseline not found. Export the frame and place it at figma-baselines/home/home-full-page.png');
      return;
    }

    await compareFigmaWithSystem(
      page,
      figmaBaseline,
      'home-full-page',
      undefined, // full page
      { maxDiffRatio: 0.05 }
    );
  });

  test('Home - Figma comparison: header', async ({ page }) => {
    const figmaBaseline = path.resolve('figma-baselines/home/home-header.png');
    const fs = await import('fs');

    if (!fs.existsSync(figmaBaseline)) {
      test.skip(true, 'Figma baseline not found. Export the frame and place it at figma-baselines/home/home-header.png');
      return;
    }

    await compareFigmaWithSystem(
      page,
      figmaBaseline,
      'home-header',
      'header',
      { maxDiffRatio: 0.03 }
    );
  });
});

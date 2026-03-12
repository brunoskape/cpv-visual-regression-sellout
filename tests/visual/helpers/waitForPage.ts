import { Page } from '@playwright/test';

/**
 * Waits for the page to be in a stable, testable state:
 * - Network is idle
 * - No loading spinners visible
 * - Images loaded
 */
export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');

  // Wait for images to finish loading
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
    )
  );
}

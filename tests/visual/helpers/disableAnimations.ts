import { Page } from '@playwright/test';

/**
 * Disables all CSS animations and transitions on the page
 * to ensure stable screenshots without flakiness.
 */
export async function disableAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        transition: none !important;
        animation: none !important;
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });
}

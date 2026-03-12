import { Page } from '@playwright/test';

/**
 * Aguarda a página estar em um estado estável para captura de screenshot.
 * - Aguarda carregamento do DOM
 * - Aguarda imagens com timeout de segurança de 5s
 * - Aguarda estabilização final de 500ms
 */
const IMAGE_LOAD_TIMEOUT_MS = 5000;

export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');

  // Aguarda imagens com timeout de segurança para evitar travar indefinidamente
  await Promise.race([
    page.evaluate(() =>
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
    ),
    new Promise<void>((resolve) => setTimeout(resolve, IMAGE_LOAD_TIMEOUT_MS)),
  ]);

  // Pequena pausa para estabilizar renderizações pós-carregamento (fontes, lazy render)
  await page.waitForTimeout(500);
}

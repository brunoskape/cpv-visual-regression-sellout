import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp';

export interface FigmaComparisonOptions {
  /** Maximum allowed pixel difference ratio (0–1). Default: 0.02 (2%) */
  maxDiffRatio?: number;
  /** Directory where diff images are saved. Default: 'test-results/figma-diffs' */
  diffOutputDir?: string;
}

/**
 * Compares a Playwright screenshot (locator or full page) with a Figma-exported PNG baseline.
 *
 * Steps:
 *  1. Take a screenshot from the page or a specific locator.
 *  2. Resize the Figma baseline to match the screenshot dimensions.
 *  3. Run pixelmatch to find pixel differences.
 *  4. Save the diff image to disk as evidence.
 *  5. Assert that diff ratio is within the allowed threshold.
 *
 * @param page - Playwright Page instance
 * @param figmaBaselinePath - Absolute or relative path to the Figma-exported PNG file
 * @param screenshotName - Name used for saved diff artifacts
 * @param locatorSelector - Optional CSS selector to screenshot a specific element
 * @param options - Comparison options
 */
export async function compareFigmaWithSystem(
  page: Page,
  figmaBaselinePath: string,
  screenshotName: string,
  locatorSelector?: string,
  options: FigmaComparisonOptions = {}
): Promise<void> {
  const maxDiffRatio = options.maxDiffRatio ?? 0.02;
  const diffOutputDir = options.diffOutputDir ?? 'test-results/figma-diffs';

  // Ensure the Figma baseline exists
  const resolvedFigmaPath = path.resolve(figmaBaselinePath);
  if (!fs.existsSync(resolvedFigmaPath)) {
    throw new Error(
      `Figma baseline not found: ${resolvedFigmaPath}\n` +
      `Please export the Figma frame as PNG and place it at: ${figmaBaselinePath}`
    );
  }

  // Take screenshot
  let screenshotBuffer: Buffer;
  if (locatorSelector) {
    const locator = page.locator(locatorSelector);
    await expect(locator).toBeVisible();
    screenshotBuffer = await locator.screenshot();
  } else {
    screenshotBuffer = await page.screenshot({ fullPage: true });
  }

  // Parse actual screenshot
  const actualPng = PNG.sync.read(screenshotBuffer);
  const { width, height } = actualPng;

  // Resize Figma baseline to match actual screenshot dimensions
  const resizedFigmaBuffer = await sharp(resolvedFigmaPath)
    .resize(width, height, { fit: 'fill' })
    .png()
    .toBuffer();
  const figmaPng = PNG.sync.read(resizedFigmaBuffer);

  // Run pixelmatch
  const diffPng = new PNG({ width, height });
  const diffPixels = pixelmatch(
    figmaPng.data,
    actualPng.data,
    diffPng.data,
    width,
    height,
    { threshold: 0.1, includeAA: false }
  );

  const totalPixels = width * height;
  const diffRatio = diffPixels / totalPixels;

  // Save diff image as evidence
  fs.mkdirSync(diffOutputDir, { recursive: true });
  const diffFilePath = path.join(diffOutputDir, `${screenshotName}-diff.png`);
  fs.writeFileSync(diffFilePath, PNG.sync.write(diffPng));

  // Save actual screenshot as evidence
  const actualFilePath = path.join(diffOutputDir, `${screenshotName}-actual.png`);
  fs.writeFileSync(actualFilePath, screenshotBuffer);

  // Copy resized figma baseline as evidence
  const figmaFilePath = path.join(diffOutputDir, `${screenshotName}-figma-baseline.png`);
  fs.writeFileSync(figmaFilePath, resizedFigmaBuffer);

  console.log(`\n📊 Figma Comparison: ${screenshotName}`);
  console.log(`   Total pixels  : ${totalPixels}`);
  console.log(`   Diff pixels   : ${diffPixels}`);
  console.log(`   Diff ratio    : ${(diffRatio * 100).toFixed(2)}%`);
  console.log(`   Max allowed   : ${(maxDiffRatio * 100).toFixed(2)}%`);
  console.log(`   Diff saved at : ${diffFilePath}`);

  if (diffRatio > maxDiffRatio) {
    throw new Error(
      `Visual comparison FAILED for "${screenshotName}".\n` +
      `Diff ratio: ${(diffRatio * 100).toFixed(2)}% exceeds max allowed: ${(maxDiffRatio * 100).toFixed(2)}%.\n` +
      `Diff image saved at: ${diffFilePath}`
    );
  }
}

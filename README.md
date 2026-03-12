# CPV Visual Regression - Sellout

Visual regression testing project for <a href="https://www.qa.cuidadospelavida.com.br/">CPV Sellout</a> using <a href="https://playwright.dev/">Playwright</a>.

Supports two modes of visual validation:
- **Snapshot baseline**: compares current UI against a previously approved screenshot
- **Figma comparison**: compares the current UI against a PNG exported from Figma (design source of truth)

---

## Requirements

- Node.js 18+
- npm 9+

---

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

---

## Running Tests

```bash
# Run all visual regression tests
npm run test:visual

# Generate/update baselines (first run or after intentional design changes)
npm run test:visual:update

# Open the HTML report
npm run test:visual:report
```

---

## Figma Comparison

To compare the system against a Figma design:

1. Export the Figma frame as PNG (1440px wide, 1x scale)
2. Place the file in the correct folder under `figma-baselines/`
3. Run `npm run test:visual`

See <a>`figma-baselines/README.md`</a> for full instructions.

---

## Project Structure

```
cpv-visual-regression-sellout/
├── figma-baselines/            ← Figma exported PNGs (design baselines)
│   ├── home/
│   ├── login/
│   └── dashboard/
├── tests/
│   └── visual/
│       ├── helpers/
│       │   ├── disableAnimations.ts   ← Disables CSS animations for stable screenshots
│       │   ├── figmaComparison.ts     ← Pixelmatch-based Figma vs System comparison
│       │   └── waitForPage.ts         ← Waits for page to be in stable state
│       ├── __snapshots__/             ← Auto-generated Playwright baselines (git ignored)
│       ├── cpv-home.visual.spec.ts    ← Home page tests
│       └── cpv-sellout.visual.spec.ts ← Login & Dashboard tests
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Snapshot Baseline Workflow

| Situation | Command |
|---|---|
| First time running | `npm run test:visual:update` |
| Regular test run | `npm run test:visual` |
| Design intentionally changed | `npm run test:visual:update` |
| Unexpected diff found | Investigate diff in `test-results/` |

---

## Diff Evidence

On failure, Playwright saves:
- `test-results/` → actual screenshots and diffs (Playwright baseline mode)
- `test-results/figma-diffs/` → actual, figma baseline and diff PNGs (Figma comparison mode)
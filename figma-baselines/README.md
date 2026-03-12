# Figma Baselines

This folder stores PNG images exported from Figma, used as the **design baseline** for visual comparison tests.

## Folder Structure

```
figma-baselines/
├── home/
│   ├── home-full-page.png      ← Full page frame export
│   └── home-header.png         ← Header component frame export
├── login/
│   └── login-full-page.png
└── dashboard/
    └── dashboard-full-page.png
```

## How to Export from Figma

1. Open the Figma project
2. Select the **Frame** you want to export
3. In the right panel, go to **Export**
4. Set format to **PNG** and resolution **1x**
5. Set the frame width to **1440px** (desktop)
6. Click **Export** and save the file in the correct folder above

## Important Rules

- Always export at **1x scale** to avoid size mismatch
- The frame width must match the viewport defined in `playwright.config.ts` (**1440px**)
- Commit the baseline PNG files to the repository so the team shares the same reference
- When the design intentionally changes, update the Figma export and commit the new baseline

## Running Figma Comparison Tests

```bash
# Run all visual tests (Figma comparison tests will skip if baseline not found)
npm run test:visual

# View the HTML report with diff images
npm run test:visual:report
```

## Where to Find Diff Images

After running the tests, diff images (actual vs figma vs diff) are saved at:

```
test-results/figma-diffs/
├── home-full-page-actual.png
├── home-full-page-figma-baseline.png
└── home-full-page-diff.png
```

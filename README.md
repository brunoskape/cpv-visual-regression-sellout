# CPV Visual Regression - Sellout

Projeto de testes de regressão visual para o <a href="https://www.qa.cuidadospelavida.com.br/">CPV Sellout</a> utilizando <a href="https://playwright.dev/">Playwright</a>.

Suporta dois modos de validação visual:
- **Snapshot baseline**: compara a UI atual com um screenshot previamente aprovado
- **Comparação com Figma**: compara a UI atual com um PNG exportado do Figma (fonte de verdade do design)

---

## Requisitos

- Node.js 18+
- npm 9+

---

## Instalação

```bash
# Instalar dependências
npm install

# Instalar os navegadores do Playwright
npx playwright install chromium
```

---

## Executando os Testes

```bash
# Executar todos os testes de regressão visual
npm run test:visual

# Gerar/atualizar os baselines (primeira execução ou após mudanças intencionais de design)
npm run test:visual:update

# Abrir o relatório HTML
npm run test:visual:report
```

---

## Comparação com Figma

Para comparar o sistema com um design do Figma:

1. Exporte o frame do Figma como PNG (1440px de largura, escala 1x)
2. Coloque o arquivo na pasta correta dentro de `figma-baselines/`
3. Execute `npm run test:visual`

Consulte <a>`figma-baselines/README.md`</a> para instruções completas.

---

## Estrutura do Projeto

```
cpv-visual-regression-sellout/
├── figma-baselines/            ← PNGs exportados do Figma (baselines de design)
│   ├── home/
│   ├── login/
│   └── dashboard/
├── tests/
│   └── visual/
│       ├── helpers/
│       │   ├── disableAnimations.ts   ← Desabilita animações CSS para screenshots estáveis
│       │   ├── figmaComparison.ts     ← Comparação Figma vs Sistema baseada em Pixelmatch
│       │   └── waitForPage.ts         ← Aguarda a página estar em estado estável
│       ├── __snapshots__/             ← Baselines gerados automaticamente pelo Playwright (ignorados pelo git)
│       ├── cpv-home.visual.spec.ts    ← Testes da página Home
│       └── cpv-sellout.visual.spec.ts ← Testes de Login e Dashboard
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Fluxo de Trabalho com Snapshot Baseline

| Situação | Comando |
|---|---|
| Primeira execução | `npm run test:visual:update` |
| Execução normal dos testes | `npm run test:visual` |
| Design alterado intencionalmente | `npm run test:visual:update` |
| Diff inesperado encontrado | Investigar o diff em `test-results/` |

---

## Evidência de Diff

Em caso de falha, o Playwright salva:
- `test-results/` → screenshots reais e diffs (modo baseline do Playwright)
- `test-results/figma-diffs/` → PNGs real, baseline do Figma e diff (modo comparação com Figma)
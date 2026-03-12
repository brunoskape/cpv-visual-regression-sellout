# Baselines do Figma

Esta pasta armazena imagens PNG exportadas do Figma, utilizadas como **baseline de design** para os testes de comparação visual.

## Estrutura de Pastas

```
figma-baselines/
├── home/
│   ├── home-full-page.png      ← Exportação do frame completo da página
│   └── home-header.png         ← Exportação do componente de cabeçalho
├── login/
│   └── login-full-page.png
└── dashboard/
    └── dashboard-full-page.png
```

## Como Exportar do Figma

1. Abra o projeto no Figma
2. Selecione o **Frame** que deseja exportar
3. No painel direito, acesse **Export (Exportar)**
4. Defina o formato como **PNG** e resolução **1x**
5. Configure a largura do frame para **1440px** (desktop)
6. Clique em **Export** e salve o arquivo na pasta correta indicada acima

## Regras Importantes

- Sempre exporte na escala **1x** para evitar incompatibilidade de tamanho
- A largura do frame deve corresponder ao viewport definido em `playwright.config.ts` (**1440px**)
- Faça commit dos arquivos PNG de baseline no repositório para que o time compartilhe a mesma referência
- Quando o design mudar intencionalmente, atualize a exportação do Figma e faça commit do novo baseline

## Executando os Testes de Comparação com Figma

```bash
# Executar todos os testes visuais (testes de comparação com Figma serão ignorados se o baseline não for encontrado)
npm run test:visual

# Visualizar o relatório HTML com as imagens de diff
npm run test:visual:report
```

## Onde Encontrar as Imagens de Diff

Após executar os testes, as imagens de diff (real vs figma vs diff) são salvas em:

```
test-results/figma-diffs/
├── home-full-page-actual.png
├── home-full-page-figma-baseline.png
└── home-full-page-diff.png
```
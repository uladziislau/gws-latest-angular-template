// @ts-check
// ESLint остался ТОЛЬКО на шаблонах: oxlint HTML не парсит, а
// TypeScript/JavaScript линтует oxlint (см. .oxlintrc.json).
//
// @eslint/js больше не нужен и не объявляется зависимостью: он был
// требуем, но отсутствовал в package.json, из-за чего `pnpm run lint`
// падал с "Cannot find module '@eslint/js'". Правила для TypeScript
// теперь выполняет oxlint.
//
// Блок **/*.ts существует только ради инлайн-шаблонов `template: \`...\``:
// processor вытаскивает их в виртуальный файл с расширением .html,
// который подхватывает следующий блок. Самих правил для TypeScript
// здесь нет - это работа oxlint.
//
// Парсер обязателен: без него .ts читается дефолтным JS-парсером и
// падает на синтаксисе TypeScript.
const {defineConfig} = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    languageOptions: {parser: tseslint.parser},
    processor: angular.processInlineTemplates,
  },
  {
    files: ['**/*.html'],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
]);
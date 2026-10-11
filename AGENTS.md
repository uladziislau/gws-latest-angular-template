# AGENTS.md

## Команды

```bash
pnpm install          # зависимости
  dev: cross-env PORT=3000 NG_DISABLE_VERSION_CHECK=true ng serve --host 0.0.0.0 --port 3000
  build: cross-env NG_DISABLE_VERSION_CHECK=true ng build --configuration production
  test: cross-env NG_DISABLE_VERSION_CHECK=true ng test
  lint: pnpm run lint:ts && pnpm run lint:html
  typecheck: —
```

## Структура

Слои в корне: src

## Линтер

oxlint (TypeScript/JavaScript) + angular-eslint (шаблоны).

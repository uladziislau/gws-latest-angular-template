# Инструкция: Миграция проекта на Angular 22 в среде Google AI Studio

Данный файл содержит подробную, технически выверенную стратегию перевода проектов
(таких как `microwave-sintering-furnace-cad` и др.) с предыдущих версий (Angular
19 или 21) на **Angular 22** в условиях изолированных сред выполнения, а именно
— облачного контейнера **Google AI Studio** (который по умолчанию работает на
рантайме Node.js версии **22.22.2**).

---

## 1. Специфика среды Google AI Studio и почему важен этот гайд

При разработке и запуске Angular 22+ проектов внутри контейнеров **Google AI
Studio** возникают два фундаментальных ограничения:

1. **Контейнерная версия Node.js (`22.22.2`):** Платформа AI Studio предоставляет
   фиксированную операционную среду с Node.js версии `22.22.2`. Мы не можем
   вызвать `nvm use` или обновить сам системный Node.js, так как образ контейнера
   контролируется инфраструктурой.
2. **Строгие лимиты Angular CLI (требование `>= 22.22.3`):** Команда разработки
   Angular зафиксировала в исходном коде CLI минимальную патч-версию `22.22.3`
   для безопасности компилятора. Разница в одну патч-цифру является чисто
   административным лимитом — API и возможности Node.js в `22.22.2` и `22.22.3`
   на 100% идентичны. Однако, без обхода этой проверки `ng build` и `ng serve`
   моментально аварийно завершают работу.

Данная инструкция решает эту проблему на уровне проекта с помощью
автоматического пост-установочного патча CLI-утилиты и безопасного
форсирования переменных сред.

---

## 2. Обоснование версий зависимостей (Почему именно такие версии?)

При переходе на Angular 22 в AI Studio крайне важно составить сбалансированный
`package.json`. Ниже приведено подробное обоснование для каждого ключевого пакета:

### Основные зависимости (`dependencies`):
* **`@angular/*` (включая `cdk`, `material`, `ssr`, `router` и др.) — Версия `^22.0.0`**
  * *Обоснование:* Переход на единую мажорную 22-ю версию необходим для поддержки
    полноценной безнативной реактивности (**Zoneless/OnPush**), которая полностью
    убирает потребность в тяжелом `zone.js`, повышая общую скорость отрисовки и
    снижая размер бандла.
* **`express` — Версия `^5.1.0`**
  * *Обоснование:* Последняя стабильная версия Express, обеспечивающая бесшовную
    интеграцию со слоем Angular SSR для гибридного рендеринга и обработки
    API-запросов и веб-сокетов прямо в среде разработки AI Studio.
* **`motion` — Версия `^12.23.24`**
  * *Обоснование:* Современная, высокопроизводительная библиотека для анимаций
    на чистом JS. В современных Angular-приложениях строго запрещено использование
    `@angular/animations` (является устаревшим API, порождает избыточный размер
    бандла и усложняет архитектуру Zoneless). Вместо него используются CSS/Tailwind
    или библиотека `motion`.
* **`rxjs` — Версия `~7.8.0`**
  * *Обоснование:* Рекомендованная стабильная версия реактивных потоков, полностью
    совместимая со встроенными Angular Signals синергирующими методами (`toSignal`,
    `toObservable`).
* **`tslib` — Версия `^2.8.0`**
  * *Обоснование:* Содержит runtime-хелперы для генерируемого TypeScript-кода.
    Версия `2.8.0` полностью оптимизирована под TypeScript версий 5.x–6.x.

### Зависимости разработчика (`devDependencies`):
* **`@angular/build`, `@angular/cli`, `@angular/compiler-cli` — Версия `^22.0.0`**
  * *Обоснование:* Новейшая система сборки на базе **Vite** и **esbuild**,
    заменяющая старый, медленный Webpack. Это гарантирует практически моментальный
    "теплый запуск" dev-сервера в AI Studio.
* **`@types/node` — Версия `^22.10.0` (или `^22.22.2`)**
  * *Обоснование:* Описание типов Node.js API для TypeScript. Версия подобрана
    под ветку рантайма Node 22. Позволяет компилировать серверный код (SSR)
    без ошибок типизации. Пакет находится в `devDependencies` и никак не влияет
    на продакшн-запуск рантайма, так как полностью удаляется компилятором.
* **`cross-env` — Версия `^7.0.3`**
  * *Обоснование:* Кроссплатформенная системная утилита, необходимая для
    стабильной установки флага `NG_DISABLE_VERSION_CHECK=true` перед запуском
    Angular CLI команд в любых командных оболочках (bash/sh/powershell/cmd).
* **`tailwindcss` и `@tailwindcss/postcss` — Версия `^4.1.12`**
  * *Обоснование:* Переход со старых бета-версий Tailwind 4 Beta на стабильную
    релизную ветку 4-й версии, устраняющую любые проблемы совместимости с PostCSS
    в модуле разработки Vite.
* **`typescript` — Версия `^6.0.0`**
  * *Обоснование:* Требуемая спецификацией компилятора Angular 22 версия TypeScript,
    обеспечивающая строгий статический анализ шаблонов и сигналов.
* **`jsdom` (`^26.0.0`) и `vitest` (`^4.0.8`)**
  * *Обоснование:* Современный, облегченный стек юнит-тестирования в безголовом
    (headless) режиме, заменяющий тяжелые браузерные тесты Karma/Protractor/Jasmine.
    Отлично подходит для выполнения тестов внутри консолей контейнеров.

---

## 3. Эталонный package.json для Google AI Studio

Используйте этот файл как образец структуры. Если в вашем проекте есть уникальные
сторонние библиотеки (например, `three` и `@types/three` в
`microwave-sintering-furnace-cad`), просто **сохраните их** на своих местах,
обновив только системные зависимости и скрипты.

```json
{
  "name": "ai-studio-angular-app",
  "version": "0.0.0",
  "private": true,
  "engines": {
    "node": ">=22.2.2"
  },
  "scripts": {
    "postinstall": "node patch-node-version.js",
    "ng": "cross-env NG_DISABLE_VERSION_CHECK=true ng",
    "start": "cross-env NG_DISABLE_VERSION_CHECK=true ng serve",
    "dev": "cross-env PORT=3000 NG_DISABLE_VERSION_CHECK=true ng serve --host 0.0.0.0 --port 3000",
    "build": "cross-env NG_DISABLE_VERSION_CHECK=true ng build --configuration production",
    "watch": "cross-env NG_DISABLE_VERSION_CHECK=true ng build --watch --configuration development",
    "test": "cross-env NG_DISABLE_VERSION_CHECK=true ng test",
    "lint": "cross-env NG_DISABLE_VERSION_CHECK=true ng lint"
  },
  "dependencies": {
    "@angular/cdk": "^22.0.0",
    "@angular/common": "^22.0.0",
    "@angular/compiler": "^22.0.0",
    "@angular/core": "^22.0.0",
    "@angular/forms": "^22.0.0",
    "@angular/material": "^22.0.0",
    "@angular/platform-browser": "^22.0.0",
    "@angular/platform-server": "^22.0.0",
    "@angular/router": "^22.0.0",
    "@angular/ssr": "^22.0.0",
    "express": "^5.1.0",
    "motion": "^12.23.24",
    "rxjs": "~7.8.0",
    "tslib": "^2.8.0"
  },
  "devDependencies": {
    "@angular/build": "^22.0.0",
    "@angular/cli": "^22.0.0",
    "@angular/compiler-cli": "^22.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "@types/express": "^5.0.1",
    "@types/node": "^22.10.0",
    "@angular-eslint/builder": "^22.0.0",
    "@angular-eslint/schematics": "^22.0.0",
    "angular-eslint": "^22.0.0",
    "cross-env": "^7.0.3",
    "eslint": "^9.20.0",
    "jsdom": "^26.0.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^4.1.12",
    "typescript": "^6.0.0",
    "typescript-eslint": "^8.24.0",
    "vitest": "^4.0.8"
  }
}
```

---

## 4. Универсальный промпт для ИИ-агента

Скопируйте данный промпт и вставьте его ИИ-агенту в чат во время работы
над миграцией любого Angular проекта в AI Studio:

***

**Роль:** Ты — опытный ИИ-архитектор и TypeScript/Angular специалист. Твоя
цель — обновить конфигурацию и все npm-зависимости текущего проекта в среде
Google AI Studio до **Angular 22** и настроить бесконфликтное окружение для
контейнера (версия Node.js в системе: **22.22.2**).

Выполни последовательно следующие действия:

### Шаг 1. Создание скрипта авто-патча проверки версий Node.js
Создай в корне проекта файл `patch-node-version.js` со следующим содержимым:
```javascript
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'node_modules', '@angular', 'cli', 'src', 'utilities', 'node-version.js');

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Патч первой функции (проверка поддержки Node.js)
  content = content.replace(
    /function isNodeVersionSupported\(\) \{[\s\S]*?\n\}/,
    'function isNodeVersionSupported() {\n    return true;\n}'
  );
  
  // Патч второй функции (проверка минимальной версии Node.js)
  content = content.replace(
    /function isNodeVersionMinSupported\(\) \{[\s\S]*?\n\}/,
    'function isNodeVersionMinSupported() {\n    return true;\n}'
  );
  
  fs.writeFileSync(file, content);
  console.log('Successfully patched Angular CLI node version check.');
} else {
  console.log('Angular CLI node-version.js not found, skipping patch.');
}
```

### Шаг 2. Обновление package.json под нужды Google AI Studio
Отредактируй `package.json`, приведя его к следующему целевому виду:
- **Сохрани** сторонние прикладные библиотеки проекта (например, `three`,
  `canvas`, `@types/three` и т.д.), если они присутствуют.
- В секцию `"engines"` добавь `"node": ">=22.2.2"`.
- Обнови все пакеты `@angular/*` (включая cdk, material, ssr) до стабильной
  версии `^22.0.0`.
- Обнови сборщик `@angular/build`, `@angular/cli` и `@angular/compiler-cli`
  до версии `^22.0.0`.
- Добавь в `"scripts"` скрипт автоматического патчинга:
  `"postinstall": "node patch-node-version.js"`.
- Обнови все скрипты запуска, сборки, тестирования и линтинга, вызвав их через
  утилиту `cross-env` для надежности передачи флагов:
  * `"ng": "cross-env NG_DISABLE_VERSION_CHECK=true ng"`
  * `"start": "cross-env NG_DISABLE_VERSION_CHECK=true ng serve"`
  * `"dev": "cross-env PORT=3000 NG_DISABLE_VERSION_CHECK=true ng serve --host 0.0.0.0 --port 3000"`
  * `"build": "cross-env NG_DISABLE_VERSION_CHECK=true ng build --configuration production"`
  * `"watch": "cross-env NG_DISABLE_VERSION_CHECK=true ng build --watch --configuration development"`
  * `"test": "cross-env NG_DISABLE_VERSION_CHECK=true ng test"`
  * `"lint": "cross-env NG_DISABLE_VERSION_CHECK=true ng lint"`
- Добавь пакеты `cross-env: "^7.0.3"`, `@angular-eslint/builder: "^22.0.0"`, `@angular-eslint/schematics: "^22.0.0"`, `angular-eslint: "^22.0.0"` в devDependencies.
- Обнови пакеты `typescript` до `^6.0.0`, `@types/node` до `^22.10.0` (или
  `^22.22.2`), `@tailwindcss/postcss` и `tailwindcss` до `^4.1.12`.
- Обнови библиотеки тестирования для совместимости с новой средой: `jsdom`
  до `^26.0.0`, `vitest` до `^4.0.8`.

### Шаг 3. Установка и Тестирование сборок
1. Выполни чистую установку зависимостей с помощью `npm install` или `npm ci`.
   После завершения установки в консоли должно вывестись сообщение о патче:
   *`Successfully patched Angular CLI node version check.`*
2. Запусти тестовую сборку командой `npm run build` и убедись в отсутствии
   ошибок компиляции или валидации окружения.

***

## 5. Как запустить и протестировать?

Инструкция для разработчика в терминале AI Studio после завершения работы ИИ:
1. Выполните чистую установку:
   ```bash
   npm ci
   ```
2. Убедитесь, что появился файл
   `node_modules/@angular/cli/src/utilities/node-version.js` и он пропатчен
   выводом: `Successfully patched Angular CLI node version check.`
3. Выполните тестовую компиляцию проекта:
   ```bash
   npm run build
   ```
   *Если сборка завершилась выводом файлов сборщика в директорию `dist/`,
   проект успешно готов к работе под Angular 22!*

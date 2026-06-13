# Google AI Studio Build: Angular 22 Universal Template (FSD)

🌍 *[Русская версия (Russian Version) находится ниже](#универсальный-шаблон-angular-22-fsd-для-google-ai-studio)*

This repository provides a bleeding-edge, highly optimized universal template designed specifically for generation and rapid prototyping within the **Google AI Studio Build** environment. It is structured to allow an AI Agent to assemble complete features modularly, much like LEGO.

🔗 **[Live Demo on Google AI Studio](https://ai.studio/apps/75b78179-6774-4f20-b890-182f0b549e24?fullscreenApplet=true)**

## 🚀 Why This Template?
When working with AI agents in cloud sandboxes, structural clarity and deterministic dependency resolutions are critical. This template mitigates LLM hallucinations and sandbox constraints by establishing a robust, self-contained framework based on **Feature-Sliced Design (FSD)** architecture. 

It aims to solve the "blank slate" problem in Google AI Studio, allowing you (and the agent) to focus entirely on generating robust business logic rather than battling environment configurations or boilerplate setup.

### 📚 Angular 22 Migration Guide
Since Google AI Studio uses an isolated execution container with a specific version of Node.js (`v22.22.2`), regular updates of standard Angular CLI packages break with `ng build` errors.

We have included an important solution for this — the [AI Studio Angular 22 Migration Guide (`/docs/migration-to-angular-22.md`)](./docs/migration-to-angular-22.md). It outlines both the theoretical underpinning of the Node Engine validation step and provides an exact prompt that forces the AI Agent to patch and bypass these constraints smoothly!

### 🏗️ Architecture & Stack
*   **Framework:** Angular 22 (Strict Mode, `Node >= 22.2.2`).
*   **Performance:** 100% **Zoneless** (`provideZonelessChangeDetection`), `ChangeDetectionStrategy.OnPush` enforced by default across all components.
*   **Reactivity:** Deep integration of modern Signals — leveraging new APIs like `model()`, `linkedSignal()`, `resource()`, and the `@let` template syntax.
*   **Styling:** Tailwind CSS v4 (native `@tailwindcss/postcss` integration with esbuild Angular CLI builder).
*   **SSR:** Native Server-Side Rendering capabilities handled by Express v5, solving sandbox memory-leak challenges during concurrent async routing.
*   **Paradigm:** LLM-as-Admin. In AI Studio prototypes, standard Web Workers are active but persistent dynamic databases are usually omitted for speed. The LLM agent fully manages data state via direct TypeScript codebase mutations, functioning dynamically as both the database layer and the data administrator.

### 🧩 Feature-Sliced Design (FSD)
Modules are completely encapsulated inside the `src/app/features/*` directory. Each folder represents a self-contained domain model (Business Logic + State + UI). To reuse a generated feature in your next project, simply copy its directory — everything inherently wires up.

---

# Универсальный шаблон Angular 22 (FSD) для Google AI Studio

Этот репозиторий представляет собой высокооптимизированный базовый шаблон, спроектированный специально для быстрой разработки, генерации и прототипирования приложений внутри песочницы **Google AI Studio Build**. Его структура позволяет ИИ-агенту легко и безошибочно собирать новые модули приложения, словно из кубиков LEGO.

🔗 **[Посмотреть работу приложения в Google AI Studio](https://ai.studio/apps/75b78179-6774-4f20-b890-182f0b549e24?fullscreenApplet=true)**

## 🚀 В чем ценность проекта?
При работе с ИИ-агентами в облачных песочницах критически важна абсолютная четкость файловой структуры и детерминированность зависимостей. Данный шаблон решает проблему "чистого листа". Он сводит к минимуму возможность "галлюцинаций" языковой модели за счёт использования прозрачной и предсказуемой архитектуры — подходов **Feature-Sliced Design (FSD)**.

Шаблон устраняет все инфраструктурные препятствия, позволяя вам (и языковой модели) с самого первого промпта сфокусироваться исключительно на вашей бизнес-логике.

### 📚 Руководство по миграции на Angular 22 в AI Studio
Так как Google AI Studio работает в изолированном контейнере с фиксированной версией `Node.js` (`22.22.2`), стандартное обновление проектов до Angular 22 ломается о проверки версий Angular CLI.

В этом проекте мы подготовили [Эксклюзивный гайд по миграции на Angular 22 (`/docs/migration-to-angular-22.md`)](./docs/migration-to-angular-22.md). Он содержит теоретическое объяснение проблемы и готовый промпт для ИИ-агента, который элегантно патчит Angular CLI и обходит любые искусственные проверки песочницы!

### 🏗️ Архитектура и Технологии
*   **Фреймворк:** Angular 22 (Strict Mode, компилятор принудительно адаптирован под ограничения песочницы `Node >= 22.2.2`).
*   **Производительность:** Полностью **Zoneless**-рендеринг (`provideZonelessChangeDetection`) со строгой стратегией `OnPush`. Больше никаких лишних циклов детекции изменений.
*   **Реактивность:** Максимальное раскрытие потенциала современных сигналов (Signals): использование `model()`, `linkedSignal()`, `resource()` и локального синтаксиса шаблонов `@let`.
*   **Стилизация:** Интегрирован новый движок Tailwind CSS v4 через `@tailwindcss/postcss` и esbuild для молниеносной сборки в браузере.
*   **SSR (Server-Side Rendering):** Оптимизированный серверный рендеринг и маршрутизация на базе Express v5 (решает проблему утечек памяти при работе асинхронных роутеров в контейнерах).
*   **Парадигма работы с агентом (LLM-as-Admin):** При прототипировании в Google AI Studio пользовательский интерфейс зачастую не требует собственной внешней базы данных; все изменения эфемерны. В этой парадигме ИИ-агент выступает системным администратором: все операции с данными выполняются агентом через прямое обновление TypeScript-файлов прямо в рантайме.

### 🧩 Архитектура "Дизайн по фичам" (FSD)
Код приложения строго иерархичен и располагается в виде изолированных модулей (`src/app/features/*`). Каждая такая папка скрывает в себе как визуальные UI компоненты, так и бизнес-логику со своим стейтом. 
Хотите перенести работающую фичу в свой следующий большой проект? Просто скопируйте всю её директорию, и она мгновенно заработает в другом Angular-приложении.

## 🤝 Open-Source Community
Мы стремимся делиться рабочими практиками AI-first разработки. Используйте этот проект как надёжный фундамент для воплощения ваших следующих идей! Клонируйте, вдохновляйтесь и создавайте production-ready интерфейсы за считанные секунды в связке с LLM.

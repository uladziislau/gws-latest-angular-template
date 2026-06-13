# 🚀 Google AI Studio: Универсальный шаблон Angular 22 (Zoneless)

[![Angular](https://img.shields.io/badge/Angular-22.0.0-dd1b16?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google AI Studio](https://img.shields.io/badge/Google_AI_Studio-Agentic_Workspace-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)

Этот репозиторий представляет собой **целевое решение** проблемы с версиями фреймворков внутри песочницы Google AI Studio. Данный шаблон позволяет вам полноценно использовать новейший **Angular 22** прямо в браузере при работе с агентом.

🔗 **[Посмотреть работу приложения в Google AI Studio](https://ai.studio/apps/75b78179-6774-4f20-b890-182f0b549e24?fullscreenApplet=true)**

---

## ⚠️ Проблема: Google AI Studio генерирует Angular 21

По умолчанию, если вы попросите ИИ-агента создать проект на Angular, он безопасно выберет Angular 21.

**Почему?** Потому что контейнер AI Studio работает на строгой, залоченной версии Node.js (`v22.22.2`). Однако, новая версия Angular CLI (`@angular/cli@22.0.0`) имеет жесткую проверку, которая требует наличия Node `>=22.22.3`.

Из-за этой искусственной разницы всего в одну патч-версию (0.0.1!), любая попытка обновить или создать с нуля проект на Angular 22 внутри чата AI Studio приведёт к моментальному падению сборки `ng build`.

## 🛠️ Решение: Данный шаблон

Этот репозиторий обходит данное искусственное ограничение, используя специально подготовленные конфигурационные хаки (патчи). Используя этот шаблон как стартовую точку, вы открываете для ИИ-агента возможность генерировать код с использованием самых современных возможностей Angular 22.

Мы подготовили подробный разбор этой проблемы и процесса её решения: [Гайд по миграции на Angular 22 (`/docs/migration-to-angular-22.md`)](./docs/migration-to-angular-22.md).

---

## 🏗️ Архитектура и Технологии
Шаблон оптимизирован для генерации кода LLM (снижает галлюцинации и уменьшает контекст):

*   **Фреймворк:** Angular 22 (Strict Mode, пропатчен для AI Studio).
*   **100% Zoneless:** включён `provideZonelessChangeDetection`, пакет `zone.js` полностью удалён для молниеносной производительности.
*   **Современная реактивность:** Максимальное раскрытие потенциала современных сигналов (`model()`, `linkedSignal()`, `resource()`).
*   **Стилизация:** Интегрирован новый движок **Tailwind CSS v4** через `@tailwindcss/postcss`.
*   **Свобода Архитектуры:** Шаблон не навязывает жестких догм (например, FSD). Вы можете строить проект по Domain-Driven Design (DDD), Feature-Sliced Design или использовать любую другую удобную вам структуру — это абсолютно чистый холст для ваших идей.

### 🤖 Парадигма работы с агентом (LLM-as-Admin)
При прототипировании в Google AI Studio внешние базы данных чаще всего излишни. Шаблон использует парадигму **LLM-as-Admin**: ИИ-агент выступает одновременно сервером и базой данных, динамически обновляя TypeScript-код и локальное состояние "на лету" прямо во время вашего диалога.

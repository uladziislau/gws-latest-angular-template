# 🚀 Google AI Studio: Angular 22 Universal Template (Zoneless)

[![Angular](https://img.shields.io/badge/Angular-22.0.0-dd1b16?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google AI Studio](https://img.shields.io/badge/Google_AI_Studio-Agentic_Workspace-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)

🌍 *[Русская версия (Russian Version) README.ru.md](./README.ru.md)*

This repository is **a targeted solution** for a specific limitation inside the Google AI Studio agentic workspace. It acts as a bleeding-edge, highly optimized universal template designed to let you build **Angular 22** applications directly in the platform.

🔗 **[Live Demo on Google AI Studio](https://ai.studio/apps/75b78179-6774-4f20-b890-182f0b549e24?fullscreenApplet=true)**

---

## ⚠️ The Problem: Google AI Studio generates Angular 21

By default, if you ask the Google AI Agent to build an Angular project, it will safely default to Angular 21. 

**Why?** Because the AI Studio execution container sandbox runs on a strictly locked Node.js version (`v22.22.2`). However, the Angular CLI (`@angular/cli@22.0.0`) has a hardcoded security check that requires Node `>=22.22.3`. 

Because of this rigid **patch-version difference** (0.0.1!), attempting to upgrade or generate a raw Angular 22 project in the AI Studio chat will instantly lead to `ng build` crashing.

## 🛠️ The Solution: This Template

This repository bypasses this artificial limitation using a targeted configuration workaround. By utilizing this template as your starting point, you unlock the ability to prompt the AI agent using the absolute latest Angular capabilities.

We have included a detailed breakdown of the fix in our [AI Studio Angular 22 Migration Guide (`/docs/migration-to-angular-22.en.md`)](./docs/migration-to-angular-22.en.md).

---

## 🏗️ Architecture & Stack
This template is optimized for LLM readability, reducing context pollution and preventing AI "hallucinations":

*   **Framework:** Angular 22 (Strict Mode, patched for AI Studio).
*   **100% Zoneless:** `provideZonelessChangeDetection` enabled, zero `zone.js` dependencies for lightning-fast performance in the cloud IDE.
*   **Modern Reactivity:** Deep integration of Signals (`model()`, `linkedSignal()`, `resource()`), perfectly suited for AI-generated components.
*   **Styling:** Native **Tailwind CSS v4** via `@tailwindcss/postcss` for instant browser side-rendering.
*   **Architectural Freedom:** There are no strict architectural dogmas like FSD enforced. Whether you want to use Feature-Sliced Design, Domain-Driven Design (DDD), or a simple flat structure, this template stays out of your way and provides a clean canvas.

### 🤖 LLM-as-Admin Paradigm
While building prototypes in Google AI Studio, external databases are often unnecessary boilerplate. This template embraces the **LLM-as-Admin** paradigm: the AI agent acts as both the backend and the database, dynamically modifying the TypeScript codebase and local state in real-time as you chat with it.

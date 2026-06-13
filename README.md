# Google AI Studio Build: Angular 22 Universal Template (FSD)

This repository provides a bleeding-edge, highly optimized universal template designed specifically for generation and rapid prototyping within the **Google AI Studio Build** environment. It is structured to allow an AI Agent to assemble complete features modularly, much like LEGO.

🔗 **[Live Demo on Google AI Studio](https://ai.studio/apps/75b78179-6774-4f20-b890-182f0b549e24?fullscreenApplet=true)**

## 🚀 Why This Template?
When working with AI agents in cloud sandboxes, structural clarity and deterministic dependency resolutions are critical. This template mitigates LLM hallucinations and sandbox constraints by establishing a robust, self-contained framework based on **Feature-Sliced Design (FSD)** architecture. 

It aims to solve the "blank slate" problem in Google AI Studio, allowing you (and the agent) to focus entirely on generating robust business logic rather than battling environment configurations or boilerplate setup.

### 📚 Angular 22 Migration Guide
Since Google AI Studio uses an isolated execution container with a specific version of Node.js (`v22.22.2`), regular updates of standard Angular CLI packages break with `ng build` errors.

We have included an important solution for this — the [AI Studio Angular 22 Migration Guide (`/docs/migration-to-angular-22.en.md`)](./docs/migration-to-angular-22.en.md). It outlines both the theoretical underpinning of the Node Engine validation step and provides an exact prompt that forces the AI Agent to patch and bypass these constraints smoothly!

### 🏗️ Architecture & Stack
*   **Framework:** Angular 22 (Strict Mode, `Node >= 22.2.2`).
*   **Performance:** 100% **Zoneless** (`provideZonelessChangeDetection`), `ChangeDetectionStrategy.OnPush` enforced by default across all components.
*   **Reactivity:** Deep integration of modern Signals — leveraging new APIs like `model()`, `linkedSignal()`, `resource()`, and the `@let` template syntax.
*   **Styling:** Tailwind CSS v4 (native `@tailwindcss/postcss` integration with esbuild Angular CLI builder).
*   **SSR:** Native Server-Side Rendering capabilities handled by Express v5, solving sandbox memory-leak challenges during concurrent async routing.
*   **Paradigm:** LLM-as-Admin. In AI Studio prototypes, standard Web Workers are active but persistent dynamic databases are usually omitted for speed. The LLM agent fully manages data state via direct TypeScript codebase mutations, functioning dynamically as both the database layer and the data administrator.

### 🧩 Feature-Sliced Design (FSD)
Modules are completely encapsulated inside the `src/app/features/*` directory. Each folder represents a self-contained domain model (Business Logic + State + UI). To reuse a generated feature in your next project, simply copy its directory — everything inherently wires up.

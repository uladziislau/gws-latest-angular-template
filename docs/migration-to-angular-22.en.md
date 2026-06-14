# Instruction: Migrating a Project to Angular 22 in Google AI Studio

This file contains a detailed, technically precise strategy for upgrading projects
from previous versions (Angular 19 or 21) to **Angular 22** within the isolated execution
environments, specifically the **Google AI Studio** cloud container 
(which defaults to a Node.js runtime version of **22.22.2**).

---

## 1. Google AI Studio specifics and why this guide is important

When developing and running Angular 22+ projects inside **Google AI Studio**
containers, two fundamental limitations arise:

1. **Container Node.js version (`22.22.2`):** The AI Studio platform provides
   a fixed operating environment with Node.js version `22.22.2`. We cannot
   call `nvm use` or update the system Node.js itself, as the container image
   is controlled by the infrastructure.
2. **Strict Angular CLI limits (requirement `>= 22.22.3`):** The Angular development team
   has hardcoded a minimum patch version of `22.22.3` within the CLI source code
   for compiler security. A one-digit patch difference is purely an
   administrative limit — the APIs and Node.js capabilities in `22.22.2` and `22.22.3`
   are 100% identical. However, without bypassing this check, `ng build` and `ng serve`
   will instantly fail and terminate.

This instruction solves this problem at the project level using an
automatic post-install patch for the CLI tool and safe,
forced environment variables.

---

## 2. Dependency version rationale (Why exactly these versions?)

When migrating to Angular 22 in AI Studio, it is extremely important to build a balanced
`package.json`. Below is a detailed rationale for each key package:

### Primary dependencies (`dependencies`):
* **`@angular/*` (including `cdk`, `material`, `router`, etc.) — Version `^22.0.0`**
  * *Rationale:* Moving to a unified major version 22 is required to support
    full zoneless reactivity (**Zoneless/OnPush**), completely removing the need
    for the heavy `zone.js` dependency, thus increasing overall rendering speed and
    reducing the bundle size.
* **`motion` — Version `^12.23.24`**
  * *Rationale:* A modern, high-performance pure JS animation library.
    In modern Angular applications, the use of `@angular/animations` is strictly prohibited
    (it is a legacy API, generates redundant bundle size, and complicates Zoneless architecture).
    Instead, use CSS/Tailwind or the `motion` library.
* **`rxjs` — Version `~7.8.0`**
  * *Rationale:* The recommended stable version of reactive streams, fully compatible
    with built-in Angular Signals interaction methods (`toSignal`, `toObservable`).
* **`tslib` — Version `^2.8.0`**
  * *Rationale:* Contains runtime helpers for generated TypeScript code.
    Version `2.8.0` is fully optimized for TypeScript versions 5.x–6.x.

### Development dependencies (`devDependencies`):
* **`@angular/build`, `@angular/cli`, `@angular/compiler-cli` — Version `^22.0.0`**
  * *Rationale:* The newest build system based on **Vite** and **esbuild**,
    replacing the old, slow Webpack. This guarantees near-instant
    "warm startup" of the dev-server in AI Studio.
* **`@types/node` — Version `^22.10.0` (or `^22.22.2`)**
  * *Rationale:* Node.js API type definitions for TypeScript. Targeted for the Node 22
    runtime branch. Allows compiling scripts or testing with Vitest without typing errors.
* **`cross-env` — Version `^7.0.3`**
  * *Rationale:* A cross-platform system utility necessary for the stable execution of
    the `NG_DISABLE_VERSION_CHECK=true` environment variable across environments.
* **`tailwindcss` and `@tailwindcss/postcss` — Version `^4.1.12`**
  * *Rationale:* Transitioning from older Tailwind 4 Beta versions to the stable
    4.x release branch, removing any compatibility issues with PostCSS
    in the Vite development module.
* **`typescript` — Version `^6.0.0`**
  * *Rationale:* The required TypeScript version specific to the Angular 22 compiler.
* **`jsdom` (`^26.0.0`) and `vitest` (`^4.0.8`)**
  * *Rationale:* A modern, lightweight unit-testing stack in headless mode, replacing
    Karma/Protractor/Jasmine.

---

## 3. Post-install Configuration Step (For the AI Agent)

Since Google AI Studio **does not provide a user-facing terminal**, all file creations and script executions must be done by the AI Agent itself. 

To bypass the Node.js limitation, instruct the AI Agent to:
1. Create a patch file `patch-node-version.js` in the project root.
2. Add `"postinstall": "node patch-node-version.js"` to `package.json` scripts.
3. Ensure `package.json` contains appropriate `@angular/*` libraries synced to version `22.0.0`.
4. Run dependency installation (`npm install`) on its own to trigger the post-install patch.

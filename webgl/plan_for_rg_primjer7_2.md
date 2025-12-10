# Restructuring Plan for RG-primjer7-2-bojanje-vrhova.html

This document outlines a step-by-step plan to reorganize the code in [`RG-primjer7-2-bojanje-vrhova.html`](../webgl/RG-primjer7-2-bojanje-vrhova.html) to achieve a modular structure similar to [`zad_5.html`](../webgl/zad_5.html) and [`zad_5.ts`](../webgl/ts/zad_5.ts). The focus is on separating concerns, extracting inline JavaScript into TypeScript files, leveraging existing abstractions (e.g., utility classes), and centralizing low-level WebGL operations. This will improve maintainability without writing new code—only reorganizing existing logic.

## 1. General Principles
- **Modularity**: Break down the inline JavaScript into dedicated TypeScript classes and utility functions, mirroring the class-based structure in [`zad_5.ts`](../webgl/ts/zad_5.ts) (e.g., separate classes for tasks like `zad_1` and `zad_2`).
- **Separation of Concerns**: Move WebGL-specific operations (e.g., buffer management, shader setup) to utility files like [`webgl_pomocnici.ts`](../webgl/ts/webgl_pomocnici.ts).
- **HTML Simplification**: Reduce [`RG-primjer7-2-bojanje-vrhova.html`](../webgl/RG-primjer7-2-bojanje-vrhova.html) to load external scripts, similar to how [`zad_5.html`](../webgl/zad_5.html) loads multiple JS files.
- **Reuse Existing Abstractions**: Integrate with classes like `Crtanje3D`, `GKS3D`, `MT3D` if applicable, or extend utilities to handle vertex coloring logic.
- **No New Code**: Only relocate and reorganize existing code; do not add new functionality.

## 2. Step-by-Step Reorganization Plan

### Step 1: Extract Inline JavaScript to a New TypeScript File
- Create a new file: `webgl/ts/rg_primjer7_2.ts`.
- Move the JavaScript from lines 8-53 in [`RG-primjer7-2-bojanje-vrhova.html`](../webgl/RG-primjer7-2-bojanje-vrhova.html) (the `WebGLaplikacija` function and related logic) into this file.
- Convert it into a class-based structure, e.g., `class RGPrimjer7_2 { ... }`, similar to `zad_1` and `zad_2` in [`zad_5.ts`](../webgl/ts/zad_5.ts).
  - Include constructor for initialization (e.g., getting WebGL context, setting up GPU program).
  - Add methods like `napuniSpremnike()` and `iscrtaj()` as class methods.
- At the end of the file, add an export or instantiation logic to run on window load, akin to the `main()` function in [`zad_5.ts`](../webgl/ts/zad_5.ts).

### Step 2: Separate Shader Code
- Extract both the vertex shader (lines 56-66) and fragment shader (lines 68-77) from the HTML into a single shared GLSL file.
  - Create `webgl/shaders/rg_primjer7_2.glsl` containing both shaders (vertex and fragment sections clearly separated, e.g., with comments).
- In `rg_primjer7_2.ts`, load this single GLSL file dynamically or via utilities in [`webgl_pomocnici.ts`](../webgl/ts/webgl_pomocnici.ts), instead of inline. Follow the naming convention where the GLSL file matches the TS file name (e.g., `task_7.ts` would pair with `task7.glsl`).

### Step 3: Enhance Utility Files for WebGL Operations
- Update [`webgl_pomocnici.ts`](../webgl/ts/webgl_pomocnici.ts) (or create if needed) to handle common WebGL tasks from the extracted code:
  - Add functions for buffer creation and binding (e.g., based on lines 33-40).
  - Include attribute location setup (lines 30-31) and drawing calls (line 48).
- Reference these utilities in `rg_primjer7_2.ts` to avoid duplicating low-level code, similar to how `Crtanje3D` abstracts drawing in [`zad_5.ts`](../webgl/ts/zad_5.ts).

### Step 4: Update the HTML File
- Remove all inline JavaScript and shader scripts from [`RG-primjer7-2-bojanje-vrhova.html`](../webgl/RG-primjer7-2-bojanje-vrhova.html).
- Add script tags to load compiled JavaScript files, mirroring [`zad_5.html`](../webgl/zad_5.html):
  - `<script src="js/webgl_pomocnici.js"></script>` (for utilities).
  - `<script src="js/rg_primjer7_2.js"></script>` (compiled from `rg_primjer7_2.ts`).
- Keep the canvas element and basic HTML structure intact.

### Step 5: Integrate with Existing Abstractions
- If vertex coloring logic fits, adapt it to use classes like `GKS3D` or `MT3D` from the codebase (as in [`zad_5.ts`](../webgl/ts/zad_5.ts)).
- For example, encapsulate vertex data (lines 20-26) and drawing (line 48) into methods that leverage these abstractions for transformations and rendering.

## 3. Testing and Validation
- After reorganization, compile TypeScript to JavaScript and test the HTML file to ensure it renders the same as the original.
- Verify no functionality is lost (e.g., triangle drawing with vertex colors).
- Check for modularity: Changes to shaders or buffers should only affect utility files, not the main class.

## 4. Benefits of This Structure
- Aligns with [`zad_5.html`](../webgl/zad_5.html) and [`zad_5.ts`](../webgl/ts/zad_5.ts) by using external scripts and class-based organization.
- Improves reusability for future examples, reducing inline code in HTML files.
- Easier maintenance, as WebGL specifics are centralized.

Implement these steps sequentially to avoid disruptions. If needed, refer to [`restructuring_guidelines.md`](../webgl/restructuring_guidelines.md) for broader project alignment.
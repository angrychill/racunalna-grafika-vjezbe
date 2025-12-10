# WebGL Code Restructuring Guidelines

This document provides detailed suggestions for reorganizing your WebGL codebase to improve modularity and clarity, aligning it with the structure seen in [`zad_5.ts`](../webgl/ts/zad_5.ts). The goal is to separate concerns, utilize existing abstractions, and centralize low-level operations. Below are the specific steps and guidelines for each key file or component. You can implement these changes at your own pace.

## 1. General Principles for Reorganization
- **Separation of Concerns**: Divide code into modules based on functionality (e.g., rendering logic, WebGL utilities, transformations).
- **Class-Based Structure**: Use dedicated classes for each exercise or visualization task, similar to how `zad_1` and `zad_2` are organized in [`zad_5.ts`](../webgl/ts/zad_5.ts).
- **Leverage Abstractions**: Utilize existing classes like `Crtanje2D`, `GKS2D`, `MT2D`, etc., to avoid direct WebGL or canvas manipulation in high-level logic.
- **Centralize Low-Level Operations**: Move WebGL-specific operations (shader setup, buffer management) into a utility module for reuse.

## 2. Specific Guidelines for Key Files

### 2.1 Restructuring [`vj_6.ts`](../webgl/ts/vj_6.ts)
- **Current Issue**: The file mixes high-level rendering logic with low-level WebGL operations (e.g., shader program setup, buffer data).
- **Suggested Changes**:
  - Create a dedicated class (e.g., `Vj6Task`) to encapsulate the rendering logic for this exercise.
  - Remove direct WebGL calls (like `gl.createBuffer()`, `gl.drawArrays()`) from the main class logic and delegate them to a utility function in [`webgl_pomocnici.ts`](../webgl/ts/webgl_pomocnici.ts).
  - Use existing abstractions like `Crtanje2D` and `GKS2D` for drawing operations if applicable, mirroring the approach in [`zad_5.ts`](../webgl/ts/zad_5.ts).
  - Keep animation logic (e.g., `animiraj()` method) within the class, similar to how it's handled in [`zad_5.ts`](../webgl/ts/zad_5.ts).

### 2.2 Enhancing [`webgl_pomocnici.ts`](../webgl/ts/webgl_pomocnici.ts)
- **Current Issue**: This file currently handles shader compilation and program linking but does not cover other WebGL operations used in [`vj_6.ts`](../webgl/ts/vj_6.ts).
- **Suggested Changes**:
  - Add methods for buffer creation, binding, and data loading (e.g., `createAndBindBuffer()`).
  - Include functions for setting up uniforms and drawing operations (e.g., `setUniforms()`, `drawShape()`).
  - Ensure these utilities are reusable across different exercises, reducing code duplication.

### 2.3 Refactoring Inline JavaScript in [`RG-primjer6-2-uniform-varijable.html`](../webgl/RG-primjer6-2-uniform-varijable.html)
- **Current Issue**: This HTML file contains inline JavaScript that duplicates WebGL logic found in [`vj_6.ts`](../webgl/ts/vj_6.ts), reducing maintainability.
- **Suggested Changes**:
  - Extract the inline JavaScript (lines 20-95) into a new TypeScript file (e.g., `rg_primjer6.ts`) in the `webgl/ts` directory.
  - Organize the extracted code into a class structure similar to [`zad_5.ts`](../webgl/ts/zad_5.ts), with a clear separation between initialization and rendering.
  - Reference the new TypeScript file in the HTML via a `<script>` tag after compiling it to JavaScript.

### 2.4 Consistent Use of Abstracted Classes Across Exercises
- **Current Issue**: Some files like [`vj_6.ts`](../webgl/ts/vj_6.ts) do not fully utilize the abstracted classes available in the codebase.
- **Suggested Changes**:
  - For 2D rendering tasks, consistently use `Crtanje2D`, `GKS2D`, and `MT2D` for drawing and transformations.
  - For 3D tasks, use `Crtanje3D`, `GKS3DPerspective`, and `MT3D` as seen in [`zad_5.ts`](../webgl/ts/zad_5.ts).
  - Avoid direct manipulation of canvas or WebGL context in exercise-specific files.

## 3. Documentation Recommendations
- **Purpose of Each Module**: Add a comment block at the top of each TypeScript file describing its role (e.g., "Utility class for WebGL shader and buffer management" for [`webgl_pomocnici.ts`](../webgl/ts/webgl_pomocnici.ts)).
- **Class Responsibilities**: Within each class, include a brief comment on its purpose (e.g., "Handles rendering for Exercise 6 visualization" for a class in [`vj_6.ts`](../webgl/ts/vj_6.ts)).
- **Dependencies**: Note key dependencies or required imports to clarify how modules interact.

## 4. Additional Notes
- Focus on modularity to make future exercises easier to develop and maintain.
- Test each change incrementally to ensure compatibility with existing functionality.
- If you encounter specific challenges or need clarification on any step, feel free to revisit this guide or seek further assistance.

This guideline serves as a roadmap for reorganizing your WebGL codebase. Implement these changes at your discretion, prioritizing files or tasks as needed.
---
version: "alpha"
name: "Motion Design Sequence"
description: "Motion Design Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences."
colors:
  primary: "#00F0FF"
  secondary: "#171717"
  tertiary: "#0A45FF"
  neutral: "#171717"
  background: "#171717"
  surface: "#050505"
  text-primary: "#FFFFFF"
  text-secondary: "#737373"
  border: "#A3A3A3"
  accent: "#00F0FF"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "128px"
    fontWeight: 500
    lineHeight: "128px"
    letterSpacing: "-0.05em"
    textTransform: "uppercase"
  body-md:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: "20px"
spacing:
  base: "8px"
  sm: "8px"
  md: "10px"
  lg: "20px"
  xl: "24px"
  gap: "4px"
  card-padding: "48px"
  section-padding: "48px"
---

## Overview

- **Composition cues:**
  - Layout: Flex
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Minimal

## Colors

The color system uses dark mode with #00F0FF as the main accent and #171717 as the neutral foundation.

- **Primary (#00F0FF):** Main accent and emphasis color.
- **Secondary (#171717):** Supporting accent for secondary emphasis.
- **Tertiary (#0A45FF):** Reserved accent for supporting contrast moments.
- **Neutral (#171717):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #171717; Surface: #050505; Text Primary: #FFFFFF; Text Secondary: #737373; Border: #A3A3A3; Accent: #00F0FF

## Typography

Typography relies on Inter across display, body, and utility text.

- **Display (`display-lg`):** Inter, 128px, weight 500, line-height 128px, letter-spacing -0.05em, uppercase.
- **Body (`body-md`):** Inter, 16px, weight 400, line-height 24px.
- **Labels (`label-md`):** Inter, 14px, weight 300, line-height 20px.

## Layout

Layout follows a flex composition with reusable spacing tokens. Preserve the flex, full bleed structural frame before changing ornament or component styling. Use 8px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a flex / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Flex
- **Content width:** Full Bleed
- **Base unit:** 8px
- **Scale:** 8px, 10px, 20px, 24px, 48px
- **Section padding:** 48px
- **Card padding:** 48px
- **Gaps:** 4px, 12px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #A3A3A3; 1px #262626; 1px #737373
- **Shadows:** rgba(0, 0, 0, 0.5) 0px 0px 40px 0px inset; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.25) 0px 25px 50px -12px
- **Blur:** 4px, 24px

## Shapes

Shapes rely on a tight radius system anchored by 9999px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Component styling should inherit the shared button, icon, spacing, and surface rules instead of inventing one-off treatments. Favor a small family of repeatable patterns for actions, content containers, and fields.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 8px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected minimal motion intensity without a deliberate reason.

## Motion

Motion stays restrained and interface-led across text, layout, and scroll transitions. Easing favors ease.

**Motion Level:** minimal

**Easings:** ease

## WebGL

Reconstruct the graphics as a full-bleed background field using canvas-backed effect. The effect should read as technical, meditative, and atmospheric: dot-matrix particle field with black and sparse spacing. Build it from dot particles + soft depth fade so the effect reads clearly. Animate it as ambient drift with pointer sway. Interaction can react to the pointer, but only as a subtle drift. Preserve reduced motion + dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field
  - **Effect:**
    - **Value:** Dot-matrix particle field
  - **Primitives:**
    - **Value:** Dot particles + soft depth fade
  - **Motion:**
    - **Value:** Ambient drift with pointer sway
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** Canvas-backed effect

**Techniques:** Dot matrix, Pointer parallax, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- WebGL-style Canvas Layer -->
      <canvas id="bg-canvas" class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas>

      <!-- Sequence 1: Intro (Observe) -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      // --- 1. Custom 3D Particle Network (WebGL-style Canvas) ---
      const canvas = document.getElementById('bg-canvas');
      const ctx = canvas.getContext('2d');
      let width, height;
      const points = [];
      const numPoints = 120; // Optimized for plexus performance
      let fov = 400;
      …
      ```

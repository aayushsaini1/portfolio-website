# Engineering Specification --- Interactive 3D Globe (About Page)

## Overview

Build a lightweight, interactive 3D globe for the **About** page of the
portfolio. The globe is intended to be a subtle visual element that
showcases engineering craftsmanship without overwhelming the page.

The experience should feel clean, modern and technically
impressive---something that naturally makes visitors think **"that's
cool."**

This feature must be completely isolated from the rest of the website so
that the homepage and other pages incur **zero performance cost**.

------------------------------------------------------------------------

# Objectives

-   Create a minimal, GitHub-inspired interactive globe.
-   Display a live International Space Station (ISS).
-   Display nearby asteroids / Near Earth Objects (NEOs) using NASA
    data.
-   Keep visuals minimal and elegant.
-   Prioritize smooth performance over scientific precision.
-   Use only free/public APIs and data sources.
-   Ensure the feature is completely self-contained.

------------------------------------------------------------------------

# Performance Requirements

## Isolation

The globe must exist only within the About page.

Requirements:

-   Three.js dependencies must not be bundled into any other route.
-   Load the globe using Next.js dynamic imports.
-   Disable SSR for all 3D components.
-   Do not start API requests until the globe component mounts.

## Rendering Budget

Target:

-   60 FPS on modern desktops
-   Smooth interaction on modern mobile devices
-   Graceful degradation on lower-end hardware

Reduce rendering quality automatically if performance drops.

------------------------------------------------------------------------

# Technology

Preferred stack:

-   Three.js
-   React Three Fiber
-   Drei
-   Next.js Dynamic Imports

Avoid higher-level globe libraries such as `three-globe` to maintain
full control and minimize bundle size.

------------------------------------------------------------------------

# Globe Design

The globe should resemble GitHub's globe rather than a realistic Earth.

## Earth

Use:

-   Dark sphere
-   Minimal dotted landmass representation
-   No Earth texture
-   No clouds
-   No weather overlays
-   No country borders
-   No labels

Optional:

-   Very subtle atmospheric glow (easy to disable if it doesn't fit the
    design)

------------------------------------------------------------------------

# Camera

Default behavior:

-   Slightly angled perspective
-   Slow automatic rotation
-   Smooth damping

User can:

-   Rotate
-   Zoom (within limits)

After inactivity, the globe resumes auto-rotation.

------------------------------------------------------------------------

# Live Objects

## International Space Station (ISS)

Display:

-   Preferred: low-poly ISS model
-   Fallback: distinct glowing marker

Behavior:

-   Smooth orbit around Earth
-   Short fading trail representing recent movement
-   No labels or tooltips

------------------------------------------------------------------------

## Near Earth Objects (NEOs)

Display approximately **10--15** objects.

Each object should:

-   Orbit independently
-   Have subtle variation in size
-   Leave a short fading trail

The goal is visual interest rather than scientific precision.

------------------------------------------------------------------------

# Data Sources

## ISS

Use a free ISS location API.

Refresh every **5--10 seconds**.

Interpolate movement between API responses instead of snapping
positions.

Only poll while:

-   About page is mounted
-   Browser tab is visible

Pause polling when the tab is inactive.

## NEOs

Use NASA's public API.

-   Fetch once when the page loads.
-   Cache the response in memory.
-   No continuous polling required.

------------------------------------------------------------------------

# Rendering Strategy

Render only:

-   Earth
-   ISS
-   NEOs

Do not include:

-   Stars
-   Space debris
-   Additional satellites
-   Clouds
-   Weather
-   UI overlays

The scene should intentionally feel sparse and minimal.

------------------------------------------------------------------------

# Animation

Earth

-   Constant slow rotation

ISS

-   Smooth orbital movement
-   Fading orbit trail

NEOs

-   Independent orbital movement
-   Slightly different speeds
-   Short fading trails

Avoid abrupt motion.

------------------------------------------------------------------------

# API Strategy

## ISS

-   Poll every 5--10 seconds
-   Interpolate between updates
-   Suspend polling when page is hidden

## NASA

-   Fetch once on load
-   Cache in memory
-   No continuous polling

If APIs fail, continue rendering the globe without live objects.

------------------------------------------------------------------------

# Mobile

Support mobile devices.

If necessary:

-   Reduce render resolution
-   Reduce particle/object density
-   Reduce post-processing

Maintain smooth interaction.

------------------------------------------------------------------------

# Suggested Folder Structure

``` text
components/about/globe/
    Globe.tsx
    Earth.tsx
    ISS.tsx
    NEOs.tsx
    Scene.tsx
    Camera.tsx

hooks/
    useISS.ts
    useNEOs.ts

lib/space/
    iss.ts
    nasa.ts
    interpolation.ts
```

------------------------------------------------------------------------

# Acceptance Criteria

-   Three.js loads only on the About page.
-   Homepage bundle size remains unaffected.
-   Globe auto-rotates and supports user interaction.
-   Earth uses a minimal dotted rendering instead of textures.
-   Live ISS orbits Earth with a fading trail.
-   10--15 NEOs are displayed with subtle motion and fading trails.
-   Smooth on desktop and modern mobile devices.
-   API failures never break rendering.
-   Entire implementation is modular and removable.

------------------------------------------------------------------------

# Stretch Goals (Optional)

-   Adjustable atmospheric glow
-   Adaptive quality scaling
-   Soft bloom on atmosphere and trails
-   Cursor-based camera parallax
-   Frustum culling and instanced rendering for future scalability

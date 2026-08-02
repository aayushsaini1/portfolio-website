# PRD: Holographic Cloth Resume Page

## Summary
A new standalone page on aayushsaini.com featuring an interactive holographic cloth simulation, draped with a resume texture, with a single button to download the actual resume PDF. Built by cloning and stripping down `dmitrykurash/holocloth` (MIT licensed, Three.js + WebGL2).

## Goal
A striking, on-brand hero moment that reinforces the terminal/hazard-tape aesthetic — not a full interactive tool. Visual first, PDF download is the real deliverable.

## Source
- Repo: `github.com/dmitrykurash/holocloth`
- License: MIT — free to clone/modify/use, must retain original copyright notice somewhere in repo (e.g. LICENSE file or credits, doesn't need to be user-facing)
- Stack: Three.js (WebGL2), React, TypeScript, Vite. Custom Verlet cloth physics + GLSL foil shader — no external physics lib.

## Scope changes from source repo

### Remove
- DialKit control panel entirely (mount, imports, `package.json` dependency)
- Any UI for switching material presets, versions, live parameter tuning
- Sticker/multi-image upload feature (not needed)

### Keep
- Core cloth physics (Verlet integration)
- Holo foil shader (iridescent, chrome, or black preset — pick one, hardcoded)
- Camera setup: macro DOF, film grain, bloom
- Grab/drag interaction on the cloth (nice-to-have, low effort since handlers already exist)
- PNG export logic can be deleted (not needed) unless trivial to leave in

### Add
- Hardcoded shader/material params (whatever preset looks best — no runtime tuning)
- Fixed camera angle + auto-drape state on load (no user camera reset needed unless orbit is kept for feel)
- Resume PNG as the draped texture (replaces default poster mechanism)
- Single floating CTA button at bottom of the screen: "Download Resume (PDF)" — anchor tag with `download` attribute pointing to the actual resume PDF, styled in the terminal aesthetic (e.g. `> download_resume.pdf`)

## Content
- Texture: high-res PNG (2000px+ long edge) of resume — either literal resume layout or simplified cover (name/title/keywords/QR) — final call pending
- Background: black canvas, per existing demo aesthetic
- Typography embedded in the PNG should hold up against fold distortion and color shift — avoid thin fonts, ensure decent contrast pre-shader

## Integration
- New route/page on existing site (`/resume`), not a modification of the homepage
- Should not block or slow initial site load — lazy-load this page's JS bundle since Three.js is heavy

## Out of scope
- Live parameter controls of any kind
- Multi-image/sticker support
- Save/version switching
- Mobile-specific interaction redesign (basic responsiveness only — evaluate after first pass whether WebGL perf on mobile is acceptable)

## Open questions
1. Literal resume layout vs. simplified cover as the draped texture?
2. Keep grab/drag interactivity, or fully static/ambient auto-drape?
3. Foil preset: iridescent rainbow, chrome, or black?

## Instruction for Antigravity (build agent)
1. Clone `dmitrykurash/holocloth`, strip DialKit panel + dependency, remove sticker/versioning features.
2. Hardcode chosen material preset and camera/drape state.
3. Replace texture loading logic to point at `/resume-texture.png`.
4. Add download button component (styled per site's existing terminal design tokens) linking to `/resume.pdf`.
5. Wire up as a new route in the existing site's project, lazy-loaded.
6. Retain MIT license notice/credit in repo (LICENSE file or footer credit).
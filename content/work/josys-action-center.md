

<table style="width: 100%; border-collapse: collapse; margin-top: 2rem; margin-bottom: 4rem; font-size: var(--font-size-md); line-height: 1.6;">
  <tbody>
    <tr style="border-bottom: 0.1rem solid var(--border-color);">
      <td style="padding: 1rem 0; font-weight: bold; width: 120px; color: var(--accent-color); vertical-align: top;">Role:</td>
      <td style="padding: 1rem 0; vertical-align: top;">Senior UX Designer</td>
    </tr>
    <tr style="border-bottom: 0.1rem solid var(--border-color);">
      <td style="padding: 1rem 0; font-weight: bold; color: var(--accent-color); vertical-align: top;">Team:</td>
      <td style="padding: 1rem 0; vertical-align: top;">1 Product Manager, Head of Design, CPO, 1 Engineering Manager, 2 Frontend Devs, 3 Backend Devs</td>
    </tr>
    <tr style="border-bottom: 0.1rem solid var(--border-color);">
      <td style="padding: 1rem 0; font-weight: bold; color: var(--accent-color); vertical-align: top;">Timeline:</td>
      <td style="padding: 1rem 0; vertical-align: top;">Nov 2025 – Jan 2026</td>
    </tr>
    <tr>
      <td style="padding: 1rem 0; font-weight: bold; color: var(--accent-color); vertical-align: top;">Platform:</td>
      <td style="padding: 1rem 0; vertical-align: top;">Josys — B2B SaaS Management & IGA Platform</td>
    </tr >
  </tbody >
</table >



<div style="background-color: var(--container-bg-color);
color: var(--text-color);
padding-top: 1px;
padding-left: 3.2rem;
padding-right: 3.2rem;
padding-bottom: 1.2rem;
border-radius: 1.6rem;
margin: 2rem 0;">

## TL;DR

- <span style="color: #e5a900;">**Problem:**</span> IT admins had no single place to see and act on what needed attention — actions were scattered across modules, and even when visible, it wasn't clear what mattered most.
- <span style="color: #e5a900;">**My role:**</span> Owned end-to-end UX for the Action Center module, collaborating closely with the Head of Design.
- <span style="color: #e5a900;">**Solution:**</span> A unified Action Center bringing together five action types — Quick Actions, Opportunities, Approvals, Anomalies, and My Tasks — into one dynamically prioritized view.
- <span style="color: #e5a900;">**Impact:**</span> Positive qualitative feedback from stakeholders and GTM/Sales; positioned as a competitive differentiator in the IGA space. [Add rollout stage / any early numbers once available]

</div>

`[IMAGE PLACEHOLDER: Hero shot of Action Center dashboard with all 5 containers visible]`
*Caption: Action Center — Approvals, Anomalies, My Tasks, Quick Actions, and Opportunities in one view*

---

## 1. Context

Josys is a B2B SaaS management and IGA platform used by IT admins, MSP operators, and service providers. As Josys evolved its narrative from an IT SaaS management tool to a full IGA platform, admins were increasingly expected to act on a growing volume of signals — policy-triggered approvals, anomalies, manual tasks, and health-improvement opportunities.

Before Action Center, these lived in their separate modules. An admin managing day-to-day IT health had to move between screens to find out what actually needed their attention, with no consolidated sense of priority.


![Screenshot of the "before" state — actions scattered across separate modules](/work/josys-action-center/before.png)


---

## 2. The Problem

Two compounding issues:

- <span style="color: #ff1f1fff;">**Scattered actions:**</span> Approvals, anomalies, manual tasks, and improvement suggestions each lived in their own module, with no common home.
- <span style="color: #ff1f1fff;">**Poor visibility:**</span> Even when an admin knew where to look, there was no way to quickly answer "what needs my attention right now, and in what order?"

**What triggered this project:** <br>
Direct feedback from IT admins, who wanted a centralized hub giving them access to all actions in one place. Notably, competitor IGA tools didn't offer anything like this — making Action Center a first-to-market move rather than a catch-up play, and a meaningful differentiator as part of Josys's broader shift toward being taken seriously as an IGA platform.

**Constraints going in:**<br>
- **Five very different action types**, each with different data shapes, urgency models, and interaction depth (some resolvable in one click, others requiring multi-step review).
- **Technical complexity** of surfacing actions that originate from entirely different subsystems into one place.
- **Heavy technical complexity** meant the project had to be broken into multiple smaller parts and built incrementally, rather than shipped as one single release.

---

## 3. Process & Exploration

### Understanding the mental model
Rather than starting from "what data do we have," the framing question was: <br>
*what does an IT admin need to act on today, and how would they naturally prioritize it?* <br>
This shaped the eventual ordering logic more than any single module's internal priority scheme.

### Framing the solution space
- **Option considered — tabs per category:** Would have kept each action type visually distinct but re-introduced the "switching between views" problem Action Center was meant to solve.
- **Option considered — single unified feed:** Would maximize consolidation, but risked flattening five structurally different action types into a lowest-common-denominator card, losing the context each type needs.
- **Chosen — separate large containers per type, on one page:** Keeps each action type's distinct context and interaction model intact, while still giving admins a single page to scan instead of five separate modules.

`[IMAGE PLACEHOLDER: Early exploration — tabs vs. unified feed vs. containers, sketches or low-fi wireframes]`

### Key decisions

**Decision 1: Container layout over tabs or a unified feed**
- Options considered: tabs / unified feed / separate containers
- Chosen: separate containers, because each action type (Approvals vs. Anomalies vs. My Tasks, etc.) has different urgency and interaction models — collapsing them into a single feed pattern would have hidden meaningful differences an admin needs to reason about. This approach is also more scalable: a container with no data can collapse by default, and collapsed containers act as a summary view for the admin on landing — so the page stays lightweight and relevant even as more action types get added over time.

**Decision 2: Unifying wildly different action types into one consistent interaction pattern**
- This was the hardest problem on the project. Quick Actions are resolvable in a single click; Approvals require a human-in-the-loop review step tied to policy execution; Anomalies need enough context to judge severity before acting; My Tasks are open-ended manual items.
- Landed on a shared side panel (half panel) pattern for quick view: opening any action item, regardless of type, opens the same half-panel layout, with the additional context/data specific to that action type slotted into a consistent structure. This gave each of the five types room to show what's unique to it (approval context, anomaly severity, task details, etc.) without needing five completely different interaction models.
- This required close, sustained collaboration with both PM and Engineering — PM on scoping which action types and metadata to surface, and Eng on the technical feasibility of pulling actions from disparate subsystems into a single surface without each container becoming its own bespoke build.

**Decision 3: Dynamic ordering of containers**
- Options considered: fixed order / admin-configurable order / dynamic priority-based order
- Chosen: dynamic ordering — **Approvals** surface first (since policy automations are blocked on them and time-sensitive), followed by **Anomalies**, then **My Tasks**, then **Quick Actions**, then **Opportunities**.
- Rationale: this mirrors actual urgency — approvals gate automation execution, anomalies are security-relevant, manual tasks are admin-owned commitments, while quick actions and opportunities are lower-urgency, higher-volume items.

`[IMAGE PLACEHOLDER: Final container order on the dashboard, annotated with the priority rationale]`

---

## 4. The Solution

- Admin lands on Action Center and sees all five containers, ordered by urgency: Approvals → Anomalies → My Tasks → Quick Actions → Opportunities.
- [Walk through one end-to-end flow, e.g. resolving a Quick Action in one click, or reviewing an Approval]
- [Walk through the My Tasks flow — since tasks can be created from anywhere in the platform, explain how that surfaces here]

`[IMAGE PLACEHOLDER: Approvals container, close-up]`
`[IMAGE PLACEHOLDER: Quick Actions container, close-up]`
`[IMAGE PLACEHOLDER: My Tasks container, close-up — show task creation entry point from elsewhere in platform]`

---

## 5. Collaboration & Constraints

- Closest collaboration was with **PM and Engineering**, given the technical difficulty of consolidating actions that originate from entirely different subsystems (policy engine, anomaly detection, manual task creation, etc.) into one coherent surface.
- Engineering pushback centered on timelines — building all five action types at once wasn't feasible. This led to a phased build order: Quick Actions, Opportunities, and My Tasks shipped first as Phase 1. Approvals and Anomalies followed in a later phase, once Policies & Automations was introduced — since both depend on the policy engine that hadn't existed yet at Phase 1. This is why the build sequence differs from the display priority order in Decision 3: build order followed what was technically ready, while display order reflects actual urgency to the admin once everything was live.
- Anomalies and Approvals originated from a separate team — the Policies & Automations team — rather than the core Action Center team, so this project required close collaboration across two project teams, not just within one. Since I was also the designer on Policies & Automations, I sat at the center of the entire effort, connecting the two projects' teams and ensuring the two containers integrated consistently with the rest of Action Center rather than feeling bolted on.
- Technical constraint: pulling live, accurate data from multiple modules into a single view without introducing staleness or performance issues. [Expand if relevant]

---

## 6. Outcome & Impact

- **Status:** Phased rollout in progress.
- **Qualitative signal:** Positive feedback from internal stakeholders and GTM/Sales — Action Center is being positioned as a competitive differentiator against other IGA tools that lack a consolidated action view.
- **Quantitative:** [Too early — revisit once Pendo instrumentation has enough data post-rollout; consider tracking time-to-resolution per action type, or % of admins engaging with Action Center vs. individual modules]

`[IMAGE PLACEHOLDER: Any stakeholder quote, sales deck slide, or early usage chart once available]`

---

## 7. Reflection

- [What would you do differently — e.g. involve formal user research earlier given the ambition of unifying 5 action types?]
- [What did unifying such different action types teach you about card/pattern design at a systems level?]
- [What's parked for later — e.g. admin-configurable ordering, cross-container filtering, notifications?]

---

<!--
FILL-IN CHECKLIST before this is portfolio-ready:
1. Tagline (Snapshot header)
2. Your specific ownership scope (Snapshot + Role)
3. Timeline and team names
4. The actual card pattern solution (Decision 2) — this is your strongest "senior thinking" moment, don't leave it thin
5. PM/Eng collaboration specifics (Section 5) — a concrete friction + resolution story lands well here
6. All image placeholders
7. Reflection section — this is what separates senior from mid-level case studies
-->
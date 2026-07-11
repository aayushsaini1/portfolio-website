<table style="width: 100%; border-collapse: collapse; margin-top: 2rem; margin-bottom: 4rem; font-size: var(--font-size-md); line-height: 1.6;">
  <tbody>
    <tr style="border-bottom: 0.1rem solid var(--border-color);">
      <td style="padding: 1rem 0; font-weight: bold; width: 120px; color: var(--accent-color); vertical-align: top;">Role:</td>
      <td style="padding: 1rem 0; vertical-align: top;">Lead UX Designer</td>
    </tr>
    <tr style="border-bottom: 0.1rem solid var(--border-color);">
      <td style="padding: 1rem 0; font-weight: bold; color: var(--accent-color); vertical-align: top;">Team:</td>
      <td style="padding: 1rem 0; vertical-align: top;"> Head of Design, Product Manager, Director of Product, Engineering Manager, 3 Front End devs, 2 Backend Devs</td>
    </tr>
    <tr style="border-bottom: 0.1rem solid var(--border-color);">
      <td style="padding: 1rem 0; font-weight: bold; color: var(--accent-color); vertical-align: top;">Timeline:</td>
      <td style="padding: 1rem 0; vertical-align: top;">Ideation: March 2026 · Shipped: June 2026</td>
    </tr>
    <tr>
      <td style="padding: 1rem 0; font-weight: bold; color: var(--accent-color); vertical-align: top;">Platform:</td>
      <td style="padding: 1rem 0; vertical-align: top;">Josys — B2B SaaS Management & IGA Platform</td>
    </tr>
  </tbody>
</table>



<div style="background-color: var(--container-bg-color);
color: var(--text-color);
padding-top: 1px;
padding-left: 3.2rem;
padding-right: 3.2rem;
padding-bottom: 1.2rem;
border-radius: 1.6rem;
margin: 2rem 0;">

## TL;DR

- <span style="color: #e5a900;">**Problem:**</span> Access Policy existed but wasn't comprehensive enough to be sellable, and Workflows lived as a disconnected automation module — admins could stitch the two together, but neither was built to work as one system.
- <span style="color: #e5a900;">**My role:**</span> Owned end-to-end UX for the Policy & Automations revamp, designing a single module where automation is a native extension of policy rather than a bolt-on.
- <span style="color: #e5a900;">**Solution:**</span> A unified Policy & Automations module — policies define the conditions (trigger, app/file/device/identity conditions, access validation, admin consent), and automations are simply the actions that execute on top of that same policy structure.
- <span style="color: #e5a900;">**Impact:**</span> The single biggest lever in Josys's positioning shift from an IT SaaS management tool to a full IGA platform. Rollout in progress. [Add rollout stage / early numbers once available]

</div>

![Policy & Automations builder showing the full step flow](/work/josys-policy/cover.png)
*Caption: Policy & Automations — from trigger to action, in one continuous build flow*

---

## 1. Context

Josys had two separate, disconnected pieces solving adjacent problems:

- **Access Policy** — let admins define access conditions, but the module was thin. It didn't cover enough ground to be a credible sell against competitors, who already had much more comprehensive policy engines.
- **Workflows** — a standalone automation module. Admins could technically connect a workflow to a policy once the policy existed, but the two were built and understood as separate systems, connected only after the fact.

This split meant admins were reasoning about "what conditions matter" and "what should happen as a result" in two different places, even though the second question can't really be answered without the first.

`[IMAGE PLACEHOLDER: Screenshot of "before" state — separate Access Policy and Workflows modules]`

---

## 2. The Problem

Two compounding issues:

- <span style="color: #ff1f1fff;">**Access Policy wasn't comprehensive enough:**</span> too narrow to be sellable, and falling behind competitors who already treated policy as a core, deep capability.
- <span style="color: #ff1f1fff;">**Automation lived apart from policy:**</span> Workflows required a policy to already exist before it could attach to it, treating automation as an add-on rather than a natural extension of the same rule set.

**What triggered this project:**<br>
The realization that automation is fundamentally downstream of policy — any automation needs a set of conditions to trigger and act on, and that set of conditions *is* a policy. Trying to sell Workflows and Access Policy as separate stories was working against that logic. Combined with competitors already offering comprehensive policy engines, this made a revamp — not an incremental fix — the right call.

**Constraints going in:**<br>
- **Tight timeline:** ideation started in March 2026, with a hard requirement to be live by June.
- **Variable step structure:** policies have a set of steps — trigger, app/file/device/identity conditions, access validation, admin consent, actions — but which steps apply, and how many condition types co-exist, varies by policy type. The builder had to flex to that without becoming a maze of edge cases.
- **Two human-in-the-loop moments to design for:** access validation (a question routed to the user, their manager, or an app admin, with actions branching on the response) and admin consent (the IT admin as final approver before actions execute).

---

## 3. Process & Exploration

### Understanding the mental model
The framing question here wasn't "how do we bolt automation onto policy" — it was: <br>
*if every automation ultimately needs a set of conditions to run against, why are we treating policy and automation as two products at all?* <br>
Once framed that way, automation stopped being a separate module with its own conditions logic, and became the "actions" step at the end of a policy.

### Framing the solution space
- **Option considered — keep Workflows and Access Policy separate, just deepen each:** Would have fixed the "not comprehensive enough" problem in isolation, but left the underlying redundancy in place — both modules would still need their own way of defining conditions.
- **Option considered — merge them but keep automation as an optional attached module:** Preserves some of the existing mental model, but keeps the same seams that caused the original disconnect.
- **Chosen — automation as a step within policy, not a separate object:** A policy is the conditions; an automation is what you get when you add an actions step to those conditions. One module, one mental model.

`[IMAGE PLACEHOLDER: Early exploration — merged vs. attached vs. fully unified structure, sketches or low-fi wireframes]`

### Key decisions

**Decision 1: Automation as the final step of a policy, not a parallel object**
- Options considered: separate Workflows module referencing policies / automation as an optional attachment / actions as a native step in the policy builder
- Chosen: actions as a native step, because [Add rationale — e.g. this collapses two mental models into one, and matches how admins actually think about "if X, then do Y" as a single rule rather than two linked but separately-owned things]

**Decision 2: Designing a step structure that flexes by policy type**
- Steps are: **Trigger → App/File/Device/Identity conditions → Access validation → Admin consent → Actions** — but not every policy type uses every step, and condition types can co-exist depending on the policy.
- Solved this two ways: admins can either start from a **pre-defined template** (steps already set for a known use case), or build **from scratch** by first choosing a **policy category** — and that category selection is what determines the step set for the rest of the builder. Either path, the admin isn't guessing which steps apply; the system commits to a step set upfront rather than revealing it step-by-step.
- Two examples that show how differently the step set can land depending on category:
  - *"Files shared externally should have an expiration date"* (File governance): Trigger → File conditions → Access validation → Admin consent → Actions
  - *"Unauthorized App Usage Detected"* (Discovered app detection): Trigger → Identity conditions → App conditions → Actions — no access validation, no admin consent
- [Add rationale — why does file governance need both human-in-the-loop steps while discovered app detection skips both? Likely ties to reversibility/risk of the action, worth naming explicitly here.]

**Decision 3: Designing the two human-in-the-loop moments (access validation vs. admin consent)**
- **Access validation** routes to the concerned **identity** or the **app owner** — the person closest to the resource in question.
- **Admin consent** is strictly for the **IT admin** — a separate, later checkpoint as final approver before actions execute.
- These stay as two distinct steps rather than one combined "approval" because they're answering two different questions for two different actors: access validation asks *"is this still legitimate, from the person who'd know?"*, while admin consent asks *"should we actually act on this, from the person accountable for the outcome?"* Collapsing them would force either the identity/app owner or the IT admin into a role that isn't theirs.

---

## 4. The Solution

- Admin builds a policy by moving through Trigger → Conditions → Access validation → Admin consent → Actions, with steps adapting to the policy type selected.
- [Walk through one end-to-end flow — e.g. building a policy for an inactive-app scenario, all the way through to the automated action]
- [Walk through the access validation flow — question routed to user/manager/app admin, and how the response determines next steps]
- [Walk through the admin consent flow — how a pending approval actually reads to the IT admin]

`[IMAGE PLACEHOLDER: Policy builder — conditions step, close-up]`
`[IMAGE PLACEHOLDER: Access validation step, close-up]`
`[IMAGE PLACEHOLDER: Admin consent step, close-up]`

---

## 5. Collaboration & Constraints

- Admin consent approvals surface as pending items on the **Action Center** page. Because I was also the designer on Action Center, this integration was significantly easier to reason about from a design standpoint — I already understood the container pattern and priority logic these approvals needed to slot into, rather than having to reverse-engineer it as an outside contributor.
- If a policy runs and an entity (app, identity, or file) is found not following the policy, an **anomaly** is detected and also surfaces on Action Center. This required cross-collaboration with multiple engineering and product teams beyond the core Policy & Automations team, since anomaly detection and Action Center are owned by different groups.
- [Add a concrete friction + resolution story here — the anomaly/Action Center cross-team collaboration specifics, to detail later]
- Timeline constraint: ideation in March, live by June forced a scope cut — **anomaly detection and remediation** was pushed out of the June launch and delayed to end of July, shipping as a follow-on phase rather than part of the initial release.

---

## 6. Outcome & Impact

- **Status:** Rollout in progress.
- **Strategic significance:** This was the single biggest feature behind Josys's positioning shift from an IT SaaS management tool to a full IGA platform — policy comprehensiveness was a direct competitive gap being closed.
- **Qualitative signal:** GTM/Sales reaction has been very positive. [Add specifics once available — e.g. a quote, or what specifically resonated: comprehensiveness vs. competitors, unified builder, etc.]
- **Quantitative:** [Too early — revisit once Pendo instrumentation has enough data. Remember the cohort hygiene point: separate net-new Policy & Automations users from migrated Workflows users to avoid inflating activation baselines]

`[IMAGE PLACEHOLDER: Stakeholder quote, sales deck slide, or early usage chart once available]`

---

## 7. Reflection

- [What would you do differently — e.g. given the compressed March–June timeline, would more upfront user research on the variable step structure have de-risked the builder?]
- [What did merging two products into one teach you about designing a system that needs to flex by type without feeling inconsistent?]
- [What's parked for later — e.g. the App Detail page Workflows tab migration to Policies, or Audit Logs extension to include policy run details — both of which you've noted as parked items]

---

<!--
FILL-IN CHECKLIST before this is portfolio-ready:
1. Tagline (Snapshot header)
2. Team composition (Snapshot table)
3. Decision 1 rationale — why actions-as-a-step over the alternatives, in your own words
4. Decision 2 — the actual mechanism for how steps flex by policy type (this is your strongest "senior thinking" moment, don't leave it thin)
5. Decision 3 rationale — why access validation and admin consent are distinct steps
6. Section 4 — at least one full end-to-end flow walkthrough
7. Section 5 — a concrete friction + resolution story with the anomaly/Action Center cross-team collaboration
8. Outcome — qualitative signal once available
9. Reflection section — this is what separates senior from mid-level case studies
10. All image placeholders
-->
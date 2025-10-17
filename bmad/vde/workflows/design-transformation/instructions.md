# Design Transformation Loop - Workflow Instructions

<critical>This workflow is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have loaded: {project_root}/bmad/vde/workflows/design-transformation/workflow.yaml</critical>
<critical>All agents are located in: {project_root}/bmad/vde/agents/</critical>

## Overview

This workflow implements an enterprise-grade design system transformation process using a 5-agent team coordinated by the Design System Director. The workflow uses visual feedback loops with Playwright MCP to iteratively refine designs until they meet world-class quality standards.

## Workflow Phases

<workflow>

<step n="1" goal="Initialize & Load Director Agent">
<action>Load the Design System Director agent from: {project-root}/bmad/vde/agents/director.md</action>
<action>Director becomes the primary interface for the user</action>
<action>All subsequent coordination happens through Director</action>

**User now interacts with Director agent who orchestrates the specialist team.**

<note>From this point forward, the Director agent executes their command-based interface (*analyze, *implement, *status, *checkpoint, *help)</note>
</step>

<step n="2" goal="Director Orchestrates: Intake & Analysis">
<action>User provides request to Director (e.g., "Make this look like Linear")</action>

**Director coordinates specialists:**

<substep n="2a">
<action>Director → Foundation Specialist: "Extract design tokens from [reference URL/screenshots]"</action>
<action>Foundation Specialist performs 6-phase extraction process</action>
<action>Returns: Design tokens JSON (colors, typography, spacing, effects)</action>
</substep>

<substep n="2b">
<action>Director → Capture Specialist: "Screenshot current state at [target URL]"</action>
<action>Capture Specialist: Baseline screenshots across breakpoints</action>
<action>Returns: Screenshot collection + metadata</action>
</substep>

<substep n="2c">
<action>Director → Visual Analyst: "Audit current design quality"</action>
<action>Visual Analyst: 3-layer evaluation of baseline</action>
<action>Returns: Quality report (Layer 1: objective, Layer 2: structural, Layer 3: semantic)</action>
</substep>

<substep n="2d">
<action>Director: Synthesize findings into gap analysis</action>
<action>Director → User: Present mission brief and success criteria</action>
<action>Wait for user approval before proceeding</action>
</substep>

<template-output>mission_brief</template-output>
</step>

<step n="3" goal="Director Orchestrates: Planning">
<action>Director: Prioritize components to update (e.g., Button → Card → Form → Navigation)</action>
<action>Director: Set quality thresholds (similarity > 90%, Layer 1 pass required)</action>
<action>Director: Allocate iteration budget (max 50 iterations, 2 hours per component)</action>
<action>Director: Initialize progress tracking (create project state JSON)</action>

<template-output>implementation_plan</template-output>
</step>

<step n="4" goal="Director Orchestrates: Implementation Loop (Iterative)" repeat="until_component_complete">
<critical>This is the core feedback loop - runs until component meets quality standards or budget exhausted</critical>

**For each component in priority order:**

<substep n="4a" title="Brief Implementation Specialist">
<action>Director → Implementation Specialist: Specific change task</action>
<example>
"Update Button component padding from 12px to 16px using design token spacing.lg. Target file: components/Button/Button.tsx"
</example>
<action>Implementation Specialist: Makes code changes following their process</action>
<action>Implementation Specialist → Director: "Changes complete, ready for validation"</action>
</substep>

<substep n="4b" title="Capture Current State">
<action>Director → Capture Specialist: "Screenshot [component] across all breakpoints and states"</action>
<action>Capture Specialist: Comprehensive screenshot capture</action>
<list>
  - Desktop (1920px, 1440px, 1280px)
  - Tablet (768px)
  - Mobile (375px, 414px)
  - States: default, hover, focus, active, disabled
</list>
<action>Capture Specialist → Director: Screenshot collection + metadata</action>
</substep>

<substep n="4c" title="Evaluate Quality">
<action>Director → Visual Analyst: "Evaluate [component] iteration [N]"</action>
<action>Visual Analyst: 3-layer evaluation process</action>
<list>
  - Layer 1 (Objective): WCAG, tokens, alignment, spacing
  - Layer 2 (Structural): Pixel diff, similarity score vs reference
  - Layer 3 (Semantic): Aesthetic judgment, vibe check
</list>
<action>Visual Analyst → Director: Comprehensive evaluation report</action>
</substep>

<substep n="4d" title="Director Makes Decision">
<action>Director: Analyze evaluation report using decision matrix</action>

<check if="Layer 1 violations (critical failures)">
  <action>Director → Implementation Specialist: "URGENT: Fix [specific issue] immediately"</action>
  <action>Return to substep 4a (immediate fix iteration)</action>
  <check if="3 fix attempts failed">
    <action>Director → User: "Cannot auto-fix, needs human review"</action>
    <action>Wait for user guidance</action>
  </check>
</check>

<check if="else: Layer 1 passing AND similarity improving">
  <action>Director: Track progress (similarity: 78% → 83% → 88%)</action>
  <check if="similarity > 90% AND Layer 3 confident">
    <action>Director: Mark component COMPLETE</action>
    <action>Move to next component (exit loop for this component)</action>
  </check>
  <check if="else: checkpoint_frequency reached OR 30 minutes elapsed">
    <action>Director → User: Progress checkpoint</action>
    <action>Present: Current state, similarity score, screenshots</action>
    <ask>Continue iteration? Adjust approach? Approve current state?</ask>
    <action>Incorporate user feedback</action>
  </check>
  <check if="else">
    <action>Director: Continue iteration - return to substep 4a with next refinement task</action>
  </check>
</check>

<check if="else: similarity plateauing (last 3 iterations <2% change)">
  <action>Director → User: "Diminishing returns - at [X]% similarity"</action>
  <action>Present: Side-by-side comparison, options</action>
  <ask>Good enough? Continue refining? Pivot approach?</ask>
  <action>Wait for user decision</action>
</check>

<check if="else: similarity declining OR stuck for 5+ iterations">
  <action>Director: Strategy pivot</action>
  <options>
    - Rollback last 2 iterations
    - Change implementation approach
    - Break into smaller subtasks
  </options>
  <check if="2 pivots unsuccessful">
    <action>Director → User: "Need guidance - multiple approaches not improving"</action>
    <action>Wait for user direction</action>
  </check>
</check>

<check if="else: max iterations OR time limit reached">
  <action>Director: Force stop</action>
  <action>Director → User: "Budget exhausted. Best achieved: [X]% similarity at iteration [N]"</action>
  <action>Present: Best iteration, what worked, what didn't, options to extend budget</action>
  <action>Wait for user decision</action>
</check>

</substep>

<substep n="4e" title="Regression Testing (after component completion)">
<action>Director → Capture Specialist: "Re-screenshot all PREVIOUS components"</action>
<action>Director → Visual Analyst: "Verify no regressions in completed components"</action>
<check if="regressions detected">
  <action>Director → Implementation Specialist: "Fix regression in [component]"</action>
  <action>Re-validate affected component</action>
</check>
</substep>

<note>Loop continues for each component in priority order until all complete or user stops</note>

</step>

<step n="5" goal="Director Orchestrates: Final Validation & Delivery">
<action>Director: All components completed, run final validation</action>

<substep n="5a">
<action>Director → Capture Specialist: "Full site screenshot across all pages/breakpoints"</action>
<action>Capture Specialist: Comprehensive final captures</action>
</substep>

<substep n="5b">
<action>Director → Visual Analyst: "Generate complete quality report"</action>
<action>Visual Analyst: Final evaluation across all components</action>
<list>
  - Overall similarity score
  - Layer 1 compliance summary
  - Accessibility report
  - Design token consistency
  - Remaining gaps (if any)
</list>
</substep>

<substep n="5c">
<action>Director → User: Present final results</action>
<present>
  - Before/after comparisons
  - Quality metrics achieved
  - Components updated
  - Iterations used
  - Time elapsed
  - Recommendations for future refinement
</present>
<ask>Approve delivery? Request additional refinements?</ask>
</substep>

<template-output>final_report</template-output>
</step>

<step n="6" goal="Completion">
<action>Director: Save final project state</action>
<action>Director: Document all changes made</action>
<action>Director: Archive screenshots and reports</action>
<action>Confirm with user: Project complete</action>
</step>

</workflow>

## Agent Coordination Notes

**Director is the orchestrator** - all specialist coordination happens through Director

**Specialists never communicate directly with user** - they report to Director only

**Data flows:**
```
User → Director → Specialists → Director → User
```

**State management:**
Director maintains persistent project state in: `{data_folder}/project-state.json`

**Iteration tracking:**
Each iteration creates:
- Screenshots: `{screenshots_folder}/[component]-iter-[N]-[breakpoint]-[state].png`
- Reports: `{reports_folder}/[component]-iter-[N]-evaluation.json`
- Code commits: Git commits for rollback capability

## Quality Thresholds (from config)

**Minimum Standards:**
- Layer 1: All objective criteria must pass
- Layer 2: Similarity > 85% minimum, target 90%
- Layer 3: Confidence "high" on vibe match
- Accessibility: WCAG AA minimum

**Stop Conditions:**
- All components meet thresholds
- Budget exhausted (iterations/time)
- User approval at checkpoint
- Unresolvable blocking issues

---

*Part of the Visual Design Excellence Suite*
*Location: bmad/vde/workflows/design-transformation/instructions.md*

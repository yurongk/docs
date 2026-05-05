---
title: Plan Mode
sidebar_position: 8
---

<Info>
Let users ask the assistant to plan before it acts.
</Info>

Plan Mode is a ChatKit composer mode for tasks that benefit from an explicit plan before execution. It is useful when users want the assistant to pause, reason about scope, and describe the intended steps before making changes or running a complex workflow.

## When to Use Plan Mode

Plan Mode fits tasks such as:

- reviewing a codebase before implementation
- planning a multi-step workflow
- asking for options before choosing a path
- confirming risky or irreversible operations
- producing an execution checklist before acting

It keeps ordinary chat lightweight while giving users a clear way to request a more deliberate workflow when the task calls for it.

## User Experience

Users can enable Plan Mode from the composer `+` menu. ChatKit shows a compact Plan indicator above the composer while it is active.

Users can also type slash commands:

```text
/plan
/plan Refactor the checkout flow and list the files you would touch first.
```

`/plan` toggles Plan Mode. `/plan <prompt>` submits the prompt with Plan Mode enabled for that request.

## Request Behavior

When Plan Mode is active, ChatKit adds `planMode: true` to the submitted user input and to `state.human`. The backend workflow can use that flag to ask the model for a plan, route to a planning node, or require an approval step before execution.

Programmatic sends can use the same flag:

```ts
await chatkit.sendUserMessage({
  text: 'Plan a migration from REST endpoints to SDK calls.',
  planMode: true,
});
```

Plan Mode does not bypass the normal ChatKit request flow. Messages still go through the active ChatKit session, existing permissions, tools, runtime capabilities, and backend workflow rules.

## Product Guidance

Use Plan Mode as a user-controlled affordance, not as a replacement for backend safety rules. The assistant should still follow the workflow and policy constraints configured for the Xpert.

Good Plan Mode responses are usually:

- scoped to the user's exact request
- explicit about assumptions and unknowns
- ordered by the steps the assistant would take
- clear about what requires user confirmation
- short enough to be reviewed quickly

For high-throughput support bots or simple FAQ assistants, leave Plan Mode available but avoid forcing every message through it. For coding, operations, research, and multi-agent workflows, make Plan Mode easy to discover from the composer menu and `/plan`.

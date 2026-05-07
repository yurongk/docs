---
title: Prompt Workflows
sidebar_position: 10
---

<Info>
Turn repeatable tasks into discoverable slash commands inside the ChatKit composer.
</Info>

Prompt Workflows let ChatKit users invoke structured tasks with short slash commands such as `/review`, `/debug`, `/summarize`, or `/test`. A command can expand into a prompt, submit immediately, select required runtime capabilities, or notify the host application.

This gives teams a way to standardize common assistant workflows without forcing users to memorize long prompts.

## How Users Discover Workflows

When a user types `/` at the start of the composer, ChatKit opens a command palette. The palette can include:

- built-in ChatKit commands such as `/plan` and `/pet`
- static commands configured by the host application
- runtime commands published by Xpert skills
- Skills, Plugins, and Sub-agents groups for capability selection

The palette supports search, mouse selection, and keyboard navigation. If the user types `/` in the middle of a message after whitespace, ChatKit focuses on runtime capability tokens instead of global commands.

## What a Prompt Workflow Can Do

A workflow command can:

- insert a prompt draft into the composer
- write a raw slash invocation for backend expansion
- render a template and submit it as a user message
- attach runtime capabilities needed by the workflow
- notify the host application through a client action

For example, a `/security-review src/app.ts` workflow can submit a normalized review prompt and select the skill that contains the security review instructions.

```ts
const options = {
  composer: {
    slashCommands: [
      {
        name: 'security-review',
        label: 'Security Review',
        description: 'Review code for security issues',
        argsHint: '<path>',
        kind: 'prompt_workflow',
        action: {
          type: 'submit_prompt',
          template:
            'Run a security review for {{args}}. Return findings by severity.',
        },
      },
    ],
  },
};
```

Submitting:

```text
/security-review src/app.ts
```

sends:

```text
Run a security review for src/app.ts. Return findings by severity.
```

## Runtime Workflows from Skills

Xpert skills can publish workflow commands through the runtime capability response. ChatKit shows them in the same slash palette as host commands, so a skill can bring both the backend behavior and the user-facing shortcut that activates it.

Runtime workflow commands are validated by the Xpert backend before they are exposed. They cannot bypass assistant permissions, skill access, plugin access, or runtime capability allow-list rules.

## Metadata and Observability

When a workflow command submits a prompt, ChatKit includes command metadata in the submitted human input. This makes it easier to audit which workflow produced a message, debug template behavior, or analyze workflow adoption.

Metadata is informational. The backend should still enforce normal access control and workflow rules.

## Product Guidance

Good Prompt Workflows are:

- short to type and easy to search
- specific to a recurring job
- opinionated enough to improve prompt quality
- paired with the runtime skills or plugins they require
- documented in user-facing language, not implementation language

Useful starting workflows include `/review`, `/explain`, `/test`, `/debug`, `/summarize`, `/draft`, and `/handoff`.

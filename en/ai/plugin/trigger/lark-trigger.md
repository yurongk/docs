---
title: Lark Trigger
sidebar_position: 21
---

`Lark Trigger` connects Lark message events to the Digital Expert workflow, enabling the trigger chain of “send a message in Lark, execute the Digital Expert in Xpert”.

## Applicable scenarios

- Triggering a Digital Expert by @mentioning a bot in Lark group chats or direct chats
- Using enterprise IM as a unified entry for Digital Experts
- Mapping external message events into workflow inputs

## Key configuration

Core configuration of Lark Trigger includes:

- `enabled`: whether the trigger is enabled
- `integrationId`: Lark integration instance ID (required)

Validation before publish checks:

1. Whether a valid Lark integration is selected.
2. Whether the current integration is already bound to another Digital Expert (to avoid conflicts).

## Runtime mechanism

1. **Publish phase**: Write the `integrationId -> xpertId` binding and register in-memory callbacks.
2. **Message arrival phase**: Locate the bound Digital Expert by `integrationId`.
3. **When callback is available**: Build the handoff message directly and advance the current flow.
4. **When callback is unavailable (for example, after restart)**: Enter the persistent dispatch queue to guarantee no message loss.

## Startup recovery strategy

Lark Trigger uses `bootstrap.mode = skip`:

- It does not replay `publish` at startup.
- It relies on persistent bindings and external message events to resume processing.

This approach is suitable for triggers continuously driven by external events and avoids duplicate registration.

## Related features

- Trigger node overview: [Workflow Trigger](../../workflow/trigger/)
- Multi-channel access for Digital Expert: [Digital Expert](../../digital-expert/digital-expert/)
- Lark plugin and integration background: [Lark Plugin Docs](../lark/)
- Source code: [xpert-plugins / lark integration](https://github.com/xpert-ai/xpert-plugins/tree/main/xpertai/integrations/lark)

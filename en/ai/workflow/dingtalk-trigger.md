---
title: DingTalk Trigger
sidebar_position: 12
---

DingTalk Trigger binds one DingTalk integration to one Xpert, so callback events are routed to the correct expert reliably.

## Why DingTalk Trigger Is Needed

A DingTalk integration only handles connectivity and callback ingestion.

To decide which Xpert should process an incoming message, the trigger creates a binding:

```text
integrationId -> xpertId
```

## Configuration

Current DingTalk Trigger fields:

- `Enabled`
- `DingTalk Integration` (required)

:::tip
Changes take effect only after the expert is published again.
:::

## Activation Flow

1. Create DingTalk integration
2. Add DingTalk Trigger in workflow
3. Select target DingTalk integration
4. Publish expert
5. Platform persists trigger binding
6. New messages from this integration route to the current expert

## Routing Priority

DingTalk routing priority:

1. Existing conversation binding
2. Trigger binding
3. Integration fallback `xpertId`

If all are missing, the message has no target expert.

## Binding Tables

DingTalk plugin uses two persistent bindings:

1. `plugin_dingtalk_trigger_binding`
2. `plugin_dingtalk_conversation_binding`

Meanings:

- `trigger_binding`: default expert ownership for one integration
- `conversation_binding`: conversation continuity for one DingTalk conversation user key

## Constraints

- One `integrationId` can bind to only one `xpertId`
- In group chats, only `@bot` messages trigger processing
- Stopping trigger or taking expert offline clears relevant bindings

## FAQ

### Trigger configured but not effective

Re-publish the expert.

### Private chat works, group chat does not

Check bot membership in the group and confirm the message mentions `@bot`.

### Why did routing not switch to new expert immediately

Existing conversation binding has higher priority; end current conversation before testing new routing.

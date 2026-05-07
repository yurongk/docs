---
title: Trigger Plugin
sidebar_position: 20
---

This section introduces extensions related to **Workflow Trigger** in the Xpert plugin system.

If you want a Digital Expert to be triggered not only from the in-platform chat interface, but also from external messaging systems or scheduled tasks, you can extend it through Trigger plugins.

## Scope of this section

- [Schedule Trigger plugin implementation](./schedule-trigger/)
- [Lark Trigger plugin implementation](./lark-trigger/)

## Design highlights

Trigger plugins typically implement the following capabilities:

1. **Trigger metadata (`meta`)**: Used to display trigger name, icon, and config form in the frontend.
2. **Configuration validation (`validate`)**: Checks required fields and binding conflicts before publishing.
3. **Publish and stop (`publish / stop`)**: Registers and releases trigger runtime resources.
4. **Bootstrap recovery strategy (`bootstrap`)**: Controls whether triggers recover automatically after system restart.

## Related features

- Workflow trigger concepts and node description: [Trigger](../../workflow/trigger/)
- Multi-entry access for Digital Expert: [Digital Expert](../../digital-expert/digital-expert/)
- Plugin system overview: [Plugin Overview](../overview/)

---
title: Configure Xpert AI Assistant
sidebar_position: 5
tags:
  - AI
  - Copilot
  - Xpert
---

In Xpert, configuring an AI assistant essentially means binding a **prepared digital expert** to a specific assistant entry.

After the configuration is saved, when users open the assistant from that entry, they are actually using the digital expert you selected.

If that digital expert was created or imported from a YAML DSL, the assistant's capabilities also come from that DSL definition.

## Three Assistant Types Currently Supported

Based on the current system implementation, Xpert provides three system-level AI assistant types:

- **Common Assistant**: the embedded assistant entry used on the common chat page;
- **ChatBI Assistant**: the assistant entry used on the ChatBI page for data analysis;
- **Workspace Assistant**: the shared assistant entry used in the workspace and the Studio shell.

All three assistant types are configured from **Settings / Assistants**, but they are intended for different usage scenarios.

## Prerequisites

Before you start, make sure the following items are ready:

- You have completed AI provider setup in [Configure AI Provider](./settings/);
- You have created a digital expert that can be used as an assistant;
- That digital expert has already been **published**;
- If you want the Workspace Assistant to help create or edit digital experts, it is recommended to prepare a dedicated **authoring assistant** digital expert;
- Tenant-level default assistant configuration requires tenant admin permissions;
- Organization-level assistant configuration requires switching to the target organization and having the corresponding admin permissions.

> On the **Settings / Assistants** page, only digital experts that are both accessible in the current scope and already **published** are usually available for selection.

## How To Configure Xpert AI Assistant

Open **Settings / Assistants**, then follow the steps below.

### 1. Select the assistant type to configure

In the list, find the assistant item you want to configure.

- **Common Assistant**
- **ChatBI Assistant**
- **Workspace Assistant**

Each assistant type is saved independently.

### 2. Select the configuration scope

Assistant configuration supports two levels:

- **Tenant Default**: sets the default assistant for the whole tenant, which organizations inherit by default;
- **Organization Override**: sets an assistant specifically for the current organization and takes precedence over the tenant default.

If no organization-level configuration is set, the system continues using the tenant default.

### 3. Enable or disable the assistant

Turn the **Enabled** switch on or off for the target assistant item.

- When enabled, that entry uses the digital expert you bind;
- When disabled, the entry will not serve the assistant in enabled mode even if a binding exists.

### 4. Bind a digital expert

In the **Assistant ID / Xpert ID** selector, choose the digital expert you want to bind.

You can search digital experts accessible in the current scope by name or ID. Before saving, make sure the current assistant is enabled.

After you click **Save**, that assistant entry starts using the selected digital expert.

## Which Scenarios Fit Each Assistant Type

### Common Assistant

The Common Assistant is the default assistant entry on the common chat page. It is suitable for scenarios such as:

- Providing a unified general-purpose Q&A entry;
- Supporting knowledge Q&A, process guidance, business assistance, and other general conversation scenarios;
- Acting as the default chat assistant at the tenant or organization level.

If you want users to enter the common chat page and immediately use a default AI assistant, this is usually the right place to configure it.

### ChatBI Assistant

The ChatBI Assistant is the embedded assistant on the ChatBI page. It is suitable for scenarios such as:

- Answering analytics questions on the ChatBI page;
- Supporting multi-turn conversations around metrics, models, dimensions, and business definitions;
- Providing a dedicated assistant entry for data analysis.

If your goal is to let users perform conversational analysis directly on the ChatBI page, this entry should be bound to a digital expert focused on data analysis or business Q&A.

### Workspace Assistant

The Workspace Assistant is the shared assistant used in the workspace and Studio. It is suitable for scenarios such as:

- Creating new digital experts through chat in the workspace;
- Continuing to edit the current digital expert draft in Studio;
- Helping add knowledge bases, toolsets, prompts, or workflow structures.

If your goal is to configure an AI assistant that helps orchestrate digital experts, this entry should usually be bound to a dedicated **authoring assistant** digital expert.

## How To Prepare An Authoring Assistant Digital Expert

If you want the Workspace Assistant to help create or edit digital experts, it is recommended to prepare a dedicated **authoring assistant** digital expert instead of reusing a business expert.

Common approaches include:

- Create a new digital expert based on the platform's **authoring assistant** template;
- Or create a dedicated agent for agent authoring based on a similar YAML DSL template;
- Publish it first, then bind it to the Workspace Assistant in **Settings / Assistants**.

## Tenant Default And Organization Override

### Tenant Default

This is suitable as the default assistant configuration shared across the whole tenant.

For example:

- The whole company uses the same Common Assistant by default;
- All organizations use the same ChatBI Assistant by default;
- All organizations use the same Workspace Assistant by default.

### Organization Override

This is suitable when a specific organization needs a different assistant, for example when different organizations use different Common Assistants, ChatBI Assistants, or Workspace Assistants.

When an organization-level configuration exists, it takes priority. If no organization-level configuration is set, the system falls back to the tenant default.

If you want to resume inheriting from the tenant default, you can remove the current organization override and switch back to the tenant default.

## What You Can Do After Configuration

### Provide a unified entry on the common chat page

If the Common Assistant is already bound to a digital expert, users can go to the common chat page and directly use that assistant for Q&A, guidance, or daily collaboration.

### Perform conversational analysis on the ChatBI page

If the ChatBI Assistant is already bound to a digital expert, users can have multi-turn conversations on the ChatBI page around data models, metrics, and analytical questions.

### Create or modify digital experts in the workspace

If the Workspace Assistant is bound to an **authoring assistant** digital expert, users can directly describe their needs in chat, for example:

- `Help me create an after-sales support expert`
- `Help me create a contract review expert`

The assistant creates a new digital expert draft based on the request and guides you to continue editing it in Studio.

If you already have a digital expert open in Studio, the assistant can also continue helping you edit the current draft, for example:

- Add a knowledge base;
- Adjust prompts;
- Add toolsets;
- Modify workflow structures.

These changes usually apply to the **current draft**, rather than directly replacing the published version, so you should still review and publish the result afterward.

## Notes

- If the current digital expert is still only a draft and has not been published, it usually cannot be selected on the assistant settings page.
- Tenant-level configuration usually requires tenant admin permissions; organization-level configuration requires that you first switch into the target organization.
- The three assistant types are configured independently. Binding a digital expert to one assistant does not automatically apply it to the others.
- If no organization-level configuration exists, the system continues inheriting from the tenant default.
- If you want the Workspace Assistant to focus on creating and editing digital experts, it is better to prepare a dedicated authoring assistant instead of reusing a business expert.
- If the entry still shows as not configured, check whether it has been enabled, whether a digital expert has been selected, and whether the current organization is hitting the expected configuration layer.

## FAQ

### Why does my digital expert not appear in the selectable assistant list?

Common reasons include:

- It has not been published yet;
- You are not in the correct tenant or organization scope;
- The digital expert is not accessible in the current scope.

### Why did I save an organization configuration, but the system still uses the tenant default?

Check the following items:

- Whether you have actually switched to the target organization;
- Whether the organization configuration was saved successfully;
- Whether the current assistant item is enabled;
- Whether you accidentally configured a different assistant type.

### Why did I already bind an assistant, but the workspace still shows "Assistant not configured"?

The workspace uses the **Workspace Assistant** specifically, not the Common Assistant or the ChatBI Assistant. Because of that, even if you already bound another assistant type, the workspace can still show **Assistant not configured**.

Common reasons include:

- You bound the **Common Assistant** or **ChatBI Assistant**, but did not configure the **Workspace Assistant**;
- You already bound a digital expert, but the **Workspace Assistant** is not enabled;
- You saved the configuration under a different organization than the one you are currently in;
- The current organization does not hit an organization override, and the tenant default also does not configure the Workspace Assistant;
- The current Workspace Assistant configuration was not actually saved successfully, or it was switched back to inheriting the tenant default afterward;
- The digital expert bound to the Workspace Assistant is not effective in the current scope, so the current organization does not receive a valid configuration.

When this happens, check the following first:

- In **Settings / Assistants**, confirm that you configured the **Workspace Assistant**;
- Confirm that the current organization is the same one where you saved the configuration;
- Confirm that the Workspace Assistant is **enabled** and already bound to a digital expert;
- If the current organization does not have its own override, continue by checking whether the tenant default has already configured the Workspace Assistant.

If the configuration looks correct but the assistant still cannot open normally, also check whether the **ChatKit** service configuration is healthy, for example:

- Whether the ChatKit service URL is configured correctly;
- Whether the ChatKit service is currently reachable and running normally.

### Why don't changes made by the Workspace Assistant take effect immediately?

Because most of these changes are first applied to the **draft**. To make the updated version available to end users, you still need to review and publish it manually.

## Related Docs

- [🤖 AI Copilot](./index/)
- [Configure AI Provider](./settings/)
- [Digital Expert](../agent/)
- [Expert Configuration](../expert-configuration/)

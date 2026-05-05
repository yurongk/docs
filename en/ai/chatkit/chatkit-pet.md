---
title: Pet
sidebar_position: 7
---

<Info>
Show a draggable animated ChatKit Pet in the host page viewport.
</Info>

ChatKit Pet is a lightweight animated companion rendered over the host page viewport, not inside the ChatKit iframe. It can surface conversation status, show a compact active-thread summary, and act as a minimal launcher for ChatKit.

## Enable Pet

By default, ChatKit shows the chat iframe and does not show Pet. You can enable it either from configuration or from the ChatKit UI with `/pet` or the global settings panel.

```tsx
const chatkit = useChatKit({
  api: {
    apiUrl: XPERT_API_URL,
    xpertId: XPERT_ID,
    getClientSecret,
  },
  pet: true,
});
```

`pet: true` uses the default included Pet with bottom-right placement, dragging, and persisted position.

## Pet Launcher Mode

Use `displayMode: 'pet'` when the page should initially show only Pet. The ChatKit iframe opens when the user clicks Pet.

```tsx
const chatkit = useChatKit({
  displayMode: 'pet',
  api: {
    apiUrl: XPERT_API_URL,
    xpertId: XPERT_ID,
    getClientSecret,
  },
  pet: true,
});
```

In Pet Launcher mode, Pet is the required entry point, so users cannot turn Pet off from settings.

## Included Pets

ChatKit ships file-backed Pet presets with the ChatKit UI static assets. Current included characters are:

- Batmeme
- Boba
- Bolt
- Einstein
- Lando
- Mini Sama
- Miso
- Noir Webling
- Nukey
- Steve

Users can switch included Pets from the global settings panel. The selector shows a small preview for each Pet.

You can also configure a preset spritesheet directly:

```ts
const options = {
  pet: {
    character: {
      type: 'sprite-atlas',
      src: '/pets/bolt/spritesheet.webp',
    },
  },
};
```

Relative URLs are resolved against the ChatKit iframe `frameUrl`, so `/pets/...` should be served by the ChatKit UI static asset host, not necessarily by the host page.

## Custom Pet Images

Pet animation uses a spritesheet atlas. The default atlas contract is:

- 8 columns x 9 rows
- 192 x 208 pixels per cell
- one animation state per row

Rows map to states in this order:

| State | Purpose |
| --- | --- |
| `idle` | Resting |
| `running-right` | Dragging right |
| `running-left` | Dragging left |
| `waving` | Click or first appearance greeting |
| `jumping` | Short success animation after a run completes |
| `failed` | Conversation error |
| `waiting` | Initialization, thread loading, or waiting for a client secret |
| `running` | Request is running |
| `review` | Assistant response is streaming |

Configure your own atlas with a direct image URL:

```ts
const options = {
  pet: {
    character: {
      type: 'sprite-atlas',
      src: '/pets/custom/spritesheet.webp',
    },
    position: {
      scale: 0.35,
      draggable: true,
      persist: true,
    },
  },
};
```

If your atlas uses different dimensions, override the atlas metadata:

```ts
const options = {
  pet: {
    character: {
      type: 'sprite-atlas',
      src: 'https://cdn.example.com/pets/my-pet.webp',
      atlas: {
        columns: 8,
        rows: 9,
        cellWidth: 192,
        cellHeight: 208,
        animations: {
          idle: { row: 0, frames: 6 },
          running: { row: 7, frames: 6 },
        },
      },
    },
  },
};
```

Direct remote image URLs can be displayed by the browser. If you download assets from third-party Pet sites, prefer copying the files into the ChatKit UI static directory so manifest or JSON requests do not run into CORS restrictions.

## Position, Dragging, and Scale

Pet position and dragging are relative to the host page viewport, not the iframe viewport. The chat panel stays in its host layout position while Pet moves.

```ts
const options = {
  pet: {
    position: {
      pin: 'bottom-right',
      scale: 0.35,
      draggable: true,
      persist: true,
      boundsPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      zIndex: 40,
    },
  },
};
```

The visual base size is already reduced for Pet rendering, so `scale: 1` is not the raw 192 x 208 spritesheet cell size. Start around `0.25` to `0.5` for most pages.

The default `boundsPadding` is `0`, so Pet stops at the viewport edges. If your page has a fixed footer or floating action area, add padding only for the affected edge.

While the user drags Pet, ChatKit switches animation based on horizontal drag direction: `running-right` or `running-left`. After the pointer leaves and dragging stops, Pet waits briefly before reducing its animation refresh rate.

## Conversation Bubble

When the active conversation has assistant output or an error, Pet shows a compact conversation bubble:

- title: current thread title, with the latest user message as fallback
- message: latest assistant message, or the error message when the conversation fails
- status: running, completed, or failed

Clicking the bubble card opens the ChatKit iframe and switches to that thread. Clicking action buttons inside the bubble does not open or navigate.

On hover, users can:

- hide the current bubble
- expand or collapse message text
- reply quickly to the current conversation

The down-collapse button hides the bubble and shows a numeric badge. Clicking the badge restores the bubble. The current version only tracks the active thread, so the badge count is `1`.

Reply input sends on Enter and exits on `Esc`. Sending a reply calls ChatKit `sendUserMessage`.

## Local Settings and Commands

Users can adjust Pet from the global settings panel. These settings are stored in browser localStorage.

The `/pet` command is also available:

```text
/pet
/pet on
/pet off
/pet settings
```

`/pet` toggles Pet, and `/pet settings` opens the global settings panel at the Pet section.

## Localization

Pet settings and bubble actions follow `ChatKitOptions.locale`. English and Simplified Chinese copy is currently included. If `locale` is not configured, ChatKit falls back to browser language or the local ChatKit language setting.

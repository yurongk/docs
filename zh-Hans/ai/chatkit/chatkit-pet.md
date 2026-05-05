---
title: Pet
sidebar_position: 7
---

<Info>
在宿主页面中显示可拖拽、会随对话状态变化的 ChatKit Pet。
</Info>

ChatKit Pet 是一个轻量的动画伙伴，显示在宿主页面 viewport 上，而不是限制在 ChatKit iframe 内。它可以在用户使用 ChatKit 时提供状态反馈、展示当前会话摘要，并作为一个更轻量的聊天入口。

## 启用方式

默认情况下，ChatKit 会展示完整聊天界面，不展示 Pet。你可以通过两种方式启用：

- 在代码中配置 `pet`
- 在 ChatKit 中输入 `/pet`，或通过全局设置面板开启

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

`pet: true` 会使用默认内置 Pet，并启用右下角定位、拖拽和位置记忆。

## Pet Launcher 模式

如果希望页面初始只显示 Pet，不显示聊天面板，可以使用 `displayMode: 'pet'`。用户点击 Pet 后才会打开 ChatKit iframe。

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

在 Pet Launcher 模式下，Pet 是必需入口，因此设置面板中不能关闭 Pet。

## 内置 Pet

ChatKit 内置了一组文件型 Pet，资源随 ChatKit UI 一起发布。当前可用内置形象包括：

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

你可以在全局设置面板中切换内置 Pet。选择列表会显示每个 Pet 的预览图。

代码配置时，可以直接使用对应的 spritesheet URL：

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

相对 URL 会基于 ChatKit iframe 的 `frameUrl` 解析，因此 `/pets/...` 应该放在 ChatKit UI 静态资源所在服务下，而不是宿主页面服务下。

## 自定义 Pet 图片

Pet 使用 spritesheet atlas 作为动画资源。默认 atlas 规则为：

- 8 列 x 9 行
- 每格 192 x 208 像素
- 每一行对应一个动画状态

状态行从上到下依次为：

| 状态 | 用途 |
| --- | --- |
| `idle` | 空闲 |
| `running-right` | 向右拖动 |
| `running-left` | 向左拖动 |
| `waving` | 点击或首次出现时打招呼 |
| `jumping` | 对话成功结束后的短动画 |
| `failed` | 对话出错 |
| `waiting` | 初始化、加载线程、等待 secret |
| `running` | 请求运行中 |
| `review` | assistant 正在流式输出 |

如果你有自己的 atlas，可以直接配置图片 URL：

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

如果你的图片切分方式不同，可以通过 `atlas` 覆盖尺寸、行列数或每个状态的帧数：

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

远程图片可以作为 `<img>` 或 CSS background 加载；如果你使用第三方 Pet 网站下载的素材，建议将资源复制到 ChatKit UI 的静态目录中，避免 manifest 或 JSON 请求遇到跨域限制。

## 位置、拖拽和缩放

Pet 的坐标和拖拽范围相对于宿主页面 viewport，而不是 ChatKit iframe。聊天面板不会跟随 Pet 移动。

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

`scale` 的视觉基准已经为 Pet 做了缩小处理，`scale: 1` 并不等于原始 spritesheet cell 的 192 x 208 像素。通常推荐从 `0.25` 到 `0.5` 开始调试。

默认 `boundsPadding` 为 `0`，Pet 会贴近 viewport 四边停止。如果你的页面有固定底栏或悬浮操作区，可以按需增加对应方向的 padding。

当用户拖动 Pet 时，动画会根据水平拖动方向切换为 `running-right` 或 `running-left`。鼠标离开且不再拖动后，Pet 会在短暂延迟后降低动画刷新频率，以减少空闲状态下的开销。

## 会话气泡

当当前会话有 assistant 输出或错误信息时，Pet 会显示一个简洁的会话气泡：

- 标题：当前 thread 标题，缺失时使用最近用户消息兜底
- 内容：最近 assistant 消息；如果会话出错，则显示错误信息
- 状态：运行中、完成、失败

点击气泡本身会打开 ChatKit iframe，并切换到该气泡对应的 thread。点击气泡上的操作按钮不会触发打开或跳转。

鼠标悬停在气泡上时，可以：

- 隐藏当前气泡
- 展开或收起文本
- 快速回复当前会话

点击向下折叠按钮会隐藏气泡并显示数字 badge。再次点击 badge 会恢复气泡。当前版本只显示当前 active thread，因此数字固定为 `1`。

回复输入支持回车发送；按 `Esc` 可以退出回复表单。回复会调用 ChatKit 的 `sendUserMessage`。

## 本地设置和命令

用户可以通过全局设置面板调整 Pet。当前设置仅保存在浏览器 localStorage 中。

也可以使用 `/pet` 命令：

```text
/pet
/pet on
/pet off
/pet settings
```

`/pet` 会切换 Pet 开关，`/pet settings` 会打开全局设置面板中的 Pet 设置区域。

## 国际化

Pet 设置和会话气泡操作会跟随 `ChatKitOptions.locale`，当前支持英文和简体中文文案。未配置 `locale` 时，会使用浏览器语言或 ChatKit 本地语言设置兜底。

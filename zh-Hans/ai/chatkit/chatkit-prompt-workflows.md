---
title: Prompt Workflows
sidebar_position: 10
---

<Info>
把重复任务变成 ChatKit composer 中可发现的 slash command。
</Info>

Prompt Workflows 让用户可以通过 `/review`、`/debug`、`/summarize`、`/test` 这类短命令触发结构化任务。一个命令可以展开为 prompt、直接提交、选择需要的运行时能力，或者通知宿主应用执行前端动作。

它可以帮助团队把常用 assistant 工作流标准化，而不是要求用户记住一大段固定 prompt。

## 用户如何发现工作流

用户在 composer 开头输入 `/` 时，ChatKit 会打开命令面板。面板中可以包含：

- ChatKit 内置命令，例如 `/plan` 和 `/pet`
- 宿主应用配置的静态命令
- Xpert 技能发布的运行时命令
- 用于选择运行时能力的技能、插件和子智能体分组

命令面板支持搜索、鼠标选择和键盘导航。如果用户在一段文本中间输入 `/`，ChatKit 会优先展示运行时能力 token，而不是全局命令。

## Prompt Workflow 可以做什么

一个 workflow 命令可以：

- 把 prompt 草稿插入 composer
- 写入原始 slash invocation，由后端继续展开
- 渲染模板并直接作为用户消息提交
- 自动带上该工作流需要的运行时能力
- 通过 client action 通知宿主应用

例如，`/security-review src/app.ts` 可以提交一段标准化的安全审查 prompt，并选择包含安全审查指令的 skill。

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

当用户提交：

```text
/security-review src/app.ts
```

ChatKit 会发送：

```text
Run a security review for src/app.ts. Return findings by severity.
```

## 来自技能的运行时工作流

Xpert 技能可以通过运行时能力响应发布 workflow 命令。ChatKit 会把它们和宿主应用命令展示在同一个 slash palette 中，因此一个技能可以同时带来后端能力和用户可见的快捷入口。

运行时 workflow 命令在暴露给 ChatKit 前会经过 Xpert 后端校验。它们不能绕过 assistant 权限、技能访问控制、插件访问控制或运行时能力 allow-list 规则。

## 元数据和可观测性

当 workflow command 提交 prompt 时，ChatKit 会把命令来源信息写入提交的 human input 中。这样可以追踪某条消息来自哪个 workflow，方便调试模板行为，也方便分析不同 workflow 的使用情况。

这些元数据只用于说明来源。后端仍然应该执行正常的访问控制和工作流约束。

## 产品建议

好的 Prompt Workflow 通常应该：

- 名称短，易输入，易搜索
- 对应一个高频任务
- 对 prompt 质量有明显提升
- 自动绑定所需技能或插件
- 用用户能理解的语言描述，而不是暴露实现细节

可以优先配置的工作流包括 `/review`、`/explain`、`/test`、`/debug`、`/summarize`、`/draft` 和 `/handoff`。

---
title: Claude Code 速查指南（Everything Claude Code）
date: 2026-03-30
tags:
  - Claude Code
  - AI
  - 开发工具
  - 效率
category: 工具链
description: 经过 10 个月日常使用后，关于 Claude Code 的完整配置总结：技能、钩子、子代理、MCP、插件，以及真正有效的工作流。
---

> **转载声明**：本文翻译转载自 Affaan Mustafa（@affaanmustafa）的推文《The Shorthand Guide to Everything Claude Code》。
>
> 原文链接：[https://x.com/affaanmustafa/status/2012378465664745795](https://x.com/affaanmustafa/status/2012378465664745795)

# Claude Code 速查指南

这是我经过 10 个月日常使用后的完整配置：技能（Skills）、钩子（Hooks）、子代理（Subagents）、MCP、插件（Plugins），以及真正有效的工作流。

我从 2025 年 2 月实验性推出时就开始使用 Claude Code。从那时起，我用它构建了自主交易代理（其中一个达到了 3800 万美元 FDV，7 万并发观众看我直播编码）、为 elizaOS（17000+ Star 框架）做出了贡献，并在 2025 年 9 月赢得了 Anthropic × Forum Ventures 在纽约举办的黑客马拉松。

以下是我真正在用的配置。

---

## 技能与命令（Skills & Commands）

技能是 Markdown 文件，为 Claude 提供特定工作流的专业知识。可以理解为可复用的提示词。

- **全局技能**存放在 `~/.claude/skills/`
- **项目级技能**存放在 `.claude/skills/`
- 可以在单次提示中链式调用

```
# 技能目录结构示例
~/.claude/skills/
  coding-standards.md    # 编码最佳实践
  tdd-workflow/          # 多文件技能，包含 README.md
  security-review/       # 基于检查清单的技能
```

**实际用法**：长时间编码会话后，运行 `/refactor-clean` 自动清理死代码和松散的 Markdown 文件。

## 钩子（Hooks）

钩子是基于事件触发的自动化。技能提供知识，钩子执行动作。

共有 6 种钩子类型：

1. **PreToolUse** — 工具执行前（验证、提醒）
2. **PostToolUse** — 工具执行后（格式化、类型检查）
3. **UserPromptSubmit** — 发送消息时触发
4. **Stop** — Claude 完成响应时触发
5. **PreCompact** — 上下文压缩前
6. **Notification** — 处理权限请求

**实际示例**：一个钩子提醒你在运行 `npm install` 或 `pytest` 等长命令前使用 tmux。

```json
{
  "PreToolUse": [
    {
      "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm|pnpm|yarn|cargo|pytest)\"",
      "hooks": [
        {
          "type": "command",
          "command": "if [ -z \"$TMUX\" ]; then echo '[Hook] 建议使用 tmux 保持会话持久' >&2; fi"
        }
      ]
    }
  ]
}
```

**进阶技巧**：使用 `hookify` 插件通过对话方式创建钩子，无需手动编写 JSON。

## 子代理（Subagents）

子代理是你的主 Claude 实例可以委派任务的独立进程。它们运行在有限的作用域内，拥有独立的上下文，让主代理专注于编排。

```
# 子代理目录结构
~/.claude/agents/
  planner.md           # 功能实现规划
  architect.md         # 系统设计决策
  tdd-guide.md         # 测试驱动开发
  code-reviewer.md     # 代码质量/安全审查
  security-reviewer.md # 漏洞分析
  build-error-resolver.md
  e2e-runner.md
  refactor-cleaner.md
```

**关键原则**：限制子代理的工具权限。一个拥有 5 个工具的子代理比一个拥有 50 个工具的更快、更聚焦。

## 规则与记忆（Rules & Memory）

规则是你的护栏。用 `.rules` 文件夹中的 Markdown 文件定义 Claude 应始终遵循的最佳实践。

```
~/.claude/rules/
  security.md      # 禁止硬编码密钥，验证输入
  coding-style.md  # 不可变性，文件组织
  testing.md       # TDD 工作流，80% 覆盖率
  git-workflow.md  # 提交格式，PR 流程
  agents.md        # 何时委派给子代理
  performance.md   # 模型选择，上下文管理
```

记忆系统通过 CLAUDE.md 文件在三个层级工作：

- **项目级**：`./CLAUDE.md`（与团队共享）
- **用户级**：`~/.claude/CLAUDE.md`（个人，适用于所有项目）
- **项目级用户**：`.claude/CLAUDE.md`

## MCP（模型上下文协议）

MCP 将 Claude 连接到外部服务。不是 API 的替代品，而是一个更灵活的提示词驱动封装。

**最重要的洞察**：

> 你 200k 的上下文窗口在压缩前可能只有 70k —— 如果启用了太多工具的话。性能会显著下降。

**经验法则**：配置 20-30 个 MCP，但任何时刻保持启用不超过 10 个。活跃工具数不超过 80 个。

```json
{
  "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"] },
  "firecrawl": { "command": "npx", "args": ["-y", "firecrawl-mcp"] },
  "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  }
}
```

## 插件（Plugins）

插件将工具打包以便安装。一个插件可以是技能 + MCP 的组合，也可以是钩子和工具的捆绑。

```bash
# 添加插件市场
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep

# 然后在 Claude 中运行 /plugins，找到新的市场并安装
```

LSP 插件特别有用 —— 如果你不在编辑器中运行 Claude Code，Language Server Protocol 可以提供实时的类型检查、跳转到定义和智能补全。

---

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+U` | 删除整行输入 |
| `!` | 快速执行 Bash 命令前缀 |
| `@` | 搜索文件 |
| `/` | 发起斜杠命令 |
| `Shift+Enter` | 多行输入 |
| `Tab` | 切换思考过程显示 |
| `Esc Esc` | 中断 Claude 或恢复代码 |

## 并行工作流

两种方法同时运行多个 Claude 实例：

**1. `/fork`** — 分叉对话，并行执行不重叠的任务

**2. Git Worktrees** — 用于重叠的并行工作，每个 worktree 是独立的检出

```bash
git worktree add ../feature-branch feature-branch
# 现在在每个 worktree 中运行独立的 Claude 实例
```

## tmux 用于长运行命令

```bash
tmux new -s dev
# Claude 在这里运行命令，你可以分离和重新连接
tmux attach -t dev
```

## 其他实用命令

- `/rewind` — 回到之前的状态
- `/statusline` — 自定义显示分支、上下文百分比、待办事项
- `/checkpoints` — 文件级撤销点
- `/compact` — 手动触发上下文压缩

---

## 我的实际配置

### 插件（通常同时启用 4-5 个）

```
ralph-wiggum@claude-code-plugins       # 循环自动化
frontend-design@claude-code-plugins    # UI/UX 模式
commit-commands@claude-code-plugins    # Git 工作流
security-guidance@claude-code-plugins  # 安全检查
code-review@claude-code-plugins        # 代码审查
context7@claude-plugins-official       # 实时文档
mgrep@Mixedbread-Grep                  # 更好的搜索
```

### 关键钩子配置

```json
{
  "PreToolUse": [
    { "matcher": "npm|pnpm|yarn|cargo|pytest", "hooks": ["tmux 提醒"] },
    { "matcher": "Write && .md file", "hooks": ["除非是 README/CLAUDE 否则阻止"] },
    { "matcher": "git push", "hooks": ["打开编辑器审查"] }
  ],
  "PostToolUse": [
    { "matcher": "Edit && .ts/.tsx/.js/.jsx", "hooks": ["prettier --write"] },
    { "matcher": "Edit && .ts/.tsx", "hooks": ["tsc --noEmit"] },
    { "matcher": "Edit", "hooks": ["grep console.log 警告"] }
  ],
  "Stop": [
    { "matcher": "*", "hooks": ["检查修改文件中的 console.log"] }
  ]
}
```

---

## 关于编辑器

我使用 Zed —— 一个基于 Rust 的轻量级编辑器。

工作流：

1. 分屏：一边终端运行 Claude Code，另一边编辑器
2. `Ctrl+G` 快速打开 Claude 正在编辑的文件
3. 启用自动保存，确保 Claude 读取的文件始终是最新的
4. 使用编辑器的 Git 功能在提交前审查变更

VSCode 和 Cursor 也可以正常工作。

---

## 核心原则

1. **不要过度复杂化** — 把配置当作微调，不是架构设计
2. **上下文窗口很宝贵** — 禁用未使用的 MCP 和插件
3. **并行执行** — 分叉对话，使用 Git Worktrees
4. **自动化重复任务** — 用钩子处理格式化、Lint、提醒
5. **限定子代理的作用域** — 有限的工具 = 聚焦的执行

---

> **相关资源**：
> - 速查指南原文：[x.com/affaanmustafa/status/2012378465664745795](https://x.com/affaanmustafa/status/2012378465664745795)
> - 长篇指南原文：[x.com/affaanmustafa/article/2014040193557471352](https://x.com/affaanmustafa/article/2014040193557471352)
> - GitHub 仓库：[github.com/affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)

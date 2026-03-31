# Git Commit 日志乱码问题修复

## 问题描述

使用 Claude Code 提交时，git commit 日志显示为 `[?25l[?25h` 乱码。

## 根本原因

`cat` 命令被 alias 到 `batp` 脚本（`~/.zshrc` 或 shell 配置中），该脚本用于智能显示文件：

- 图像文件 → 使用 `bat -p` / `imgcat` / `chafa`
- 其他文件 → 使用 `bat`

但当输入是 heredoc 或 stdin 时（如 `cat <<'EOF'`），`batp` 会尝试使用 `chafa` 处理，导致：
1. `chafa` 输出错误：`Failed to open '-': Unknown file format`
2. `chafa` 输出光标控制序列：`\x1b[?25l\x1b[?25h`（隐藏/显示光标）
3. 这些序列被捕获到 commit message 中

## 解决方案

### 方案 1：修复 `batp` 脚本（已实施）✅

在 `/Users/lishuo/Workspace.localized/env/bin/batp` 中添加 stdin/heredoc 检测：

```bash
# 检查输入是否来自 stdin/heredoc
if [ $# -eq 0 ] || [ "$1" = "-" ]; then
    exec /bin/cat "$@"
fi
```

**状态**：已修复并备份原始文件

### 方案 2：使用 `/bin/cat` 代替 `cat`

在 Claude Code 中提交时使用：

```bash
git commit -m "$(/bin/cat <<'EOF'
Your commit message here
EOF
)"
```

### 方案 3：修复已有乱码 commit

#### 修复最新 commit（已实施）✅

```bash
git commit --amend -m "正确的 commit message"
```

#### 修复旧的 commit

使用交互式 rebase：

```bash
# 1. 开始 rebase（例如修复最近 4 个 commit）
git rebase -i HEAD~4

# 2. 在编辑器中，将需要修复的 commit 从:
pick e6570ea
# 改为:
reword e6570ea

# 3. 保存后，Git 会提示你编辑每个 commit message

# 4. 完成后，如需推送到远程：
git push --force-with-lease
```

**注意**：修改历史记录会影响协作者，请谨慎操作。

## 验证修复

检查最新的 commit 是否正常：

```bash
git log --oneline -1
```

应显示正常的 commit message，而不是 `[?25l[?25h`。

## 相关文件

- `~/Workspace.localized/env/bin/batp` - 智能文件显示脚本（已修复）
- `~/Workspace.localized/env/bin/batp.backup` - 原始脚本备份
- `.gitmessage_template.txt` - 提交消息模板

## 技术细节

### 转义序列说明

- `\x1b[?25l` - DECSET 25: 隐藏光标（CSI ? 25 l）
- `\x1b[?25h` - DECRST 25: 显示光标（CSI ? 25 h）

这些是 ANSI/VT100 终端控制序列，通常由终端应用程序在执行前后输出。

### 检测方法

```bash
# 查看 commit message 的原始字节
git log --format='%B' -1 <commit-hash> | od -c

# 正常输出示例：
0000000    f   i   x   :       ...

# 乱码输出示例：
0000000  033   [   ?   2   5   l 033   [   ?   2   5   h
```

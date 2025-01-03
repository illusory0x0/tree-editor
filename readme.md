# 用户手册

<!-- 警告！此用户手册由 AI 生成，并由 illusory0x0 在 2024-12-08 修订 -->

## 概述
本文档介绍了如何使用基于 TypeScript 的树状结构编辑器。编辑器支持两种模式：插入模式（Insert Mode）和`普通模式`（Normal Mode）。用户可以通过输入和键盘快捷键来编辑文本和树状结构。

## 编辑器模式
编辑器有两种主要模式：插入模式和`普通模式`。

### 插入模式
在插入模式下，用户可以输入文本。按下 `Enter` 键将接受输入并切换回`普通模式`。

按下 `r` 键将在当前节点没有子节点时切换到插入模式。

### 普通模式
在`普通模式`下，用户可以使用键盘快捷键来操作树状结构。

## 键盘快捷键
以下是编辑器支持的键盘快捷键列表：

### 寄存器
**register** 用于存储树节点以供复制，你可以删除或复制一个节点，它将被存储在寄存器中，然后你可以在以后粘贴它。

### 插入模式
- **任意字符**：输入字符并将其追加到输入框中。
- **Backspace**：删除输入框中的最后一个字符。
- **Enter**：切换到`普通模式`并接受输入。
- **Escape**：切换到`普通模式`但不接受输入。
- **ArrowUp**：在自动完成列表中向上移动。
- **ArrowDown**：在自动完成列表中向下移动。

### 普通模式

#### 选择操作
- **L**：选择父节点。
- **H**：选择第一个子节点。
- **J**：选择左兄弟节点。
- **K**：选择右兄弟节点。

#### 移动操作
- **h**：向左移动。
- **j**：向下移动。
- **k**：向上移动。
- **l**：向右移动。

#### 修改操作
- **d**：删除当前节点。
- **r**：如果当前节点没有子节点，切换到插入模式。

#### 插入操作
- **i**：在当前节点前插入
- **a**：在当前节点后插入
- **e**：将当前节点添加为子节点。

#### 分组操作
- **o**：将当前节点分组。
- **O**：取消当前节点的分组。

#### 注册操作
- **p**：在当前节点后插入寄存器中的节点。
- **P**：在当前节点前插入寄存器中的节点。
- **y**：将当前节点复制到寄存器中。

#### 撤销和重做操作
- **u**：恢复到上一个状态。

#### 保存操作
- **Ctrl + s**：将当前树状结构保存为 `array-tree.json`。
- **Ctrl + Shift + s**：将当前树状结构保存为 `tree.json`。

## 使用方法
1. **启动编辑器**：在支持 TypeScript 的环境中运行编辑器代码。
2. **切换模式**：按下 `Enter` 键切换到`普通模式`，按下 `r` 键将在当前节点没有子节点时切换到插入模式。
3. **输入文本**：在插入模式下，输入任意字符或使用 `Backspace` 删除字符。
4. **操作树状结构**：在`普通模式`下，使用键盘快捷键进行各种操作，如选择节点、移动节点、插入节点等。
5. **保存文件**：使用 `Ctrl + s` 或 `Ctrl + Shift + s` 快捷键保存当前树状结构。

## 注意事项
- 操作树状结构时，请确保编辑器处于`普通模式`。
# Tasks

- [x] Task 1: 修复股票名称中文乱码
  - [x] SubTask 1.1: 在 `client/src/renderer/src/components/settings/StocksTab.tsx` 中，找到 `handleSearch` 函数。
  - [x] SubTask 1.2: 使用正则或其他方法解析 `await response.text()` 返回值中的 Unicode 转义字符（例如 `\u4e0a` -> `上`），可以自定义 unescape 逻辑：`text.replace(/\\u[\dA-F]{4}/gi, match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)))`。

- [x] Task 2: 修复透明度和背景颜色不生效
  - [x] SubTask 2.1: 修改 `client/src/renderer/src/assets/main.css`，移除 `body` 的 `background-image: url('./wavy-lines.svg');` 和 `background-size: cover;`，以及 `#root` 的 `margin-bottom: 80px;` 等影响全屏显示的样式。
  - [x] SubTask 2.2: 修改 `client/src/renderer/src/assets/base.css`，移除 `:root` 的 `--color-background` 等实体背景，或将 `body` 的 `background` 改为 `transparent`。

- [x] Task 3: 优化背景颜色的兼容性
  - [x] SubTask 3.1: 在 `client/src/renderer/src/pages/Monitor.tsx` 中，完善 `getBackgroundColor` 方法的正则表达式，支持 3 位的 16 进制颜色（如 `#000`、`#FFF`），并在转换为 `rgba` 时正确处理位数。
  - [x] SubTask 3.2: 考虑在解析失败（例如输入 `red` 或 `transparent` 等非常规 HEX 格式）时，直接使用用户的 `bgColor` 字符串。

# Task Dependencies
- [Task 1], [Task 2], [Task 3] 无依赖，可以并行或串行处理。

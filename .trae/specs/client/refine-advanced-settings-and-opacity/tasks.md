# Tasks

- [x] Task 1: 禁用设置界面的最大化/最小化/缩放功能并调整尺寸
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 的 `openSettings` 函数中，添加 `resizable: false, maximizable: false, minimizable: false` 到 `BrowserWindow` 的构造配置。
  - [x] SubTask 1.2: 调整窗口默认 `width` 到 `650`，`height` 到 `600`，以便容纳各个 Tab 页的全部设置项，防止出现滚动条。

- [x] Task 2: 让透明度设置对文字和背景同时生效
  - [x] SubTask 2.1: 在 `client/src/renderer/src/pages/Monitor.tsx` 中，重构 `getBackgroundColor` 方法，不再返回 `rgba(r, g, b, opacity)` 而是直接返回带有原 `alpha`（如果本来就是 rgba）或者 HEX 的完整颜色。如果是常规 3 位或 6 位 HEX，直接返回 `#hex` 或对应字符串。
  - [x] SubTask 2.2: 在 `Monitor.tsx` 最外层 `div` 的 `style` 对象中，增加 `opacity: (settings.opacity ?? 80) / 100`。这样就能够同时控制文字和背景的透明度。

- [x] Task 3: 增加“开启页面右键”的控制
  - [x] SubTask 3.1: 在 `client/src/renderer/src/components/settings/AdvancedTab.tsx` 的“行为与控制”模块下，添加 `<Form.Item label="开启页面右键" name="enableContextMenu">` 并使用 `Segmented`，包含 `开启(true)` 和 `关闭(false)`。
  - [x] SubTask 3.2: 在 `AdvancedTab` 的 `handleReset` 方法及 `initialValues` 中增加 `enableContextMenu: true` 的默认值。
  - [x] SubTask 3.3: 在 `client/src/renderer/src/pages/Monitor.tsx` 中，在 `handleContextMenu` 函数开始处检查 `if (settings.enableContextMenu === false) return`，以控制右键菜单是否弹出。

- [x] Task 4: 优化各 Tab 页面布局防止侧边滚动条
  - [x] SubTask 4.1: 在 `client/src/renderer/src/components/settings/AdvancedTab.tsx` 和其他需要的地方，修改外层 `div` 的 `padding`，去除不必要的 `marginBottom` 或 `paddingBottom`。
  - [x] SubTask 4.2: 在 `client/src/renderer/src/pages/Settings.tsx` 确认内部滚动区域的 `flex: 1` 和 `height: '100%'` 配置合理，确保内容适应窗口大小（由于窗口已经调整为 600 高度，通常足够容纳）。

# Task Dependencies
- [Task 2], [Task 3] 与 [Task 1] 无明显耦合，可独立完成。

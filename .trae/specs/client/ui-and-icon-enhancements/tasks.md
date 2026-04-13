# Tasks

- [x] Task 1: 将设置界面的窗口标题设为“设置”
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 中的 `openSettings` 函数里，`settingsWindow` 配置项中增加 `title: '设置'`。

- [x] Task 2: 替换系统默认图标为“幽灵/小精灵”主题
  - [x] SubTask 2.1: 调用图像生成服务（Text to Image），提示词需描述“一只极简可爱的小幽灵或隐蔽的小精灵，纯色背景，适合做系统托盘或桌面应用图标，线条简洁”。
  - [x] SubTask 2.2: 将生成的图像下载并覆盖 `client/resources/icon.png`。

- [x] Task 3: 优化“确定”和“取消”按钮的点击反馈
  - [x] SubTask 3.1: 在 `client/src/renderer/src/pages/Settings.tsx` 中，引入 `antd` 的 `Button` 组件。
  - [x] SubTask 3.2: 替换掉原有的原生 `<button>` 元素。设置“确定”按钮为 `type="primary"`，设置“取消”按钮为默认样式，保留间距。
  - [x] SubTask 3.3: 添加 `onClick` 处理器，通过 `window.close()` 实现点击按钮后关闭当前设置界面的基本逻辑。

# Task Dependencies
- 这三个任务完全独立，可并行或任意顺序处理。

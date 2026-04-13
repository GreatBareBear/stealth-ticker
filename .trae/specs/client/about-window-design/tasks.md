# Tasks

- [x] Task 1: 新建“关于”页面组件
  - [x] SubTask 1.1: 在 `client/src/renderer/src/pages/About.tsx` 中创建新的 React 组件。
  - [x] SubTask 1.2: 根据设计图实现布局：顶部（图标+标题+版本）、中部（版权声明）、下部分割线后的联系信息表单（包含 Home, E-mail, 用户群）。
  - [x] SubTask 1.3: 在底部添加一个“检查更新”的 Ant Design 按钮。

- [x] Task 2: 注册并添加路由
  - [x] SubTask 2.1: 在 `client/src/renderer/src/main.tsx` 或路由定义文件中引入 `<About />` 并增加 `#/about` 路由路径。

- [x] Task 3: 在主进程中创建“关于”窗口的管理函数
  - [x] SubTask 3.1: 在 `client/src/main/index.ts` 中新增 `let aboutWindow: BrowserWindow | null` 和 `function openAbout()`，创建一个较小尺寸、不可调整大小的窗口，并指向 `#/about` 路由。
  - [x] SubTask 3.2: 替换 `createTray` 和 `ipcMain.on('show-context-menu')` 中“关于”菜单的 `click: () => { console.log('About clicked') }` 为 `click: openAbout`。

# Task Dependencies
- [Task 2] 和 [Task 1] 相互依赖（必须先写好组件才能配路由）。
- [Task 3] 依赖于 [Task 2] 提供的可访问路由。
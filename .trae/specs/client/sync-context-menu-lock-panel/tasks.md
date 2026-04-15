# Tasks

- [ ] Task 1: 为悬浮窗右键菜单增加“锁定面板”
  - [ ] SubTask 1.1: 在 `client/src/main/index.ts` 的 `ipcMain.on('show-context-menu')` 菜单模板中增加“锁定面板”（checkbox）条目。
  - [ ] SubTask 1.2: 抽取/复用与托盘菜单一致的锁定逻辑：`setIgnoreMouseEvents(locked, { forward: true })` + `webContents.send('window-locked', locked)`。
  - [ ] SubTask 1.3: 让右键菜单中的 checkbox `checked` 与托盘菜单共享同一锁定状态，保证两处状态一致。

- [ ] Task 2: 校验与验证
  - [ ] SubTask 2.1: 手动验证：托盘菜单与悬浮窗右键菜单均存在“锁定面板”，且互相切换后状态一致。
  - [ ] SubTask 2.2: 运行 `npm -C client run typecheck:web`（如本仓库可执行）。

# Task Dependencies
无


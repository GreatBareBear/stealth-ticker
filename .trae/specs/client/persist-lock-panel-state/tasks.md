# Tasks
- [x] Task 1: 持久化 `isPanelLocked` 状态 (`index.ts`)
  - [x] SubTask 1.1: 将 `'panelLocked'` 添加到 `ALLOWED_STORE_KEYS` 白名单中。
  - [x] SubTask 1.2: 在 `index.ts` 顶部初始化 `isPanelLocked` 时，读取 `store.get('panelLocked') || false`。
  - [x] SubTask 1.3: 在 `setPanelLocked(locked)` 函数中，调用 `store.set('panelLocked', locked)` 以保存状态。
  - [x] SubTask 1.4: 在 `createWindow` 后，或者 `applySettings` 初始化时，主动调用 `setPanelLocked(isPanelLocked)` 使初始配置生效。
- [x] Task 2: 建立 `temp-unlock` IPC 通道 (`index.ts`, `preload/index.ts`, `env.d.ts`)
  - [x] SubTask 2.1: 在 `index.ts` 中注册 `ipcMain.on('temp-unlock', (event, unlock: boolean))`，仅当 `isPanelLocked` 为 `true` 时，调用 `mainWindow?.setIgnoreMouseEvents(!unlock, { forward: true })`。
  - [x] SubTask 2.2: 在 `preload/index.ts` 的 `api` 对象中导出 `tempUnlock: (unlock: boolean) => ipcRenderer.send('temp-unlock', unlock)`。
  - [x] SubTask 2.3: 在 `env.d.ts` 中的 `interface Window { api: ... }` (如果存在或新加) 中声明 `tempUnlock` 的类型，以便 TypeScript 识别 `window.api.tempUnlock`。
- [x] Task 3: 实现前端临时解锁手势 (`Monitor.tsx`)
  - [x] SubTask 3.1: 在 `Monitor.tsx` 中使用 `useEffect` 监听 `mousemove`, `mouseleave` 甚至全局的 `keydown`/`keyup` (专门处理 `Alt` 键的按下和松开)。
  - [x] SubTask 3.2: 当检测到鼠标在窗口内 (`mouseenter` / `mousemove`) 且 `event.altKey` 为 `true` 时，调用 `window.api.tempUnlock(true)`。
  - [x] SubTask 3.3: 当检测到鼠标离开 (`mouseleave`) 或 `keyup` 时，如果之前发过 `true`，则调用 `window.api.tempUnlock(false)`，恢复穿透状态。
- [x] Task 4: 确保编译不报错 (`npm run typecheck:main` 和 `npm run typecheck:web`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 1, Task 2, Task 3]

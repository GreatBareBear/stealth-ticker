# Tasks

- [x] Task 1: 扩展主进程预警通知能力
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 注册 IPC 通道 `ipcMain.on('trigger-alert', (event, { method, message }) => {...})`。
  - [x] SubTask 1.2: 如果 `method === 'sound'`，调用 `shell.beep()` 播放系统提示音。
  - [x] SubTask 1.3: 如果 `method === 'blink'`，启动一个定时器让托盘图标每 500ms 切换一次（隐藏与显示），持续 10 秒钟后恢复正常图标。需要注意防止多次触发时定时器冲突。

- [x] Task 2: 增加预警设置弹窗 (UI)
  - [x] SubTask 2.1: 在 `client/src/renderer/src/components/settings/StocksTab.tsx` 中，定义 `AlertConfig` 接口。
  - [x] SubTask 2.2: 在 `columns` 的 `action` 列，与 `DeleteOutlined` 并排增加一个预警（例如 `BellOutlined`）图标。
  - [x] SubTask 2.3: 点击图标弹出 `<Modal>`。表单包含：
    - 预警类型 (价格 / 涨跌幅)。
    - 条件 (高于 / 低于)。
    - 阈值 (`InputNumber`：若是价格则精度2位；若是涨跌幅则范围 ±0.1% ~ ±20%，步长0.1)。
    - 文案 (`TextArea`：最大 50 字，默认 `${股票名称}当前价格${价格}已突破${阈值}`)。
    - 提醒方式 (Radio 三选一：弹窗 / 提示音 / 托盘闪烁)。
  - [x] SubTask 2.4: 保存和读取时，使用 `window.api.store.get('alerts')`，将数据格式设为 `Record<string, AlertConfig>` (键为 `symbol`)。

- [x] Task 3: 增加监控页面的轮询触发逻辑
  - [x] SubTask 3.1: 在 `client/src/renderer/src/pages/Monitor.tsx` 的 `loadConfigAndData` 获取完最新数据后，读取 `alerts` 配置。
  - [x] SubTask 3.2: 遍历每只股票，如果满足预警规则，并且该规则尚未在本次启动中触发过（在组件外或 `useRef` 中用 `Set` 记录 `triggeredKeys`，防止每隔几秒重复轰炸）。
  - [x] SubTask 3.3: 触发时，解析提醒文案（替换 `${股票名称}`, `${价格}`, `${阈值}` 为实际值；若变量缺失或配置为空则使用降级文案）。
  - [x] SubTask 3.4: 根据提醒方式，若为 `popup`，使用 HTML5 `new Notification(title, { body })` 并在 3s 后自动调用 `.close()`；若是 `sound` / `blink`，则通过 `ipcRenderer.send('trigger-alert')` 交给主进程。

# Task Dependencies
- [Task 3] 依赖 [Task 1] 提供的主进程 IPC 能力和 [Task 2] 提供的用户配置数据。
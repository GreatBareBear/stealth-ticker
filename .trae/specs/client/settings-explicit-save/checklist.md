- [x] 设置窗口底部现在包含“确定”和“取消”按钮。
- [x] 点击“取消”或直接关闭窗口，再次打开时，之前未保存的设置将不会被保留。
- [x] 点击“确定”后，设置会被成功保存到配置文件，窗口自动关闭。
- [x] 多选项卡同时修改同一个配置项（如 `settings`）时，不会发生互相覆盖的问题。
- [x] 运行 `npm run typecheck:main` 与 `npm run typecheck:web` 没有 TypeScript 错误。

- [ ] 点击“确定/取消”按钮后设置窗口会立刻关闭（隐藏），不依赖 `window.electron.ipcRenderer` 的存在
- [ ] `preload` 暴露的 `window.api.closeSettingsWindow()` 可用且通过 IPC 正确触发主进程隐藏窗口

- [x] 主程序在 `electron-store` 无 `stocks` 时能写入预设的 4 只股票
- [x] 行情界面 `Monitor.tsx` 能够收到主进程推送的数据并不再卡在 Loading... 状态
- [x] `Monitor.tsx` 的初始 `DEFAULT_STOCKS` 和 `StocksTab` 的初始股票数量匹配

- [ ] 当 `stocks` 存在但为空数组（或为非法非数组值）时，主程序能自动恢复默认自选股并恢复行情推送
- [ ] 将 `stocks` 清空为 `[]` 后重启应用，行情界面不再卡在 Loading...

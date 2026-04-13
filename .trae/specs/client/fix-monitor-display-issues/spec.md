# Fix Monitor UI and Stock Search Spec

## Why
1. 添加股票时的中文名称出现乱码，因为腾讯 Smartbox API 返回的字符串包含 Unicode 转义序列（如 `\u4e0a`），而代码中未对其进行解析。
2. 调整透明度和背景颜色在行情界面不生效，因为 Electron-Vite 模板默认的 `base.css` 和 `main.css` 给 `body` 和 `#root` 设置了不透明的背景颜色、背景图片以及影响布局的 `margin`。

## What Changes
- 解析 Smartbox API 返回的 Unicode 转义字符。
- 清理 `base.css` 和 `main.css` 中默认的背景样式（包括 `background-image`、`background`、`margin-bottom` 等），确保 `body` 和 `#root` 具有透明背景。
- 在 `Monitor.tsx` 的 `getBackgroundColor` 方法中，增加对 3 位 16 进制颜色（如 `#000`）和 8 位颜色（带透明度的 Hex）的支持，或者如果用户输入了无法解析的颜色名，确保透明度能以某种形式生效（比如通过 `rgba` 回退）。

## Impact
- Affected code:
  - `client/src/renderer/src/components/settings/StocksTab.tsx`
  - `client/src/renderer/src/assets/base.css`
  - `client/src/renderer/src/assets/main.css`
  - `client/src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: 股票名称 Unicode 解析
The system SHALL decode Unicode escape sequences in the API response text before parsing the hint fields.

### Requirement: 完全透明的窗体背景
The system SHALL ensure the Electron BrowserWindow's HTML body is completely transparent so that the React application's opacity and background color settings dictate the window's visual background.

## MODIFIED Requirements
### Requirement: 背景颜色兼容性
The system SHALL support 3-character hex color codes in `getBackgroundColor`.

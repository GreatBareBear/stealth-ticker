# 显示预设三段式（方案A）Spec

## Why
当前“预设模板”以三个并列按钮呈现，视觉上更像一次性操作而非“模式选择”，也缺乏“当前处于哪个预设/是否已被手动调整为自定义”的反馈，导致不够直观、可发现性不足。

用户选择方案A：将预设改为 `Segmented` 三段式模式选择，形成更符合操作习惯的“模式切换”入口，同时保持极简与紧凑。

## What Changes
- 将“预设模板”从 3 个按钮改为 `Segmented` 选择器：`推荐 / 隐蔽 / 清晰`（新增可选的 `自定义` 状态用于显示当前并非任何预设）。
- 在选择预设时应用对应参数，并写入 `settings.displayPreset` 以记忆“当前模式”。
- 当用户在应用预设后手动修改相关显示项时，自动切换为 `自定义`（避免 UI 显示与实际配置不一致）。
- 在 `Segmented` 下方增加一行极简的差异说明（例如：透明度/字号/刷新/显示高低价），帮助用户理解每个预设的作用。

## Impact
- Affected specs: 显示（Display）设置的预设交互与视觉呈现。
- Affected code: `client/src/renderer/src/components/settings/DisplayTab.tsx`

## ADDED Requirements
### Requirement: 预设模式选择器
系统 SHALL 在显示设置页提供三段式预设模式选择器，并持久化当前模式。

#### Scenario: 用户选择预设
- **WHEN** 用户在 `Segmented` 中选择 `推荐/隐蔽/清晰`
- **THEN** 系统应立即应用对应预设参数并保存到本地设置
- **AND** `settings.displayPreset` 应更新为对应模式值

#### Scenario: 用户手动微调
- **WHEN** 用户在应用任意预设后手动修改预设相关字段（透明度、字号、行高、刷新频率、显示高低价等）
- **THEN** 系统应将 `settings.displayPreset` 自动切换为 `自定义`

## MODIFIED Requirements
### Requirement: 预设区域 UI
预设区域 SHALL 以“模式选择”的方式呈现，并提供最少但足够的差异说明，避免按钮式“看不出当前状态”的问题。


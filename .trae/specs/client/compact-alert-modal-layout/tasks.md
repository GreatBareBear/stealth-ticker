# Tasks

- [x] Task 1: 紧凑化弹窗整体尺寸与间距
  - [x] SubTask 1.1: 在 `client/src/renderer/src/components/settings/StocksTab.tsx` 中，为 `<Modal title="预警设置">` 增加 `width={400}` 或类似较小尺寸（默认是 520）。
  - [x] SubTask 1.2: 在 `Form` 上统一控制子项间距，或为各个 `<Form.Item>` 增加 `style={{ marginBottom: 12 }}`。

- [x] Task 2: 重新排版核心表单项（同行展示）
  - [x] SubTask 2.1: 将 `预警类型`、`触发条件`、`阈值` 三个 `Form.Item` 使用 `<Space>` 或者 `Row/Col` 水平排列在同一行。由于空间有限，可以移除它们的 `label`，直接用默认选中项或内部 placeholder 示意；或者保留极简的 label。
  - [x] SubTask 2.2: 为了适应小宽度，将 `Radio.Group` 改为 `<Select>`，或者使用 `Radio.Button` 并配合 `size="small"`。
  - [x] SubTask 2.3: `InputNumber` 宽度调整以适配同行布局。

- [x] Task 3: 优化文案与方式布局
  - [x] SubTask 3.1: 将 `TextArea` 设置为 `autoSize={{ minRows: 2, maxRows: 3 }}` 或固定 `rows={2}`。
  - [x] SubTask 3.2: 保证 `提醒方式` 的 Radio 按键显示紧凑，例如使用 `Radio` 而不是竖排。

# Task Dependencies
- [Task 1, Task 2, Task 3] 可在同一个文件内同时进行。
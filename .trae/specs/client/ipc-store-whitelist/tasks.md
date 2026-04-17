# Tasks
- [x] Task 1: 定义 IPC Store Key 白名单与验证逻辑 (`index.ts`)
  - [x] SubTask 1.1: 梳理目前使用的 Store keys 并声明为常量数组 `ALLOWED_STORE_KEYS`。
  - [x] SubTask 1.2: 添加 `isValidKey(key)` 的验证函数。
  - [x] SubTask 1.3: 添加 `isValidValue(value)` 的验证函数，判断是否能够序列化并小于设定体积限制（例如 5MB = 5 * 1024 * 1024 bytes）。
- [x] Task 2: 改造 `store:get` 处理函数 (`index.ts`)
  - [x] SubTask 2.1: 加入白名单判断，未通过验证则返回 `null`。
- [x] Task 3: 改造 `store:set` 处理函数 (`index.ts`)
  - [x] SubTask 3.1: 加入白名单判断。
  - [x] SubTask 3.2: 加入 value 大小限制和序列化检查，未通过则抛出错误并拒绝写入。
- [x] Task 4: 改造 `store:delete` 处理函数 (`index.ts`)
  - [x] SubTask 4.1: 加入白名单判断。
- [x] Task 5: 确保编译不报错 (`npm run typecheck:main`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2, Task 3, Task 4]

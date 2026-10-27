# acp-render

[English](./README.md)

用于渲染 [Agent Client Protocol (ACP)](https://agentclientprotocol.com) 会话的 React UI
组件：会话时间线、流式 Markdown、推理过程、原地更新的工具调用、工具分组、计划、
权限请求、按工具和按轮次的 diff、终端输出以及输入框。

| 包                  | 说明                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `@acp-render/core`  | 框架无关：ACP → 事件适配器、不可变 reducer、展示行（折叠 / 分组）、diff 聚合、ACP 客户端桥接。          |
| `@acp-render/react` | React 组件、Tailwind v4 主题 / v3 预设、懒加载的内置 Markdown。                                          |
| shadcn registry     | 把组件源码复制到你的应用(`npx shadcn add …`)。                                                          |

```text
ACP session/update ─► acpUpdateToEvents ─► reduceThread (ThreadState) ─► deriveRows (Row[]) ─► <Timeline/>
```

## 安装

```sh
pnpm add @acp-render/core @acp-render/react
```

Tailwind v4(`app.css`):

```css
@import "tailwindcss";
@import "@acp-render/react/theme.css";
```

Tailwind v3:在 `presets` 中加入 `require("@acp-render/react/tailwind-preset").default`,
在 `content` 中包含 `node_modules/@acp-render/react/dist/**/*.js`,并引入
`@acp-render/react/tokens.css`。

## 配合 ACP 连接使用

```tsx
import { ClientSideConnection } from "@agentclientprotocol/sdk";
import { createAcpBridge, createThreadStore } from "@acp-render/core";
import { Composer, ThreadProvider, Timeline, useThreadState } from "@acp-render/react";

const store = createThreadStore();
const bridge = createAcpBridge(store, { sessionId });

const connection = new ClientSideConnection(
  () => ({
    ...otherClientHandlers,
    sessionUpdate: bridge.sessionUpdate,
    requestPermission: bridge.requestPermission,
  }),
  stream,
);

async function prompt(blocks) {
  const turnId = bridge.beginTurn(blocks);
  try {
    bridge.endTurn(await connection.prompt({ sessionId, prompt: blocks }), turnId);
  } catch (err) {
    bridge.failTurn(err, turnId);
  }
}

function Session() {
  const running = useThreadState(
    (s) => s.turnOrder.length > 0 && s.turns[s.turnOrder.at(-1)!]!.status !== "ended",
  );
  return (
    <div className="acp-root flex h-full flex-col bg-acp-bg text-acp-fg">
      <Timeline onOpenDiff={(turnId, path) => openDiffPanel(turnId, path)} />
      <Composer
        running={running}
        onSubmit={(_text, blocks) => prompt(blocks)}
        onCancel={() => {
          bridge.cancel();
          void connection.cancel({ sessionId });
        }}
      />
    </div>
  );
}

<ThreadProvider store={store} bridge={bridge}>
  <Session />
</ThreadProvider>;
```

`@acp-render/core` 只依赖 ACP 的 JSON 结构(结构化类型),不依赖 SDK,因此任意
传输层都可用:自己把 `acpUpdateToEvents(update)` dispatch 进 store 即可。

## 行为

- **稳定的工具标识** – `tool_call` / `tool_call_update` 按 `toolCallId` upsert;`null` 或省略的字段保留之前的值。
- **消息** – 同一角色的连续 chunk 会合并;存在 `messageId` 时以其为准;`session/load` 重放会重建隐式轮次(`bridge.loaded()` 将其收尾)。
- **折叠** – 已结束的轮次折叠为“Worked for …”,保留用户消息、第一条和最后一条 assistant 消息以及失败的工具调用。进行中的轮次和流式消息永不折叠。通过 `<Timeline rowOptions={…}>` 配置。
- **分组** – 连续的 `read` / `search` 工具调用合并为一行可展开的行。
- **Diff** – 按工具的 diff 来自 ACP 的 `diff` 内容;按轮次的汇总会对每个 path 用最早的 `oldText` 对比最新的 `newText`,重复编辑不会被重复计算。
- **取消** – `bridge.cancel()` 将未完成的工具调用标记为已取消,并按 ACP 要求以 `cancelled` 应答挂起的权限请求。
- **滚动** – 时间线跟随新输出,直到用户向上滚动,随后显示“Jump to latest”。
- **Markdown** – 内置 `react-markdown` + `remark-gfm`,首次渲染时懒加载;流式输出时会自动闭合未结束的代码围栏。可用 `<MarkdownProvider value={(props) => …}>` 替换。

## 自定义

每一行都是独立组件(`UserMessage`、`AssistantMessage`、`ReasoningBlock`、`ToolCallRow`、
`ToolGroup`、`PlanCard`、`PermissionPrompt`、`ChangedFilesSummary`、`TurnFold`、`WorkingIndicator`、
`TurnStatus`、`InlineDiff`、`TerminalOutput`、`ContextMeter`、`Composer`)。可以用
`<Timeline renderRow={(row, ctx) => row.kind === "plan" ? <MyPlan plan={row.plan} /> : undefined} />`
覆盖某类行,或基于 `useRows()` 自建列表。通过覆盖 `--acp-*` CSS 变量换主题。

## 复制源码(shadcn)

```sh
npx shadcn add https://hifizz.github.io/acp-render/r/acp-timeline.json
npx shadcn add https://hifizz.github.io/acp-render/r/acp-composer.json
```

文件会落在 `components/acp-render/`;状态和类型只依赖 `@acp-render/core`。

## 开发

```sh
pnpm install
pnpm dev             # 带脚本化 mock agent 的 playground(无真实模型)
pnpm test && pnpm lint && pnpm typecheck && pnpm build
pnpm registry:build  # shadcn registry → apps/playground/public/r
```

## 许可证

MIT

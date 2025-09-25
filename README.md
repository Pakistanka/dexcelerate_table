## Dexcelerate Token Scanner — MVP

### What is this?

Token Scanner renders two side‑by‑side tables (Trending Tokens and New Tokens) with infinite scrolling, real‑time updates via WebSocket, and performant virtualization.

### Demo

- Live demo: [overfuse.github.io/token-pages](https://overfuse.github.io/token-pages)

### Key Features

- Two tables: Trending and New, full‑height layout
- Infinite scroll (server pagination), virtualization for >1000 rows
- Real‑time updates (tick and pair‑stats) with price flash feedback
- Local debounced updates and reordering to maintain sort intent
- Per‑table filters (chain, volume, age, exclude honeypots) and realtime toggle
- Essential columns: Token, Exchange, Price, Market Cap, Volume, Price Changes (5m/1h/6h/24h), Age, Buys/Sells, Liquidity, Audit badges
- Visual style inspired by DefiLlama protocol rankings

### Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- @tanstack/react-query for pagination/fetching
- @tanstack/react-table for table logic
- react-virtuoso for virtualization
- Zustand (per‑table store) for rows/filters/realtime + WS handling

### Getting Started

1. Install + start dev server

```bash
yarn install or pnpm install
yarn dev or pnpm run dev
```

3. Build and preview the build

```bash
yarn build
yarn preview
```

### API notes:

You will have to use a no-cors extension from the chrome web store during development
`https://chromewebstore.google.com/detail/allow-cors-access-control/` - or any other extension with similar functionality.

Enable CORS for REST API `https://api-rs.dexcelerate.com` and WebSocket `wss://api-rs.dexcelerate.com/ws`;

### Architecture Overview

├── src/
│   ├── components/
│   │   ├── icons/
│   │   │   ├── FallbackIcon.tsx
│   │   │   ├── NetworkIcon.tsx
│   │   │   └── ProtocolIcon.tsx
│   │   │
│   │   └── table/
│   │       ├── Columns.tsx
│   │       ├── TokenCell.tsx
│   │       ├── AuditBadge.tsx
│   │       ├── Filters.tsx
│   │       └── ScannerTable.tsx
│   │
│   ├── hooks/
│   │   ├── useScannerQuery.ts
│   │   └── useScannerUpdates.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── ws.ts
│   │
│   ├── stores/
│   │   └── scannerStore.ts
│   │
│   └── utils/
│       ├── chainMap.ts
│       ├── dexMap.ts
│       ├── formatAge.ts
│       └── formatUsd.ts
│
├── App.tsx
├── index.css
├── main.tsx

### Frchitectural explanations
1. Per-table Zustand stores: createScannerStore(ws)
  - State: filters, realtimeEnabled, rowsById (Map), rows (array), sort metadata
  - Actions: setFilters, setRealtime, onScannerPairs, onTick, onPairStats, flush
  - Flush: debounced; batches updates and reorders rows locally before committing

2. Data fetching: useScannerQuery
  - Handles paginated GET /scanner requests
  - Sends pages to the store using onScannerPairs

3. Real-time updates: useScannerUpdates
  - connects a WebSocket for each table
  - subscribes to scanner filters and per-row pair / pair-stats events
  - tick updates price and market cap
  - pair-stats updates audit fields
  - debounced flush keeps the row order correct

4. Table rendering: ScannerTable + react-virtuoso + @tanstack/react-table
  - stable row keys and memoized components
  - semantic table HTML
  - price flashing using temporary cell state

5. UI components:
  - filters per table
  - token cell with chain/protocol icons
  - auditBadge set for audit info
  - numbers formatted with numeral

### Usage

Explain briefly how to use your app, or what the main functionality is. For example:
  - Browse trending tokens or new tokens.
  - Apply filters for volume, age, market cap, chain, or exclude honeypots.
  - Real-time updates are available for live monitoring.

### Technologies

- React + TypeScript
- Zustand for state management
- TanStack Table (@tanstack/react-table)
- Virtuoso for virtualized tables
- WebSockets for real-time data updates

### Performance Notes

- Virtualization keeps DOM size small; `rowsById` Map allows in‑place merges


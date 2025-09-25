import { memo, useCallback, useMemo, useEffect } from "react";
import { TableVirtuoso } from "react-virtuoso";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { scannerColumns } from "./table/Columns";

export interface ScannerTableRow {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenBaseSymbol?: string;
  chain: string;
  chainId: number;
  exchange: string;
  priceUsd: number;
  priceFlash?: "up" | "down" | null;
  priceFlashAt?: number;
  volumeUsd: number;
  mcap: number;
  mcapChangePc?: number;
  priceChangePcs: { "5m": number; "1h": number; "6h": number; "24h": number };
  transactions: { buys: number; sells: number };
  audit: {
    mintable: boolean;
    freezable: boolean;
    honeypot: boolean;
    contractVerified: boolean;
    renounced: boolean;
    liquidityLocked: boolean;
    linkTwitter?: string | null | undefined;
    linkWebsite?: string | null | undefined;
    linkTelegram?: string | null | undefined;
    linkDiscord?: string | null | undefined;
  };
  tokenCreatedTimestamp: Date;
  liquidity: { current: number; changePc: number };
}

export interface ScannerTableProps {
  title: string;
  rows: ScannerTableRow[];
  isLoading?: boolean;
  isError?: boolean;
  onEndReached?: () => void;
  isFetchingMore?: boolean;
  onRowMount?: (id: string) => void;
  onRowUnmount?: (id: string) => void;
}

export const ScannerTable = memo(function ScannerTable({
  title,
  rows,
  isLoading,
  isError,
  onEndReached,
  isFetchingMore,
  onRowMount,
  onRowUnmount,
}: ScannerTableProps & { tableType?: "trending" | "new" }) {
  const initialSorting = useMemo(() => {
    if (title.toLowerCase().includes("trending")) return [{ id: "volumeUsd", desc: true }];
    if (title.toLowerCase().includes("new")) return [{ id: "age", desc: true }];
    return [];
  }, [title]);

  const table = useReactTable({
    data: rows,
    columns: scannerColumns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: false,
    enableSorting: true,
    enableColumnFilters: false,
    getRowId: (row) => row.id,
    initialState: { sorting: initialSorting },
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  })

  const tableRows = table.getRowModel().rows;
  const virtuosoComponents = useMemo(
    () => ({
      TableRow: (props: any) => {
        const id: string | undefined =
          props?.item?.original?.id ?? props?.["data-row-id"];

        useEffect(() => {
          if (id && onRowMount) onRowMount(id);
          return () => {
            if (id && onRowUnmount) onRowUnmount(id);
          };
        }, [id]);
        return (
          <tr
            {...props}
            className={
              (props.className ?? "") +
              " text-sm hover:bg-neutral-900/60 odd:bg-neutral-950 even:bg-neutral-900"
            }
          />
        );
      },
      TableHead: (props: any) => (
        <thead
          {...props}
          className={(props.className ?? "") + " sticky top-0 z-10"}
        />
      ),
    }),
    []
  );
  const renderHeader = useCallback(
    () => (
      <>
        {table.getHeaderGroups().map((hg) => (
          <tr
            key={hg.id}
            className="text-xs text-neutral-400 bg-neutral-950 select-none"
          >
            {hg.headers.map((header) => {
              const alignRight = [
                "priceUsd",
                "mcap",
                "mcapPc",
                "volumeUsd",
                "chg5m",
                "chg1h",
                "chg6h",
                "chg24h",
                "age",
              ].includes(header.column.id);
              return (
                <th
                  key={header.id}
                  className={
                    (alignRight ? "text-right " : "text-left ") + "px-3 py-2"
                  }
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </>
    ),
    [table]
  );

  return (
    <div className="flex flex-col h-full items-stretch bg-neutral-900 rounded-md border border-neutral-800">
      <div className="text-center px-3 py-2 border-b border-neutral-800 text-neutral-200 text-sm font-semibold">
        {title}
      </div>
      <div className="relative flex-1 min-h-0">
        <TableVirtuoso
          style={{ height: "100%" }}
          data={tableRows}
          computeItemKey={(_, row) => row.original.id}
          endReached={() => onEndReached?.()}
          fixedHeaderContent={renderHeader}
          components={virtuosoComponents}
          itemContent={(_, row) => (
            <>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.column.id + row.original.id}
                  data-row-id={row.original.id}
                  className={
                    ([
                      "priceUsd",
                      "mcap",
                      "mcapPc",
                      "volumeUsd",
                      "chg5m",
                      "chg1h",
                      "chg6h",
                      "chg24h",
                      "age",
                    ].includes(cell.column.id)
                      ? "text-right "
                      : "text-left ") +
                    "px-3 py-2 border-b border-neutral-800 align-middle text-xs font-mono"
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </>
          )}
        />
        {isError ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-amber-300 bg-neutral-950/40 px-4 text-center">
            API request failed. In development, the API blocks cross‑domain
            requests. Use a CORS-bypass browser extension for
            https://api-rs.dexcelerate.com
          </div>
        ) : isLoading && rows.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400 bg-neutral-950/40">
            Loading...
          </div>
        ) : null}
      </div>
      {isFetchingMore ? (
        <div className="p-3 text-xs text-neutral-400">Loading more…</div>
      ) : null}
    </div>
  );
});

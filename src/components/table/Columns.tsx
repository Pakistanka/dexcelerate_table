import numeral from "numeral";
import type { ColumnDef } from "@tanstack/react-table";

import { TokenCell } from "./TokenCell";
import { AuditBadge } from "../AuditBadge";
import { formatCount, formatUsd } from "../../utils/formatUsd";
import { formatAge } from "../../utils/formatAge";

import type { ScannerTableRow } from "../ScannerTable";
import { getSlugByRouter } from "../../utils/dexMap";
import { ProtocolIcon } from "../icons/ProtocolIcon";
import FallbackIcon from "../icons/FallbackIcon";

export const scannerColumns: ColumnDef<ScannerTableRow>[] = [
        {
            id: "token",
            header: "Token & Chain",
            enableSorting: false,
            cell: TokenCell,
        },
        {
            id: "exchange",
            header: "Exchange",
            cell: ({ row }) => {
                const { exchange, chainId } = row.original;
                const protocolSlug = getSlugByRouter(chainId, exchange) ?? "";

                return (
                <div className="flex items-center justify-end gap-1">
                    {protocolSlug ? (
                        <ProtocolIcon
                            dex={protocolSlug}
                            size={16}
                            className="rounded-full"
                        />
                    ) : (
                        <FallbackIcon size={16} className="rounded-full" title={exchange} />
                    )}
                </div>
                );
            },
        },
        {
            id: "priceUsd",
            header: () => <div className="text-right">Price</div>,
            accessorKey: "priceUsd",
            enableSorting: false,
            cell: ({ row, getValue }) => {
                const flash = row.original.priceFlash;
                const flashAt = row.original.priceFlashAt ?? 0;
                const active = flash && Date.now() - flashAt < 800;
                const bg = active
                    ? flash === "up"
                    ? "bg-emerald-900/30"
                    : "bg-rose-900/30"
                    : "";
                return (
                    <div className={"text-right transition-colors duration-300 " + bg}>
                        {formatUsd(Number(getValue()))}
                    </div>
                );
            },
        },
        {
            id: "mcap",
            header: () => <div className="text-right">Marketcap</div>,
            accessorKey: "mcap",
            enableSorting: false,
            cell: ({ row }) => {
            const mcap = Number(row.original.mcap);
            const mcapPc = Number(row.original.mcapChangePc ?? 0);
            return (
                <div className="text-right">
                <div>{formatUsd(mcap)}</div>
                <div
                    className={`text-xs ${mcapPc >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                    {numeral(mcapPc).format("0.0a")}%
                </div>
                </div>
            );
            },
        },
                {
            id: "volumeUsd",
            header: () => <div className="text-right">Volume</div>,
            accessorKey: "volumeUsd",
            enableSorting: true,
            cell: ({ getValue }) => (
                <div className="text-right">{formatUsd(Number(getValue()))}</div>
            ),
        },
                {
            id: "chg5m",
            header: () => <div className="text-right">5m</div>,
            enableSorting: false,
            accessorFn: (r) => r.priceChangePcs["5m"],
            cell: ({ getValue }) => {
            const v = Number(getValue());
            return (
                <div
                    className={`text-right ${v >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                    {numeral(v).format("0.0a")}%
                </div>
            );
            },
        },
        {
            id: "chg1h",
            header: () => <div className="text-right">1h</div>,
            enableSorting: false,
            accessorFn: (r) => r.priceChangePcs["1h"],
            cell: ({ getValue }) => {
            const v = Number(getValue());
            return (
                <div
                    className={`text-right ${v >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                    {numeral(v).format("0.0a")}%
                </div>
            );
            },
        },
        {
            id: "chg6h",
            header: () => <div className="text-right">6h</div>,
            enableSorting: false,
            accessorFn: (r) => r.priceChangePcs["6h"],
            cell: ({ getValue }) => {
            const v = Number(getValue());
            return (
                <div
                    className={`text-right ${v >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                    {numeral(v).format("0.0a")}%
                </div>
            );
            },
        },
        {
            id: "chg24h",
            header: () => <div className="text-right">24h</div>,
            enableSorting: false,
            accessorFn: (r) => r.priceChangePcs["24h"],
            cell: ({ getValue }) => {
            const v = Number(getValue());
            return (
                <div
                    className={`text-right ${v >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                    {numeral(v).format("0.0a")}%
                </div>
            );
            },
        },
        {
            id: "age",
            header: () => <div className="text-right">Age</div>,
            enableSorting: true,
            accessorFn: (r) => r.tokenCreatedTimestamp.getTime(),
            cell: ({ row }) => (
                <div className="text-right text-neutral-400">
                    {formatAge(row.original.tokenCreatedTimestamp)}
                </div>
            ),
        },

        {
            id: "tx",
            header: () => <div className="text-right">Buys/Sells count</div>,
            enableSorting: false,
            accessorFn: (r) =>
            (r.transactions?.buys ?? 0) + (r.transactions?.sells ?? 0),
            cell: ({ row }) => {
                const buys = row.original.transactions?.buys ?? 0;
                const sells = row.original.transactions?.sells ?? 0;
                const total = buys + sells;
                return (
                    <div className="text-right">
                    <div className="font-semibold text-neutral-100">
                        {formatCount(total)}
                    </div>
                    <div className="text-xs">
                        <span className="text-emerald-400">{formatCount(buys)}</span>
                        <span className="mx-1 text-neutral-500">/</span>
                        <span className="text-rose-400">{formatCount(sells)}</span>
                    </div>
                    </div>
                );
            },
        },

        {
            id: "liq",
            header: () => <div className="text-right">Liquidity</div>,
            enableSorting: false,
            accessorFn: (r) => r.liquidity.current,
            cell: ({ row }) => {
                const cur = row.original.liquidity?.current ?? 0;
                const chg = row.original.liquidity?.changePc ?? 0;
                return (
                    <div className="text-right">
                    <div>{formatUsd(cur)}</div>
                    <div
                        className={`text-xs ${
                            chg >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                    >
                        {numeral(chg).format("0.0a")}%
                    </div>
                    </div>
                );
            },
        },
        {
            id: "audit",
            header: () => <div>Audit</div>,
            enableSorting: false,
            cell: ({ row }) => {
            const a = row.original.audit;
            return (
                    <div className="flex items-center">
                    <AuditBadge label="Verified" on={a.contractVerified} />
                    <AuditBadge label="Minted" on={a.mintable} />
                    <AuditBadge label="Freezable" on={a.freezable} />
                    <AuditBadge label="Honeypot" on={a.honeypot} />
                    </div>
                );
            },
        },
        {
            id: "socialmedio",
            header: () => <div>Social links</div>,
            enableSorting: false,
            cell: ({ row }) => {
                const a = row.original.audit;

                return (
                    <div className="flex items-center">
                    <AuditBadge label="Twitter" link={a.linkTwitter} />
                    <AuditBadge label="Website" link={a.linkWebsite} />
                    <AuditBadge label="Telegram" link={a.linkTelegram} />
                    <AuditBadge label="Discord" link={a.linkDiscord} />
                    </div>
                );
            },
        },
];

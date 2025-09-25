import numeral from "numeral";

export function formatUsd(n: number) {
  if (!Number.isFinite(n)) return "-";
  if (n >= 1_000_000_000) return `$${numeral(n).format("0.00a").toUpperCase()}`;
  if (n >= 10_000) return `$${numeral(n).format("0.0a").toUpperCase()}`;
  return `$${numeral(n).format("0,0.0000")}`;
}

export function formatCount(n: number) {
  if (!Number.isFinite(n)) return "-";
  if (n >= 1_000) return numeral(n).format("0.00a").toUpperCase();
  return numeral(n).format("0,0");
}

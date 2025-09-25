// ===== BASIC TYPES =====

export type SupportedChainName = "ETH" | "SOL" | "BASE" | "BSC";
export type SupportedChainId = "1" | "11155111" | "900" | "8453" | "56";

export type OrderBy = "asc" | "desc";
export type TimeFrame = "5M" | "1H" | "6H" | "24H";
export type SerdeRankBy =
  | "price5M"
  | "price1H"
  | "price6H"
  | "price24H"
  | "volume"
  | "txns"
  | "buys"
  | "sells"
  | "trending"
  | "age"
  | "liquidity"
  | "mcap"
  | "migration";

export interface GetScannerResultParams {
  chain?: null | SupportedChainName;
  orderBy?: OrderBy;
  rankBy?: SerdeRankBy;
  timeFrame?: TimeFrame;
  page?: number | null;
  isNotHP?: boolean | null;
  isVerified?: boolean | null;
  minVol24H?: number | null;
  maxVol24H?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  minLiq?: number | null;
  maxLiq?: number | null;
  minBuys24H?: number | null;
  minSells24H?: number | null;
  minTxns24H?: number | null;
  dexes?: string[] | null;
  virtualDexes?: string[] | null;
}


export interface ScannerResult {
  age: string;
  bundlerHoldings: string;
  buyFee?: number | null;
  buys?: number | null;
  callCount: number;
  chainId: number;
  contractRenounced: boolean;
  contractVerified: boolean;
  currentMcap: string;
  devHoldings: string;
  dexPaid: boolean;
  diff1H: string;
  diff24H: string;
  diff5M: string;
  diff6H: string;
  discordLink?: string | null;
  fdv: string;
  first1H: string;
  first24H: string;
  first5M: string;
  first6H: string;
  honeyPot?: boolean | null;
  initialMcap: string;
  insiderHoldings: string;
  insiders: number;
  isFreezeAuthDisabled: boolean;
  isMintAuthDisabled: boolean;
  liquidity: string;
  liquidityLocked: boolean;
  liquidityLockedAmount: string;
  liquidityLockedRatio: string;
  makers?: number | null;
  migratedFromVirtualRouter: null | string;
  virtualRouterType: null | string;
  migratedFromPairAddress?: null | string;
  migratedFromRouterAddress?: null | string;
  migrationProgress?: string | null;
  pairAddress: string;
  pairMcapUsd: string;
  pairMcapUsdInitial: string;
  percentChangeInLiquidity: string;
  percentChangeInMcap: string;
  price: string;
  reserves0: string;
  reserves0Usd: string;
  reserves1: string;
  reserves1Usd: string;
  routerAddress: string;
  sellFee?: number | null;
  sells?: number | null;
  sniperHoldings: string;
  snipers: number;
  telegramLink?: string | null;
  token0Decimals: number;
  token0Symbol: string;
  token1Address: string;
  token1Decimals: string;
  token1ImageUri?: string | null;
  token1Name: string;
  token1Symbol: string;
  token1TotalSupplyFormatted: string;
  top10Holdings: string;
  twitterLink?: string | null;
  txns?: number | null;
  volume: string;
  webLink?: string | null;
}

export interface ScannerApiResponse {
  pairs: ScannerResult[];
  totalRows: number;
}

export interface ScannerSubscriptionMessage {
  event: "scanner-filter";
  data: GetScannerResultParams;
}

export interface ScannerUnsubscriptionMessage {
  event: "unsubscribe-scanner-filter";
  data: GetScannerResultParams;
}

export interface PairSubscriptionMessage {
  event: "subscribe-pair";
  data: {
    pair: string;
    token: string;
    chain: string;
  };
}

export interface PairUnsubscriptionMessage {
  event: "unsubscribe-pair";
  data: {
    pair: string;
    token: string;
    chain: string;
  };
}

export interface PairStatsSubscriptionMessage {
  event: "subscribe-pair-stats";
  data: {
    pair: string;
    token: string;
    chain: string;
  };
}

export interface PairStatsUnsubscriptionMessage {
  event: "unsubscribe-pair-stats";
  data: {
    pair: string;
    token: string;
    chain: string;
  };
}

export type OutgoingWebSocketMessage =
  | ScannerSubscriptionMessage
  | ScannerUnsubscriptionMessage
  | PairSubscriptionMessage
  | PairUnsubscriptionMessage
  | PairStatsSubscriptionMessage
  | PairStatsUnsubscriptionMessage;

export interface WsTokenSwap {
  timestamp: string;
  addressTo: string;
  addressFrom: string;
  token0Address: string;
  amountToken0: string;
  amountToken1: string;
  priceToken0Usd: string;
  priceToken1Usd: string;
  tokenInAddress: string;
  isOutlier: boolean;
}

export interface PairSubscriptionPayload {
  pair: string;
  token: string;
  chain: SupportedChainName;
}

export interface TickEventPayload {
  pair: PairSubscriptionPayload;
  swaps: WsTokenSwap[];
}

export interface PairStatsMsgData {
  pair: ScannerPairDetails;
  pairStats: TimeframesPairStats;
  migrationProgress: string;
  callCount: number;
}

export interface ScannerPairDetails {
  token1SniperWalletToTotalSupplyRatio: string;
  token1BundlerWalletToTotalSupplyRatio: string;
  traders: number;
  bundlers: number;
  bundlerHoldings?: string | null;
  burnedAmount?: string;
  burnedSupply: string;
  chain: SupportedChainName;
  devHoldings?: string | null;
  dexPaid: boolean;
  fdv: string;
  freezeAuthorityRenounced: boolean;
  insiderHoldings?: string | null;
  insiders: number;
  isMigrating?: boolean | null;
  isVerified: boolean;
  linkDiscord?: string | null;
  linkTelegram?: string | null;
  linkTwitter?: string | null;
  linkWebsite?: string | null;
  lockedAmount?: string;
  migratedFromPairAddress?: null | string;
  migratedFromRouterAddress?: null | string;
  migratedToPairAddress?: null | string;
  migratedFromVirtualRouter: null | string;
  virtualRouterType: null | string;
  mintAuthorityRenounced: boolean;
  pairAddress: string;
  pairCreatedAt: string;
  pairMarketcapUsd: string;
  pairMarketcapUsdInitial?: string;
  pairPrice0Usd: string;
  pairPrice1Usd: string;
  pairReserves0: string;
  pairReserves0Usd: string;
  pairReserves1: string;
  pairReserves1Usd: string;
  pairTotalSupply: string;
  renounced: boolean;
  routerAddress: string;
  routerType: string;
  sniperHoldings?: string | null;
  snipers: number;
  token0Address: string;
  token0Decimals: number;
  token0Symbol: string;
  token1Address: string;
  token1BuyFee?: number | null;
  token1Decimals: number;
  token1DevWalletToTotalSupplyRatio?: string;
  token1ImageUri?: string | null;
  token1IsHoneypot?: boolean | null;
  token1IsProxy: boolean;
  token1MaxTransaction?: string;
  token1MaxTransactionToTotalSupplyRatio?: string;
  token1MaxWallet?: string;
  token1MaxWalletToTotalSupplyRatio?: string;
  token1Name: string;
  token1SellFee?: number | null;
  token1Symbol: string;
  token1TotalSupply: string;
  token1TotalSupplyFormatted: string;
  token1TransferFee?: number | null;
  top10Holdings?: string | null;
  totalLockedRatio?: string;
}
export interface TimeframesPairStats {
  fiveMin: TimeFramePairStatsRef;
  oneHour: TimeFramePairStatsRef;
  sixHour: TimeFramePairStatsRef;
  twentyFourHour: TimeFramePairStatsRef;
}

export interface TimeFramePairStatsRef {
  buyVolume: string;
  buyers: number;
  buys: number;
  change: string;
  diff: string;
  first: string;
  last: string;
  makers: number;
  sellVolume: string;
  sellers: number;
  sells: number;
  txns: number;
  volume: string;
}

export interface ScannerPairsEventPayload {
  filter: GetScannerResultParams;
  results: {
    pairs: ScannerResult[];
  };
}

export type IncomingWebSocketMessage =
  | { event: "tick"; data: TickEventPayload }
  | { event: "pair-stats"; data: PairStatsMsgData }
  | { event: "scanner-pairs"; data: ScannerPairsEventPayload };

export function chainIdToName(chainId: number): SupportedChainName {
  switch (chainId.toString()) {
    case "1":
      return "ETH";
    case "56":
      return "BSC";
    case "8453":
      return "BASE";
    case "900":
      return "SOL";
    default:
      return "ETH";
  }
}

export const TRENDING_TOKENS_FILTERS: GetScannerResultParams = {
  rankBy: "volume",
  orderBy: "desc",
  minVol24H: 1000,
  isNotHP: true,
  maxAge: 7 * 24 * 60 * 60,
};

export const NEW_TOKENS_FILTERS: GetScannerResultParams = {
  rankBy: "age",
  orderBy: "desc",
  maxAge: 24 * 60 * 60,
  isNotHP: true,
};

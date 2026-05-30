export type Segment = "Enterprise" | "Mid-market" | "SMB";

export type Region = "North America" | "EMEA" | "APAC" | "LATAM";

export type DashboardFilters = {
  segment: Segment | "All";
  region: Region | "All";
  period: "30d" | "90d" | "12m";
};

export type RevenuePoint = {
  month: string;
  revenue: number;
  target: number;
  margin: number;
};

export type SegmentPerformance = {
  segment: Segment;
  pipeline: number;
  winRate: number;
  cycleDays: number;
  revenue: number;
};

export type AccountRow = {
  id: string;
  account: string;
  region: Region;
  segment: Segment;
  owner: string;
  revenue: number;
  health: "Strong" | "Watch" | "At risk";
  renewalDate: string;
};

export type DashboardData = {
  revenueSeries: RevenuePoint[];
  segmentPerformance: SegmentPerformance[];
  accounts: AccountRow[];
  healthMix: Array<{ health: string; count: number; share: number }>;
  kpis: {
    revenue: number;
    growth: number;
    attainment: number;
    weightedWinRate: number;
  };
  updatedAt: string;
};

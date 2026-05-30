import type { AccountRow, Region, RevenuePoint, SegmentPerformance } from "@/types/analytics";

export const regions: Region[] = ["North America", "EMEA", "APAC", "LATAM"];

export const revenueSeries: RevenuePoint[] = [
  { month: "Jan", revenue: 1_850_000, target: 1_700_000, margin: 0.31 },
  { month: "Feb", revenue: 1_960_000, target: 1_820_000, margin: 0.32 },
  { month: "Mar", revenue: 2_120_000, target: 1_960_000, margin: 0.34 },
  { month: "Apr", revenue: 2_050_000, target: 2_040_000, margin: 0.33 },
  { month: "May", revenue: 2_340_000, target: 2_150_000, margin: 0.35 },
  { month: "Jun", revenue: 2_520_000, target: 2_280_000, margin: 0.36 },
  { month: "Jul", revenue: 2_670_000, target: 2_410_000, margin: 0.37 },
  { month: "Aug", revenue: 2_760_000, target: 2_530_000, margin: 0.36 },
  { month: "Sep", revenue: 2_910_000, target: 2_680_000, margin: 0.38 },
  { month: "Oct", revenue: 3_080_000, target: 2_840_000, margin: 0.39 },
  { month: "Nov", revenue: 3_160_000, target: 2_990_000, margin: 0.4 },
  { month: "Dec", revenue: 3_420_000, target: 3_150_000, margin: 0.41 }
];

export const segmentPerformance: SegmentPerformance[] = [
  { segment: "Enterprise", pipeline: 12_400_000, winRate: 0.34, cycleDays: 72, revenue: 16_200_000 },
  { segment: "Mid-market", pipeline: 8_900_000, winRate: 0.41, cycleDays: 48, revenue: 10_700_000 },
  { segment: "SMB", pipeline: 4_200_000, winRate: 0.46, cycleDays: 29, revenue: 5_300_000 }
];

export const accountRows: AccountRow[] = [
  {
    id: "acct_001",
    account: "Northstar Health",
    region: "North America",
    segment: "Enterprise",
    owner: "Avery Chen",
    revenue: 1_420_000,
    health: "Strong",
    renewalDate: "2026-09-30"
  },
  {
    id: "acct_002",
    account: "Meridian Capital",
    region: "EMEA",
    segment: "Enterprise",
    owner: "Sam Rivera",
    revenue: 980_000,
    health: "Watch",
    renewalDate: "2026-08-15"
  },
  {
    id: "acct_003",
    account: "Atlas Retail Group",
    region: "APAC",
    segment: "Mid-market",
    owner: "Jordan Lee",
    revenue: 640_000,
    health: "Strong",
    renewalDate: "2026-11-01"
  },
  {
    id: "acct_004",
    account: "CivicWorks",
    region: "North America",
    segment: "SMB",
    owner: "Morgan Patel",
    revenue: 210_000,
    health: "At risk",
    renewalDate: "2026-07-20"
  },
  {
    id: "acct_005",
    account: "Helio Manufacturing",
    region: "LATAM",
    segment: "Mid-market",
    owner: "Taylor Brooks",
    revenue: 510_000,
    health: "Watch",
    renewalDate: "2026-10-12"
  }
];

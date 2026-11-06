export interface Pub {
  y: number | null;
  m: number | null;
  d: number | null;
  name: string;
  town: string;
  county: string;
  address: string;
  type: string;
  closed: boolean;
  note: string;
}

export interface CountyPoint {
  county: string;
  lat: number;
  lon: number;
  count: number;
}

export interface CountEntry {
  key: string | number;
  count: number;
}

export interface Stats {
  totalVisits: number;
  totalClosed: number;
  totalStillOpen: number;
  distinctPubNames: number;
  distinctTowns: number;
  distinctCounties: number;
  byYear: { year: number; count: number }[];
  byDecade: { decade: number; count: number }[];
  byType: CountEntry[];
  mostCommonNames: CountEntry[];
  mostVisitedTowns: CountEntry[];
  firstVisit: (Pub & { stamp: number }) | null;
  lastVisit: (Pub & { stamp: number }) | null;
  busiestDay: { y: number; m: number; d: number; count: number } | null;
  longestPubName: string;
}

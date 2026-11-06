import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Pub, CountyPoint, Stats } from "../types";

interface PubsContextValue {
  pubs: Pub[];
  counties: CountyPoint[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

const PubsContext = createContext<PubsContextValue>({
  pubs: [],
  counties: [],
  stats: null,
  loading: true,
  error: null,
});

export function PubsProvider({ children }: { children: ReactNode }) {
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [counties, setCounties] = useState<CountyPoint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const base = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${base}data/pubs.json`).then((r) => r.json()),
      fetch(`${base}data/counties.json`).then((r) => r.json()),
      fetch(`${base}data/stats.json`).then((r) => r.json()),
    ])
      .then(([pubsData, countiesData, statsData]) => {
        if (cancelled) return;
        setPubs(pubsData);
        setCounties(countiesData);
        setStats(statsData);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PubsContext.Provider value={{ pubs, counties, stats, loading, error }}>
      {children}
    </PubsContext.Provider>
  );
}

export function usePubs() {
  return useContext(PubsContext);
}

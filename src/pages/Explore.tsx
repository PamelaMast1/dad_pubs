import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePubs } from "../context/PubsContext";
import { formatDate } from "../lib/formatDate";

const PAGE_SIZE = 100;
const TYPES = ["Pub", "Hotel", "Club", "Bar", "Wine Bar", "Other"];

export default function Explore() {
  const { pubs, counties, stats, loading } = usePubs();
  const [params, setParams] = useSearchParams();
  const [visible, setVisible] = useState(PAGE_SIZE);

  const q = params.get("q") ?? "";
  const county = params.get("county") ?? "";
  const decade = params.get("decade") ?? "";
  const year = params.get("year") ?? "";
  const type = params.get("type") ?? "";
  const status = params.get("status") ?? "";

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
    setVisible(PAGE_SIZE);
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return pubs.filter((p) => {
      if (needle) {
        const haystack = `${p.name} ${p.town} ${p.address}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (county && p.county !== county) return false;
      if (decade && (!p.y || Math.floor(p.y / 10) * 10 !== Number(decade))) return false;
      if (year && p.y !== Number(year)) return false;
      if (type && p.type !== type) return false;
      if (status === "closed" && !p.closed) return false;
      if (status === "open" && p.closed) return false;
      return true;
    });
  }, [pubs, q, county, decade, year, type, status]);

  const countyOptions = useMemo(
    () => [...counties].sort((a, b) => a.county.localeCompare(b.county)),
    [counties]
  );
  const decadeOptions = stats?.byDecade.map((d) => d.decade) ?? [];

  if (loading) return <div className="loading-screen">Pulling pints of data…</div>;

  return (
    <div className="container">
      <p className="eyebrow">Explore</p>
      <h1>Every pub, searchable</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: 640 }}>
        {filtered.length.toLocaleString()} of {pubs.length.toLocaleString()} visits match your filters.
        {year && (
          <>
            {" "}Showing {year} only.{" "}
            <button className="btn secondary" style={{ padding: "2px 12px" }} onClick={() => updateParam("year", "")}>
              Clear year
            </button>
          </>
        )}
      </p>

      <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search name, town or street…"
          value={q}
          onChange={(e) => updateParam("q", e.target.value)}
          style={{ flex: "1 1 240px", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)" }}
        />
        <select value={county} onChange={(e) => updateParam("county", e.target.value)}>
          <option value="">All counties</option>
          {countyOptions.map((c) => (
            <option key={c.county} value={c.county}>
              {c.county} ({c.count.toLocaleString()})
            </option>
          ))}
        </select>
        <select value={decade} onChange={(e) => updateParam("decade", e.target.value)}>
          <option value="">All decades</option>
          {decadeOptions.map((d) => (
            <option key={d} value={d}>
              {d}s
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => updateParam("type", e.target.value)}>
          <option value="">All types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => updateParam("status", e.target.value)}>
          <option value="">Open & closed</option>
          <option value="open">Still open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Pub</th>
              <th>Town</th>
              <th>County</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, visible).map((p, i) => (
              <tr key={i}>
                <td>{formatDate(p)}</td>
                <td>
                  {p.name}
                  {p.address && (
                    <div style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>{p.address}</div>
                  )}
                </td>
                <td>{p.town}</td>
                <td>{p.county}</td>
                <td>{p.type}</td>
                <td>
                  {p.closed ? (
                    <span className="pill closed">Closed</span>
                  ) : p.note ? (
                    <span className="pill" title={p.note}>
                      note
                    </span>
                  ) : (
                    <span className="pill">open</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible < filtered.length && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button className="btn" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Show {Math.min(PAGE_SIZE, filtered.length - visible)} more
          </button>
        </div>
      )}
    </div>
  );
}

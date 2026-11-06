import { usePubs } from "../context/PubsContext";
import { formatDate } from "../lib/formatDate";
import Tbc from "../components/Tbc";

export default function Facts() {
  const { stats, loading } = usePubs();
  if (loading || !stats) return <div className="loading-screen">Pulling pints of data…</div>;

  return (
    <div className="container">
      <p className="eyebrow">Fun Facts</p>
      <h1>What the records show</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: 680, marginBottom: 24 }}>
        Everything below is computed straight from the visit log &mdash; no embellishment needed.
      </p>

      <div className="stat-grid" style={{ marginBottom: 28 }}>
        <div className="stat-tile">
          <span className="num">{stats.totalVisits.toLocaleString()}</span>
          <span className="label">Pubs visited</span>
        </div>
        <div className="stat-tile">
          <span className="num">{stats.distinctPubNames.toLocaleString()}</span>
          <span className="label">Distinct pub names</span>
        </div>
        <div className="stat-tile">
          <span className="num">{stats.distinctTowns.toLocaleString()}</span>
          <span className="label">Towns visited</span>
        </div>
        <div className="stat-tile">
          <span className="num">{stats.distinctCounties.toLocaleString()}</span>
          <span className="label">Counties covered</span>
        </div>
        <div className="stat-tile">
          <span className="num">{stats.totalClosed.toLocaleString()}</span>
          <span className="label">Since closed</span>
        </div>
        <div className="stat-tile">
          <span className="num">{((stats.totalStillOpen / stats.totalVisits) * 100).toFixed(1)}%</span>
          <span className="label">Still open</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 28 }}>
        <div className="card">
          <h3>First on record</h3>
          {stats.firstVisit && (
            <p>
              <strong>{stats.firstVisit.name}</strong>, {stats.firstVisit.town} &mdash;{" "}
              {formatDate(stats.firstVisit)}
            </p>
          )}
        </div>
        <div className="card">
          <h3>Most recent on record</h3>
          {stats.lastVisit && (
            <p>
              <strong>{stats.lastVisit.name}</strong>, {stats.lastVisit.town} &mdash;{" "}
              {formatDate(stats.lastVisit)}
            </p>
          )}
        </div>
        <div className="card">
          <h3>Busiest single day</h3>
          {stats.busiestDay && (
            <p>
              <strong>{stats.busiestDay.count} pubs</strong> in one day ({formatDate(stats.busiestDay)})
            </p>
          )}
        </div>
        <div className="card">
          <h3>Longest pub name</h3>
          <p>
            <strong>{stats.longestPubName}</strong>
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 28 }}>
        <div className="card">
          <h3>Most visited pub names</h3>
          <ol>
            {stats.mostCommonNames.slice(0, 10).map((n) => (
              <li key={n.key}>
                {n.key} <span style={{ color: "var(--ink-soft)" }}>&times;{n.count}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="card">
          <h3>Most visited towns</h3>
          <ol>
            {stats.mostVisitedTowns.slice(0, 10).map((t) => (
              <li key={t.key}>
                {t.key} <span style={{ color: "var(--ink-soft)" }}>&times;{t.count}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="card">
          <h3>By venue type</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {stats.byType.map((t) => (
              <li key={t.key} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span>{t.key}</span>
                <strong>{t.count.toLocaleString()}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Tbc title="The Guinness World Record itself">
        <p style={{ marginBottom: 0 }}>
          Exact record title, number recognised, and date awarded go here once confirmed &mdash;
          e.g. "Guinness World Record for [record title], recognised [date], with [N] pubs
          visited." Drop the official wording in and this box disappears.
        </p>
      </Tbc>

      <div style={{ height: 20 }} />

      <Tbc title="Dad's own fun facts">
        <p style={{ marginBottom: 0 }}>
          Space for the stuff only he'd know: his go-to drink, the pub he'd return to again and
          again, a favourite story from the road, how the habit started, what he says when people
          don't believe the number. Give me a few lines on any of these and I'll turn them into
          proper cards here.
        </p>
      </Tbc>
    </div>
  );
}

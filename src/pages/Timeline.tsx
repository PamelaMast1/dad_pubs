import { Link } from "react-router-dom";
import { usePubs } from "../context/PubsContext";
import "./Timeline.css";

export default function Timeline() {
  const { stats, loading } = usePubs();
  if (loading || !stats) return <div className="loading-screen">Pulling pints of data…</div>;

  const maxDecade = Math.max(...stats.byDecade.map((d) => d.count));
  const maxYear = Math.max(...stats.byYear.map((y) => y.count));

  return (
    <div className="container">
      <p className="eyebrow">Timeline</p>
      <h1>Six decades of drinking in the sights</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: 640, marginBottom: 24 }}>
        The record spans {stats.byYear[0].year}&ndash;{stats.byYear[stats.byYear.length - 1].year}.
        Click any bar to see that period in Explore.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3>By decade</h3>
        <div className="bar-row">
          {stats.byDecade.map((d) => (
            <Link key={d.decade} to={`/explore?decade=${d.decade}`} className="bar-col" title={`${d.count.toLocaleString()} visits`}>
              <div className="bar decade-bar" style={{ height: `${(d.count / maxDecade) * 100}%` }} />
              <span className="bar-label">{d.decade}s</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>By year</h3>
        <div className="bar-row year-row">
          {stats.byYear.map((y) => (
            <Link key={y.year} to={`/explore?year=${y.year}`} className="bar-col" title={`${y.year}: ${y.count.toLocaleString()} visits`}>
              <div className="bar year-bar" style={{ height: `${Math.max((y.count / maxYear) * 100, 2)}%` }} />
              {y.year % 5 === 0 && <span className="bar-label small">{y.year}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

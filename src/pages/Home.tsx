import { Link } from "react-router-dom";
import { useMemo } from "react";
import { usePubs } from "../context/PubsContext";
import { formatDate } from "../lib/formatDate";
import Tbc from "../components/Tbc";

const explorers = [
  { to: "/explore", title: "Explore", desc: "Search and filter all 44,000+ visits.", emoji: "🔎" },
  { to: "/map", title: "Map", desc: "Where in the country he's been drinking.", emoji: "🗺️" },
  { to: "/timeline", title: "Timeline", desc: "Six decades, bar by bar.", emoji: "📈" },
  { to: "/facts", title: "Fun Facts", desc: "The numbers worth bragging about.", emoji: "🎉" },
  { to: "/photos", title: "Photos", desc: "Pictures from the road.", emoji: "📷" },
  { to: "/about", title: "About Dad", desc: "The man behind the record.", emoji: "👤" },
];

export default function Home() {
  const { pubs, stats, loading } = usePubs();

  const onThisDay = useMemo(() => {
    if (!pubs.length) return [];
    const today = new Date();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    return pubs.filter((p) => p.m === m && p.d === d);
  }, [pubs]);

  return (
    <div className="container">
      <section style={{ textAlign: "center", padding: "20px 0 40px" }}>
        <p className="eyebrow">Guinness World Record holder</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.6rem)" }}>
          {stats ? stats.totalVisits.toLocaleString() : "…"} pubs.
          <br />
          Six decades. One man.
        </h1>
        <p style={{ maxWidth: 560, margin: "0 auto 20px", color: "var(--ink-soft)" }}>
          My dad has visited more pubs than any human being on record. This site is the whole
          log &mdash; every pub, every town, every closing-time story waiting to be found.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/explore" className="btn">Start exploring</Link>
          <Link to="/facts" className="btn secondary">See the fun facts</Link>
        </div>
      </section>

      {!loading && stats && (
        <div className="stat-grid" style={{ marginBottom: 40 }}>
          <div className="stat-tile">
            <span className="num">{stats.totalVisits.toLocaleString()}</span>
            <span className="label">Pubs visited</span>
          </div>
          <div className="stat-tile">
            <span className="num">{stats.distinctCounties}</span>
            <span className="label">Counties</span>
          </div>
          <div className="stat-tile">
            <span className="num">{stats.distinctTowns.toLocaleString()}</span>
            <span className="label">Towns</span>
          </div>
          <div className="stat-tile">
            <span className="num">{stats.byYear[stats.byYear.length - 1].year - stats.byYear[0].year}</span>
            <span className="label">Years on the road</span>
          </div>
        </div>
      )}

      <section style={{ marginBottom: 40 }}>
        <h2>On this day</h2>
        {loading ? (
          <p style={{ color: "var(--ink-soft)" }}>Loading…</p>
        ) : onThisDay.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>No recorded visits fall on today's date &mdash; check back tomorrow.</p>
        ) : (
          <div className="card">
            <p style={{ color: "var(--ink-soft)", marginBottom: 12 }}>
              {onThisDay.length} visit{onThisDay.length > 1 ? "s" : ""} logged on this calendar date over the years:
            </p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {onThisDay.slice(0, 8).map((p, i) => (
                <li key={i}>
                  <strong>{p.name}</strong>, {p.town} &mdash; {formatDate(p)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h2>Ways in</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {explorers.map((e) => (
            <Link key={e.to} to={e.to} className="card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{e.emoji}</div>
              <h3 style={{ marginBottom: 4 }}>{e.title}</h3>
              <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "0.9rem" }}>{e.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <div style={{ height: 32 }} />

      <Tbc title="The record itself">
        Exact Guinness World Record title, award date and citation go here &mdash; happy to drop
        it straight into the hero above once you've got the wording.
      </Tbc>
    </div>
  );
}

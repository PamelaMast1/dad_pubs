import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { usePubs } from "../context/PubsContext";

export default function MapPage() {
  const { counties, loading } = usePubs();

  if (loading) return <div className="loading-screen">Pulling pints of data…</div>;

  const maxCount = Math.max(...counties.map((c) => c.count), 1);

  return (
    <div className="container">
      <p className="eyebrow">Map</p>
      <h1>Where in the country</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: 640, marginBottom: 20 }}>
        Each circle is a county &mdash; bigger means more visits logged there. Click one to see the
        pubs. ({counties.length} counties plotted; a handful of mis-typed county labels in the
        original records aren't mapped here but still show up in Explore.)
      </p>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <MapContainer center={[54.0, -3.0]} zoom={6} style={{ height: "620px", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {counties.map((c) => {
            const radius = 4 + Math.sqrt(c.count / maxCount) * 32;
            return (
              <CircleMarker
                key={c.county}
                center={[c.lat, c.lon]}
                radius={radius}
                pathOptions={{ color: "#8c5a0f", fillColor: "#c47f17", fillOpacity: 0.55, weight: 1 }}
              >
                <Popup>
                  <strong>{c.county}</strong>
                  <br />
                  {c.count.toLocaleString()} visits
                  <br />
                  <Link to={`/explore?county=${encodeURIComponent(c.county)}`}>See them all &rarr;</Link>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

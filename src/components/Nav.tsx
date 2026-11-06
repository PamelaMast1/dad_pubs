import { NavLink } from "react-router-dom";
import "./Nav.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/map", label: "Map" },
  { to: "/timeline", label: "Timeline" },
  { to: "/facts", label: "Fun Facts" },
  { to: "/photos", label: "Photos" },
  { to: "/about", label: "About Dad" },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="brand">
          🍺 The Pub Odyssey
        </NavLink>
        <nav className="links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "active" : "")}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

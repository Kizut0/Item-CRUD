import { Link, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserProvider";

function initialsFromEmail(email) {
  if (!email) return "U";
  const name = email.split("@")[0] || "";
  const parts = name.split(/[._-]+/).filter(Boolean);
  const first = parts[0]?.[0] || name[0] || "U";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase();
}

export default function Layout() {
  const { user } = useUser();
  const location = useLocation();
  const initials = initialsFromEmail(user.email);
  const activePath = location.pathname;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <span>Inventory Portal</span>
        </div>
        <nav className="nav-links">
          <Link className={activePath.startsWith("/items") ? "active" : ""} to="/items">
            Items
          </Link>
          <Link className={activePath.startsWith("/users") ? "active" : ""} to="/users">
            Users
          </Link>
        </nav>
        <div className="profile-zone">
          <Link to="/profile" className="profile-chip">
            <span className="avatar">{initials}</span>
            <span className="profile-text">{user.email || "Profile"}</span>
          </Link>
          <Link to="/logout" className="ghost">
            Logout
          </Link>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

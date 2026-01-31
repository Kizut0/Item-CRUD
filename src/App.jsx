import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
      <h2>Item CRUD</h2>
      <nav style={{ marginBottom: 12 }}>
        <Link to="/items">Items</Link>
      </nav>
      <Outlet />
    </div>
  );
}

import { NavLink, Outlet } from "react-router-dom";

import "../styles/AdminLayout.css";
const AdminLayout = ({ user, onLogout }) => {

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: "240px",
          background: "#111",
          color: "#fff",
          padding: "20px"
        }}
      >
        <h2>TechMart Admin</h2>
        <p style={{ fontSize: "14px", opacity: 0.8 }}>
          {user?.email}
        </p>

        <nav style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <NavLink to="dashboard" style={linkStyle}>Dashboard</NavLink>
          <NavLink to="products" style={linkStyle}>Add Products</NavLink>
          <NavLink to="orders" style={linkStyle}>Orders</NavLink>
          <NavLink to="users" style={linkStyle}>Users</NavLink>
        </nav>
      </aside>
      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
};
const linkStyle = ({ isActive }) => ({
  color: isActive ? "#00eaff" : "#fff",
  textDecoration: "none",
  fontWeight: isActive ? "bold" : "normal"
});

export default AdminLayout;

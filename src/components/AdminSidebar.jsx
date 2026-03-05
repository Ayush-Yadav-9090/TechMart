import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h2>TechMart Admin</h2>

      <NavLink to="/admin" end>
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      <NavLink to="/admin/products">
        <Package size={18} /> Products
      </NavLink>

      <NavLink to="/admin/orders">
        <ShoppingCart size={18} /> Orders
      </NavLink>

      <NavLink to="/admin/users">
        <Users size={18} /> Users
      </NavLink>
    </aside>
  );
};

export default AdminSidebar;

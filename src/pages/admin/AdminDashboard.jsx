import React, { useState, useEffect } from "react";
import { adminAPI, handleApiError } from "../../services/api";
import "../../Styles/AdminDashboard.css";
import { useAuth } from "../../services/AuthContext";
import AdminReviews from "./AdminReviews";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  // const [activeTab, setActiveTab] = useState("products");

  const { logout } = useAuth();


  const [stats, setStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // ================= DASHBOARD STATS =================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await adminAPI.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        setStatsError(handleApiError(err));
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ================= FETCH FUNCTIONS =================
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await adminAPI.getAllUsers();
      setUsers(res.data.results || res.data);
    } catch (err) {
      setUsersError(handleApiError(err));
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await adminAPI.getAllOrders();
      setOrders(res.data.results || res.data);
    } catch (err) {
      setOrdersError(handleApiError(err));
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await adminAPI.getAllProducts();
      setProducts(res.data.results || res.data);
    } catch (err) {
      setProductsError(handleApiError(err));
    } finally {
      setProductsLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "users") fetchUsers();
    if (tab === "orders") fetchOrders();
    if (tab === "products") fetchProducts();
  };

  return (
    <div className="admin-dashboard">
      

      <div className="admin-toolbar">
        <div className="admin-tabs">
        

          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => handleTabClick("products")}
          >
            View Products
          </button>

          <button
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews & Feedback
          </button>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>




      <main className="admin-content">
        {/* STATS */}
        {activeTab === "stats" && (
          <div className="stats-tab">
            <h2>Admin Dashboard</h2>
            {statsLoading ? <p>Loading...</p> :
              statsError ? <p>Error: {statsError}</p> :
                <div className="stats-cards">
                  <div className="card">Revenue: ₹{stats.revenue || 0}</div>
                  <div className="card">Orders: {stats.orders || 0}</div>
                  <div className="card">Products: {stats.products || 0}</div>
                  <div className="card">Customers: {stats.customers || 0}</div>
                </div>
            }
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && <AdminUsers />}

        {/* ORDERS */}
        {activeTab === "orders" && <AdminOrders />}

        {activeTab === "reviews" && <AdminReviews />}


        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="products-tab">
            <h2 >Added Products</h2>
            {productsLoading ? <p>Loading...</p> :
              productsError ? <p>Error: {productsError}</p> :
                <table>
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th></tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>₹{p.price}</td>
                        <td>{p.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

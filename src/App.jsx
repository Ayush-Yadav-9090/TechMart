import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

/* ===================== CONTEXT ===================== */
import { useAuth } from "./services/AuthContext";

/* ===================== COMPONENTS ===================== */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* ===================== API ===================== */
import { cartAPI } from "./services/api";

/* ===================== PAGES ===================== */
import Home from "./pages/Home";
import Collections from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import AIRecommendation from "./pages/AIRecommendation";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";

/* ===================== ADMIN ===================== */
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  /* ===================== AUTH ===================== */
  const { user, loading, logout } = useAuth();
  const isAuthenticated = !!user;

  /* ===================== APP STATE ===================== */
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /* ===================== LOAD CART ===================== */
  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem("accessToken");

    if (user && token) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user, loading]);


  const fetchCart = async () => {
    try {
      const res = await cartAPI.get();

      const items = res?.data?.items || [];

      const normalized = items.map((item) => ({
        ...item.product_details,
        quantity: item.quantity,
      }));

      setCart(normalized);
    } catch (err) {
      console.warn("Cart fetch skipped:", err?.response?.status);
      setCart([]); // never crash UI
    }
  };



  const addToCart = (product, cartImage, qty = 1) => {

    const image =
      cartImage ||
      product.main_image ||
      product.images?.[0]?.image ||
      "/placeholder.png";

    setCart(prev => {
      const exists = prev.find(
        item => item.id === product.id && item.cart_image === cartImage
      );

      if (exists) {
        return prev.map(item =>
          item.id === product.id && item.cart_image === cartImage
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          cart_image: cartImage,
          category: product.category,
          brand: product.brand
        }
      ];
    });
  };




  const removeFromCart = async (productId, cartImage) => {
    setCart(prev =>
      prev.filter(
        p => !(p.id === productId && p.cart_image === cartImage)
      )
    );

    if (isAuthenticated) {
      await cartAPI.removeItem(productId);
    }
  };

  const updateCartQuantity = (productId, cartImage, quantity) => {
    setCart(prev =>
      prev.map(p =>
        p.id === productId && p.cart_image === cartImage
          ? { ...p, quantity }
          : p
      )
    );
  };


  /* ===================== LOADING ===================== */
  if (loading) return null;

  /* ===================== RENDER ===================== */
  return (
    <>
      <Navbar
        cart={cart}
        cartCount={cart.reduce((t, i) => t + i.quantity, 0)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
      />

      <Routes>
        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />

        <Route
          path="/collections"
          element={
            <Collections
              products={products}
              addToCart={addToCart}
              searchQuery={searchQuery}
            />
          }
        />

        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/ai-recommendation" element={<AIRecommendation addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              updateQuantity={updateCartQuantity}
              removeItem={removeFromCart}
            />
          }
        />

        {/* ---------- AUTH ---------- */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" replace />}
        />

        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* ---------- ADMIN ---------- */}
        <Route
          path="/admin/*"
          element={
            !loading && user?.is_staff ? (
              <AdminLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route
            path="products"
            element={<AdminProducts products={products} setProducts={setProducts} />}
          />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers users={users} />} />
        </Route>
      </Routes>



      
      <Footer />
    </>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, LogOut, Sparkles, Shield } from "lucide-react";
import "../styles/Navbar.css";
import { useAuth } from "../services/AuthContext";

const Navbar = ({ cart, cartCount, searchQuery, setSearchQuery }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //  Update auth state whenever user changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsCartOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/collections");
      closeAllMenus();
    }
  };


const getCartImage = (item) => {
  const image = item.cart_image;
  console.log(image)

  if (!image) return "/placeholder.png";

  // absolute URL
  if (image.startsWith("http")) return image;

  // relative media path
  if (image.startsWith("/")) {
    return `http://localhost:8000${image}`;
  }

  return image;
 
};


  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeAllMenus}>
          <div className="logo-icon">⚡</div>
          <span className="logo-text">TechMart</span>
        </Link>

        {/* Navigation */}
        <ul className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={closeAllMenus}>Home</Link></li>
          <li><Link to="/collections" onClick={closeAllMenus}>Collections</Link></li>
          <li>
            <Link to="/ai-recommendation" className="ai-link" onClick={closeAllMenus}>
              <Sparkles size={16} /> AI Picks
            </Link>
          </li>
          <li><Link to="/contact" onClick={closeAllMenus}>Contact</Link></li>
          <li><Link to="/feedback" onClick={closeAllMenus}>Feedback</Link></li>
        </ul>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <Search size={20} />
          </button>
        </form>

        {/* Right Icons */}
        <div className="navbar-icons">
          {/* Cart */}
          <div className="cart-wrapper">
            <button onClick={() => setIsCartOpen(p => !p)}>
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {isCartOpen && (
              <div className="cart-dropdown">
                {cart.length === 0 ? (
                  <p>Your cart is empty</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={`${item.id}-${item.cart_image}`}
                        className="cart-item-mini">
                        <img
                          src={getCartImage(item)}
                          alt={item.name}
                          className="cart-item-image"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />

                        <div className="cart-item-info">
                          <p className="cart-item-name">{item.name}</p>
                          <p className="cart-item-price">
                            {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Link to="/cart" onClick={closeAllMenus}>
                      View Cart
                    </Link>
                  </>
                )}
              </div>
            )}

          </div>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="user-menu">
              <button onClick={() => setIsUserMenuOpen(p => !p)}>
                <User size={24} />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p>{user.email}</p>
                  </div>

                  {user.is_staff && (
                    <button
                      className="admin-link"
                      onClick={() => {
                        navigate("/admin/dashboard");
                        closeAllMenus();
                      }}
                    >
                      <Shield size={16} /> Admin Dashboard
                    </button>
                  )}

                  <button
                    className="logout-button"
                    onClick={() => {
                      logout();
                      closeAllMenus();
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button">Login</Link>
          )}

          {/* Mobile Toggle */}
          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(p => !p)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

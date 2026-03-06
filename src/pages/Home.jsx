import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp, Star } from "lucide-react";

import AIAnalyzing from "../components/AIAnalyzing";
import ProductCard from "../components/ProductCard";
import { productsAPI, handleApiError } from "../services/api";

import "../Styles/Home.css";

/**
 * Home Component
 * -----------------------
 * Landing page of TechMart
 */
const Home = ({ addToCart, searchQuery }) => {
  /* ===================== STATE ===================== */
  const [latestProducts, setLatestProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [latestRes, trendingRes, bestsellerRes] = await Promise.all([
        productsAPI.getLatest(),
        productsAPI.getTrending(),
        productsAPI.getBestsellers(),
      ]);

      setLatestProducts(latestRes.data);
      setTrendingProducts(trendingRes.data);
      setBestsellerProducts(bestsellerRes.data);
    } catch (err) {
      console.error(err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ===================== SEARCH FILTER ===================== */
  const filterProducts = (products) => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q) ||
        p.brand_name?.toLowerCase().includes(q)
    );
  };

  /* ===================== HERO ===================== */
  const HeroSection = () => (
    <section className="hero-section">
      <div className="hero-overlay" />

      <div className="hero-container">
        {/* LEFT */}
        <div className="hero-content">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            Welcome to <span className="gradient-text">TechMart</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover the latest in tech innovation with AI-powered recommendations
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/collections" className="btn-primary">
              Shop Now <ArrowRight size={20} />
            </Link>

            <Link to="/ai-recommendation" className="btn-secondary">
              AI Picks <Zap size={20} />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT AD IMAGE */}
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <img src="/images/photo-3.avif" alt="Featured Product" />
        </motion.div>
      </div>
    </section>
  );

  /* ===================== FEATURES ===================== */
  const FeaturesSection = () => {
    const features = [
      { icon: <Shield size={32} />, title: "Secure Shopping", description: "100% secure payment" },
      { icon: <Zap size={32} />, title: "Fast Delivery", description: "Free shipping over $100" },
      { icon: <TrendingUp size={32} />, title: "Best Prices", description: "Daily deals & offers" },
      { icon: <Star size={32} />, title: "Top Quality", description: "Verified products only" },
    ];

    return (
      <section className="features-section">
        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <div className="home-page">
        <HeroSection />
        <AIAnalyzing />
      </div>
    );
  }

  /* ===================== ERROR ===================== */
  if (error) {
    return (
      <div className="home-page">
        <HeroSection />
        <p className="error-message">⚠ {error}</p>
      </div>
    );
  }

  /* ===================== MAIN ===================== */
  return (
    <div className="home-page">
      <HeroSection />
      <FeaturesSection />

      <section className="products-section">
        <h2>Latest Arrivals</h2>
        <div className="products-grid">
          {filterProducts(latestProducts)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} addToCart={addToCart} />
            ))}
        </div>
      </section>

      {trendingProducts.length > 0 && (
        <section className="products-section">
          <h2>Trending Now</h2>
          <div className="products-grid">
            {filterProducts(trendingProducts)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
              ))}
          </div>
        </section>
      )}

      {bestsellerProducts.length > 0 && (
        <section className="products-section">
          <h2>Bestsellers</h2>
          <div className="products-grid">
            {filterProducts(bestsellerProducts)
              .slice(4, 8)
              .map((p) => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

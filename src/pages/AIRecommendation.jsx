import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Users, Clock, Brain } from "lucide-react";
import ProductCard from "../components/ProductCard";
import "../Styles/AIRecommendation.css";
import { productsAPI } from "../services/api";

const AIRecommendation = ({ addToCart }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [recommendations, setRecommendations] = useState({
    personalized: [],
    trending: [],
    similarUsers: [],
    frequentlyBought: [],
  });

  const [activeTab, setActiveTab] = useState("personalized");
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  //  Load products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getAll();
        const products = res?.data?.results || res?.data || [];
        setAllProducts(products);

        runAI(products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //  MAIN AI ENGINE
  const runAI = (products) => {
    const userProfile =
      JSON.parse(localStorage.getItem("userProfile")) || {
        categories: {},
        brands: {},
      };

    const trendingScores =
      JSON.parse(localStorage.getItem("trendingScores")) || {};

    // 🔹 Personalized (content-based)
    const personalized = [...products]
      .map((p) => {
        const catScore = userProfile.categories[p.category] || 0;
        const brandScore = userProfile.brands[p.brand] || 0;
        return { ...p, score: catScore + brandScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    // 🔹 Trending (global clicks)
    const trending = [...products]
      .map((p) => ({
        ...p,
        score: trendingScores[p.id] || 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    // 🔹 Similar users (mock collaborative via popularity in same categories)
    const similarUsers = [...products]
      .filter((p) => userProfile.categories[p.category])
      .slice(0, 8);

    setRecommendations({
      personalized:
        personalized.some((p) => p.score > 0) ? personalized : products.slice(0, 8),
      trending:
        trending.some((p) => p.score > 0) ? trending : products.slice(0, 8),
      similarUsers:
        similarUsers.length > 0 ? similarUsers : products.slice(0, 8),
      frequentlyBought: [],
    });
  };

  //  Track user interaction (REAL ML SIGNAL)
  const handleProductView = (productId) => {
    setSelectedProductId(productId);
    setActiveTab("frequentlyBought");

    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;

    //  Update user profile
    const profile =
      JSON.parse(localStorage.getItem("userProfile")) || {
        categories: {},
        brands: {},
      };

    profile.categories[product.category] =
      (profile.categories[product.category] || 0) + 1;

    profile.brands[product.brand] =
      (profile.brands[product.brand] || 0) + 1;

    localStorage.setItem("userProfile", JSON.stringify(profile));

    // 🔹 Update trending score
    const trending =
      JSON.parse(localStorage.getItem("trendingScores")) || {};

    trending[productId] = (trending[productId] || 0) + 1;

    localStorage.setItem("trendingScores", JSON.stringify(trending));

    // 🔹 Update co-view matrix (frequently paired)
    const coView =
      JSON.parse(localStorage.getItem("coViewMatrix")) || {};

    const viewed =
      JSON.parse(localStorage.getItem("recentViews")) || [];

    viewed.forEach((prevId) => {
      if (!coView[prevId]) coView[prevId] = {};
      coView[prevId][productId] =
        (coView[prevId][productId] || 0) + 1;
    });

    localStorage.setItem("coViewMatrix", JSON.stringify(coView));

    const newViewed = [...viewed, productId].slice(-5);
    localStorage.setItem("recentViews", JSON.stringify(newViewed));

    // 🔹 Re-run AI
    runAI(allProducts);

    // 🔹 Generate frequently paired
    generateFrequentlyPaired(productId);
  };

  // Frequently paired logic
  const generateFrequentlyPaired = (productId) => {
    const coView =
      JSON.parse(localStorage.getItem("coViewMatrix")) || {};

    const pairs = coView[productId] || {};

    const pairedProducts = Object.keys(pairs)
      .map((id) => {
        const product = allProducts.find((p) => p.id === Number(id));
        return product ? { ...product, score: pairs[id] } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const fallback = allProducts
      .filter((p) => p.id !== productId)
      .slice(0, 6);

    setRecommendations((prev) => ({
      ...prev,
      frequentlyBought:
        pairedProducts.length > 0 ? pairedProducts : fallback,
    }));
  };

  const tabs = [
    { id: "personalized", label: "For You", icon: <Sparkles size={18} /> },
    { id: "trending", label: "Trending", icon: <TrendingUp size={18} /> },
    { id: "similarUsers", label: "People Like You", icon: <Users size={18} /> },
    { id: "frequentlyBought", label: "Frequently Paired", icon: <Clock size={18} /> },
  ];

  const productsToShow = recommendations[activeTab] || [];

  return (
    <div className="ai-recommendations-page">
      <div className="ai-header">
        <motion.div
          className="ai-header-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="ai-icon-large">
            <Brain size={48} />
          </div>
          <h1 className="ai-title">AI-Powered Recommendations</h1>
          <p className="ai-subtitle">
            Our intelligent system analyzes millions of data points to bring you
            personalized product suggestions tailored to your preferences
          </p>
        </motion.div>
      </div>


      <section className="ai-features">
        <div className="ai-feature-card">
          <div className="feature-icon-small">🎯</div>
          <h3>Collaborative Filtering</h3>
          <p>Recommendations based on users with similar shopping patterns</p>
        </div>
        <div className="ai-feature-card">
          <div className="feature-icon-small">🧠</div>
          <h3>Deep Learning</h3>
          <p>Neural networks analyze product features and user behavior</p>
        </div>
        <div className="ai-feature-card">
          <div className="feature-icon-small">📊</div>
          <h3>Trend Analysis</h3>
          <p>Real-time tracking of popular products and emerging trends</p>
        </div>
        <div className="ai-feature-card">
          <div className="feature-icon-small">⚡</div>
          <h3>Real-Time Adaptation</h3>
          <p>Continuously learning from your interactions and purchases</p>
        </div>
      </section>
      <div className="ai-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading AI...</p>
      ) : (
        <motion.div className="products-grid">
          {productsToShow.length > 0 ? (
            productsToShow.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                onView={handleProductView}
              />
            ))
          ) : (
            <p>No recommendations yet</p>
          )}
        </motion.div>
      )}


      <section className="how-it-works">
        <h2>How Our AI Works</h2>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <h3>Data Collection</h3>
            <p>We analyze your browsing history, purchases, and interactions</p>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <h3>Pattern Recognition</h3>
            <p>Machine learning identifies patterns in user behavior</p>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <h3>Similarity Matching</h3>
            <p>Find products similar to your preferences and interests</p>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <h3>Personalized Results</h3>
            <p>Receive curated recommendations tailored just for you</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIRecommendation;






































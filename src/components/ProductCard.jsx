import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { motion } from "framer-motion";
import "../Styles/ProductCard.css";

import { trackInteraction } from "../Utils/aiModel";

const ProductCard = ({ product, addToCart, onView }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  //  Safe main image
  const mainImage =
    product.main_image ||
    product.images?.[0]?.image ||
    "/placeholder.png";

  //  AI TRAINING: Track user interaction
  const handleView = () => {
    trackInteraction(product); //  ML learning
    if (onView) onView(product.id); //  For Frequently Paired AI
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!addToCart) return;

    trackInteraction(product); //  Cart action also trains model

    addToCart(product, mainImage);

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);

    trackInteraction(product); //  Wishlist also counts as interest
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      )
    : 0;

  return (
    <motion.div
      className="product-card"
      onClick={handleView} //  REQUIRED FOR AI LEARNING + PAIRED
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={mainImage}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />

          {product.isNew && (
            <span className="product-badge new-badge">New</span>
          )}

          {discountPercentage > 0 && (
            <span className="product-badge discount-badge">
              -{discountPercentage}%
            </span>
          )}

          {product.isBestSeller && (
            <span className="product-badge bestseller-badge">
              Best Seller
            </span>
          )}

          <button
            className={`wishlist-button ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlist}
            type="button"
          >
            <Heart
              size={20}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>

          <p className="product-category">
            {product.category_name || product.category}
          </p>

          <div className="product-price-container">
            <span className="product-price">Rs.{product.price}</span>

            {product.originalPrice && (
              <span className="product-original-price">
                Rs.{product.originalPrice}
              </span>
            )}
          </div>

          {product.stock < 10 && product.stock > 0 && (
            <p className="stock-warning">Only {product.stock} left!</p>
          )}

          {product.stock === 0 && (
            <p className="out-of-stock">Out of Stock</p>
          )}
        </div>
      </Link>

      <button
        className="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        type="button"
      >
        <ShoppingCart size={18} />
        <span>
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </span>
      </button>

      {showAddedMessage && (
        <motion.div
          className="added-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ✓ Added to cart!
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductCard;
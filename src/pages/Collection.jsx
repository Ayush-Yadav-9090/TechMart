import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAnalyzing from "../components/AIAnalyzing";

import ProductCard from '../components/ProductCard';
import { productsAPI, handleApiError } from '../services/api';
import '../styles/Collections.css';

const Collections = ({ addToCart, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000000]); // Increased max price

  const categories = [
  "All",
  "Electronics",
  "Headphones",
  "Smartphones",
  "Storage",
  "Ram",
  "Accessories",
];

 const brands = [
  "apple",
  "samsung",
  "sony",
  "bose",
  "corsair",
  "kingston",
  "western digital",
];
  useEffect(() => {
    loadProducts();
  }, [sortBy, searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchQuery || '',
        ordering:
          sortBy === 'price-low'
            ? 'price'
            : sortBy === 'price-high'
              ? '-price'
              : sortBy === 'rating'
                ? '-average_rating'
                : '-created_at',
      };

      const res = await productsAPI.getAll(params);

      const rawProducts = Array.isArray(res.data) ? res.data : res.data.results || [];

     
      const mappedProducts = rawProducts.map((p) => {
        const mainImage =
          p.main_image ||
          p.images?.[0]?.image ||
          "/placeholder.png";

        return {
          id: p.id,
          name: p.name,
          price: Number(p.price),
          stock: p.stock,

          //  normalized strings (FIX FILTER + ADMIN)
          category: (p.category_name || p.category?.name || "").trim(),
          brand: (p.brand_name || p.brand?.name || "").trim(),

          //  images
          main_image: mainImage,
          images: Array.isArray(p.images) ? p.images : [],
        };
      });



      setProducts(mappedProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (
      selectedCategory !== 'all' &&
      product.category.toLowerCase() !== selectedCategory.toLowerCase()
    ) return false;

    if (
      selectedBrands.length > 0 &&
      !selectedBrands
        .map(b => b.toLowerCase())
        .includes(product.brand.toLowerCase())
    ) return false;

    if (product.price < priceRange[0] || product.price > priceRange[1])
      return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !product.name.toLowerCase().includes(q) &&
        !product.category.toLowerCase().includes(q) &&
        !product.brand.toLowerCase().includes(q)
      ) return false;
    }

    return true;
  });

console.table(filteredProducts.map(p => ({
  name: p.name,
  category: p.category,
  brand: p.brand
})));



  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 50000]);
    setSortBy('featured');
  };

  if (loading) {
    return <AIAnalyzing />;
  }

  if (error)
    return (
      <div>
        <p className="error-message">⚠ {error}</p>
        <button onClick={loadProducts}>Retry</button>
      </div>
    );

  return (
    <div className="collections-page">
      <div className="collections-header">
        <div>
          <h1>Our Collection</h1>
          <p>{filteredProducts.length} products found</p>
        </div>
        <div className="collections-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <button onClick={() => setShowFilters(true)}>
            <SlidersHorizontal size={20} /> Filters
          </button>
        </div>
      </div>

      <div className="collections-content">
        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="filters-header">

            <h3>Filters</h3>

          </div>

          <div className="filter-section">
            <h4>Category
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="close-filters-btn"
              >
                <X size={22} />
              </button></h4>

            {categories.map((cat) => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => setSelectedCategory(cat.toLowerCase())}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <input
              type="range"
              min="0"
              max="50000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            />
            <p>Rs.{priceRange[0]} – Rs.{priceRange[1]}</p>
          </div>

          <div className="filter-section">
            <h4>Brand</h4>
            {brands.map((brand) => (
              <label key={brand}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
          </div>

          <button onClick={clearFilters}>Clear Filters</button>
        </aside>

        {/* Products Grid */}
        <div className="products-container">
          {filteredProducts.length > 0 ? (
            <motion.div className="products-grid" layout>
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="no-products">
              <p>No products found.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";

import "../styles/Feedback.css";
import { reviewsAPI } from "../services/api";

const Feedback = ({ user }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    category: "general",
    title: "",
    feedback: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const categories = [
    { value: "general", label: "General Feedback" },
    { value: "product", label: "Product Quality" },
    { value: "service", label: "Customer Service" },
    { value: "website", label: "Website Experience" },
    { value: "shipping", label: "Shipping & Delivery" },
    { value: "suggestion", label: "Suggestion" },
  ];

  // Load reviews from backend
  const loadReviews = async () => {
    try {
      const res = await reviewsAPI.getAll(); // fetch all feedback
      setReviews(res.data.results || res.data); // support DRF pagination
      console.log("Loaded reviews:", res.data);
    } catch (err) {
      console.error("Error loading reviews:", err.response?.data);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("You should login");
      return;
    }


    if (rating === 0) {
      alert("Select rating");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        rating,
        category: formData.category,
        title: formData.title,
        feedback: formData.feedback,
      };

      await reviewsAPI.create(payload); // send to backend

      setSubmitted(true);

      // Reset form
      setRating(0);
      setFormData({
        category: "general",
        title: "",
        feedback: "",
      });

      // Reload reviews immediately
      await loadReviews();

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Submit error:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page">
      <motion.div
        className="feedback-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="feedback-icon">
          <MessageSquare size={48} />
        </div>
        <h1>We Value Your Feedback</h1>
        <p>Help us improve by sharing your thoughts and experiences</p>
      </motion.div>

      <div className="feedback-container">
        <motion.div
          className="feedback-form-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {submitted && (
            <motion.div
              className="success-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ThumbsUp size={24} />
              <div>
                <h3>Thank you for your feedback!</h3>
                <p>We appreciate you taking the time to help us improve.</p>
              </div>
            </motion.div>
          )}

          {/* Feedback Form */}
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="rating-section">
              <h2>How would you rate your experience?</h2>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= (hoverRating || rating) ? "active" : ""}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={40}
                      fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
              <p className="rating-text">
                {rating === 0 && "Select a rating"}
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="category">Feedback Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary of your feedback"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="feedback">Your Feedback</label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Tell us more about your experience..."
                rows="6"
                className="form-textarea"
                required
              ></textarea>
              <span className="char-count">{formData.feedback.length} / 1000 characters</span>
            </div>

            <button type="submit" className="submit-button" disabled={loading || rating === 0}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </motion.div>

        <motion.div
          className="feedback-sidebar"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="sidebar-card">
            <h3>Why Your Feedback Matters</h3>
            <ul>
              <li>Helps us improve our products and services</li>
              <li>Guides our development priorities</li>
              <li>Ensures we meet customer expectations</li>
              <li>Builds a better shopping experience</li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Recent Improvements</h3>
            <div className="improvement-list">
              <div className="improvement-item">
                <div className="improvement-icon">✓</div>
                <div>
                  <h4>Faster Checkout</h4>
                  <p>Based on user feedback</p>
                </div>
              </div>
              <div className="improvement-item">
                <div className="improvement-icon">✓</div>
                <div>
                  <h4>AI Recommendations</h4>
                  <p>Suggested by customers</p>
                </div>
              </div>
              <div className="improvement-item">
                <div className="improvement-icon">✓</div>
                <div>
                  <h4>Better Search</h4>
                  <p>Community requested</p>
                </div>
              </div>
            </div>
          </div>

         
        </motion.div>


      </div>
    </div>
  );
};

export default Feedback;

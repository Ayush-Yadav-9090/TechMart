import { useEffect, useState } from "react";
import { reviewsAPI } from "../services/api";
import "../Styles/ProductReview.css"

const ProductReviews = ({ productId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const loadReviews = async () => {
    try {
      console.log("Fetching reviews for product:", productId);

      const res = await reviewsAPI.getAll({ product: productId });

      console.log("Reviews API raw response →", res.data);

      const data = res.data.results || res.data;
      setReviews(data);

    } catch (err) {
      console.error("Load error →", err.response?.data || err.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login");
      return;
    }

    console.log("Submitting review →", {
      product: productId,
      rating,
      title,
      feedback
    });

    try {
      const res = await reviewsAPI.create({
        product: productId,
        rating: Number(rating),
        title,
        feedback,
        category: "product"
      });

      console.log("Review API response →", res.data);

      setTitle("");
      setFeedback("");
      setRating(5);

      await loadReviews();

    } catch (err) {
      console.error("FULL ERROR →", err);
      console.error("STATUS →", err.response?.status);
      console.error("DATA →", err.response?.data);
      console.error("MESSAGE →", err.message);

      alert(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="reviews-section">
      <h3>Reviews</h3>

      {user && (
        <form onSubmit={submitReview} className="review-form">
          <input
            placeholder="Review title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>

          <textarea
            placeholder="Write feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />

          <button type="submit">Submit Review</button>
        </form>
      )}

      {reviews.length === 0 && (
        <p>No reviews yet</p>
      )}

      {reviews.map((r) => (
        <div key={r.id} className="review-card">
          <strong>{r.user_email || "Anonymous"}</strong>
          <div>⭐ {r.rating}</div>
          <h4>{r.title}</h4>
          <p>{r.feedback}</p>
          <small>{new Date(r.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;

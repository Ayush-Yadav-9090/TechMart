import { useEffect, useState } from "react";
import { adminAPI, handleApiError } from "../../services/api";
import "../../Styles/AdminReviews.css";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllReviews();
      setReviews(res.data.results || res.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-table">
      <h2>Reviews & Feedback</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Category</th>
            <th>Rating</th>
            <th>Title</th>
            <th>Feedback</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.user_email || "Anonymous"}</td>
              <td>{r.product || "-"}</td>
              <td>{r.category}</td>
              <td>⭐ {r.rating}</td>
              <td>{r.title}</td>
              <td>{r.feedback}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviews;

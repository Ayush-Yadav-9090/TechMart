import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductReviews from "../components/ProductReviews";
import {ShoppingCart} from "lucide-react";
import { useAuth } from "../services/AuthContext";
import { productsAPI, reviewsAPI, handleApiError } from "../services/api";
import "../Styles/ProductDetails.css";

const ProductDetail = ({ addToCart }) => {
  const { user } = useAuth();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState( 0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getBySlug(id);
      setProduct(res.data);

      const reviewsRes = await reviewsAPI.getAll({
        product: res.data.id,
      });
      setReviews(reviewsRes.data?.results || []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="loading-spinner" />;
  if (error) return <p>{error}</p>;
  if (!product) return null;

  /*  FIXED IMAGE LOGIC */
  const allImages = [
    
    product.main_image,
    ...(product.images?.map(img => img.image) || [])
  ].filter(Boolean);
  console.log(allImages)

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">

        {/* IMAGES */}
        <div className="product-images">
          <div className="main-image">
            <img
              src={allImages[selectedImage]}
              alt={product.name}
            />
          </div>

          {allImages.length > 1 && (
            <div className="thumbnail-images">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail-btn ${selectedImage === index ? "active" : ""
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt="thumb" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div className="price">₹{product.price}</div>

          <div className="quantity">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <input value={quantity} readOnly />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <button
            className="add-to-cart-btn"
            onClick={() =>
              addToCart(product, allImages[selectedImage],quantity)
            }
          >
            <ShoppingCart /> Add to Cart
          </button>

        </div>
      </div>

       <ProductReviews productId={product.id} user={user} />

    </div>
  );
};

export default ProductDetail;

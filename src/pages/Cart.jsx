import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import '../styles/Cart.css';


/**
 * Cart Page Component
 * Shopping cart with item management and checkout
 * @param {Array} cart - Cart items
 * @param {Function} updateQuantity - Update item quantity
 * @param {Function} removeItem - Remove item from cart
 */
const Cart = ({ cart, updateQuantity, removeItem }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);


  /**
   * Calculate cart totals
   */
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 99 ? 0 : 9.99;
  const total = subtotal + tax + shipping - discount;

  /**
   * Apply promo code
   */
  const applyPromo = () => {
    // Mock promo codes
    const promoCodes = {
      'SAVE10': 10,
      'TECH20': 20,
      'WELCOME15': 15
    };

    const discountAmount = promoCodes[promoCode.toUpperCase()];
    if (discountAmount) {
      setDiscount(discountAmount);
      alert(`Promo code applied! $${discountAmount} off`);
    } else {
      alert('Invalid promo code');
    }
  };



  /**
   * Handle checkout
   */
  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!');
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <motion.div
          className="empty-cart-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag size={64} />
          <h2>Your Cart is Empty</h2>
          <p>Add some amazing tech products to get started!</p>
          <Link to="/collections" className="shop-now-btn">
            Start Shopping
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={`${item.id}-${item.cart_image}`}

                className="cart-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                

                <div className="item-image">
                  <img
                    src={
                      item.cart_image
                        ? item.cart_image.startsWith("http")
                          ? item.cart_image
                          : `http://localhost:8000${item.cart_image}`
                        : "/placeholder.png"
                    }
                    alt={item.name}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                </div>





                <div className="item-details">
                  <Link to={`/product/${item.id}`} className="item-name">
                    {item.name}
                  </Link>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">Rs.{item.price}</p>
                </div>

                <div className="item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.cart_image,item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.cart_image,item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="item-total">
                  <p className="total-price">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id, item.cart_image)}

                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-section">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>Rs.{tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-Rs.{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="promo-section">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="promo-input"
            />
            <button onClick={applyPromo} className="apply-btn">
              Apply
            </button>
          </div>

          {/* Free Shipping Notice */}
          {subtotal < 99 && (
            <div className="shipping-notice">
              Add Rs.{(99 - subtotal).toFixed(2)} more for FREE shipping!
            </div>
          )}

          {/* Checkout Button */}
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
            <ArrowRight size={20} />
          </button>

          {/* Continue Shopping */}
          <Link to="/collections" className="continue-shopping">
            Continue Shopping
          </Link>

          {/* Payment Methods */}
          <div className="payment-methods">
            <p>We accept:</p>
            <div className="payment-icons">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <section className="cart-recommendations">
        <h2>You May Also Like</h2>
        <p>Based on items in your cart</p>
        {/* This would show recommended products */}
      </section>
    </div>
  );
};

export default Cart;

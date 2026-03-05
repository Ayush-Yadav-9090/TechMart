// Contact Form
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import '../styles/Contact.css';

/**
 * Contact Page Component
 * Contact form and information
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="contact-page">
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </motion.div>

      <div className="contact-content">
        {/* Contact Form */}
        <motion.div
          className="contact-form-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Send us a Message</h2>
          
          {submitted && (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✓ Message sent successfully! We'll get back to you soon.
            </motion.div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows="6"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="contact-info-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>Contact Information</h2>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">
                <Mail />
              </div>
              <h3>Email Us</h3>
              <p>support@techmart.com</p>
              <p className="secondary">sales@techmart.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Phone />
              </div>
              <h3>Call Us</h3>
              <p>+1 (555) 123-4567</p>
              <p className="secondary">Mon-Fri: 9AM - 6PM EST</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <MapPin />
              </div>
              <h3>Visit Us</h3>
              <p>123 Tech Street</p>
              <p className="secondary">Lucknow,  226016</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Clock />
              </div>
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9AM - 6PM</p>
              <p className="secondary">Saturday: 10AM - 4PM</p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="map-container">
            <iframe
              title="Location Map"
              // <Map lat={37.4219999} lng={-122.0862462} />
              src={`https://www.google.com/maps?q=${26.8944},${81.0827}&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>What are your shipping options?</h3>
            <p>We offer standard (5-7 days), express (2-3 days), and overnight shipping options.</p>
          </div>
          <div className="faq-item">
            <h3>What is your return policy?</h3>
            <p>We accept returns within 30 days of purchase with original packaging and receipt.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer warranty on products?</h3>
            <p>Yes, all products come with manufacturer warranty. Extended warranty options available.</p>
          </div>
          <div className="faq-item">
            <h3>How can I track my order?</h3>
            <p>You'll receive a tracking number via email once your order ships.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
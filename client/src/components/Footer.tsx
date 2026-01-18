import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand-logo">
              <i className="fas fa-graduation-cap"></i>
              <span className="brand-text">Trainify</span>
            </div>
            <p className="footer-description">
              Empowering professionals through continuous learning and skill development.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-column">
              <h4>Platform</h4>
              <ul>
                <li><Link to="/courses">Browse Courses</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/instructors">Become an Instructor</Link></li>
                <li><Link to="/enterprise">For Enterprise</Link></li>
                <li><Link to="/affiliate">Affiliate Program</Link></li>
              </ul>
            </div>

            <div className="link-column">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/guides">Learning Guides</Link></li>
                <li><Link to="/webinars">Free Webinars</Link></li>
                <li><Link to="/certifications">Certifications</Link></li>
                <li><Link to="/careers">Careers</Link></li>
              </ul>
            </div>

            <div className="link-column">
              <h4>Support</h4>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="link-column">
              <h4>Stay Updated</h4>
              <p>Subscribe to our newsletter for the latest courses and updates.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Trainify. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>

          <div className="footer-payment">
            <span>Secure Payment:</span>
            <div className="payment-methods">
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-amex"></i>
              <i className="fab fa-cc-paypal"></i>
              <i className="fab fa-cc-stripe"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
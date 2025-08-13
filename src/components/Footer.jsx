import React from 'react'
import { ShoppingBag, Star, ArrowRight, Truck, Shield, RefreshCw, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Color } from '@tiptap/extension-text-style';


const Footer = () => {
  return (
    <div id='contact'>
      <style jsx>
        {`/* Footer Styles */
                    .footer {
                      background: #1a1a1a;
                      color: white;
                      padding: 60px 20px 30px;
                    }
            
                    .footer-content {
                      display: grid;
                      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                      gap: 40px;
                      margin-bottom: 40px;
                    }
            
                    .footer-section h3 {
                      font-size: 1.3rem;
                      font-weight: 700;
                      color: #f9af16;
                      margin-bottom: 20px;
                    }
            
                    .footer-section p,
                    .footer-section ul {
                      color: #ccc;
                      line-height: 1.6;
                    }
            
                    .footer-section ul {
                      list-style: none;
                      padding: 0;
                    }
            
                    .footer-section ul li {
                      margin-bottom: 8px;
                    }
            
                    .footer-section ul li a {
                      color: #ccc;
                      text-decoration: none;
                      transition: all 0.3s ease;
                    }
            
                    .footer-section ul li a:hover {
                      color: #f9af16;
                    }
            
                    .social-icons {
                      display: flex;
                      gap: 16px;
                      margin-top: 20px;
                    }
            
                    .social-icon {
                      width: 40px;
                      height: 40px;
                      background: #333;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: white;
                      text-decoration: none;
                      transition: all 0.3s ease;
                    }
            
                    .social-icon:hover {
                      background: #f9af16;
                      transform: translateY(-2px);
                    }
            
                    .footer-bottom {
                      border-top: 1px solid #333;
                      padding-top: 30px;
                      text-align: center;
                      color: #999;
                    }
            
                    .footer-bottom p {
                      margin: 0;
                    }
            
                    @media (max-width: 768px) {
                      .hero-content {
                        grid-template-columns: 1fr;
                        gap: 40px;
                        text-align: center;
                      }
                      
                      .newsletter-form {
                        flex-direction: column;
                        padding: 0 20px;
                      }
                      
                      .hero-title {
                        font-size: 2.5rem;
                      }
            
                      .contact-content {
                        grid-template-columns: 1fr;
                        gap: 40px;
                      }
            
                      .footer-content {
                        grid-template-columns: 1fr;
                        gap: 30px;
                        text-align: center;
                      }
                    }
                    `}
      </style>
      {/* Footer */}
      <footer className="footer" >
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>PJStore</h3>
              <p>
                Your premier destination for cutting-edge phone accessories.
                We're committed to bringing you the latest in mobile technology
                with exceptional quality and customer service.
              </p>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-icon">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-icon">
                  <Instagram size={20} />
                </a>
                <a href="#" className="social-icon">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>

            {/* <div className="footer-section">
              <h3>Customer Service</h3>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#shipping">Shipping Info</a></li>
                <li><a href="#returns">Returns & Exchanges</a></li>
                <li><a href="#warranty">Warranty</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div> */}

            <div className="footer-section">
              <h3>Legal</h3>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
                <li><a href="#disclaimer">Disclaimer</a></li>


              </ul>

            </div>

          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Your Store. All
              rights reserved.</p>
          </div>


        </div>

      </footer>


    </div>
  )
}

export default Footer
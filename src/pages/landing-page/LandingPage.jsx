import { useState, useEffect } from 'react';
import { ShoppingBag, Star, ArrowRight, Truck, Shield, RefreshCw, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductImage = ({ src, alt }) => (
  <div className="product-image-box">
    <img 
      src={src} 
      alt={alt}
      style={{
        width: "100%", 
        height: "100%", 
        objectFit: "cover",
        borderRadius: "12px"
      }}
    />
  </div>
);

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);



  const products = [
    { id: 1, name: "Oraimo Wireless Headphone", price: "$17.55", rating: 4.8, image: "/ohp-610-black.webp" },
    { id: 2, name: "Samsung Galaxy Watch 7 (44mm)", price: "$254.15", rating: 4.9, image: "/image-2024-09-23T131208.537-removebg-preview.webp" },
    { id: 3, name: "LG 200W XBOOM Wireless Portable speaker", price: "$288.53", rating: 4.7, image: "/lg_xl5s_xboom_poratble_200_watt_battery_1772212-removebg-preview.webp" },
  ];

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $650.00" },
    { icon: Shield, title: "Secure Payment", desc: "100% protected checkout" },
    { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" }
  ];

  return (
    <div className="landing-page">
      <style jsx>{`
        .landing-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-x: hidden;
        }

        .hero-section {
          background: linear-gradient(135deg, #f9af16 0%, #257d26 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-top: 6rem;

        }

        .hero-bg-animation {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 100vh;
        }

        .hero-text {
          color: white;
          transform: ${isVisible ? 'translateX(0)' : 'translateX(-50px)'};
          opacity: ${isVisible ? '1' : '0'};
          transition: all 0.8s ease-out;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          background: linear-gradient(45deg, #ffffff, #f0f0f0);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 32px;
          opacity: 0.9;
          line-height: 1.6;
        }

        .cta-button {
          background: white;
          color: #257d26;
          padding: 16px 32px;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          background: #f8f8f8;
        }

        .hero-visual {
          position: relative;
          transform: ${isVisible ? 'translateX(0)' : 'translateX(50px)'};
          opacity: ${isVisible ? '1' : '0'};
          transition: all 0.8s ease-out 0.2s;
        }

        .hero-image-box {
          width: 100%;
          height: 400px;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .hero-image-box::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #f9af16, #257d26, #f9af16);
          border-radius: 22px;
          z-index: -1;
          animation: borderRotate 3s linear infinite;
        }

        @keyframes borderRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .image-placeholder {
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
          text-align: center;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .floating-icon {
          position: absolute;
          color: rgba(255,255,255,0.3);
          animation: floatIcon 4s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-icon:nth-child(2) {
          top: 60%;
          right: 15%;
          animation-delay: 1s;
        }

        .floating-icon:nth-child(3) {
          bottom: 30%;
          left: 20%;
          animation-delay: 2s;
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-15px) rotate(5deg); opacity: 0.6; }
        }

        .products-section {
          padding: 100px 0;
          background: linear-gradient(to bottom, #ffffff, #f8f9fa);
        }

       

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 60px;
        }

        .product-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.4s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(249,175,22,0.1), transparent);
          transition: left 0.6s ease;
        }

        .product-card:hover::before {
          left: 100%;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .product-image-box {
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }

        .product-info h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f9af16;
          margin-bottom: 12px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ffc107;
          font-size: 0.9rem;
        }

        .features-section {
          padding: 100px 0;
          background: #257d26;
          color: white;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .feature-card {
          text-align: center;
          padding: 40px 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.15);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: #f9af16;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
        }

        .feature-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .feature-desc {
          opacity: 0.9;
          line-height: 1.6;
        }

        .newsletter-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #f9af16, #e6940f);
          text-align: center;
        }

        .newsletter-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
        }

        .newsletter-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 40px;
        }

        .newsletter-form {
          display: flex;
          max-width: 500px;
          margin: 0 auto;
          gap: 12px;
        }

        .newsletter-input {
          flex: 1;
          padding: 16px 20px;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          outline: none;
        }

        .newsletter-button {
          background: #257d26;
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .newsletter-button:hover {
          background: #1e6b1f;
          transform: scale(1.05);
        }

      

        
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-animation"></div>
        <div className="floating-elements">
          <ShoppingBag className="floating-icon" size={24} />
          <Star className="floating-icon" size={20} />
          <ArrowRight className="floating-icon" size={18} />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Shop the Future Today.
              </h1>
              <p className="hero-subtitle">
                Elevate your lifestyle with our exclusive collection of <b>phone accessories.</b>
              </p>
              <Link to ='/products'>
              
             
              <button className="cta-button">
                Explore Collection
                <ArrowRight size={20} />
              </button> </Link>
            </div>

            <div className="hero-visual">
              <div className="hero-image-box">
                <div className="image-placeholder">
                  <img
                    src="/Innovative-and-Futuristic-Tech-gadgets-that-will-make-you-Speech-less_blog-banner-1-removebg-preview.webp"
                    alt="Hero Visual"
                    style={{
                      width: "100%", height: "100%", objectFit: "cover"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="product-card"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                style={{
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isVisible ? '1' : '0',
                  transition: `all 0.6s ease-out ${0.6 + index * 0.1}s`
                }}
              >
                <ProductImage src={product.image} alt={product.name} />

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-price">{product.price}</div>
                  <div className="product-rating">
                    <Star size={16} fill="currentColor" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>
            Why Choose Us
          </h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isVisible ? '1' : '0',
                  transition: `all 0.6s ease-out ${1 + index * 0.2}s`
                }}
              >
                <div className="feature-icon">
                  <feature.icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <h2 className="newsletter-title">Stay Updated</h2>
          <p className="newsletter-subtitle">
            Subscribe to get special offers, free giveaways, and updates on new arrivals
          </p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button className="newsletter-button">Subscribe</button>
          </div>
        </div>
      </section>

     

    <>
    </>
    </div>
  );
};

export default LandingPage;
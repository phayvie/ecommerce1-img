import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Search, Heart } from 'lucide-react';
import './navBar.css'; // Import your CSS file for styles

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', path: '/' },
    { name: 'Products', href: '/products', path: '/products' },
    { name: 'Blog', href: '/blogs', path: '/blogs' },
    { name: 'Contact', href: '/contact', path: '/contact' },
        { name: 'Admin', href: '/admin-home', path: '/admin' }

  ];

  const handleItemClick = (href) => {
    setIsMobileMenuOpen(false);
    
    // Handle hash links for smooth scrolling (if needed for same-page navigation)
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Determine active item based on current location
  const getActiveItem = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          transition: all 0.3s ease-in-out;
        }

        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .navbar-transparent {
          background: rgba(249, 175, 22, 0.1);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          height: ${isScrolled ? '64px' : '80px'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: height 0.3s ease;
        }

        /* Logo */
        .logo {
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(135deg, #f9af16 0%, #257d26 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        /* Desktop Navigation */
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }

        .nav-link {
          position: relative;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 500;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
          overflow: hidden;
          color:'#1f2937' ;
        }

        .nav-link:hover {
          background: rgba(249, 175, 22, 0.1);
          // transform: translateY(-2px);
        }

        .nav-link.active {
          background: ${isScrolled 
            ? 'linear-gradient(135deg, #f9af16, #e6940f)' 
            : 'rgba(255, 255, 255, 0.2)'};
          color: '#1f2937';
          box-shadow: 0 4px 15px rgba(249, 175, 22, 0.3);
        }

        .nav-link-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(249, 175, 22, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .nav-link:hover .nav-link-shimmer {
          left: 100%;
        }

        /* Action Buttons */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .action-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          background: ${isScrolled 
            ? 'rgba(249, 175, 22, 0.1)' 
            : 'rgba(255, 255, 255, 0.15)'};
          color: ${isScrolled ? '#257d26' : 'white'};
        }

        .action-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: linear-gradient(135deg, #f9af16, #257d26);
          border-radius: 50%;
          transition: all 0.3s ease;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        .action-button:hover::before {
          width: 100%;
          height: 100%;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          color: white;
        }

        .action-button svg {
          position: relative;
          z-index: 2;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 20px;
          height: 20px;
          background: #f9af16;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          background: ${isScrolled 
            ? 'rgba(249, 175, 22, 0.1)' 
            : 'rgba(255, 255, 255, 0.15)'};
          color: ${isScrolled ? '#257d26' : 'white'};
        }

        .mobile-menu-toggle:hover {
          transform: rotate(90deg);
        }

        /* Mobile Menu Overlay */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: ${isMobileMenuOpen ? '1' : '0'};
          visibility: ${isMobileMenuOpen ? 'visible' : 'hidden'};
          transition: all 0.3s ease;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 400px;
          height: 100vh;
          background: linear-gradient(135deg, rgba(249, 175, 22, 0.95), rgba(37, 125, 38, 0.95));
          backdrop-filter: blur(20px);
          padding: 32px;
          z-index: 1001;
          transform: translateX(${isMobileMenuOpen ? '0' : '100%'});
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
        }

        .mobile-logo {
          font-size: 24px;
          font-weight: 800;
          color: white;
          text-decoration: none;
        }

        .mobile-menu-close {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .mobile-menu-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .mobile-nav-menu {
          list-style: none;
          margin-bottom: 32px;
        }

        .mobile-nav-link {
          display: block;
          color: white;
          text-decoration: none;
          font-size: 20px;
          font-weight: 500;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover {
          padding-left: 16px;
          color: #f9af16;
        }

        .mobile-nav-link.active {
          color: #f9af16;
          padding-left: 16px;
        }

        .mobile-actions {
          display: flex;
          gap: 16px;
        }

        .mobile-action-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .mobile-action-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .desktop-actions {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            padding: 0 16px;
          }

          .logo {
            font-size: 20px;
          }

          .mobile-menu {
            max-width: 100%;
          }
        }
      `}</style>

      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link 
            to="/" 
            className="logo"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            PJStore
          </Link>

          {/* Desktop Navigation */}
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`nav-link ${getActiveItem(item.path) ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.href)}
                >
                  {/* <div className="nav-link-shimmer"></div> */}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          {/* Mobile Menu Toggle */}
<button 
  className="mobile-menu-toggle"
  onClick={() => setIsMobileMenuOpen(true)}
>
  <Menu size={20} />
</button>


          {/* Action Buttons */}
          
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className="mobile-overlay"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      
      <div className="mobile-menu">
        
        <div className="mobile-menu-header">
          <Link 
            to="/" 
            className="mobile-logo"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            PJStore
          </Link>
          <button 
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <ul className="mobile-nav-menu">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`mobile-nav-link ${getActiveItem(item.path) ? 'active' : ''}`}
                onClick={() => handleItemClick(item.href)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

         
      </div>
    </>
  );
};

export default Navbar;
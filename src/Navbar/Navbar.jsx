import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="./logo.png" alt="FalconAI Logo" className="logo-img" />
          <span>AirBridge</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links-desktop">
          <li><Link to="/">Home</Link></li>
                    <li><Link to="/Upload" >Upload</Link></li>

          <li><Link to="/download" onClick>Download</Link></li>

          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/terms">Terms and Conditions</Link></li>
          <li><Link to="/policy">Privacy Policy</Link></li>
        </ul>

        {/* Hamburger Menu (Visible on Mobile Only) */}
        <button
          className={`hamburger-menu ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
      </div>

      {/* Sidebar Navigation Menu (Mobile Only) */}
      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <ul className="nav-links">
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/Upload" onClick={() => setIsMenuOpen(false)}>Upload</Link></li>

          <li><Link to="/download" onClick={() => setIsMenuOpen(false)}>Download</Link></li>
          <li><Link to="/terms" onClick={() => setIsMenuOpen(false)}>Terms and Conditions</Link></li>
          <li><Link to="/policy" onClick={() => setIsMenuOpen(false)}>Privacy Policy</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
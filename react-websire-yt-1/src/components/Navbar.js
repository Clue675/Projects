import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    const showButtonHandler = () => {
      setShowButton(window.innerWidth > 960);
    };

    window.addEventListener('resize', showButtonHandler);

    return () => {
      window.removeEventListener('resize', showButtonHandler);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          AI Technolog<i className="fab fa-typo3" />
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/Services"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              Services
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/Products"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/Sign-up"
              className="nav-links-mobile"
              onClick={closeMobileMenu}
            >
              Sign-up
            </Link>
          </li>
        </ul>
        {showButton && (
          <Button buttonStyle="btn--outline">Sign Up</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

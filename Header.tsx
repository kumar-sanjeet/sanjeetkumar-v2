'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './header.css';

// Define navigation data in one place for easy maintenance
const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#contact', label: 'Contact' },
];

const Header = () => {
  const [activeNav, setActiveNav] = useState('#home');

  return (
    <header>
      <div className="container header__container">
        <Link href="#home" className="header__logo">
          Sanjeet Kumar
        </Link>
        <nav>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setActiveNav(link.href)}
              className={activeNav === link.href ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
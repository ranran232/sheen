'use client'
import React from 'react';

const Footer = () => {
  const yearNow = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-200 py-6 px-4 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: copyright */}
        <div className="text-stone-500 text-sm">
          &copy; {yearNow} Randy Olais
        </div>

        {/* Center: social / contact links */}
        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://www.linkedin.com/in/randy-olais-261305341/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:text-black transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:afacebu.randy@gmail.com"
            className="text-stone-600 hover:text-black transition-colors"
          >
            Email
          </a>
          <a
            href="https://randy-olais-portfolio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:text-black transition-colors"
          >
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
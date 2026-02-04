import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Navbar />

      <main className="not-found-main">
        <section className="not-found-content">
          <h1 className="not-found-code">
            4<span>0</span>4
          </h1>
          <h2 className="not-found-title">Page Not Found</h2>
          <p className="not-found-text">
            Oops! The page you are looking for has been moved or doesn&apos;t
            exist. Let&apos;s get you back on track.
          </p>

          <p className="not-found-search-title">LOOKING FOR SOMETHING SPECIFIC?</p>

          <div className="not-found-search">
            <span className="not-found-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M11 4a7 7 0 015.6 11.2l3.6 3.6-1.4 1.4-3.6-3.6A7 7 0 1111 4zm0 2a5 5 0 100 10 5 5 0 000-10z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <input type="text" placeholder="Search for anything..." />
          </div>

          <div className="not-found-actions">
            <Link to="/marketplace" className="not-found-btn not-found-btn--primary">
              Back to Marketplace
            </Link>
            <Link to="/contact" className="not-found-btn not-found-btn--outline">
              Contact Support
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

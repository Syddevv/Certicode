import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/About.css";
import SecureTransfers from "../../assets/SecureTransfers.png";
import PremiumQuality from "../../assets/PremiumQuality.png";
import EnterpriseSecurity from "../../assets/EnterpriseSecurity.png";
import BlueChart from "../../assets/BlueChart.png";

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />
      <section className="about">
        <div className="about__hero">
          <div className="about__heroInner">
            <span className="about__pill">Our Mission</span>
            <h1>
              Crafting the Future of <span>Digital Commerce</span>
            </h1>
            <p>
              CertiCode is a B2B marketplace for production-ready digital assets
              and UI/UX systems. We empower developers and businesses with
              world-class code and design components.
            </p>
          </div>
        </div>

        <div className="about__section">
          <div className="about__split">
            <div className="about__imageCard">
              <img src={BlueChart} alt="Analytics chart" />
            </div>
            <div className="about__content">
              <h2>The CertiCode Distinction</h2>
              <p>
                Unlike traditional open marketplaces where quality varies,
                CertiCode acts as the sole provider of every asset on our
                platform.
              </p>
              <p>
                Every line of code is written by our in-house experts, ensuring
                seamless integration, high performance, and long-term
                maintainability for your production environments.
              </p>
              <ul className="about__list">
                <li>
                  <img src={PremiumQuality} alt="" aria-hidden="true" />
                  <div>
                    <strong>Verified Excellence</strong>
                    <span>Strict QA processes for every single component.</span>
                  </div>
                </li>
                <li>
                  <img src={EnterpriseSecurity} alt="" aria-hidden="true" />
                  <div>
                    <strong>Enterprise Security</strong>
                    <span>Zero third-party risks with controlled development.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="about__section about__section--light">
          <div className="about__heading">
            <h2>Why Businesses Choose Us</h2>
            <span />
          </div>
          <div className="about__cards">
            <article className="about__card">
              <span>
                <img src={PremiumQuality} alt="" aria-hidden="true" />
              </span>
              <h3>Premium Quality</h3>
              <p>
                Hand-crafted digital assets designed for performance,
                accessibility, and modern design standards.
              </p>
            </article>
            <article className="about__card">
              <span>
                <img src={SecureTransfers} alt="" aria-hidden="true" />
              </span>
              <h3>Secure Transfers</h3>
              <p>
                Encrypted delivery systems ensuring that your digital property
                reaches your team safely and instantly.
              </p>
            </article>
            <article className="about__card">
              <span>
                <img src={EnterpriseSecurity} alt="" aria-hidden="true" />
              </span>
              <h3>Developer-First Code</h3>
              <p>
                Clean, commented, and modular code built with modern frameworks
                to save your team weeks of development.
              </p>
            </article>
          </div>

          <div className="about__journey">
            <h2>Our Journey</h2>
            <div className="about__journeyText">
              <p>
                Certicode is a Philippine-based IT services and digital
                solutions company founded in 2025, dedicated to helping
                businesses and individuals thrive in the digital world. We
                specialize in delivering reliable, secure, and innovative
                technology solutions that turn ideas into powerful digital
                products.
              </p>
              <p>
                We decided to flip the model on its head. Instead of hosting
                thousands of unverified sellers, we decided to be the architects
                of everything we sell. This commitment to quality transformed us
                from a boutique agency into a global leader in B2B digital
                assets.
              </p>
              <p>
                We are committed to transparency, continuous improvement, and
                long-term partnerships with our clients. Whether you&apos;re a
                startup, a growing business, or an established enterprise,
                Certicode is your trusted partner in building smart, secure, and
                impactful digital solutions.
              </p>
            </div>
          </div>

          <div className="about__stats">
            {[
              { value: "10k+", label: "Assets Sold" },
              { value: "5k+", label: "Customers" },
              { value: "24/7", label: "Global Support" },
              { value: "99.9%", label: "Quality Rating" },
            ].map((stat) => (
              <div key={stat.label} className="about__stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about__cta">
          <div className="about__ctaCard">
            <h2>Ready to build something incredible?</h2>
            <p>
              Explore our curated selection of production-ready assets and
              accelerate your development cycle today.
            </p>
            <Link className="about__ctaBtn" to="/marketplace">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;

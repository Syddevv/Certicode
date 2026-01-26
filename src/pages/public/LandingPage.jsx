import React from "react";
import "../../styles/landingPage.css";
import Navbar from "../../components/Navbar";
import SearchIcon from "../../assets/lucide_search.png";
import MoonIcon from "../../assets/lucide_moon.png";
import Badge from "../../assets/Verified.png";
import TechFlow from "../../assets/TechFlow.png";
import SkyScale from "../../assets/SkyScale.png";
import NexusAI from "../../assets/NexusAI.png";
import StackBuild from "../../assets/StackBuild.png";
import OrbitOS from "../../assets/OrbitOS.png";
import ArrowDown from "../../assets/ArrowDown.png";
import Phone from "../../assets/Phone.png";

const LandingPage = () => {
  const items = [
    { src: TechFlow, name: "TechFlow" },
    { src: SkyScale, name: "SkyScale" },
    { src: NexusAI, name: "NexusAI" },
    { src: StackBuild, name: "StackBuild" },
    { src: OrbitOS, name: "OrbitOS" },
  ];

  return (
    <div>
      <Navbar />
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__left">
            <span className="pill">B2B Digital Asset Marketplace</span>

            <h1 className="hero__title">
              Buy <span className="accent">Production-Ready</span> Digital
              Assets Directly from <span className="accent">CertiCode</span>.
            </h1>

            <p className="hero__desc">
              Access high-quality source code, UI kits, and custom projects
              exclusively from Certicode. Fast-track your development with
              trusted, production-ready assets.
            </p>

            <div className="hero__search">
              <div className="search">
                <span className="search__icon" aria-hidden="true">
                  <img src={SearchIcon} alt="search-icon" />
                </span>
                <input
                  className="search__input"
                  placeholder={`Search by "Node.js E-commerce", "Fitness App"...`}
                />
                <button className="search__select" type="button">
                  All Categories <img src={ArrowDown} alt="moon-icon" />
                </button>
                <button className="btn btn--primary search__cta" type="button">
                  Explore
                </button>
              </div>
            </div>
          </div>

          <div className="hero__right">
            <div className="phoneOnly">
              <img
                src={Phone}
                alt="Phone mockup"
                className="phoneOnly__img"
                draggable="false"
              />

              <div className="floatBadge">
                <div className="floatBadge__icon">
                  <img src={Badge} alt="verified" />
                </div>
                <div className="floatBadge__text">
                  <div className="floatBadge__top">VERIFIED ASSETS</div>
                  <div className="floatBadge__bottom">100% Secure Code</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="logos">
        <div className="container logos__inner">
          <div className="logos__label">TRUSTED BY INDUSTRY LEADING TEAMS</div>

          <div className="logos__row">
            {items.map((item) => (
              <div className="logoItem" key={item.name}>
                <img
                  src={item.src}
                  alt={item.name}
                  className="logoItem__icon"
                  loading="lazy"
                />
                <span className="logoItem__name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats__inner">
          <div className="stat">
            <div className="stat__value">10k+</div>
            <div className="stat__label">ASSETS SOLD</div>
          </div>
          <div className="stat">
            <div className="stat__value">24/7</div>
            <div className="stat__label">GLOBAL SUPPORT</div>
          </div>
          <div className="stat">
            <div className="stat__value">99.9%</div>
            <div className="stat__label">QUALITY RATING</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

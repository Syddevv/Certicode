import React, { useEffect } from "react";
import "../../styles/landingPage.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchIcon from "../../assets/lucide_search.png";
import Badge from "../../assets/Verified.png";
import TechFlow from "../../assets/TechFlow.png";
import SkyScale from "../../assets/SkyScale.png";
import NexusAI from "../../assets/NexusAI.png";
import StackBuild from "../../assets/StackBuild.png";
import OrbitOS from "../../assets/OrbitOS.png";
import ArrowDown from "../../assets/ArrowDown.png";
import Phone from "../../assets/Phone.png";
import WebApps from "../../assets/WebsiteApps.png";
import MobileApps from "../../assets/MobileApps.png";
import UI from "../../assets/UI.png";
import CustomProjects from "../../assets/CustomProjects.png";
import Wallet from "../../assets/wallet.png";
import Lightning from "../../assets/lightning.png";
import SearchCheck from "../../assets/search-check.png";
import Avatar from "../../assets/Avatar.png";
import { useLocation } from "react-router-dom";

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace("#", "");
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const items = [
    { src: TechFlow, name: "TechFlow" },
    { src: SkyScale, name: "SkyScale" },
    { src: NexusAI, name: "NexusAI" },
    { src: StackBuild, name: "StackBuild" },
    { src: OrbitOS, name: "OrbitOS" },
  ];

  const categories = [
    {
      icon: WebApps,
      title: "Website Apps",
      desc: "Full-stack SaaS, CMS, and specialized web tools.",
    },
    {
      icon: MobileApps,
      title: "Mobile Apps",
      desc: "Cross-platform and native mobile solutions.",
    },
    {
      icon: UI,
      title: "UI/UX Design",
      desc: "Professional Figma kits and design systems.",
    },
    {
      icon: CustomProjects,
      title: "Custom Projects",
      desc: "Bespoke digital transformation services.",
    },
  ];

  const steps = [
    {
      icon: SearchCheck,
      title: "Explore & Choose",
      desc: "Browse through our curated collection of verified listings, from UI kits to full-stack applications.",
    },
    {
      icon: Wallet,
      title: "Secure Payment",
      desc: "Complete your purchase with confidence. Funds are held in a secure escrow system until you confirm receipt.",
    },
    {
      icon: Lightning,
      title: "Instant Transfer",
      desc: "Receive your files, documentation, and licenses immediately after payment verification.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Their SaaS templates saved us months of build time. The code quality was exceptional.",
      name: "Alex Johnson",
      role: "CTO, TechFlow",
      rating: 5,
      avatar: Avatar,
      featured: false,
    },
    {
      quote:
        "As a buyer, the verification process is rigorous but worth it. Best B2B marketplace out there.",
      name: "Sarah Chen",
      role: "Senior UI Designer",
      rating: 5,
      avatar: Avatar,
      featured: true,
    },
    {
      quote:
        "Support was outstanding and helped us through a complex integration. We shipped on time.",
      name: "Marcus Rodriguez",
      role: "Product Manager",
      rating: 5,
      avatar: Avatar,
      featured: false,
    },
  ];

  const faqs = [
    "How does the transfer process work?",
    "Are the assets verified?",
    "What payment methods do you accept?",
    "Is there a refund policy?",
  ];

  return (
    <div>
      <Navbar />
      <section className="hero" id="hero">
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

      <section className="categories" id="categories">
        <div className="container categories__inner">
          <div className="categories__header">
            <div>
              <h2 className="categories__title">Browse by Category</h2>
              <p className="categories__subtitle">
                Discover hand-picked premium assets tailored for every business
                need.
              </p>
            </div>
            <button className="categories__link" type="button">
              View all marketplace <span aria-hidden="true">›</span>
            </button>
          </div>

          <div className="categories__grid">
            {categories.map((card) => (
              <div className="categoryCard" key={card.title}>
                <div className="categoryCard__icon">
                  <img src={card.icon} alt="" aria-hidden="true" />
                </div>
                <div className="categoryCard__title">{card.title}</div>
                <div className="categoryCard__desc">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process" id="process">
        <div className="container process__inner">
          <h2 className="process__title">Simple. Secure. Instant.</h2>
          <p className="process__subtitle">
            Our seamless process ensures you get high-quality assets with
            complete peace of mind.
          </p>

          <div className="process__steps">
            {steps.map((step, index) => (
              <div className="processStep" key={step.title}>
                <div className="processStep__iconWrap">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="processStep__icon"
                  />
                  <span className="processStep__badge">{index + 1}</span>
                </div>
                <div className="processStep__title">{step.title}</div>
                <div className="processStep__desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container testimonials__inner">
          <div className="testimonials__header">
            <h2 className="testimonials__title">What Our Users Say</h2>
            <div className="testimonials__underline" aria-hidden="true" />
          </div>

          <div className="testimonials__grid">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className={`testimonialCard${
                  item.featured ? " testimonialCard--featured" : ""
                }`}
              >
                <div className="testimonialCard__rating" aria-hidden="true">
                  {"★".repeat(item.rating)}
                </div>
                <p className="testimonialCard__quote">"{item.quote}"</p>
                <div className="testimonialCard__meta">
                  <img
                    className="testimonialCard__avatar"
                    src={item.avatar}
                    alt={`${item.name} avatar`}
                  />
                  <div>
                    <div className="testimonialCard__name">{item.name}</div>
                    <div className="testimonialCard__role">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials__pagination" aria-label="Pagination">
            <button className="pagerDot" type="button" aria-label="Page 1" />
            <button
              className="pagerDot pagerDot--active"
              type="button"
              aria-label="Page 2"
            />
            <button className="pagerDot" type="button" aria-label="Page 3" />
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="container faq__inner">
          <h2 className="faq__title">Frequently Asked Questions</h2>
          <p className="faq__subtitle">
            Everything you need to know about the CertiCode marketplace and how
            we ensure a seamless transfer of premium digital assets.
          </p>

          <div className="faq__list">
            {faqs.map((question) => (
              <button className="faqItem" key={question} type="button">
                <span className="faqItem__text">{question}</span>
                <img
                  className="faqItem__chevron"
                  src={ArrowDown}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          <div className="faq__cta">
            <div className="faq__hint">
              Still have questions? We&apos;re here to help.
            </div>
            <button className="faq__button" type="button">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__inner">
          <div className="ctaCard">
            <div className="ctaCard__content">
              <h2 className="ctaCard__title">
                Ready to Scale Your Digital Presence?
              </h2>
              <p className="ctaCard__subtitle">
                Join thousands of businesses already using CertiCode to
                accelerate their digital transformation.
              </p>
              <button className="ctaCard__button" type="button">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

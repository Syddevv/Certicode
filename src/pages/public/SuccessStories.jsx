import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/SuccessStories.css";
import VerificationSpeed from "../../assets/VerificationSpeed.png";
import ChartBar from "../../assets/ChartBar.png";
import OrangeBadge from "../../assets/orangeBadge.png";
import OrangeArrow from "../../assets/OrangeArrow.png";
import JaneDoe from "../../assets/janedoe.png";
import SearchIcon from "../../assets/lucide_search.png";

const SuccessStories = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="stories">
      <Navbar />

      <section className="stories-hero">
        <div className="stories-hero__inner">
          <span className="stories-hero__pill">Customer Impact</span>
          <h1>
            Trusted by creators and teams
            <br />
            who value secure, verified assets
          </h1>
          <p>
            See how teams and individuals use Certicode to discover, verify, and
            confidently use production-ready digital assets.
          </p>
          <a className="stories-hero__cta" href="#stories">
            View Customer Stories
          </a>
        </div>
      </section>

      <section className="stories-spotlight" id="stories">
        <div className="stories-spotlight__inner">
          <div className="stories-spotlight__content">
            <span className="stories-spotlight__tag">Spotlight Story</span>
            <h2>
              “Certicode reduced our asset verification time by 42% while
              ensuring every purchase meets quality and licensing standards.”
            </h2>
            <p>
              Certicode enabled Global Fintech Solutions to scale asset
              verification across 14 regions, achieving 3× efficiency without
              increasing headcount.
            </p>
            <button className="stories-spotlight__link" type="button">
              Read full case study <img src={OrangeArrow} alt="" />
            </button>
          </div>

          <div className="stories-spotlight__metrics">
            <article className="stories-metric">
              <div className="stories-metric__title">
                <img src={VerificationSpeed} alt="" aria-hidden="true" />
                <span>Verification Speed</span>
              </div>
              <strong>42% Faster</strong>
              <p>Assets reviewed and approved faster than manual checks</p>
            </article>
            <article className="stories-metric">
              <div className="stories-metric__title">
                <img src={OrangeBadge} alt="" aria-hidden="true" />
                <span>Asset Quality Assurance</span>
              </div>
              <strong>100% Verified</strong>
              <p>All assets meet quality and licensing standards</p>
            </article>
            <article className="stories-metric">
              <div className="stories-metric__title">
                <img src={ChartBar} alt="" aria-hidden="true" />
                <span>Marketplace Efficiency</span>
              </div>
              <strong>3× Scale</strong>
              <p>Asset operations scaled without added overhead</p>
            </article>
          </div>
        </div>
      </section>

      <section className="stories-grid">
        <div className="stories-grid__inner">
          <div className="stories-grid__filters">
            <div className="stories-grid__tabs">
              <button className="stories-grid__tab is-active" type="button">
                All Assets
              </button>
              <button className="stories-grid__tab" type="button">
                SaaS Template
              </button>
              <button className="stories-grid__tab" type="button">
                UI Kits
              </button>
              <button className="stories-grid__tab" type="button">
                Design Systems
              </button>
            </div>
            <div className="stories-grid__search">
              <img src={SearchIcon} alt="" aria-hidden="true" />
              <input type="text" placeholder="Search by asset type..." />
            </div>
          </div>

          <div className="stories-grid__cards">
            {[
              {
                tag: "Fintech",
                title: "Scaling with the Ironclad UI Kit",
                text: "Launched a secure banking portal in 3 weeks. The pre-built security components and financial widgets saved hundreds of development hours.",
              },
              {
                tag: "SaaS",
                title: "Modernizing legacy systems",
                text: "Switched to Certicode React templates and reduced technical debt by 60%. Our refactoring phase finished 2 months ahead of schedule.",
              },
              {
                tag: "Enterprise",
                title: "Global design system sync",
                text: "Implemented the Certicode Core System across 12 product teams. Achieved universal design alignment and halved the QA cycle time.",
              },
              {
                tag: "E-commerce",
                title: "Checkout Optimization via UI Kit",
                text: "Increased mobile conversion by 22% simply by swapping custom buttons with Certicode’s conversion-optimized assets.",
              },
            ].map((story) => (
              <article key={story.title} className="stories-card">
                <div className="stories-card__media" />
                <div className="stories-card__body">
                  <span className="stories-card__tag">{story.tag}</span>
                  <h3>{story.title}</h3>
                  <p>{story.text}</p>
                  <button className="stories-card__link" type="button">
                    Read Case Study <img src={OrangeArrow} alt="" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <button className="stories-grid__more" type="button">
            Load more success stories
          </button>
        </div>
      </section>

      <section className="stories-quote">
        <div className="stories-quote__inner">
          <span className="stories-quote__mark">“</span>
          <p>
            “Certicode removed the uncertainty from buying digital assets. What
            used to take days of review is now instant and reliable.”
          </p>
          <div className="stories-quote__person">
            <img src={JaneDoe} alt="Jane Doe" />
            <div>
              <strong>Jane Doe</strong>
              <span>CTO, Global Fintech Solutions</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stories-cta">
        <div className="stories-cta__inner">
          <div className="stories-cta__card">
            <h2>Ready to create your own success story?</h2>
            <p>
              Join professionals worldwide who rely on Certicode for verified,
              production-ready digital assets.
            </p>
            <Link className="stories-cta__btn" to="/marketplace">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStories;

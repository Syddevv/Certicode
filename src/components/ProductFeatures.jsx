import React from "react";
import CoreFunctionalitiesIcon from "../assets/CoreFunctionalities.png";
import TechnicalHighlightsIcon from "../assets/TechnicalHighlights.png";
import UserAuthIcon from "../assets/UserAuth.png";
import PaymentIntegrationIcon from "../assets/PaymentIntegration.png";
import RealTimeIcon from "../assets/RealTime.png";
import AssetManagementIcon from "../assets/AssetManagement.png";
import SearchIcon from "../assets/Search.png";
import CleanCodeIcon from "../assets/CleanCode.png";

const coreFeatures = [
  {
    title: "User Authentication",
    description:
      "Complete Login, registration, and password recovery system with multi-factor...",
    icon: UserAuthIcon,
  },
  {
    title: "Payment Integration",
    description:
      "Ready-to-use Stripe and PayPal integration for subscriptions, one-time payments, and...",
    icon: PaymentIntegrationIcon,
  },
  {
    title: "Real-Time Charts",
    description:
      "Advanced data visualization powered by Chart.js with live updates.",
    icon: RealTimeIcon,
  },
  {
    title: "Asset Management",
    description:
      "Scalable file upload system with automatic image optimization, CDN distribution, and...",
    icon: AssetManagementIcon,
  },
];

const technicalHighlights = [
  {
    title: "SEO Optimized",
    description:
      "Server-side rendering and dynamic meta-tag generation for perfect search engine...",
    icon: SearchIcon,
  },
  {
    title: "Clean Code Architecture",
    description:
      "Follows SOLID principles with modular folder structures, making the codebase...",
    icon: CleanCodeIcon,
  },
  {
    title: "Performance Focused",
    description:
      "Built-in caching layers and tree-shaking assets to ensure a 90+ Lighthouse...",
    icon: SearchIcon,
  },
  {
    title: "Fully Documented",
    description:
      "Comprehensive API and codebase documentation provided, including setup...",
    icon: CleanCodeIcon,
  },
];

const ProductFeatures = () => {
  return (
    <div className="product__featuresWrap">
      <div className="product__featureSection">
        <div className="product__featureHeader">
          <div className="product__featureTitle">
            <span className="product__featureBadge">
              <img src={CoreFunctionalitiesIcon} alt="" />
            </span>
            <h3>Core Functionalities</h3>
          </div>
          <span className="product__featurePill">6 Features</span>
        </div>
        <div className="product__featureGrid">
          {coreFeatures.map((feature) => (
            <article key={feature.title} className="product__featureCard">
              <span className="product__featureIcon">
                <img src={feature.icon} alt="" />
              </span>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="product__featureSection">
        <div className="product__featureHeader">
          <div className="product__featureTitle">
            <span className="product__featureBadge product__featureBadge--dark">
              <img src={TechnicalHighlightsIcon} alt="" />
            </span>
            <h3>Technical Highlights</h3>
          </div>
          <span className="product__featurePill">Optimized</span>
        </div>
        <div className="product__featureGrid">
          {technicalHighlights.map((feature) => (
            <article key={feature.title} className="product__featureCard">
              <span className="product__featureIcon product__featureIcon--muted">
                <img src={feature.icon} alt="" />
              </span>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;

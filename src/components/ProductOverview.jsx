import React from "react";
import ReactIcon from "../assets/React.png";
import TailwindIcon from "../assets/Tailwind.png";
import TypeScriptIcon from "../assets/TypeScript.png";

const ProductOverview = () => {
  return (
    <div className="product__overview">
      <h2>E-commerce SaaS Template</h2>
      <p>
        Complete multivendor marketplace solution with admin dashboard and full
        control over vendors, products, orders, and payouts.
      </p>

      <div className="product__section">
        <h3>Tech Stack</h3>
        <div className="product__stackGrid">
          <div className="product__stackCard">
            <span>Framework</span>
            <img src={ReactIcon} alt="" />
            <strong>React 18</strong>
          </div>
          <div className="product__stackCard">
            <span>Styling</span>
            <img src={TailwindIcon} alt="" />
            <strong>Tailwind 3</strong>
          </div>
          <div className="product__stackCard">
            <span>Language</span>
            <img src={TypeScriptIcon} alt="" />
            <strong>TypeScript</strong>
          </div>
        </div>
      </div>

      <div className="product__section">
        <h3>Core Features</h3>
        <ul className="product__features">
          <li>
            <span className="product__featureDot" /> Payment integration to
            provide seamless transactions
          </li>
          <li>
            <span className="product__featureDot" /> Highly modular components
            and clear folder structure
          </li>
          <li>
            <span className="product__featureDot" /> Real-time data visualization
            with Chart.js
          </li>
          <li>
            <span className="product__featureDot" /> Full authentication flow
            (Login, Register, Forgot Password)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductOverview;

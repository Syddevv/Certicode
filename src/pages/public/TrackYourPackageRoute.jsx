import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/CustomerSupport.css";
import SearchIcon from "../../assets/Search.png";

const helpTopics = [
  "Account Setup & Registration",
  "Software Order Status",
  "Software Installation & Setup",
  "Login & Password Issues",
  "Account Recovery",
  "Returns, Refunds & Product Support",
  "Shipping and Delivery",
  "Payment, Pricing and Promotions",
  "Software, & Digital Solutions",
  "Certicode Business Accounts",
  "Other Topics",
];

const topicPaths = {
  "Account Setup & Registration": "/support/account-setup",
  "Software Installation & Setup": "/support/installation",
  "Login & Password Issues": "/support/login",
  "Returns, Refunds & Product Support": "/support/returns",
  "Shipping and Delivery": "/support/shipping",
  "Payment, Pricing and Promotions": "/support/payment",
  "Software, & Digital Solutions": "/support/software",
  "Certicode Business Accounts": "/support/business",
  "Other Topics": "/support/other",
};

const TrackYourPackageArticle = () => {
  const [helpfulVote, setHelpfulVote] = useState("");

  return (
    <div className="support-article">
      <nav className="support-breadcrumb">
        <Link to="/customer-support">Software Order Status</Link>
        <span className="breadcrumb-sep">&rsaquo;</span>
        <span className="breadcrumb-current">Track your package</span>
      </nav>

      <section className="support-article__section">
        <h2>Track your package</h2>
        <p>Learn how to track your digital delivery.</p>

        <h3>Steps:</h3>
        <ol className="support-ordered">
          <li>Go to the Certicode homepage</li>
          <li>
            Click <strong>My Account</strong>
          </li>
          <li>Enter your email address and password</li>
          <li>
            Go to <strong>My Purchases</strong>
          </li>
          <li>Select your order to view delivery status</li>
        </ol>

        <h2>Order Delivery Status</h2>
        <p>Digital products are delivered instantly after payment confirmation.</p>
        <p>Your order status may show:</p>
        <ul>
          <li>
            <strong>Processing</strong> - Payment received, preparing your download files
          </li>
          <li>
            <strong>Delivered</strong> - Files and license key available in your dashboard
          </li>
          <li>
            <strong>License Issued</strong> - Activation key successfully generated
          </li>
          <li>
            <strong>Action Required</strong> - Please verify email or payment
          </li>
        </ul>

        <p>
          If your order remains in Processing for more than 15 minutes, contact support.
        </p>

        <h2>Accessing Your Digital Files</h2>
        <p>To download your purchased assets:</p>
        <ol className="support-ordered">
          <li>Log in to your Certicode account</li>
          <li>Click My Account &rarr; My Purchases</li>
          <li>Select your purchased product</li>
          <li>
            Click <strong>Download</strong>
          </li>
        </ol>
        <p>Your license key and documentation will be available in the same section.</p>

        <h2>Verifying Your Email Address</h2>
        <p>Email verification ensures secure delivery of your digital assets.</p>
        <p>If you did not receive verification:</p>
        <ul>
          <li>Check your Spam/Junk folder</li>
          <li>Make sure your email address is correct</li>
          <li>
            Click <strong>Resend Verification Email</strong> from your profile
          </li>
        </ul>

        <div className="support-helpbox">
          <h4>Recommended help topics</h4>
          <ul>
            <li>
              <a href="#">Missing Access After Purchase</a>
            </li>
            <li>
              <a href="#">Delayed Service Activation</a>
            </li>
            <li>
              <a href="#">Missing Transaction or Tracking Details</a>
            </li>
            <li>
              <a href="#">Failed or Blocked Service Delivery</a>
            </li>
          </ul>
        </div>

        <div className="support-helpbox">
          <h4>Was this information helpful?</h4>
          <div className="support-helpful-actions">
            <button
              type="button"
              className={helpfulVote === "yes" ? "is-selected" : ""}
              onClick={() => setHelpfulVote("yes")}
            >
              Yes
            </button>
            <button
              type="button"
              className={helpfulVote === "no" ? "is-selected" : ""}
              onClick={() => setHelpfulVote("no")}
            >
              No
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const TrackYourPackageRoute = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Software Order Status");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleTopicClick = (topic) => {
    if (topic === "Software Order Status") {
      setActiveTab(topic);
      return;
    }

    if (topicPaths[topic]) {
      navigate(topicPaths[topic]);
    }
  };

  return (
    <div className="support-page">
      <Navbar />

      <section className="support-library">
        <div className="support-library__inner">
          <div className="support-library__header">
            <h2>Help &amp; Customer Support</h2>
            <div className="support-search">
              <img src={SearchIcon} alt="" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search for solutions, guides, or FAQs..."
              />
            </div>
          </div>

          <div className="support-library__grid">
            <aside className="support-topics">
              <h3>All help topics</h3>
              <ul>
                {helpTopics.map((topic) => (
                  <li
                    key={topic}
                    className={topic === activeTab ? "is-active" : ""}
                  >
                    <button type="button" onClick={() => handleTopicClick(topic)}>
                      {topic}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <TrackYourPackageArticle />
          </div>
        </div>
      </section>

      <section className="support-cta">
        <div className="support-cta__inner">
          <div className="support-cta__card">
            <h2>Need More Help?</h2>
            <p>
              If you&apos;re experiencing issues with downloads, licenses, or system
              deployment, contact:
            </p>
            <Link className="support-cta__btn" to="/contact">
              Contact Certicode
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrackYourPackageRoute;

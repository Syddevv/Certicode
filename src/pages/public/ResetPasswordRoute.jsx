import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/CustomerSupport.css";
import SupportHero from "../../assets/SupportHero.png";
import DeliveryIcon from "../../assets/Delivery.png";
import TechnicalIcon from "../../assets/TechnicalIssues.png";
import BillingIcon from "../../assets/Billing.png";
import SoftwareIcon from "../../assets/SoftwareSec.png";
import AccountIcon from "../../assets/AccountManagement.png";
import ServicesIcon from "../../assets/Services.png";
import InstallationIcon from "../../assets/Installation.png";
import DataBackupIcon from "../../assets/Data&Backup.png";
import HelpCircleIcon from "../../assets/HelpCircle.png";
import IncidentIcon from "../../assets/Incident.png";
import SearchIcon from "../../assets/Search.png";

const categories = [
  { title: "Delivery, Order,\nReturn", icon: DeliveryIcon },
  { title: "Technical Issues", icon: TechnicalIcon },
  { title: "Billing & Payments", icon: BillingIcon },
  { title: "Software & Security", icon: SoftwareIcon },
  { title: "Account Management", icon: AccountIcon },
  { title: "Services & Maintenance", icon: ServicesIcon },
  { title: "Installation & Setup", icon: InstallationIcon },
  { title: "Data & Backup", icon: DataBackupIcon },
  { title: "Something else", icon: HelpCircleIcon },
  { title: "Incident Reporting", icon: IncidentIcon },
];

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

// Cards mapped per topic — add/edit cards per topic here
const helpCardsByTopic = {
  "Software Order Status": [
    {
      title: "Track your package",
      text: "Track your packages in Your Orders.",
    },
    {
      title: "Return Items You Ordered",
      text: "Return your orders using our Online Return Center.",
    },
    {
      title: "Check status of a refund",
      text: "Track your return and refunds in Your Orders.",
    },
    {
      title: "Track Your Return",
      text: "Learn how to track your return location and status.",
    },
    {
      title: "How to Update Your Payment Method",
      text: "Keeping your payment methods up to date prevents purchase and digital service interruptions.",
    },
    {
      title: "Get Product Support",
      text: "We provide free product support when you need help using a product or if it doesn't work correctly.",
    },
    {
      title: "Custom Software Development",
      text: "Learn about our custom software services, project workflows, timelines, and support after delivery.",
    },
    {
      title: "Certicode Software Platform",
      text: "Get help using Certicode software products, including setup, features, updates, and common troubleshooting issues.",
    },
  ],
};

// Detailed content for Account Recovery (rendered as rich article, not cards)
const AccountRecoveryContent = () => (
  <div className="support-article">
    <nav className="support-breadcrumb">
      <Link to="/customer-support/">Account Recovery</Link>
      <span className="breadcrumb-sep">&rsaquo;</span>
      <span className="breadcrumb-current">Reset Your Password</span>
    </nav>

    <section className="support-article__section">
      <h2>Reset Your Password</h2>
      <p>
        Recover access to your account by resetting your password using your
        registered email address.
      </p>

      <h3>Step 1: Click Forgot Password</h3>
      <ul>
        <li>
          On the login page, click <strong>"Forgot Password?"</strong>
        </li>
        <li>
          Enter your <strong>registered email address.</strong>
        </li>
      </ul>

      <h3>Step 2: Check Your Email</h3>
      <ul>
        <li>
          Open your inbox and locate the <strong>password reset email.</strong>
        </li>
        <li>
          Click the <strong>reset link.</strong>
        </li>
      </ul>

      <h3>Step 3: Set a New Password</h3>
      <ul>
        <li>
          Enter a <strong>new password</strong> and <strong>confirm it.</strong>
        </li>
        <li>
          Press <strong>Save/Confirm.</strong>
        </li>
      </ul>

      <h3>Step 4: Log In</h3>
      <ul>
        <li>Return to the login page.</li>
        <li>
          Enter your <strong>new password.</strong>
        </li>
      </ul>

      <h4>If the Issue Persists</h4>
      <ul>
        <li>Ensure your email is correct.</li>
        <li>Check spam/junk folders.</li>
        <li>Submit a support request if needed.</li>
      </ul>
    </section>
  </div>
);

//topic cards fallback
const topicPaths = {
  "Account Setup & Registration": "/support/account-setup",
  "Software Installation & Setup": "/support/installation",
  "Login & Password Issues": "/support/login",
  "Software Order Status": "/",
  "Returns, Refunds & Product Support": "/support/returns",
  "Shipping and Delivery": "/support/shipping",
  "Payment, Pricing and Promotions": "/support/payment",
  "Software, & Digital Solutions": "/support/software",
  "Certicode Business Accounts": "/support/business",
  "Other Topics": "/support/other",
};

const ResetPasswordRoute = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Account Recovery");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleTabclick = (topic) => {
    if (topic === "Account Recovery" || helpCardsByTopic[topic]) {
      setActiveTab(topic);
    } else if (topicPaths[topic]) {
      navigate(topicPaths[topic]);
    }
  };

  const visibleCards = helpCardsByTopic[activeTab] ?? [];

  return (
    <div className="support-page">
      <Navbar />

      <section className="support-library">
        <div className="support-library__inner">
          <div className="support-library__header">
            <h2>Help & Customer Support</h2>
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
                    <button type="button" onClick={() => handleTabclick(topic)}>
                      {topic}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="support-cards">
              {activeTab === "Account Recovery" ? (
                <AccountRecoveryContent />
              ) : (
                visibleCards.map((card) => (
                  <article key={card.title} className="support-card">
                    <h4>{card.title}</h4>
                    <p>{card.text}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="support-cta">
        <div className="support-cta__inner">
          <div className="support-cta__card">
            <h2>Need Custom Software of Technical Support?</h2>
            <p>
              Our experts are ready to assist you with secure and scalable
              solutions.
            </p>
            <Link className="support-cta__btn" to="/contact">
              Contact Certicode
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPasswordRoute;

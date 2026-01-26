import React, { useEffect, useState } from "react";
import "../../styles/TermsAndCondition.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  const [activeId, setActiveId] = useState("acceptance");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleScroll = (id) => {
    setActiveId(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div>
      <Navbar />
      <section className="terms">
        <div className="terms__inner">
          <div className="terms__header">
            <div>
              <div className="terms__breadcrumb">
                <span className="terms__crumb">
                  <Link className="nav__link" to="/">
                    Home
                  </Link>
                </span>
                <span className="terms__sep">›</span>
                <span className="terms__crumb terms__crumb--active">
                  Terms &amp; Conditions
                </span>
              </div>
              <h1 className="terms__title">Terms &amp; Conditions</h1>
              <div className="terms__updated">
                Last Updated: November 31, 2025
              </div>
            </div>
            <button className="terms__download" type="button">
              <span className="terms__downloadIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path
                    d="M12 4v10m0 0l4-4m-4 4l-4-4M6 18h12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Download PDF
            </button>
          </div>

          <div className="terms__rule" aria-hidden="true" />

          <div className="terms__body">
            <aside className="terms__toc">
              <div className="terms__tocTitle">Table of Contents</div>
              <button
                className={`terms__tocItem${
                  activeId === "acceptance" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("acceptance")}
              >
                1. Acceptance of Terms
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "about" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("about")}
              >
                2. About Certicode
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "account" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("account")}
              >
                3. Account Registration
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "purchases" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("purchases")}
              >
                4. Purchases &amp; Licenses
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "payments" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("payments")}
              >
                5. Payments &amp; Invoices
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "refunds" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("refunds")}
              >
                6. Refund Policy
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "support" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("support")}
              >
                7. Asset Updates &amp; Support
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "acceptable" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("acceptable")}
              >
                8. Acceptable Use
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "intellectual" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("intellectual")}
              >
                9. Intellectual Property
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "liability" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("liability")}
              >
                10. Limitation of Liability
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "termination" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("termination")}
              >
                11. Termination
              </button>
              <button
                className={`terms__tocItem${
                  activeId === "changes" ? " terms__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("changes")}
              >
                12. Changes to Terms
              </button>
            </aside>

            <div className="terms__content">
              <section className="terms__section">
                <h2>Introduction</h2>
                <p>
                  Welcome to Certicode. These Terms and Conditions govern your
                  use of the Certicode marketplace website, services, and
                  platform. By accessing or using our platform, you agree to be
                  bound by these terms. If you do not agree to these terms,
                  please do not use our services.
                </p>
              </section>

              <section
                className={`terms__section${
                  activeId === "acceptance" ? " terms__section--active" : ""
                }`}
                id="acceptance"
              >
                <h3>1. Acceptance of Terms</h3>
                <p>
                  By registering for an account or using the Certicode
                  Marketplace, you acknowledge that you have read, understood,
                  and agree to be bound by this Agreement and our Privacy
                  Policy. We reserve the right to modify these terms at any
                  time.
                </p>
                <div className="terms__callout">
                  By using Certicode, you&apos;re agreeing to our rules. We
                  might update them, so keep an eye out.
                </div>
              </section>

              <section
                className={`terms__section${
                  activeId === "about" ? " terms__section--active" : ""
                }`}
                id="about"
              >
                <h3>2. About Certicode</h3>
                <p>
                  Certicode is a digital marketplace providing production-ready
                  digital assets, including SaaS templates, UI kits, and web
                  systems. All assets sold on the platform are owned,
                  maintained, and distributed exclusively by Certicode.
                </p>
              </section>

              <section
                className={`terms__section${
                  activeId === "account" ? " terms__section--active" : ""
                }`}
                id="account"
              >
                <h3>3. Account Registration</h3>
                <ul>
                  <li>
                    You must provide accurate and complete information when
                    creating an account.
                  </li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your login credentials.
                  </li>
                  <li>
                    You are responsible for all activities that occur under your
                    account.
                  </li>
                </ul>
              </section>

              <section
                className={`terms__section${
                  activeId === "purchases" ? " terms__section--active" : ""
                }`}
                id="purchases"
              >
                <h3>4. Purchases &amp; Licenses</h3>
                <ul>
                  <li>All purchases grant a license to use, not ownership.</li>
                  <li>
                    License terms vary per asset and are provided at the time of
                    purchase.
                  </li>
                  <li>
                    You may not resell, redistribute, or sublicense assets
                    unless explicitly permitted by the license.
                  </li>
                </ul>
                <div className="terms__callout">
                  When you buy code or a certificate, check the specific
                  license. Usually, it&apos;s for one project only.
                </div>
              </section>

              <section
                className={`terms__section${
                  activeId === "payments" ? " terms__section--active" : ""
                }`}
                id="payments"
              >
                <h3>5. Payments &amp; Invoices</h3>
                <ul>
                  <li>
                    Prices are listed in the applicable currency and may include
                    taxes where required.
                  </li>
                  <li>
                    Payments must be completed before assets can be downloaded.
                  </li>
                  <li>
                    Invoices are available in your account after successful
                    payment.
                  </li>
                </ul>
              </section>

              <section
                className={`terms__section${
                  activeId === "refunds" ? " terms__section--active" : ""
                }`}
                id="refunds"
              >
                <h3>6. Refund Policy</h3>
                <p>Due to the digital nature of our products:</p>
                <ul>
                  <li>All sales are final, unless otherwise stated.</li>
                  <li>
                    Refunds may be granted at Certicode&apos;s discretion in
                    cases of technical defects or billing errors.
                  </li>
                </ul>
              </section>

              <section
                className={`terms__section${
                  activeId === "support" ? " terms__section--active" : ""
                }`}
                id="support"
              >
                <h3>7. Asset Updates &amp; Support</h3>
                <ul>
                  <li>
                    Purchased assets may receive updates or improvements at
                    Certicode&apos;s discretion.
                  </li>
                  <li>
                    Support availability depends on the asset and support plan
                    purchased.
                  </li>
                  <li>
                    Enterprise or custom development services are subject to
                    separate agreements.
                  </li>
                </ul>
              </section>

              <section
                className={`terms__section${
                  activeId === "acceptable" ? " terms__section--active" : ""
                }`}
                id="acceptable"
              >
                <h3>8. Acceptable Use</h3>
                <p>You agree not to:</p>
                <ul>
                  <li>
                    Use Certicode assets for illegal or unauthorized purposes.
                  </li>
                  <li>
                    Reverse engineer, copy, or distribute assets beyond license
                    terms.
                  </li>
                  <li>
                    Attempt to compromise the platform&apos;s security or
                    integrity.
                  </li>
                </ul>
              </section>

              <section
                className={`terms__section${
                  activeId === "intellectual" ? " terms__section--active" : ""
                }`}
                id="intellectual"
              >
                <h3>9. Intellectual Property</h3>
                <p>
                  All content, assets, branding, and materials on Certicode are
                  the intellectual property of Certicode unless otherwise
                  stated.
                </p>
              </section>

              <section
                className={`terms__section${
                  activeId === "liability" ? " terms__section--active" : ""
                }`}
                id="liability"
              >
                <h3>10. Limitation of Liability</h3>
                <p>Certicode is not liable for:</p>
                <ul>
                  <li>Loss of data, revenue, or business interruption.</li>
                  <li>
                    Issues arising from improper implementation or modification
                    of assets.
                  </li>
                </ul>
                <p>Use of assets is at your own risk.</p>
              </section>

              <section
                className={`terms__section${
                  activeId === "termination" ? " terms__section--active" : ""
                }`}
                id="termination"
              >
                <h3>11. Termination</h3>
                <p>
                  Certicode reserves the right to suspend or terminate accounts
                  that violate these terms without prior notice.
                </p>
              </section>

              <section
                className={`terms__section${
                  activeId === "changes" ? " terms__section--active" : ""
                }`}
                id="changes"
              >
                <h3>12. Changes to Terms</h3>
                <p>
                  Certicode may update these Terms &amp; Conditions at any time.
                  Continued use of the platform constitutes acceptance of the
                  updated terms.
                </p>
              </section>

              <section className="terms__section terms__section--contact">
                <h3>Questions or Concerns?</h3>
                <p>
                  If you have any questions regarding these Terms &amp;
                  Conditions, please reach out to our legal department.
                </p>
                <div className="terms__links">
                  <a
                    className="terms__link"
                    href="mailto:support@certicode.com"
                  >
                    support@certicode.com
                  </a>
                  <a className="terms__link" href="#">
                    Help Center
                  </a>
                </div>
                <button
                  className="terms__back"
                  type="button"
                  onClick={() => handleScroll("acceptance")}
                >
                  Back to Top
                </button>
              </section>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;

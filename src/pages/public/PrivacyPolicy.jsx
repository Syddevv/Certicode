import React, { useEffect, useState } from "react";
import "../../styles/PrivacyPolicy.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import IdentityIcon from "../../assets/Identity.png";
import TechnicalIcon from "../../assets/Technical.png";
import UsageIcon from "../../assets/ChartBar.png";
import CookiesIcon from "../../assets/Cookies.png";
import PerformanceCookiesIcon from "../../assets/PerformanceCookies.png";
import RightToAccessIcon from "../../assets/RightToAccess.png";
import RightToCorrectionIcon from "../../assets/RightToCorrection.png";
import RightToDeletionIcon from "../../assets/RightToDeletion.png";
import RightToObjectIcon from "../../assets/RightToObject.png";
import NotificationIcon from "../../assets/Notification.png";
import SCCSIcon from "../../assets/SCCS.png";
import SupportEmailIcon from "../../assets/SupportEmail.png";
import HelpCenterIcon from "../../assets/HelpCenter.png";

const PrivacyPolicy = () => {
  const [activeId, setActiveId] = useState("information");

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
      <section className="policy">
        <div className="policy__inner">
          <div className="policy__header">
            <div>
              <div className="policy__breadcrumb">
                <span className="policy__crumb">
                  <Link className="nav__link" to="/">
                    Home
                  </Link>
                </span>
                <span className="policy__sep">›</span>
                <span className="policy__crumb policy__crumb--active">
                  Privacy &amp; Policy
                </span>
              </div>
              <h1 className="policy__title">Privacy &amp; Policy</h1>
              <div className="policy__updated">
                Last Updated: November 31, 2025
              </div>
            </div>
            <button className="policy__download" type="button">
              <span className="policy__downloadIcon" aria-hidden="true">
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

          <div className="policy__rule" aria-hidden="true" />

          <div className="policy__body">
            <aside className="policy__toc">
              <div className="policy__tocTitle">Table of Contents</div>
              <button
                className={`policy__tocItem${
                  activeId === "information" ? " policy__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("information")}
              >
                1. Information We Collect
              </button>
              <button
                className={`policy__tocItem${
                  activeId === "use" ? " policy__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("use")}
              >
                2. How We Use Data
              </button>
              <button
                className={`policy__tocItem${
                  activeId === "cookies" ? " policy__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("cookies")}
              >
                3. Cookies &amp; Tracking
              </button>
              <button
                className={`policy__tocItem${
                  activeId === "security" ? " policy__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("security")}
              >
                4. Data Security
              </button>
              <button
                className={`policy__tocItem${
                  activeId === "retention" ? " policy__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("retention")}
              >
                5. Data Retention
              </button>
              <button
                className={`policy__tocItem${
                  activeId === "sharing" ? " policy__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("sharing")}
              >
                6. Third-Party Sharing
              </button>
              <button
                className={`policy__tocItem${
                  activeId === "transfers" ? " policy__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("transfers")}
              >
                7. International Transfers
              </button>
              <button
                className={`policy__tocItem${
                  activeId === "rights" ? " policy__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("rights")}
              >
                8. Your Rights
              </button>
              <button
                className={`policy__tocItem${
                  activeId === "changes" ? " policy__tocItem--active" : ""
                }`}
                type="button"
                onClick={() => handleScroll("changes")}
              >
                9. Policy Changes
              </button>
            </aside>

            <div className="policy__content">
              <section className="policy__section">
                <h2>Introduction</h2>
                <p>
                  Welcome to Certicode. We respect your privacy and are
                  committed to protecting your personal data. This privacy
                  policy will inform you how we look after your personal data
                  when you visit our marketplace and tell you about your privacy
                  rights and how the law protects you.
                </p>
                <p>
                  Certicode provides a B2B infrastructure for secure digital
                  certifications. Integrity and transparency are at the core of
                  our operations. This policy applies to all users, developers,
                  and corporate entities interacting with the Certicode
                  ecosystem.
                </p>
              </section>

              <section
                className={`policy__section${
                  activeId === "information" ? " policy__section--active" : ""
                }`}
                id="information"
              >
                <h3>1. Information We Collect</h3>
                <p>
                  Certicode collects information to provide better services to
                  all our marketplace participants. We may collect, use, store,
                  and transfer different kinds of personal data about you which
                  we have grouped together as follows:
                </p>
                <div className="policy__cardGrid">
                  <div className="policy__card">
                    <span className="policy__cardIcon" aria-hidden="true">
                      <img src={IdentityIcon} alt="" />
                    </span>
                    <div>
                      <h4>Identity Data</h4>
                      <p>
                        Includes first name, last name, username or similar
                        identifier, and job title.
                      </p>
                    </div>
                  </div>
                  <div className="policy__card">
                    <span className="policy__cardIcon" aria-hidden="true">
                      <img src={TechnicalIcon} alt="" />
                    </span>
                    <div>
                      <h4>Technical Data</h4>
                      <p>
                        Includes IP address, browser type, time zone setting,
                        and platform technology.
                      </p>
                    </div>
                  </div>
                  <div className="policy__card">
                    <span className="policy__cardIcon" aria-hidden="true">
                      <img src={UsageIcon} alt="" />
                    </span>
                    <div>
                      <h4>Usage Data</h4>
                      <p>
                        Includes information about how you use our website,
                        products, and services.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className={`policy__section${
                  activeId === "use" ? " policy__section--active" : ""
                }`}
                id="use"
              >
                <h3>2. How We Use Data</h3>
                <p>
                  We will only use your personal data when the law allows us to.
                  Most commonly, we will use your personal data in the following
                  circumstances:
                </p>
                <div className="policy__subsections">
                  <div>
                    <h4>2.1 Performance of Contract</h4>
                    <p>
                      To register you as a new customer and manage our
                      relationship with you.
                    </p>
                  </div>
                  <div>
                    <h4>2.2 Legitimate Interests</h4>
                    <p>
                      To improve our website, services, marketing, and customer
                      experiences.
                    </p>
                  </div>
                  <div>
                    <h4>2.3 Legal Compliance</h4>
                    <p>
                      Where we need to comply with a legal or regulatory
                      obligation (for example, tax reporting).
                    </p>
                  </div>
                </div>
              </section>

              <section
                className={`policy__section${
                  activeId === "cookies" ? " policy__section--active" : ""
                }`}
                id="cookies"
              >
                <h3>3. Cookies &amp; Tracking</h3>
                <p>
                  We use cookies and similar tracking technologies to track the
                  activity on our marketplace and hold certain information.
                  Cookies are files with a small amount of data which may
                  include an anonymous unique identifier.
                </p>
                <div className="policy__cookieGrid">
                  <div className="policy__cookieCard">
                    <div className="policy__cookieTitle">
                      <img src={CookiesIcon} alt="" />
                      <h4>Analytics Cookies</h4>
                    </div>
                    <p>
                      Help us understand traffic and usage patterns so we can
                      improve the marketplace.
                    </p>
                  </div>
                  <div className="policy__cookieCard">
                    <div className="policy__cookieTitle">
                      <img src={PerformanceCookiesIcon} alt="" />
                      <h4>Performance Cookies</h4>
                    </div>
                    <p>
                      Allow the platform to load quickly and reliably across
                      regions.
                    </p>
                  </div>
                </div>
              </section>

              <section
                className={`policy__section${
                  activeId === "security" ? " policy__section--active" : ""
                }`}
                id="security"
              >
                <h3>4. Data Security</h3>
                <p>
                  We have put in place appropriate security measures to prevent
                  your personal data from being accidentally lost, used, or
                  accessed in an unauthorized way. Access to your personal data
                  is limited to those who have a business need to know.
                </p>
              </section>

              <section
                className={`policy__section${
                  activeId === "retention" ? " policy__section--active" : ""
                }`}
                id="retention"
              >
                <h3>5. Data Retention</h3>
                <p>
                  We will only retain your personal data for as long as
                  necessary to fulfill the purposes we collected it for,
                  including satisfying any legal, accounting, or reporting
                  requirements.
                </p>
              </section>

              <section
                className={`policy__section${
                  activeId === "sharing" ? " policy__section--active" : ""
                }`}
                id="sharing"
              >
                <h3>6. Third-Party Sharing</h3>
                <p>
                  We may share your personal data with trusted third parties who
                  provide services such as payment processing, analytics, and
                  compliance. We require all third parties to respect the
                  security of your personal data.
                </p>
              </section>

              <section
                className={`policy__section${
                  activeId === "transfers" ? " policy__section--active" : ""
                }`}
                id="transfers"
              >
                <h3>7. International Transfers</h3>
                <p>
                  We may transfer your personal data outside your country. When
                  we do, we ensure appropriate safeguards are in place to
                  protect your information.
                </p>
                <div className="policy__callout">
                  <img src={SCCSIcon} alt="" />
                  <div>
                    <h4>Standard Contractual Clauses (SCCs)</h4>
                    <p>
                      Whenever we transfer your personal data out of the EEA, we
                      ensure a similar degree of protection by implementing
                      approved safeguards.
                    </p>
                  </div>
                </div>
              </section>

              <section
                className={`policy__section${
                  activeId === "rights" ? " policy__section--active" : ""
                }`}
                id="rights"
              >
                <h3>8. Your Rights</h3>
                <p>You have the right to:</p>
                <div className="policy__rightsGrid">
                  <div className="policy__rightsCard">
                    <div className="policy__rightsTitle">
                      <img src={RightToAccessIcon} alt="" />
                      <h4>Right of Access</h4>
                    </div>
                    <p>
                      Request a copy of the personal data we hold about you.
                    </p>
                  </div>
                  <div className="policy__rightsCard">
                    <div className="policy__rightsTitle">
                      <img src={RightToCorrectionIcon} alt="" />
                      <h4>Right to Correction</h4>
                    </div>
                    <p>
                      Request that we correct any incomplete or inaccurate data.
                    </p>
                  </div>
                  <div className="policy__rightsCard">
                    <div className="policy__rightsTitle">
                      <img src={RightToDeletionIcon} alt="" />
                      <h4>Right to Deletion</h4>
                    </div>
                    <p>
                      Request that we erase your personal data where there is no
                      good reason for us continuing to process it.
                    </p>
                  </div>
                  <div className="policy__rightsCard">
                    <div className="policy__rightsTitle">
                      <img src={RightToObjectIcon} alt="" />
                      <h4>Right to Object</h4>
                    </div>
                    <p>
                      Object to processing of your personal data where we are
                      relying on a legitimate interest.
                    </p>
                  </div>
                </div>
              </section>

              <section
                className={`policy__section${
                  activeId === "changes" ? " policy__section--active" : ""
                }`}
                id="changes"
              >
                <h3>9. Policy Changes</h3>
                <p>
                  Certicode may update this Privacy Policy from time to time. We
                  will notify you of any changes by posting the new Privacy
                  Policy on this page.
                </p>
                <div className="policy__notice">
                  <img src={NotificationIcon} alt="" />
                  <div>
                    <p>
                      We may update our Privacy Policy in response to changing
                      legal, technical or business developments.
                    </p>
                    <p>
                      Notification methods: Email alerts &amp; marketplace
                      dashboard banners.
                    </p>
                  </div>
                </div>
              </section>

              <section className="policy__section policy__section--contact">
                <h3>Questions or Concerns?</h3>
                <p>
                  If you have any questions regarding this Privacy Policy,
                  please reach out to our legal department.
                </p>
                <div className="policy__links">
                  <a
                    className="policy__link"
                    href="mailto:support@certicode.com"
                  >
                    <img src={SupportEmailIcon} alt="" />
                    support@certicode.com
                  </a>
                  <a className="policy__link" href="#">
                    <img src={HelpCenterIcon} alt="" />
                    Help Center
                  </a>
                </div>
                <button
                  className="policy__back"
                  type="button"
                  onClick={() => handleScroll("information")}
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

export default PrivacyPolicy;

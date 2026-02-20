import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/TechnicalIssues.css";
// import SupportHero from "../../assets/SupportTechnical.png";
import ArrowDown from "../../assets/ArrowDown.png";

const technicalIssues = [
  {
    title: "Unable to Log in",
    details: (
      <div className="support-tech__content">
        <p>
          If you are unable to access your account, this may be caused by
          incorrect credentials, account lockout, expired sessions, or
          authentication issues.
        </p>

        <h4>
          Step 1: <span>Verify Your Credentials</span>
        </h4>
        <ul>
          <li>Ensure your email address is entered correctly.</li>
          <li>Check for typos or accidental spaces.</li>
          <li>Confirm that Caps Lock is turned off.</li>
        </ul>

        <h4>
          Step 2: <span>Reset Your Password</span>
        </h4>
        <ul>
          <li>Click "Forgot Password" on the login page.</li>
          <li>Enter your registered email address.</li>
          <li>Follow the password reset link sent to your email.</li>
          <li>Create a new strong password.</li>
        </ul>

        <h4>
          Step 3: <span>Check Two-Factor Authentication (If Enabled)</span>
        </h4>
        <ul>
          <li>Ensure you are entering the correct verification code.</li>
          <li>Confirm your authentication app is synced.</li>
          <li>Request a new code if the current one has expired.</li>
        </ul>

        <h4>
          Step 4: <span>Clear Browser Cache & Cookies</span>
        </h4>
        <ul>
          <li>Open browser settings.</li>
          <li>Clear cache and cookies.</li>
          <li>Restart your browser and try again.</li>
        </ul>

        <h4>
          Step 5: <span>Try Another Browser or Device</span>
        </h4>
        <ul>
          <li>Switch to a different browser (Chrome, Edge, Safari)</li>
          <li>Attempt login from another device.</li>
        </ul>

        <h4>
          <span>If the Issue Persists:</span>
        </h4>
        <ul>
          <li>Please submit a Technical Support Ticket</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Account Locked",
    details: (
      <div className="support-tech__content">
        <p>
          Accounts can be locked after multiple failed login attempts, unusual
          sign-in activity, or security policy triggers.
        </p>

        <h4>
          Step 1: <span>Wait for Auto-Unlock</span>
        </h4>
        <ul>
          <li>Many accounts unlock automatically after 15 to 30 minutes.</li>
          <li>Avoid repeated login attempts during this period.</li>
        </ul>

        <h4>
          Step 2: <span>Reset Your Password</span>
        </h4>
        <ul>
          <li>Click "Forgot Password" on the login page.</li>
          <li>Use your registered email to request a reset link.</li>
          <li>Create a new password not used recently.</li>
        </ul>

        <h4>
          Step 3: <span>Verify Security Details</span>
        </h4>
        <ul>
          <li>Check your email for any security alerts from Certicode.</li>
          <li>Confirm that the login attempt is from your trusted device.</li>
          <li>Complete any required verification challenge.</li>
        </ul>

        <h4>
          <span>If the Issue Persists:</span>
        </h4>
        <ul>
          <li>Submit a Technical Support Ticket for manual account review.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Error Message Appears",
    details: (
      <div className="support-tech__content">
        <p>
          Error messages may result from network instability, outdated browser
          data, unsupported versions, or temporary service interruptions.
        </p>

        <h4>
          Step 1: <span>Read and Capture the Error</span>
        </h4>
        <ul>
          <li>Note the exact error text or code shown on screen.</li>
          <li>Take a screenshot so support can diagnose faster.</li>
        </ul>

        <h4>
          Step 2: <span>Refresh and Retry</span>
        </h4>
        <ul>
          <li>Refresh the page and repeat the action once.</li>
          <li>Avoid opening multiple tabs for the same task.</li>
        </ul>

        <h4>
          Step 3: <span>Clear Cache or Use Incognito Mode</span>
        </h4>
        <ul>
          <li>Clear browser cache and cookies.</li>
          <li>Retry in a private/incognito window.</li>
          <li>Try another supported browser if needed.</li>
        </ul>

        <h4>
          Step 4: <span>Check Connection and Updates</span>
        </h4>
        <ul>
          <li>Confirm your internet connection is stable.</li>
          <li>Update your browser to the latest version.</li>
          <li>Disable conflicting extensions temporarily.</li>
        </ul>

        <h4>
          <span>If the Issue Persists:</span>
        </h4>
        <ul>
          <li>
            Contact support with the error code, screenshot, and time of
            occurrence.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "Slow Performance or System Freezing",
    details: (
      <div className="support-tech__content">
        <p>
          Slow loading or freezing can happen because of high system usage, low
          memory, browser issues, or temporary server load.
        </p>

        <h4>
          Step 1: <span>Close Unused Apps and Tabs</span>
        </h4>
        <ul>
          <li>Close background programs consuming CPU or memory.</li>
          <li>Keep only the necessary Certicode tab open.</li>
        </ul>

        <h4>
          Step 2: <span>Restart Browser or Device</span>
        </h4>
        <ul>
          <li>Restart your browser and try again.</li>
          <li>Reboot your device if freezing continues.</li>
        </ul>

        <h4>
          Step 3: <span>Check Browser Health</span>
        </h4>
        <ul>
          <li>Update your browser to the latest stable release.</li>
          <li>Disable heavy or unnecessary extensions.</li>
          <li>Clear temporary browser data.</li>
        </ul>

        <h4>
          Step 4: <span>Test Network and Device Capacity</span>
        </h4>
        <ul>
          <li>Run a quick speed test to verify connection quality.</li>
          <li>Check available RAM and disk space on your device.</li>
          <li>Try from another device or network for comparison.</li>
        </ul>

        <h4>
          <span>If the Issue Persists:</span>
        </h4>
        <ul>
          <li>
            Send diagnostics details (browser, device, and screenshots) to
            Technical Support.
          </li>
        </ul>
      </div>
    ),
  },
];

const TechnicalIssues = () => {
  const [openIssue, setOpenIssue] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="support-page">
      <Navbar />

      <section className="support-tech">
        <div className="support-tech__hero">
          {/* <img src={SupportHero} alt="Technical support" /> */}
          <div className="support-tech__heroText"></div>
        </div>

        <div className="support-tech__inner">
          <Link to="/customer-support" className="support-tech__backLink">
            <img
              src={ArrowDown}
              alt=""
              aria-hidden="true"
              className="support-tech__backIcon"
            />
            Back to Customer Support Page
          </Link>

          <h3>Technical Issues</h3>

          <div className="support-tech__list">
            {technicalIssues.map((issue, index) => {
              const isOpen = openIssue === index;
              return (
                <article key={issue.title} className="support-tech__item">
                  <button
                    type="button"
                    className="support-tech__trigger"
                    onClick={() => setOpenIssue(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{issue.title}</span>
                    <img
                      src={ArrowDown}
                      alt=""
                      aria-hidden="true"
                      className={`support-tech__icon${isOpen ? " is-open" : ""}`}
                    />
                  </button>
                  {isOpen && issue.details && (
                    <div className="support-tech__details">{issue.details}</div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="support-cta">
        <div className="support-cta__inner">
          <div className="support-cta__card">
            <h2>Need More Help?</h2>
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

      <Footer />
    </div>
  );
};

export default TechnicalIssues;

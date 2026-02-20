import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/TechnicalIssues.css";
import SupportHero from "../../assets/SupportHero.png";
import ArrowDown from "../../assets/ArrowDown.png";

const billingIssues = [
  {
    title: "Failed or Declined Payment",
    details: (
      <div className="support-tech__content">
        <p>
          A payment may fail due to expired cards, insufficient funds, incorrect
          billing details, or authorization restrictions.
        </p>

        <h4>
          Step 1: <span>Check Card Details</span>
        </h4>
        <ul>
          <li>Confirm the card number is entered correctly.</li>
          <li>Verify expiration date and CVV.</li>
          <li>Ensure the billing name matches the card.</li>
        </ul>

        <h4>
          Step 2: <span>Verify Billing Address</span>
        </h4>
        <ul>
          <li>Make sure the billing address matches your bank records.</li>
          <li>Update your address if necessary.</li>
        </ul>

        <h4>
          Step 3: <span>Check Available Funds</span>
        </h4>
        <ul>
          <li>Confirm there are sufficient funds in your account.</li>
          <li>Contact your bank to ensure the transaction was not blocked.</li>
        </ul>

        <h4>
          Step 4: <span>Retry the Payment</span>
        </h4>
        <ul>
          <li>Go to Billing Settings.</li>
          <li>Click "Retry Payment" or "Pay Now".</li>
        </ul>

        <h4>
          Step 5: <span>Use an Alternative Payment Method (Optional)</span>
        </h4>
        <ul>
          <li>Add a new credit/debit card.</li>
          <li>Use an alternative supported payment option.</li>
        </ul>

        <h4>
          <span>If the Issue Persists:</span>
        </h4>
        <ul>
          <li>Submit a Billing Support Request.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Incorrect or Unexpected Charges",
    details: (
      <div className="support-tech__content">
        <p>
          Unexpected charges may come from auto-renewals, duplicate
          transactions, taxes, or pending authorizations.
        </p>

        <h4>
          Step 1: <span>Review Your Billing History</span>
        </h4>
        <ul>
          <li>Open your account Billing History.</li>
          <li>Check invoice dates, line items, and tax details.</li>
        </ul>

        <h4>
          Step 2: <span>Check Subscription Status</span>
        </h4>
        <ul>
          <li>Confirm if auto-renewal is enabled.</li>
          <li>Verify if a plan upgrade or add-on was applied.</li>
        </ul>

        <h4>
          Step 3: <span>Look for Pending or Duplicate Charges</span>
        </h4>
        <ul>
          <li>Some bank holds appear temporarily and then disappear.</li>
          <li>Compare transaction IDs to identify duplicates.</li>
        </ul>

        <h4>
          <span>If the Issue Persists:</span>
        </h4>
        <ul>
          <li>
            Contact Billing Support with your invoice number and transaction
            screenshot.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "Refund Request",
    details: (
      <div className="support-tech__content">
        <p>
          Refund eligibility depends on purchase type, subscription terms, and
          how long ago the transaction was completed.
        </p>

        <h4>
          Step 1: <span>Check Refund Policy</span>
        </h4>
        <ul>
          <li>Review the refund terms for your product or plan.</li>
          <li>Confirm your purchase is within the refund window.</li>
        </ul>

        <h4>
          Step 2: <span>Submit a Refund Request</span>
        </h4>
        <ul>
          <li>Go to Billing & Payments in your account settings.</li>
          <li>Select the transaction and click "Request Refund".</li>
          <li>Provide a short reason for the request.</li>
        </ul>

        <h4>
          Step 3: <span>Track Request Status</span>
        </h4>
        <ul>
          <li>Monitor the request under Billing Support Tickets.</li>
          <li>Refund processing time may vary by payment provider.</li>
        </ul>

        <h4>
          <span>If the Issue Persists:</span>
        </h4>
        <ul>
          <li>Contact support with the payment reference and invoice ID.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Subscription & Plan Changes",
    details: (
      <div className="support-tech__content">
        <p>
          You can update billing cycles, switch plans, or cancel renewals from
          your account billing settings.
        </p>

        <h4>
          Step 1: <span>Open Plan Management</span>
        </h4>
        <ul>
          <li>Go to Account Settings, then Billing & Payments.</li>
          <li>Choose "Manage Subscription".</li>
        </ul>

        <h4>
          Step 2: <span>Upgrade, Downgrade, or Change Billing Cycle</span>
        </h4>
        <ul>
          <li>Select the preferred plan tier.</li>
          <li>Choose monthly or annual billing, if available.</li>
          <li>Review prorated charges before confirming.</li>
        </ul>

        <h4>
          Step 3: <span>Confirm Effective Date</span>
        </h4>
        <ul>
          <li>Some changes apply immediately; others apply next cycle.</li>
          <li>Check your confirmation email for exact timing.</li>
        </ul>

        <h4>
          <span>If the Issue Persists:</span>
        </h4>
        <ul>
          <li>Submit a Billing Support Ticket for manual assistance.</li>
        </ul>
      </div>
    ),
  },
];

const BillingPayments = () => {
  const [openIssue, setOpenIssue] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="support-page">
      <Navbar />

      <section className="support-tech">
        <div className="support-tech__hero">
          <img src={SupportHero} alt="Billing and payments support" />
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

          <h3>Billing & Payments</h3>

          <div className="support-tech__list">
            {billingIssues.map((issue, index) => {
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

export default BillingPayments;

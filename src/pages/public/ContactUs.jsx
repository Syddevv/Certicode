import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/ContactUs.css";
import CerticodeLogo from "../../assets/certicodeicon.png";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="contact-page">
      <Navbar />
      <section className="contact">
        <div className="contact__inner">
          <div className="contact-card">
            <div className="contact-card__top">
              <img
                className="contact-card__logo"
                src={CerticodeLogo}
                alt="certicode"
              />
              <Link className="contact-card__close" to="/" aria-label="Close">
                ×
              </Link>
            </div>

            <div className="contact-card__header">
              <h1>Contact Us</h1>
              <p>
                Have questions about our software or services? Get in touch with
                the Certicode team and we&apos;ll respond as soon as possible.
              </p>
            </div>

            <form className="contact-form">
              <div className="contact-form__row">
                <label className="contact-field" htmlFor="first-name">
                  <span>First Name</span>
                  <input
                    id="first-name"
                    type="text"
                    placeholder="Enter your first name"
                  />
                </label>
                <label className="contact-field" htmlFor="last-name">
                  <span>Last Name</span>
                  <input
                    id="last-name"
                    type="text"
                    placeholder="Enter your last name"
                  />
                </label>
              </div>

              <label className="contact-field" htmlFor="email">
                <span>Email Address</span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                />
              </label>

              <label className="contact-field" htmlFor="phone">
                <span>
                  Phone Number <em>(Optional)</em>
                </span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                />
              </label>

              <label className="contact-field" htmlFor="company">
                <span>
                  Company / Organization <em>(Optional)</em>
                </span>
                <input
                  id="company"
                  type="text"
                  placeholder="Enter company name"
                />
              </label>

              <label className="contact-field" htmlFor="subject">
                <span>Subject</span>
                <select id="subject" defaultValue="">
                  <option value="" disabled>
                    Select the subject
                  </option>
                  <option>Sales Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing &amp; Payments</option>
                  <option>Partnerships</option>
                </select>
              </label>

              <label className="contact-field" htmlFor="message">
                <span>Message</span>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Type your message here..."
                />
              </label>

              <div className="contact-upload">
                <button className="contact-upload__btn" type="button">
                  Upload files (optional)
                </button>
                <p>Supported formats: PNG, JPEG, PDF (Max 10MB)</p>
              </div>

              <div className="contact-priority">
                <span>
                  Priority Level <em>(Optional)</em>
                </span>
                <div className="contact-priority__options">
                  <label className="contact-radio">
                    <input type="radio" name="priority" defaultChecked />
                    <span>Low - General question</span>
                  </label>
                  <label className="contact-radio">
                    <input type="radio" name="priority" />
                    <span>Medium - Needs assistance</span>
                  </label>
                  <label className="contact-radio">
                    <input type="radio" name="priority" />
                    <span>High - Urgent concern</span>
                  </label>
                </div>
              </div>

              <button className="contact-submit" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;

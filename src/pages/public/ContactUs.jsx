import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/ContactUs.css";
import CerticodeLogo from "../../assets/certicodeicon.png";
import { SupportTicketAPI } from "../../services/SupportTicketAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    priority: "low",
    attachment: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    const fieldMap = {
      "first-name": "firstName",
      "last-name": "lastName",
      "email": "email",
      "phone": "phone", 
      "company": "company",
      "subject": "subject",
      "message": "message"
    };

    if (fieldMap[id]) {
      setFormData(prev => ({
        ...prev,
        [fieldMap[id]]: value
      }));
    }
  };

  const handlePriorityChange = (e) => {
    setFormData(prev => ({
      ...prev,
      priority: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        attachment: e.target.files[0],
      }));
    }
  };

  const triggerFileInput = () => {
    document.getElementById("file-upload").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      showErrorToast("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    const categoryMap = {
      "Sales Inquiry": "Technical",
      "Technical Support": "Technical",
      "Billing & Payments": "Billing",
      "Partnerships": "API",
    };

    try {
      const ticketData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || '',
        company: formData.company || '',
        subject: formData.subject,
        message: formData.message,
        category: categoryMap[formData.subject] || "Technical",
        priority: formData.priority,
        attachment: formData.attachment
      };

      const response = await SupportTicketAPI.createTicket(ticketData);
      
      showSuccessToast(`Ticket created successfully! Your ticket ID: ${response.ticket_id}`);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
        priority: "low",
        attachment: null,
      });

      // Reset radio buttons
      document.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.value === "low") radio.checked = true;
      });
      
      // Reset select
      document.getElementById("subject").value = "";
      
    } catch (error) {
      console.error('Ticket creation error:', error);
      showErrorToast(error.message || "Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__row">
                <label className="contact-field" htmlFor="first-name">
                  <span>First Name</span>
                  <input
                    id="first-name"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label className="contact-field" htmlFor="last-name">
                  <span>Last Name</span>
                  <input
                    id="last-name"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>

              <label className="contact-field" htmlFor="email">
                <span>Email Address</span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
                  value={formData.phone}
                  onChange={handleInputChange}
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
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </label>

              <label className="contact-field" htmlFor="subject">
                <span>Subject</span>
                <select 
                  id="subject" 
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
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
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <div className="contact-upload">
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.pdf"
                />
                <button 
                  className="contact-upload__btn" 
                  type="button"
                  onClick={triggerFileInput}
                >
                  {formData.attachment ? formData.attachment.name : "Upload files (optional)"}
                </button>
                <p>Supported formats: PNG, JPEG, PDF (Max 10MB)</p>
              </div>

              <div className="contact-priority">
                <span>
                  Priority Level <em>(Optional)</em>
                </span>
                <div className="contact-priority__options">
                  <label className="contact-radio">
                    <input 
                      type="radio" 
                      name="priority" 
                      value="low"
                      checked={formData.priority === "low"}
                      onChange={handlePriorityChange}
                    />
                    <span>Low - General question</span>
                  </label>
                  <label className="contact-radio">
                    <input 
                      type="radio" 
                      name="priority" 
                      value="medium"
                      checked={formData.priority === "medium"}
                      onChange={handlePriorityChange}
                    />
                    <span>Medium - Needs assistance</span>
                  </label>
                  <label className="contact-radio">
                    <input 
                      type="radio" 
                      name="priority" 
                      value="high"
                      checked={formData.priority === "high"}
                      onChange={handlePriorityChange}
                    />
                    <span>High - Urgent concern</span>
                  </label>
                </div>
              </div>

              <button 
                className="contact-submit" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
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

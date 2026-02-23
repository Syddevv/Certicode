import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/CustomService.css";
import diamond from "../../assets/diamond.png";
import integration from "../../assets/integration.png";
import automation from "../../assets/automation.png";
import CodeIcon from "../../assets/Code.png";
import enterprise from "../../assets/enterprise.png";
import EnterpriseSecurity from "../../assets/EnterpriseSecurity.png";
import SearchCheck from "../../assets/search-check.png";
import schedule_line from "../../assets/schedule_line.png";
import DesignDev from "../../assets/DesignDev.png";
import Maintenance from "../../assets/Maintenance.png";
import orangeSettings from "../../assets/orangesettings.png";
import Avatar from "../../assets/Avatar.png";
import TestDep from "../../assets/TestDep.png";


const offerCards = [
  {
    icon: diamond,
    title: "Custom Features",
    description: "Build unique functionality for your application.",
  },
  {
    icon: integration,
    title: "System Integrations",
    description: "Connect with CRM, ERP, payment gateways, and more.",
  },
  {
    icon: automation,
    title: "Workflow Automation",
    description: "Streamline processes to save time and reduce errors.",
  },
  {
    icon: CodeIcon,
    title: "API Development & Enhancements",
    description: "Extend capabilities and integrate seamlessly.",
  },
  {
    icon: enterprise,
    title: "Enterprise Solutions",
    description: "Scalable, secure, and robust systems for large organizations.",
  },
  {
    icon: EnterpriseSecurity,
    title: "Enterprise-Grade Security",
    description: "Build with security and scalability in mind.",
  },
];

const processSteps = [
  {
    icon: SearchCheck,
    title: "Consultation & Requirement Analysis",
    description:
      "Understand business goals, system requirements, and technical scope.",
  },
  {
    icon: schedule_line,
    title: "Proposal & Project Planning",
    description: "Define project scope, timeline, deliverables, and pricing structure.",
  },
  {
    icon: DesignDev,
    title: "Design & Development",
    description: "UI/UX design and agile development with regular progress updates.",
  },
  {
    icon: TestDep,
    title: "Testing & Deployment",
    description: "Comprehensive quality testing and secure system deployment.",
  },
  {
    icon: Maintenance,
    title: "Ongoing Support & Maintenance",
    description: "Continuous improvements, updates, and long-term technical support.",
  },
];

const testimonials = [
  {
    quote:
      "For a regional bank, we launched a secure banking portal in just 3 weeks using pre-built UI components.",
    name: "Sarah Chen",
    role: "Senior UI Designer",
    featured: true,
  },
  {
    quote:
      "The support team at CertiCode helped us through a complex integration from project start to launch.",
    name: "Marcus Rodriguez",
    role: "Product Manager",
    featured: false,
  },
  {
    quote:
      "Their custom SaaS build saved our team months of development time and passed enterprise review quickly.",
    name: "Alex Johnson",
    role: "CTO, TechFlow",
    featured: false,
  },
];

const CustomService = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(1); // default to center
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />

      <section className="customService__hero">
        <div className="customService__container customService__heroInner">
          <h1>Custom-Built Systems. Scalable. Secure. Enterprise-Ready.</h1>
          <p>
            Need more than a ready-made asset? CertiCode delivers customized digital
            solutions designed specifically for your business goals, workflows, and
            scale.
          </p>
          <Link to="/contact" className="customService__heroBtn">
            Request a Consultation
          </Link>
        </div>
      </section>

      <section className="customService__offers">
        <div className="customService__container">
          <div className="customService__heading">
            <h2>What We Offer</h2>
            <span aria-hidden="true" />
          </div>
          <div className="customService__grid">
            {offerCards.map((card) => (
              <article className="customService__card" key={card.title}>
                <div className="customService__iconWrap">
                  <img src={card.icon} alt="" aria-hidden="true" />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="customService__process">
        <div className="customService__container">
          <div className="customService__heading">
            <h2>Our Development Process</h2>
            <p>
              A structured and transparent approach to delivering high-quality
              enterprise solutions.
            </p>
          </div>
          <div className="customService__timeline">
            {processSteps.map((step, index) => (
              <article className="customService__step" key={step.title}>
                <div className="customService__stepIcon">
                  <img src={step.icon} alt="" aria-hidden="true" />
                  <span>{index + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="customService__testimonials">
        <div className="customService__container">
          <div className="customService__heading">
            <h2>What Our Users Say</h2>
            <span aria-hidden="true" />
          </div>
          <div className="customService__testimonialGrid">
            {testimonials.map((item, idx) => (
              <article
                key={item.name}
                className={`customService__testimonial${selectedTestimonial === idx ? " customService__testimonial--featured" : ""}`}
                onClick={() => setSelectedTestimonial(idx)}
                style={{ cursor: "pointer" }}
              >
                <div className="customService__stars">★★★★★</div>
                <p>"{item.quote}"</p>
                <div className="customService__author">
                  <img src={Avatar} alt={`${item.name} avatar`} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="customService__cta">
        <div className="customService__container">
          <div className="customService__ctaCard">
            <img src={orangeSettings} alt="" aria-hidden="true" />
            <h2>Ready to Build Your Custom Solution?</h2>
            <p>Share your needs with us, and we&apos;ll craft a solution that fits perfectly.</p>
            <Link to="/contact">Request a Consultation</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomService;

import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/BlogsNewsIndividual.css";
import BlogImage from "../../assets/BlogImage.png";
import CerticodeProfile from "../../assets/CerticodeProfile.png";
import OrangeArrow from "../../assets/OrangeArrow.png";

const BlogsNewsIndividual = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const related = [
    {
      type: "Blog",
      title: "How Secure Software Protects Your Business in 2025",
      date: "Jan 24, 2026",
    },
    {
      type: "Blog",
      title: "How Secure Software Protects Your Business in 2025",
      date: "Jan 24, 2026",
    },
    {
      type: "News",
      title: "Certicode Launches New Cybersecurity Services for SMEs",
      date: "Jan 24, 2026",
    },
    {
      type: "Blog",
      title: "How Secure Software Protects Your Business in 2025",
      date: "Jan 24, 2026",
    },
  ];

  return (
    <div className="blog-detail">
      <Navbar />

      <section className="blog-detail__hero">
        <div className="blog-detail__heroInner">
          <h1 className="blog-detail__heroTitle">
            Blog & <span>News</span>
          </h1>
        </div>
      </section>

      <section className="blog-detail__content">
        <div className="blog-detail__inner">
          <span className="blog-detail__tag">Blog</span>
          <h2>How Secure Software Protects Your Business in 2025</h2>
          <p className="blog-detail__subtitle">
            Why modern security-first development is essential for protecting
            data, customers, and operations.
          </p>

          <div className="blog-detail__imageWrap">
            <img src={BlogImage} alt="Secure software illustration" />
          </div>

          <div className="blog-detail__meta">
            <div className="blog-detail__author">
              <img src={CerticodeProfile} alt="Certicode team" />
              <div>
                <span>By Certicode Team</span>
              </div>
            </div>
            <div className="blog-detail__date">
              <span>August 22, 2025</span>
              <span className="blog-detail__read">6 min read</span>
            </div>
          </div>

          <div className="blog-detail__body">
            <p>
              In today’s digital-first world, businesses rely heavily on
              software systems to manage operations, store sensitive data, and
              deliver services to customers. As cyber threats continue to grow
              in complexity, securing these systems has become a critical
              business priority rather than a technical afterthought. Secure
              software protects not only your digital assets but also your brand
              reputation, customer trust, and long-term growth.
            </p>

            <h3>What Is Secure Software?</h3>
            <p>
              Secure software is designed and developed with security measures
              integrated at every stage of the development lifecycle. This
              includes secure coding practices, vulnerability testing,
              encryption, and access control mechanisms. Rather than reacting to
              threats after deployment, secure software proactively prevents
              vulnerabilities from being exploited.
            </p>

            <h3>Common Security Risks Businesses Face</h3>
            <p>Many businesses unknowingly expose themselves to risks such as:</p>
            <ul>
              <li>Weak authentication systems</li>
              <li>Unencrypted data storage</li>
              <li>Poor access control</li>
              <li>Outdated software components</li>
              <li>Lack of regular security audits</li>
            </ul>
            <p>
              These vulnerabilities can lead to data breaches, service downtime,
              and financial losses.
            </p>

            <h3>Best Practices for Secure Software Development</h3>
            <p>To ensure strong protection, businesses should adopt:</p>
            <ul>
              <li>Secure coding standards</li>
              <li>Regular vulnerability testing</li>
              <li>Role-based access control</li>
              <li>Encrypted communication (SSL/TLS)</li>
              <li>Continuous monitoring and updates</li>
            </ul>
            <p>
              Partnering with a trusted software provider ensures these
              practices are properly implemented.
            </p>

            <h3>Why Businesses Trust Certicode</h3>
            <p>
              Certicode builds software solutions with security at the core. Our
              development process includes risk assessment, secure architecture
              design, and continuous testing to ensure systems remain protected
              against evolving threats.
            </p>
            <p>
              Whether you need custom software, system upgrades, or security
              enhancements, Certicode delivers solutions you can trust.
            </p>
          </div>
        </div>
      </section>

      <section className="blog-detail__related">
        <div className="blog-detail__relatedInner">
          <div className="blog-detail__relatedCol">
            <h4>Related Articles</h4>
            <div className="blog-detail__relatedGrid">
              {related.map((item, index) => (
                <article key={`${item.title}-${index}`} className="mini-card">
                  <div className="mini-card__media" />
                  <div className="mini-card__body">
                    <span className="mini-card__tag">{item.type}</span>
                    <h5>{item.title}</h5>
                    <span className="mini-card__date">{item.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="blog-detail__next">
            <h4>Up Next</h4>
            <article className="next-card">
              <div className="next-card__media" />
              <div className="next-card__body">
                <span className="mini-card__tag">Blog</span>
                <h5>Beginner’s Guide to Web Application Security</h5>
                <p>
                  Learn the fundamentals of securing your web apps, from
                  authentication to encryption and vulnerability testing...
                </p>
                <button className="next-card__link" type="button">
                  Read More <img src={OrangeArrow} alt="" aria-hidden="true" />
                </button>
                <span className="mini-card__date">Jan 24, 2026</span>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogsNewsIndividual;

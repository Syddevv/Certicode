import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/SuccessStoryIronclad.css";
import BlogImage from "../../assets/BlogImage.png";
import CerticodeProfile from "../../assets/CerticodeProfile.png";

const relatedStories = [
  {
    tag: "Fintech",
    title: "How Secure Software Protects Your Business in 2025",
    date: "Jan 24, 2026",
  },
  {
    tag: "Fintech",
    title: "How Secure Software Protects Your Business in 2025",
    date: "Jan 24, 2026",
  },
  {
    tag: "Fintech",
    title: "How Secure Software Protects Your Business in 2025",
    date: "Jan 24, 2026",
  },
  {
    tag: "Fintech",
    title: "How Secure Software Protects Your Business in 2025",
    date: "Jan 24, 2026",
  },
];

const SuccessStoryIronclad = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="ironclad-case">
      <Navbar />

      <section className="ironclad-case__header">
        <div className="ironclad-case__headerInner">
          <h1>
            SUCCESS <span>STORIES</span>
          </h1>
        </div>
      </section>

      <section className="ironclad-case__content">
        <div className="ironclad-case__inner">
          <span className="ironclad-case__tag">FINTECH</span>
          <h2>Scaling Securely with the Ironclad UI Kit</h2>
          <p className="ironclad-case__subtitle">
            Accelerating Time-to-Market with Secure, Modular Design
          </p>

          <div className="ironclad-case__heroImage">
            <img src={BlogImage} alt="Secure software case study" />
          </div>

          <div className="ironclad-case__meta">
            <div className="ironclad-case__author">
              <img src={CerticodeProfile} alt="Certicode team" />
              <span>By Certicode Team</span>
            </div>
            <div className="ironclad-case__date">
              <span>August 22, 2025</span>
              <span>6 min read</span>
            </div>
          </div>

          <div className="ironclad-case__divider" />

          <article className="ironclad-case__body">
            <p>
              In today&apos;s fast-paced digital world, financial institutions
              need to deliver secure and reliable online services without
              sacrificing speed. Leveraging the Ironclad UI Kit, our team
              successfully launched a fully secure banking portal in just three
              weeks, demonstrating the power of pre-built design systems in
              accelerating development.
            </p>

            <h3>Why Ironclad UI Kit?</h3>
            <p>
              The Ironclad UI Kit is packed with security-first components and
              financial widgets, designed specifically for fintech applications.
              These ready-made elements allowed our developers to bypass
              repetitive coding tasks and focus on crafting a seamless user
              experience. From authentication modules to transaction dashboards,
              every component is optimized for security and compliance, ensuring
              that sensitive customer data is protected at every touchpoint.
            </p>

            <h3>Time and Efficiency Gains</h3>
            <p>
              By integrating the UI kit, we saved hundreds of development
              hours, reduced potential for bugs, and delivered a polished,
              production-ready portal faster than traditional approaches. This
              case highlights how thoughtful use of pre-built tools can
              streamline development, enhance security, and speed
              time-to-market-critical factors for any organization operating in
              the competitive fintech landscape.
            </p>

            <h3>The Outcome</h3>
            <p>
              One of our clients, a regional bank looking to modernize their
              online services, approached us with a tight deadline and high
              security requirements. By using the Ironclad UI Kit, we were able
              to deliver a fully functional portal ahead of schedule, with
              features such as real-time account monitoring, secure transaction
              processing, and customizable dashboards. The client reported
              immediate improvements in customer engagement and operational
              efficiency, showcasing how pre-built UI solutions can transform
              ambitious projects into tangible success.
            </p>

            <h3>Why it Works</h3>
            <p>
              This project succeeded because it leveraged pre-built UI systems
              that combine security, efficiency, and user-focused design. The
              Ironclad UI Kit allowed the team to deliver a secure,
              user-friendly banking portal on an ambitious timeline without
              compromising quality. By reusing ready-made components and
              financial widgets, development was faster, more reliable, and
              focused on enhancing the customer experience. The result is a
              portal that not only met but exceeded expectations, demonstrating
              how the right tools can transform tight deadlines into remarkable
              success.
            </p>

            <p>
              Whether you need custom software, system upgrades, or security
              enhancements, Certicode delivers solutions you can trust.
            </p>
          </article>
        </div>
      </section>

      <section className="ironclad-case__related">
        <div className="ironclad-case__relatedInner">
          <h4>MORE LIKE THIS</h4>
          <div className="ironclad-case__relatedGrid">
            {relatedStories.map((story, index) => (
              <article key={`${story.title}-${index}`} className="ironclad-mini">
                <div className="ironclad-mini__media" />
                <div className="ironclad-mini__body">
                  <span>{story.tag}</span>
                  <h5>{story.title}</h5>
                  <small>{story.date}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStoryIronclad;

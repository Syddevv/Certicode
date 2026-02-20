import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/SuccessStoryGlobalFintech.css";
// import GlobalFintech from "../../assets/GlobalFintech.png";
import CerticodeProfile from "../../assets/CerticodeProfile.png";

const relatedStories = [
  {
    tag: "Case Study",
    title: "How Secure Software Protects Your Business in 2025",
    date: "Jan 24, 2026",
  },
  {
    tag: "Case Study",
    title: "How Secure Software Protects Your Business in 2025",
    date: "Jan 24, 2026",
  },
  {
    tag: "Case Study",
    title: "How Secure Software Protects Your Business in 2025",
    date: "Jan 24, 2026",
  },
  {
    tag: "Case Study",
    title: "How Secure Software Protects Your Business in 2025",
    date: "Jan 24, 2026",
  },
];

const SuccessStoryGlobalFintech = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="global-fintech-case">
      <Navbar />

      <section className="global-fintech-case__header">
        <div className="global-fintech-case__headerInner">
          <h1>
            SUCCESS <span>STORIES</span>
          </h1>
        </div>
      </section>

      <section className="global-fintech-case__content">
        <div className="global-fintech-case__inner">
          <span className="global-fintech-case__tag">SPOTLIGHT STORY</span>
          <h2>
            How Certicode Helped Global Fintech Solutions Scale Asset
            Verification by 3x
          </h2>
          <p className="global-fintech-case__subtitle">
            Certicode reduced our asset verification time by 42% while ensuring
            every purchase meets quality and licensing standards
          </p>

          <div className="global-fintech-case__heroImage">
            {/* <img src={GlobalFintech} alt="Global fintech team reviewing asset verification dashboards" /> */}
          </div>

          <div className="global-fintech-case__meta">
            <div className="global-fintech-case__author">
              <img src={CerticodeProfile} alt="Certicode team" />
              <span>By Certicode Team</span>
            </div>
            <div className="global-fintech-case__date">
              <span>August 22, 2025</span>
              <span>6 min read</span>
            </div>
          </div>

          <div className="global-fintech-case__divider" />

          <article className="global-fintech-case__body">
            <p>
              In the fast-paced world of fintech, speed and accuracy are
              critical. For Global Fintech Solutions, managing digital and
              physical assets across 14 regions presented a growing challenge.
              Manual verification processes were slowing approvals, increasing
              operational overhead, and limiting the company&apos;s ability to
              scale efficiently.
            </p>

            <p>
              To stay ahead, the company needed a solution that could streamline
              asset verification, maintain strict quality and licensing
              standards, and scale operations without adding headcount. That
              solution came in the form of Certicode.
            </p>

            <h3>When Manual Checks Hold You Back</h3>
            <p>
              Before Certicode, Global Fintech Solutions faced significant
              hurdles. Manual asset checks were time-consuming, causing delays
              and creating operational bottlenecks. Ensuring that each asset met
              strict quality and licensing standards was a labor-intensive
              process, prone to human error. Expanding verification across new
              regions posed another challenge: the risk of increasing costs and
              the need for additional staff. The company&apos;s growth ambitions
              were being constrained by these operational limitations, and a
              smarter, faster approach was essential.
            </p>

            <h3>Automating with Certicode</h3>
            <p>
              Certicode provided a centralized, automated platform that
              transformed the way Global Fintech Solutions handled asset
              verification. By replacing hours of manual checks with intelligent
              automation, the company reduced errors and significantly sped up
              approvals. Centralized oversight allowed teams to manage
              verification across all 14 regions from a single platform, with
              dashboards and reporting that delivered real-time insights into
              performance and compliance. The platform&apos;s scalable
              infrastructure could handle growing volumes of assets without
              additional headcount, allowing Global Fintech Solutions to expand
              efficiently and confidently. With Certicode, asset verification
              became faster, more reliable, and easier to manage across multiple
              regions.
            </p>

            <h3>Faster, Safer, and Scalable</h3>
            <p>
              The results were immediate and measurable. Asset verification time
              decreased by 42%, enabling faster approvals and reducing
              operational bottlenecks. Every asset was verified to meet quality
              and licensing standards, ensuring full compliance and minimizing
              risk. At the same time, operations scaled threefold across regions
              without additional staff, demonstrating that growth could be
              achieved efficiently and sustainably. Certicode enabled Global
              Fintech Solutions to achieve a level of operational efficiency
              that would have been difficult, if not impossible, with
              traditional manual processes.
            </p>

            <p className="global-fintech-case__quote">
              <em>
                &quot;Certicode reduced our asset verification time by 42% while
                ensuring every purchase meets quality and licensing
                standards,&quot; says the Head of Operations at Global Fintech
                Solutions. &quot;We can now scale verification across multiple
                regions without increasing headcount, which is a huge win for
                operational efficiency.&quot;
              </em>
            </p>

            <h3>Smarter Processes, Confident Growth</h3>
            <p>
              With Certicode, Global Fintech Solutions not only accelerated
              asset verification but also maintained uncompromising quality and
              compliance standards. Automation and centralized management have
              enabled the company to prepare for growth across multiple regions,
              all while maintaining operational excellence. This success story
              demonstrates how smart technology solutions like Certicode can
              transform complex workflows, empowering fintech companies to scale
              confidently, securely, and efficiently.
            </p>
          </article>
        </div>
      </section>

      <section className="global-fintech-case__related">
        <div className="global-fintech-case__relatedInner">
          <div className="global-fintech-case__relatedTop">
            <h4>RELATED CUSTOMER STORIES</h4>
            <Link
              className="global-fintech-case__seeAll"
              to="/success-stories/customer-success-stories"
            >
              See all customer stories
              <span aria-hidden="true">›</span>
            </Link>
          </div>
          <div className="global-fintech-case__relatedGrid">
            {relatedStories.map((story, index) => (
              <article
                key={`${story.title}-${index}`}
                className="global-fintech-mini"
              >
                <div className="global-fintech-mini__media" />
                <div className="global-fintech-mini__body">
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

export default SuccessStoryGlobalFintech;

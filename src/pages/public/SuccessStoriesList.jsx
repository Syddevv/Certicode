import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/SuccessStoriesList.css";
import OrangeArrow from "../../assets/OrangeArrow.png";
import SuccessList from "../../assets/SuccessList.png";

const successStoryItems = [
  {
    tag: "Fintech",
    title: "Why Every Business Needs Custom Software Solutions",
    text: "Off-the-shelf software often falls short. Learn how custom-built systems can streamline operations, increase productivity, and reduce long-term costs.",
    href: "/success-stories/global-fintech-solutions-scale-asset-verification",
  },
  {
    tag: "Education",
    title: "Why Every Business Needs Custom Software Solutions",
    text: "Off-the-shelf software often falls short. Learn how custom-built systems can streamline operations, increase productivity, and reduce long-term costs.",
  },
  {
    tag: "Enterprise",
    title: "Why Every Business Needs Custom Software Solutions",
    text: "Off-the-shelf software often falls short. Learn how custom-built systems can streamline operations, increase productivity, and reduce long-term costs.",
  },
  {
    tag: "E-commerce",
    title: "Why Every Business Needs Custom Software Solutions",
    text: "Off-the-shelf software often falls short. Learn how custom-built systems can streamline operations, increase productivity, and reduce long-term costs.",
  },
  {
    tag: "SaaS",
    title: "Why Every Business Needs Custom Software Solutions",
    text: "Off-the-shelf software often falls short. Learn how custom-built systems can streamline operations, increase productivity, and reduce long-term costs.",
  },
  {
    tag: "Construction",
    title: "Why Every Business Needs Custom Software Solutions",
    text: "Off-the-shelf software often falls short. Learn how custom-built systems can streamline operations, increase productivity, and reduce long-term costs.",
  },
];

const caseStudyItems = [
  {
    tag: "Case Study",
    title: "How Certicode Helped Global Fintech Solutions Scale Asset Verification by 3x",
    text: "In the fast-paced world of fintech, speed and accuracy are critical. For Global Fintech Solutions, managing digital and physical assets across 14 regions was slowing growth.",
    href: "/success-stories/global-fintech-solutions-scale-asset-verification",
  },
  {
    tag: "Case Study",
    title: "How Certicode Helped Global Fintech Solutions Scale Asset Verification by 3x",
    text: "In the fast-paced world of fintech, speed and accuracy are critical. For Global Fintech Solutions, managing digital and physical assets across 14 regions was slowing growth.",
  },
  {
    tag: "Case Study",
    title: "How Certicode Helped Global Fintech Solutions Scale Asset Verification by 3x",
    text: "In the fast-paced world of fintech, speed and accuracy are critical. For Global Fintech Solutions, managing digital and physical assets across 14 regions was slowing growth.",
  },
  {
    tag: "Case Study",
    title: "How Certicode Helped Global Fintech Solutions Scale Asset Verification by 3x",
    text: "In the fast-paced world of fintech, speed and accuracy are critical. For Global Fintech Solutions, managing digital and physical assets across 14 regions was slowing growth.",
  },
  {
    tag: "Case Study",
    title: "How Certicode Helped Global Fintech Solutions Scale Asset Verification by 3x",
    text: "In the fast-paced world of fintech, speed and accuracy are critical. For Global Fintech Solutions, managing digital and physical assets across 14 regions was slowing growth.",
  },
  {
    tag: "Case Study",
    title: "How Certicode Helped Global Fintech Solutions Scale Asset Verification by 3x",
    text: "In the fast-paced world of fintech, speed and accuracy are critical. For Global Fintech Solutions, managing digital and physical assets across 14 regions was slowing growth.",
  },
];

const StoryCard = ({ item }) => (
  <article className="stories-list-card">
    <div className="stories-list-card__media" />
    <div className="stories-list-card__body">
      <span className="stories-list-card__tag">{item.tag}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      {item.href ? (
        <Link className="stories-list-card__link" to={item.href}>
          Read More <img src={OrangeArrow} alt="" />
        </Link>
      ) : (
        <button className="stories-list-card__link" type="button">
          Read More <img src={OrangeArrow} alt="" />
        </button>
      )}
    </div>
  </article>
);

const SuccessStoriesList = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="stories-list">
      <Navbar />

      <section className="stories-list__hero">
        <img src={SuccessList} alt="Customer success stories" />
      </section>

      <section className="stories-list__section">
        <div className="stories-list__grid">
          {successStoryItems.map((item, index) => (
            <StoryCard key={`${item.title}-${index}`} item={item} />
          ))}
        </div>
      </section>

      <section className="stories-list__section stories-list__section--caseStudies">
        <div className="stories-list__heading">
          <h2>Customer case studies</h2>
          <p>See how businesses launch faster, reduce costs, and scale with confidence.</p>
        </div>
        <div className="stories-list__grid">
          {caseStudyItems.map((item, index) => (
            <StoryCard key={`${item.tag}-${index}`} item={item} />
          ))}
        </div>
      </section>

      <section className="stories-list__cta">
        <div className="stories-list__ctaCard">
          <h2>Need Custom Software for Your Business?</h2>
          <p>
            Let Certicode build secure, scalable, and reliable software
            solutions tailored to your needs.
          </p>
          <Link className="stories-list__ctaBtn" to="/marketplace">
            Get Started Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStoriesList;

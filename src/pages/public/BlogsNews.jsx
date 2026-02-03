import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/BlogsNews.css";
import OrangeArrow from "../../assets/OrangeArrow.png";

const BlogsNews = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const categories = [
    "Software Development",
    "SaaS Platform",
    "Cybersecurity",
    "Business Systems",
    "Company News",
    "Tutorials",
  ];

  const featuredPost = {
    type: "Blog",
    title: "Why Every Business Needs Custom Software Solutions",
    excerpt:
      "Off-the-shelf software often falls short. Learn how custom-built systems can streamline operations, increase productivity, and reduce long-term costs...",
  };

  const sideFeatured = [
    {
      type: "Blog",
      title: "How Secure Software Protects Your Business in 2025",
      date: "Jan 24, 2026",
      link: "/blogs-news/how-secure-software",
    },
    {
      type: "News",
      title: "Certicode Launches New Cybersecurity Services for SMEs",
      date: "Jan 24, 2026",
    },
  ];

  const posts = [
    {
      type: "Blog",
      title: "Beginner’s Guide to Web Application Security",
      excerpt:
        "Learn the fundamentals of securing your web apps, from authentication to encryption and vulnerability testing...",
      date: "Jan 24, 2026",
    },
    {
      type: "Blog",
      title: "Beginner’s Guide to Web Application Security",
      excerpt:
        "Learn the fundamentals of securing your web apps, from authentication to encryption and vulnerability testing...",
      date: "Jan 24, 2026",
    },
    {
      type: "Blog",
      title: "Beginner’s Guide to Web Application Security",
      excerpt:
        "Learn the fundamentals of securing your web apps, from authentication to encryption and vulnerability testing...",
      date: "Jan 24, 2026",
    },
    {
      type: "News",
      title: "Certicode Partners with Local Businesses for Digital Transformation",
      excerpt:
        "Certicode collaborates with SMEs to deliver modern software solutions...",
      date: "Jan 24, 2026",
    },
    {
      type: "News",
      title: "AI and Automation Trends in Modern Software Development",
      excerpt:
        "A closer look at how AI is transforming the software industry and reshaping business operations...",
      date: "Jan 24, 2026",
    },
    {
      type: "News",
      title: "Certicode Launches New Cloud-Based Business Management System",
      excerpt: "Certicode introduces a scalable cloud solution design...",
      date: "Jan 24, 2026",
    },
  ];

  return (
    <div className="blogs">
      <Navbar />

      <section className="blogs-hero">
        <div className="blogs-hero__inner">
          <h1 className="blogs-hero__title">
            Blog & <span>News</span>
          </h1>
        </div>
      </section>

      <section className="blogs-layout">
        <div className="blogs-layout__inner">
          <aside className="blogs-categories">
            <h2 className="blogs-categories__title">Category</h2>
            <ul className="blogs-categories__list">
              {categories.map((item, index) => (
                <li key={item}>
                  <button
                    className={`blogs-categories__item${
                      index === 0 ? " is-active" : ""
                    }`}
                    type="button"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <article className="blogs-featured">
            <div className="blogs-featured__media" />
            <div className="blogs-featured__body">
              <span className="blogs-tag">{featuredPost.type}</span>
              <h3>{featuredPost.title}</h3>
              <p>{featuredPost.excerpt}</p>
              <button className="blogs-read" type="button">
                Read More <img src={OrangeArrow} alt="" aria-hidden="true" />
              </button>
            </div>
          </article>

          <div className="blogs-side">
            <div className="blogs-side__heading">Featured</div>
            <div className="blogs-side__list">
              {sideFeatured.map((item) =>
                item.link ? (
                  <Link
                    key={item.title}
                    to={item.link}
                    className="blogs-side__card blogs-side__card--link"
                  >
                    <div className="blogs-side__media" />
                    <div className="blogs-side__body">
                      <span className="blogs-tag">{item.type}</span>
                      <h4>{item.title}</h4>
                      <span className="blogs-date">{item.date}</span>
                    </div>
                  </Link>
                ) : (
                  <article key={item.title} className="blogs-side__card">
                    <div className="blogs-side__media" />
                    <div className="blogs-side__body">
                      <span className="blogs-tag">{item.type}</span>
                      <h4>{item.title}</h4>
                      <span className="blogs-date">{item.date}</span>
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="blogs-grid">
        <div className="blogs-grid__inner">
          <div className="blogs-grid__cards">
            {posts.map((post) => (
              <article key={`${post.type}-${post.title}`} className="blogs-card">
                <div className="blogs-card__media" />
                <div className="blogs-card__body">
                  <span className="blogs-tag">{post.type}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="blogs-date">{post.date}</span>
                </div>
              </article>
            ))}
          </div>
          <button className="blogs-grid__more" type="button">
            Load more
          </button>
        </div>
      </section>

      <section className="blogs-cta">
        <div className="blogs-cta__inner">
          <div className="blogs-cta__card">
            <h2>Need Custom Software for Your Business?</h2>
            <p>
              Let Certicode build secure, scalable, and reliable software
              solutions tailored to your needs.
            </p>
            <button className="blogs-cta__btn" type="button">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogsNews;

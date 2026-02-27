import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/SuccessStoriesList.css";
import ReadMoreIcon from "../../assets/readmore.png";
import SuccessList from "../../assets/SuccessList.png";

const StoryCard = ({ item }) => {
  const isExternal = item.href?.startsWith("http");

  return (
    <article className="stories-list-card">
      <div className="stories-list-card__media">
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            onError={(e) => {
              e.target.onerror = null;
              const industryImages = {
                Government:
                  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                Marketing:
                  "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                SaaS: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                Healthcare:
                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                Fintech:
                  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                Enterprise:
                  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              };
              e.target.src =
                industryImages[item.tag] ||
                "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
            }}
          />
        )}
      </div>
      <div className="stories-list-card__body">
        <span className="stories-list-card__tag">{item.tag}</span>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
        {item.href ? (
          isExternal ? (
            <a
              className="stories-list-card__link"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More <img src={ReadMoreIcon} alt="" />
            </a>
          ) : (
            <Link className="stories-list-card__link" to={item.href}>
              Read More <img src={ReadMoreIcon} alt="" />
            </Link>
          )
        ) : (
          <button className="stories-list-card__link" type="button">
            Read More <img src={ReadMoreIcon} alt="" />
          </button>
        )}
      </div>
    </article>
  );
};

const SuccessStoriesList = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      const response = await fetch(
        "https://dev.to/api/articles?tag=case+study&per_page=24",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch success stories");
      }

      const data = await response.json();
      const apiStories = data.map((article) => ({
        id: article.id,
        tag: determineTag(article.tag_list),
        category: determineCategory(article.tag_list),
        title: article.title,
        text: article.description || article.title,
        href: article.url,
        image: article.cover_image || article.social_image,
      }));

      const curatedStories = [
        {
          id: "kalamuna-tyk",
          tag: "Government",
          category: "Government",
          title:
            "How Kalamuna turned a fragile legacy system into a rock-solid API ecosystem",
          text: "Tyk powers millions of real-time transit data requests with 99.88% uptime and 0 outages since launch, serving 27 transit agencies in the Bay Area.",
          href: "https://tyk.io/case-studies/kalamuna/",
          image:
            "https://tyk.io/wp-content/uploads/2023/08/kalamuna-case-study-featured.jpg",
        },
        {
          id: "publicis-dataddo",
          tag: "Marketing",
          category: "Enterprise",
          title:
            "How Publicis Groupe Brasil Uses Dataddo's API to Scale a Data Product",
          text: "Saved 3 full-time data engineering equivalents on pipeline maintenance and accelerated feature implementation by 2+ months.",
          href: "https://blog.dataddo.com/how-publicis-groupe-brasil-uses-dataddos-api-to-scale-a-data-product",
          image:
            "https://images.ctfassets.net/izvxou7dan7k/5qO8XJF4mK9SM1irseDyH3/7a53f3873d4fc52aa68d917d3a45de60/publicis-groupe-header.png",
        },
        {
          id: "segment-apptopia",
          tag: "SaaS",
          category: "SaaS",
          title: "How Segment achieved 10% conversion rate with Apptopia API",
          text: "Segment enriched ~16k accounts with key data points, saving 3-4 hours per week on research and empowering sales outreach.",
          href: "https://apptopia.com/case-study-segment",
          image:
            "https://www.apptopia.com/images/case-studies/segment-case-study-header.jpg",
        },
        {
          id: "medimpact-gravitee",
          tag: "Healthcare",
          category: "Healthcare",
          title: "MedImpact enhances API observability with Gravitee",
          text: "70% faster troubleshooting, handling 305M+ API requests per week with no performance impact for pharmacy benefit operations.",
          href: "https://www.gravitee.io/case-studies/medimpact",
          image: "https://www.gravitee.io/images/case-studies/medimpact-header.jpg",
        },
        {
          id: "noble-apollo",
          tag: "SaaS",
          category: "SaaS",
          title:
            "How Noble Built a 10% Conversion Rate Engine on Apollo's Data Foundation",
          text: "Achieved 80-90% enrichment coverage and 3x higher positive reply rates for AI-powered publisher outreach.",
          href: "https://www.apollo.io/magazine/noble-customer-story",
          image:
            "https://assets-global.website-files.com/5f6b628089ab63ca7e0f0086/6548e07c3d5eb68c91e0e79b_noble-case-study.jpg",
        },
      ];

      const allStories = [...curatedStories, ...apiStories];
      const uniqueStories = allStories.filter(
        (story, index, self) =>
          index === self.findIndex((s) => s.id === story.id),
      );
      setStories(uniqueStories);
    } catch (error) {
      console.error("Error fetching success stories:", error);
      setStories([
        {
          id: "kalamuna-tyk",
          tag: "Government",
          title:
            "How Kalamuna turned a fragile legacy system into a rock-solid API ecosystem",
          text: "Tyk powers millions of real-time transit data requests with 99.88% uptime and 0 outages since launch.",
          href: "https://tyk.io/case-studies/kalamuna/",
          image:
            "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "publicis-dataddo",
          tag: "Enterprise",
          title:
            "How Publicis Groupe Brasil Uses Dataddo's API to Scale a Data Product",
          text: "Saved 3 full-time data engineering equivalents and accelerated feature implementation by 2+ months.",
          href: "https://blog.dataddo.com/how-publicis-groupe-brasil-uses-dataddos-api-to-scale-a-data-product",
          image:
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ]);
    }
  };

  const determineTag = (tags) => {
    if (!tags || tags.length === 0) return "Technology";
    const tagMap = {
      fintech: "Fintech",
      saas: "SaaS",
      enterprise: "Enterprise",
      ecommerce: "E-commerce",
      healthcare: "Healthcare",
      government: "Government",
      security: "Security",
      agriculture: "Agriculture",
      ai: "AI",
      database: "Database",
      gaming: "Gaming",
    };

    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (tagMap[lowerTag]) return tagMap[lowerTag];
    }
    return "Technology";
  };

  const determineCategory = (tags) => {
    if (!tags || tags.length === 0) return "Enterprise";
    const categoryMap = {
      saas: "SaaS",
      fintech: "Fintech",
      enterprise: "Enterprise",
      ecommerce: "E-commerce",
      healthcare: "Healthcare",
      government: "Government",
      security: "Enterprise",
      agriculture: "Enterprise",
      ai: "Enterprise",
      database: "SaaS",
      gaming: "Enterprise",
    };

    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (categoryMap[lowerTag]) return categoryMap[lowerTag];
    }
    return "Enterprise";
  };

  const successStoryItems = useMemo(
    () =>
      stories.slice(0, 6).map((story) => ({
        tag: story.tag || "Case Study",
        title: story.title,
        text: story.text,
        href: story.href,
        image: story.image,
      })),
    [stories],
  );

  const caseStudyItems = useMemo(
    () =>
      stories.map((story) => ({
        tag: story.tag || "Case Study",
        title: story.title,
        text: story.text,
        href: story.href,
        image: story.image,
      })),
    [stories],
  );

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
            <StoryCard key={`${item.title}-${index}`} item={item} />
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
          <Link className="stories-list__ctaBtn" to="/custom-projects">
            Get Started Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStoriesList;

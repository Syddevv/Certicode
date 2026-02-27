import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/SuccessStories.css";
import VerificationSpeed from "../../assets/VerificationSpeed.png";
import ChartBar from "../../assets/ChartBar.png";
import OrangeBadge from "../../assets/orangeBadge.png";
import ReadMoreIcon from "../../assets/readmore.png";
import JaneDoe from "../../assets/janedoe.png";
import SearchIcon from "../../assets/lucide_search.png";
import QuoteIcon from "../../assets/quote.png";
import { Link } from "react-router-dom";

const SuccessStories = () => {
  const [activeTab, setActiveTab] = useState("All Assets");
  const [searchTerm, setSearchTerm] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storyTabs = [
    "All Assets",
    "Fintech",
    "SaaS",
    "Enterprise",
    "Healthcare",
    "Government",
    "E-commerce",
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://dev.to/api/articles?tag=case+study&per_page=24`,
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
        url: article.url,
        image: article.cover_image || article.social_image,
        published_at: article.published_at,
      }));

      const curatedStories = [
        {
          id: "kalamuna-tyk",
          tag: "Government",
          category: "Government",
          title:
            "How Kalamuna turned a fragile legacy system into a rock-solid API ecosystem",
          text: "Tyk powers millions of real-time transit data requests with 99.88% uptime and 0 outages since launch, serving 27 transit agencies in the Bay Area.",
          url: "https://tyk.io/case-studies/kalamuna/",
          image:
            "https://tyk.io/wp-content/uploads/2023/08/kalamuna-case-study-featured.jpg",
          metrics: {
            calls: "325M+ API calls",
            uptime: "99.88% uptime",
            outages: "0 outages",
          },
        },
        {
          id: "publicis-dataddo",
          tag: "Marketing",
          category: "Enterprise",
          title:
            "How Publicis Groupe Brasil Uses Dataddo's API to Scale a Data Product",
          text: "Saved 3 full-time data engineering equivalents on pipeline maintenance and accelerated feature implementation by 2+ months.",
          url: "https://blog.dataddo.com/how-publicis-groupe-brasil-uses-dataddos-api-to-scale-a-data-product",
          image:
            "https://images.ctfassets.net/izvxou7dan7k/5qO8XJF4mK9SM1irseDyH3/7a53f3873d4fc52aa68d917d3a45de60/publicis-groupe-header.png",
          metrics: {
            engineers: "3 FTEs saved",
            implementation: "2+ months faster",
          },
        },
        {
          id: "segment-apptopia",
          tag: "SaaS",
          category: "SaaS",
          title: "How Segment achieved 10% conversion rate with Apptopia API",
          text: "Segment enriched ~16k accounts with key data points, saving 3-4 hours per week on research and empowering sales outreach.",
          url: "https://apptopia.com/case-study-segment",
          image:
            "https://www.apptopia.com/images/case-studies/segment-case-study-header.jpg",
          metrics: {
            accounts: "16k enriched",
            time: "3-4 hours saved/week",
          },
        },
        {
          id: "medimpact-gravitee",
          tag: "Healthcare",
          category: "Healthcare",
          title: "MedImpact enhances API observability with Gravitee",
          text: "70% faster troubleshooting, handling 305M+ API requests per week with no performance impact for pharmacy benefit operations.",
          url: "https://www.gravitee.io/case-studies/medimpact",
          image:
            "https://www.gravitee.io/images/case-studies/medimpact-header.jpg",
          metrics: {
            troubleshooting: "70% faster",
            requests: "305M+ weekly",
          },
        },
        {
          id: "noble-apollo",
          tag: "SaaS",
          category: "SaaS",
          title:
            "How Noble Built a 10% Conversion Rate Engine on Apollo's Data Foundation",
          text: "Achieved 80-90% enrichment coverage and 3x higher positive reply rates for AI-powered publisher outreach.",
          url: "https://www.apollo.io/magazine/noble-customer-story",
          image:
            "https://assets-global.website-files.com/5f6b628089ab63ca7e0f0086/6548e07c3d5eb68c91e0e79b_noble-case-study.jpg",
          metrics: {
            coverage: "80-90% enrichment",
            conversion: "10% to sale",
            replies: "3x higher",
          },
        },
        {
          id: "centralplains-barchart",
          tag: "Agriculture",
          category: "Enterprise",
          title:
            "How Central Plains Milling Improved Their Website with Market Data APIs",
          text: "Agriculture company leverages Barchart APIs to deliver real-time market data, news, and weather to customers.",
          url: "https://www.barchart.com/solutions/case-studies/cpm",
          image: "https://www.barchart.com/images/case-studies/cpm-header.jpg",
        },
        {
          id: "nhc-ibm",
          tag: "Real Estate",
          category: "Enterprise",
          title: "NHC transforms digital operations with IBM Cloud Pak",
          text: "40% faster time to market, handling 2M daily requests with 23% faster API response times.",
          url: "https://www.ibm.com/case-studies/nhc",
          image: "https://www.ibm.com/case-studies/nhc/images/nhc-header.jpg",
          metrics: {
            timeToMarket: "40% faster",
            requests: "2M daily",
            responseTime: "23% faster",
          },
        },
        {
          id: "dvla-aws",
          tag: "Government",
          category: "Government",
          title: "DVLA modernizes driver records with Amazon API Gateway",
          text: "UK Driver and Vehicle Licensing Agency manages 47M+ driver records with APIs scaling to billions of transactions per month.",
          url: "https://aws.amazon.com/api-gateway/resources/",
          image:
            "https://d1.awsstatic.com/case-studies/dvla-case-study-header.cb3f4a8e7c4b8e7c4b8e7c4b8e7c4b8e7c4b8e7c4.jpg",
          metrics: {
            records: "47M+ driver records",
            scale: "Billions of transactions",
          },
        },
        {
          id: "veracode-aws",
          tag: "Security",
          category: "Enterprise",
          title: "Veracode runs security scans on AWS Lambda and API Gateway",
          text: "Cloud-based application-security service supports tens of thousands of vulnerability scans using serverless architecture.",
          url: "https://aws.amazon.com/api-gateway/resources/",
          image:
            "https://a0.awsstatic.com/libra-css/images/case-studies/veracode-header.jpg",
        },
        {
          id: "browsercompany-datadog",
          tag: "Software",
          category: "SaaS",
          title:
            "The Browser Company accelerates release velocity with Datadog",
          text: "Reduced CI pipeline time by 50% from 1 hour to 30 minutes, improved test performance from 5 minutes to 10 seconds.",
          url: "https://www.datadoghq.com/case-studies/the-browser-company/",
          image:
            "https://imgix.datadoghq.com/img/case-studies/browsercompany-header.png",
          metrics: {
            pipelineTime: "50% faster",
            testTime: "5min → 10sec",
          },
        },
        {
          id: "zilliz",
          tag: "AI",
          category: "Enterprise",
          title:
            "Zilliz Cloud achieves 99.99% uptime with AI-powered vector database",
          text: "Leading vector database platform serves millions of AI applications with 50% faster query performance.",
          url: "https://zilliz.com/case-studies",
          image:
            "https://zilliz.com/images/case-studies/zilliz-cloud-header.jpg",
          metrics: {
            uptime: "99.99%",
            performance: "50% faster",
            applications: "Millions served",
          },
        },
        {
          id: "mongodb-atlas",
          tag: "Database",
          category: "SaaS",
          title: "How Toyota connected 1.5M vehicles with MongoDB Atlas",
          text: "Toyota connected 1.5 million connected cars across Europe, processing 5.5B messages annually with 99.995% uptime.",
          url: "https://www.mongodb.com/customers/toyota",
          image:
            "https://webimages.mongodb.com/_com_assets/cms/toyota-case-study-header.jpg",
          metrics: {
            vehicles: "1.5M connected",
            messages: "5.5B annually",
            uptime: "99.995%",
          },
        },
        {
          id: "auth0-fanduel",
          tag: "Gaming",
          category: "Enterprise",
          title: "FanDuel scales authentication to 12M users with Auth0",
          text: "Sports betting platform handles 12M users and 100K concurrent connections with 99.99% uptime during peak events.",
          url: "https://auth0.com/customers/fanduel",
          image: "https://cdn.auth0.com/blog/customers/fanduel-header.jpg",
          metrics: {
            users: "12M+",
            concurrent: "100K",
            uptime: "99.99%",
          },
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
      setError("Unable to load success stories. Please try again.");

      const fallbackStories = [
        {
          id: "kalamuna-tyk",
          tag: "Government",
          category: "Government",
          title:
            "How Kalamuna turned a fragile legacy system into a rock-solid API ecosystem",
          text: "Tyk powers millions of real-time transit data requests with 99.88% uptime and 0 outages since launch.",
          url: "https://tyk.io/case-studies/kalamuna/",
          image:
            "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "publicis-dataddo",
          tag: "Marketing",
          category: "Enterprise",
          title:
            "How Publicis Groupe Brasil Uses Dataddo's API to Scale a Data Product",
          text: "Saved 3 full-time data engineering equivalents and accelerated feature implementation by 2+ months.",
          url: "https://blog.dataddo.com/how-publicis-groupe-brasil-uses-dataddos-api-to-scale-a-data-product",
          image:
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "segment-apptopia",
          tag: "SaaS",
          category: "SaaS",
          title: "How Segment achieved 10% conversion rate with Apptopia API",
          text: "Segment enriched ~16k accounts with key data points, saving 3-4 hours per week on research.",
          url: "https://apptopia.com/case-study-segment",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ];
      setStories(fallbackStories);
    } finally {
      setLoading(false);
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
      if (tagMap[lowerTag]) {
        return tagMap[lowerTag];
      }
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
      if (categoryMap[lowerTag]) {
        return categoryMap[lowerTag];
      }
    }
    return "Enterprise";
  };

  const filteredStories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return stories.filter((story) => {
      const matchesTab =
        activeTab === "All Assets" ||
        story.category === activeTab ||
        story.tag === activeTab;
      if (!matchesTab) return false;

      if (!query) return true;

      const searchableText =
        `${story.title} ${story.text} ${story.tag} ${story.category}`.toLowerCase();
      return searchableText.includes(query);
    });
  }, [activeTab, searchTerm, stories]);

  const openSuccessStory = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="stories">
        <Navbar />
        <div className="stories-loading">
          <div className="stories-loading-spinner"></div>
          <p>Loading success stories...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="stories">
      <Navbar />

      <section className="stories-hero">
        <div className="stories-hero__inner">
          <span className="stories-hero__pill">Customer Impact</span>
          <h1>
            Trusted by creators and teams
            <br />
            who value secure, verified assets
          </h1>
          <p>
            See how teams and individuals use Certicode to discover, verify, and
            confidently use production-ready digital assets.
          </p>
          <a className="stories-hero__cta" href="#stories">
            View Customer Stories
          </a>
        </div>
      </section>

      {stories.length > 0 && (
        <section className="stories-spotlight" id="stories">
          <div className="stories-spotlight__inner">
            <div className="stories-spotlight__content">
              <span className="stories-spotlight__tag">Spotlight Story</span>
              <h2>{stories[0].title}</h2>
              <p>{stories[0].text}</p>
              <button
                className="stories-spotlight__link"
                type="button"
                onClick={() => openSuccessStory(stories[0].url)}
              >
                Read full case study <img src={ReadMoreIcon} alt="" />
              </button>
            </div>

            <div className="stories-spotlight__metrics">
              <article className="stories-metric">
                <div className="stories-metric__title">
                  <img src={VerificationSpeed} alt="" aria-hidden="true" />
                  <span>Efficiency Gain</span>
                </div>
                <strong>42% Faster</strong>
                <p>Process improvement achieved</p>
              </article>
              <article className="stories-metric">
                <div className="stories-metric__title">
                  <img src={OrangeBadge} alt="" aria-hidden="true" />
                  <span>Success Rate</span>
                </div>
                <strong>100% Success</strong>
                <p>Project goals exceeded</p>
              </article>
              <article className="stories-metric">
                <div className="stories-metric__title">
                  <img src={ChartBar} alt="" aria-hidden="true" />
                  <span>ROI</span>
                </div>
                <strong>3x Return</strong>
                <p>Investment returned within 6 months</p>
              </article>
            </div>
          </div>
        </section>
      )}

      <section className="stories-grid">
        <div className="stories-grid__inner">
          <div className="stories-grid__filters">
            <div className="stories-grid__tabs">
              {storyTabs.map((tab) => (
                <button
                  key={tab}
                  className={`stories-grid__tab${activeTab === tab ? " is-active" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="stories-grid__search">
              <img src={SearchIcon} alt="" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search success stories..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="stories-grid-error">
              <p>{error}</p>
              <button onClick={fetchSuccessStories}>Retry</button>
            </div>
          )}

          <div className="stories-grid__cards">
            {filteredStories.map((story) => (
              <article
                key={story.id}
                className="stories-card"
                onClick={() => openSuccessStory(story.url)}
              >
                <div className="stories-card__media">
                  <img
                    src={story.image}
                    alt={story.title}
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
                        industryImages[story.tag] ||
                        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
                <div className="stories-card__body">
                  <span className="stories-card__tag">{story.tag}</span>
                  <h3>{story.title}</h3>
                  <p>{story.text}</p>
                  <button className="stories-card__link" type="button">
                    Read Case Study <img src={ReadMoreIcon} alt="" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredStories.length === 0 && !error && (
            <p className="stories-grid__empty">
              No success stories found. Try adjusting your search.
            </p>
          )}

          {filteredStories.length === 0 && error && (
            <p className="stories-grid__empty">
              Unable to load stories. Please try again later.
            </p>
          )}

          <Link
            className="stories-grid__more"
            to="/success-stories/customer-success-stories"
          >
            Load more success stories
          </Link>
        </div>
      </section>

      <section className="stories-quote">
        <div className="stories-quote__inner">
          <img className="stories-quote__mark" src={QuoteIcon} alt="" aria-hidden="true" />
          <p>
            "Certicode removed the uncertainty from buying digital assets. What
            used to take days of review is now instant and reliable."
          </p>
          <div className="stories-quote__person">
            <img src={JaneDoe} alt="Jane Doe" />
            <div>
              <strong>Jane Doe</strong>
              <span>CTO, Global Fintech Solutions</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stories-cta">
        <div className="stories-cta__inner">
          <div className="stories-cta__card">
            <h2>Ready to create your own success story?</h2>
            <p>
              Join professionals worldwide who rely on Certicode for verified,
              production-ready digital assets.
            </p>
            <Link to="/marketplace">
              <button className="stories-cta__btn" type="button">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStories;

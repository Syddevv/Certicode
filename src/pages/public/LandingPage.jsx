import React, { useEffect, useState, useCallback, useRef } from "react";
import "../../styles/landingPage.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchIcon from "../../assets/lucide_search.png";
import Badge from "../../assets/Verified.png";
import TechFlow from "../../assets/TechFlow.png";
import SkyScale from "../../assets/SkyScale.png";
import NexusAI from "../../assets/NexusAI.png";
import StackBuild from "../../assets/StackBuild.png";
import OrbitOS from "../../assets/OrbitOS.png";
import ArrowDown from "../../assets/ArrowDown.png";
import Phone from "../../assets/Phone.png";
import WebApps from "../../assets/WebsiteApps.png";
import MobileApps from "../../assets/MobileApps.png";
import UI from "../../assets/UI.png";
import CustomProjects from "../../assets/CustomProjects.png";
import Wallet from "../../assets/wallet.png";
import Lightning from "../../assets/lightning.png";
import SearchCheck from "../../assets/search-check.png";
import Avatar from "../../assets/Avatar.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { ReviewAPI } from "../../services/ReviewAPI";

const heroCategories = [
  "All Categories",
  "Website Apps",
  "Mobile Apps",
  "UI/UX Design",
  "Custom Projects",
];

const getToneColor = (tech) => {
  const colorMap = {
    'React': 'blue',
    'Node.js': 'green',
    'Python': 'gold',
    'Django': 'green',
    'Flutter': 'purple',
    'Firebase': 'pink',
    'Swift': 'indigo',
    'Figma': 'rose',
    'Adobe XD': 'violet',
    'Tailwind': 'orange',
    'Laravel': 'red',
    'Vue.js': 'green',
    'HTML': 'orange',
    'CSS': 'blue',
    'JavaScript': 'yellow',
    'Stripe': 'violet',
  };
  
  return colorMap[tech] || 'green';
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [currentReviewPage, setCurrentReviewPage] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace("#", "");
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  useEffect(() => {
    fetchTopReviews();
  }, []);

  const fetchTopReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await ReviewAPI.getTopReviews();
      
      const formattedReviews = reviewsData.map((review, index) => ({
        id: review.id,
        quote: review.description,
        name: review.user?.name || "User",
        role: "Verified Buyer",
        rating: review.rating,
        avatar: Avatar,
        featured: index === 1 || index === 4 || index === 7
      }));
      
      if (formattedReviews.length === 0) {
        setAllReviews(getFallbackReviews());
      } else {
        setAllReviews(formattedReviews);
      }
    } catch (error) {
      console.error("Error fetching top reviews:", error);
      setAllReviews(getFallbackReviews());
    } finally {
      setReviewsLoading(false);
    }
  };

  const getFallbackReviews = () => {
    return [
      {
        id: 1,
        quote: "Their SaaS templates saved us months of build time. The code quality was exceptional.",
        name: "Alex Johnson",
        role: "CTO, TechFlow",
        rating: 5,
        avatar: Avatar,
        featured: false,
      },
      {
        id: 2,
        quote: "As a buyer, the verification process is rigorous but worth it. Best B2B marketplace out there.",
        name: "Sarah Chen",
        role: "Senior UI Designer",
        rating: 5,
        avatar: Avatar,
        featured: true,
      },
      {
        id: 3,
        quote: "Support was outstanding and helped us through a complex integration. We shipped on time.",
        name: "Marcus Rodriguez",
        role: "Product Manager",
        rating: 5,
        avatar: Avatar,
        featured: false,
      },
      {
        id: 4,
        quote: "The UI kits are production-ready and saved our design team weeks of work.",
        name: "Emily Wilson",
        role: "Lead Designer",
        rating: 5,
        avatar: Avatar,
        featured: false,
      },
      {
        id: 5,
        quote: "Purchased a mobile app template and customized it for our needs. Excellent documentation!",
        name: "David Kim",
        role: "Mobile Developer",
        rating: 5,
        avatar: Avatar,
        featured: true,
      },
      {
        id: 6,
        quote: "Fast delivery and excellent support. Will definitely buy again.",
        name: "Lisa Thompson",
        role: "Startup Founder",
        rating: 5,
        avatar: Avatar,
        featured: false,
      },
      {
        id: 7,
        quote: "Code was clean and well-structured. Easy to integrate with our existing systems.",
        name: "Michael Brown",
        role: "Backend Engineer",
        rating: 5,
        avatar: Avatar,
        featured: false,
      },
      {
        id: 8,
        quote: "The marketplace has high-quality assets that are actually production-ready.",
        name: "Jessica Lee",
        role: "Product Manager",
        rating: 5,
        avatar: Avatar,
        featured: true,
      },
      {
        id: 9,
        quote: "Saved 3 months of development time with their e-commerce template.",
        name: "Robert Garcia",
        role: "CTO",
        rating: 5,
        avatar: Avatar,
        featured: false,
      },
    ];
  };

  const handleReviewPageChange = (pageIndex) => {
    setCurrentReviewPage(pageIndex);
  };

  const getCurrentReviews = () => {
    const reviewsPerPage = 3;
    const startIndex = currentReviewPage * reviewsPerPage;
    return allReviews.slice(startIndex, startIndex + reviewsPerPage);
  };

  const getTotalReviewPages = () => {
    return Math.ceil(allReviews.length / 3);
  };

  const performSearch = async (query, category) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      let assetType = "";
      if (category !== "All Categories") {
        switch (category) {
          case "Website Apps":
            assetType = "Website";
            break;
          case "Mobile Apps":
            assetType = "Mobile App";
            break;
          case "UI/UX Design":
            assetType = "UI Kit";
            break;
          case "Custom Projects":
            assetType = "";
            break;
          default:
            assetType = "";
        }
      }

      const result = await api.getProducts(query, assetType, 1, "newest", 5);
      
      // Add null/undefined check here
      const products = result?.data || [];
      
      const formattedResults = products.map(product => ({
        id: product.id,
        title: product.name,
        description: product.description || "",
        price: `$${parseFloat(product.price || 0).toFixed(2)}`,
        asset_type: product.asset_type || "Uncategorized",
        technologies: product.technologies || [], // Add fallback
        image: product.featured_image,
        techTags: (product.technologies || []).map(tech => ({
          label: tech,
          tone: getToneColor(tech)
        }))
      }));
      
      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query, category) => {
      performSearch(query, category);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedResult(null);
    setShowDropdown(true);
    debouncedSearch(value, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery, value);
    }
  };

  const handleResultSelect = (result) => {
    setSearchQuery(result.title);
    setSelectedResult(result);
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchSubmit = () => {
    if (selectedResult) {
      navigate(`/marketplace/${selectedResult.id}`);
    } else if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchQuery);
      if (selectedCategory !== "All Categories") {
        params.set("category", selectedCategory);
      }
      navigate(`/marketplace?${params.toString()}`);
    }
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const items = [
    { src: TechFlow, name: "TechFlow" },
    { src: SkyScale, name: "SkyScale" },
    { src: NexusAI, name: "NexusAI" },
    { src: StackBuild, name: "StackBuild" },
    { src: OrbitOS, name: "OrbitOS" },
  ];

  const categories = [
    {
      icon: WebApps,
      title: "Website Apps",
      desc: "Full-stack SaaS, CMS, and specialized web tools.",
    },
    {
      icon: MobileApps,
      title: "Mobile Apps",
      desc: "Cross-platform and native mobile solutions.",
    },
    {
      icon: UI,
      title: "UI/UX Design",
      desc: "Professional Figma kits and design systems.",
    },
    {
      icon: CustomProjects,
      title: "Custom Projects",
      desc: "Bespoke digital transformation services.",
    },
  ];

  const steps = [
    {
      icon: SearchCheck,
      title: "Explore & Choose",
      desc: "Browse through our curated collection of verified listings, from UI kits to full-stack applications.",
    },
    {
      icon: Wallet,
      title: "Secure Payment",
      desc: "Complete your purchase with confidence. Funds are held in a secure escrow system until you confirm receipt.",
    },
    {
      icon: Lightning,
      title: "Instant Transfer",
      desc: "Receive your files, documentation, and licenses immediately after payment verification.",
    },
  ];

  const faqs = [
    {
      question: "How does the transfer process work?",
      answer:
        "After checkout, Certicode securely delivers source files, docs, and license details in your buyer dashboard. You can download instantly and track all purchases from one place.",
    },
    {
      question: "Are the assets verified?",
      answer:
        "Yes. Every asset listed on Certicode goes through a review for code quality, documentation completeness, and production-readiness before it becomes available in the marketplace.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Certicode supports major debit/credit cards and other secure payment gateways available at checkout, with invoices and transaction history stored in your account.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "If an asset is materially different from its listing or has a blocking delivery issue, you can contact Certicode Support to open a resolution request under our refund guidelines.",
    },
  ];

  return (
    <div>
      <Navbar />
      <section className="hero" id="hero">
        <div className="container hero__inner">
          <div className="hero__left">
            <span className="pill">B2B Digital Asset Marketplace</span>

            <h1 className="hero__title">
              Buy <span className="accent">Production-Ready</span> Digital
              Assets Directly from <span className="accent">CertiCode</span>.
            </h1>

            <p className="hero__desc">
              Access high-quality source code, UI kits, and custom projects
              exclusively from Certicode. Fast-track your development with
              trusted, production-ready assets.
            </p>

            <div className="hero__search" ref={searchRef}>
              <div className="search">
                <span className="search__icon" aria-hidden="true">
                  <img src={SearchIcon} alt="search-icon" />
                </span>
                <input
                  ref={inputRef}
                  className="search__input"
                  placeholder={`Search by "Node.js E-commerce", "Fitness App"...`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowDropdown(true)}
                />
                <label className="search__selectWrap" htmlFor="hero-category">
                  <select
                    id="hero-category"
                    className="search__select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    {heroCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <img src={ArrowDown} alt="" aria-hidden="true" />
                </label>
                <button
                  className="btn btn--primary search__cta"
                  type="button"
                  onClick={handleSearchSubmit}
                >
                  Search
                </button>
              </div>
              
              {showDropdown && (
                <div className="search__dropdown" ref={dropdownRef}>
                  {isSearching ? (
                    <div className="search__dropdownItem search__dropdownItem--loading">
                      Searching...
                    </div>
                  ) : searchQuery.trim() && (searchResults?.length === 0 || !searchResults) ? ( // Add ?.
                    <div className="search__dropdownItem search__dropdownItem--empty">
                      No results found for "{searchQuery}"
                    </div>
                  ) : searchResults?.length > 0 ? ( // Add ?.
                    <>
                      <div className="search__dropdownHeader">
                        <span>Search Results ({searchResults.length})</span>
                        <Link 
                          to={`/marketplace?search=${encodeURIComponent(searchQuery)}${selectedCategory !== "All Categories" ? `&category=${selectedCategory}` : ''}`}
                          className="search__dropdownViewAll"
                          onClick={() => setShowDropdown(false)}
                        >
                          View all →
                        </Link>
                      </div>
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="search__dropdownItem"
                          onClick={() => handleResultSelect(result)}
                        >
                          <div className="search__dropdownItemContent">
                            <div className="search__dropdownItemTitle">
                              {result.title}
                            </div>
                            <div className="search__dropdownItemDesc">
                              {(result.description || "").length > 80  // Add fallback
                                ? `${result.description.substring(0, 80)}...` 
                                : result.description}
                            </div>
                            <div className="search__dropdownItemMeta">
                              <span className="search__dropdownItemPrice">
                                {result.price}
                              </span>
                              <div className="search__dropdownItemTechs">
                                {(result.techTags || []).slice(0, 3).map((tag, index) => ( // Add fallback
                                  <span key={index} className={`search__dropdownItemTech search__dropdownItemTech--${tag.tone}`}>
                                    {tag.label}
                                  </span>
                                ))}
                                {(result.techTags || []).length > 3 && (
                                  <span className="search__dropdownItemTechMore">
                                    +{(result.techTags || []).length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : null}
                </div>
              )}
            </div>

          </div>

          <div className="hero__right">
            <div className="phoneOnly">
              <img
                src={Phone}
                alt="Phone mockup"
                className="phoneOnly__img"
                draggable="false"
              />

              <div className="floatBadge">
                <div className="floatBadge__icon">
                  <img src={Badge} alt="verified" />
                </div>
                <div className="floatBadge__text">
                  <div className="floatBadge__top">VERIFIED ASSETS</div>
                  <div className="floatBadge__bottom">100% Secure Code</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="logos">
        <div className="container logos__inner">
          <div className="logos__label">TRUSTED BY INDUSTRY LEADING TEAMS</div>

          <div className="logos__row">
            {items.map((item) => (
              <div className="logoItem" key={item.name}>
                <img
                  src={item.src}
                  alt={item.name}
                  className="logoItem__icon"
                  loading="lazy"
                />
                <span className="logoItem__name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats__inner">
          <div className="stat">
            <div className="stat__value">10k+</div>
            <div className="stat__label">ASSETS SOLD</div>
          </div>
          <div className="stat">
            <div className="stat__value">24/7</div>
            <div className="stat__label">GLOBAL SUPPORT</div>
          </div>
          <div className="stat">
            <div className="stat__value">99.9%</div>
            <div className="stat__label">QUALITY RATING</div>
          </div>
        </div>
      </section>

      <section className="categories" id="categories">
        <div className="container categories__inner">
          <div className="categories__header">
            <div>
              <h2 className="categories__title">Browse by Category</h2>
              <p className="categories__subtitle">
                Discover hand-picked premium assets tailored for every business
                need.
              </p>
            </div>
            <Link to="/marketplace">
              <button className="categories__link" type="button">
                View all marketplace <span aria-hidden="true">›</span>
              </button>
            </Link>
          </div>

          <div className="categories__grid">
            {categories.map((card) => (
              <div className="categoryCard" key={card.title}>
                <div className="categoryCard__icon">
                  <img src={card.icon} alt="" aria-hidden="true" />
                </div>
                <div className="categoryCard__title">{card.title}</div>
                <div className="categoryCard__desc">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process" id="process">
        <div className="container process__inner">
          <h2 className="process__title">Simple. Secure. Instant.</h2>
          <p className="process__subtitle">
            Our seamless process ensures you get high-quality assets with
            complete peace of mind.
          </p>

          <div className="process__steps">
            {steps.map((step, index) => (
              <div className="processStep" key={step.title}>
                <div className="processStep__iconWrap">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="processStep__icon"
                  />
                  <span className="processStep__badge">{index + 1}</span>
                </div>
                <div className="processStep__title">{step.title}</div>
                <div className="processStep__desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container testimonials__inner">
          <div className="testimonials__header">
            <h2 className="testimonials__title">What Our Users Say</h2>
            <div className="testimonials__underline" aria-hidden="true" />
          </div>

          <div className="testimonials__grid">
            {getCurrentReviews()?.map((item) => (
              <div
                key={item.id}
                className={`testimonialCard${
                  item.featured ? " testimonialCard--featured" : ""
                }`}
              >
                <div className="testimonialCard__rating" aria-hidden="true">
                  {"★".repeat(item.rating)}
                </div>
                <p className="testimonialCard__quote">"{item.quote}"</p>
                <div className="testimonialCard__meta">
                  <img
                    className="testimonialCard__avatar"
                    src={item.avatar}
                    alt={`${item.name} avatar`}
                  />
                  <div>
                    <div className="testimonialCard__name">{item.name}</div>
                    <div className="testimonialCard__role">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials__pagination" aria-label="Pagination">
            {Array.from({ length: getTotalReviewPages() }).map((_, index) => (
              <button 
                key={index}
                className={`pagerDot ${currentReviewPage === index ? "pagerDot--active" : ""}`}
                type="button"
                onClick={() => handleReviewPageChange(index)}
                aria-label={`Page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="container faq__inner">
          <h2 className="faq__title">Frequently Asked Questions</h2>
          <p className="faq__subtitle">
            Everything you need to know about the CertiCode marketplace and how
            we ensure a seamless transfer of premium digital assets.
          </p>

          <div className="faq__list">
            {faqs.map((faq, index) => (
              <article
                className={`faqItem${openFaqIndex === index ? " faqItem--open" : ""}`}
                key={faq.question}
              >
                <button
                  className="faqItem__trigger"
                  type="button"
                  onClick={() =>
                    setOpenFaqIndex((currentIndex) =>
                      currentIndex === index ? -1 : index,
                    )
                  }
                  aria-expanded={openFaqIndex === index}
                >
                  <span className="faqItem__text">{faq.question}</span>
                  <img
                    className="faqItem__chevron"
                    src={ArrowDown}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
                {openFaqIndex === index ? (
                  <p className="faqItem__answer">{faq.answer}</p>
                ) : null}
              </article>
            ))}
          </div>

          <div className="faq__cta">
            <div className="faq__hint">
              Still have questions? We&apos;re here to help.
            </div>
            <Link className="faq__button" to="/contact">
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__inner">
          <div className="ctaCard">
            <div className="ctaCard__content">
              <h2 className="ctaCard__title">
                Ready to Scale Your Digital Presence?
              </h2>
              <p className="ctaCard__subtitle">
                Join thousands of businesses already using CertiCode to
                accelerate their digital transformation.
              </p>
              <Link to="/register">
                <button className="ctaCard__button" type="button">
                  Get Started Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
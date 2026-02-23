import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/BlogsNews.css";
import OrangeArrow from "../../assets/OrangeArrow.png";
import { Link } from "react-router-dom";

const BlogsNews = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [sideFeatured, setSideFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchPosts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory !== "All") {
      fetchPostsByCategory();
    }
  }, [selectedCategory]);

  const fetchPosts = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://dev.to/api/articles?tag=software&page=${pageNum}&per_page=12`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        if (pageNum === 1) {
          setPosts(data);
          if (data.length > 0) {
            setFeaturedPost(data[0]);
            setSideFeatured(data.slice(1, 3));
          }
        } else {
          setPosts((prev) => [...prev, ...data]);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsByCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      const tag = selectedCategory.toLowerCase().replace(/\s+/g, "");
      const response = await fetch(
        `https://dev.to/api/articles?tag=${tag}&per_page=12`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setPosts(data);
      setHasMore(false);
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      setError("Failed to load blogs for this category.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://dev.to/api/tags?per_page=10");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      const softwareTags = data
        .filter((tag) =>
          [
            "software",
            "webdev",
            "programming",
            "security",
            "cloud",
            "ai",
            "javascript",
            "python",
            "devops",
          ].includes(tag.name),
        )
        .map((tag) => tag.name.charAt(0).toUpperCase() + tag.name.slice(1));

      setCategories(["All", ...softwareTags.slice(0, 6)]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
        "All",
        "Software Development",
        "Web Development",
        "Programming",
        "Security",
        "Cloud",
        "AI",
      ]);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const determineType = (tags) => {
    if (!tags) return "Blog";
    if (tags.includes("news")) return "News";
    if (tags.includes("tutorial")) return "Tutorial";
    return "Blog";
  };

  const openBlogPost = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getImageUrl = (post) => {
    return (
      post.cover_image ||
      post.social_image ||
      "https://via.placeholder.com/800x400?text=No+Image"
    );
  };

  if (loading && posts.length === 0) {
    return (
      <div className="blogs">
        <Navbar />
        <div className="blogs-loading">
          <div className="blogs-loading-spinner"></div>
          <p>Loading blogs...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="blogs">
        <Navbar />
        <div className="blogs-error">
          <h2>Unable to load blogs</h2>
          <p>{error}</p>
          <button
            className="blogs-error-retry"
            onClick={() => {
              setError(null);
              fetchPosts();
            }}
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

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
                      selectedCategory === item ? " is-active" : ""
                    }`}
                    type="button"
                    onClick={() => setSelectedCategory(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {featuredPost && (
            <article
              className="blogs-featured"
              onClick={() => openBlogPost(featuredPost.url)}
            >
              <div className="blogs-featured__media">
                <img
                  src={getImageUrl(featuredPost)}
                  alt={featuredPost.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=Blog+Image";
                  }}
                />
              </div>
              <div className="blogs-featured__body">
                <span className="blogs-tag">
                  {determineType(featuredPost.tag_list)}
                </span>
                <h3>{featuredPost.title}</h3>
                <p>{featuredPost.description || featuredPost.title}</p>
                <button className="blogs-read" type="button">
                  Read More <img src={OrangeArrow} alt="" aria-hidden="true" />
                </button>
              </div>
            </article>
          )}

          <div className="blogs-side">
            <div className="blogs-side__heading">Featured</div>
            <div className="blogs-side__list">
              {sideFeatured.map((item) => (
                <div
                  key={item.id}
                  className="blogs-side__card blogs-side__card--link"
                  onClick={() => openBlogPost(item.url)}
                >
                  <div className="blogs-side__media">
                    <img
                      src={getImageUrl(item)}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Blog+Image";
                      }}
                    />
                  </div>
                  <div className="blogs-side__body">
                    <span className="blogs-tag">
                      {determineType(item.tag_list)}
                    </span>
                    <h4>{item.title}</h4>
                    <span className="blogs-date">
                      {formatDate(item.published_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="blogs-grid">
        <div className="blogs-grid__inner">
          {error && (
            <div className="blogs-grid-error">
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  fetchPosts();
                }}
              >
                Retry
              </button>
            </div>
          )}

          <div className="blogs-grid__cards">
            {posts.slice(3).map((post) => (
              <div
                key={post.id}
                className="blogs-card"
                onClick={() => openBlogPost(post.url)}
              >
                <div className="blogs-card__media">
                  <img
                    src={getImageUrl(post)}
                    alt={post.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Blog+Image";
                    }}
                  />
                </div>
                <div className="blogs-card__body">
                  <span className="blogs-tag">
                    {determineType(post.tag_list)}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.description || post.title}</p>
                  <span className="blogs-date">
                    {formatDate(post.published_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && selectedCategory === "All" && !loading && (
            <button
              className="blogs-grid__more"
              type="button"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}

          {loading && (
            <div className="blogs-grid-loading">
              <div className="blogs-loading-spinner"></div>
              <p>Loading more blogs...</p>
            </div>
          )}
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
            <Link to="/register">
              <button className="blogs-cta__btn" type="button">
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

export default BlogsNews;

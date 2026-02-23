import React, { useState, useEffect } from "react";
import VerifiedIcon from "../assets/Verified.png";
import WriteReviewIcon from "../assets/write-a-rev.png";
import CameraIcon from "../assets/camera-icon.png";
import { ReviewAPI } from "../services/ReviewAPI";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const isAnonymousReview = (review) => {
  const anonymousValue =
    review?.is_anonymous ?? review?.isAnonymous ?? review?.anonymous;

  if (typeof anonymousValue === "boolean") return anonymousValue;
  if (typeof anonymousValue === "number") return anonymousValue === 1;
  if (typeof anonymousValue === "string") {
    return ["1", "true", "yes"].includes(anonymousValue.toLowerCase());
  }

  return false;
};

const getReviewerName = (review) => {
  if (isAnonymousReview(review)) return "Anonymous";
  return review?.user?.name || review?.user_name || "User";
};

const getReviewerInitial = (review) => {
  const name = getReviewerName(review);
  return name.charAt(0).toUpperCase() || "U";
};

const ProductReviews = ({ productId, product, onReviewCreated }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(4);
  const [reviewText, setReviewText] = useState("");
  const [anonymousReview, setAnonymousReview] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState([
    { label: "5 stars", value: 0 },
    { label: "4 stars", value: 0 },
    { label: "3 stars", value: 0 },
    { label: "2 stars", value: 0 },
    { label: "1 stars", value: 0 },
  ]);

  const resetReviewForm = () => {
    setSelectedRating(4);
    setReviewText("");
    setAnonymousReview(false);
    setUploadedFile(null);
    setUploadedFileName("");
    setSubmitError("");
    setSubmitSuccess("");
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  useEffect(() => {
    if (!isReviewModalOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsReviewModalOpen(false);
        resetReviewForm();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isReviewModalOpen]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewsData = await ReviewAPI.getProductReviews(productId);
      
      setReviews(reviewsData);
      
      if (reviewsData.length > 0) {
        const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        const avg = totalRating / reviewsData.length;
        setAverageRating(avg.toFixed(1));
        
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviewsData.forEach(review => {
          breakdown[review.rating]++;
        });
        
        const newBreakdown = ratingBreakdown.map(row => {
          const starNumber = parseInt(row.label.charAt(0));
          const count = breakdown[starNumber] || 0;
          const percentage = reviewsData.length > 0 ? Math.round((count / reviewsData.length) * 100) : 0;
          return { ...row, value: percentage };
        });
        
        setRatingBreakdown(newBreakdown);
      } else {
        setAverageRating(0);
        setRatingBreakdown([
          { label: "5 stars", value: 0 },
          { label: "4 stars", value: 0 },
          { label: "3 stars", value: 0 },
          { label: "2 stars", value: 0 },
          { label: "1 stars", value: 0 },
        ]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setUploadedFile(null);
      setUploadedFileName("");
      setSubmitError("Please upload an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadedFile(null);
      setUploadedFileName("");
      setSubmitError("File size must be 10MB or less.");
      return;
    }

    setSubmitError("");
    setUploadedFile(file);
    setUploadedFileName(file.name);
  };

  const getReviewImageUrl = (review) => {
    const imagePath = review?.image;
    if (!imagePath) return "";
    if (typeof imagePath === "string" && /^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }
    return `${BACKEND_BASE_URL}/${String(imagePath).replace(/^\/+/, "")}`;
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setSubmitError("Please login to submit a review.");
      return;
    }

    if (!reviewText.trim()) {
      setSubmitError("Review text is required.");
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError("");
      setSubmitSuccess("");

      const reviewPayload = {
        product_id: productId,
        rating: selectedRating,
        description: reviewText.trim(),
        is_anonymous: anonymousReview,
      };

      await ReviewAPI.createReview(reviewPayload, uploadedFile);

      setSubmitSuccess("Review submitted successfully.");
      await fetchReviews();
      if (typeof onReviewCreated === "function") {
        onReviewCreated();
      }

      setTimeout(() => {
        setIsReviewModalOpen(false);
        resetReviewForm();
      }, 700);
    } catch (submitErr) {
      setSubmitError(submitErr.message || "Failed to submit review.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const productTitle = product?.name || "E-commerce SaaS Template";
  const productPrice = Number(product?.price || 0).toFixed(2);
  const productImage = product?.featured_image || "";
  const productType = product?.asset_type || "SaaS Template";
  const productStack = Array.isArray(product?.technologies)
    ? product.technologies
        .slice(0, 2)
        .map((tech) => (typeof tech === "string" ? tech : tech?.name))
        .filter(Boolean)
        .join(" • ") || "React • Node.js"
    : "React • Node.js";

  return (
    <div className="product__reviews">
      <div className="product__reviewsSummary">
        <div className="product__ratingCard">
          <div className="product__ratingScore">{loading ? "..." : averageRating || "0.0"}</div>
          <div className="product__ratingStars">★★★★★</div>
          <div className="product__ratingMeta">{loading ? "Loading..." : `${reviews.length} Reviews`}</div>
        </div>

        <div className="product__ratingBars">
          {ratingBreakdown.map((row) => (
            <div key={row.label} className="product__barRow">
              <span>{row.label}</span>
              <div className="product__barTrack">
                <div
                  className="product__barFill"
                  style={{ width: `${row.value}%` }}
                />
              </div>
              <span className="product__barValue">{row.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="product__error">
          Error: {error}
        </div>
      )}

      <div className="product__reviewList">
        {loading ? (
          <div className="product__loading">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="product__noReviews">No reviews yet. Be the first to review!</div>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="product__reviewCard">
              <div className="product__reviewHeader">
                <div className="product__avatar">
                  {getReviewerInitial(review)}
                </div>
                <div className="product__reviewMeta">
                  <div className="product__reviewTitle">
                    <strong>{getReviewerName(review)}</strong>
                    <span className="product__verifiedBadge">
                      <img src={VerifiedIcon} alt="" />
                      Verified Purchase
                    </span>
                  </div>
                  <div className="product__reviewStars">
                    <span className="product__starsFilled">
                      {"★".repeat(review.rating)}
                    </span>
                    <span className="product__starsEmpty">
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                </div>
                <span className="product__reviewDate">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p>{review.description}</p>
              {getReviewImageUrl(review) && (
                <img
                  src={getReviewImageUrl(review)}
                  alt="Review upload"
                  className="product__reviewMedia"
                />
              )}
            </article>
          ))
        )}
      </div>

      <div className="product__reviewCta">
        <h4>Share your experience</h4>
        <p>
          Your feedback helps the community and helps us improve our assets.
        </p>
        <button
          className="product__reviewBtn"
          type="button"
          onClick={() => {
            setIsReviewModalOpen(true);
            setSubmitError("");
            setSubmitSuccess("");
          }}
        >
          <img src={WriteReviewIcon} alt="Write Review" className="product__icon" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Write a Review
        </button>
      </div>

      {isReviewModalOpen && (
        <div
          className="product__reviewModalOverlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsReviewModalOpen(false);
              resetReviewForm();
            }
          }}
        >
          <div
            className="product__reviewModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
          >
            <button
              className="product__reviewModalClose"
              type="button"
              aria-label="Close review form"
              onClick={() => {
                setIsReviewModalOpen(false);
                resetReviewForm();
              }}
            >
              ×
            </button>

            <h3 id="review-modal-title">Write a Review</h3>
            <p className="product__reviewModalSubtitle">
              Tell us about your experience and give this product a rating.
            </p>

            <div className="product__reviewModalProduct">
              <div
                className="product__reviewModalThumb"
                style={
                  productImage
                    ? {
                        backgroundImage: `url(${productImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />
              <div className="product__reviewModalProductMeta">
                <strong>{productTitle}</strong>
                <span>
                  {productType} • ${productPrice}
                </span>
                <small>{productStack}</small>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="product__reviewModalForm">
              <p className="product__reviewModalPrompt">
                Please select the rating and review the product below:
              </p>

              <div className="product__reviewModalStars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`product__reviewStar${
                      star <= selectedRating ? " product__reviewStar--active" : ""
                    }`}
                    onClick={() => setSelectedRating(star)}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <label className="product__reviewFieldLabel" htmlFor="review-description">
                Your Review
              </label>
              <textarea
                id="review-description"
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                className="product__reviewTextarea"
                placeholder="Write your experience with the product here..."
                disabled={submitLoading}
              />

              <label className="product__reviewFieldLabel" htmlFor="review-upload">
                Add Photo (optional)
              </label>
              <label className="product__reviewUpload" htmlFor="review-upload">
                <img src={CameraIcon} alt="" />
                <span>Drag & drop or click here</span>
                <small>
                  {uploadedFileName || "to upload your files (max 10 MB)"}
                </small>
              </label>
              <input
                id="review-upload"
                type="file"
                accept="image/*"
                className="product__reviewFileInput"
                onChange={handleUpload}
                disabled={submitLoading}
              />

              <label className="product__reviewAnon" htmlFor="review-anon">
                <input
                  id="review-anon"
                  type="checkbox"
                  checked={anonymousReview}
                  onChange={(event) => setAnonymousReview(event.target.checked)}
                  disabled={submitLoading}
                />
                <span className="product__reviewAnonToggle" aria-hidden="true" />
                <span className="product__reviewAnonText">
                  Leave your review anonymously
                  <small>Your name will be hidden from other users.</small>
                </span>
              </label>

              {submitError && (
                <p className="product__reviewSubmitMessage product__reviewSubmitMessage--error">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="product__reviewSubmitMessage product__reviewSubmitMessage--success">
                  {submitSuccess}
                </p>
              )}

              <button className="product__reviewSubmitBtn" type="submit" disabled={submitLoading}>
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;

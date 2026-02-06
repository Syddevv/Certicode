import React, { useState, useEffect } from "react";
import VerifiedIcon from "../assets/Verified.png";
import WriteReviewIcon from "../assets/write-a-rev.png";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState([
    { label: "5 stars", value: 0 },
    { label: "4 stars", value: 0 },
    { label: "3 stars", value: 0 },
    { label: "2 stars", value: 0 },
    { label: "1 stars", value: 0 },
  ]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      
      const reviewsData = await response.json();
      console.log("Reviews data received:", reviewsData);
      
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
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
                  {review.user?.name?.charAt(0) || "U"}
                </div>
                <div className="product__reviewMeta">
                  <div className="product__reviewTitle">
                    <strong>{review.user?.name || "User"}</strong>
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
            </article>
          ))
        )}
      </div>

      <div className="product__reviewCta">
        <h4>Share your experience</h4>
        <p>
          Your feedback helps the community and helps us improve our assets.
        </p>
        <button className="product__reviewBtn" type="button">
          <img src={WriteReviewIcon} alt="Write Review" className="product__icon" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default ProductReviews;
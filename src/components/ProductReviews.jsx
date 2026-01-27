import React from "react";
import VerifiedIcon from "../assets/Verified.png";

const ratingBreakdown = [
  { label: "5 stars", value: 92 },
  { label: "4 stars", value: 8 },
  { label: "3 stars", value: 0 },
  { label: "2 stars", value: 0 },
  { label: "1 stars", value: 0 },
];

const reviews = [
  {
    name: "Jason Dracos",
    initials: "JD",
    rating: 5,
    date: "Published Dec 7, 2025",
    body:
      "Exceptional quality. The component library is robust and the documentation made integration a breeze for our enterprise team. The dark mode implementation is the best I've seen in a marketplace asset.",
  },
  {
    name: "Sarah Higgins",
    initials: "SH",
    rating: 4,
    date: "Published Dec 1, 2025",
    body:
      "Very clean codebase. It saved us at least 40 hours of frontend work. My only suggestion would be to include more chart variations, but the existing ones are excellent.",
  },
];

const ProductReviews = () => {
  return (
    <div className="product__reviews">
      <div className="product__reviewsSummary">
        <div className="product__ratingCard">
          <div className="product__ratingScore">4.9</div>
          <div className="product__ratingStars">★★★★★</div>
          <div className="product__ratingMeta">12 Verified Reviews</div>
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

      <div className="product__reviewList">
        {reviews.map((review) => (
          <article key={review.name} className="product__reviewCard">
            <div className="product__reviewHeader">
              <div className="product__avatar">{review.initials}</div>
              <div className="product__reviewMeta">
                <div className="product__reviewTitle">
                  <strong>{review.name}</strong>
                  <span className="product__verifiedBadge">
                    <img src={VerifiedIcon} alt="" />
                    Verified Purchase
                  </span>
                </div>
                <div className="product__reviewStars">
                  <span className="product__starsFilled">
                    {"★★★★★".slice(0, review.rating)}
                  </span>
                  <span className="product__starsEmpty">
                    {"★★★★★".slice(0, 5 - review.rating)}
                  </span>
                </div>
              </div>
              <span className="product__reviewDate">{review.date}</span>
            </div>
            <p>{review.body}</p>
          </article>
        ))}
      </div>

      <div className="product__reviewCta">
        <h4>Share your experience</h4>
        <p>
          Your feedback helps the community and helps us improve our assets.
        </p>
        <button className="product__reviewBtn" type="button">
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default ProductReviews;

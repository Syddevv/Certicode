// src/services/ReviewAPI.js

const API_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("auth_token");
  return {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseErrorMessage = (data, fallbackMessage) => {
  if (!data) return fallbackMessage;

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (data.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors).flat().filter(Boolean);
    if (messages.length > 0) return messages.join(" ");
  }

  return fallbackMessage;
};

const handleResponse = async (response, fallbackMessage) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(parseErrorMessage(data, fallbackMessage));
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

const normalizeReviewPayload = (reviewData = {}) => {
  const payload = { ...reviewData };

  if (typeof payload.is_anonymous === "boolean") {
    return payload;
  }

  if (payload.isAnonymous !== undefined && payload.is_anonymous === undefined) {
    payload.is_anonymous = payload.isAnonymous;
  }

  return payload;
};

const appendFormValue = (formData, key, value) => {
  if (value === undefined || value === null) return;

  if (typeof value === "boolean") {
    formData.append(key, value ? "1" : "0");
    return;
  }

  formData.append(key, value);
};

export const ReviewAPI = {
  // PUBLIC: product reviews
  async getProductReviews(productId) {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      headers: { Accept: "application/json" },
    });
    return handleResponse(response, "Failed to fetch reviews");
  },

  // PUBLIC: top reviews
  async getTopReviews() {
    const response = await fetch(`${API_URL}/top-reviews`, {
      headers: { Accept: "application/json" },
    });
    return handleResponse(response, "Failed to fetch top reviews");
  },

  // PROTECTED: create review (supports optional image)
  // reviewData should be: { product_id, rating, description, is_anonymous }
  async createReview(reviewData, imageFile = null) {
    const normalizedReviewData = normalizeReviewPayload(reviewData);
    const hasImage = imageFile instanceof File;
    const body = hasImage ? new FormData() : null;

    if (hasImage) {
      Object.entries(normalizedReviewData).forEach(([key, value]) => {
        appendFormValue(body, key, value);
      });
      body.append("image", imageFile);
    }

    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: getAuthHeaders(hasImage),
      body: hasImage ? body : JSON.stringify(normalizedReviewData),
    });

    return handleResponse(response, "Failed to create review");
  },

  // PROTECTED: update review
  async updateReview(reviewId, reviewData, imageFile = null) {
    const normalizedReviewData = normalizeReviewPayload(reviewData);
    const hasImage = imageFile instanceof File;
    let requestBody = null;

    if (hasImage) {
      const formData = new FormData();
      Object.entries(normalizedReviewData).forEach(([key, value]) => {
        appendFormValue(formData, key, value);
      });
      formData.append("image", imageFile);
      requestBody = formData;
    } else {
      requestBody = JSON.stringify(normalizedReviewData);
    }

    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "PUT",
      headers: getAuthHeaders(hasImage),
      body: requestBody,
    });

    return handleResponse(response, "Failed to update review");
  },

  // PROTECTED: delete review
  async deleteReview(reviewId) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return handleResponse(response, "Failed to delete review");
  },

  // Client-side stats (unchanged logic, but expects review.rating)
  async getReviewStats(productId) {
    try {
      const reviews = await this.getProductReviews(productId);

      if (!reviews || reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingBreakdown: [
            { stars: 5, count: 0, percentage: 0 },
            { stars: 4, count: 0, percentage: 0 },
            { stars: 3, count: 0, percentage: 0 },
            { stars: 2, count: 0, percentage: 0 },
            { stars: 1, count: 0, percentage: 0 },
          ],
        };
      }

      const totalRating = reviews.reduce(
        (sum, r) => sum + Number(r.rating || 0),
        0,
      );
      const averageRating = totalRating / reviews.length;

      const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach((r) => {
        const rating = Number(r.rating);
        if (rating >= 1 && rating <= 5) ratingCounts[rating]++;
      });

      const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: ratingCounts[stars],
        percentage: Math.round((ratingCounts[stars] / reviews.length) * 100),
      }));

      return {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: reviews.length,
        ratingBreakdown,
      };
    } catch (error) {
      console.error("Error getting review stats:", error);
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 },
        ],
      };
    }
  },
};

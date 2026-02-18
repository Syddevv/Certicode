const API_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('auth_token');
  return {
    'Accept': 'application/json',
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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

export const ReviewAPI = {
  async getProductReviews(productId) {
    const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews`);
    return handleResponse(response, 'Failed to fetch reviews');
  },

  async createReview(reviewData, imageFile = null) {
    const hasImage = imageFile instanceof File;
    let requestBody = null;

    if (hasImage) {
      const formData = new FormData();
      Object.entries(reviewData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      formData.append('image', imageFile);
      requestBody = formData;
    } else {
      requestBody = JSON.stringify(reviewData);
    }

    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(hasImage),
      body: requestBody,
    });

    return handleResponse(response, 'Failed to create review');
  },

  async updateReview(reviewId, reviewData) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    
    return handleResponse(response, 'Failed to update review');
  },

  async deleteReview(reviewId) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response, 'Failed to delete review');
  },

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

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingCounts[review.rating]++;
        }
      });

      const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: ratingCounts[stars],
        percentage: Math.round((ratingCounts[stars] / reviews.length) * 100),
      }));

      return {
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews.length,
        ratingBreakdown,
      };
    } catch (error) {
      console.error('Error getting review stats:', error);
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

  async getTopReviews() {
    const response = await fetch('http://127.0.0.1:8000/api/top-reviews');
    return handleResponse(response, 'Failed to fetch top reviews');
  },
};

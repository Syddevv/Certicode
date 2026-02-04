const API_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const ReviewAPI = {
  async getProductReviews(productId) {
    const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews`);
    
    console.log('ReviewAPI Response status:', response.status);
    console.log('ReviewAPI Response headers:', response.headers);
    
    const data = await response.json();
    console.log('ReviewAPI Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviews');
    }
    
    return data;
  },

  async createReview(reviewData) {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create review');
    }
    
    return data;
  },

  async updateReview(reviewId, reviewData) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update review');
    }
    
    return data;
  },

  async deleteReview(reviewId) {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete review');
    }
    
    return data;
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
};
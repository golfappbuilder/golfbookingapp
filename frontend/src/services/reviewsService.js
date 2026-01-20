// Reviews stored in localStorage
const REVIEWS_KEY = 'breakfastball_reviews';

export const reviewsService = {
  // Get all reviews
  getAll: () => {
    const data = localStorage.getItem(REVIEWS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get reviews for a specific course
  getByCourseId: (courseId) => {
    const reviews = reviewsService.getAll();
    return reviews.filter(r => r.courseId === courseId);
  },

  // Get average ratings for a course
  getCourseAverages: (courseId) => {
    const reviews = reviewsService.getByCourseId(courseId);
    if (reviews.length === 0) return null;

    const totals = reviews.reduce((acc, r) => ({
      conditions: acc.conditions + r.ratings.conditions,
      paceOfPlay: acc.paceOfPlay + r.ratings.paceOfPlay,
      value: acc.value + r.ratings.value,
      overall: acc.overall + r.ratings.overall,
    }), { conditions: 0, paceOfPlay: 0, value: 0, overall: 0 });

    return {
      conditions: (totals.conditions / reviews.length).toFixed(1),
      paceOfPlay: (totals.paceOfPlay / reviews.length).toFixed(1),
      value: (totals.value / reviews.length).toFixed(1),
      overall: (totals.overall / reviews.length).toFixed(1),
      count: reviews.length,
    };
  },

  // Add a new review
  addReview: (review) => {
    const reviews = reviewsService.getAll();
    const newReview = {
      ...review,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return newReview;
  },

  // Add multiple reviews at once (for a full trip)
  addTripReviews: (tripReviews) => {
    const reviews = reviewsService.getAll();
    const newReviews = tripReviews.map(review => ({
      ...review,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
    }));
    reviews.push(...newReviews);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return newReviews;
  },
};

export default reviewsService;

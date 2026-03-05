// Feature weights (acts like trained model parameters)
const WEIGHTS = {
  category: 0.4,
  brand: 0.3,
  price: 0.2,
  popularity: 0.1,
};

//  Track user interactions (training data)
export const trackInteraction = (product) => {
  const history = JSON.parse(localStorage.getItem("userHistory")) || [];
  history.push({
    id: product.id,
    category: product.category,
    brand: product.brand,
    price: product.price,
  });
  localStorage.setItem("userHistory", JSON.stringify(history));
};

//  Get user preference vector
export const getUserProfile = () => {
  const history = JSON.parse(localStorage.getItem("userHistory")) || [];

  const profile = {
    categories: {},
    brands: {},
    avgPrice: 0,
  };

  if (!history.length) return null;

  history.forEach((p) => {
    profile.categories[p.category] =
      (profile.categories[p.category] || 0) + 1;
    profile.brands[p.brand] = (profile.brands[p.brand] || 0) + 1;
    profile.avgPrice += p.price;
  });

  profile.avgPrice /= history.length;

  return profile;
};

//  Similarity function (core ML scoring)
export const scoreProduct = (product, profile) => {
  if (!profile) return Math.random(); // cold start

  let score = 0;

  if (profile.categories[product.category]) {
    score += WEIGHTS.category;
  }

  if (profile.brands[product.brand]) {
    score += WEIGHTS.brand;
  }

  const priceDiff = Math.abs(product.price - profile.avgPrice);
  const priceScore = 1 - priceDiff / profile.avgPrice;
  score += WEIGHTS.price * Math.max(priceScore, 0);

  score += WEIGHTS.popularity * (product.rating || 0) / 5;

  return score;
};

//  Recommend top N products
export const getRecommendations = (products) => {
  const profile = getUserProfile();

  return [...products]
    .map((p) => ({
      ...p,
      aiScore: scoreProduct(p, profile),
    }))
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 6);
};

//  Simple NLP intent detection
export const detectIntent = (message) => {
  const text = message.toLowerCase();

  if (text.includes("cheap") || text.includes("low price"))
    return "cheap";
  if (text.includes("expensive") || text.includes("premium"))
    return "premium";
  if (text.includes("laptop")) return "laptop";
  if (text.includes("phone")) return "phone";
  if (text.includes("headphone")) return "headphone";

  return "recommend";
};
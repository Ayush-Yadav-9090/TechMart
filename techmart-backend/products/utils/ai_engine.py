# products/utils/ai_engine.py

def calculate_similarity(product, reference):
    score = 0
    if product.category == reference.category:
        score += 40
    if product.brand == reference.brand:
        score += 30

    price_diff = abs(float(product.price) - float(reference.price))
    if price_diff < 1000:
        score += 20
    elif price_diff < 3000:
        score += 10
    return min(score, 100)


def content_based_recommendations(products, user_history):
    if not user_history:
        return []

    last_viewed = user_history[-1]
    recommendations = []
    for p in products:
        score = calculate_similarity(p, last_viewed)
        if score >= 40:
            p.ai_score = score
            recommendations.append(p)
    recommendations.sort(key=lambda x: x.ai_score, reverse=True)
    return recommendations[:8]


def trending_products(products):
    recommendations = []
    for p in products:
        score = min(100, (p.views * 0.3 + p.purchases * 0.5))
        p.ai_score = score
        recommendations.append(p)
    recommendations.sort(key=lambda x: x.ai_score, reverse=True)
    return recommendations[:8]


def similar_user_recommendations(products, similar_users):
    popular_categories = {}
    for user in similar_users:
        for cat in user.purchased_categories():
            popular_categories[cat] = popular_categories.get(cat, 0) + 1

    recommendations = []
    for p in products:
        if p.category in popular_categories:
            p.ai_score = min(100, popular_categories[p.category] * 20)
            recommendations.append(p)

    recommendations.sort(key=lambda x: x.ai_score, reverse=True)
    return recommendations[:8]


def frequently_bought_together(products, user_history):
    if not user_history:
        return []
    last_category = user_history[-1].category
    recommendations = [p for p in products if p.category == last_category]
    for p in recommendations:
        p.ai_score = 80  # Default confidence
    return recommendations[:6]

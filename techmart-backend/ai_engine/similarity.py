def calculate_similarity(p, ref):
    score = 0

    if p.category_id == ref.category_id:
        score += 40

    if p.brand_id == ref.brand_id:
        score += 30

    price_diff = abs(p.price - ref.price)

    if price_diff < 1000:
        score += 20
    elif price_diff < 3000:
        score += 10

    return min(score, 100)

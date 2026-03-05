from products.models import Product
from orders.models import OrderItem, Order
from django.db.models import Count
from .similarity import calculate_similarity


# -------------------------
# Content Based
# -------------------------

def content_based_recommendations(user, limit=8):
    last_item = (
        OrderItem.objects
        .filter(order__user=user)
        .select_related("product")
        .order_by("-id")
        .first()
    )

    if not last_item:
        return Product.objects.none()

    ref = last_item.product
    candidates = Product.objects.exclude(id=ref.id)

    scored = []

    for p in candidates:
        score = calculate_similarity(p, ref)
        if score >= 40:
            p.aiScore = score
            scored.append(p)

    return sorted(scored, key=lambda x: x.aiScore, reverse=True)[:limit]


# -------------------------
# Trending
# -------------------------

def trending_products(limit=8):
    return (
        Product.objects
        .annotate(
            purchases=Count("orderitem")
        )
        .order_by("-purchases")[:limit]
    )


# -------------------------
# Collaborative Filtering
# -------------------------

def similar_user_recommendations(user, limit=8):

    user_categories = (
        OrderItem.objects
        .filter(order__user=user)
        .values_list("product__category", flat=True)
    )

    similar_users = (
        Order.objects
        .filter(items__product__category__in=user_categories)
        .exclude(user=user)
        .values_list("user", flat=True)
        .distinct()
    )

    return (
        Product.objects
        .filter(orderitem__order__user__in=similar_users)
        .annotate(freq=Count("orderitem"))
        .order_by("-freq")[:limit]
    )


# -------------------------
# Frequently Bought Together
# -------------------------

def frequently_bought_together(product_id, limit=6):

    orders = OrderItem.objects.filter(product_id=product_id)\
        .values_list("order_id", flat=True)

    return (
        Product.objects
        .filter(orderitem__order_id__in=orders)
        .exclude(id=product_id)
        .annotate(freq=Count("orderitem"))
        .order_by("-freq")[:limit]
    )

# from rest_framework.routers import DefaultRouter
# from .views import ReviewViewSet

# router = DefaultRouter()
# router.register(r"reviews", ReviewViewSet, basename="reviews")

# urlpatterns = router.urls


from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet

router = DefaultRouter()
router.register("reviews", ReviewViewSet, basename="reviews")

urlpatterns = router.urls

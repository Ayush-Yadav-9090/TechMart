from django.urls import path
from . import views

urlpatterns = [
    path("for-you/", views.for_you),
    path("trending/", views.trending),
    path("similar-users/", views.similar_users),
    path("paired/<int:product_id>/", views.frequently_paired),
]

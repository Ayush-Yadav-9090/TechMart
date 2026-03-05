from django.urls import path
from .views import AdminDashboardStatsView

urlpatterns = [
    path('dashboard/', AdminDashboardStatsView.as_view()),
]

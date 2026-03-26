from django.urls import path
from . import views

urlpatterns = [
    # Root
    path('', views.api_root, name='api-root'),

    # Menu
    path('menu/', views.MenuListView.as_view(), name='menu-list'),
    path('menu/<int:pk>/', views.MenuItemDetailView.as_view(), name='menu-detail'),

    # Orders
    path('orders/create/', views.OrderCreateView.as_view(), name='order-create'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),

    # Food Donations
    path('donations/create/', views.FoodDonationCreateView.as_view(), name='donation-create'),
    path('donations/', views.FoodDonationListView.as_view(), name='donation-list'),

    # Contact
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact'),

    # Stats
    path('rescue-stats/', views.rescue_stats, name='rescue-stats'),
]

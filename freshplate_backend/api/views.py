from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import MenuItem, Order, FoodDonation, ContactMessage
from .serializers import (
    MenuItemSerializer,
    OrderCreateSerializer,
    OrderDetailSerializer,
    FoodDonationSerializer,
    ContactMessageSerializer
)


# ===== ROOT API INFO =====
@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'FreshPlate API mein aapka swagat hai! 🍽️',
        'version': '1.0',
        'endpoints': {
            'menu': '/api/menu/',
            'menu_by_category': '/api/menu/?category=veg',
            'place_order': '/api/orders/create/',
            'track_order': '/api/orders/<id>/',
            'donate_food': '/api/donations/create/',
            'contact': '/api/contact/',
        }
    })


# ===== MENU VIEWS =====
class MenuListView(generics.ListAPIView):
    """
    Saare menu items laao.
    Filter karo: /api/menu/?category=veg
    """
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        queryset = MenuItem.objects.filter(is_available=True)
        category = self.request.query_params.get('category')
        if category and category != 'all':
            queryset = queryset.filter(category=category)
        return queryset


class MenuItemDetailView(generics.RetrieveAPIView):
    """Ek specific menu item ki detail"""
    queryset = MenuItem.objects.filter(is_available=True)
    serializer_class = MenuItemSerializer


# ===== ORDER VIEWS =====
class OrderCreateView(generics.CreateAPIView):
    """
    Naya order place karo.
    POST /api/orders/create/
    Body:
    {
        "customer_name": "Rahul Sharma",
        "customer_email": "rahul@email.com",
        "customer_phone": "9876543210",
        "delivery_address": "Flat 101, Sector 19, Noida",
        "items": [
            {"menu_item_id": 1, "quantity": 2},
            {"menu_item_id": 5, "quantity": 1}
        ]
    }
    """
    serializer_class = OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        # Detailed response wapas bhejo
        detail_serializer = OrderDetailSerializer(order)
        return Response({
            'message': 'Order successfully place ho gaya! 🎉',
            'order': detail_serializer.data
        }, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    """
    Order track karo by ID.
    GET /api/orders/<id>/
    """
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Yeh order nahi mila.'},
                status=status.HTTP_404_NOT_FOUND
            )


# ===== FOOD DONATION VIEWS =====
class FoodDonationCreateView(generics.CreateAPIView):
    """
    Food donation register karo.
    POST /api/donations/create/
    Body:
    {
        "donor_name": "Rajesh Kumar",
        "donor_email": "rajesh@restaurant.com",
        "donor_phone": "9876543210",
        "organization_name": "Rajesh Dhaba",
        "food_description": "Dal, Sabzi, Roti - approx 50 portions",
        "quantity_kg": 20,
        "pickup_address": "Main Market, Sector 18, Noida",
        "preferred_pickup_time": "2024-12-15T18:00:00"
    }
    """
    serializer_class = FoodDonationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        donation = serializer.save()
        return Response({
            'message': 'Dhanyavaad! Aapka food donation register ho gaya. 🙏 Hum jaldi pickup ke liye contact karenge.',
            'donation_id': donation.id,
            'status': donation.status
        }, status=status.HTTP_201_CREATED)


class FoodDonationListView(generics.ListAPIView):
    """Saari donations ki list (admin use)"""
    queryset = FoodDonation.objects.all()
    serializer_class = FoodDonationSerializer


# ===== CONTACT VIEW =====
class ContactMessageCreateView(generics.CreateAPIView):
    """
    Contact form submit karo.
    POST /api/contact/
    Body:
    {
        "name": "Priya Singh",
        "email": "priya@email.com",
        "message": "Mujhe food rescue program ke baare mein jaanna hai."
    }
    """
    serializer_class = ContactMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'message': 'Aapka message mil gaya! Hum 24 ghante mein jawab denge. 😊'
        }, status=status.HTTP_201_CREATED)


# ===== STATS VIEW (Food Rescue section ke liye) =====
@api_view(['GET'])
def rescue_stats(request):
    """Food rescue stats"""
    from django.db.models import Sum, Count

    total_donations = FoodDonation.objects.filter(status='distributed').count()
    total_food_kg = FoodDonation.objects.filter(
        status='distributed'
    ).aggregate(total=Sum('quantity_kg'))['total'] or 0

    # Meals estimate: 1 kg = approx 4 meals
    meals_donated = int(total_food_kg * 4)
    food_saved_lbs = round(float(total_food_kg) * 2.205, 1)

    return Response({
        'meals_donated': meals_donated,
        'partner_organizations': 200,  # Static for now
        'food_waste_saved_lbs': food_saved_lbs,
        'total_donations': total_donations
    })

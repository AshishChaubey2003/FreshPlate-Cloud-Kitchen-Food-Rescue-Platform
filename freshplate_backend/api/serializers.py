from rest_framework import serializers
from .models import MenuItem, Order, OrderItem, FoodDonation, ContactMessage


# ===== MENU ITEM SERIALIZER =====
class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'category', 'image_url', 'is_available']


# ===== ORDER ITEM SERIALIZER =====
class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_name', 'quantity', 'price_at_order', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal()


# ===== ORDER CREATE SERIALIZER (Order place karte waqt) =====
class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )

    class Meta:
        model = Order
        fields = ['customer_name', 'customer_email', 'customer_phone', 'delivery_address', 'items']

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Order mein kam se kam ek item hona chahiye.")
        for item in items:
            if 'menu_item_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError("Har item mein menu_item_id aur quantity hona chahiye.")
            if int(item['quantity']) < 1:
                raise serializers.ValidationError("Quantity 1 se kam nahi ho sakti.")
        return items

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        total = 0

        # Order banao
        order = Order.objects.create(**validated_data)

        # OrderItems banao
        for item_data in items_data:
            menu_item = MenuItem.objects.get(id=item_data['menu_item_id'])
            quantity = int(item_data['quantity'])
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                price_at_order=menu_item.price
            )
            total += menu_item.price * quantity

        # Total update karo
        order.total_amount = total
        order.save()
        return order


# ===== ORDER DETAIL SERIALIZER (Order dekhne ke liye) =====
class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'customer_email', 'customer_phone',
                  'delivery_address', 'status', 'total_amount', 'items', 'created_at']


# ===== FOOD DONATION SERIALIZER =====
class FoodDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodDonation
        fields = ['id', 'donor_name', 'donor_email', 'donor_phone', 'organization_name',
                  'food_description', 'quantity_kg', 'pickup_address',
                  'preferred_pickup_time', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']


# ===== CONTACT MESSAGE SERIALIZER =====
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['created_at']

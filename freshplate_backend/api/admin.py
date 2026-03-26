from django.contrib import admin
from .models import MenuItem, Order, OrderItem, FoodDonation, ContactMessage


# ===== MENU ITEM ADMIN =====
@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available']
    list_filter = ['category', 'is_available']
    search_fields = ['name', 'description']
    list_editable = ['price', 'is_available']


# ===== ORDER ADMIN =====
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['price_at_order']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'customer_phone', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['customer_name', 'customer_email', 'customer_phone']
    list_editable = ['status']
    inlines = [OrderItemInline]
    readonly_fields = ['total_amount', 'created_at', 'updated_at']


# ===== FOOD DONATION ADMIN =====
@admin.register(FoodDonation)
class FoodDonationAdmin(admin.ModelAdmin):
    list_display = ['donor_name', 'organization_name', 'quantity_kg', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['donor_name', 'donor_email', 'organization_name']
    list_editable = ['status']


# ===== CONTACT MESSAGE ADMIN =====
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email']
    list_editable = ['is_read']

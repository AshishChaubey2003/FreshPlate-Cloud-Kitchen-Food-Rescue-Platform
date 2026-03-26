from django.db import models


# ===== MENU ITEM MODEL =====
class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('veg', 'Vegetarian'),
        ('nonveg', 'Non-Vegetarian'),
        ('desserts', 'Desserts'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image_url = models.URLField(blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category}) - ₹{self.price}"

    class Meta:
        ordering = ['category', 'name']


# ===== ORDER MODEL =====
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=15)
    delivery_address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name} ({self.status})"

    class Meta:
        ordering = ['-created_at']


# ===== ORDER ITEM MODEL (Order ke andar kaunsa item kitna) =====
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_order = models.DecimalField(max_digits=8, decimal_places=2)  # Price us waqt ka

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} in Order #{self.order.id}"

    def subtotal(self):
        return self.quantity * self.price_at_order


# ===== FOOD DONATION MODEL =====
class FoodDonation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Pickup'),
        ('scheduled', 'Pickup Scheduled'),
        ('picked_up', 'Picked Up'),
        ('distributed', 'Distributed'),
    ]

    donor_name = models.CharField(max_length=200)
    donor_email = models.EmailField()
    donor_phone = models.CharField(max_length=15)
    organization_name = models.CharField(max_length=200, blank=True)
    food_description = models.TextField()
    quantity_kg = models.DecimalField(max_digits=8, decimal_places=2)
    pickup_address = models.TextField()
    preferred_pickup_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Donation by {self.donor_name} - {self.quantity_kg}kg ({self.status})"

    class Meta:
        ordering = ['-created_at']


# ===== CONTACT MESSAGE MODEL =====
class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} - {self.email}"

    class Meta:
        ordering = ['-created_at']

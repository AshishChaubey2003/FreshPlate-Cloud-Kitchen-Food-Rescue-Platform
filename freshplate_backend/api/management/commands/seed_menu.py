from django.core.management.base import BaseCommand
from api.models import MenuItem


class Command(BaseCommand):
    help = 'FreshPlate ke liye sample menu data add karo'

    def handle(self, *args, **kwargs):
        menu_items = [
            # Vegetarian
            {'name': 'Vegetable Pasta', 'description': 'Fresh pasta with seasonal vegetables in creamy sauce', 'price': 12.99, 'category': 'veg', 'image_url': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500'},
            {'name': 'Margherita Pizza', 'description': 'Classic pizza with tomato, mozzarella, and basil', 'price': 14.99, 'category': 'veg', 'image_url': 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500'},
            {'name': 'Fresh Salad Bowl', 'description': 'Mixed greens with fresh vegetables and dressing', 'price': 9.99, 'category': 'veg', 'image_url': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500'},
            {'name': 'Vegetable Biryani', 'description': 'Fragrant rice with mixed vegetables and spices', 'price': 13.99, 'category': 'veg', 'image_url': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500'},
            {'name': 'Paneer Butter Masala', 'description': 'Cottage cheese in rich buttery tomato gravy', 'price': 11.99, 'category': 'veg', 'image_url': 'https://images.unsplash.com/photo-1633945274417-ab438e4a24ca?w=500'},
            {'name': 'Dal Makhani', 'description': 'Creamy black lentils with butter and spices', 'price': 9.99, 'category': 'veg', 'image_url': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'},
            {'name': 'Masala Dosa', 'description': 'Crispy rice crepe with potato filling', 'price': 8.99, 'category': 'veg', 'image_url': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500'},
            {'name': 'Vegetable Stir Fry', 'description': 'Fresh vegetables stir-fried in oriental sauce', 'price': 10.99, 'category': 'veg', 'image_url': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'},
            # Non-Veg
            {'name': 'Grilled Chicken', 'description': 'Tender chicken breast with herbs and spices', 'price': 15.99, 'category': 'nonveg', 'image_url': 'https://images.unsplash.com/photo-1616645258469-ec681c17f3ee?w=500'},
            {'name': 'Butter Chicken', 'description': 'Tender chicken in creamy buttery tomato sauce', 'price': 15.99, 'category': 'nonveg', 'image_url': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500'},
            {'name': 'Beef Burger', 'description': 'Juicy beef patty with cheese and fresh vegetables', 'price': 11.99, 'category': 'nonveg', 'image_url': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'},
            {'name': 'Chicken Biryani', 'description': 'Fragrant rice with tender chicken pieces', 'price': 14.99, 'category': 'nonveg', 'image_url': 'https://images.unsplash.com/photo-1563379091339-283269cfe67e?w=500'},
            {'name': 'Fish Curry', 'description': 'Fresh fish cooked in spicy coconut gravy', 'price': 17.99, 'category': 'nonveg', 'image_url': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500'},
            {'name': 'Chicken Tikka', 'description': 'Marinated chicken pieces grilled to perfection', 'price': 13.99, 'category': 'nonveg', 'image_url': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500'},
            {'name': 'Egg Curry', 'description': 'Boiled eggs in rich spicy gravy', 'price': 10.99, 'category': 'nonveg', 'image_url': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500'},
            # Desserts
            {'name': 'Chocolate Cake', 'description': 'Rich, moist chocolate cake with chocolate frosting', 'price': 6.99, 'category': 'desserts', 'image_url': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'},
            {'name': 'Vanilla Ice Cream', 'description': 'Creamy vanilla ice cream with chocolate sauce', 'price': 4.99, 'category': 'desserts', 'image_url': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500'},
            {'name': 'Gulab Jamun', 'description': 'Sweet milk dumplings in rose-flavored syrup', 'price': 5.99, 'category': 'desserts', 'image_url': 'https://images.unsplash.com/photo-1586445440744-6b0bcf8df914?w=500'},
            {'name': 'Cheesecake', 'description': 'Creamy cheesecake with berry compote', 'price': 7.99, 'category': 'desserts', 'image_url': 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500'},
            {'name': 'Mango Lassi', 'description': 'Refreshing yogurt drink with mango', 'price': 4.99, 'category': 'desserts', 'image_url': 'https://images.unsplash.com/photo-1568724001336-2101ca2a1d4e?w=500'},
            {'name': 'Tiramisu', 'description': 'Italian coffee-flavored dessert', 'price': 8.99, 'category': 'desserts', 'image_url': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500'},
        ]

        created = 0
        for item_data in menu_items:
            obj, made = MenuItem.objects.get_or_create(name=item_data['name'], defaults=item_data)
            if made:
                created += 1

        self.stdout.write(self.style.SUCCESS(f'✅ {created} naye menu items add ho gaye!'))

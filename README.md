# 🍽️ FreshPlate - Cloud Kitchen & Food Rescue Platform

[![GitHub stars](https://img.shields.io/github/stars/AshishChaubey2003/FreshPlate-Cloud-Kitchen-Food-Rescue-Platform)](https://github.com/AshishChaubey2003/FreshPlate-Cloud-Kitchen-Food-Rescue-Platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/AshishChaubey2003/FreshPlate-Cloud-Kitchen-Food-Rescue-Platform)](https://github.com/AshishChaubey2003/FreshPlate-Cloud-Kitchen-Food-Rescue-Platform/network)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A full-stack web application that combines food ordering with food donation management, built with Django REST Framework and JavaScript. Streamline food delivery while reducing food waste through surplus food donations.

## ✨ Features

### 🍕 Food Ordering
- **Dynamic Cart System** - Add, remove, and update quantities in real-time
- **Order Tracking** - Track order status with interactive progress bar
- **Category Filtering** - Filter menu items by Veg, Non-Veg, and Desserts
- **Price at Order** - Accurate transaction tracking with price snapshots

### 🤝 Food Rescue & Donation
- **Food Donation Module** - Structured workflow for surplus food donations
- **Rescue Center Mapping** - Leaflet.js integration for location-based services
- **Donation Stats** - Track rescue center contributions and impact

### 🔐 Security & Administration
- **JWT Authentication** - Secure user access and API endpoints
- **Custom Django Admin** - Inline editing for efficient content management
- **Seed Script** - Generate sample menu data for testing

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Django, Django REST Framework, JWT |
| **Frontend** | JavaScript (ES6+), HTML5, CSS3 |
| **Styling** | CSS Grid, Flexbox, Responsive Design |
| **Database** | SQLite (Development), PostgreSQL (Production ready) |
| **Maps** | Leaflet.js |
| **Tools** | Git, GitHub, VS Code |

## 📋 Prerequisites

- Python 3.8+
- pip package manager
- Virtual environment (recommended)

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/AshishChaubey2003/FreshPlate-Cloud-Kitchen-Food-Rescue-Platform.git
cd FreshPlate-Cloud-Kitchen-Food-Rescue-Platform

Step 2: Create Virtual Environment
python -m venv venv
venv\Scripts\activate

Step 3: Install Dependencies
pip install -r requirements.txt

Step 4: Database Setup
python manage.py makemigrations
python manage.py migrate


Step 5: Create Superuser (Admin Access)
python manage.py createsuperuser
# Enter username, email, and password

Step 6: Seed Sample Data
python manage.py seed_menu

Step 7: Run Development Server
python manage.py runserver

Sample API Request
Place Order:
POST /api/orders/create/
{
    "customer_name": "Rahul Sharma",
    "customer_email": "rahul@gmail.com",
    "customer_phone": "9876543210",
    "delivery_address": "Flat 101, Sector 19, Noida",
    "items": [
        {"menu_item_id": 1, "quantity": 2},
        {"menu_item_id": 5, "quantity": 1}
    ]

Food Donation:
POST /api/donations/create/
{
    "donor_name": "Rajesh Kumar",
    "donor_email": "rajesh@restaurant.com",
    "donor_phone": "9876543210",
    "organization_name": "Rajesh Dhaba",
    "food_description": "Dal, Sabzi, Roti - 50 portions",
    "quantity_kg": 20,
    "pickup_address": "Main Market, Sector 18, Noida",
    "preferred_pickup_time": "2024-12-15T18:00:00"
}

 Admin Panel
Access the Django admin interface at http://127.0.0.1:8000/admin/

Admin capabilities:

✅ Manage menu items (CRUD operations)

✅ View and update order status

✅ Review and manage food donations

✅ Respond to contact messages

📁 Project Structure
text
freshplate_backend/
├── manage.py
├── requirements.txt
├── script_updated.js        # Frontend JavaScript
├── freshplate_backend/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── api/
    ├── models.py            # Database models
    ├── serializers.py       # Data validation
    ├── views.py             # API logic
    ├── urls.py              # URL routing
    ├── admin.py             # Admin configuration
    └── management/
        └── commands/
            └── seed_menu.py # Data seeding script
🚀 Deployment Considerations
For production deployment:

python
# settings.py
DEBUG = False
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = ["https://yourdomain.com"]
SECRET_KEY = os.environ.get('SECRET_KEY')
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📧 Contact
Ashish Kumar Chaubey

📧 Email: sashishchaubey1234@gmail.com

🔗 LinkedIn: Ashish Chaubey

🐙 GitHub: AshishChaubey2003

🙏 Acknowledgments
Django REST Framework for robust API development

Leaflet.js for interactive mapping

All contributors and testers
}

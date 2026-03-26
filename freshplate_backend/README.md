# 🍽️ FreshPlate - Django Backend Setup Guide

## Project Structure
```
freshplate_backend/
├── manage.py
├── requirements.txt
├── script_updated.js        ← Frontend ke liye updated JS (replace karo)
├── freshplate_backend/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── api/
    ├── models.py            ← Database tables
    ├── serializers.py       ← Data validation
    ├── views.py             ← API logic
    ├── urls.py              ← Routes
    ├── admin.py             ← Admin panel config
    └── management/
        └── commands/
            └── seed_menu.py ← Sample data
```

---

## ⚡ Setup - Step by Step

### Step 1: Python & Virtual Environment
```bash
# Virtual environment banao
python -m venv venv

# Activate karo
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### Step 2: Dependencies Install Karo
```bash
pip install -r requirements.txt
```

### Step 3: Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 4: Admin User Banao
```bash
python manage.py createsuperuser
# Name, email, password daalo
```

### Step 5: Sample Menu Data Add Karo
```bash
python manage.py seed_menu
```

### Step 6: Server Chalaao
```bash
python manage.py runserver
```

✅ **Server chal raha hai:** `http://127.0.0.1:8000`

---

## 🔗 API Endpoints

| Method | URL | Kya karta hai |
|--------|-----|----------------|
| GET | `/api/` | API info |
| GET | `/api/menu/` | Saare menu items |
| GET | `/api/menu/?category=veg` | Sirf veg items |
| GET | `/api/menu/?category=nonveg` | Sirf non-veg |
| GET | `/api/menu/?category=desserts` | Sirf desserts |
| GET | `/api/menu/1/` | Specific item |
| POST | `/api/orders/create/` | Order place karo |
| GET | `/api/orders/5/` | Order track karo |
| POST | `/api/donations/create/` | Food donate karo |
| POST | `/api/contact/` | Message bhejo |
| GET | `/api/rescue-stats/` | Stats |

---

## 📋 Order Place Karne Ka Format

```json
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
}
```

## 🫱 Food Donation Format

```json
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
```

---

## 🔌 Frontend Se Connect Karo

1. `script_updated.js` ko apne frontend folder mein copy karo
2. `index.html` mein yeh change karo:
   ```html
   <!-- Purana -->
   <script src="script.js"></script>
   <!-- Naya -->
   <script src="script_updated.js"></script>
   ```

---

## 🖥️ Admin Panel

`http://127.0.0.1:8000/admin/` pe jao aur superuser se login karo.

Yahan se kar sakte ho:
- ✅ Menu items add/edit/delete
- ✅ Orders dekhna aur status update karna  
- ✅ Food donations manage karna
- ✅ Contact messages padhna

---

## 🚀 Production Ke Liye (baad mein)

```python
# settings.py mein change karo:
DEBUG = False
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = ["https://tumharasite.com"]
SECRET_KEY = os.environ.get('SECRET_KEY')  # Environment variable se lo
```

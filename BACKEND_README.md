# NOVATRA Backend Documentation

## Architecture

```
Frontend (React + Vite)
    ↓
Vercel Serverless Functions (/api)
    ↓
Supabase (PostgreSQL + Auth)
```

## API Endpoints

### Products API (`/api/products`)

**GET /api/products** - Get all products
```bash
curl https://your-app.vercel.app/api/products
```

**GET /api/products?id={id}** - Get single product
```bash
curl https://your-app.vercel.app/api/products?id=123
```

**POST /api/products** - Create product (admin only)
```bash
curl -X POST https://your-app.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{"sku": "VRS-001", "name": {...}, "price": {...}, ...}'
```

**PUT /api/products?id={id}** - Update product (admin only)
```bash
curl -X PUT https://your-app.vercel.app/api/products?id=123 \
  -H "Content-Type: application/json" \
  -d '{"price": {"ils": 1500, ...}}'
```

**DELETE /api/products?id={id}** - Delete product (admin only)
```bash
curl -X DELETE https://your-app.vercel.app/api/products?id=123
```

---

### Auth API (`/api/auth`)

**POST /api/auth** - Authentication actions
```bash
# Sign Up
curl -X POST https://your-app.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "signup", "email": "user@example.com", "password": "password123", "full_name": "John Doe"}'

# Login
curl -X POST https://your-app.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "login", "email": "user@example.com", "password": "password123"}'

# Logout
curl -X POST https://your-app.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "logout"}'

# Get Session
curl -X POST https://your-app.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "session"}'
```

---

### Orders API (`/api/orders`)

**GET /api/orders** - Get all orders
```bash
curl https://your-app.vercel.app/api/orders
```

**GET /api/orders?id={id}** - Get single order
```bash
curl https://your-app.vercel.app/api/orders?id=123
```

**POST /api/orders** - Create new order
```bash
curl -X POST https://your-app.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "total_price": 1500,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "050-1234567",
    "shipping_address": {...}
  }'
```

**PUT /api/orders?id={id}** - Update order status (admin only)
```bash
curl -X PUT https://your-app.vercel.app/api/orders?id=123 \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

---

### Chat API (`/api/chat`)

**POST /api/chat** - AI chat with Gemini
```bash
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "מה יש לכם במיטות תינוקות?",
    "history": []
  }'
```

---

## Setup Instructions

### 1. Create Supabase Project
Follow instructions in `SUPABASE_SETUP.md`

### 2. Configure Environment Variables

**Locally (.env.local):**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

**In Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (mark as secret!)
   - `GEMINI_API_KEY` (mark as secret!)

### 3. Initialize Database

Run the SQL from `DATABASE_SCHEMA.md` in Supabase SQL Editor

### 4. Deploy

```bash
git push origin main
# Vercel will auto-deploy
```

---

## Security Notes

### API Keys
- ✅ `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Safe for frontend (respects RLS)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY`: Server-side ONLY (bypasses RLS)
- ⚠️ `GEMINI_API_KEY`: Server-side ONLY

### Row Level Security (RLS)
All Supabase tables have RLS enabled. Policies:
- **Products**: Public read, admin write
- **Users**: Own data only
- **Orders**: Own orders only
- **Reviews**: Public read, authenticated write

### Admin Protection
TODO: Add authentication middleware to protect admin routes.

---

## Migration from LocalStorage

To migrate existing localStorage data to Supabase:

1. Export data:
```javascript
const products = JSON.parse(localStorage.getItem('products'));
console.log(JSON.stringify(products));
```

2. Import to Supabase via SQL:
```sql
INSERT INTO products (sku, name, price, ...) VALUES (...);
```

Or use the Products API to batch insert.

---

## Testing

### Test Products API
```bash
# Get all products
curl https://your-app.vercel.app/api/products

# Should return: []
# (empty until you add products via admin panel or API)
```

### Test Auth
```bash
# Sign up
curl -X POST https://your-app.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "signup", "email": "test@test.com", "password": "test123", "full_name": "Test User"}'
```

---

## Next Steps

1. ✅ Setup Supabase project
2. ✅ Configure environment variables
3. ✅ Initialize database
4. ⏳ Update frontend contexts to use APIs
5. ⏳ Add authentication UI
6. ⏳ Protect admin routes
7. ⏳ Migrate localStorage data
8. ⏳ Test and deploy

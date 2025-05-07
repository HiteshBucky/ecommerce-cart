# E-Commerce Backend Assignment Documentation

## 📌 Overview

This backend project simulates an e-commerce platform where users can add items to their cart and place orders. Every **nth** global order gets a discount code (coupon), which can be used to get a 10% discount on the total order value. The platform also provides admin APIs to manage discount codes and fetch order statistics.

---

## 🚀 Tech Stack

- **Node.js** with **Express**
- **Sequelize** ORM with PostgreSQL
- In-memory support or persistent DB (based on user setup)

---

## 📦 Models

### `users`

- `id`: INTEGER (PK)
- `name`: STRING
- `email`: STRING
- ...

### `products`

- `id`: INTEGER (PK)
- `name`: STRING
- `price`: DECIMAL
- ...

### `carts`

- `id`: INTEGER (PK)
- `user_id`: FK → `users.id`
- `created_at`, `updated_at`

### `cart_items`

- `id`: INTEGER (PK)
- `cart_id`: FK → `carts.id`
- `product_id`: FK → `products.id`
- `quantity`: INTEGER

### `orders`

- `id`: INTEGER (PK)
- `user_id`: FK → `users.id`
- `discount_code_id`: FK → `discount_codes.id` (nullable)
- `total_price`: DECIMAL
- `final_price`: DECIMAL (after discount)

### `order_items`

- `id`: INTEGER (PK)
- `order_id`: FK → `orders.id`
- `product_id`: FK → `products.id`
- `quantity`: INTEGER
- `price`: DECIMAL

### `discount_codes`

- `id`: INTEGER (PK)
- `code`: STRING (unique)
- `is_used`: BOOLEAN
- `discount_percent`: INTEGER
- `nth_order`: INTEGER (shows at what global order this code becomes applicable)

---

## 🔁 API Flow

### Customer Journey:

1. **\[GET]** `/product`

   - Fetch available products

2. **\[GET]** `/cart/user/:userId`

   - Fetch user cart if it exists

3. **\[POST]** `/cart/user/:userId`

   - Create cart for user (only once)

4. **\[POST]** `/cart/:cartId/item`

   - Add item to cart

5. **\[DELETE]** `/cart/:cartId/item`

   - Remove item from cart

6. **\[GET]** `/cart/discount-code`

   - Fetch if a discount code is available

7. **\[POST]** `/cart/:cartId/checkout`

   - Checkout cart → Creates an order
   - Validates if discount code is applicable based on nth global order
   - Clears cart and cart items

---

### Admin Journey:

1. **\[GET]** `/admin/discount-codes`

   - Fetch current active discount code

2. **\[POST]** `/admin/discount-codes`

   - Generate a new discount code for every nth global order

> 🔐 These endpoints should be protected in production.

---

## 📘 API Documentation

### 1. `GET /product`

- **Description**: List all products
- **Response**: `[{ id, name, price }]`

### 2. `GET /admin/discount-codes`

- **Description**: Get latest/active discount code

### 3. `POST /admin/discount-codes`

- **Body**: `{ code: string, nth_order: number }`
- **Description**: Create discount code to be applied every nth order

### 4. `GET /cart/user/:userId`

- **Description**: Fetch cart and cart items of a user

### 5. `POST /cart/user/:userId`

- **Description**: Create cart for a user

### 6. `POST /cart/:cartId/item`

- **Body**: `{ product_id, quantity }`
- **Description**: Add product to cart

### 7. `DELETE /cart/:cartId/item`

- **Body**: `{ product_id }`
- **Description**: Remove item from cart

### 8. `GET /cart/discount-code`

- **Description**: Check if user is eligible for current discount code based on nth order logic

### 9. `POST /cart/:cartId/checkout`

- **Body**: `{}`
- **Description**: Convert cart to order

  - Validates discount code
  - Marks it as used if applicable
  - Clears the cart

---

## 🧠 Assumptions

- Each user has **only one active cart**
- Discount code applies to the **entire order**, not specific items
- Discount code is used **once globally**, not per user
- Orders are tracked globally; nth order determines eligibility

---

## 🧪 Sample Response (GET /cart/discount-code)

```json
{
  "status": 200,
  "message": "Details fetched Successfully",
  "data": {
    "id": 1,
    "code": "SAVE10",
    "is_used": false,
    "discount_percent": 10,
    "nth_order": 5
  }
}
```

---

## 🧪 Stretch Goals (Optional)

- Add UI to test flow
- Add Swagger or Postman collection
- Add unit tests with Jest or Mocha

---

## 📂 Folder Structure (Suggested)

```
src/
├── controllers/
├── models/
├── routes/
├── services/
├── migrations/
├── middlewares/
└── utils/
```

---

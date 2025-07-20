# 📦 Product API Documentation

This API allows authenticated vendors to manage products in the system. All routes require the user to be authenticated (`req.user._id`).

---

## 🔐 Authentication

All routes require authentication via the `isAuthenticated` middleware.

---

## 🛠️ Base URL

```
/api/product
```

---

## 📘 Endpoints

### 📌 Create Product

**POST** `/create`

Creates a new product for the authenticated vendor.

#### Request Body (JSON)
```json
{
  "name": "Product Name",
  "price": 1000
}
```

#### Response
- `201 Created`: Product created successfully.
- `400 Bad Request`: Missing fields or product already exists.
- `401 Unauthorized`: User not authenticated.

---

### 📌 Get All Products

**GET** `/`

Fetches all products belonging to the authenticated vendor.

#### Response
- `200 OK`: List of products.
- `401 Unauthorized`: User not authenticated.

---

### 📌 Get Single Product

**GET** `/id`

#### Request Query (or body depending on usage)
```json
{
  "productId": "PRODUCT_OBJECT_ID"
}
```

#### Response
- `200 OK`: Single product details.
- `400 Bad Request`: Missing or invalid `productId`.
- `401 Unauthorized`: User not authenticated.
- `404 Not Found`: Product not found.

---

### 📌 Update Product

**PUT** `/id`

#### Request Body
```json
{
  "productId": "PRODUCT_OBJECT_ID",
  "name": "Updated Product Name",
  "price": 1200
}
```

#### Response
- `200 OK`: Product updated.
- `400 Bad Request`: Invalid product or fields.
- `401 Unauthorized`: Not authenticated.

---

### 📌 Delete Product

**DELETE** `/id`

#### Request Body
```json
{
  "productId": "PRODUCT_OBJECT_ID"
}
```

#### Response
- `200 OK`: Product deleted.
- `400 Bad Request`: Invalid or missing `productId`.
- `401 Unauthorized`: Not authenticated.

---

## ⚠️ Error Responses

All endpoints return standard JSON error objects:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Optional detailed error"
}
```

---

## 👤 Authorization

Ensure that each request includes a valid session or token for the vendor. Use middleware like:

```ts
req.user?._id
```

# 📦 Payment API Documentation

Base URL: `/api/payment`

All routes are **authenticated** using the `isAuthenticated` middleware (except `PUT /`, which should be protected for backend use only).

---

## 🔁 `POST /api/payment`

**Create a New Transaction**

Creates a new transaction for a specific product owned by the authenticated vendor.

### 🔐 Auth Required
Yes (Vendor)

### 🧾 Request Body
```json
{
  "amount": 1000,
  "productId": "64a7df15a9b...e7d",
  "description": "Payment for product X"
}
```

### ✅ Response
```json
{
  "success": true,
  "transaction": {
    "_id": "...",
    "amount": 1000,
    "vendorId": "...",
    "productId": "...",
    "description": "Payment for product X",
    "transactionId": "uuid",
    "transactionHash": "",
    ...
  },
  "message": "Transaction created successfully"
}
```

---

## 📄 `GET /api/payment`

**Get All Transactions for Vendor**

Returns a list of all transactions created by the authenticated vendor.

### 🔐 Auth Required
Yes (Vendor)

### ✅ Response
```json
{
  "success": true,
  "transactions": [
    {
      "_id": "...",
      "amount": 1000,
      "productId": {
        "name": "Product A",
        "price": 1000
      },
      ...
    },
    ...
  ]
}
```

---

## 📄 `GET /api/payment/:transactionId`

**Get a Single Transaction by ID**

Retrieves the details of a specific transaction belonging to the authenticated vendor.

### 🔐 Auth Required
Yes (Vendor)

### 🔁 Path Params
| Param           | Type   | Description                  |
|----------------|--------|------------------------------|
| `transactionId` | string | The unique transaction ID    |

### ✅ Response
```json
{
  "success": true,
  "transaction": {
    "_id": "...",
    "amount": 1000,
    ...
  }
}
```

---

## 🔄 `PUT /api/payment`

**Update Transaction (System Only)**

Updates a transaction's `status`, `transactionHash`, and `transactionTime`.

### 🔐 Protected For
Backend Systems (Use API Key or special middleware)

### 🧾 Request Body
```json
{
  "transactionId": "f91d...cc67",
  "status": "completed",
  "transactionHash": "0xabc123..."
}
```

### ✅ Response
```json
{
  "success": true,
  "transaction": {
    "_id": "...",
    "status": "completed",
    "transactionHash": "0xabc123...",
    "transactionTime": "2025-07-19T09:00:00.000Z"
  }
}
```

---

## ⚠️ Errors

All endpoints return error responses in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (optional)"
}
```

---

## 📦 Related Models

### `Transaction`
- `amount`: number
- `vendorId`: ObjectId
- `productId`: ObjectId
- `description`: string
- `transactionId`: string (UUID)
- `transactionHash`: string
- `transactionTime`: Date
- `status`: string

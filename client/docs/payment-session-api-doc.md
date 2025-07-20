
# Payment Session API Documentation

## Overview

This API allows vendors to create and manage payment sessions. Each session tracks the transaction process, status, and related metadata.

---

## Routes

### 1. Start Payment Session

**POST** `/api/payment-session`

Start a new payment session.

#### Request Body

```
{
  "transactionId": "string",
  "productId": "string",
  "expectedAmount": "string",
  "sessionId": "string",
  "memo": "string"
}
```

#### Response

- `200 OK`: Session created
- `400 Bad Request`: Missing required fields

---

### 2. Get Payment Status

**GET** `/api/payment-session/status/:sessionId`

Get the status of a payment session.

#### Response

- `200 OK`: Session data
- `404 Not Found`: Session not found

---

### 3. Update Payment Session

**PUT** `/api/payment-session/:sessionId`

Attach a customer email to a session before payment is completed.

#### Request Body

```
{
  "email": "string"
}
```

#### Response

- `200 OK`: Updated session
- `400 Bad Request`: Already has pending session
- `404 Not Found`: Session not found

---

### 4. Complete Payment Session

**POST** `/api/payment-session/complete`

Mark a session as completed and send a success email.

#### Request Body

```
{
  "sessionId": "string",
  "transactionHash": "string"
}
```

#### Response

- `200 OK`: Session completed
- `404 Not Found`: Session not found

---

### 5. Get Active Sessions

**GET** `/api/payment-session/active`

Get all active (pending) payment sessions for an authenticated vendor.

#### Headers

- Requires authentication

#### Response

- `200 OK`: List of sessions
- `404 Not Found`: No active sessions

---

### 6. Get All Sessions

**GET** `/api/payment-session/`

Get all payment sessions for an authenticated vendor.

#### Headers

- Requires authentication

#### Response

- `200 OK`: List of all sessions

---

## Middleware

### isAuthenticated

Protects vendor-specific routes such as:

- `/active`
- `/`

---

## Data Models

### PaymentSession

```ts
{
  sessionId: string,
  vendorId: ObjectId (ref: "Vendor"),
  productId: ObjectId (ref: "Product"),
  customerEmail?: string,
  expectedAmount: string,
  status: "pending" | "completed" | "failed" | "expired",
  txHash?: string,
  createdAt: Date,
  expiresAt: Date
}
```

---

## Notes

- Uses `paymentSuccessEmail` utility to notify customer upon success.
- Relies on `req.user._id` set by `isAuthenticated` middleware.
- Email update is optional and performed before transaction confirmation.


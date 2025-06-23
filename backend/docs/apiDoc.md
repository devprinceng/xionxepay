# Auth & Vendor API Documentation

This document provides detailed API specifications for frontend developers consuming the authentication and vendor profile endpoints.

---

## Base URL

```
https://<your-backend-domain>/api
```

---

## 🛡️ Auth Routes

### 1. Register Vendor

**`POST /auth/register`**

Registers a new vendor and sends an OTP to their email for verification.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "businessName": "John's Cafe",
  "category": "Restaurant",
  "metaAccountEmail": "meta@johndoe.com",
  "phone": "08012345678",
  "address": "123 Main St",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "zip": "100001"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<JWT Token>"
}
```

---

### 2. Login

**`POST /auth/login`**

Logs in a vendor with email and password.

#### Request Body

```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "<JWT Token>"
}
```

---

### 3. Logout

**`POST /auth/logout`**

Logs out the authenticated vendor.

#### Success Response

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

### 4. Verify Email

**`POST /auth/verify-email?otp=<6digit>&email=<user@example.com>`**

Verifies vendor email using OTP.

#### Success Response

```json
{
  "success": true,
  "message": "Account verified successfully"
}
```

---

### 5. Send Reset OTP

**`POST /auth/send-reset-otp`**

Sends a password reset OTP to the vendor's email.

#### Request Body

```json
{
  "email": "johndoe@example.com"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Otp sent to your email"
}
```

---

### 6. Reset Password

**`POST /auth/reset-password`**

Resets the vendor's password using a valid OTP.

#### Request Body

```json
{
  "email": "johndoe@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 👤 Vendor Profile Routes

> All endpoints below require authentication via middleware `isAuthenticated`.

### 7. Get Vendor Profile

**`GET /vendor/profile`**

Fetches basic vendor profile info.

#### Success Response

```json
{
  "success": true,
  "vendorProfile": {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "08012345678"
  }
}
```

---

### 8. Update Vendor Profile

**`PUT /vendor/profile`**

Updates vendor's name and phone number.

#### Request Body

```json
{
  "name": "John Updated",
  "phone": "08099999999"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "vendor": {
    "_id": "<vendorId>",
    "name": "John Updated",
    "phone": "08099999999",
    ...otherFields
  }
}
```

---

### 9. Get Business Profile

**`GET /vendor/business`**

Fetches business-related profile info.

#### Success Response

```json
{
  "success": true,
  "businessProfile": {
    "businessName": "John's Cafe",
    "businessDescription": "Best cafe in town",
    "category": "Restaurant",
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria",
    "zip": "100001",
    "logo": "https://res.cloudinary.com/...",
    "logoPublicId": "contestant_photos/john_logo"
  }
}
```

---

### 10. Update Business Profile

**`PUT /vendor/business`**

Updates vendor business details including Cloudinary logo upload.

#### Form Data Fields (multipart/form-data)

* `businessName`: string
* `businessDescription`: string
* `category`: string
* `address`: string
* `city`: string
* `state`: string
* `country`: string
* `zip`: string
* `logo`: image file

#### Success Response

```json
{
  "success": true,
  "message": "Vendor Business details updated successfully",
  "vendor": {
    "_id": "<vendorId>",
    ...updatedFields
  }
}
```

---

## Notes

* All protected routes require a valid JWT token (sent via HttpOnly cookie).
* Image uploads are handled via Cloudinary.
* All error responses follow this format:

```json
{
  "success": false,
  "message": "<error message>"
}
```

* Use proper form encoding (`multipart/form-data`) for logo uploads.

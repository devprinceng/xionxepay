# 🚀 Xionxepay — Scan-to-Pay Web3 POS System

**Xionxepay** is a smart, Web3-powered Point-of-Sale (POS) system that allows vendors to accept stablecoin payments through QR codes — no crypto wallets or blockchain knowledge required.

> Built for underserved markets, micro-businesses, and vendors who need **fast, gasless, and user-friendly** digital payment solutions.

---

## 🎯 Problem Statement

Traditional payment systems often exclude millions due to:
- Poor banking infrastructure
- Limited access to digital financial tools
- High transaction fees

Meanwhile, Web3 is powerful but **too complex for everyday users**.  
**Xionxepay bridges this gap** by offering a scan-to-pay POS system that combines Web3 power with Web2 simplicity.

---

## ✅ Judging Criteria Breakdown

| Criteria             | How Xionxepay Delivers |
|----------------------|-------------------------|
| 🧩 Abstraction Use   | Meta Accounts + Gasless Payments via Xion |
| 🧠 Usability         | Familiar UX: scan QR → enter email → pay |
| 📈 Business Potential| Designed for mobile-first, vendor-heavy markets |
| 💻 Technicality      | Dynamic QR, webhook, dashboard, real-time updates |
| 🌍 Impact            | Targets Africa, Asia, LATAM — real-world use cases |

---

## 💡 Key Features

- 🔐 **Meta Accounts (via Xion)** — Vendors & users don't need crypto wallets.
- 🧾 **Dynamic QR Generation** — Vendors generate a QR per transaction or product.
- 🪙 **Gasless Stablecoin Payments** — USDC/USDT over supported chains (via Xion).
- 📊 **Vendor Dashboard** — View payments, daily totals, transaction history.
- 📲 **Mobile-First UX** — Seamless payment experience with responsive design.
- 🛎️ **Webhook Handling** — Payment confirmation & receipt display in real-time.

---

## 👨‍💻 User Flow

### Customer (Buyer)
1. Scans a vendor’s QR code
2. Enters their email or phone
3. Receives an OTP and verifies
4. Xion creates a Meta Account in background
5. Pays with USDC/USDT via a gasless transaction
6. Sees instant confirmation screen

### Vendor
1. Logs into Xionxepay dashboard
2. Generates QR codes for items or totals
3. Shares QR with customer
4. Receives real-time payment updates
5. Views payment history and metrics

---

## 🛠️ Tech Stack

| Layer         | Stack                        |
|---------------|-------------------------------|
| Frontend      | React.js + Next.js (App Router) |
| Backend       | Node.js + Express + Xion SDK  |
| Blockchain    | Xion Protocol (Meta Accounts & Checkout) |
| Storage       | MongoDB / JSON (for demo)     |
| Dev & Testing | Postman, Jest, Render/Vercel  |

---

## 🔧 Architecture Overview


Customer → Scan QR
         → Xion Hosted Checkout
         → Enters Email → Meta Account Created
         → Pays (USDC/USDT)

Vendor → Logs in → Generates QR
       → Views Payments (via Webhook)
       → Dashboard → Transaction History

---

# TEAM MEMBERS

| Name       | Role                   |
| ---------- | ---------------------- |
| **Prince Ojoi** | PM / Backend Engineer  |
| **Emmanuel Onyenegbutu**  | UI / Frontend Engineer |
| **Isaac Cletus**  | Frontend / Blockchain  |
| **Omaraka Benjamin**   | Backend / Testing      |

---

# 🚀 Getting Started (for Devs)

## Clone project
git clone https://github.com/your-repo/xionxepay.git
cd xionxepay

# Install dependencies
npm install

# Set up .env with Xion API keys
touch .env
# Add:
# XION_API_KEY=your_key_here
# XION_ENV=testnet

# Run frontend
npm run dev

---

## 💬 Contact & Demo
Interested in trying the demo or learning more?

📩 Email: team@xionxepay.xyz
🐦 Twitter: @DevPrinceNG

Powered by 🧠 abstraction, ⚡ Xion Protocol, and ❤️ from a passionate team building for real-world change.
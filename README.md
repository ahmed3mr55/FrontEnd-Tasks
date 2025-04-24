# To-Do List System

> **A subscription-based task manager with end-to-end AES-256-GCM encryption and integrated App Money payments.**

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Express.js
- **Database:** MongoDB (Mongoose)
- **Payment Gateway:** App Money (in-house electronic payment platform)
- **Encryption:** AES-256-GCM for secure data storage

---

## 🚀 Overview

To-Do List System is a comprehensive web application that enables users to manage daily tasks under a flexible subscription model. Users can create, edit, and delete tasks through an intuitive interface, with monthly allowances based on their chosen plan. When the monthly limit is reached, users may purchase additional task bundles instantly via App Money.

All task titles and descriptions are encrypted in the database using AES-256-GCM, ensuring that your personal information remains fully protected even in the event of unauthorized access.

---

## 🔑 Features

### 1. Subscription Plans

- Monthly plans granting a predefined number of tasks.
- Edit limits per task according to plan tier.
- Automatic renewal options and upgrade pathways.

### 2. Task Management

- Create, edit, and delete tasks without page reloads (client‑side state management).
- Real‑time updates via Context API and React hooks.

### 3. Data Encryption

- AES-256-GCM encryption for all task content at rest.
- Decryption performed server‑side before sending data to the client.

### 4. Additional Bundles

- Purchase extra task bundles when your monthly quota is exhausted.
- Seamless checkout flow through App Money.

### 5. Payment Integration

- Custom App Money gateway built in-house with full support for Visa and other electronic methods.
- Secure token‑based authentication for payment endpoints.

### 6. User Profile

- Limited editing of profile details (email, password).
- View subscription status and purchase history.

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ahmed3mr55/FrontEnd-Tasks
   cd FrontEnd-Tasks
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**\
   Create a `.env.local` file with:

   ```env
   NEXT_PUBLIC_DOMAIN=https://your-domain.com
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
   CRYPTO_KEY=<your_32_byte_secret>
   APP_MONEY_API_KEY=<your_app_money_key>
   ```

4. **Run development servers**

   - Frontend (Next.js):
     ```bash
     npm run dev
     ```
   - Backend (Express):
     ```bash
     npm run server
     ```

5. **Access the app**\
   Open [https://front-end-tasks-peach.vercel.app](https://front-end-tasks-peach.vercel.app) in your browser.

---

## 📂 Project Structure

```
├── app/                  # Next.js frontend
│   ├── page.jsx
│   └── components/
├── server/               # Express.js backend
│   ├── routes/
│   └── models/
├── contexts/            # React Context for state management
├── utils/                # Encryption helpers
├── .env.local            # Environment variables
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for enhancements and bug fixes.

---

## 🔒 License

This project is licensed under the MIT License.


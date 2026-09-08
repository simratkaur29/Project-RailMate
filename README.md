# 🚆 RAILMATE — Smart Railway Booking & Travel Assistant

A modern, responsive railway travel platform built with React.js for searching trains, managing bookings, exploring railway stations, and connecting with the travel community.

## 📌 Project Objective

RAILMATE helps users search for trains, manage their travel information, explore railway stations, and interact with a railway-focused community — all within a clean, professional interface suitable for a college-level React.js project.

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **React.js** | Component-based UI, state management, routing |
| **JavaScript (ES6+)** | Logic, validation, interactivity |
| **HTML5** | Semantic page structure |
| **CSS3** | Styling, Flexbox, Grid, responsive design |
| **React Router** | Client-side page navigation |
| **localStorage** | Frontend data persistence (auth, bookings, posts) |
| **Vite** | Development server and build tool |

## ✨ Features

### Core Features
- **Train Search** — Search and filter trains by source, destination, and date
- **Train Booking** — Select a train, choose class, add passengers, confirm booking
- **My Bookings** — View all bookings, cancel confirmed bookings
- **User Authentication** — Registration and login with form validation (localStorage-based)
- **User Profile** — View/edit profile, change password

### Travel Tools
- **Passenger Management** — Add, edit, and delete passenger details
- **Station Guide** — Explore stations with facilities, platforms, transport info, and tips
- **Smart Travel Assistant** — Category-based travel advice and packing checklists
- **Railway Tips** — Categorized tips for before, during, and after your journey

### Community
- **Announcements** — Railway and travel-related notices
- **Travel Reviews** — Read and write train reviews with star ratings
- **Community Posts** — Share posts, like, and delete your own posts
- **Railway Tips Feed** — Quick tips from the community

## 📁 Folder Structure

```
RAILMATE/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── TrainCard.jsx
│   │   ├── StationCard.jsx
│   │   ├── ReviewCard.jsx
│   │   ├── AnnouncementCard.jsx
│   │   └── TipCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Trains.jsx
│   │   ├── Booking.jsx
│   │   ├── MyBookings.jsx
│   │   ├── StationGuide.jsx
│   │   ├── SmartAssistant.jsx
│   │   ├── Community.jsx
│   │   └── RailwayTips.jsx
│   ├── data/
│   │   ├── trains.js
│   │   ├── stations.js
│   │   ├── tips.js
│   │   └── reviews.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── navbar.css
│   │   ├── home.css
│   │   ├── trains.css
│   │   ├── community.css
│   │   └── profile.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v16 or above)
- npm

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd RAILMATE

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# Visit http://localhost:5173
```

## 👥 Team Member Responsibilities

| Member | Responsibility |
|--------|---------------|
| **Member 1** | Project setup, Navbar, Footer, Home page, global CSS, App.jsx, React Router |
| **Member 2** | Train Search, TrainCard, Booking page, My Bookings, train data |
| **Member 3** | Login, Register, Profile, Passenger Management, auth flow |
| **Member 4** | Station Guide, Smart Assistant, Community (Posts, Reviews, Announcements), Railway Tips |

## 📝 Notes

- This is a **frontend-only** demonstration project
- Authentication uses **localStorage** (not a real auth system)
- Train data is **static/sample** data (not connected to a real railway API)
- No real payment gateway is integrated
- Built as a **college-level React.js project** for learning purposes

## 📞 Helpline Numbers (Reference)

- Railway Helpline: **139**
- Railway Protection Force (RPF): **182**
- IRCTC Customer Care: **14646**

---

**Made with ❤️ by Team RAILMATE**

# 🎮 Game Price Tracker

**Game Price Tracker** is a full-stack MERN web application that helps users discover free and discounted PC games across multiple platforms. The application integrates with real-time gaming deal APIs to give users an easy way to track game prices, set alerts, and manage favorites — all from one place.

The platform uses three APIs:
- 🆓 **Epic Free Games API** – Displays the current weekly free games from the Epic Games Store
- 📈 **FreeToGame API** – Lists trending free-to-play PC games
- 💰 **CheapShark API** – Fetches live game deals and historical lowest prices from multiple digital stores (Steam, GreenManGaming, etc.)

Users can sign up and log in to save their favorite games and set up price alerts based on their budget. The authentication system uses **JWT tokens**, with middleware to protect private routes.

The frontend is built in **React.js** and deployed on **Vercel**, while the backend (Node.js + Express) is deployed on **Render**. Data is stored in **MongoDB Atlas**.

🚀 **Live Demo:** [Try it here](https://game-price-tracker-j4g9qvv4s-cf0615s-projects.vercel.app)

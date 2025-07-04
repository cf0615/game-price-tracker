# 🎮 Game Price Tracker

**Game Price Tracker** is a full-stack MERN web application that helps users discover free and discounted PC games across multiple platforms. The application integrates with real-time gaming deal APIs to give users an easy way to track game prices, set alerts, and manage favorites — all from one place.

The platform uses three APIs:
- 🆓 [**Epic Free Games API**](https://github.com/AuroPick/epic-free-games) – Displays the current weekly free games from the Epic Games Store 
- 📈 [**FreeToGame API**](https://www.freetogame.com/api-doc) – Lists trending free-to-play PC games 
- 💰 [**CheapShark API**](https://apidocs.cheapshark.com/) – Fetches live game deals and historical lowest prices from multiple digital stores (Steam, GreenManGaming, etc.) 

The frontend is built in **React.js** and deployed on **Vercel**, while the backend (Node.js + Express) is deployed on **Render**. Data is stored in **MongoDB Atlas**.

🚀 **Live Demo:** [Try it here](https://game-price-tracker-nxx02cea1-cf0615s-projects.vercel.app/)

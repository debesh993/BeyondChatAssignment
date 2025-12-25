# BeyondChat Assignment - AI Article Scraper & Updater

## 📌 Project Overview

This project is designed to **scrape, process, and enhance articles** from BeyondChats and display them via a responsive frontend. The main goal is to bridge content from original blogs to updated, enriched versions using AI.  

The system has **three phases**:

1. **Phase 1 (Laravel Backend)**  
   - Scrapes the 5 oldest articles from [BeyondChats Blogs](https://beyondchats.com/blogs/)  
   - Stores original articles in a **MySQL database**  
   - Provides **CRUD APIs** for original articles and updated articles

2. **Phase 2 (Node.js Script)**  
   - Fetches the **latest original article** from the backend  
   - Performs a **Google search** to find top 2 similar articles  
   - Scrapes content from these articles  
   - Uses **OpenRouter free LLM model (`xiaomi/mimo-v2-flash:free`)** to enhance the original article  
   - Publishes the **updated article** back to Laravel via API  

   > ⚠️ Note: OpenRouter is used instead of OpenAI API to **save costs** while still generating high-quality AI content.

3. **Phase 3 (ReactJS Frontend)**  
   - Fetches articles from the Laravel APIs  
   - Displays **original and updated articles** in a responsive grid  
   - Users can click on cards to view full details in a **modal**  
   - Updated articles show **side-by-side comparison** and **references**  
   - Fully responsive and styled using **Tailwind CSS**

---

## 🛠 Technology Stack

- **Backend:** Laravel 10, PHP 8, MySQL  
- **Scripting:** Node.js, Axios, Cheerio, OpenRouter, SerpApi  
- **Frontend:** ReactJS, Tailwind CSS  
- **Deployment:** Live frontend hosted on Vercel / Netlify (optional)

---

## 📂 Folder Structure

BeyondChatAssignment/
├─ laravel_backend/ # Laravel backend project with APIs
├─ node_backend/ # Node.js scripts for scraping & updating articles
├─ react_frontend/ # ReactJS frontend for displaying articles
└─ README.md # Project documentation


---

## ⚙️ Local Setup Instructions

### 1️⃣ Laravel Backend

```bash
cd laravel_backend
composer install
cp .env.example .env
# Update .env with your database credentials
php artisan key:generate
php artisan migrate
php artisan serve


Backend will run on http://127.0.0.1:8000

# APIs:

GET /api/original-articles

POST /api/original-articles

PUT /api/original-articles/{id}

DELETE /api/original-articles/{id}

GET /api/updated-articles

POST /api/updated-articles

PUT /api/updated-articles/{id}

DELETE /api/updated-articles/{id}

# Node.js Script
cd node_backend
npm install
node scrape_articles.js      # Phase 1 scraper
node update_latest_article.js       # Phase 2 AI updater

# ReactJS Frontend
cd react_frontend
npm install
npm start

# Architecture / Data Flow Diagram
flowchart LR
    A[BeyondChats Blogs] --> B[Node.js Scraper]
    B --> C[Laravel Backend - Original Articles]
    C --> D[Node.js AI Script]
    D --> E[Laravel Backend - Updated Articles]
    C --> F[ReactJS Frontend]
    E --> F


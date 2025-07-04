# 📝 Feedback Collector

A simple full-stack web application that allows users to submit and manage product/service feedback. It includes sentiment analysis, feedback filtering, statistics, and a clean UI.

---

## ✅ Features Implemented

### 🔹 1. **Feedback Submission**
- Users can submit feedback with:
  - Name (optional; defaults to *Anonymous*)
  - Product/Service Name
  - Feedback Text
  - Category: Feature Request, Bug, or General
- Submitted via a `POST /feedback` API.

---

### 🔹 2. **View Feedback List**
- Displays all feedback in list view with:
  - Name, Product, Category, Sentiment
- Auto-refresh on new submission.

---

### 🔹 3. **Keyword-Based Sentiment Analysis**
- Automatically detects sentiment using keyword matching.
- Labels feedback as:
  - ✅ Positive
  - ❌ Negative
  - ⚪ Neutral
- Highlights negative feedback for urgent attention.

---

### 🔹 4. **Search and Filter Options**
- 🔍 **Search**: Real-time keyword search on feedback.
- 🎯 **Filter by Category**
- 😊 **Filter by Sentiment**

---

### 🔹 5. **Feedback Statistics**
- Displays:
  - Total feedback count
  - Feedback by category
  - Feedback by sentiment
- Data served by `GET /stats` API.

---

### 🔹 6. **REST API Endpoints (FastAPI)**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/feedback` | Submit new feedback |
| GET | `/feedback` | Retrieve all feedback |
| GET | `/stats` | Retrieve statistics |

---

### 🔹 7. **PostgreSQL Integration**
- Switched from SQLite to PostgreSQL for production.
- Uses `psycopg2-binary` with SQLAlchemy ORM.
- Hosted on Render.

---

### 🔹 8. **Deployment**
- 🌐 **Frontend**: [Netlify](https://feedback-collector-akileshr.netlify.app/)
- ⚙️ **Backend**: [Render]( https://feedbackcollectorproject.onrender.com)
- 🗄️ **Database**: PostgreSQL on Render

---

### 🔹 9. **Backend Keep-Alive Pinger**
- Uses `requests.get()` to ping backend every 5 minutes.
- Prevents Render backend from sleeping.

---

### 🔹 10. **Postman API Testing**
- Tested all endpoints:
  - `POST /feedback`
  - `GET /feedback`
  - `GET /stats`
- Request/response bodies verified during development.

---

## 🔧 Setup Instructions

### 📁 Clone the Repository
```bash
git clone [https://github.com/akileshr07/FeedbackCollectorproject.git](https://github.com/akileshr07/FeedbackCollectorproject.git)
cd FeedbackCollectorproject

---

## 💪 Tech Stack

| Layer    | Technology Used             |
| -------- | --------------------------- |
| Frontend | ReactJS, TailwindCSS        |
| Backend  | FastAPI    |
| Database | PostgreSQL)      |
| Others   | Axios (for API calls), CORS |

---

## 🔧 Installation & Setup

### 📁 Clone the repository

```bash
git clone https://github.com/your-username/feedback-collector.git
cd feedback-collector
```

---

### 🔹 Backend Setup (FastAPI)

1. Navigate to the backend folder:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the server:

```bash
uvicorn main:app --reload
```

---

### 🔹 Frontend Setup (React)

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm start
```

---

## 🗃️ Folder Structure

```bash
feedback-collector/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── ...
│
└── README.md
```

---

## 📊 API Endpoints (FastAPI Example)

| Method | Endpoint    | Description             |
| ------ | ----------- | ----------------------- |
| POST   | `/feedback` | Submit new feedback     |
| GET    | `/feedback` | Get all feedback        |
| GET    | `/stats`    | Get feedback statistics |

---

## 📈 Example Statistics Output

```json
{
  "total_feedback": 18,
  "categories": {
    "Bug": 5,
    "Feature Request": 7,
    "General": 6
  }
}
```

## 🚀 Future Improvements

* User authentication
* Pagination or infinite scroll for feedback list
* Email notification to admins
* Sentiment analysis of feedback (AI-based)

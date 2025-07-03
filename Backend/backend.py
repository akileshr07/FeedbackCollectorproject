from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
import threading
import time
import requests
import os

# --- FastAPI Setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict to frontend domain(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Setup ---
# --- Database Setup ---
# Old SQLite version
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'feedback.db')}"
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# ✅ NEW: PostgreSQL Setup for Render
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

Base = declarative_base()

class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    product = Column(String)
    feedback = Column(String)
    category = Column(String)
    sentiment = Column(String)

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Sentiment Analysis ---
positive_keywords = [
    "good", "great", "love", "excellent", "awesome", "nice", "well done", "fantastic", "superb",
    "amazing", "improved", "satisfied", "helpful", "smooth", "fast", "positive", "brilliant",
    "wonderful", "perfect", "liked", "appreciate", "convenient", "happy", "clean"
]

negative_keywords = [
    "bad", "poor", "hate", "bug", "issue", "problem", "slow", "difficult", "not working",
    "error", "delay", "crash", "negative", "worst", "disappointed", "fail", "unsatisfied",
    "confusing", "messy", "unusable", "lag", "unhelpful", "annoying", "broken"
]


def analyze_sentiment(text: str) -> str:
    text = text.lower()
    if any(word in text for word in negative_keywords):
        return "negative"
    elif any(word in text for word in positive_keywords):
        return "positive"
    return "neutral"

# --- Pydantic Schemas ---
class FeedbackSchema(BaseModel):
    id: int
    name: str
    product: str
    feedback: str
    category: str
    sentiment: str

    class Config:
        orm_mode = True

class FeedbackCreate(BaseModel):
    name: str = "Anonymous"
    product: str
    feedback: str
    category: str

# --- Routes ---
@app.on_event("startup")
def startup_event():
    print("📦 Connected to PostgreSQL database")
    

@app.api_route("/", methods=["GET", "HEAD"])
def root(request: Request):
    return {"message": "Feedback Collector API is live"}

@app.post("/feedback")
def add_feedback(item: FeedbackCreate):
    db = SessionLocal()
    sentiment = analyze_sentiment(item.feedback)
    fb = Feedback(
        name=item.name.strip() or "Anonymous",
        product=item.product,
        feedback=item.feedback,
        category=item.category,
        sentiment=sentiment,
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    db.close()
    return {"message": "Feedback submitted", "sentiment": sentiment}

@app.get("/feedback", response_model=List[FeedbackSchema])
def get_feedback():
    db = SessionLocal()
    feedbacks = db.query(Feedback).all()
    db.close()
    return feedbacks

@app.get("/stats")
def get_stats():
    db = SessionLocal()
    total = db.query(Feedback).count()
    by_category = {}
    by_sentiment = {}
    for fb in db.query(Feedback).all():
        by_category[fb.category] = by_category.get(fb.category, 0) + 1
        by_sentiment[fb.sentiment] = by_sentiment.get(fb.sentiment, 0) + 1
    db.close()
    return {
        "total": total,
        "by_category": by_category,
        "by_sentiment": by_sentiment,
    }

# --- Keep-Alive Heartbeat ---
RENDER_URL = os.getenv("RENDER_URL", "https://feedbackcollectorproject.onrender.com")

def keep_alive():
    while True:
        try:
            print("🔁 Pinging self to keep backend alive...")
            res = requests.get(RENDER_URL)
            print("✅ Ping response:", res.status_code)
        except Exception as e:
            print("❌ Heartbeat error:", e)
        time.sleep(300)  # every 5 minutes

# --- Uvicorn Entry Point ---
if __name__ == "__main__":
    threading.Thread(target=keep_alive, daemon=True).start()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)

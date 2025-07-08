from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
import threading
import time
import requests
import os
import re  # ✅ FIXED: required for sentiment analysis

# --- FastAPI Setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://feedback-collector-akileshr.netlify.app"],  # ✅ Restrict to Netlify frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Setup ---
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
positive_phrases = {"well done", "very helpful", "super easy", "great job", "user friendly"}
positive_words = {
    "good", "great", "love", "excellent", "awesome", "nice", "fantastic", "superb",
    "amazing", "improved", "satisfied", "helpful", "smooth", "fast", "positive", "brilliant",
    "wonderful", "perfect", "liked", "appreciate", "convenient", "happy", "clean"
}

negative_phrases = {"not working", "very slow", "worst experience", "crashes often", "not helpful"}
negative_words = {
    "bad", "poor", "hate", "bug", "issue", "problem", "slow", "difficult", "error", "delay",
    "crash", "negative", "worst", "disappointed", "fail", "unsatisfied", "confusing", "messy",
    "unusable", "lag", "unhelpful", "annoying", "broken"
}

def analyze_sentiment(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)  # ✅ Clean punctuation

    for phrase in negative_phrases:
        if phrase in text:
            return "negative"
    for phrase in positive_phrases:
        if phrase in text:
            return "positive"

    words = set(text.split())
    if words & negative_words:
        return "negative"
    if words & positive_words:
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
        orm_mode = True  # ✅ Still works in Pydantic v1 or upgrade to 'from_attributes = True' for v2

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
    print("📩 Received feedback:", item.dict())

    db = SessionLocal()
    try:
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
        print("✅ Stored feedback with sentiment:", sentiment)
        return {"message": "Feedback submitted", "sentiment": sentiment}
    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"error": "Internal server error"}
    finally:
        db.close()

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

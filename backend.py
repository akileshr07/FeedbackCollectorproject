from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

# --- Database Setup ---
DATABASE_URL = "sqlite:///./feedback.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
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

# --- FastAPI Setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend domain(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Sentiment Analysis ---
positive_keywords = ["good", "great", "love", "excellent", "awesome"]
negative_keywords = ["bad", "poor", "hate", "bug", "issue"]

def analyze_sentiment(text: str) -> str:
    text = text.lower()
    if any(word in text for word in negative_keywords):
        return "negative"
    elif any(word in text for word in positive_keywords):
        return "positive"
    return "neutral"

# --- Pydantic Schema ---
class FeedbackSchema(BaseModel):
    name: str = "Anonymous"
    product: str
    feedback: str
    category: str

# --- Routes ---
@app.post("/feedback")
def add_feedback(item: FeedbackSchema):
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
    data = db.query(Feedback).all()
    db.close()
    return data

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

# --- Uvicorn Entry Point ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)

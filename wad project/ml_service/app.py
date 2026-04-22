from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI()

class RecommendRequest(BaseModel):
    category: str
    items: list

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"message": "ML Server Running 🚀"}

@app.post("/api/ml/recommend")
def recommend_opportunities(req: RecommendRequest):
    if not req.items:
        return {"recommendations": []}
    
    # We use TF-IDF to sort the items based on their relevance to the category
    vectorizer = TfidfVectorizer(stop_words='english')
    # Combine title, company, description to form the corpus
    corpus = [f"{item.get('title', '')} {item.get('company', '')} {item.get('description', '')}" for item in req.items]
    corpus.append(req.category) # Add the target category as the last document
    
    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
        # Compare all items to the target category
        cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()
        
        # Add match scores
        for i, score in enumerate(cosine_sim):
            # Scale score realistically (e.g., base 75 + up to 24% match based on relevance)
            req.items[i]['matchScore'] = f"{int(75 + (score * 24))}%"
            req.items[i]['rawScore'] = score
            
        # Sort by raw score descending
        sorted_items = sorted(req.items, key=lambda x: x.get('rawScore', 0), reverse=True)
        return {"recommendations": sorted_items}
    except Exception as e:
        # Fallback if vocabulary is empty
        return {"recomme//'/+ndations": req.items}

@app.post("/api/ml/chat")
def chat(req: ChatRequest):
    msg = req.message.lower()
    
    # Simple rule-based NLP intent classification
    if "hackathon" in msg or "unstop" in msg:
        reply = "I found some great Hackathons for you! Check out the 'Hackathons' tab on the sidebar like the Global AI Hackathon."
    elif "internship" in msg:
        reply = "Looking for an internship? We have listings from Google, Netflix, and more in the 'Internships' section."
    elif "apply" in msg:
        reply = "To apply, simply explore an opportunity on the dashboard and click the 'Apply' button! It's that easy."
    elif "scholarship" in msg:
        reply = "Scholarships are a great way to fund your education. Check out the 'Scholarships' tab!"
    elif "hi" in msg or "hello" in msg:
        reply = "Hello! I am your AI assistant. I can help you find Hackathons, Internships, and more. What are you looking for?"
    else:
        reply = "I'm still learning! Try asking me about 'hackathons', 'internships', or how to 'apply'."
        
    return {"reply": reply}

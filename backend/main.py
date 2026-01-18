
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn

app = FastAPI(title="UIDAI Decision Intelligence API")

# Security and CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "operational", "version": "1.0.0"}

@app.post("/api/auth/otp/send")
async def send_otp(email: str):
    # Mocking OTP send
    return {"message": "OTP sent to registered email", "expiry": "5 minutes"}

@app.post("/api/auth/login")
async def login(email: str, otp: str):
    if otp == "123456":
        return {
            "token": "mock_jwt_token_uidai",
            "user": {"name": "Pankaj Kumar", "role": "ADMIN", "email": email}
        }
    raise HTTPException(status_code=401, detail="Invalid OTP")

@app.get("/api/signals")
async def get_signals():
    # In a real app, this queries the PostgreSQL db for calculated anomalies
    return [
        {
            "id": "s1",
            "type": "RISK",
            "title": "Low Biometric Update Velocity",
            "district": "Bellary, Karnataka",
            "severity": "HIGH",
            "dataSummary": "Biometric update rates fell by 22% in the 15-18 age bracket...",
            "whyItMatters": "Crucial for scholarship disbursements.",
            "recommendedAction": "Coordinate with State Education Dept.",
            "metricValue": 22,
            "trend": "DOWN"
        }
    ]

@app.post("/api/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")
    # Simulation of CSV cleaning, hashing PII, and storing in DB
    return {"status": "success", "filename": file.filename, "records_processed": 12450}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

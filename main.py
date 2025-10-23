from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np

app = FastAPI(title="Heart Disease Prediction API")

# Load the model
model = joblib.load("heart_model.pkl")


# Define input schema
class HeartData(BaseModel):
    age: int = Field(..., description="Age in years", example=63)
    sex: int = Field(..., description="Sex (0=Female, 1=Male)", example=1)
    cp: int = Field(..., description="Chest pain type (0-3)", example=3)
    trestbps: int = Field(..., description="Resting blood pressure", example=145)
    chol: int = Field(..., description="Serum cholesterol in mg/dl", example=233)
    fbs: int = Field(..., description="Fasting blood sugar > 120 mg/dl (0=No, 1=Yes)", example=1)
    restecg: int = Field(..., description="Resting electrocardiographic results (0-2)", example=0)
    thalach: int = Field(..., description="Maximum heart rate achieved", example=150)
    exang: int = Field(..., description="Exercise induced angina (0=No, 1=Yes)", example=0)
    oldpeak: float = Field(..., description="ST depression induced by exercise", example=2.3)
    slope: int = Field(..., description="Slope of the peak exercise ST segment (0-2)", example=0)
    ca: int = Field(..., description="Number of major vessels colored by flourosopy (0-3)", example=0)
    thal: int = Field(..., description="Thalassemia (1-3)", example=1)


@app.post("/predict")
def predict_heart_disease(data: HeartData):
    try:
        input_data = np.array([[data.age, data.sex, data.cp, data.trestbps, data.chol,
                                data.fbs, data.restecg, data.thalach, data.exang,
                                data.oldpeak, data.slope, data.ca, data.thal]])

        prediction = model.predict(input_data)[0]
        result = "Heart Disease Detected" if prediction == 1 else "No Heart Disease"
        return {"prediction": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/")
def root():
    return {"message": "Heart Disease Prediction API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

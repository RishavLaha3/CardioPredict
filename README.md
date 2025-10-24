# CardioPredict
CardioPredict is a machine learning–powered FastAPI application that predicts the likelihood of heart disease based on patient health parameters such as age, cholesterol level, blood pressure, and more.

## Features

* ML model trained on the UCI Heart Disease dataset
* FastAPI endpoint for real-time predictions
* Returns whether heart disease is detected or not

## Tech Stack

* Python
* FastAPI
* Scikit-learn
* Joblib
* Pandas

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RishavLaha3/CardioPredict.git
cd CardioPredict
```

### 2. Create and activate a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install fastapi uvicorn pydantic scikit-learn pandas numpy
```

### 4. Run the API

```bash
uvicorn main:app --reload
```

## Example Request

```json
{
  "age": 56,
  "sex": 1,
  "cp": 1,
  "trestbps": 120,
  "chol": 236,
  "fbs": 0,
  "restecg": 1,
  "thalach": 178,
  "exang": 0,
  "oldpeak": 0.8,
  "ca": 0,
  "thal": 2
}
```

## Example Response

```json
{
  "prediction": "Heart Disease Detected"
}
```

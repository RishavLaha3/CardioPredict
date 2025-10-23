const API_BASE_URL = 'http://localhost:8000';

const form = document.getElementById('heartForm');
const resultContainer = document.getElementById('result');
const errorContainer = document.getElementById('error');
const predictionText = document.getElementById('prediction-text');
const errorText = document.getElementById('error-text');
const predictBtn = document.querySelector('.predict-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    setLoadingState(true);
    
    try {
        const formData = getFormData();
        
        if (!validateFormData(formData)) {
            throw new Error('Please fill in all required fields with valid values.');
        }
        
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        showResult(result.prediction);
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message);
    } finally {
        setLoadingState(false);
    }
});

function getFormData() {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'oldpeak') {
            data[key] = parseFloat(value);
        } else {
            data[key] = parseInt(value);
        }
    }
    
    return data;
}

function validateFormData(data) {
    const requiredFields = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
        'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ];
    
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null || data[field] === '') {
            return false;
        }
    }
    
    if (data.age < 1 || data.age > 120) return false;
    if (data.trestbps < 80 || data.trestbps > 250) return false;
    if (data.chol < 100 || data.chol > 600) return false;
    if (data.thalach < 60 || data.thalach > 220) return false;
    if (data.oldpeak < 0 || data.oldpeak > 6.2) return false;
    
    return true;
}

function showResult(prediction) {
    predictionText.textContent = prediction;
    
    predictionText.className = 'prediction-text';
    if (prediction.includes('Heart Disease Detected')) {
        predictionText.classList.add('positive');
    } else {
        predictionText.classList.add('negative');
    }
    
    resultContainer.style.display = 'flex';
    hideError();
}

function showError(message) {
    errorText.textContent = message;
    errorContainer.style.display = 'flex';
    hideResult();
}

function hideResult() {
    resultContainer.style.display = 'none';
}

function hideError() {
    errorContainer.style.display = 'none';
}

function clearForm() {
    form.reset();
    hideResult();
    hideError();
}

function setLoadingState(loading) {
    if (loading) {
        predictBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
    } else {
        predictBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

resultContainer.addEventListener('click', (e) => {
    if (e.target === resultContainer) {
        hideResult();
    }
});

errorContainer.addEventListener('click', (e) => {
    if (e.target === errorContainer) {
        hideError();
    }
});

document.addEventListener('DOMContentLoaded', () => {

    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
    });
});

function validateField(field) {
    const value = field.value;
    const fieldName = field.name;
    
    field.style.borderColor = '';
    
    if (!value) {
        field.style.borderColor = '#dc3545';
        return false;
    }
    
    switch (fieldName) {
        case 'age':
            if (value < 1 || value > 120) {
                field.style.borderColor = '#dc3545';
                return false;
            }
            break;
        case 'trestbps':
            if (value < 80 || value > 250) {
                field.style.borderColor = '#dc3545';
                return false;
            }
            break;
        case 'chol':
            if (value < 100 || value > 600) {
                field.style.borderColor = '#dc3545';
                return false;
            }
            break;
        case 'thalach':
            if (value < 60 || value > 220) {
                field.style.borderColor = '#dc3545';
                return false;
            }
            break;
        case 'oldpeak':
            if (value < 0 || value > 6.2) {
                field.style.borderColor = '#dc3545';
                return false;
            }
            break;
    }
    
    field.style.borderColor = '#28a745';
    return true;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideResult();
        hideError();
    }
    
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        if (!resultContainer.style.display || resultContainer.style.display === 'none') {
            form.dispatchEvent(new Event('submit'));
        }
    }
});

function fillSampleData() {
    const sampleData = {
        age: 63,
        sex: 1,
        cp: 3,
        trestbps: 145,
        chol: 233,
        fbs: 1,
        restecg: 0,
        thalach: 150,
        exang: 0,
        oldpeak: 2.3,
        slope: 0,
        ca: 0,
        thal: 1
    };
    
    Object.keys(sampleData).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = sampleData[key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const sampleBtn = document.createElement('button');
    sampleBtn.type = 'button';
    sampleBtn.className = 'clear-btn';
    sampleBtn.textContent = 'Fill Sample Data';
    sampleBtn.onclick = fillSampleData;
    
    const formActions = document.querySelector('.form-actions');
    formActions.appendChild(sampleBtn);
});

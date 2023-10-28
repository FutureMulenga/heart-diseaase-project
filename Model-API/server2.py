from fastapi import FastAPI
import joblib
from pydantic import BaseModel
import uvicorn
import warnings
from fastapi import FastAPI, Header, HTTPException


# Suppress the warning
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

app = FastAPI()


api_key = "test123"

# Create a custom dependency to validate the API key
def verify_api_key(api_key: str = Header(None)):
    if api_key != api_key:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    
    


class Features(BaseModel):
    age: int
    sex: int
    chest_pain_type_non_anginal: int
    chest_pain_type_atypical_anginal: int
    chest_pain_type_typical_anginal: int
    resting_blood_pressure: int
    cholesterol: int
    kidney_failure: int
    resting_ecg_normal: int
    resting_ecg_lvh: int 
    max_heart_rate: int 
    exercise_anginal: int 
    st_depression: float
    st_slope_flat: int
    st_slope_upslopping: int 

# Load the model and check if the model is not loaded 
try:
    loaded_model = joblib.load('Model-API/heart_disease_model(3)')
except EOFError as e:
    print("Error loading the model:", e)
    
# Endpoint that receives the inputs from the user interface 
@app.post('/runprediction')
def predict(inputs: Features):
    try:
        input_dict = inputs.dict()

        age = input_dict['age']
        sex = input_dict['sex']
        chest_pain_type_non_anginal = input_dict['chest_pain_type_non_anginal']
        chest_pain_type_atypical_anginal = input_dict['chest_pain_type_atypical_anginal']
        chest_pain_type_typical_anginal = input_dict['chest_pain_type_typical_anginal']
        resting_blood_pressure = input_dict['resting_blood_pressure']
        cholesterol = input_dict['cholesterol']
        kidney_failure = input_dict['kidney_failure']
        resting_ecg_normal = input_dict['resting_ecg_normal']
        resting_ecg_lvh = input_dict['resting_ecg_lvh']
        max_heart_rate = input_dict['max_heart_rate']
        exercise_anginal = input_dict['exercise_anginal']
        st_depression = input_dict['st_depression']
        st_slope_flat = input_dict['st_slope_flat']
        st_slope_upslopping = input_dict['st_slope_upslopping']

        # Input list for parameters to be fed into the model 
        input_list = [
            age, resting_blood_pressure, cholesterol, kidney_failure, max_heart_rate, exercise_anginal, st_depression,
            sex, chest_pain_type_atypical_anginal, chest_pain_type_non_anginal, chest_pain_type_typical_anginal,
            resting_ecg_normal, resting_ecg_lvh, st_slope_flat, st_slope_upslopping
        ]

        # Input the parameters into the model to be predicted and calculate the likelihood of having or not having a heart problem 
        predicted_output = loaded_model.predict([input_list])
        predicted_probabilities = loaded_model.predict_proba([input_list])
        confidence_level = max(predicted_probabilities[0]) * 100  # Convert to percentage

        result = ''
        
        print(confidence_level)
        
        return {'prediction': round(confidence_level, 2)}

    except Exception as e:
        return {'error': 'An error occurred'}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)

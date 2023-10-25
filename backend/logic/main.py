#Importing Libraries
import uvicorn
from fastapi import FastAPI
import numpy as np
import joblib
import pandas as pd
from core import Survey
from core import Medical
from fastapi.encoders import jsonable_encoder



app = FastAPI()
model = joblib.load('expense_pipe.joblib')
model_2 = joblib.load('medical_expense_pipe.joblib')

@app.get('/')
def index():
    return {'message': 'Hello, World'}

@app.post('/predict')
def buget_monthly_predict(data:Survey):
    data = data.dict()
    gender = data['Gender']
    age = data['Age']
    study_year = data['Study_year']
    living = data['Living']
    scholarship = data['Scholarship']
    part_time_job = data['Part_time_job']
    transporting = data['Transporting']
    smoking = data['Smoking']
    drinks = data['Drinks']
    games_hobbies = data['Games_Hobbies']
    cosmetics_care = data['Cosmetics_Self_Care']
    monthly_subs = data['Monthly_Subscription']
    
    # input_df = pd.DataFrame(jsonable_encoder(data))
    print(data)
    
    input_pd = pd.DataFrame([[gender, age, study_year, living, scholarship, part_time_job, transporting, smoking, drinks, games_hobbies, cosmetics_care, monthly_subs]], columns=['Gender', 'Age', 'Study_year', 'Living', 'Scholarship', 'Part_time_job',
       'Transporting', 'Smoking', 'Drinks', 'Games_Hobbies',
       'Cosmetics_Self_Care', 'Monthly_Subscription'])

    prediction = model.predict(input_pd)

    x = prediction[0]
    x = x*20

    return {
        'prediction' : int(x)
        }
    
@app.post('/predict_medical')
def medical_monthly_predict(data:Medical):
    data = data.dict()
    age = data['age']
    sex = data['sex']
    bmi = data['bmi']
    child = data['children']
    smoker = data['smoker']
    region = data['region']
    
    # input_df = pd.DataFrame(jsonable_encoder(data))

    
    input_pd_1 = pd.DataFrame([[age, sex, bmi, child, smoker, region]], columns=['age', 'sex', 'bmi', 'children', 'smoker', 'region'])

    prediction = model_2.predict(input_pd_1)

    x = prediction[0]

    return {
        'prediction' : int(x)
        }


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)



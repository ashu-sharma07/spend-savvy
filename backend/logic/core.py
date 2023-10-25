from pydantic import BaseModel


class Survey(BaseModel):
    Gender : str
    Age : int
    Study_year : int
    Living : str
    Scholarship: str
    Part_time_job : str
    Transporting : str
    Smoking : str
    Drinks : str
    Games_Hobbies : str
    Cosmetics_Self_Care : str
    Monthly_Subscription : str


class Medical(BaseModel):
    age : int
    sex : str
    bmi : float
    children: int
    smoker : str
    region : str
import pickle
import numpy as np
from statistics import mode
import json
import sys

import warnings
warnings.filterwarnings("ignore", category=UserWarning, message="X does not have valid feature names*")

def load_model(filename):
    with open(filename, 'rb') as file:
        models_data = pickle.load(file)
    return models_data

def predict_disease(symptoms, models_data):
    symptom_index = models_data["symptom_index"]
    predictions_classes = models_data["predictions_classes"]
    final_svm_model = models_data["final_svm_model"]
    final_nb_model = models_data["final_nb_model"]
    final_rf_model = models_data["final_rf_model"]

    symptoms = symptoms.split(",")
    input_data = [0] * len(symptom_index)
    for symptom in symptoms:
        index = symptom_index.get(symptom.capitalize())
        if index is not None:
            input_data[index] = 1

    input_data = np.array(input_data).reshape(1, -1)
    rf_prediction = predictions_classes[final_rf_model.predict(input_data)[0]]
    nb_prediction = predictions_classes[final_nb_model.predict(input_data)[0]]
    svm_prediction = predictions_classes[final_svm_model.predict(input_data)[0]]
    final_prediction = mode([rf_prediction, nb_prediction, svm_prediction])

    result = {
        "rf_model_prediction": rf_prediction,
        "naive_bayes_prediction": nb_prediction,
        "svm_model_prediction": svm_prediction,
        "final_prediction": final_prediction
    }

    print(json.dumps(result))

if __name__ == "__main__":
    models_data = load_model('one.pkl')
    symptoms = sys.argv[1] if len(sys.argv) > 1 else ""
    predict_disease(symptoms, models_data)

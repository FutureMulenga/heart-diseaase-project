//const fetch = require("fetch")
// Import required module
const fetch = require("cross-fetch");

const express = require("express");

const { ensureAuthenticated } = require("../config/auth");

const router = express.Router();

// Route for GetPrediction page
router.get("/", (req, res) => {
  res.render("pages/GetPrediction", { input: "getPrediction", response: null });
});

router.post("/getprediction", ensureAuthenticated,(req, res) => {
  console.log(req.body);
  // distructure request body
  const {
    age,
    sex,
    chest_pain_type_non_anginal,
    chest_pain_type_atypical_anginal,
    chest_pain_type_typical_anginal,
    resting_blood_pressure,
    cholesterol,
    kidney_failure,
    resting_ecg_normal,
    resting_ecg_lvh,
    max_heart_rate ,
    exercise_anginal,
    st_depression,
    st_slope_flat,
    st_slope_upslopping,
  } = req.body;

  const data = {
    age,
    sex,
    chest_pain_type_non_anginal,
    chest_pain_type_atypical_anginal,
    chest_pain_type_typical_anginal,
    resting_blood_pressure,
    cholesterol,
    kidney_failure,
    resting_ecg_normal,
    resting_ecg_lvh,
    max_heart_rate ,
    exercise_anginal,
    st_depression,
    st_slope_flat,
    st_slope_upslopping,
  };

  // const data = req.body; // If the structure of req.body matches the data object's properties

  fetch("http://0.0.0.0:8000/runprediction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

    .then((response) => response.json())
    .then((data) => {

      res.render("pages/GetPrediction", {
        input: "getPrediction",
        response: generateMedicalResponse(data.prediction),
      
      
      });
      console.log("Response:", data);
    })
    .catch((error) => {
      res.render("pages/GetPrediction", {
        input: "getPrediction",
        response: error.toString(),
      });
      console.error("Error:", error);
    });
});

// Route for Terms and Conditions page
router.get("/termsAndConditions", (req, res) => {
  res.render("pages/TermsPage", { input: "termsAndConditions" });
});

// Route for Patient Records page
router.get("/patientRecords", (req, res) => {
  res.render("pages/PatientRecords", { input: "patientRecords" });
});

// Route for Help and About page
router.get("/help", (req, res) => {
  res.render("pages/HelpPage", { input: "helpAndAbout" });
});


function generateMedicalResponse(confidencePercentage) {
  // Determine the risk level based on confidencePercentage
  let riskLevel = '';
  if (confidencePercentage >= 85) {
    riskLevel = 'Critical';
  } else if (confidencePercentage >= 80) {
    riskLevel = 'Dangerous';
  } else if (confidencePercentage >= 70) {
    riskLevel = 'High';
  } else if (confidencePercentage >= 50) {
    riskLevel = 'Normal';
  } else {
    riskLevel = 'Low';
  }

  // Define the HTML content with improved medical styling and inline CSS
  const medicalResponseHTML = `
    <div class="medical-response" style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
      <h2 style="color: #333;">Heart Disease Prediction Result</h2>
      <p style="font-size: 18px; color: #555;">Probability of Coronary Artery Disease: ${confidencePercentage}%</p>
      <p style="font-size: 20px; font-weight: bold; color: ${getRiskColor(riskLevel)};">Risk Level: ${riskLevel}</p>
      ${
        riskLevel === 'Critical'
          ? `<p style="font-size: 16px; color: red;">The risk is very high, and immediate medical attention is required.</p>`
          : riskLevel === 'Dangerous'
          ? `<p style="font-size: 16px; color: #e74c3c;">The risk is significantly elevated, and you should seek medical advice.</p>`
          : riskLevel === 'High'
          ? `<p style="font-size: 16px; color: #f39c12;">The risk is quiete high, and you should be cautious. Consider consulting a healthcare professional.</p>`
          : `<p style="font-size: 16px; color: #27ae60;">The risk of coronary heart disease is relatively low. Continue with a healthy lifestyle and regular check-ups.</p>`
      }
      ${
        riskLevel === 'Critical'
          ? `<p style="font-size: 16px; font-weight: bold;">Precautions:</p>
             <ul style="font-size: 14px; color: red;">
               <li>Seek medical help immediately.</li>
               <li>Rest and avoid strenuous activities.</li>
               <li>Follow all instructions from healthcare professionals.</li>
             </ul>`
          : riskLevel === 'Dangerous'
          ? `<p style="font-size: 16px; font-weight: bold;">Precautions:</p>
             <ul style="font-size: 14px; color: #e74c3c;">
               <li>Consult a healthcare professional for further evaluation.</li>
               <li>Follow your doctor's recommendations for monitoring and prevention.</li>
             </ul>`
          : ''
      }
      <p style="font-size: 16px; color: #555;">Remember to consult with a healthcare provider for personalized advice and treatment.</p>
    </div>
  `;

  return medicalResponseHTML;
}

// Helper function to get risk level color
function getRiskColor(riskLevel) {
  switch (riskLevel) {
    case 'Critical':
      return 'red';
    case 'Dangerous':
      return '#e74c3c';
    case 'High':
      return '#f39c12';
    default:
      return '#27ae60';
  }
}



module.exports = router;

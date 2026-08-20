const jwt = require('jsonwebtoken');

async function main() {
  const token = jwt.sign({ id: 1, role: 'SCHOOL' }, process.env.JWT_TOKEN || 'a_very_long_fallback_secret_key_for_development_purposes', { expiresIn: '1h' });

  const payload = {
        schoolAddress: "Address",
        city: "City",
        state: "State",
        pinCode: "123456",
        country: "India",
        phoneLandline: "",
        phoneMobile: "1234567890",
        website: "",
        affiliationBoard: "CBSE",
        affiliationNo: "123",
        schoolType: "Private",
        yearOfEstablishment: "",
        totalStrength: "",
        principalName: "Principal Name",
        principalDesignation: "",
        principalEmail: "",
        principalMobile: "",
        coordinatorName: "Coordinator Name",
        coordinatorDesignation: "",
        coordinatorEmail: "",
        coordinatorMobile: "1234567890",
        subjects: "Mathematics Olympiad",
        classes: "1-4, 5-7",
        count1to4: "52",
        count5to7: "23",
        count8to10: "2312",
        count11to12: "12",
        totalCount: "2399"
  };

  const response = await fetch('https://olympiad-backend-yzd4.onrender.com/api/schools/1/complete-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `token=${token}` // Try cookie
    },
    body: JSON.stringify(payload)
  });
  
  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Body:', text);
}

main();

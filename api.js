const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// College Data
const colleges = [
 { 
        "name": "SIES College of Arts, Science and Commerce",
        "location": "Sion",
        "degreeCourses": {
            "B.Sc": ["IT", "CS", "PHY", "CHEM", "BIO"],
            "B.A": ["PSY", "POL", "ECO", "ENG", "JMC"],
            "B.Com": ["ACC", "FIN", "TAX", "MKT", "HRM"]
        },
        "logo": "image/sieslogo1.png",
        "address": "Sion West, Mumbai, Maharashtra, India",
        "description": "'A' graded institution, known for its academic excellence.",
        "website": "https://siesascs.edu.in/"
    },
    { 
        "name": "Jai Hind College",
        "location": "Churchgate",
        "degreeCourses": {
            "B.Sc": ["IT", "CS"],
            "B.A": ["ECO", "ENG"]
        },
        "logo": "image/jai1.png",
        "address": "Churchgate, Mumbai, Maharashtra, India",
        "description": "Popular for its arts and IT courses.",
        "website": "https://jaihindcollege.com/"
    },
    {
        "name": "St. Xavier's College",
        "location": "Marine Lines",
        "degreeCourses": {
            "B.Sc": ["BIO", "CHEM"],
            "B.A": ["PSY", "POL"]
        },
        "logo": "image/st.png",
        "address": "Marine Lines, Mumbai, Maharashtra, India",
        "description": "Ranked among the best colleges in India.",
        "website": "https://xaviers.edu/"
    },
    {
        "name": "Bhavans College",
        "location": "Andheri",
        "degreeCourses": {
            "B.A": ["ENG", "ECO"],
            "B.Com": ["ACC", "FIN"]
        },
        "logo": "image/bhan.png",
        "address": "Andheri West, Mumbai, Maharashtra, India",
        "description": "One of the oldest colleges in Mumbai.",
        "website": "https://bhavans.ac.in/"
    },
        {
        "name": "SIES College of Commerce & Economics",
        "location": "Sion",
        "degreeCourses": {
            "B.Com": ["GEN","Acc & Fin","B&I"],
        "B.Sc": ["IT"],
        "BMS": ["B.M.S"]
        },
       "logo": "image/sieslogo1.png",
    "address":" Sion (East), Mumbai, Maharashtra, India",
    "description": "Established in 1989, a leading institution for commerce, management, and IT education in Mumbai.",
    "website": "https://siesce.edu.in/"
    },
    {
    "name": "Bunts Sangha ",
    "location": "Kurla",
    "degreeCourses": {
        "B.Sc": ["(IT)", "Hospitality Studies"],
        "B.A": ["(BAMMC)"],
        "B.Com": ["General", "Accounting and Finance (BAF)"],
        "BMS": ["Bachelor of Management Studies"]
    },
    "logo": "image/buntlogo.png",
    "address": " Kurla (East), Mumbai, Maharashtra, India",
    "description":"Renowned for its academic excellence and holistic development programs.",
    "website": "https://www.bunts.edu.in/"
}
];

// Course Data
const courses = [
    {"id": "bsc-it", "name": "BSc IT (Information Technology)", "about": "Focuses on programming, software development, and IT infrastructure.", "duration": "4 years (as per NEP).", "degree": "B.Sc", "colleges": ["SIES College", "KJ Somaiya College"]},
    {"id": "bsc-cs", "name": "BSc Computer Science", "about": "Focuses on programming, algorithms, and AI.", "duration": "4 years (as per NEP).", "degree": "B.Sc", "colleges": ["SIES College", "Mithibai College"]},
    {"id": "bsc-bio", "name": "BSc Biology", "about": "Studies living organisms and ecosystems.", "duration": "3 years.", "degree": "B.Sc", "colleges": ["SIES College", "St. Xavier's College"]},
    {"id": "bsc-chem", "name": "BSc Chemistry", "about": "Explores chemical reactions and materials science.", "duration": "3 years.", "degree": "B.Sc", "colleges": ["SIES College", "Bhavans College"]},
    {"id": "ba-psy", "name": "BA Psychology", "about": "Explores human behavior and mental health.", "duration": "3 years.", "degree": "B.A", "colleges": ["St. Xavier's College", "Mithibai College"]},
    {"id": "ba-eco", "name": "BA Economics", "about": "Focuses on economic theories and policies.", "duration": "3 years.", "degree": "B.A", "colleges": ["St. Xavier's College", "Jai Hind College"]},
    {"id": "ba-eng", "name": "BA English Literature", "about": "Focuses on English literature, language, and writing.", "duration": "3 years.", "degree": "B.A", "colleges": ["Jai Hind College", "Bhavans College"]},
    {"id": "ba-pol", "name": "BA Political Science", "about": "Covers political theory, policy, and governance.", "duration": "3 years.", "degree": "B.A", "colleges": ["St. Xavier's College", "Jai Hind College"]},
    
    
    {"id": "bcom-acc", "name": "B.Com Accounting", "about": "Focuses on accounting principles and practices.", "duration": "3 years.", "degree": "B.Com", "colleges": ["NM College", "HR College"]},
    {"id": "bcom-fin", "name": "B.Com Finance", "about": "Specializes in finance, investment, and risk management.", "duration": "3 years.", "degree": "B.Com", "colleges": ["NM College", "SIES College"]},
    {"id": "bcom-mkt", "name": "B.Com Marketing", "about": "Covers marketing strategies, research, and consumer behavior.", "duration": "3 years.", "degree": "B.Com", "colleges": ["SIES College", "HR College"]},
    {"id": "bcom-tax", "name": "B.Com Taxation", "about": "Specialized in tax laws, policies, and planning.", "duration": "3 years.", "degree": "B.Com", "colleges": ["NM College", "Jai Hind College"]},
    
    {"id": "bms", "name": "BMS Management Studies", "about": "Focuses on business management and entrepreneurship.", "duration": "3 years.", "degree": "BMS", "colleges": ["HR College", "Jai Hind College"]},
    {"id": "bms-hr", "name": "BMS Human Resources", "about": "Focuses on managing people, team dynamics, and performance.", "duration": "3 years.", "degree": "BMS", "colleges": ["Jai Hind College", "NM College"]},
    {"id": "bms-marketing", "name": "BMS Marketing", "about": "Specializes in marketing management and strategies.", "duration": "3 years.", "degree": "BMS", "colleges": ["HR College", "SIES College"]},
    {"id": "bms-fin", "name": "BMS Finance", "about": "Focuses on financial management, markets, and investments.", "duration": "3 years.", "degree": "BMS", "colleges": ["Jai Hind College", "SIES College"]},
    
    
    {"id": "baf", "name": "BAF Accounting and Finance", "about": "Covers financial accounting, auditing, and taxation.", "duration": "3 years.", "degree": "BAF", "colleges": ["NM College", "HR College"]},
    {"id": "baf-fin", "name": "BAF Financial Management", "about": "Focuses on financial analysis, investment management, and accounting.", "duration": "3 years.", "degree": "BAF", "colleges": ["HR College", "SIES College"]},
    {"id": "baf-tax", "name": "BAF Taxation", "about": "Specialized in tax laws and corporate taxation.", "duration": "3 years.", "degree": "BAF", "colleges": ["NM College", "Jai Hind College"]},
    {"id": "baf-invest", "name": "BAF Investment Management", "about": "Focuses on portfolio management, stock markets, and investments.", "duration": "3 years.", "degree": "BAF", "colleges": ["HR College", "SIES College"]},
    
];

// Endpoint to fetch colleges based on degree and location
// Endpoint to fetch colleges (filtered by degree & location, with a default limit)
app.get('/get_colleges', (req, res) => {
  const degree = req.query.degree;
  const location = req.query.location;
  const limit = req.query.limit ? parseInt(req.query.limit) : 4; // Default to 4 colleges

  // Show first 'limit' colleges by default if no query parameters are provided
  if (!degree && !location) {
    return res.json(colleges.slice(0, limit));
  }

  if (!degree || !location) {
    return res.status(400).json({ error: "Both 'degree' and 'location' parameters are required." });
  }

  const filteredColleges = colleges.filter(college =>
    college.degreeCourses[degree] && college.location.toLowerCase() === location.toLowerCase()
  );

  res.json(filteredColleges.length > 0 ? filteredColleges.slice(0, limit) : { message: "No colleges found for the selected criteria." });
});

// Endpoint to fetch default colleges (only first 4 colleges)
app.get('/get_default_colleges', (req, res) => {
  res.json(colleges.slice(0, 4)); // Always return only first 4 colleges
});

// Endpoint to fetch courses based on degree (show all courses by default)
app.get('/get_courses', (req, res) => {
  const degree = req.query.degree;

  if (degree) {
    const filteredCourses = courses.filter(course => course.degree === degree);
    return res.json(filteredCourses.length > 0 ? filteredCourses : { message: "No courses found for the selected degree." });
  }

  res.json(courses); // Show all courses by default
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// for iterating over the students list by section
const sections = ["ECE", "IT", "CSDS", "CSE", "AI&ML", "EE+CE", "EEE+CE", "ME+CE"]

// for mapping branch codes extracted from roll number
const branches_ = {
  "EC" : "Electronics And Communication Engineering",
  "CS" : "Computer Science",
  "IT" : "Information Technology",
  "ME" : "Mechanical Engineering",
  "CE" : "Civil Engineering",
  "EE" : "Electrical Engineering",
  "EEE" : "Electrical And Electronics Engineering",
  "CSDS" : "Computer Science (Data Science)",
  "AI&ML" : "Artificial Intelligence And Machine Learning"
}

const branches = {
  "EC" : "ECE",
  "CS" : "CSE",
  "IT" : "IT",
  "ME" : "ME",
  "CE" : "CE",
  "EE" : "EE",
  "EEE" : "EEE",
  "CSDS" : "CSDS",
  "AI&ML" : "AIML"
}

const studentTemplate = {
    "name" : "",
    "roll_no" : "",
    "section" : "",
    "group" : "",
    "status" : "",
    "gender" : "",
    "branch" : "",
}

export{
    sections,
    branches,
    studentTemplate
}
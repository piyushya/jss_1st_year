import React from 'react'
import Select from 'react-select';
import studentsList from './assets/students_List.json'
import './App.css'

// for iterating over the students list by section
const sections = ["ECE", "IT", "CSDS", "CSE", "AI&ML", "EE+CE", "EEE+CE", "ME+CE"]

// for mapping branch codes extracted from roll number
const branches = {
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

export default function App() {
  const [studentData, setStudentData] = React.useState({
    "name" : "",
    "roll_no" : "",
    "section" : "",
    "group" : "",
    "status" : "",
    "gender" : "",
    "branch" : ""
  })

  // names of students to display in the dropdown
  const Options = []
  sections.forEach((section)=>{
    studentsList[`${section}`].forEach((data)=>{
      Options.push({value: data.NAME, label: data.NAME, id: data.ROLL_NO})
    })
  })

  // get student data of the chosen student
  function getStudentData(roll_no){
    let studentDataLocal = {
        "name" : "",
        "roll_no" : "",
        "section" : "",
        "group" : "",
        "status" : "",
        "gender" : "",
        "branch" : ""
    }
    sections.forEach((section) => {
      studentsList[section].forEach((e) => {
        if(e.ROLL_NO === roll_no){
            studentDataLocal.roll_no = e.ROLL_NO
            studentDataLocal.name = e.NAME
            studentDataLocal.section = e.SECTION
            studentDataLocal.group = e.GROUP
            studentDataLocal.status = e.STATUS || "regular"
            studentDataLocal.gender = e.gender
            studentDataLocal.branch = branches[e.ROLL_NO.replace(/[0-9]/g, '')];
        }
      })
    })
    return studentDataLocal
  }

  function handleSearch(e){
    setStudentData(getStudentData(e.id))
  }

  return (
    <>
      <nav>
          <Select
            onChange={handleSearch}
            options={Options}
          />
      </nav>
      {studentData.name ? <main>
        <h1>student Details</h1>
        <h2>{studentData.name}</h2>
        <p>Branch : {studentData.branch}</p>
        <p>Section : {studentData.section}</p>
        <p>Group : {studentData.group}</p>
        <p>Roll No. : {studentData.roll_no}</p>
        <p>Gender : {studentData.gender}</p>
        <p>Status : {studentData.status || "regular"}</p>
      </main>
      : 
      <main>
        <h1>Search For a Student to show his/her details</h1>
      </main>}
      <footer>
        <p>cc 2023</p>
      </footer>
    </>
  )
}

import React from 'react'
import Select from 'react-select';
import {db} from '../firebase'
import { getDoc, updateDoc, doc, collection } from 'firebase/firestore'
// import { reset, addUsers} from './dbOps'
import {sections, branches, studentTemplate} from './data'
import studentsList from './assets/students_List.json'
import './App.css'
// import { addUsers } from './dbOps';

export default function App() {
  const [studentData, setStudentData] = React.useState({
    studentTemplate
  })

  const [Options, setOptions] = React.useState([])

  const [liked, setLiked] = React.useState(localStorage.getItem(studentData.roll_no) ? 
  localStorage.getItem(studentData.roll_no) : "0")

  const [likes, setLikes] = React.useState(0)

  // get likes from database and get liked status from local storage if 
  // the current user is changed from select dropdown
  React.useEffect(() => {
    get_Likes(studentData.roll_no)
    setLiked(localStorage.getItem(studentData.roll_no) ? 
    localStorage.getItem(studentData.roll_no) : "0")
  }, [studentData])

  // set names of students to display in the dropdown
  React.useEffect(()=>{
    const localOptions = []
    sections.forEach((section)=>{
      studentsList[`${section}`].forEach((data)=>{
        localOptions.push({value: data.NAME, label: data.NAME, id: data.ROLL_NO})
      })
    })
    setOptions(localOptions)
    console.log("Options set for dropdown")
  }, [])

  // get student data of the chosen student
  function getStudentData(roll_no){
    let studentDataLocal = {
        studentTemplate
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

  async function get_Likes(roll_no){
    try{
      const docRef = doc(db, "likes", roll_no);
      const uData = await getDoc(docRef);
      setLikes(uData.data().likes)
    }catch{
      console.log("student does not exist")
    }
  }

  async function set_Likes(roll_no, like){
    setLikes(likes + like)
    try {
      const userD = doc(db, "likes", roll_no);
      await updateDoc(userD, {
        "likes" : likes + like
      });
    } catch (err) {
      console.log("error updating likes");
    }
  }

  window.addEventListener("storage", function () {
    console.log("something fishy")
  }, false);

  function handleSearch(e){
    setStudentData(getStudentData(e.id))
  }

  function handleLike(){
    if(liked === "1"){
      setLiked("0")
      localStorage.setItem(studentData.roll_no, "0")
      set_Likes(studentData.roll_no, -1)
    }
    else{
      setLiked("1")
      localStorage.setItem(studentData.roll_no, "1")
      set_Likes(studentData.roll_no, 1)
    }
  }

  return (
    <div className={`page ${studentData.gender==="female"?"female":""}`}>
      <nav className='navigator'>
          <Select
            className='selectBox'
            onChange={handleSearch}
            options={Options}
          />
          {storageAvailable("localStorage") && 
          <button className='heart' onClick={handleLike} type='button'>
            <img className="heartLogo" src = {(liked==="1") ? "/heart-solid.svg" : "/heart-regular.svg"}/>
            <span className={liked==="1" ? 'likeCount likeCountLiked' : "likeCount"}> {likes} </span>
          </button>}
      </nav>
      {studentData.name ?
      <main className='content'>
        <div className='std_name'>{studentData.name}</div>
        <div className='std_branch phone_view'>{studentData.branch}</div>
        <div className='infoContainer'>
          <div className='infoRow'>
            <div className='infoBox'>Section {studentData.section}</div>
            <div className='infoBox'>Group {studentData.group}</div>
          </div>
          <div className='std_branch desk_view'>{studentData.branch}</div>
          <div className='infoRow'>
            <div className='infoBox'>{studentData.roll_no}</div>
            <div className='infoBox'>Gender {studentData.gender}</div>
          </div>
        </div>
      </main>
      : 
      <main className='notSearched'>
        <p>Search For a Student to show his/her details</p>
      </main>}
      {/* <footer className='bottom'>
        <p>cc 2023</p>
      </footer> */}
    </div>
  )
}

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

import React from 'react'
import Select from 'react-select';
import {db} from '../firebase'
import { getDoc, updateDoc, doc} from 'firebase/firestore'
import {sections, branches, studentTemplate} from './data'
import JSConfetti from 'js-confetti'
import studentsList from './assets/students_List.json'
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
// import { addUsers, reset } from './dbOps';

const body = document.querySelector("body")
// window.onbeforeunload = function() {
//   console.log("unloaded")
// }
let myLikedLocal = {...localStorage}

// addUsers()

export default function App() {
  const [studentData, setStudentData] = React.useState({
    studentTemplate
  })

  const [Options, setOptions] = React.useState([])
  const [level, setLevel] = React.useState("1")

  const [liked, setLiked] = React.useState(localStorage.getItem(studentData.roll_no) ? 
  localStorage.getItem(studentData.roll_no) : "0")

  const [likes, setLikes] = React.useState(0)

  // const [LeaderBoard, setLeaderBoard] = React.useState([
  //   {"name" : "loading", "likes" : "loading"}, 
  //   {"name" : "loading", "likes" : "loading"}, 
  //   {"name" : "loading", "likes" : "loading"}
  // ])

  // get likes from database and get liked status from local storage if 
  // the current user is changed from select dropdown

  var handleCheat = function(event){
    console.log("Please don't Cheat 😉")
    if(event.key != null){
      if(event.oldValue === "1"){
        if(event.key === studentData.roll_no){
          setLiked("0")
          setLikes(prev => prev-1)
        }
        localStorage.setItem(event.key, "0")
        set_Likes_blunder(event.key)
      }
    }
    else{
      for (let [key, value] of Object.entries(myLikedLocal)) {
        if(value === "1"){
          if(key === studentData.roll_no){
            setLiked("0")
            setLikes(prev => prev-1)
          }
          localStorage.setItem(key, "0")
          set_Likes_blunder(key)
        }
      }
    }
  }

  async function set_Likes_blunder(roll_no){
    try{
      const docRef = doc(db, "likes", roll_no)
      const uData = await getDoc(docRef)
      const updLikes = uData.data().likes - 1;
      try {
        await updateDoc(docRef, {
          "likes" : updLikes
        });
      } catch (err) {
        console.log("error updating likes");
      }
    }catch{
      console.log("student does not exist")
    }
  }

  const confettiData = {
    emojis : [`${studentData.gender==="female"?"❤️":"💙"}`],
    emojiSize : `${(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))?120:150}`,
    confettiNumber : 15
  }
  const developerData = {
    emojis : ["👨‍💻", "💻", "🤖"],
    emojiSize : `${(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))?120:150}`,
    confettiNumber : 20
  }

  const jsConfetti = new JSConfetti()
  React.useEffect(() => {
    if(studentData.gender === "female"){
      body.classList.add("female")
    }else{
      body.classList.remove("female")
    }
    get_Likes(studentData.roll_no)
    setLiked(localStorage.getItem(studentData.roll_no) ? 
    localStorage.getItem(studentData.roll_no) : "0")
    console.log("data loaded")
  }, [studentData])

  // set names of students to display in the dropdown
  React.useEffect(()=>{
    window.addEventListener("storage", handleCheat, false);
    // getLeaderBoard()
    const localOptions = []
    sections.forEach((section)=>{
      studentsList[`${section}`].forEach((data)=>{
        localOptions.push({value: data.NAME, label: data.NAME, id: data.ROLL_NO})
      })
    })
    setOptions(localOptions)
    console.log("Options set for dropdown")
    if((navigator.brave && navigator.brave.isBrave()) || !storageAvailable("localStorage")){
      handleBrave()
    }
  }, [])

  React.useEffect(()=>{
    if(likes >= 50){
      setLevel("4")
      body.className = "body4"
    }
    else if(likes >= 30){
      setLevel("3")
      body.className = "body3"
    }
    else if(likes >= 10){
      setLevel("2")
      body.className = "body2"
    }
    else{
      setLevel("1")
      body.className = "body1"
    }
  }, [likes])

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

  function get_Likes(roll_no){
    try{
      const docRef = doc(db, "likes", roll_no)
      getDoc(docRef).then((uData) => {
        setLikes(uData.data().likes)
      })
    }catch{
      console.log("student does not exist")
    }
  }

  async function set_Likes(roll_no, status){
    if(likes===0 && status === "0"){
      return
    }
    const newLikes = status==="1"?(likes+1):(likes-1)
    setLikes(newLikes)
    try {
      const userD = doc(db, "likes", roll_no);
      await updateDoc(userD, {
        "likes" : newLikes
      });
    } catch (err) {
      console.log("error updating likes");
    }
  }

  function handleSearch(e){
    setStudentData(getStudentData(e.id))
  }

  function handleLike(){
    if(navigator.brave && navigator.brave.isBrave())
      return
    jsConfetti.addConfetti(confettiData)
    if(liked === "1"){
      setLiked("0")
      localStorage.setItem(studentData.roll_no, "0")
      set_Likes(studentData.roll_no, "0")
    }
    else{
      setLiked("1")
      localStorage.setItem(studentData.roll_no, "1")
      set_Likes(studentData.roll_no, "1")
    }
    myLikedLocal = {...myLikedLocal, ...localStorage}
  }

  function goToDiscord(){
    window.open("#", "_blank")
  }

  function goToDeveloper(){
    jsConfetti.addConfetti(developerData)
    setStudentData(getStudentData("22CS142"))
    window.scrollTo(0, 0)
  }

  function handleShare(){
    window.open("https://wa.me/?text=urlencodedtext", "_blank")
  }

  function handleBrave(){
    toast.info("Please use a different browser if you want to give hearts", {
      transition : Slide,
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
  });
  }

  return (
    <div className='notSelect'>
      <ToastContainer
                limit={1}
                transition={Slide}
                position="top-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
      <nav className='navigator'>
          {studentData.name && <Select
            className={`selectBox ${studentData.name ? "" : "selectBoxMain"}`}
            onChange={handleSearch}
            options={Options}
          />}
          {studentData.name && <div className={`deskDiscordInfo deskDiscordInfo${level}`} onClick={goToDiscord}>
            <img className='deskDiscordLink' src="/discord.png" alt="discord logo"/>
            <p className='deskDiscordText'>Join our Discord Server and hangout on variour channels with your JSS mates</p>
          </div>}
          <div className='heartShareCont'>
            {studentData.name &&
            <button className='heart' onClick={((navigator.brave && navigator.brave.isBrave()) || !storageAvailable("localStorage")) ? handleBrave : handleLike} type='button'>
              {`${liked==="1"?(studentData.gender==="male"?"💙":"❤️"):"🤍"}`}
              {/* <img className={`heartLogo`} src = {(liked==="1") ? "/heart-solid.svg" : "/heart-regular.svg"}/> */}
              <span className={liked==="1" ? 'likeCount likeCountLiked' : "likeCount"}> {likes} </span>
            </button>}
            <div className='shareProfile' onClick={handleShare}>
              <img className='shareIcon' src="/share.png" alt="share icon"/> Share
            </div>
          </div>
      </nav>
      {studentData.name ?
      <main className='content'>
        <div className={`stdName stdName${level} std${studentData.gender}`}>
          {studentData.name}
          <img className="badge" src={`/badges/${level}.png`} alt="level badge"/>
        </div>
        <div className='std_branch phone_view'>{studentData.branch}</div>
        <div className='infoContainer'>
          <div className='infoRow'>
            <div className={`infoBox infoBox${level}`}>Section {studentData.section}</div>
            <div className={`infoBox infoBox${level}`}>Group {studentData.group}</div>
          </div>
          <div className={`std_branch desk_view${level} desk_view`}>{studentData.branch}</div>
          <div className='infoRow'>
            <div className={`infoBox infoBox${level}`}>{studentData.roll_no}</div>
            <div className={`infoBox infoBox${level}`}>Gender {studentData.gender}</div>
          </div>
        </div>
        <div className='Info discordInfo phoneDiscordInfo'>
          <a href="#"><img className='discordLink' src="/discord.png" alt="discord logo"/></a>
          <p className='infoText'>Join our Discord Server and hangout on variour channels with your JSS mates</p>
        </div>
      </main>
      : 
      <main className='notSearched'>
        <h1 className='mainInfo'>Search for your friends and give them a ❤️</h1>
        {!studentData.name && <Select
            className={`mainScreenSelect selectBox ${studentData.name ? "" : "selectBoxMain"}`}
            onChange={handleSearch}
            options={Options}
          />}
        <div className='infoContainerMain'>
          <div className='Info levelInfo'>
            <div className='infoText'>
              <div className='infoTextLine'>0-9 ❤️ : level 1 <img width="30px" src='/badges/1.png'/></div>
              <div className='infoTextLine'>10-29 ❤️ : level 2 <img width="30px" src='/badges/2.png'/></div>
              <div className='infoTextLine'>30-49 ❤️ : level 3 <img width="30px" src='/badges/3.png'/></div>
              <div className='infoTextLine'>50--- ❤️ : level 4 <img width="30px" src='/badges/4.png'/></div>
            </div>
          </div>
          {/* <div className='Info leaderInfo'>
            <div>{LeaderBoard[0].name}</div>
            <div>{LeaderBoard[1].name}</div>
            <div>{LeaderBoard[2].name}</div>
          </div> */}
          <div className='Info discordInfo'>
            <a href="#"><img className='discordLink' src="/discord.png" alt="discord logo"/></a>
            <p className='infoText'>Also join our Discord Server and hangout on variour channels with your JSS mates</p>
          </div>
        </div>
      </main>}
      <footer className='footer' onClick={goToDeveloper}>
        <p>Made with ❤️ by Piyush</p>
      </footer>
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

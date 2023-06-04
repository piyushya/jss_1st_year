import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDocs,
  updateDoc,
  collection,
} from "firebase/firestore";
import {sections} from './data'
import studentsList from "./assets/students_List.json";

async function reset() {
  const dbUserRef = collection(db, "likes");
  const uData = await getDocs(dbUserRef);
  let usersId = [];
  uData.forEach((doc) => {
    usersId.push(doc.id);
  });
  usersId.forEach(async (id) => {
    try {
        const userD = doc(db, "likes", id);
        await updateDoc(userD, {
          "likes" : 0
        });
    } catch (err) {
        console.log("error updating likes");
    }})
}

async function addUsers() {
    // const dbUserRef = collection(db, "likes");
    sections.forEach((section) =>{
        studentsList[`${section}`].forEach(async (data)=>{
            try {
                await setDoc(doc(db, 'likes', data.ROLL_NO), {
                    likes : 0
                });
            } catch (err) {
            console.log(err);
        }})
    })
}

export {
    reset,
    addUsers
}

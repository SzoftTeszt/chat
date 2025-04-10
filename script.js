import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword

} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPKSvahzB95RJP5qZ5e3qyrEfkpevF-FA",
  authDomain: "project-01-1125e.firebaseapp.com",
  databaseURL: "https://project-01-1125e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-01-1125e",
  storageBucket: "project-01-1125e.firebasestorage.app",
  messagingSenderId: "707199014527",
  appId: "1:707199014527:web:a0fb541816fc90c2cc114a",
  measurementId: "G-RPC9D24ZZQ"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const provider= new GoogleAuthProvider()

const api= `https://project-01-1125e-default-rtdb.europe-west1.firebasedatabase.app/messages.json`
const send = document.getElementById("send")
const newMessage = document.getElementById("newmessage")
const messages = document.getElementById("messages")
const googleLogin = document.getElementById("googlelogin")
const logout = document.getElementById("logout")
const userinfo = document.getElementById("userinfo")
const wrapper = document.getElementById("wrapper")
const loggedUser={}

googleLogin.onclick = () =>
{
  signInWithPopup(auth, provider)
}

async function register(){
  try{
      const userCredemtial= await createUserWithEmailAndPassword(auth, email, password)
  }
  catch{
    alert("Hiba a regisztációnál!")
  }
}

async function login(){
  try{
      const userCredemtial= await signInWithEmailAndPassword(auth, email, password)
  }
  catch{
    alert("Hiba a bejelentkezésnél!")
  }
}

logout.onclick= ()=>{
  signOut(auth)
}

function csere(){
  googleLogin.classList.toggle("hidden")
  logout.classList.toggle("hidden")
  userinfo.classList.toggle("hidden")
  wrapper.classList.toggle("hidden")
}

onAuthStateChanged(auth, user =>{
  if (user)
  {
    console.log(user)
    loggedUser.displayName=user.displayName
    loggedUser.token=user.accessToken
    userinfo.innerHTML=user.displayName+"; "+loggedUser.token
    csere()
  }
  else{
    userinfo.innerHTML="Senki sincs belépve :("
    loggedUser.displayName=""
    loggedUser.token=""
    csere()
  }

})

async function sendMessage(){
  const body = {
    user: loggedUser.displayName,
    date: Date.now(),
    message: newMessage.value
  }
  const ujCim=api+`?auth=${loggedUser.token}`
  console.log(ujCim)
  const reposnse= await fetch(ujCim,{
    method:"POST",
    body: JSON.stringify(body)
  })


  console.log("Status: ",reposnse.status)
  newMessage.value=""
}


async function getMessages(){
  const response= await fetch(api)
  const json = await response.json()
  console.log(json)
  messages.innerHTML=""

  // for (const key in json) {
  
  //     const m = json[key];
  //     const div = document.createElement("div")
  //     div.className="message"
  //     if (m.user=="Attila") {
  //       div.classList.add("mymessage")
  //       m.user="Én"
  //     }
  //     // const date = new Date(m.date).toLocaleString()
  //     const date = new Date(m.date).toLocaleTimeString()
  //     div.innerHTML= `${date} - ${m.user}: ${m.message} `
  //     messages.appendChild(div)      
  //   }  

  const tomb=Object.entries(json)
  // console.log(tomb)

  tomb.forEach( ([_,m])=>{
      console.log(m)
      const div = document.createElement("div")
      div.className="message"
      if (m.user==loggedUser.displayName) {
        div.classList.add("mymessage")
        m.user="Én"
      }
      const date = new Date(m.date).toLocaleTimeString()
      div.innerHTML= `${date} - ${m.user}: ${m.message} `
      messages.appendChild(div) 
  })

    // document.getElementById('alja').scrollIntoView({ behavior: "smooth"})
  }



getMessages()

setInterval(getMessages, 1000)

send.addEventListener('click', sendMessage)

// https://project-01-1125e-default-rtdb.europe-west1.firebasedatabase.app/messages.json?access_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTE1MjM1YTZjNjE0NTRlZmRlZGM0NWE3N2U0MzUxMzY3ZWViZTAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQXR0aWxhIErDoWdlciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJRHdyd3poa3pzMUY1VWF5WFh1SlE3SDZiLWRGd3hQa05uYnVVZGNydEVoZHNZdlE9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcHJvamVjdC0wMS0xMTI1ZSIsImF1ZCI6InByb2plY3QtMDEtMTEyNWUiLCJhdXRoX3RpbWUiOjE3NDQyNzI3MTYsInVzZXJfaWQiOiIxQm13Uk5aR2RjT24zNE1WZ1FvZEJIWk5tUGgyIiwic3ViIjoiMUJtd1JOWkdkY09uMzRNVmdRb2RCSFpObVBoMiIsImlhdCI6MTc0NDI3MjcxNiwiZXhwIjoxNzQ0Mjc2MzE2LCJlbWFpbCI6ImphZ2VyYXR0aWxhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTEzNDIyNDUzMzg3MDAzMTEyOTA0Il0sImVtYWlsIjpbImphZ2VyYXR0aWxhQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.VYtVrLQqe-RP_Sxs43ytFsE0guWwn0IN8rcLNMOIQCZa8c4tnLwPECi9zG75IGE_zlxN-0zQsI_zDVgkuf6g2rp8EiYBIm5hN2vRp9gDtZR4nlwZDsjsoCGnj1JdlhLAV2JeN8ZFzxYD-maA3DiXo0P_k4AEkVPlS4vNjKBhUIYubQAQ7T8VpgD3FPqs-gqPQbvfsuX53fxbRWlLCDnHBv6ExumxLl6tir-r_6cHntJVRyVWSQpsFtTmRl9yngPKSgfiyiG13ukoIJmSuwm__uJV4ywYAAuaKfGvuKHwE3dYA8_fjpNMpmgda_7NvsB74t0DwcYAm5n3L3xfwyp3qg 401 (Unauthorized)
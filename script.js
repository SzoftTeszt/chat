import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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
const loggedUser={}

googleLogin.onclick = () =>
{
  signInWithPopup(auth, provider)
}

logout.onclick= ()=>{
  signOut(auth)
}

onAuthStateChanged(auth, user =>{
  if (user)
  {
    loggedUser.displayName=user.displayName
    userinfo.innerHTML=user.displayName
  }
  else{
    userinfo.innerHTML="Senki sincs belépve :("
  }

})

async function sendMessage(){
  const body = {
    user: loggedUser.displayName,
    date: Date.now(),
    message: newMessage.value
  }

  const reposnse= await fetch(api,{
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
      if (m.user=="Attila") {
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
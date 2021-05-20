import '../styles/globals.css'
import Navbar from "../components/Navbar"
import React, {useEffect, useState} from 'react'
import { hotjar } from 'react-hotjar';
 

function MyApp({ Component, pageProps }) {
  const [cookie, setCookie] = useState('')
  const [cookiesSession, setCookiesSession] = useState({})
  const [userInfo, setUserInfo] = useState({})
  const [stop, setStop] = useState(false)

  //let firststep = require("../public/firsstep.jpg")

  //Launch monitoring every 15 minutes
  let i = 0;
  let random = Math.random() * 2 + 3
  let date = new Date();
  /*setInterval(async () => {
      i+=1;
      random = Math.random() * 2 + 3
      let currentDate = new Date()
      console.log("counting i : ",i)
      if(i<101){
          await fetch('/api/monitoring', {
            method:'POST',
            body:JSON.stringify({ cookie, cookiesSession})
          })
      }
      if(date.getDay() !== currentDate.getDay() ){
          i = 0
          date = new Date();
          currentDate = new Date()
      }

  }, random*60*1000*5)*/
  /*if(stop === false){
    var checkCookie = setInterval(() => {
        if(document.cookie.split(";").find(row=>row.startsWith('userUrl'))){
          setCookie(document.cookie.split(";").find(row=>row.startsWith('userUrl')).split('=')[1])
        }else if(document.cookie.split(";").find(row=>row.startsWith(' userUrl'))){
          setCookie(document.cookie.split(";").find(row=>row.startsWith(' userUrl')).split('=')[1])
        }
        if(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession'))){
          setCookiesSession(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')).split('=')[1])
        }else if(document.cookie.split(";").find(row=>row.startsWith('cookiesSession'))){
          setCookiesSession(document.cookie.split(";").find(row=>row.startsWith('cookiesSession')).split('=')[1])
        }
        //const cook = document.cookie.split(";").find(row=>row.startsWith(' userUrl')).split('=')[1]
        setCookiesSession(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')).split('=')[1] ? document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')) : document.cookie.split(";").find(row=>row.startsWith('cookiesSession') ))
        if(cookie !== ''){
          setStop(true)
          console.log("STOOP")
        }
        if(stop == true){
          console.log(cookie)
          clearInterval(checkCookie)
        }
    }, 1000)
  }*/
  useEffect(() => {
    let i = 0
    let stop = false
    const interval = setInterval(async () => {
      if(!cookie == false){
        console.log('cookie should be set')
        stop = true
      }
      if(stop==true){
        clearInterval(interval);
      }
      i+=1
      console.log('This will run every second! : ',i);
      if(document.cookie.split(";").find(row=>row.startsWith('userUrl'))){
        setCookie(document.cookie.split(";").find(row=>row.startsWith('userUrl')).split('=')[1])
        stop = true
      }else if(document.cookie.split(";").find(row=>row.startsWith(' userUrl'))){
        setCookie(document.cookie.split(";").find(row=>row.startsWith(' userUrl')).split('=')[1])
        stop = true
      }
      if(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession'))){
        setCookiesSession(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')).split('=')[1])
      }else if(document.cookie.split(";").find(row=>row.startsWith('cookiesSession'))){
        setCookiesSession(document.cookie.split(";").find(row=>row.startsWith('cookiesSession')).split('=')[1])
      }
      //const cook = document.cookie.split(";").find(row=>row.startsWith(' userUrl')).split('=')[1]
      //setCookiesSession(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')).split('=')[1] ? document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')) : document.cookie.split(";").find(row=>row.startsWith('cookiesSession') ))
    }, 1000);
    
  }, []);
  
  useEffect(async () => {
    console.log(cookie)
    const res = await fetch('api/getUserInfo', {
      method: 'POST',
      body: JSON.stringify({cookie})
    })
    const info = await res.json()
    setUserInfo(info)
    console.log("thiiiss iss info : ",info)
  },[cookie])

  /*useEffect(async ()=>{
    try{
      console.log("getuserurl cookiesSesion : ", cookiesSession)
      let url = 'https://www.linkedin.com/feed/'
      const cookies = cookiesSession
      const res = await fetch('/api/getUserUrl',{
        method:"POST",
        body:{cookies} ,
        headers:{
          'Content-Type':'application/json'
        }
      })
      url = res.json()
      console.log("GETUSUER URL FROM APP : ",url)
    }catch(err){
      console.error(err)
    }
  }, [cookiesSession])*/
  const handleGetUserUrl = async () => {
    /*await fetch('api/monitoring', {
      method:'POST',
      body:JSON.stringify({ cookies:cookiesSession, userUrl:cookie })
    })*/
    /*try{
      console.log("getuserurl cookiesSesion : ", cookiesSession)
      let url = 'https://www.linkedin.com/feed/'
      const cookies = cookiesSession
      const res = await fetch('/api/getUserUrl',{
        method:"POST",
        body:JSON.stringify({cookies}) ,
        headers:{
          'Content-Type':'application/json'
        }
      })
      url = res.json()
      console.log("GETUSUER URL FROM APP : ",url)
    }catch(err){
      console.error(err)
    }*/
    console.log(cookie)
    const res = await fetch('api/getUserInfo', {
      method: 'POST',
      body: JSON.stringify({cookie})
    })
    const info = await res.json()
    setUserInfo(info)
    console.log(info)
  }
  useEffect(() => {
    console.log(userInfo.data)
  },[userInfo])
  useEffect(() => {
    if(!cookie){
      document.cookie = "state=loading"
    }else{
      document.cookie = "state=notLoading"
    }
  },[cookie])
  useEffect(() => {
    hotjar.initialize(2385823);
  }, [])
  return (
        !cookie ? (<div className="grid grid-col place-content-center place-items-center h-screen">
          <div className="loader" id="loader"></div>
          <h2 className="font-bold py-4">Please wait</h2>
          <h2>Or click the "refresh" button in the extension</h2>
        </div>) : 
        (
        <div className="overscroll-none">
          <Navbar cookie={cookie} userInfo={userInfo} />
          <Component {...pageProps} cookie={cookie} cookiesSession={cookiesSession} userInfo={userInfo} />
        </div>
        )
  )
  
}
//<button onClick={handleGetUserUrl} className="fixed left-1/2 top-1/2 bg-red-300">GET USER URL</button>

export default MyApp

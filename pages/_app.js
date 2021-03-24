import '../styles/globals.css'
import Navbar from "../components/Navbar"
import React, {useEffect, useState} from 'react'


function MyApp({ Component, pageProps }) {
  const [cookie, setCookie] = useState('')
  const [cookiesSession, setCookiesSession] = useState({})
  const [userInfo, setUserInfo] = useState({})

  //Launch monitoring every 15 minutes
  let i = 0;
  let random = Math.random() * 2 + 3
  let date = new Date();
  setInterval(async () => {
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

  }, random*60*1000*5)

  useEffect(async () => {
    try{
      setCookie(document.cookie.split(";").find(row=>row.startsWith('userUrl')).split('=')[1])
      //const cook = document.cookie.split(";").find(row=>row.startsWith(' userUrl')).split('=')[1]
      setCookiesSession(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')).split('=')[1])
    }catch(err){
      console.error(err)
    }
    
  }, [])
  useEffect(async () => {
    console.log(cookie)
    const res = await fetch('api/getUserInfo', {
      method: 'POST',
      body: JSON.stringify({cookie})
    })
    const info = await res.json()
    setUserInfo(info)
    console.log(info)
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
    await fetch('api/monitoring', {
      method:'POST',
      body:JSON.stringify({ cookies:cookiesSession, userUrl:cookie })
    })
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
  return (
    <div className="">
      <Navbar cookie={cookie} userInfo={userInfo} />
      <Component {...pageProps} cookie={cookie} cookiesSession={cookiesSession} />
    </div>
  )
}
//<button onClick={handleGetUserUrl} className="fixed left-1/2 top-1/2 bg-red-300">GET USER URL</button>

export default MyApp

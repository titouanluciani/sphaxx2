import '../styles/globals.css'
import Navbar from "../components/Navbar"
import {useEffect, useState} from 'react'


function MyApp({ Component, pageProps }) {
  const [cookie, setCookie] = useState('')
  const [cookiesSession, setCookiesSession] = useState({})
  useEffect(() => {
    try{
      setCookie(document.cookie.split(";").find(row=>row.startsWith('userUrl')).split('=')[1])
      //const cook = document.cookie.split(";").find(row=>row.startsWith(' userUrl')).split('=')[1]
      console.log("this is cookie, careful for regex : ", cookie)
      //console.log("this is cook, careful for regex : ", cook)
      setCookiesSession(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')).split('=')[1])
      console.log("this is cookieSession, careful for regex : ", cookiesSession)
    }catch(err){
      console.error(err)
    }
  }, [])

  return (
    <div className="">
      <Navbar className=""/>
      <Component {...pageProps} cookie={cookie} cookiesSession={cookiesSession} />
    </div>
  )
}

export default MyApp

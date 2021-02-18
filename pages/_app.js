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
      setCookiesSession(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')).split('=')[1])
    }catch(err){
      console.error(err)
    }
  }, [])

  return (
    <div className="">
      <Navbar cookie={cookie} />
      <Component {...pageProps} cookie={cookie} cookiesSession={cookiesSession} />
    </div>
  )
}

export default MyApp

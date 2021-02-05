import '../styles/globals.css'
import Navbar from "../components/Navbar"
import {useEffect, useState} from 'react'


function MyApp({ Component, pageProps }) {
  const [cookie, setCookie] = useState('')
  useEffect(() => {
    setCookie(document.cookie.split(";").find(row=>row.startsWith('userUrl')).split('=')[1])
    //const cook = document.cookie.split(";").find(row=>row.startsWith(' userUrl')).split('=')[1]
    console.log("this is cookie, careful for regex : ", cookie)
    //console.log("this is cook, careful for regex : ", cook)
  }, [])

  return (
    <div className="">
      <Navbar className=""/>
      <Component {...pageProps} cookie={cookie} />
    </div>
  )
}

export default MyApp

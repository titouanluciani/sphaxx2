import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="">
      <Navbar className=""/>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp

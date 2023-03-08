import { useEffect, useState , useContext} from 'react'
import './Home.scss'
import  {  useAuthentication } from '../Authentication/Authentication'
import useFetch from '../Authentication/useFetch'


function Home() {
  const {User, logout} = useAuthentication()


  return (
      <div className="Home">
       <h1>Dear {User?.email}</h1>
       <p>You are successfully been logged in our application</p>
       
       <div>
        <button onClick={logout}>Logout</button>
       </div>
    </div>
  )
}

export default Home

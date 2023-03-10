import React from 'react'

import './Profile.scss'
import  {  useAuthentication } from '../Authentication/Authentication'
import Navbar from './Navbar/Navbar'
import PersonalInfo from './Personal Info/PersonalInfo'
const Profile = () => {
  const {User, logout} = useAuthentication()


  return (
    <>
      <div className="Profile">
        
    </div>
    </>
  )
}

export default Profile
//  <h1>Dear {User?.email}</h1>
//        <p>You are successfully been logged in our application</p>
       
//        <div>
//         <button onClick={logout}>Logout</button>
//        </div>
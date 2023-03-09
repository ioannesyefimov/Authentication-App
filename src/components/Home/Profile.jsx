import { useEffect, useState , FC, useContext} from 'react'

import './Profile.scss'
import  {  useAuthentication } from '../Authentication/Authentication'
import useFetch from '../Authentication/useFetch'
import Navbar from './Navbar/Navbar'
import ChangeInfo from './ChangeInfo/ChangeInfo'
import PersonalInfo from './Personal Info/PersonalInfo'
const Profile = () => {
  const {User, logout} = useAuthentication()


  return (
    <>
      <Navbar />
      <div className="Profile">
        <ChangeInfo />
        <PersonalInfo/>
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
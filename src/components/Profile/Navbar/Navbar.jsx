import React, { useState } from 'react'
import './Navbar.scss'
import { 
    devchall_dark,devchall_light 
    ,groupIco,logoutIco,profileIco, 
    triangleIco} from '../../../Assets'
import { useAuthentication } from '../../Authentication/Authentication'
import { useTheme } from '../../Authentication/ThemeProvider/ThemeProvider'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const {theme} = useTheme()
    const {User} = useAuthentication()
    const [isDropped, setIsDropped] = useState(false)

  return (
    <div className='navbar'>
        <img onClick={()=>window.location.replace('/profile')} src={theme==='light' ? devchall_dark : devchall_light  } alt="" />
        <div className='wrapper'>
            <div className='credentials_wrapper'>
                <img src={User?.picture ? User?.picture :  profileIco} alt="profile image" />
                <p className='user-fullName'>{User?.fullName}</p>
                <button  onClick={()=> setIsDropped(isDropped=>!isDropped)}><img  style={isDropped ?  { transform: "rotate(180deg)"} : (null)} src={triangleIco} alt="triangle icon" /></button>
            </div>
            {isDropped ? (
                <div className='drop-menu box-shadow' >
                    <div className="wrapper">
                        <img src={profileIco} alt="profile icon" />
                        <p>My profile</p>
                    </div>
                    <div className="wrapper">
                        <img src={groupIco} alt="group icon" />
                        <p>Group Chat</p>
                    </div>
                    <div className="wrapper">
                       <img src={logoutIco} alt="logout icon" />
                        <button className='logout-btn'>Logout
                       </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
       
        </div>
    </div>
  )
}

export default Navbar
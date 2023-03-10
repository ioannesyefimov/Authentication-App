import React from 'react'
import {profileIco} from '../../../Assets/index'
import "./PersonalInfo.scss"
import {useAuthentication} from '../../Authentication/Authentication'
import { useNavigate } from 'react-router-dom'
const PersonalInfo = () => {
  const {User} = useAuthentication()
  const navigate = useNavigate()
  return (
    <div className='personal-info-component'>
        <div className='wrapper'
        >
          <h2 className='title'>Personal Info</h2>
          <p className='gray'>Basic info like your name and photo</p>
        </div>

        <div className="wrapper2 box-shadow">
          <div className="title-wrapper">
            <div className=''>
              <h4>Profile</h4>
              <p className='gray'>Some info may be visible to other people</p>
            </div>
            <button onClick={()=>navigate('/profile/change')} className='edit-btn'>
              Edit
            </button>
          </div>
          <div className="inner-wrapper2">
            <div className="info-wrapper">
              <p className="gray info-name">Photo</p>
              <img  className='profile-img' src={User?.picture ? User?.picture : profileIco} alt="profile image" />
            </div>
            <div className="info-wrapper">
              <p className="gray info-name">Name</p>
              <span className="user-input">{User?.fullName}</span>
            </div>
            <div className="info-wrapper">
              <p className="gray info-name">BIO</p>
              <span className="user-input">{User?.Bio ? User?.Bio : 'empty'}</span>
            </div>
            <div className="info-wrapper">
              <p className="gray info-name">Phone</p>
              <span className="user-input">{User?.phone ? User?.phone : 'empty'}</span>
            </div>
            <div className="info-wrapper">
              <p className="gray info-name">Email</p>
              <span className="user-input">{User?.email ? User?.email : 'empty'}</span>
            </div>
            <div className="info-wrapper">
              <p className="gray info-name">Password</p>
              <span className="user-input">{User?.password ? User?.password : '**********'}</span>
            </div>
          </div>
        </div>
       </div>
  )
}

export default PersonalInfo
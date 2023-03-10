import React, { useState } from 'react'
import { backIco, cameraIco, profileIco } from '../../../Assets'
import { useAuthentication } from '../../Authentication/Authentication'
import ChangeForm from '../../LoginForm/ChangeForm'
import './ChangeInfo.scss'
import UploadInput from './UploadInput'
const ChangeInfo = () => {
  const {User} = useAuthentication()
  const [nameValue, setNameValue] = useState('')
  const [bioValue, setBioValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const nameRef = React.createRef(null)
  const bioRef = React.createRef(null)
  const phoneRef = React.createRef(null)
  const emailRef = React.createRef(null)
  const passwordRef = React.createRef(null)

  const changePhoto = async () => {

  }

  return (
    <div className='change-info-component'>
      <button className='back-btn'>
        <img src={backIco} alt="back icon" />
        Back</button>
      <div className="wrapper">
        <div className="title">
          <h2>Change Info</h2>
          <p className="gray">Changes will be reflected to every services</p>
        </div>
        <div className="wrapper2">
          <div className="form-wrapper">
            <div className="inner-wrapper">
              <div onClick={changePhoto} className="img-wrapper">
                <UploadInput>
                   <img className='camera-img' src={cameraIco} alt="camera icon" />
                   <img className='profile-img' src={User?.picture ? User.picture : profileIco} alt="profile image" />
                </UploadInput>
              </div>
              <p className="gray">CHANGE PHOTO</p>
            </div>
            <ChangeForm type="text" placeholder={'Enter your name...'} ref={nameRef} name='name' />
            <ChangeForm type="text" placeholder={'Enter your bio...'} ref={bioRef} name='bio' />
            <ChangeForm type="text" placeholder={'Enter your phone...'} ref={phoneRef} name='phone' />
            <ChangeForm type="text" placeholder={'Enter your email...'} ref={emailRef} name='email' />
            <ChangeForm type="text" placeholder={'Enter your password...'} ref={passwordRef} name='pasword' />
          </div>
        
        </div>
      </div>
    </div>
  )
}

export default ChangeInfo
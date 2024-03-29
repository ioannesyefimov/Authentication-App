import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { backIco, cameraIco, profileIco } from '../../../Assets'
import { useAuthentication } from '../../Authentication/Authentication'
import useFetch from '../../hooks/useFetch'
import SensentiveArea from '../Personal Info/SensetiveArea'
import { convertBase64 } from '../../utils/utils'
import ChangeForm from '../../LoginForm/ChangeForm'
import './ChangeInfo.scss'
import UploadInput from './UploadInput'
import AlertDiv from '../../AlertDiv/AlertDiv'
const ChangeInfo = () => {
  const {User, cookies, Message, setMessage} = useAuthentication()
  const [selectedFile, setSelectedFile] = useState(null)
  const {handleChangeFetch} = useFetch()
  const [isSelectedSensetive, setIsSelecterSensetive] = useState(false)
  const navigate = useNavigate()
  
 const handleSubmit = async(e)=>{
  e.preventDefault()
  const data = new FormData(formRef.current)
  if(selectedFile){

    data.append('picture',selectedFile )
    console.log(data);
  }
  // console.log(data);
  await handleChangeFetch({data, user:User, accessToken: cookies?.accessToken});

  navigate('/profile')
}
// {Message?.message ? (<AlertDiv message={Message} setMessage={setMessage} />) : null}

  const formRef = React.createRef(null)
  const nameRef = React.createRef(null)
  const bioRef = React.createRef(null)
  const phoneRef = React.createRef(null)
  const emailRef = React.createRef(null)
  const passwordRef = React.createRef(null)
  return (
    <div className='change-info-component'>
      {isSelectedSensetive ? (<SensentiveArea isShowed={isSelectedSensetive} setIsShowed={setIsSelecterSensetive} />) : (
        <>
         <button onClick={()=>navigate('/profile')} className='back-btn'>
         <img src={backIco} alt="back icon" />
         Back</button>
           <div className="wrapper box-shadow">
             <div className="title">
               <h2>Change Info</h2>
               <p className="gray">Changes will be reflected to every services</p>
             </div>
             <div className="wrapper2">
               <div className="form-wrapper">
                 <form onSubmit={handleSubmit} action="submit" ref={formRef}>
                   <div className="inner-wrapper">
                     <div className="img-wrapper">
                       <UploadInput setSelectedFile={setSelectedFile}>
                         <img className='camera-img' src={cameraIco} alt="camera icon" />
                         <img className='profile-img' src={User?.picture ? User.picture : profileIco} alt="profile image" />
                       </UploadInput>
                     </div>
                     <label className="gray">CHANGE PHOTO</label>
                   </div>
                   <ChangeForm type="text" placeholder={'Enter your name...'} ref={nameRef} name='name' />
                   <ChangeForm type="text" placeholder={'Enter your bio...'} ref={bioRef} name='bio' />
                   <ChangeForm type="text" placeholder={'Enter your phone...'} ref={phoneRef} name='phone' />
                   <ChangeForm type="text" placeholder={'Enter your email...'} ref={emailRef} name='email' />
                   <ChangeForm type="text" placeholder={'Enter your password...'} ref={passwordRef} name='password' />
                   <button type="submit" className='save-btn'>Save</button>
                   <button onClick={()=>setIsSelecterSensetive(isSelectedSensetive=>!isSelectedSensetive)} type="button" className='sensetive-btn'>Sensetive </button>
                 </form>
                 </div>
               </div>
           </div>
        </>
      )}
    </div>
  )
}

export default ChangeInfo
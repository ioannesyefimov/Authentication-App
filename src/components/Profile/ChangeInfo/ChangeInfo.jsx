import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { backIco, cameraIco, profileIco } from '../../../Assets'
import { useAuthentication } from '../../Authentication/Authentication'
import useFetch from '../../hooks/useFetch'
import ChangeForm from '../../LoginForm/ChangeForm'
import './ChangeInfo.scss'
import UploadInput from './UploadInput'
const ChangeInfo = () => {
  const {User} = useAuthentication()
  const [selectedFile, setSelectedFile] = useState(null)
  
  const navigate = useNavigate()
  
 const handleSubmit = (e)=>{
  e.preventDefault()
  
  const nameVal = nameRef.current.value
  const bioVal = bioRef.current.value
  const phoneVal = phoneRef.current.value
  const emailVal = emailRef.current.value
  const passwordVal = passwordRef.current.value

  // console.log(formRef.current)
  console.log(data.get('email'))
  console.log(data)
 }
  
  const formRef = React.createRef(null)
  const nameRef = React.createRef(null)
  const bioRef = React.createRef(null)
  const phoneRef = React.createRef(null)
  const emailRef = React.createRef(null)
  const passwordRef = React.createRef(null)


  const changePhoto = async (event) => {
   
    // const file = event.target.files[0]
    const base64 = await convertBase64(selectedFile)
    

        // 👇 Uploading the file using the fetch API to the server
     const uplaod = await fetch('http://localhost:5050/api/upload/picture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            image: base64
          }),
        })

      const uploadResponse = await uplaod.json()

      if(uploadResponse.success){
        console.log(uploadResponse.data)
        const changePhoto = await fetch('http://localhost:5050/api/change/picture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            email: User?.email,
            newPicture: uploadResponse?.data?.url
          }),
        })

        const isChanged = await changePhoto.json()
        console.log(isChanged)
        if(isChanged.success){
          setResponse({message: isChanged?.data?.message, success: isChanged?.success})
          const updatedUser = User
          updatedUser.picture = isChanged?.data?.url
          setCookie('user', updatedUser, {path:'/'} )
        }

      }
      else {
        setResponse({message: isChanged?.message, success: isChanged?.success})
        console.log(uploadResponse)
      }
     
      };
      
  
  const hangdleChange = (e)=>{
    setData({...data,[e.target.name]: e.target.value})
  }

  

  return (
    <div className='change-info-component'>
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
                    <p className="gray">CHANGE PHOTO</p>
                  </div>
                  <ChangeForm type="text" placeholder={'Enter your name...'} ref={nameRef} name='name' />
                  <ChangeForm type="text" placeholder={'Enter your bio...'} ref={bioRef} name='bio' />
                  <ChangeForm type="text" placeholder={'Enter your phone...'} ref={phoneRef} name='phone' />
                  <ChangeForm type="text" placeholder={'Enter your email...'} ref={emailRef} name='email' />
                  <ChangeForm type="text" placeholder={'Enter your password...'} ref={passwordRef} name='pasword' />
                  <button type="submit" className='save-btn'>Save</button>
                </form>
              </div>
            
            </div>
      </div>
    </div>
  )
}

export default ChangeInfo
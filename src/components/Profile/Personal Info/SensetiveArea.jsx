import React, { useState } from 'react'
import './SensetiveArea.scss'
import { backIco } from '../../../Assets'
import ChangeForm from '../../LoginForm/ChangeForm'
import AuthForm from '../../LoginForm/AuthForm'
import useFetch from '../../hooks/useFetch'
import { useAuthentication } from '../../Authentication/Authentication'
import SocialLoginBtns from '../../Authentication/SocialLoginBtns/SocialLoginBtns'

const SensentiveArea = ({setIsShowed, isShowed}) => {
  const [isPrompted,setIsPrompted] = useState(false)
  const {handleDelete} = useFetch()
  const {Message,User, cookies,logout} = useAuthentication()
  const handleDeleteSubmit = async(e)=>{
    e.preventDefault();

    const data = new FormData(formRef.current)
    console.log(data)
    let isDeleted = await handleDelete({data,accessToken: cookies?.accessToken, user: User })
    console.log(`isdeleted: `,isDeleted)
    if(!isDeleted?.success) return setMessage({message: isDeleted?.message})
    return logout('/auth/signin')

  }

  const emailRef = React.createRef(null)
  const passwordRef = React.createRef(null)
  const formRef = React.createRef(null)

  return (
    <div className='sensetive-area box-shadow'>
        
            <h2 className='title'>Sensetive area:</h2>

        {isPrompted ? (
          <>
          <button  onClick={()=>setIsShowed(isShowed=>!isShowed) } className='back-btn'>
            <img src={backIco} alt="back icon" />
            Back</button>
          <AuthForm btnText={'Delete User'} formRef={formRef} onSubmit={handleDeleteSubmit} emailRef={emailRef} passwordRef={passwordRef} Message={Message} type="signin" />
          <p style={{margin: '0 auto'}} className="gray">Or continue with social:</p>
          <div className="social-wrapper">
            <SocialLoginBtns loggedThroughBtn={{social : User?.loggedThrough ? User.loggedThrough : localStorage.getItem('LOGGED_THROUGH')}} type={'delete'} />
          </div>
          {/* <button className='back-btn2' onClick={()=>setIsPrompted(isPrompted=>!isPrompted)}></button> */}

          </>
        ) : (
            <div style={{display:"flex",justifyContent:'center',alignItems: 'center'}}>
            <button  onClick={()=>setIsShowed(isShowed=>!isShowed) } className='back-btn'>
            <img src={backIco} alt="back icon" />
            Back</button>

            <button className='delete-btn' onClick={()=>setIsPrompted(isPrompted=>!isPrompted)}>Delete Account</button>
          </div>
        )}
        
    </div>
  )
}

export default SensentiveArea
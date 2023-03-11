import React, { useEffect , useState} from 'react'
import {devchall_light, devchall_dark} from '../../../Assets'
import FormInput from '../../LoginForm/AuthForm'
import useFetch from '../../hooks/useFetch'
import { useTheme } from '../ThemeProvider/ThemeProvider'
import './Register.scss'
import SocialLoginBtns from '../SocialLoginBtns/SocialLoginBtns'
import { validateInput } from '../../utils/utils'

import '../Authentication.scss'
import { useAuthentication } from '../Authentication'
import AlertDiv from '../../AlertDiv/AlertDiv'


const Register = () => {

  
  const {theme} = useTheme()
  const {setUser,Error, setError, authenticationErrors}= useAuthentication()
  const {fetchRegister } = useFetch()
  const emailRef = React.createRef(null)
  const fullNameRef = React.createRef(null)
  const passwordRef = React.createRef(null)
  // useEffect(()=>{
  //   const login_type = localStorage.getItem('LOGGED_THROUGH')
    // if(cookies.accessTokenGH !==undefined && login_type === 'Github'){
    //   console.log(cookies.accessTokenGH)
    //   handleGithubRegister(cookies.accessTokenGH, 'register')

  //   // }
  // }, [])
    
  // useEffect(() => {
    

  //   if(window.google){
  //     google.accounts.id.initialize({
  //       client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
  //       callback:handleGoogleRegister ,
  //     })
  //     google.accounts.id.renderButton(document.getElementById('googleBtn'), {
  //       shape: "circle",
  //       type: "icon",
  //     })
  //   }
  //   // google.accounts.id.prompt()
    
  // },  [handleGoogleRegister])

 



  const onRegisterSubmit = async(e)=> {
    e.preventDefault()

    if(!validateInput({firstRef:emailRef , secondRef:fullNameRef , thirdRef:passwordRef , setError, Error})) return 
    console.log(!validateInput({firstRef:emailRef , secondRef:fullNameRef , thirdRef:passwordRef , setError}))

    fetchRegister(fullNameRef,passwordRef,emailRef)
  }

 

  return (
    <div className='authentication-component'>
     { Error?.message  ? 
      (<AlertDiv socialType={Error?.loggedThrough} message={Error} setMessage={setError}  />)  : (null)
      }
      <div className='wrapper'>
          <img src={theme == 'light' ? (devchall_dark) : (devchall_light)  } alt="logo" />
          <div className="text-wrapper">
            <h2>Join thousands of learners from around the world</h2>
            <p className='inner'>Master web development by making real-life projects. There are multiple paths for you to choose</p>
          </div>
      </div> 
      <FormInput type='register' fullNameRef={fullNameRef} Error={Error} btnText={'Start coding now'} emailRef={emailRef} passwordRef={passwordRef}   onSubmit={onRegisterSubmit}/>
      <div className="social-btns">
        <span>or continue with these social profile</span>
        <SocialLoginBtns type="register" />
      </div>
  </div>
  )
}

export default Register
import React, { useEffect , useState} from 'react'
import {devchall_light, devchall_dark} from '../../../Assets'
import FormInput from '../../LoginForm/AuthForm'
import useFetch from '../useFetch'
import { useTheme } from '../ThemeProvider/ThemeProvider'
import './Register.scss'
import SocialLoginBtns from '../SocialLoginBtns'
import { validateInput } from '../../utils/utils'

import '../Authentication.scss'
import { useAuthentication } from '../Authentication'
import AlertDiv from '../../AlertDiv/AlertDiv'


const Register = () => {

  
  const {theme} = useTheme()
  const {setUser,Error, setError, authenticationErrors}= useAuthentication()
  const {setCookie,cookies,handleGithubRegister,handleGoogleRegister } = useFetch('register',setError)
  const emailRef = React.createRef(null)
  const fullNameRef = React.createRef(null)
  const passwordRef = React.createRef(null)
  useEffect(()=>{
    const login_type = localStorage.getItem('LOGGED_THROUGH')
    if(cookies.accessTokenGH !==undefined && login_type === 'Github'){
      console.log(cookies.accessTokenGH)
      handleGithubRegister(cookies.accessTokenGH, 'register')

    }
  }, [])
    
  useEffect(() => {
    

    if(window.google){
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
        callback:handleGoogleRegister ,
      })
      google.accounts.id.renderButton(document.getElementById('googleBtn'), {
        shape: "circle",
        type: "icon",
      })
    }
    // google.accounts.id.prompt()
    
  },  [handleGoogleRegister])

 



  const onRegisterSubmit = async(e)=> {
    e.preventDefault()

    console.log(emailRef.current.value)
    console.log(passwordRef.current.value)
    console.log(fullNameRef.current.value)

    if(!validateInput({firstRef:emailRef , secondRef:fullNameRef , thirdRef:passwordRef , setError, Error})) return 
    console.log(!validateInput({firstRef:emailRef , secondRef:fullNameRef , thirdRef:passwordRef , setError}))

    const APICALL = await fetch('http://localhost:5050/api/auth/register', {
      method: "POST",
      headers:{
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        fullName: fullNameRef.current.value,
        password: passwordRef.current.value,
        email: emailRef.current.value,
        loggedThrough: 'Internal'
      })
    })
    const response = await APICALL.json()


    if(!response.success ) {
      if(response?.loggedThrough ){
        return setError({message:response.message, loggedThrough: response?.loggedThrough})
      } 
    } else if(response.success){
      setUser(response.data.user)
      setCookie('accessTokenINTERNAL', response.data.accessToken, {path: '/'})
      setCookie('refreshTokenINTERNAL', response.data.refreshToken)

      localStorage.setItem('LOGGED_THROUGH', response.data.loggedThrough)
    }
   
  }

 

  return (
    <div className='authentication-component'>
     { Error?.message  ? 
      (<AlertDiv socialType={Error?.loggedThrough} error={Error} setError={setError}  />)  : (null)
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
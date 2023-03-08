import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../useFetch'
import {devchall_light, devchall_dark} from '../../../Assets'
import { useTheme } from '../ThemeProvider/ThemeProvider'

import '../Authentication.scss'
import './SignIn.scss'
import { validateInput } from '../../utils/utils'
import FormInput from '../../LoginForm/AuthForm'
import SocialLoginBtns from '../SocialLoginBtns'
import { Errors } from '../../utils/utils'
import AlertDiv from '../../AlertDiv/AlertDiv'
import { useAuthentication } from '../Authentication'


const SingIn = () => {
 
  const {theme} = useTheme()
  const {setCookie} = useFetch()
  const {setUser, Error, setError} = useAuthentication()

  const emailRef = React.createRef(null)
  const passwordRef = React.createRef(null)



  const onSignInSubmit = async(e)=> {
    e.preventDefault()
    if(!validateInput({firstRef:emailRef , secondRef:undefined, thirdRef:passwordRef , setError})) return console.log(validateInput({firstRef:emailRef , secondRef:undefined, thirdRef:passwordRef , setError}))
    console.log('signing in')

    const USER = await fetch('http://localhost:5050/api/auth/signin', {
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        loggedThrough: 'Internal'
      })    
    })
    console.log(USER)
    const response = await USER.json()
    console.log(response)

    if(!response.success ) {
      if(response?.social ){
        return setError({message:response.message, social: response?.social})
      } 
    } else if(response.success){
      setUser(response.data.user)
      setCookie('accessTokenINTERNAL', response.data.accessToken, {path: '/'})
      localStorage.setItem('LOGGED_THROUGH', response.data.loggedThrough)
    }
  }

 



  return (
    <div className='authentication-component'>
      {/* {Error.ERROR !== '' && Error.ERROR == Errors.LOGGED_THROUGH_SOCIAL ? 
      (<AlertDiv socialType={Error.social} error={Error.ERROR} setError={setError} email={Email} pw={Password} />) 
      : Error?.includes(Errors.NOT_SIGNED_UP) ? (<AlertDiv  error={Error} setError={setError}  />) : (null)} */}
      { Error?.message  ? 
      (<AlertDiv socialType={Error?.social} error={Error} setError={setError}  />)  : (null)
      }
     <div className='wrapper'>
        <img src={theme == 'light' ?  (devchall_dark) : (devchall_light)} alt="logo" />
        <div className="text-wrapper">
        <span className='inner'>Login</span>
        </div>
      </div> 
      <FormInput Error={Error} btnText={'Login'}  emailRef={emailRef} passwordRef={passwordRef}  onSubmit={onSignInSubmit}/>

      <div className="social-btns">
        <span>or continue with these social profile</span>
        <SocialLoginBtns url={"http://localhost:5050/api/auth/"}  type="signin"/>
      </div>
    </div>
  )
}

export default SingIn
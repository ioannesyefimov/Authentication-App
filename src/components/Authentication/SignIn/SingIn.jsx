import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../useFetch'
import {devchall_light, devchall_dark} from '../../../Assets'
import { useTheme } from '../ThemeProvider/ThemeProvider'

import '../Authentication.scss'
import './SignIn.scss'
import { validateInput } from '../../utils/utils'
import FormInput from '../../LoginForm/AuthForm'
import SocialLoginBtns from '../SocialLoginBtns/SocialLoginBtns'
import { Errors } from '../../utils/utils'
import AlertDiv from '../../AlertDiv/AlertDiv'
import { useAuthentication } from '../Authentication'


const SingIn = () => {
 
  const {theme} = useTheme()
  const {Error, setError} = useAuthentication()
  const {fetchSignin} = useFetch()

  const emailRef = React.createRef(null)
  const passwordRef = React.createRef(null)



  const onSignInSubmit = async(e)=> {
    e.preventDefault()
    if(!validateInput({firstRef:emailRef , secondRef:undefined, thirdRef:passwordRef , setError})) return console.log(validateInput({firstRef:emailRef , secondRef:undefined, thirdRef:passwordRef , setError}))
    console.log('signing in')

    fetchSignin(emailRef,passwordRef)
  }

 



  return (
    <div className='authentication-component'>
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
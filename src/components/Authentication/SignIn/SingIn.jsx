import React, {useState, useEffect} from 'react'
import useFetch from '../../hooks/useFetch'
import {devchall_light, devchall_dark} from '../../../Assets'
import { useTheme } from '../ThemeProvider/ThemeProvider'
import { Link } from 'react-router-dom'
import '../Authentication.scss'
import './SignIn.scss'
import { validateInput } from '../../utils/utils'
import FormInput from '../../LoginForm/AuthForm'
import SocialLoginBtns from '../SocialLoginBtns/SocialLoginBtns'
import AlertDiv from '../../AlertDiv/AlertDiv'
import { useAuthentication } from '../Authentication'


const SingIn = () => {
 
  const {theme} = useTheme()
  const {Message,setMessage} = useAuthentication()
  const {fetchSignin} = useFetch()
  

  const emailRef = React.createRef(null)
  const passwordRef = React.createRef(null)



  const onSignInSubmit = async(e)=> {
    e.preventDefault()
    if(!validateInput({firstRef:emailRef , secondRef:undefined, thirdRef:passwordRef , setMessage})) return console.log(validateInput({firstRef:emailRef , secondRef:undefined, thirdRef:passwordRef , setMessage}))
    console.log('signing in')

    fetchSignin(emailRef,passwordRef)
  }

 



  return (
    <div className='authentication-component box-shadow'>
      { Message?.message   ? 
      (<AlertDiv  message={Message} setMessage={setMessage}  />)  : (null)
      }
          <div className='wrapper'>
            <img src={theme == 'light' ?  (devchall_dark) : (devchall_light)} alt="logo" />
            <div className="text-wrapper">
            <span className='inner'>Login</span>
            </div>
          </div> 
          <FormInput Message={Message} btnText={'Login'}  emailRef={emailRef} passwordRef={passwordRef}  onSubmit={onSignInSubmit}/>
          <div className="social-btns">
            <span>or continue with these social profile</span>
            <div className="social-wrapper">
            <SocialLoginBtns url={"http://localhost:5050/api/auth/"}  type="signin"/>
            </div>
          <span className='hint-btn'>Don't have an account yet? <Link to="/auth/register" replace >Register</Link></span>
          </div>
    </div>
     
  )
}

export default SingIn
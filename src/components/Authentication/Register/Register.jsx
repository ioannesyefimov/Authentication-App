import React, { useEffect , useState} from 'react'
import {devchall_light, devchall_dark} from '../../../Assets'
import FormInput from '../../LoginForm/AuthForm'
import useFetch from '../../hooks/useFetch'
import { useTheme } from '../ThemeProvider/ThemeProvider'
import './Register.scss'
import SocialLoginBtns from '../SocialLoginBtns/SocialLoginBtns'
import { validateInput } from '../../utils/utils'
import { Link } from 'react-router-dom'
import '../Authentication.scss'
import { useAuthentication } from '../Authentication'
import AlertDiv from '../../AlertDiv/AlertDiv'


const Register = () => {

  
  const {theme} = useTheme()
  const {setUser,Message, setMessage}= useAuthentication()
  const {fetchRegister } = useFetch()
  const emailRef = React.createRef(null)
  const fullNameRef = React.createRef(null)
  const passwordRef = React.createRef(null)


  const onRegisterSubmit = async(e)=> {
    e.preventDefault()

    if(!validateInput({firstRef:emailRef , secondRef:fullNameRef , thirdRef:passwordRef , setMessage, Message})) return 

    fetchRegister(fullNameRef,passwordRef,emailRef)
  }

 
  // { Message?.message  ? 
  //  (<AlertDiv socialType={Message?.loggedThrough} message={Message} setMessage={setMessage}  />)  : (null)
  //  }

  return (
    <div className='authentication-component box-shadow'>
      <div className='wrapper'>
          <img src={theme == 'light' ? (devchall_dark) : (devchall_light)  } alt="logo" />
          <div className="text-wrapper">
            <h2>Join thousands of learners from around the world</h2>
            <p className='inner'>Master web development by making real-life projects. There are multiple paths for you to choose</p>
          </div>
      </div> 
      <FormInput type='register' fullNameRef={fullNameRef} Message={Message} btnText={'Start coding now'} emailRef={emailRef} passwordRef={passwordRef}   onSubmit={onRegisterSubmit}/>
      <div className="social-btns">
        <span>or continue with these social profile</span>
        <SocialLoginBtns type="register" />
        <span className='hint-btn'>Already a member ? <Link to="/auth/signin" replace >Login</Link></span>

      </div>
  </div>
  )
}

export default Register
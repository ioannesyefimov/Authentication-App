import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthentication } from '../Authentication/Authentication'
import SocialLoginBtns from '../Authentication/SocialLoginBtns/SocialLoginBtns'
import { Errors, validateInput } from '../utils/utils'
import { Link } from 'react-router-dom'
import './AlertDiv.scss'

const AlertDiv = ({message, success, setMessage}) => {


  const {authenticationErrors, logout} = useAuthentication()
  const [isClicked,setIsClicked] = React.useState(false)
  const navigate = useNavigate()


  const registerManually = (email, pw, emailRef,pwRef) => {
    if(email && pw){
      let registerData = {email,pw, emailRef, pwRef}
      setCookie('registerData', registerData, {path:'/auth/register'})
      logout()
      navigate('/auth/register')
    }
  }
  const continueThroughSocial = () =>{
    return setIsClicked(isClicked => !isClicked)
  }

  if(message ){
    return (
      <div className='alert-div-component'>
      <p className="alert-type">{message}</p>  
      <div className="wrapper">
     
        <button onClick={setMessage('')} className="alert-btn" type="button">Continue</button>
      </div>
  </div>
    )
  }

  if(message?.message == Errors.ALREADY_EXISTS || message.message === Errors.SIGNED_UP_DIFFERENTLY){
    return (
      <div className='alert-div-component'>
        {message?.loggedThrough === 'Internal' ? (
          <p className="alert-type">Such account has already been signed up</p>  

        ) : (

          <p className="alert-type">Such account has already been signed up through {message.loggedThrough}</p>  
        )}
          <span></span>
          <div className="wrapper">
          <button onClick={async()=>{
                await logout()
                navigate('/auth/register')
                }
                }
              className="alert-btn"
               type="button">
                Sign up new 
              </button>
            {message.loggedThrough === 'Internal' ? (
            <button 
              onClick={async() =>{ 
                await logout();
                navigate('/auth/signin') 
              }
              }
              className="alert-btn" 
              type="button">
                Sign in 
              </button>
            ) : (
              <button 
                onClick={async() =>{ 
                  await logout();
                  navigate('/auth/signin') 
                }
                }
                className="alert-btn" 
                type="button">
                  Sign in with {message?.loggedThrough}
              </button>
            )}
             
          </div>
            {isClicked ? (
              <div style={{margin:'0 auto'}}>
                <SocialLoginBtns url={`http://localhost:5050/api/auth/`} type={`signin`} social={message.loggedThrough}/>
              </div>
            ) : null}
            <button onClick={()=>setMessage('')} className='hide' >hide</button>
      </div>
    )
    
  }
  if(message?.message == Errors.NOT_SIGNED_UP || Errors.NOT_FOUND){
    return (
      <div className='alert-div-component'>
            <p className="alert-type">You have yet to sign up to our Application</p>  
            <span></span>
            <div className="wrapper">
              <button onClick={()=> {
                logout()
                navigate('/auth/register')
                
              }} className="alert-btn" type="button">Sign up new</button>
              <button onClick={logout} className="alert-btn" type="button">Sign in with different accont</button>
            </div>
        </div>
    )
  }

  
}

export default AlertDiv
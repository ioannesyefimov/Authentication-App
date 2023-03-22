import React from 'react'
import { useAuthentication } from '../Authentication/Authentication'
import SocialLoginBtns from '../Authentication/SocialLoginBtns/SocialLoginBtns'
import { Errors, isTrue,isObj, validateInput } from '../utils/utils'

import { Link, Outlet, useNavigate } from 'react-router-dom'
import './AlertDiv.scss'
const FuncComponent = ({message, onClc, btnText}) =>{
  return (
    <div className='alert-div-component'>
      <div className='alert-div-inner'>
      <span className="alertType">{message?.replaceAll('_', ' ')}</span>  
    <div className="wrapper">
        <button onClick={onClc} className="alert-btn" type="button">{btnText}</button>
    </div>
      </div>
</div>
  )
}

const AlertDiv = () => {
  const {logout,Message,setMessage,setLoading} = useAuthentication()
  const navigate = useNavigate()


  // const { logout} = useAuthentication()

  console.log(`Message: `,Message)
  switch(Message?.message){
    case Errors.CHANGES_APPLIED: return <FuncComponent message={Message?.message} onClc={()=>{setMessage({})}} btnText={'Continue'} />
    case Errors.CHANGES_NOT_APPLIED: return <FuncComponent message={Message?.message} onClc={()=>{setMessage({})}} btnText={'Continue'} />
    default: console.log(`NOT MATCHED SWITCH`)
  }


  if(!Message?.message){
    return <Outlet />
  }



  return (
    
      <div className='alert-div-component'>
        <div className="alert-div-inner">
        { Message?.message === Errors.JWT_MALFORMED  || Message?.message === Errors.JWT_EXPIRED ?
        (
        <>
           <p className="alert-type">You need to sign in again </p>  
            <div className="wrapper">
              <button onClick={()=>{logout('/auth/signin',navigate); }} className="alert-btn" type="button">Sign in </button>
            </div>
         </>
        ) : Message?.message === Errors.CHANGES_APPLIED || Message?.message === Errors.CHANGES_NOT_APPLIED ? (
          <FuncComponent message={Message?.message} onClc={()=>{setMessage({})}} btnText={'Continue'} />
        )  : Message?.message == 'UNAVAIBLE' ? (
          <>
           <p className="alert-type">{Message?.message.replaceAll('_', ' '.toLocaleLowerCase())} </p>  
            <div className="wrapper">
              <button onClick={()=>{setMessage({})}} className="alert-btn" type="button">Pick another </button>
            </div>
         </>
        )
         :
          (Message?.message == Errors.ALREADY_EXISTS || Message?.message === Errors.SIGNED_UP_DIFFERENTLY) ? 
        (
        <>
          {Message?.loggedThrough === 'Internal' ? (
          <p className="alert-type">Such account has already been signed up</p>  
          ) : (
            <p className="alert-type">Such account has already been signed up through {Message?.loggedThrough}</p>  
          )}
          <div className="wrapper">
            <button onClick={()=>logout()} 
            className="alert-btn" type="button"
            >
                Sign up new 
              </button>
            <button 
              onClick={() => logout(`/auth/signin`,navigate) }
              className="alert-btn" 
              type="button">
                Sign in 
              </button>
          </div>
        </>
        ) : 
         Message?.message == Errors.NOT_SIGNED_UP ||  Message?.message == Errors.NOT_FOUND ?
        (
          <>
            <p className="alert-type">You have yet to sign up to our Application</p>  
            <div className="wrapper">
              <button onClick={()=> {logout(`/auth/register`,navigate)}} 
              className="alert-btn" type="button">
                Sign up new
              </button>
              <button onClick={()=>logout()} className="alert-btn" type="button">Sign in with different accont</button>
            </div>
          </>
        ) :    (
          <>
          <>
           { isObj(Message?.message) ? (
             Object.keys(Message?.message).map((key,value)=>{
               console.log(`${key}: ${Message?.message[key]}`)
               return(
                <div  key={key[value]} className='errors-wrapper'>
                <strong>{key}:</strong>
                <span className='errorType'> {Message?.message[key]?.replaceAll('_', ' ').toLocaleLowerCase()}</span>
                </div>
               )
              }
              )
           ) : (<span className="errorType">{JSON.stringify(Message?.message)}</span>)
            }
           </>
            <div className="wrapper">
            
              <button onClick={()=> {setMessage({}) ;setLoading(false)}} 
              className="alert-btn" type="button">
                Continue
              </button>
            </div>
         </>
        )
      }
        </div>
      
    </div>
  )

  }
export default AlertDiv
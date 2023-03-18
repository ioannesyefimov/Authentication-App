import React from 'react'
import { useAuthentication } from '../Authentication/Authentication'
import SocialLoginBtns from '../Authentication/SocialLoginBtns/SocialLoginBtns'
import { Errors, isTrue,isObj, validateInput } from '../utils/utils'

import { Link } from 'react-router-dom'
import './AlertDiv.scss'
const FuncComponent = ({message, onClc, btnText}) =>{
  return (
    <div className='alert-div-component'>
      <p className="alert-type">{message?.replaceAll('_', ' ')}</p>  
    <div className="wrapper">
        <button onClick={onClc} className="alert-btn" type="button">{btnText}</button>
    </div>
</div>
  )
}

const AlertDiv = () => {
  const {User,logout,Message,setMessage, Loading,setLoading} = useAuthentication()


  // const { logout} = useAuthentication()
  const [isClicked,setIsClicked] = React.useState(false)

  
  switch(Message?.message){
    case Errors.CHANGES_APPLIED: return <FuncComponent message={Message?.message} onClc={()=>{setMessage({})}} btnText={'Continue'} />
    case Errors.CHANGES_NOT_APPLIED: return <FuncComponent message={Message?.message} onClc={()=>{setMessage({})}} btnText={'Continue'} />
    default: console.log(`NOT MATCHED SWITCH`)
  }



  return (
     isObj(Message?.message) ? (
        console.log(`${Message} is Object`)
      ) : (
      <div className='alert-div-component'>
      { Message?.message === Errors.JWT_MALFORMED  || Message?.message === Errors.JWT_EXPIRED ?
        (
        <>
           <p className="alert-type">You need to sign in again </p>  
            <div className="wrapper">
              <button onClick={()=>{logout('/auth/signin'); }} className="alert-btn" type="button">Sign in </button>
            </div>
         </>
        ) :
          (Message?.message == Errors.ALREADY_EXISTS || Message?.message === Errors.SIGNED_UP_DIFFERENTLY) ? 
        (
        <>
          {Message?.loggedThrough === 'Internal' ? (
          <p className="alert-type">Such account has already been signed up</p>  
          ) : (
            <p className="alert-type">Such account has already been signed up through {Message?.loggedThrough}</p>  
          )}
          <div className="wrapper">
            <button onClick={async()=>{await logout(`/auth/register`); }} 
            className="alert-btn" type="button"
            >
                Sign up new 
              </button>
            {Message?.loggedThrough === 'Internal' ? (
            <button 
              onClick={async() =>{ await logout(`/auth/signin`) }}
              className="alert-btn" 
              type="button">
                Sign in 
              </button>
            ) : (
              <button 
                onClick={async() =>setIsClicked(true)}
                className="alert-btn" 
                type="button">
                  Sign in with {Message?.loggedThrough}
              </button>
            )}
          </div>
            {isClicked ? (
              <div className='social-wrapper' style={{margin:'0 auto'}}>
                <SocialLoginBtns  type={`signin`} loggedThroughBtn={{social: Message?.loggedThrough}}/>
              </div>
            ) : null}
            <button onClick={()=>setMessage({})} className='hide' >hide</button>
        </>
        ) : 
         Message?.message == Errors.NOT_SIGNED_UP || Message?.message == Errors.NOT_FOUND ?
        (
          <>
            <p className="alert-type">You have yet to sign up to our Application</p>  
            <div className="wrapper">
              <button onClick={()=> {logout(`/auth/register`)}} 
              className="alert-btn" type="button">
                Sign up new
              </button>
              <button onClick={()=>logout('/auth/signin')} className="alert-btn" type="button">Sign in with different accont</button>
            </div>
          </>
        ) :  !isObj(Message?.message) ? (
          <>
            <p className="alert-type">{Message?.message}</p>  
            <div className="wrapper">
            
              <button onClick={()=> {setMessage({}) ;setLoading(false)}} 
              className="alert-btn" type="button">
                Continue
              </button>
            </div>
         </>
        ) : (console.log('NOT MATCHED'))
      }
    </div>
    ) 
  )

  }
export default AlertDiv
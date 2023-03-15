import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthentication } from '../Authentication/Authentication'
import SocialLoginBtns from '../Authentication/SocialLoginBtns/SocialLoginBtns'
import { Errors, validateInput } from '../utils/utils'
import { Link } from 'react-router-dom'
import './AlertDiv.scss'

const AlertDiv = ({message, success, setMessage}) => {


  const { logout} = useAuthentication()
  const [isClicked,setIsClicked] = React.useState(false)
  const navigate = useNavigate()

  let FuncComponent = ({message, onClc, btnText}) =>{
    return (
      <>
        <p className="alert-type">{message?.message.replaceAll('_', ' ')}</p>  
      <div className="wrapper">
          <button onClick={onClc} className="alert-btn" type="button">{btnText}</button>
      </div>
  </>
    )
  }
  
  switch(message?.message){
    case Errors.CHANGES_APPLIED: return <FuncComponent message={message} onClc={setMessage('')} btnText={'Continue'} />
    case Errors.CHANGES_NOT_APPLIED: return <FuncComponent message={message} onClc={setMessage('')} btnText={'Continue'} />
    case Errors.INVALID_EMAIL: return <FuncComponent message={message} onClc={setMessage('')} btnText={'Type in valid'} />
    case Errors.INVALID_PASSWORD: return <FuncComponent message={message} onClc={setMessage('')} btnText={'Type different'} />
    case Errors.INVALID_NUMBER: return <FuncComponent message={message} onClc={setMessage('')} btnText={'Type in valid'} />
    case Errors.PASSWORD_CONTAINS_NAME: return <FuncComponent message={message} onClc={setMessage('')} btnText={'Type different'} />
    case Errors.CANNOT_CONTAIN_NUMBERS: return <FuncComponent message={message} onClc={setMessage('')} btnText={'Type different'} />
    default: console.log(`NOT MATCHED SWITCH`)
  }
  return (
    <div className='alert-div-component'>
      { message?.message?.includes('jwt') ?
        (
        <>
           <p className="alert-type">You need to sign in again </p>  
            <div className="wrapper">
              <button onClick={()=>{logout(); navigate('/auth/signin')}} className="alert-btn" type="button">Sign in </button>
            </div>
         </>
        ) :
        message?.message == Errors.ALREADY_EXISTS || message?.message === Errors.SIGNED_UP_DIFFERENTLY ? 
        (
        <>
          {message?.loggedThrough === 'Internal' ? (
          <p className="alert-type">Such account has already been signed up</p>  
        ) : (
          <p className="alert-type">Such account has already been signed up through {message?.loggedThrough}</p>  
        )}
          <div className="wrapper">
            <button onClick={async()=>{await logout(); navigate('/auth/register')}} 
            className="alert-btn" type="button"
            >
                Sign up new 
              </button>
            {message?.loggedThrough === 'Internal' ? (
            <button 
              onClick={async() =>{ await logout(); navigate('/auth/signin')}}
              className="alert-btn" 
              type="button">
                Sign in 
              </button>
            ) : (
              <button 
                onClick={async() =>setIsClicked(true)}
                className="alert-btn" 
                type="button">
                  Sign in with {message?.loggedThrough}
              </button>
            )}
          </div>
            {isClicked ? (
              <div className='social-wrapper' style={{margin:'0 auto'}}>
                <SocialLoginBtns  type={`signin`} loggedThroughBtn={{social: message?.loggedThrough}}/>
              </div>
            ) : null}
            <button onClick={()=>setMessage('')} className='hide' >hide</button>
        </>
        ) : 
        message?.message == (Errors.NOT_SIGNED_UP || Errors.NOT_FOUND) ?
        (
          <>
            <p className="alert-type">You have yet to sign up to our Application</p>  
            <div className="wrapper">
              <button onClick={()=> {logout();navigate('/auth/register')}} 
              className="alert-btn" type="button">
                Sign up new
              </button>
              <button onClick={logout} className="alert-btn" type="button">Sign in with different accont</button>
            </div>
          </>
        ) : (null)
      }
    </div>
  )


  }
export default AlertDiv
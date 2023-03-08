import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthentication } from '../Authentication/Authentication'
import SocialLoginBtns from '../Authentication/SocialLoginBtns'
import { Errors, validateInput } from '../utils/utils'
import { Link } from 'react-router-dom'
import './AlertDiv.scss'

const AlertDiv = ({error, socialType, setError, email,pw,}) => {


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

  // if(error?.message == Errors.SIGNED_UP_DIFFERENTLY){
  //   return (
  //     <div className='alert-div-component'>
  //       {error.loggedThrough == 'Internal' ? (
  //         <>
  //         <p className="error-type">Such account already exists</p>
  //         <div className="wrapper">
  //           <button onClick={()=>{
  //             logout()
  //             navigate('/auth/register')
              
  //           }}>Register new?</button>
  //           <button onClick={()=>{
  //             logout()
  //             navigate('/auth/signin')
  //             }}>Sign in </button>
  //         </div>
  //         </>
  //       ) : (
  //         <>
  //         <p className="error-type">Such account has already been signed through {error.loggedThrough} </p>
  //         <div className="wrapper">
  //         <button onClick={()=>{
  //           logout()
  //           navigate('/auth/register')
            
  //         }}>Register new?</button>
  //         <button onClick={()=>{
  //           logout()
  //           navigate('/auth/signin')
  //           }}>Sign in with {error.loggedThrough}</button>
  //       </div>
  //         </>
  //       )}
            
        
         
  //     </div>
  //   )
  // }

  if(error?.message == Errors.ALREADY_EXISTS || error.message === Errors.SIGNED_UP_DIFFERENTLY){
    return (
      <div className='alert-div-component'>
        {error?.loggedThrough === 'Internal' ? (
          <p className="error-type">Such account has already been signed up</p>  

        ) : (

          <p className="error-type">Such account has already been signed up through {error.loggedThrough}</p>  
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
            {error.loggedThrough === 'Internal' ? (
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
                  Sign in with {error?.loggedThrough}
              </button>
            )}
             
          </div>
            {isClicked ? (
              <div style={{margin:'0 auto'}}>
                <SocialLoginBtns url={`http://localhost:5050/api/auth/`} type={`signin`} social={error.loggedThrough}/>
              </div>
            ) : null}
            <button onClick={()=>setError('')} className='hide' >hide</button>
      </div>
    )
    
  }
  if(error?.message == Errors.NOT_SIGNED_UP){
    return (
      <div className='alert-div-component'>
            <p className="error-type">You have yet to sign up to our Application</p>  
            <span></span>
            <div className="wrapper">
              <button onClick={()=> {
                logout()
                navigate('/auth/register')
                
              }} className="alert-btn" type="button">Sign up</button>
              <button onClick={logout} className="alert-btn" type="button">Sign in with different accont</button>
            </div>
        </div>
    )
  }

  
}

export default AlertDiv
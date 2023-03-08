import React, {useEffect} from 'react'
import './SocialLoginBtns.scss'
import { GoogleIco, facebookIco, TwitterIco, GithubIco } from '../../Assets'
import useFetch from './useFetch'
import { useAuthentication } from './Authentication'
import { Link } from 'react-router-dom'

const SocialLoginBtns = ({type,social}) => {
  const {setUser,setError} = useAuthentication()
  const {handleGoogleRegister,handleGoogleSignin, handleGitHub,handleFacebook,handleTwitter, Loading, Error,} = useFetch(
    type,setError
  )
  // const {handleGitHub} = useFetch()
    
  useEffect(() => {
    

    if(window.google){
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
        callback: type==="register" ? handleGoogleRegister : handleGoogleSignin ,
      })
      google.accounts.id.renderButton(document.getElementById('googleBtn'), {
        shape: "circle",
        type: "icon",
      })
    }
    // google.accounts.id.prompt()
    
  }, [type==='register' ? handleGoogleRegister : handleGoogleSignin])
  switch(social){
  
    case 'Github': return(
      <div className="social-btn-container">
      <img     src={GithubIco} alt="Github icon" />
      <button onClick={()=> handleGitHub(type)}  className="social-btn">
      </button>
     </div>
     )
    case 'Google': return(
      <div className="social-btn-container">
        <img src={GoogleIco} alt="google icon" />
       <button className="social-btn" id="googleBtn">
       </button>
     </div>
    )

    case 'Twitter': return(
      <div className="social-btn-container">
      <img  src  ={TwitterIco} alt="twitter icon" />
        <button  onClick={()=> handleTwitter(type)} className="social-btn"></button>
     </div>
    )
    case 'Facebook': return(
      <div className="social-btn-container">
         <img     src={facebookIco} alt="facebook icon"  />
        <button  onClick={()=> handleFacebook(type)} className="social-btn" id="facebookBtn">
        </button>
     </div>
    )
  }
    

  return (
    <div className="social-wrapper">
      <div className="social-btn-container" id='GG-btn'>
       <img src={GoogleIco} alt="google icon" />
       <button className="social-btn" id="googleBtn">
       </button>
      </div>
      <div className="social-btn-container">
          <img     src={facebookIco} alt="facebook icon"  />
        <button onClick={()=> handleFacebook(type)} className="social-btn" id="facebookBtn">
        </button>
      </div>
      <div className="social-btn-container">
        <img     src={TwitterIco} alt="twitter icon" />
        <button onClick={()=> handleTwitter(type)} className="social-btn">
        </button>
      </div>
      <div className="social-btn-container">
        <img     src={GithubIco} alt="Github icon" />
        <button onClick={()=> handleGitHub(type)} className="social-btn">
        </button>
      </div>
      <div className='hint'>
        {type === 'register' ? (
          <p>Already a member? <Link to="/auth/signin" replace>Login</Link></p>

        ) : (
          <p>Don't have an account yet? <Link to="/auth/register" replace>Register</Link></p>
        )}

      </div>


  </div>
  )
}

export default SocialLoginBtns
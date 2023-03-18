import React, {useEffect} from 'react'
import './SocialLoginBtns.scss'
import { GoogleIco, facebookIco, TwitterIco, GithubIco } from '../../../Assets'
import { useAuthentication } from '../Authentication'
import useGoogle from '../../hooks/useGoogle/useGoogle'
import useGithub from '../../hooks/useGithub/useGithub'
import useFacebook from '../../hooks/useFacebook/useFacebook'
import useTwitter from '../../hooks/useTwitter/useTwitter'
import SocialBtn from './SocialBtn'
import useFetch from '../../hooks/useFetch'

const SocialLoginBtns = ({type, loggedThroughBtn=null}) => {
  const {setUser, setRerender,setLoading, setError} = useAuthentication();
  const {handleTwitter,handleTwitterDelete} = useTwitter();
  const {handleFacebook,handleFacebookDelete} = useFacebook(); 
  const {handleGoogleDelete,handleGoogleRegister,handleGoogleSignin} = useGoogle();
  const {handleGitHub} = useGithub();
  const {handleDeleteSocial} = useFetch();
  
  const googleRef= React.createRef()
  const githubRef= React.createRef()
  const twitterRef= React.createRef()
  const facebookRef= React.createRef()

  useEffect(() => {
    console.log((loggedThroughBtn));
    console.log((type));
    console.log((loggedThroughBtn));
    console.log((type));
    if(window.google){
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
        callback: type==="register" ? handleGoogleRegister : type==="signin" ? handleGoogleSignin : type==="delete" ? handleGoogleDelete : null ,
      })
      google.accounts.id.renderButton(document.getElementById('googleBtn'), {
        shape: "circle",
        type: "icon",
      })
    }
   
    
  }, [type==='register' ?
   (handleGoogleRegister, handleGitHub, handleTwitter,handleFacebook)
    : type==="signin"?  (handleGoogleSignin,handleTwitter,handleFacebook,handleGitHub) 
    : type==="delete" ? (handleGoogleDelete, handleDeleteSocial) :null]
  )

  useEffect(
    () => {
      githubRef.current.focus()
      googleRef.current.focus()
      facebookRef.current.focus()
      twitterRef.current.focus()
      if(twitterRef || githubRef || facebookRef || googleRef == null) return console.log('something is null')
      switch(type){
        case 'delete':  {
          githubRef?.current.onclick = () => handleDeleteSocial({social: 'Github', type, functions: {handleGitHub}})
          twitterRef?.current.onclick = () => handleDeleteSocial({social: 'Twitter', type, functions: {handleTwitterDelete}})
          facebookRef?.current.onclick = () => handleDeleteSocial({social: 'Facebook', type, functions: {handleFacebookDelete}})
          break
        }
        case 'signin': 
          githubRef?.current.onclick = ()=> handleGitHub(type)
          twitterRef?.current.onclick = () => handleTwitter(type)
          facebookRef?.current.onclick = () => handleFacebook(type)
        case 'register': 
          githubRef?.current.onclick = ()=> handleGitHub(type)
          twitterRef?.current.onclick = () => handleTwitter(type)
          facebookRef?.current.onclick = () => handleFacebook(type)
          break
        
      }
    }, [googleRef,githubRef,twitterRef,facebookRef]
  )

  if(loggedThroughBtn?.social){
  if(loggedThroughBtn?.social){
    switch(loggedThroughBtn?.social){
      case 'Google':   return <SocialBtn ref={googleRef} icon={GoogleIco} socialType={`Google`} type={type} id={`googleBtn`} />
      case 'Github':   return <SocialBtn ref={githubRef} icon={GithubIco} socialType={`Github`} type={type} id={`githubBtn`}  />
      case 'Twitter':  return <SocialBtn ref={twitterRef} icon={TwitterIco} socialType={`Twitter`} type={type} id={`twitterBtn`}  />
      case 'Facebook': return <SocialBtn ref={facebookRef} icon={facebookIco} socialType={`Facebook`} type={type} id={`facebookBtn`}   />
    } 
   }
  }
  
  return (
    <div className='social-wrapper'>
      <SocialBtn icon={GoogleIco} socialType={`Google`} type={type} id={`googleBtn`} />
      <SocialBtn icon={facebookIco} socialType={`Facebook`} type={type} id={`facebookBtn`}   />
      <SocialBtn icon={TwitterIco} socialType={`Twitter`} type={type} id={`twitterBtn`}  />
      <SocialBtn icon={GithubIco} socialType={`Github`} type={type} id={`githubBtn`}  />
    </div>
  )
}

export default SocialLoginBtns
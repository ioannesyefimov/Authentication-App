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

const SocialLoginBtns = ({loginType, loggedThroughBtn=null}) => {
  const {setUser, setRerender,setLoading, setError} = useAuthentication();
  const {handleTwitter} = useTwitter(loginType);
  const {handleFacebook} = useFacebook(loginType); 
  const {handleGoogle} = useGoogle(loginType);
  const {handleGitHub} = useGithub(loginType);
  


  if(loggedThroughBtn?.social){
    switch(loggedThroughBtn?.social){
      case 'Google':   return <SocialBtn   icon={GoogleIco} socialType={`Google`} loginType={loginType} id={`googleBtn`} />
      case 'Github':   return <SocialBtn  execFunc={handleGitHub} icon={GithubIco} socialType={`Github`} loginType={loginType} id={`githubBtn`}  />
      case 'Twitter':  return <SocialBtn  execFunc={handleTwitter} icon={TwitterIco} socialType={`Twitter`} loginType={loginType} id={`twitterBtn`}  />
      case 'Facebook': return <SocialBtn  execFunc={handleFacebook} icon={facebookIco} socialType={`Facebook`} loginType={loginType} id={`facebookBtn`}   />
   }
  }
  
  return (
    <div className='social-wrapper'>
      <SocialBtn  icon={GoogleIco} socialType={`Google`} loginType={loginType} id={`googleBtn`} />
      <SocialBtn execFunc={handleFacebook} icon={facebookIco} socialType={`Facebook`} loginType={loginType} id={`facebookBtn`}   />
      <SocialBtn execFunc={handleTwitter} icon={TwitterIco} socialType={`Twitter`} type={loginType} id={`twitterBtn`}  />
      <SocialBtn execFunc={handleGitHub} icon={GithubIco} socialType={`Github`} loginType={loginType} id={`githubBtn`}  />
    </div>
  )
}

export default SocialLoginBtns
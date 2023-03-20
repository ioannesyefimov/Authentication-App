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
  const {handleTwitter} = useTwitter(type);
  const {handleFacebook} = useFacebook(type); 
  const {handleGoogle} = useGoogle(type);
  const {handleGitHub} = useGithub(type);
  


  if(loggedThroughBtn?.social){
    switch(loggedThroughBtn?.social){
      case 'Google':   return <SocialBtn  execFunc={handleGoogle} icon={GoogleIco} socialType={`Google`} type={type} id={`googleBtn`} />
      case 'Github':   return <SocialBtn  execFunc={handleGitHub} icon={GithubIco} socialType={`Github`} type={type} id={`githubBtn`}  />
      case 'Twitter':  return <SocialBtn  execFunc={handleTwitter} icon={TwitterIco} socialType={`Twitter`} type={type} id={`twitterBtn`}  />
      case 'Facebook': return <SocialBtn  execFunc={handleFacebook} icon={facebookIco} socialType={`Facebook`} type={type} id={`facebookBtn`}   />
   }
  }
  
  return (
    <div className='social-wrapper'>
      <SocialBtn execFunc={handleGoogle} icon={GoogleIco} socialType={`Google`} type={type} id={`googleBtn`} />
      <SocialBtn execFunc={handleFacebook} icon={facebookIco} socialType={`Facebook`} type={type} id={`facebookBtn`}   />
      <SocialBtn execFunc={handleTwitter} icon={TwitterIco} socialType={`Twitter`} type={type} id={`twitterBtn`}  />
      <SocialBtn execFunc={handleGitHub} icon={GithubIco} socialType={`Github`} type={type} id={`githubBtn`}  />
    </div>
  )
}

export default SocialLoginBtns
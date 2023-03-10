import React, {useEffect, useState} from 'react'
import { Outlet, useLocation, Navigate} from 'react-router-dom'
import { useAuthentication } from './Authentication'
import useFetch from '../hooks/useFetch'
import useGithub from '../hooks/useGithub/useGithub'
import { timeout } from '../utils/utils'
const ProtectedRoute =  () => {
    const {User,Loading, setUser,cookies,setLoading} =  useAuthentication();
    const { getUserData,checkQueryString,checkAccessToken} = useFetch();
    const {getGithubAccessToken, getUserDataGH,handleGithubRegister} = useGithub()
    const [isLogged, setIsLogged] = useState(false)
  
    useEffect(() => {
    console.log(`rerendered`);
      setLoading(true)
      let LOGIN_TYPE = localStorage.getItem('LOGIN_TYPE')
      let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')

      
      checkQueryString({LOGIN_TYPE, LOGGED_THROUGH, getGithubAccessToken})
      checkAccessToken({LOGIN_TYPE, LOGGED_THROUGH, accessToken: cookies.accessToken, getUserData, getUserDataGH,handleGithubRegister})
     
    }, [])
    useEffect(()=>{
      if(User?.fullName){
        setIsLogged(true)
        setLoading(false)
        
      }
    },[User])
    const location = useLocation()


    if(Loading){
      return <h1 className='loading'>Loading...</h1>
    }

    // return User?.fullName ? <Outline /> : <Navigate to='/auth/signin' replace/>
    
    if(isLogged && !Loading) {
      switch(location.pathname){
        case '/': return <Navigate to='/profile' replace />
        case '/profile': return <Outlet/>
        case '/profile/change': return <Outlet />
        case '/auth/register': return <Navigate to='/'  replace />
        case '/auth/signin': return <Navigate to='/'  replace />
      }
    } 
    if (isLogged && Loading ){
      if(location.search) return 
      switch(location.pathname){
          case '/': return <Navigate to='/auth/signin'  replace />
          case '/profile': return <Navigate to='/auth/signin'  replace />
          case '/profile/change': return <Navigate to='/auth/signin'  replace />
          case '/auth/register': return <Outlet/>
          case '/auth/signin': return <Outlet/>
          
      }
  }
     

}

export default ProtectedRoute
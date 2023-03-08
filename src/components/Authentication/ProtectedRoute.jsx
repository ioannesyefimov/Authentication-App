import React, {useEffect} from 'react'
import { Outlet, useLocation, Navigate} from 'react-router-dom'
import { useAuthentication } from './Authentication'
import useFetch from './useFetch'
import useGithub from './useGithub/useGithub'
const ProtectedRoute =  () => {
    const {User,Loading, setUser,cookies} =  useAuthentication();
    const { getUserData,checkQueryString,checkAccessToken} = useFetch();
    const {getGithubAccessToken, getUserDataGH,handleGithubRegister} = useGithub()

    
  
    useEffect(() => {
    console.log(`rerendered`);
    
      let LOGIN_TYPE = localStorage.getItem('LOGIN_TYPE')
      let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')

      
      checkQueryString({LOGIN_TYPE, LOGGED_THROUGH, getGithubAccessToken})
      checkAccessToken({LOGIN_TYPE, LOGGED_THROUGH, accessToken: cookies.accessToken, getUserData, getUserDataGH,handleGithubRegister})
    }, [])


    

    const location = useLocation()


      if(Loading){
        return <h1 className='loading'>Loading...</h1>
      }
      if(User?.fullName && !Loading) {
          switch(location.pathname){
            case '/': return <Navigate to='/home' replace />
            case '/home': return <Outlet/>
            case '/auth/register': return <Navigate to='/'  replace />
            case '/auth/signin': return <Navigate to='/'  replace />
          }
      } else if (!User?.fullName && !Loading){
          if(location.search) return 
          switch(location.pathname){
              case '/': return <Navigate to='/auth/signin'  replace />
              case '/home': return <Navigate to='/auth/signin'  replace />
              case '/auth/register': return <Outlet/>
              case '/auth/signin': return <Outlet/>
              
          }
      }

}

export default ProtectedRoute
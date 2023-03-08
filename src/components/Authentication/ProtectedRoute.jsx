import React, {useEffect} from 'react'
import { Outlet, useLocation, Navigate} from 'react-router-dom'
import { useAuthentication } from './Authentication'
import useFetch from './useFetch'
const ProtectedRoute =  () => {
    const {User, setUser,setError} =  useAuthentication()
    const {cookies, GHgetUserData, Loading, setLoading, getUserData} = useFetch()


    const location = useLocation()

    useEffect(
       ()=>{
  

      }, [])

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
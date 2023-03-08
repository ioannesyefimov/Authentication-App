import React, {useState, useEffect,useMemo} from 'react'
import Register from './Register/Register'
import SingIn from './SignIn/SingIn'
import useFetch from './useFetch'
import { Errors } from '../utils/utils'

import {Outlet, useLocation, Navigate} from 'react-router-dom'
import { useCookies } from 'react-cookie'
  

  
export const AuthContext = React.createContext()

export const useAuthentication = ()=>{
    return React.useContext(AuthContext)
}

export const AuthenticationProvider = ({children}) => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [Loading, setLoading] = useState(false)
    const [User, setUser] = useState({})
    const [Error, setError] = useState({})

    useEffect(()=>{
      const isLoggedUser = cookies.user
      if(isLoggedUser?.fullName ){
        setUser(isLoggedUser)
      } 
    },[cookies.user])

    const logout = () => {
      console.log('CLEARNING STATE')
      setUser({})
      setError({})
      removeCookie('accessToken', {path:'/'})
      removeCookie('refreshToken', {path:'/'})
      window.localStorage.clear()
      return removeCookie('user', {path:'/'})
      

    }


    
    const value = useMemo(
        () => ({
            User,cookies, Error, Loading, setLoading,setCookie,removeCookie,setError, setUser,logout
        }),
         [User,Error,cookies,Loading]
    )


    return (
        <AuthContext.Provider value={value}>
           {children}
        </AuthContext.Provider>
    )
}



const Authentication = () => {
  const {User, setUser} = useAuthentication() 
  const location = useLocation()

  




  return (
   <>
    <div className="authentication-component">
        <Outlet />
    </div>
    </>
  )
}

export default Authentication
import React, {useState, useEffect,useMemo} from 'react'

import {Outlet, useLocation} from 'react-router-dom'
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




export default AuthenticationProvider
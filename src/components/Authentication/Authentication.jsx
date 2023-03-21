import React, {useState, useEffect,useMemo, Suspense} from 'react'
import useFetch from '../hooks/useFetch'
import useGithub from '../hooks/useGithub/useGithub'
import {Navigate,Outlet, useLocation, useNavigate} from 'react-router-dom'
import { useCookies } from 'react-cookie'
import './Authentication.scss'

import { Fallback } from '../ErrorBoundary/ErrorBoundary'
import { Errors } from '../utils/utils'
import AlertDiv from '../AlertDiv/AlertDiv'
  
export const AuthContext = React.createContext()

export const useAuthentication = ()=>{
    return React.useContext(AuthContext)
}

export const AuthenticationProvider = ({children}) => {
    const [cookies, setCookie, removeCookie] = useCookies(['user','accessToken'])
    const [Loading, setLoading] = useState(false)
    const [User, setUser] = useState({})
    const [isLogged, setIsLogged] = useState(false)
    const [Message, setMessage] = useState('')

    useEffect(
      ()=>{
        const isLoggedUser = cookies.user
         if(isLoggedUser?.fullName ){
          console.log(`isLoggedUser: `, isLoggedUser)
           setUser(isLoggedUser)
           return setIsLogged(true)
         } 

      }, [cookies?.user]
    )

  


    const logout = (replace) => {
      console.log('CLEARNING STATE')
      setUser({})
      setIsLogged(false)
      setMessage({})
      removeCookie('accessToken', {path:'/'})
      removeCookie('refreshToken', {path:'/'})
      if(!replace){
        console.log(`not replacing`)
      }else {
        window.location.replace(replace)
      }
      window.localStorage.clear()
      removeCookie('user', {path:'/'})
      

    }


    
    const value = useMemo(
        () => ({
            User,cookies, isLogged, Message, Loading,setIsLogged, setLoading,setCookie,removeCookie,setMessage, setUser,logout
        }),
         [User,isLogged,Message,cookies,Loading]
    )


    return (
          <AuthContext.Provider value={value}>
            {children}
          </AuthContext.Provider>
      )
    
        
}

export const Authentication = ()=>{
  const {isLogged} = useAuthentication()
  const location = useLocation()

  if(window.location.search ) return <Fallback />
  
  if(!isLogged ){
    switch(location.pathname){
      case '/auth' : return <Navigate to="/auth/signin" replace />
      case '/auth/signin' : return <Outlet />;
      case '/auth/register' : return <Outlet />;
  
    }

  }
  if(isLogged) return <Navigate to="/profile" replace />

}




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
    const [Reload, setReload] = useState(0)
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
            User,cookies,Reload, isLogged, Message, Loading,setReload,setIsLogged, setLoading,setCookie,removeCookie,setMessage, setUser,logout
        }),
         [User,Reload,isLogged,Message,cookies,Loading]
    )


    return (
          <AuthContext.Provider value={value}>
            {children}
          </AuthContext.Provider>
      )
    
        
}

export const Authentication = ()=>{
  const {cookies,isLogged, Message,setMessage,setUser,setIsLogged, Loading,} = useAuthentication()
  // const { getUserData,checkQueryString,checkAccessToken} = useFetch();
  // const {getGithubAccessToken, getUserDataGH,handleGithubRegister} = useGithub()
  const location = useLocation()

  // useEffect(() => {
  //   let accessToken = cookies.accessToken
  //   console.log(`token: ${accessToken}`);
  //   console.log(`rerendered`);
  //   let LOGIN_TYPE = localStorage.getItem('LOGIN_TYPE')
  //   let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')
    
  //   if(!isLogged && !Message?.message ){
  //     console.log(`isn't logged`);
  //     checkQueryString({LOGIN_TYPE, LOGGED_THROUGH, getGithubAccessToken})
  //     if(accessToken == 'undefined' || accessToken == undefined) return console.log('accessToken is' , accessToken) 
  //     checkAccessToken({LOGIN_TYPE, LOGGED_THROUGH, accessToken, getUserData, getUserDataGH,handleGithubRegister})
  //   }

  // }, [cookies?.accessToken])



  if(window.location.search ) return <Fallback />
  if(!isLogged && !location?.pathname.includes('/auth')) return <Navigate to='/auth/signin' replace />
  if(!isLogged && location?.pathname?.includes('/auth') ) return <Outlet />
  if(isLogged) return <Navigate to="/profile" replace />
  
  

}




import React, {useState, useEffect,useLayoutEffect ,useMemo, Suspense} from 'react'
import {Navigate,Outlet, useLocation, useNavigate} from 'react-router-dom'
import { useCookies } from 'react-cookie'
import './Authentication.scss'
import { addPolicyScript, addPolicyScript2, addPolicyScript3 } from '../scripts/scripts'

import { Fallback } from '../ErrorBoundary/ErrorBoundary'
  
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
        // add sscripts
        const addScript = async(callback)=>{
          try {
            return await callback()
          } catch (error) {
            console.log(error)
          }
        }
        addScript(addPolicyScript3)
        addScript(addPolicyScript2)
        addScript(addPolicyScript)
      },[]
    )
  



    const logout = (replace, navigate) => {
      // console.log('CLEARNING STATE')
      setUser({})
      setIsLogged(false)
      setMessage({})
      removeCookie('accessToken', {path:'/'})
      removeCookie('refreshToken', {path:'/'})
      if(!replace){
        // console.log(`not replacing`)
      }else {
        // navigate(replace)
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

  if(window.location.search.length > 0) return <Fallback />
  
  if(!isLogged ){
    switch(location.pathname){
      case '/auth' : return <Navigate to="/auth/signin" replace />
      case '/auth/signin' : return <Outlet />;
      case '/auth/register' : return <Outlet />;
  
    }

  }
  if(isLogged) return <Navigate to="/profile" replace />

}




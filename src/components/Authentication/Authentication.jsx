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
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [Loading, setLoading] = useState(false)
    const [User, setUser] = useState({})
    const [isLogged, setIsLogged] = useState(false)
    const [Message, setMessage] = useState({})

    useEffect(()=>{
      const isLoggedUser = cookies.user

      if(isLoggedUser?.fullName ){
        setUser(isLoggedUser)
        setIsLogged(true)
      } 

    },[cookies.user])


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
            User,cookies,isLogged, Message, Loading,setIsLogged, setLoading,setCookie,removeCookie,setMessage, setUser,logout
        }),
         [User,isLogged,Message,cookies,Loading]
    )


    return (
          <AuthContext.Provider value={value}>
            {Loading ? <Fallback /> : children}
          </AuthContext.Provider>
      
      )
    
        
}

export const Authentication = ()=>{
  const {cookies,isLogged, Message,setMessage, Loading,} = useAuthentication()
  const { getUserData,checkQueryString,checkAccessToken} = useFetch();
  const {getGithubAccessToken, getUserDataGH,handleGithubRegister} = useGithub()
  const location = useLocation()

  useEffect(() => {
    console.log(`rerendered`);
    if(!isLogged && !Message?.message){
      let LOGIN_TYPE = localStorage.getItem('LOGIN_TYPE')
      let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')
      console.log(`isn't logged`);
      checkQueryString({LOGIN_TYPE, LOGGED_THROUGH, getGithubAccessToken})
      checkAccessToken({LOGIN_TYPE, LOGGED_THROUGH, accessToken: cookies?.accessToken, getUserData, getUserDataGH,handleGithubRegister})
    }

  }, [cookies?.accessToken])

    if(Message?.message) return <AlertDiv message={Message} setMessage={setMessage} />

  // if(Loading && !isLogged){
  //   return <h1 className='loading'>Loading...</h1>

  if(Loading) return <Fallback />
  if(!isLogged ) return <Outlet />
  if(isLogged) return <Navigate to="/profile" replace />
  // }
  
  

}




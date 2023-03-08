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

    const [User, setUser] = useState({})
    const [Error, setError] = useState({})

    const {cookies, getUserDataGH,getUserData,getGithubAccessToken, removeCookie} = useFetch('', setError)
    useEffect(() => {
      const isLoggedUser = cookies.user
      console.log(isLoggedUser)
      if(isLoggedUser?.fullName ){
        setUser(isLoggedUser)
      } 

    }, [cookies?.user])

    useEffect(() => {
    
      let LOGIN_TYPE = window.localStorage.getItem('LOGIN_TYPE')
      let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')
      const searchToken = async()=>{
        if(cookies.accessToken !== undefined && LOGGED_THROUGH !== null){
            console.log(`token changed`);
            console.log('searching token')
            console.log(cookies.accessToken)
            console.log(LOGGED_THROUGH)
              switch(LOGGED_THROUGH){
                case 'Github': return await getUserDataGH()
                case 'Google': return await getUserData(cookies.accessToken, LOGGED_THROUGH)
                case 'Internal': return await getUserData(cookies.accessToken, LOGGED_THROUGH)
                case 'Facebook': return await getUserData(cookies.accessToken, LOGGED_THROUGH)
                case 'Twitter': return await getUserData(cookies.accessToken, LOGGED_THROUGH)
                default: return console.log('not found')
              }
          } else {
            return console.log(`NOT_FOUND`)
          }

       }
      //  searchToken()
       
         

    }, [cookies?.accessToken])
    

    
    useEffect(() => {
      
      let LOGIN_TYPE = window.localStorage.getItem('LOGIN_TYPE')
      let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')
      const queryString = window.location.search

      const urlParams = new URLSearchParams(queryString)
      const codeParam = urlParams.get('code')

      return ()=>{
        if(codeParam && LOGGED_THROUGH == 'Github' ) {
          getGithubAccessToken(codeParam, LOGIN_TYPE)
          console.log(getGithubAccessToken)
        } 
      }
  
      }, [])
    
    const logout = () => {
      console.log(removeCookie)
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
            User,Error ,setError, setUser,logout
        }),
         [User,Error ]
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
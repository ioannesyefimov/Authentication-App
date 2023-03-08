import React, {useMemo, useState} from 'react'
import { useAuthentication } from './Authentication'
import { useCookies } from 'react-cookie';

import {Navigate } from 'react-router-dom';
import AlertDiv from '../AlertDiv/AlertDiv';
import { Errors } from '../utils/utils';
const useFetch = (type, setError,) => {
    const [Loading, setLoading] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const url = `http://localhost:5050/api/auth/`

    let newURL = location.href.split("?")[0];

    const handleGoogleSignin = async(response) =>{
        setLoading(true)
        response = await   fetch(`${url}signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({credential: response.credential, loggedThrough: 'Google'}),
            })
        
        const data = await response.json()

        if(!data?.success){
            setError({message: data.message, loggedThrough: data?.loggedThrough})
            return console.log(data?.message)

        }

        console.log(typeof data)
        if(data?.success){
            console.log(data)
            let dbResponse = data.data
          const userData = await fetch(`${url}user`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({accessToken: dbResponse.accessToken})
          })

          const userResponse = await userData.json()

          if(!userResponse.success){
            return setError({message:userResponse?.message, loggedThrough:userResponse?.loggedThrough})
          }
          if(userResponse?.data?.user){

              setCookie("accessToken", userResponse?.data?.accessToken,  {path: '/'});
              setCookie('user', userResponse?.data.user, {path:'/'})
          }
            localStorage.setItem('LOGGED_THROUGH', dbResponse?.loggedThrough)
            // setCookie('user', user, )
            console.log(`GETTING GOOGLE USER `)

            
        }
        setLoading(false)
    }

    const handleGoogleRegister = async (response) => {
        setLoading(true)
            response = await   fetch(`${url}google/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({credential: response.credential}),
            }
            )

        const data = await response.json()

        if(!data?.success && data?.message){
            console.log(data)
            return setError({message:data.message, loggedThrough: data?.loggedThrough})
        }

        console.log(data)
            let dbResponse = data.data
        
            setCookie('refreshToken', dbResponse?.refreshToken)
            
            setCookie("accessToken", dbResponse?.accessToken,  {path: '/'});
            localStorage.setItem('LOGGED_THROUGH', dbResponse?.loggedThrough)
            
        setLoading(false)

    }

   const getUserData= async(accessToken, loggedThrough) =>{

       const dbResponse = await fetch(`${url}signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            accessToken: accessToken,
            loggedThrough: loggedThrough
        }),
        })
        const response = await dbResponse.json()

        if(!response?.success && response.message){
            return setError({message:response.message, loggedThrough:response?.loggedThrough})
        }
        if(response?.data.user){

            const user = {
                fullName: response?.data.user.fullName,
                email: response?.data.user.email,
                picture: response?.data.user.picture,
            }

            console.log(response)
            localStorage.setItem('LOGGED_THROUGH', response?.loggedThrough)
            console.log(`GETTING USER `)
            setCookie('user',user , {path:'/'})
            window.localStorage.clear()
            removeCookie('accessToken', {path:'/'})
        }

   }
    const handleGitHub = (type) => {
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_APP_GITHUB_APP_ID}`)
        console.log('GHHH')
        window.localStorage.setItem('LOGGED_THROUGH', 'Github')
        window.localStorage.setItem('LOGIN_TYPE', type)
    }

    const handleGithubRegister = async(accessToken, type) => {
        console.log(accessToken)
        const registerUser = await fetch(`${url}github/register`, {
            method:"POST",
            headers: {
                "Content-Type": 'application/json' // Bearer ACCESSTOKEN
            },
            body: JSON.stringify({accessToken: accessToken})
        })
        const response = await registerUser.json()
        console.log(response)
        if(!response.success){
            return setError({message: response?.message, loggedThrough:response?.loggedThrough})
        }

        if(response.user){
            setCookie('user',response.user, {path:'/'})
            localStorage.clear()
        }
    
    
      
    }

    const getGithubAccessToken= async(codeParam,type) => {
        console.log(url)
        const accessTokenGH = await fetch(`${url}github/getAccessToken?code=${codeParam}`, {
            method: 'GET'
        })

        const responseGH = await accessTokenGH.json()
        if(!responseGH.success){
            setError({message: responseGH?.message})
        }
        await console.log(responseGH)
        setCookie('accessToken', responseGH.data.accessToken)
        console.log(type)
        window.history.pushState(null, document.title, newURL);

        window.location.replace(`auth/${type}`)

        setLoading(false)
    }
    const getUserDataGH = async()=>{

        await fetch(`${url}github/getUserToken`, {
          method: "GET",
          headers: {
            "Authorization": cookies?.accessTokenGH // Bearer ACCESSTOKEN
          }
        }).then(response=>{
          return response.json()
        }).then( data=>{
            let response = data.data
            if(data.message){
                console.log(data.message)
                console.log(data.loggedThrough)
                setError({message: data.message, loggedThrough: data.loggedThrough})
            
            }
            getUserData(response?.accessToken, 'Github')
            localStorage.clear()
            removeCookie('accessToken', {path:'/'})
           
        }).catch(err=>{
            return setError(err)
        })
    }

    const handleFacebook = () => {

    }

    const handleTwitter = ( ) => {

    }

    const value = useMemo(
        () => ({
            Loading, cookies, setLoading, setCookie,getUserData, 
            handleFacebook, handleTwitter, handleGoogleRegister, 
            handleGoogleSignin,handleGitHub,removeCookie,getGithubAccessToken,
            handleGithubRegister,getUserDataGH
        }), [Loading,cookies])

   

   return value
}

export default useFetch
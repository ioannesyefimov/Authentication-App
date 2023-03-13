import React from 'react'
import { useAuthentication } from '../../Authentication/Authentication';
import useFetch from '../useFetch';

const useGithub = () => {
    const {setCookie, cookies,setMessage, setLoading,setIsLogged} = useAuthentication()
    const {getUserData} = useFetch()
    const url = `http://localhost:5050/api/auth/`

    let newURL = location.href.split("?")[0];


    const handleGitHub = (type) => {
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_APP_GITHUB_APP_ID}`)
        console.log('GHHH')
        window.localStorage.setItem('LOGIN_TYPE', type)
        window.localStorage.setItem('LOGGED_THROUGH', 'Github')
    }

    const handleGithubRegister = async(accessToken, type) => {
        // console.log(accessToken)
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
            return setMessage({message: response?.message, loggedThrough:response?.loggedThrough})
        }
        setCookie('accessToken', response?.data?.accessToken, {path: '/', maxAge: '2000'})
        window.location.reload()


    
    
      
    }

    const getGithubAccessToken= async(codeParam,type) => {
        console.log(url)
        setLoading(true)
        const accessTokenGH = await fetch(`${url}github/getAccessToken?code=${codeParam}`, {
            method: 'GET'
        })

        const responseGH = await accessTokenGH.json()
        if(!responseGH.success){
            setMessage({message: responseGH?.message})
        }
         console.log(responseGH)
        setCookie('accessToken', responseGH.data.accessToken, {path: '/', maxAge: '2000'})
        console.log(type)
        window.history.pushState(null, document.title, newURL);

        // window.location.replace(`auth/${type}`)

        setLoading(false)
    }
    const getUserDataGH = async()=>{
        setLoading(true)

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
                setMessage({message: data.message, loggedThrough: data.loggedThrough})
            
            }
            getUserData(response?.accessToken, 'Github')
            localStorage.clear()
            // removeCookie('accessToken', {path:'/'})
            setLoading(false)
            setIsLogged(true)


           
        }).catch(err=>{
            return setMessage(err)
        })
    }
  
  
    return {handleGitHub,handleGithubRegister,getGithubAccessToken,getUserDataGH}
}

export default useGithub
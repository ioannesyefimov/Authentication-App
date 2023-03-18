import React from 'react'
import { useAuthentication } from '../../Authentication/Authentication';
import { APIFetch } from '../../utils/utils';
import useFetch from '../useFetch';

const useGithub = () => {
    const {logout, setCookie, cookies,setMessage, setLoading,setIsLogged} = useAuthentication()
    const {getUserData} = useFetch()
    const url = `http://localhost:5050/api/`

    let newURL = location.href.split("?")[0];
    newURL = '/auth/signin'


    const handleGitHub = (type) => {
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_APP_GITHUB_APP_ID}`)
        console.log('GHHH')
        console.log(`type: ${type}`);
        window.localStorage.setItem('LOGIN_TYPE', type)
        window.localStorage.setItem('LOGGED_THROUGH', 'Github')
    }

    const handleGithubRegister = async(accessToken) => {
        console.log(`GH REGISTERING`)
        const registerUser = await fetch(`${url}auth/github/register`, {
            method:"POST",
            headers: {
                "Content-Type": 'application/json' // Bearer ACCESSTOKEN
            },
            body: JSON.stringify({accessToken: accessToken})
        })
        const response = await registerUser.json()
        console.log(response)
        if(!response.success){
            logout(false)
            return setMessage({message: response?.message, loggedThrough:response?.loggedThrough})
        }
        setCookie('accessToken', response?.data?.accessToken, {path: '/', maxAge: '2000'})
        localStorage.setItem('LOGIN_TYPE', 'signin')
        // window.location.reload()
    }

    const handleGithubDelete = async({accessToken, user})=>{
        try {
            setLoading(true)
            let response = await APIFetch({
                url: `${url}change/delete`,
                method:'delete', 
                body:{accessToken, userEmail:user?.email}}
            );
            if(!response?.success)return setMessage({message:response?.message})

            logout('/auth/signin')
            
           
        } catch (error) {
            return setMessage({message: error})

        } finally{
            setLoading(false)
        }
    }
    
    const getGithubAccessToken= async(codeParam,type) => {
        console.log(`GH GETTING TOKEN`)

        console.log(url)
        try {
            setLoading(true)
            const accessTokenGH = await fetch(`${url}auth/github/getAccessToken?code=${codeParam}`, {
                method: 'GET',
                headers:{
                    "Content-Type": "application/json"
                }
              
            })
    
            const responseGH = await accessTokenGH.json()
            if(!responseGH.success){
                setMessage({message: responseGH?.message})
            }
             console.log(responseGH)
            setCookie('accessToken', responseGH.data.accessToken, {path: '/', maxAge: '2000'})
            // localStorage.setItem('LOGIN_TYPE','signin')
             window.history.pushState(null, document.title, newURL);
             window.location.reload()
        console.log(type)
        } catch (error) {
            // window.history.pushState(null, document.title, newURL);

            return setMessage({message: error})

        } finally{
            setLoading(false)
        }


        // window.location.replace(`auth/${type}`)

    }
    const getUserDataGH = async()=>{
        try {
            setLoading(true)
            console.log(`GH GETTING USER`)

            const responseToken = await fetch(`${url}auth/github/getUserToken`, {
                method: "GET",
                headers: {
                  "Authorization": cookies?.accessToken // Bearer ACCESSTOKEN
                }
            })

              let dbResponse = await responseToken.json();
              if(!dbResponse?.success && dbResponse.message){
                console.log(dbResponse.message)
                return setMessage({message: dbResponse.message, loggedThrough: dbResponse.loggedThrough})
                }
               await getUserData(dbResponse?.data?.accessToken, 'Github')
            localStorage.clear()
            // removeCookie('accessToken', {path:'/'})


        } catch (error) {
            console.log(error)
            return setMessage({message:error})

        } finally{
            setLoading(false)
        }

    }
  
  
    return {handleGithubDelete,handleGitHub,handleGithubRegister,getGithubAccessToken,getUserDataGH}
}

export default useGithub
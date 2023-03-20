import React from 'react'
import { useAuthentication } from '../../Authentication/Authentication';
import { APIFetch } from '../../utils/utils';
import useFetch from '../useFetch';

const useGithub = (type) => {
    const {logout, setCookie, cookies,setMessage, setLoading,setReload} = useAuthentication()
    const {getUserData,handleDelete} = useFetch()
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
        setReload(prev=>prev+1)

        localStorage.setItem('LOGIN_TYPE', 'signin')
        // window.location.reload()
    }

    const handleGithubDelete = async({accessToken, user})=>{
        console.log(`github deleting`)
        console.log(`github token:`, accessToken);
        try {
            const responseToken = await fetch(`${url}auth/github/getUserToken`, {
                method: "GET",
                headers: {
                  "Authorization": accessToken // Bearer ACCESSTOKEN
                }
            })

              let response = await responseToken.json();
              if(!response?.success ){
                console.log(response.message)
                return setMessage({message: response.message, loggedThrough: response.loggedThrough})
             }

             let  deleteUser =await handleDelete({accessToken: response?.data?.accessToken, user});
             if(!deleteUser?.success) return setMessage({message: deleteUser.message});
             

             logout('/auth/signin')
            
           
        } catch (error) {
            return setMessage({message: error})

        } finally{
            setLoading(false)
        }
    }
    
    const getGithubAccessToken= async(codeParam,type) => {
        try {
            console.log(`GH GETTING TOKEN`)
            setLoading(true)
            const accessTokenGH = await fetch(`${url}auth/github/getAccessToken?code=${codeParam}`, {
                method: 'GET',
                headers:{
                    "Content-Type": "application/json"
                }
              
            })
    
            const responseGH = await accessTokenGH.json()
            if(!responseGH.success){
                window.history.pushState(null, document.title, newURL);

               return setMessage({message: responseGH?.message})
            }
             console.log(responseGH)
            setCookie('accessToken', responseGH.data.accessToken, {path: '/', maxAge: '2000'})
            setReload(prev=>prev+1)
            // localStorage.setItem('LOGIN_TYPE','signin')
             window.history.pushState(null, document.title, newURL);
        console.log(type)
        } catch (error) {

            return setMessage({message: error})

        } finally{
            setLoading(false)
        }


        // window.location.replace(`auth/${type}`)

    }
    const getUserDataGH = async(accessToken)=>{
        try {
            console.log(`GH ACCESSTOKEN: ${accessToken}`)
            setLoading(true)
            console.log(`GH GETTING USER`)

            const responseToken = await fetch(`${url}auth/github/getUserToken`, {
                method: "GET",
                headers: {
                  "Authorization": accessToken // Bearer ACCESSTOKEN
                }
            })

              let dbResponse = await responseToken.json();
              if(!dbResponse?.success ){
                console.log(dbResponse.message)
                return setMessage({message: dbResponse.message, loggedThrough: dbResponse.loggedThrough})
                }
                localStorage.clear()
                await getUserData(dbResponse?.data?.accessToken, 'Github')
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
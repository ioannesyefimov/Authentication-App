import React from 'react'
import {  getUrlWithQueryParams } from '../../utils/utils';
import { useAuthentication } from '../../Authentication/Authentication';


const useTwitter = () => {
 
    const {setCookie,setMessage,setLoading} = useAuthentication()

    const url = `http://localhost:5050/api/auth/`

    const TWITTER_AUTH_URL = ``
    const TWITTER_SCOPE = ['tweet.read','users.read','offline.access'].join('')
    const TWITTER_STATE = `twitter-increaser-state`
    const TWITTER_CODE_CHALLENGE = `challenge`
    const redirectUri = 'https://authentic-app.netlify.app/auth/signin/profile'

    let newURL = location.href.split("?")[0];

    const handleTwitterDelete = async() =>{
        console.log('TWITTER DELETING')
    }

    const handleTwitterkRegister = async({credentials})=>{
        try {
            setLoading(true)
            console.log(`FB REGISTERING`)
            const response = await APIFetch({url: `${url}auth/facebook/register`, method:'POST', body: {credentials}});
            console.log(response)
            if(!response.success){
                logout(false)
                return setMessage({message: response?.message, loggedThrough:response?.loggedThrough})
            }
            
            setCookie('accessToken', response?.data?.accessToken, {path: '/', maxAge: '2000'})
            // setReload(prev=>prev+1)
            localStorage.setItem('LOGIN_TYPE', 'signin')
            // window.location.reload()

        } catch (error) {
            return setMessage({message: error})

        } finally {
            setLoading(false)
        }
    }

    const handleTwitterLogin = async({credentials,type}) =>{
        try {
            setLoading(true)
            console.log(`FB SIGNIN IN`)
            const response = await APIFetch({url: `${url}auth/facebook/${type}`, method:'POST', body: {credentials}});
            console.log(response)
            if(!response.success){
                logout(false)
                return setMessage({message: response?.message, loggedThrough:response?.loggedThrough})
            }
            
            setCookie('accessToken', response?.data?.accessToken, {path: '/', maxAge: '2000'})
            // setReload(prev=>prev+1)
            localStorage.setItem('LOGIN_TYPE', 'signin')
            // window.location.reload()

        } catch (error) {
            return setMessage({message: error})

        } finally {
            setLoading(false)
        }
    }


    const handleTwitter = (type) => {
        return setMessage({message: 'UNAVAIBLE'})
        // can't access developer account on twitter, so left it 
        getUrlWithQueryParams(TWITTER_AUTH_URL, {
            response_type:'code',
            client_id: import.meta.env.VITE_APP_TWITTER_CLIENT_ID,
            redirect_uri: redirectUri,
            scope:TWITTER_SCOPE,
            state: TWITTER_STATE,
            code_challenge: TWITTER_CODE_CHALLENGE,
            code_challenge_method: 'plain,'

        })
        console.log(type)


    }


 
    return {handleTwitter,handleTwitterDelete}
}

export default useTwitter
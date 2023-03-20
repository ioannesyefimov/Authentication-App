import React, { useEffect } from 'react'
import { useAuthentication } from '../../Authentication/Authentication';
import { addFacebookScript } from '../../Authentication/scripts/logins';
import { APIFetch, Errors } from '../../utils/utils';
import useFetch from '../useFetch';

const useFacebook = (type) => {
    const {setCookie,setLoading,setMessage,logout} = useAuthentication()
    const {handleDelete} = useFetch()
    useEffect(
        ()=>{
            const addScript = async()=>{
                try {
                    console.log(`appId:`,import.meta.env.VITE_APP_FACEBOOK_APP_ID);
                    await addFacebookScript();
                    const params = {
                        appId: import.meta.env.VITE_APP_FACEBOOK_APP_ID,
                        cookies: true,
                        xfbml: true,
                        version: 'v16.0'
                    }
                    FB.init(params);
                    FB.getLoginStatus(resp=>{
                        console.log(`FB:status: ${resp.status}`)
                    })
                } catch (error) {
                    console.log(error.name, ':', error.message)
                    
                }
            }
            addScript()
        }, []
    )

    const url = `http://localhost:5050/api/`

    let newURL = location.href.split("?")[0];

    const handleFacebookRegister = async({credentials})=>{
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

    const handleFacebookLogin = async({credentials,type}) =>{
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

    const onSuccess = async(response, type)=>{
        try {
            localStorage.setItem('LOGIN_TYPE', type)
            localStorage.setItem('LOGGED_THROUGH', 'Facebook')
            console.log('ONSUCCESS TRIGGERED')
            console.log(`response: `, response)
            if(response?.email){
                // return type === 'register' ? 
                // await handleFacebookRegister({credentials: response})
                // : type === 'signin' ? 
                // await handleFacebookSignin({credentials: response})
                return type === 'delete' ?
                await handleFacebookDelete({credentials: response})
                :  
                await handleFacebookLogin({credentials: response, type})

                console.log('invalid type')
            }
        } catch (error) {
            return setMessage({message:error})
        }
    }
    
    const handleFacebook = async(type) => {

        try {
            const params ={
                provider: 'facebook'
            }; 

            console.log(`FACEBOOK HANDLING`)
            FB.getLoginStatus((resp)=>{
                console.log(`FB:status: ${resp.status}`)
                if(resp.status === 'connected'){
                    params.fbAccessToken = resp.authResponse.accessToken 
                    FB.api('/me', response=>{
                        console.log(`successful login for: ${response?.name}`)
                        console.log(`RESPONSE:` ,response)

                        // params.credentials = response

                    });
                    // onSuccess(params?.credentials,'signin');
                    // onSuccess(params, this.props.currentUser)
                }
            });

          
                
            FB.login(resp=>{
                if(resp.authResponse){
                    params.fbAccessToken = resp.authResponse.accessToken
                    FB.api(
                        '/me',
                        'GET',
                        {"fields":"email,name,birthday,photos{picture,images,from},about,hometown,picture{url}"},
                        (response)=>{
                            console.log(response)
                            console.log(`GOOD to see you, ${response?.name}.`)
                            console.log(`type: ${type}`)
                            onSuccess(response, type)
                        });

                } else {
                    console.log('User cancelled login or did not fully authorize.');
                   }
            }, {scope: 'email,name,photos{picture,images,from'});
            console.log(params)

            
        } catch (error) {
            console.log(error)
            return {message:error,success:false}
        }
        


    }
    const handleFacebookDelete = async({credentials})=>{
        try {
            console.log(`credentials: `, credentials);
            if(!credentials) return setMessage({message:Errors.MISSING_ARGUMENTS})
            setLoading(true)
            const response = await APIFetch({url: `${url}auth/facebook/signin`, method:'POST', body: {credentials}});
            console.log(`deleting facebook`)
            console.log(response)
            if(!response.success){
                logout(false)
                return setMessage({message: response?.message, loggedThrough:response?.loggedThrough})
            }

         
            let  deleteUser =await handleDelete({accessToken: response?.data?.accessToken, user: credentials});
            if(!deleteUser?.success) return setMessage({message: deleteUser.message});

            logout('/auth/signin')
              
        } catch (error) {
            return setMessage({message: error})
        } finally{
            setLoading(false)
        }
    }


    return {handleFacebookDelete, handleFacebook,handleFacebookRegister}
}

export default useFacebook
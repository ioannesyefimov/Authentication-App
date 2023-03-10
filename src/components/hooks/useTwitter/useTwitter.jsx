import React from 'react'
import { assertEnvVar, getUrlWithQueryParams } from '../../utils/utils';
import { useAuthentication } from '../../Authentication/Authentication';


const useTwitter = () => {
 
    const {setCookie,setError,setLoading} = useAuthentication()

    const url = `http://localhost:5050/api/auth/`

    const TWITTER_AUTH_URL = ``
    const TWITTER_SCOPE = ['tweet.read','users.read','offline.access'].join('')
    const TWITTER_STATE = `twitter-increaser-state`
    const TWITTER_CODE_CHALLENGE = `challenge`

    let newURL = location.href.split("?")[0];

    const handleTwitter = ( redirectUri) => {
        getUrlWithQueryParams(TWITTER_AUTH_URL, {
            response_type:'code',
            client_id: assertEnvVar(`TWITTER_CLIENT_ID`),
            redirect_uri: redirectUri,
            scope:TWITTER_SCOPE,
            state: TWITTER_STATE,
            code_challenge: TWITTER_CODE_CHALLENGE,
            code_challenge_method: 'plain,'

        })

    }
 
    return {handleTwitter}
}

export default useTwitter
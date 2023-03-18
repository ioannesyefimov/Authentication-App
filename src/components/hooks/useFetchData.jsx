import React, { useEffect, useState } from 'react'
import { useAuthentication } from '../Authentication/Authentication'

const useFetchData = ({fetchConfig}) => {
    const {setLoading, setMessage} = useAuthentication()
    const [response,setResponse]=useState({})
    const [error,setError] = useState('')
    const [reload, setReload] = useState(0)
    const refetch = ()=> setReload(prev=>prev + 1)

    useEffect(
        ()=>{
            const controller = new AbortController();
            const signal = controller.signal;
            const fetchData = async(fetchConfig, data,method) => {
                try {
                    setLoading(true)
                    let FETCH;
        
                    if(fetchConfig?.method?.toLowerCase() !=='get'){
                        FETCH = await fetch(fetchConfig?.uri, {
                            method: fetchConfig?.method,
                            signal,
                            headears: fetchConfig?.headers,
                            body: JSON.stringify(fetchConfig?.body)
                        })
                        let response = await FETCH.json();
                         setResponse(response)
                    }
                    else if (fetchConfig?.method.toLowerCase() == 'get'){
                        FETCH = await fetch(fetchConfig?.uri, {
                            method: fetchConfig?.method,
                            signal,
                            headears: fetchConfig?.headers,
                        })
                        let response = await FETCH.json();
                        setResponse(response)
        
                    }
        
                    console.log(FETCH)
        
                } catch (error) {
                    console.log(error)
                    setError(error)            
                } finally {
                    setLoading(false)
                }
            }

            fetchData();

            return ()=> controller.abort()


            // eslint-disable-next-line
        },[reload]
    )

  return [response, error, refetch]
}

export default useFetchData
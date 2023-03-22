import React from 'react'
import {loadingGif} from '../../Assets/index'
export const Fallback = ()=> {

    return (
        <div style={{gap:'1rem',margin: '4rem auto',display:'grid', width: '60%', maxWidth: '500px'}}>
        <h1 style={{textAlign: 'center'}}>Loading...</h1>
        <img style={{margin: '0 auto', borderRadius: "15PX", maxWidth:'60%'}} className="box-shadow" src={loadingGif} alt="loading" />
        <button style={{borderRadius: "15PX", margin: '0 auto', padding: '.5rem 5rem' }} onClick={()=>window.location.reload()}>Reload</button>
    </div>
    )
}

export const ErrorFallBack = () => {
    return (
        <div style={{gap:'1rem',margin: '4rem auto',display:'grid', width: '60%', maxWidth: '500px'}}>
            <h1 style={{textAlign: 'center'}}>Something went wrong...</h1>
            <img style={{margin: '0 auto', borderRadius: "15PX", maxWidth:'60%'}} className="box-shadow" src={loadingGif} alt="loading" />
            <button style={{borderRadius: "15PX", margin: '0 auto', padding: '.5rem 5rem' }} onClick={()=>window.location.reload()}>Reload</button>
        </div>
    )
}
class ErrorBoundary extends React.Component {
    state = {hasError: false, error:null};

    static getDerivedStateFromError(error){
        return {
            hasError: true,
            error
        };
    };

    render(){
        if(this.state.hasError){
            return this.props.fallback;
        }
        return this.props.children
    }
}

export default ErrorBoundary
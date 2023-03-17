import React from 'react'
import {loadingGif} from '../../Assets/index'
export const Fallback = ()=> {

    return (
        <div style={{margin: '4rem auto', width: '50%'}}>
        <h1 style={{textAlign: 'center'}}>Loading...</h1>
        <img style={{margin: '0 auto', borderRadius: "15PX", }} className="box-shadow" src={loadingGif} alt="loading" />
        <button style={{margin: '0 auto', borderRadius: "15PX", }} onClick={()=>window.location.reload()}>Reload</button>
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
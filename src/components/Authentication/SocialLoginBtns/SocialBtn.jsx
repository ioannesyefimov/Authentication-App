import React from 'react'

const SocialBtn = ({icon, socialType,type, id, execFunc}) => {
  return (
    <div className="social-btn-container" >
        <img src={icon} alt={`${socialType} icon`} />
        <button onClick={()=>{execFunc(type)}} className="social-btn" id={id}>
    </button>
   </div>
  )
}

export default SocialBtn
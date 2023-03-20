import React from 'react'

const SocialBtn =  ({type,id,execFunc,icon,socialType}) => {
  return (
    <div className="social-btn-container" >
        <img src={icon} alt={`${socialType} icon`} />
        <button onClick={()=> execFunc(type)}   className="social-btn" id={id}>
    </button>
   </div>
  )
}

export default SocialBtn
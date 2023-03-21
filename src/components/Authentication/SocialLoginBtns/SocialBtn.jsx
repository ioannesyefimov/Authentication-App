import React, { useEffect } from 'react'
import useGoogle from '../../hooks/useGoogle/useGoogle'

const SocialBtn =  ({loginType,id,execFunc,icon,socialType}) => {

  return (
    <div className="social-btn-container" >
        <img src={icon} alt={`${socialType} icon`} />
          <button onClick={()=> execFunc(loginType)}   className="social-btn" id={id}> </button>
   </div>
  )
}

export default SocialBtn
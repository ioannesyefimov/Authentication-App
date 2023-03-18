import React from 'react'

const SocialBtn = React.forwardRef ((props, ref) => {
  return (
    <div className="social-btn-container" >
        <img src={props?.icon} alt={`${props?.socialType} icon`} />
        <button ref={ref}  className="social-btn" id={props?.id}>
    </button>
   </div>
  )
})

export default SocialBtn
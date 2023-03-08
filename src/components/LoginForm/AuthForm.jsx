import React from 'react'
import { mailIco, lockerIco, profileIco} from '../../Assets'
import { Errors } from '../utils/utils'
import './AuthForm.scss'
const AuthForm = ({Error, emailRef, passwordRef, fullNameRef,  btnText, onSubmit, type=null}) => {

        return (
          <form action='submit' className="login-form">
            <div className='form-inner'>
              {type === 'register' ? (

                <div className="form-wrapper">
                <img src={profileIco} alt="profile icon" />
                <input type="text" name="fullname" placeholder='Full name' id="" ref={fullNameRef} />
                {Error?.message == (Errors.CANNOT_CONTAIN_NUMBERS) 
                ? (<div className='errorDiv'>don't use numbers here</div>) : (Error?.message ==(`${Errors.CANNOT_BE_EMPTY}NAME`)
                 ? (<div className='errorDiv'>Cannot be empty</div>) : (null))}
              </div>
              ) : (null)}
              <div className="form-wrapper">
                <img src={mailIco} alt="mail icon" />
                 <input placeholder="Email" type='email' name="email"  className='email-input' ref={emailRef}/>
                {Error?.message == (Errors.INVALID_EMAIL) ? (<div className='errorDiv'>{Errors.INVALID_EMAIL}</div>) :
                 (Error?.message == (Errors.EMAIL_EXIST)) ?
                   (<div className='errorDiv'>{Errors.EMAIL_EXIST}</div>) :
                    (Error?.message == (`${Errors.CANNOT_BE_EMPTY}EMAIL`)) ? (<div className='errorDiv'>Cannot be empty</div>) : (null)}
              </div>
              <div className="form-wrapper">
                <img src={lockerIco} alt="mail icon" />
                 <input placeholder="Password" type='password' name="password"  className='email-input' ref={passwordRef}/>
                {Error?.message == (Errors.WRONG_PASSWORD) ? (<div className='errorDiv'>{Errors.WRONG_PASSWORD}</div>) :
                 (Error?.message == (Errors.PASSWORD_CONTAINS_NAME)) ?
                   (<div className='errorDiv'>{Errors.PASSWORD_CONTAINS_NAME}</div>) :
                    (Error?.message == (`${Errors.CANNOT_BE_EMPTY}PW`)) ? (<div className='errorDiv'>Cannot be empty</div>) : (null)}
              </div>
            </div>
              <button className='submit-btn' onClick={(event)=> {
                onSubmit(event)
              }} type='submit'>{btnText}</button>
           </form>
        )

}

export default AuthForm
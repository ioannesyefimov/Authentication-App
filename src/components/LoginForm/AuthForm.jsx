import React from 'react'
import { mailIco, lockerIco, profileIco, questionIco} from '../../Assets'
import { Errors } from '../utils/utils'
import './AuthForm.scss'
const AuthForm = ({Message, emailRef,formRef, passwordRef, fullNameRef,  btnText, onSubmit, type=null}) => {

        return (
          <form action='submit' ref={formRef} className="login-form">
            <div className='form-inner'>
              {type === 'register' ? (

                <div className="form-wrapper">
                <img src={profileIco} alt="profile icon" />
                <input type="text" name="name" placeholder='Full name' id="" ref={fullNameRef} />
                {Message?.message?.name == (Errors.CANNOT_CONTAIN_NUMBERS) 
                ? (<div className='errorOuter'>
                  <div className='error-inner'>
                    <img src={questionIco} alt="hint icon" />
                    <div className='errorDiv'>don't use numbers here</div>
                  </div>
                  </div>): (Message?.message?.name == Errors.CANNOT_BE_EMPTY) ? 
                  (<div className='errorOuter'>
                  <div className='error-inner'>
                      <img src={questionIco} alt="hint icon" />
                    <div className='errorDiv'>Cannot be empty</div>
                  </div>
                  </div>) : (null)}
              </div>
              ) : (null)}
              <div className="form-wrapper">
                <img src={mailIco} alt="mail icon" />
                 <input placeholder="Email" type='email' name="email"  className='email-input' ref={emailRef}/>
                {Message?.message?.email == Errors.INVALID_EMAIL ? (
                <div className='errorOuter'>
                  <div className='error-inner'>
                    <img src={questionIco} alt="hint icon" />
                    <div className='errorDiv'>{Errors.INVALID_EMAIL}</div>
                  </div>
                  </div> ) :
                 (Message?.message == (Errors.EMAIL_EXIST)) ?
                   (<div className='errorOuter'>
                  <div className='error-inner'>
                      <img src={questionIco} alt="hint icon" />
                      <div className='errorDiv'>{Errors.EMAIL_EXIST}</div>
                  </div>
                    </div> ):
                  Message?.message?.email == (Errors.CANNOT_BE_EMPTY) ? (
                  <div className='errorOuter'>
                    <div className='error-inner'>
                      <img src={questionIco} alt="hint icon" />
                      <div className='errorDiv'>Cannot be empty</div>
                    </div>
                    </div>) : (null)
                  }
              </div>
              <div className="form-wrapper">
                <img src={lockerIco} alt="mail icon" />
                 <input placeholder="Password" type='password' name="password"  className='email-input' ref={passwordRef}/>
                {Message?.message?.password == (Errors.WRONG_PASSWORD) ? (
                <div className='errorOuter'>
                  <div className='error-inner'>
                    <img src={questionIco} alt="hint icon" />
                    <div className='errorDiv'>{Errors.WRONG_PASSWORD}</div>
                  </div>
                  </div> ):
                 (Message?.message?.password == (Errors.PASSWORD_CONTAINS_NAME)) ?
                   (<div className='errorOuter'>
                  <div className='error-inner'>
                      <img src={questionIco} alt="hint icon" />
                      <div className='errorDiv'>{Errors.PASSWORD_CONTAINS_NAME}</div>
                  </div>
                    </div>) :
                    Message?.message?.password == (Errors.CANNOT_BE_EMPTY) ? (<div className='errorOuter'>
                  <div className='error-inner'>
                        <img src={questionIco} alt="hint icon" />
                        <div className='errorDiv'>Cannot be empty</div>
                  </div>
                      </div>) : 
                    Message?.message?.password == (Errors.INVALID_PASSWORD) ? (
                    <div className='errorOuter'  >
                      <div className='error-inner'>
                        <img src={questionIco} alt="hint icon" />
                        <div className='errorDiv'>{Errors.INVALID_PASSWORD}</div>
                      </div>
                    </div> ):  (null)
                  } 
              </div>
            </div>
              <button className='submit-btn' onClick={(event)=> {
                onSubmit(event)
              }} type='submit'>{btnText}</button>
           </form>
        )

}

export default AuthForm
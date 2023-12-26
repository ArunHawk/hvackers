import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton, TextField, initializeIcons } from '@fluentui/react';
import styles from "./Login.module.css"
import left from "./assets/login-bg.svg"
import logo from "./logo.svg"
import { useSearchParams } from 'react-router-dom';

// Integration
import {axiosPrivateCall } from './constants'


const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passRegex = /[A-Za-zÀ-ÖØ-öø-ÿ0-9~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/)]/;
const loginIcon = { iconName: 'Contact' };



function Reset() {

    initializeIcons();
    
    const navigateTo = useNavigate();
    const sentIcon = { iconName: 'Accept'};
    const [searchParams, setSearchParams] = useSearchParams();
    const [password ,setPassword] = useState(null);
    const [confirm_password, setConfirmPassword] = useState('');
    const [loginError,setLoginError] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const [errors,setErrors] = useState({
       password:''
    });

    const [isMatch, setMatch] = useState(false);

    localStorage.setItem('token',searchParams.get("token"))

    const inputChangeHandler =(e,name,setData)=>{

      const {value} = e.target
      let inputValue = value
  
      let isNameValid = false
  
      if(name==='password'){
        
        if(inputValue.length > 64) inputValue = inputValue.slice(0,64)
        isNameValid= true	
        setErrors({...errors , password: ''})
      }
  
      if(name==='confirm_password'){
        if(inputValue.length > 64) inputValue = inputValue.slice(0,64)
        isNameValid= true
      }
      
      if(isNameValid){
        setData(inputValue)
      }

    };


    function checkMatch () {
      if (password === confirm_password && password && confirm_password)
      {
        setMatch('Confirmed!')
      } else {
        setMatch('')
      }
    }

    const resetHandler = () =>{
      console.log('triggered')
      if (isMatch)
      {
        let userData = {new_password: password,};

        if(isPassValid(password)){
            axiosPrivateCall.post('/api/v1/employee/resetPassword',userData).then(res=>{
              localStorage.removeItem('token');
              navigateTo('/login')
            }).catch( e =>{
              setErrors({...errors, password: 'Password Reset Failed'})
            })
        } 
      }

    }
      


    const submitHandler = (data) =>{

      const errorObj ={};

      if(isPassValid(data) ){
        errorObj.password = ''
      } 

      return errorObj

    }

    useEffect(() => {checkMatch();}, [confirm_password, password])

    

    const isPassValid =(value)=>{

      if(value?.length===0){
        setErrors((prevState)=>{
          return{
            ...prevState,
            password: "Required"
          }
        })
        return false;
      }
      if(value.length <8 || value.length >64 ){
        setErrors((prevState)=>{
          return{
            ...prevState,
            password: "Invalid Password"
          }
        })
        return false;

      }

      if(!value.match(passRegex)){
        setErrors((prevState)=>{
          return{
            ...prevState,
            password: "Invalid Password"
          }
        })
        return false;

      }

      return true;

    }

  return (
    <>
      <div className={styles.container}>

        <div className={styles.hero_container}>
            <img src={left} className={styles.hero_img}/>
        </div>

        <div className={styles.login_container}>
          {isLogin ? <div className={styles.login_container}>
            <div className={styles.logo}><img src={logo}/></div>
            <div className={styles.title}>Set New Password</div>
            <div className={styles.description}>Your new password must be different to previously used password. </div>

            <div>

              <div className={styles.input_container}>

                <TextField 
                        styles={errors.password ? passFieldError : passField}  
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        canRevealPassword
                        revealPasswordAriaLabel="Show password"
                        onChange={(e)=>{inputChangeHandler(e,'password',setPassword)}} 
                        value={password}
                    />

                <div className={styles.error}>{errors.password ? <div>{errors.password}</div> : null}</div>

                <TextField 
                    styles={(isMatch && !errors.password) ? passFieldMatch : passField}  
                    type="password" 
                    name="confirm_password" 
                    placeholder="Confirm Password" 
                    canRevealPassword
                    revealPasswordAriaLabel="Show password"
                    onChange={(e)=>{inputChangeHandler(e,'password',setConfirmPassword); isPassValid(password);}} 
                    value={confirm_password}
                />

              <div className={styles.error2}>{(isMatch && !errors.password) ? <div>{isMatch}</div> : null}</div>

              </div>
                
            </div>

            <PrimaryButton text="Reset Password" onClick={() => resetHandler()} className={styles.login_button}/>
            <div className={styles.back} onClick={() => navigateTo('/login')}>Back to Login</div>
          </div> : null}

        </div>
      </div>      
    </>
  );
}

//Css Over-Rides as per documentaions in Fluent UI



function passField(props) {
  return ({fieldGroup: [{borderColor: 'grey'},],
  revealButton:[{backgroundColor: 'transparent', color:'grey', "&:hover": {backgroundColor: 'transparent',color:'grey',}}],})
}

function passFieldError(props) {
  return ({fieldGroup: [{borderColor: '#a80000'},],
  revealButton:[{backgroundColor: 'transparent', color:'grey', "&:hover": {backgroundColor: 'transparent',color:'grey',}}],})
}

function passFieldMatch(props) {
  return ({fieldGroup: [{borderColor: 'green'},],
  revealButton:[{backgroundColor: 'transparent', color:'grey', "&:hover": {backgroundColor: 'transparent',color:'grey',}}],})
}

export default Reset;
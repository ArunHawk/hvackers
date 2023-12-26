import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton, TextField, initializeIcons } from '@fluentui/react';
import styles from "./Login.module.css"
import left from "./assets/login-bg.svg"
import logo from "./logo.svg"

// Integration
import { axiosPublicCall } from './constants'


const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passRegex = /[A-Za-zÀ-ÖØ-öø-ÿ0-9~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/)]/;
const loginIcon = { iconName: 'Contact' };



function Login() {

  initializeIcons();

  const navigateTo = useNavigate();
  const sentIcon = { iconName: 'Accept' };

  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const [userData1, setUserData1] = useState({
    email: '',
  });

  const [loginError, setLoginError] = useState('');
  const [loginError1, setLoginError1] = useState('');

  const [isLogin, setIsLogin] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [errors1, setErrors1] = useState({
    email: '',
  });

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    let inputValue = value;

    // email validation with 320 characters

    if (name === 'email' && inputValue.length > 320) {
      inputValue = inputValue.slice(0, 320)
    }

    // password validation with 64 characters
    if (name === 'password' && inputValue.length > 64) {
      inputValue = inputValue.slice(0, 64)
    }

    setUserData({
      ...userData,
      [name]: inputValue,
    })

    setErrors({
      ...errors,
      [name]: ''
    })
    setLoginError('')
  }

  const resetInputChangeHandler = (e) => {
    const { name, value } = e.target;

    let inputValue = value;

    if (name === 'email' && inputValue.length > 320) {
      inputValue = inputValue.slice(0, 320)
    }

    setUserData1({
      ...userData,
      [name]: inputValue,
    })

    setErrors1({
      ...errors,
      [name]: ''
    })
    setLoginError1('')
  }


  // const loginHandler = () =>{
  //   const errorObj = submitHandler();

  //   setErrors((prevState)=>{
  //     return{
  //       ...prevState,
  //       ...errorObj
  //     }
  //   })


  //   if(isEmailValid(userData.email) && isPassValid(userData.password)){
  //        axiosPublicCall.post('/api/v1/employee/signIn',userData).then(res=>{
  //         localStorage.setItem('token',res?.data?.token)
  //         console.log(res.data,"backend")
  //         navigateTo('/dashboard')
  //        }).catch(e=>{

  //         setLoginError(e.response.data)
  //        })
  //   }
  // }
  const loginHandler = () => {
    const errorObj = submitHandler();

    setErrors((prevState) => ({
      ...prevState,
      ...errorObj
    }));

    if (isEmailValid(userData.email) && isPassValid(userData.password)) {
      axiosPublicCall.post('/api/v1/employee/signIn', userData)
        .then(res => {
          const token = res?.data?.token;
          const userRole = res?.data?.get_role;

          localStorage.setItem('token', token);

          if (userRole === 'bde') {
            navigateTo('/bdedashboard');
          } else {
            navigateTo('/dashboard');
          }
        })
        .catch(e => {
          setLoginError(e.response?.data);
        });
    }
  };


  const resetHandler = () => {
    const errorObj = resetSubmitHandler();

    setErrors1((prevState) => {
      return {
        ...prevState,
        ...errorObj
      }
    })


    if (isEmailValid(userData1.email)) {
      axiosPublicCall.post('/api/v1/employee/resetPasswordRequest', userData1).then(res => {
        if (res.status === 200) {
          setEmailSent(true);
        }
      }).catch(e => {
        setLoginError1('Email does not exist')
      })
    }
  }

  const submitHandler = () => {

    const errorObj = {};


    if (isEmailValid(userData.email)) {
      errorObj.email = ''
    }
    if (isPassValid(userData.password)) {
      errorObj.password = ''
    }

    return errorObj

  }

  const resetSubmitHandler = () => {

    const errorObj = {};

    if (isResetEmailValid(userData1.email)) {
      errorObj.email = ''
    }
    return errorObj

  }

  const isEmailValid = (value) => {

    if (value.length === 0) {
      setErrors((prevState) => {
        return {
          ...prevState,
          email: "Required"
        }
      })
      return false;
    }

    if (!String(value).toLowerCase().match(emailRegex)) {
      setErrors((prevState) => {
        return {
          ...prevState,
          email: "Invalid Email"
        }
      })

      return false;
    }

    return true;
  }

  const isPassValid = (value) => {

    if (value.length === 0) {
      setErrors((prevState) => {
        return {
          ...prevState,
          password: "Required"
        }
      })
      return false;
    }
    if (value.length < 8 || value.length > 64) {
      setErrors((prevState) => {
        return {
          ...prevState,
          password: "Invalid Password"
        }
      })
      return false;

    }

    if (!value.match(passRegex)) {
      setErrors((prevState) => {
        return {
          ...prevState,
          password: "Invalid Password"
        }
      })
      return false;

    }

    return true;

  }

  const isResetEmailValid = (value) => {

    if (value.length === 0) {
      setErrors1((prevState) => {
        return {
          ...prevState,
          email: "Required"
        }
      })
      return false;
    }

    if (!String(value).toLowerCase().match(emailRegex)) {
      setErrors1((prevState) => {
        return {
          ...prevState,
          email: "Invalid Email"
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
          <img src={left} className={styles.hero_img} />
        </div>

        <div className={styles.login_container}>
          {isLogin ? <div className={styles.login_container}>
            <div className={styles.logo}><img src={logo} /></div>
            <div className={styles.title}>Login</div>

            <div>

              <div className={styles.input_container}>

                <TextField iconProps={loginIcon}
                  styles={errors.email ? errorField : normalField}
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={inputChangeHandler}
                  value={userData.email}
                />

                <div className={styles.error}>{errors.email || loginError ? <div>{errors.email}</div> : null}</div>

                <TextField
                  styles={errors.password ? passFieldError : passField}
                  type="password"
                  name="password"
                  placeholder="Password"
                  canRevealPassword
                  revealPasswordAriaLabel="Show password"
                  onChange={inputChangeHandler}
                  value={userData.password}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      loginHandler();
                    }
                  }}
                />

                <div className={styles.error}>{errors.password || loginError ? <div>{errors.password || loginError}</div> : null}</div>

              </div>

              <div className={styles.reset} onClick={() => setIsLogin(false)}>Reset Password</div>
            </div>

            <PrimaryButton text="Log in" onClick={loginHandler} className={styles.login_button} />
          </div> : null}


          {!isLogin ? <div className={styles.login_container}>
            <div className={styles.logo}><img src={logo} /></div>
            <div className={styles.title}> {!emailSent ? 'Verify Your Identity' : 'Check Your Mail'}</div>

            <div>

              <div className={styles.input_container}>

                {!emailSent ? <TextField iconProps={loginIcon}
                  styles={errors1.email ? errorField : normalField}
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={resetInputChangeHandler}
                  value={userData1.email}
                /> : <div className={styles.resetEmail}>Check your email for a link to reset your password.</div>}

                <div className={styles.error}>{errors1.email || loginError1 ? <div>{errors1.email || loginError1}</div> : null}</div>

              </div>

            </div>

            {!emailSent ? <PrimaryButton text="Verify Email" onClick={resetHandler} className={styles.login_button} /> :
              <PrimaryButton text="Email Sent" className={styles.login_button1} />}
            <div className={styles.back} onClick={() => setIsLogin(true)} >Back to Login</div>
          </div> : null}
        </div>
      </div>
    </>
  );
}

//Css Over-Rides as per documentaions in Fluent UI

function normalField(props) {
  const { required } = props;
  return ({ fieldGroup: [{ borderColor: 'grey' }] })
}

function errorField(props) {
  const { required } = props;
  return ({ fieldGroup: [{ borderColor: '#a80000' },] })
}

function passField(props) {
  return ({
    fieldGroup: [{ borderColor: 'grey' },],
    revealButton: [{ backgroundColor: 'transparent', color: 'grey', "&:hover": { backgroundColor: 'transparent', color: 'grey', } }],
  })
}

function passFieldError(props) {
  return ({
    fieldGroup: [{ borderColor: '#a80000' },],
    revealButton: [{ backgroundColor: 'transparent', color: 'grey', "&:hover": { backgroundColor: 'transparent', color: 'grey', } }],
  })
}

export default Login;
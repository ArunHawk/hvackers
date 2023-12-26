import React, { useState } from 'react'
import './register.css'
import axios from 'axios';
const Register = () => {

    const [register,setRegister] = useState({
        uName:"",
        uEmail:"",
        uPassword:"",
        uphoneNumber:"",
    });

    const handleChange =(e)=>{
        const {name ,value} = e.target;
        setRegister(prev =>({
            ...prev,
            [name]:value
        }));
    }

    const handleSubmit =(e)=>{
        e.preventDefault()
        try{
            axios.post("http://localhost:8000/api/v1/signup",register).then((res)=>{
                console.log(res)
            })
        }catch(err){
            throw err;
        }
        console.log("values",register)
    }
  return (
    <div className="reContainer">
      <input type="text" placeholder="username" name="uName" value={register.uName}  onChange={handleChange}/>
      <input type="text" placeholder="email" name="uEmail"  value={register.uEmail} onChange={handleChange}/>
      <input type="text" placeholder="password" name="uPassword" value={register.uPassword} onChange={handleChange}/>
      <input type="text" placeholder="PhoneNumber" name="uphoneNumber" value={register.uphoneNumber}  onChange={handleChange}/>
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}

export default Register
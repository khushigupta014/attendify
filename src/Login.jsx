import React from 'react'
import {useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
const Login = () => {
    const [login,setLogin] = useState(1);
    const [name,setName] = useState('');
    const [password,setPassword] = useState('');
    const [message,setMessage] = useState('');
    const navigateTo = useNavigate();
    const loginRequest = async ()=>{
        const response = await fetch('http://localhost:4040/login',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({name,password})
        });
        const data = await response.json();
        if(data.ok)
        {
            navigateTo('./home');
        }
        else 
        {
          setMessage(data.message);
        }
    }
  return (
    <div className="login-body">
    <div className='body'>
    <div className="form-box">
<div className="form">
    <div className='field'>
        <div className="select-field">Institute</div>
    </div>
    <span className="title">Attendify</span>
    <span className="subtitle">Welcome, Join Us</span>
    <div className="form-container">
      <input type="text" onChange={(event)=>setName(event.target.value)} className="input" placeholder="Institue Name" />
			<input type="password" onChange={(event)=>setPassword(event.target.value)} class="input" placeholder="Password" />
    </div>
    <button onClick={loginRequest}>Join Us</button>
    <p className='message'>{message}</p>
</div>
<div className="form-section">
  <p>don't have an account? <a onClick={()=>navigateTo('/')} href="">Join Us</a> </p>
</div>
</div>
    </div>
    <div className='body'>
    <div className="form-box">
<div className="form">
    <div className='field'>
        <div className="select-field">Teacher</div>
    </div>
    <span className="title">Attendify</span>
    <span className="subtitle">Welcome, Join Us</span>
    <div className="form-container">
      <input type="text" onChange={(event)=>setName(event.target.value)} className="input" placeholder="Teacher " />
			<input type="password" onChange={(event)=>setPassword(event.target.value)} class="input" placeholder="Password" />
    </div>
    <button onClick={loginRequest}>Join Us</button>
    <p className='message'>{message}</p>
</div>
<div className="form-section">
  <p>don't have an account? <a onClick={()=>navigateTo('/')} href="">Join Us</a> </p>
</div>
</div>
    </div>
    <div className='body'>
    <div className="form-box">
<div className="form">
    <div className='field'>
        <div className="select-field">Student</div>
    </div>
    <span className="title">Attendify</span>
    <span className="subtitle">Welcome, Join Us</span>
    <div className="form-container">
      <input type="text" onChange={(event)=>setName(event.target.value)} className="input" placeholder="Roll Number" />
			<input type="password" onChange={(event)=>setPassword(event.target.value)} class="input" placeholder="Password" />
    </div>
    <button onClick={loginRequest}>Join Us</button>
    <p className='message'>{message}</p>
</div>
<div className="form-section">
  <p>don't have an account? <a onClick={()=>navigateTo('/')} href="">Join Us</a> </p>
</div>
</div>
    </div>
    </div>
  )
}

export default Login

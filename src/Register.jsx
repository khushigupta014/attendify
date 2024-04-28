import React from 'react'
import { useState } from 'react'
import './Register.css'
import { useNavigate } from 'react-router-dom';
const Hero = () => {
    const [name,setName] = useState('');
    const [password,setPassword] = useState('');
    const [address,setAddress] = useState('');
    const [message,setMessage] = useState('');
    const navigateTo = useNavigate();
    const joinRequest = async ()=>{
        const response = await fetch('http://localhost:4040/register',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({name,password,address})
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
    <>
    <div className='body'>
    <div className="form-box">
<div className="form">
    <span className="title">Attendify</span>
    <span className="subtitle">Welcome, Join Us</span>
    <div className="form-container">
      <input type="text" onChange={(event)=>setName(event.target.value)} className="input" placeholder="Institue Name" />
			<input type="text"  onChange={(event)=>setAddress(event.target.value)} class="input" placeholder="address" />
			<input type="password" onChange={(event)=>setPassword(event.target.value)} class="input" placeholder="Password" />
    </div>
    <button onClick={joinRequest}>Join Us</button>
    <p className='message'>{message}</p>
</div>
<div className="form-section">
  <p>Have an account? <a onClick={()=>navigateTo('./login')} href="">Log in</a> </p>
</div>
</div>
    </div>
    
    </>
    
  )
}

export default Hero

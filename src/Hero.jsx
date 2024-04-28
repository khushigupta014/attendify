import React from 'react'
import { useState } from 'react'
import './Hero.css'
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
    <div>
          <div className='up'>
          <div className='paragraph'>Say goodbye to inefficiencies and embrace <br />seamless tracking and optimization of your team's attendance.
          </div >
          <div className='buttons'>
          <button onClick={()=>navigateTo('/register')} class="button">
Join Us
<div onClick={()=>navigateTo('./register')} class="hoverEffect">
<div>
</div>
</div></button>

<button class="button">
Login
<div class="hoverEffect">
<div>
</div>
</div></button>
          </div>
          
          </div>
          
          <img src='./src/assets/images/hero.png' />
          <img src='./src/assets/images/hero1.png' />
    </div>
    </>
    
  )
}

export default Hero

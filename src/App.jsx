import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Hero from './Register';
import Home from './Home';
import Login from './Login';

function App() {
  

  return (
    <>
    <BrowserRouter >
    <Routes >
      <Route path='/' element={<Hero />} />
      <Route path='/login' element={<Login />} />
    </Routes>
</BrowserRouter>
    </>
  )
}

export default App

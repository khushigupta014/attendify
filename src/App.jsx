import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Hero from './Hero';
import Home from './Home';
import Login from './Login';
import QRCodeGenerator from './QRCodeGenerator';
import BarcodeScanner from './BarcodeScanner';
import Navbar from './Navbar';
import Register from './Register';
import "./cvr"; 
import Institute from './Institute';
import VideoCapture from './VideoCapture';
function App() {
  

  return (
    <>
    <BrowserRouter >
    <Navbar />
    {/* <VideoCapture /> */}
    <Routes >



      <Route path='/' element={<Hero />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      {/* <Route path='/institute' element={<Institute />} /> */}
      {/* <Route path='/code' element={<QRCodeGenerator />} /> */}
      {/* <Route path='/scanner' element={<BarcodeScanner />} /> */}
    </Routes>
</BrowserRouter>
    </>
  )
}

export default App

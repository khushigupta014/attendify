import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Hero from './Hero';
import Home from './Home';
import Login from './Login';
import QRCodeGenerator from './QRCodeGenerator';
import BarcodeScanner from './BarcodeScanner';
import Navbar from './Navbar';
import Register from './Register';
function App() {
  

  return (
    <>
    <BrowserRouter >
    <Navbar />
    <Routes >
      <Route path='/' element={<Hero />} />
      <Route path='/login' element={<Login />} />
      <Route path='/Register' element={<Register />} />
      {/* <Route path='/code' element={<QRCodeGenerator />} /> */}
      {/* <Route path='/scanner' element={<BarcodeScanner />} /> */}
    </Routes>
</BrowserRouter>
    </>
  )
}

export default App

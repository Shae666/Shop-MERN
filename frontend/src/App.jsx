import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Home from './components/Home';
import SignIn from './components/SignIn';
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import Checkout from "./components/Checkout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />


      </Routes>
    </Router>
  );
}

export default App;

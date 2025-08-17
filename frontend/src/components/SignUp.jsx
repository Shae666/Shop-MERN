import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', secretKey: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/signup', formData);

      // Store user info in localStorage including role
      if (res.data.user) {
        localStorage.setItem('auth_v1', JSON.stringify({ user: res.data.user }));
      }

      setMessage(res.data.message);

      if (res.data.message === "User registered successfully") {
        navigate('/home'); // redirect after signup
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "Server error");
    }
  };

  return (
    <div className="signup-container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg signup-card">
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          {/* Secret Key for admin */}
          <div className="mb-3">
            <input
              type="text"
              name="secretKey"
              className="form-control"
              placeholder="Secret Key (for admin)"
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-success w-100">Sign Up</button>
        </form>
        {message && <p className="text-center mt-3">{message}</p>}
        <p className="text-center mt-3">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;

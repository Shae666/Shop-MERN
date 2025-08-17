import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignIn.css';

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/signin', formData);

      // Store user info in localStorage including role
      if (res.data.user) {
        localStorage.setItem('auth_v1', JSON.stringify({ user: res.data.user }));
      }

      setMessage(res.data.message);

      if (res.data.message === "Login successful") {
        navigate('/home'); // redirect after login
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "Server error");
    }
  };

  return (
    <div className="signin-container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg signin-card">
        <h2 className="text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
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
          <button className="btn btn-primary w-100">Sign In</button>
        </form>
        {message && <p className="text-center mt-3">{message}</p>}
        <p className="text-center mt-3">
          New user? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;

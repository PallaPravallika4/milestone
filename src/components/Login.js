import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Axios instance
import '../CSS/Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage('Please fix the errors before submitting.');
      return;
    }

    try {
      const response = await api.post('auth/login', { username, password });
      const user = response.data;
      setMessage(`Welcome ${user.name || 'User'}! Redirecting to your dashboard...`);
      localStorage.setItem('user', JSON.stringify(user));

      switch (user.role) {
        case 'ADMIN':
          navigate('/admin-dashboard');
          break;
        case 'DOCTOR':
          navigate('/doctor-dashboard');
          break;
        case 'PATIENT':
          navigate('/patient-dashboard');
          break;
        default:
          navigate('/home');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Login failed. Please check your credentials.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className={errors.username ? 'input-error' : ''}
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        <button className="btn-primary" type="submit">
          Login
        </button>
      </form>
      <div className="login-footer">
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </Link>
        <Link to="/register" className="register-link">
          Don't have an account?
        </Link>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Login;

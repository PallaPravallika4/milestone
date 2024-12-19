import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Ensure this is correctly configured for Axios
import '../CSS/ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(''); // Clear error message if validation passes

    try {
      setLoading(true);

      // Sending POST request using Axios
      const response = await api.post('/auth/reset-password', null, {
        params: { email },
      });

      // If successful, set a success message
      setMessage(response.data || 'Reset password link sent successfully!');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (error) {
      // Handle error response, ensuring we avoid rendering objects directly
      const errorMessage =
        error.response?.data?.error || 'Failed to send reset password token';
      setMessage({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleForgotPassword}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          {/* Validation error message */}
          {error && <p className="error-text">{error}</p>}
        </div>
        <button
          className="btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? 'OTP is being sent...' : 'Send OTP'}
        </button>
      </form>

      {message && (
        <p className="message">
          {/* Safely handle both strings and objects */}
          {typeof message === 'string'
            ? message
            : `Error: ${message.error || 'Unknown Error'}`}
        </p>
      )}
    </div>
  );
}

export default ForgotPassword;

import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Signup.css';

function Signup() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>Signup</h2>

      <div className="form-group">
        <label>Email</label>
        <input id="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input id="password" type="password" value={formData.password} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="submit-btn">Register</button>

      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </form>
  );
}

export default Signup;




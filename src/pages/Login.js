import React, { useState } from 'react'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setUser }) { // Accept setUser function as a prop
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user); // Set the logged-in user
        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>

      <div className="form-group">
        <label>Email</label>
        <input id="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input id="password" type="password" value={formData.password} onChange={handleChange} required />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="submit-btn">Login</button>

      <p>Don't have an account? <Link to="/signup">Register here</Link></p>
    </form>
  );
}

export default Login;




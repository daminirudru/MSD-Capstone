import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      nav('/');
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Register</h2>
      {err && <div className="alert">{err}</div>}
      <form onSubmit={submit} className="form">
        <input className="input" type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-primary" disabled={loading}>{loading ? '...' : 'Create account'}</button>
      </form>
      <div className="muted">Already have an account? <Link to="/login">Login</Link></div>
    </div>
  );
}

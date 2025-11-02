import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(email.trim(), password, role);
      // send admins to /admin, users to /
      nav(role === 'admin' ? '/admin' : '/');
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      {err && <div className="alert">{err}</div>}
      <form onSubmit={submit} className="form">
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />

        <div className="password-field">
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-light eye"
            onClick={() => setShowPassword(s => !s)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="user">Login as User</option>
          <option value="admin">Login as Admin</option>
        </select>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? '...' : 'Login'}
        </button>
      </form>

      <div className="muted">
        No account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

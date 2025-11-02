import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Cafeteria</Link>
        <NavLink to="/" className="nav-link">Menu</NavLink>
        {user && <NavLink to="/orders" className="nav-link">My Orders</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
      </div>
      <div className="nav-right">
        {!user ? (
          <>
            <NavLink to="/login" className="btn btn-light">Login</NavLink>
            <NavLink to="/register" className="btn">Register</NavLink>
          </>
        ) : (
          <>
            <span className="user-chip">{user.name} ({user.role})</span>
            <button onClick={onLogout} className="btn btn-danger">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

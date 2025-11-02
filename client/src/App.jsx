import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/global.css';

const Protected = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Login/>;
  if (role && user.role !== role) return <div className="container narrow"><h3>Forbidden</h3></div>;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Menu/>} />
          <Route path="/orders" element={<Protected><Orders/></Protected>} />
          <Route path="/admin" element={<Protected role="admin"><Admin/></Protected>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { useEffect, useState } from 'react';
import { api } from '../api';
import '../styles/layout.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data } = await api.get('/orders/mine');
    setOrders(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container narrow">
      <h2>My Orders</h2>
      {!orders.length && <div className="muted">You have no orders yet.</div>}
      {orders.map((o) => (
        <div key={o._id} className="list-row">
          <div>
            <div className="token">{o._id}</div>
            <div className="muted">{new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <div>{o.items.map(i => `${i.item.name} x${i.qty}`).join(', ')}</div>
          <div>₹{o.total}</div>
          <div className={`badge status-${o.status}`}>{o.status}</div>
        </div>
      ))}
    </div>
  );
}

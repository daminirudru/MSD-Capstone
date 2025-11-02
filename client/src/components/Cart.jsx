import { useMemo, useState } from 'react';
import { api } from '../api';
import TokenPopup from './TokenPopup';
import '../styles/layout.css';

export default function Cart({ cart, setCart }) {
  const [placing, setPlacing] = useState(false)
  const [popup, setPopup] = useState(null)

  const total = useMemo(
    () => cart.reduce((s, c) => s + c.price * c.qty, 0),
    [cart]
  )

  const inc = (id) => setCart(prev => prev.map(c => c._id === id ? { ...c, qty: c.qty + 1 } : c))
  const dec = (id) => setCart(prev => prev.map(c => (c._id === id && c.qty > 1) ? { ...c, qty: c.qty - 1 } : c))
  const remove = (id) => setCart(prev => prev.filter(c => c._id !== id))

  const placeOrder = async () => {
    if (!cart.length) return;
    setPlacing(true);
    try {
      const payload = {
        items: cart.map(c => ({ item: c._id, qty: c.qty })),
      };
      const { data } = await api.post('/orders', payload);
      setPopup({ orderId: data._id, total });
      setCart([]);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <aside className="cart">
      <div className="cart-title">Your Cart</div>
      <div className="cart-items">
        {!cart.length && <div className="muted">Cart is empty</div>}
        {cart.map(c => (
          <div key={c._id} className="cart-row">
            <span className="cart-name">{c.name}</span>
            <div className="qty">
              <button className="btn btn-light" onClick={() => dec(c._id)}>-</button>
              <span className="qty-val">{c.qty}</span>
              <button className="btn btn-light" onClick={() => inc(c._id)}>+</button>
            </div>
            <span className="cart-price">₹{c.price * c.qty}</span>
            <button className="link" onClick={() => remove(c._id)}>remove</button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="total">Total: ₹{total}</div>
        <button className="btn btn-primary" disabled={!cart.length || placing} onClick={placeOrder}>
          {placing ? 'Placing...' : 'Place Order'}
        </button>
      </div>
      {popup && <TokenPopup data={popup} onClose={() => setPopup(null)} />}
    </aside>
  );
}

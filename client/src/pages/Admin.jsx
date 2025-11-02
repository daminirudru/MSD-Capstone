import { useEffect, useState } from 'react';
import { api } from '../api';
import '../styles/layout.css';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', tags: '', imageUrl: '' });

  const load = async () => {
    const { data } = await api.get('/items');
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl: form.imageUrl.trim(),
    };
    await api.post('/items', payload);
    setForm({ name: '', price: '', tags: '', imageUrl: '' });
    await load();
  };

  const del = async (id) => {
    await api.delete(`/items/${id}`);
    await load();
  };

  return (
    <div className="container narrow">
      <h2>Admin — Manage Menu</h2>
      <form onSubmit={submit} className="form">
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="input" placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
        <input className="input" placeholder="Tags (comma-separated)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})}/>
        <input className="input" placeholder="Image URL (optional)" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})}/>
        <button className="btn btn-primary">Add Item</button>
      </form>

      <div className="list">
        {items.map((it) => (
          <div key={it._id} className="list-row">
            <div className="w-30">{it.name}</div>
            <div className="w-20">₹{it.price}</div>
            <div className="w-40 muted">{it.tags?.join(', ')}</div>
            <div className="w-10 right">
              <button className="btn btn-danger" onClick={() => del(it._id)}>Delete</button>
            </div>
          </div>
        ))}
        {!items.length && <div className="muted">No items yet.</div>}
      </div>
    </div>
  );
}

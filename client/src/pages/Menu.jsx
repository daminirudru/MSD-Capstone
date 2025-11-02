import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import Cart from '../components/Cart';
import '../styles/layout.css';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [cart, setCart] = useState([]);

  // Default items if database returns empty
  const defaultItems = [
    { _id: '1', name: 'Masala Dosa', price: 80, tags: ['south', 'veg'], imageUrl: 'https://images.unsplash.com/photo-1604908554027-0a566d6b6c9a?w=800' },
    { _id: '2', name: 'Chicken Biryani', price: 150, tags: ['hyderabadi', 'spicy'], imageUrl: 'https://images.unsplash.com/photo-1604908177070-67f182947734?w=800' },
    { _id: '3', name: 'Veg Fried Rice', price: 110, tags: ['chinese', 'veg'], imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800' },
    { _id: '4', name: 'Paneer Roll', price: 90, tags: ['snack', 'veg'], imageUrl: 'https://images.unsplash.com/photo-1604908553833-5fd3cb342773?w=800' },
    { _id: '5', name: 'French Fries', price: 70, tags: ['snack', 'crispy'], imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800' },
  ];

  const load = async () => {
    try {
      const { data } = await api.get('/items', { params: { q } });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading items:', err);
      setItems([]);
    }
  };

  useEffect(() => { load(); }, [q]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((p) => p._id === item._id);
      if (found) return prev.map(p => p._id === item._id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const displayItems = useMemo(() => {
    // If DB is empty, fall back to defaults and filter with same query
    const source = items.length ? items : defaultItems;
    if (!q.trim()) return source;
    const needle = q.trim().toLowerCase();
    return source.filter(it =>
      it.name.toLowerCase().includes(needle) ||
      (it.tags || []).some(t => t.toLowerCase().includes(needle))
    );
  }, [items, q]);

  return (
    <div className="container grid-2">
      <div className="col">
        <div className="toolbar">
          <SearchBar value={q} onChange={setQ} />
        </div>

        <div className="grid">
          {displayItems.map((it) => (
            <ItemCard key={it._id} item={it} onAdd={addToCart} />
          ))}
          {!displayItems.length && (
            <div className="muted">No items found for "{q}"</div>
          )}
        </div>
      </div>

      <Cart cart={cart} setCart={setCart} />
    </div>
  );
}

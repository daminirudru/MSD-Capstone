import '../styles/cards.css';

export default function ItemCard({ item, onAdd }) {
  return (
    <div className="card">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="card-img" />
      ) : (
        <div className="card-img placeholder">🍽️</div>
      )}
      <div className="card-body">
        <div className="card-title">{item.name}</div>
        <div className="card-tags">
          {item.tags?.map((t) => (
            <span key={t} className="tag">#{t}</span>
          ))}
        </div>
        <div className="card-row">
          <span className="price">₹{item.price}</span>
          <button className="btn" onClick={() => onAdd(item)}>Add</button>
        </div>
      </div>
    </div>
  );
}

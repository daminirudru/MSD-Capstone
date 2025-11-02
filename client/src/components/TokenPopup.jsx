import '../styles/cards.css';

export default function TokenPopup({ data, onClose }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(data.orderId);
      alert('Order ID copied!');
    } catch {
      alert('Copy failed, select and copy manually.');
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-title">Order Placed ✅</div>
        <p>Show this token at the cafeteria counter:</p>
        <div className="token-box">{data.orderId}</div>
        <div className="muted">(This is your MongoDB document _id)</div>
        <div className="popup-actions">
          <button className="btn" onClick={copy}>Copy Token</button>
          <button className="btn btn-light" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

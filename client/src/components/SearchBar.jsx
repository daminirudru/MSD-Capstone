import '../styles/forms.css';

export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="input search-input"
      type="text"
      placeholder="Search by name or tag..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

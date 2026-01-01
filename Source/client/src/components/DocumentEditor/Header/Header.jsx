import "./Header.css";

export default function Header() {
  return (
    <div className="header">
      <div className="header-left">
        <span className="contract-icon">📄</span>
        <div>
          <h4>Freelancer and Tiara Labs Agreement</h4>
          <p>ID: 5136600000136267 | Owner: vm prems</p>
        </div>
        <span className="badge">DRAFT</span>
      </div>

      <div className="header-right">
        <button className="primary-btn">Draft Complete</button>
        <button className="icon-btn">⋮</button>
      </div>
    </div>
  );
}

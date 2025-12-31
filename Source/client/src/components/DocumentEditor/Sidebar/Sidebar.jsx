import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="tabs">
        <span className="active">SUMMARY</span>
        <span>COLLABORATORS</span>
        <span>APPROVAL</span>
        <span>NEGOTIATION</span>
      </div>

      <div className="sidebar-content">
        <h5>Basic Details</h5>

        <div className="field">
          <label>Contract Type</label>
          <span>Non-Disclosure Agreement (NDA)</span>
        </div>

        <div className="field">
          <label>Counterparty</label>
          <span>Kitee Solutions</span>
        </div>

        <div className="field">
          <label>Effective From</label>
          <span>26 May 2025</span>
        </div>
      </div>
    </div>
  );
}

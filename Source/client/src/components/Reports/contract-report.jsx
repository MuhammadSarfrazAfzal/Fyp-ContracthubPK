import React, { useState } from "react";
import "./contract-report.css";

const completedData = [
  { label: "Terminated", value: 4 },
  { label: "Negotiated", value: 3 },
  { label: "Active", value: 10 },
  { label: "Expired", value: 2 },
];

const pendingData = [
  { label: "Sign Pending", value: 2 },
  { label: "Negotiation Pending", value: 3 },
  { label: "Draft", value: 2 },
  { label: "Approval Pending", value: 1 },
];

const tableData = [
  {
    title: "E‑Commerce Vendor Agreement",
    status: "APPROVAL PENDING",
    type: "E‑Commerce Vendor Agreement",
    counterparty: "FOM Tech",
    owner: "Linda",
    created: "Mar 05, 2021",
  },
  {
    title: "E‑Commerce Vendor Agreement",
    status: "DRAFT",
    type: "E‑Commerce Vendor Agreement",
    counterparty: "FOM Tech",
    owner: "Linda",
    created: "Mar 05, 2021",
  },
  {
    title: "E‑Commerce Vendor Agreement",
    status: "NEGOTIATION PENDING",
    type: "E‑Commerce Vendor Agreement",
    counterparty: "FOM Tech",
    owner: "Linda",
    created: "Mar 05, 2021",
  },
];

export default function ContractsByStatus() {
  const [search, setSearch] = useState("");

  const filteredRows = tableData.filter((row) =>
    row.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout">
      <aside className="sidebar">
        <input className="search" placeholder="Search Report" />
        <div className="menu">
          <p className="menu-title">General</p>
          <p className="menu-item active">Contracts by Status</p>
          <p className="menu-item">Contracts by Contract Type</p>
          <p className="menu-item">Contracts by Department</p>
          <p className="menu-item">Contracts by Approval Workflow Type</p>
          <p className="menu-item">Contracts by Renewal Type</p>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <h2>Contracts by Status</h2>
          <div className="actions">
            <select>
              <option>This Month</option>
            </select>
            <button>⟳</button>
            <button>⤓</button>
            <button>🖨</button>
          </div>
        </header>

        <section className="charts">
          <div className="card">
            <h4>Completed Status</h4>
            {completedData.map((item) => (
              <div key={item.label} className="bar-row">
                <span>{item.label}</span>
                <div className="bar-bg">
                  <div
                    className="bar blue"
                    style={{ width: `${item.value * 10}%` }}
                  />
                </div>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="card">
            <h4>Pending Status</h4>
            {pendingData.map((item) => (
              <div key={item.label} className="bar-row">
                <span>{item.label}</span>
                <div className="bar-bg">
                  <div
                    className="bar green"
                    style={{ width: `${item.value * 15}%` }}
                  />
                </div>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="table-section">
          <input
            className="table-search"
            placeholder="Search contracts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table>
            <thead>
              <tr>
                <th>TITLE</th>
                <th>STATUS</th>
                <th>CONTRACT TYPE</th>
                <th>COUNTERPARTY</th>
                <th>OWNED BY</th>
                <th>CREATED ON</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.title}</td>
                  <td><span className={`badge ${row.status.replace(/\s/g, '').toLowerCase()}`}>{row.status}</span></td>
                  <td>{row.type}</td>
                  <td>{row.counterparty}</td>
                  <td>{row.owner}</td>
                  <td>{row.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}


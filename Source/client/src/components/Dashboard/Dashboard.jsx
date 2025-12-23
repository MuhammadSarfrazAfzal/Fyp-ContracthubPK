import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="root">
      
      <div className="topbar">
        <div className="topbar-left">
          <div className="brand">
             <span>ContracthubPK</span>
          </div>
          <div className="menu">
            <span className="active">Dashboard</span>
            <span>Contracts</span>
            <span>Activities</span>
            <span>Counterparties</span>
            <span>Reports</span>
          </div>
        </div>
        <div className="avatar"></div>
      </div>

     
      <div className="yellow-strip">Dashboard</div>

    
      <div className="content">
        
        <div className="main">
         
          <div className="card status-card">
            <div className="card-title">Contracts By Status</div>
            <div className="status-row">
              <div className="s draft">
                <p>Draft</p>
                <h3>104</h3>
              </div>
              <div className="s approved">
                <p>Approved</p>
                <h3>11</h3>
              </div>
              <div className="s negotiated">
                <p>Negotiated</p>
                <h3>20</h3>
              </div>
              <div className="s signed">
                <p>Signed</p>
                <h3>0</h3>
              </div>
              <div className="s active">
                <p>Active</p>
                <h3>23</h3>
              </div>
            </div>
          </div>

         
          <div className="card two">
            <div className="block">
              <div className="card-title">To Approve (12)</div>
              <table>
                <thead>
                  <tr>
                    <th>CONTRACT</th>
                    <th>COUNTERPARTY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>DSA - Data Sharing Agreement</td>
                    <td>NewGen Solutions</td>
                  </tr>
                  <tr>
                    <td>Loan Agreement</td>
                    <td>Zenith Dynamics</td>
                  </tr>
                  <tr>
                    <td>Master Service Agreement</td>
                    <td>Zenith Dynamics</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="block">
              <div className="card-title">Pending Obligations (10)</div>
              <table>
                <thead>
                  <tr>
                    <th>TITLE</th>
                    <th>DUE DATE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data Security</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>Payment</td>
                    <td>Dec 20, 2025</td>
                  </tr>
                  <tr>
                    <td>Data Security</td>
                    <td>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

       
        <div className="side">
          <div className="card calendar-card">
            <div className="card-title">Calendar</div>
            <div className="calendar-box">FEB 2025</div>
          </div>

          <div className="card">
            <div className="event">
              <b>25 TUE</b>
              <span>
                Obligation Due Date
                <br />
                Payment
              </span>
            </div>
            <div className="event">
              <b>27 THU</b>
              <span>
                Obligation Due Date
                <br />
                Payment
              </span>
            </div>
            <div className="event">
              <b>27 THU</b>
              <span>
                Obligation Due Date
                <br />
                Payment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

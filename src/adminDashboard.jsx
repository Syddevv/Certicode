
import logo from './assets/certicodeicon.png';

function AdminDashboard() {
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <aside className="sidebar">
          <div className="logo">
            <img src={logo} alt="Certicode Logo" />
          </div>

          <label htmlFor="sidebar-toggle" className="close-btn">&times;</label>

          <div className="menu">
            <ul className="menu-top">
              <li className="active"><a href="#">Dashboard</a></li>
              <li><a href="#">Inventory</a></li>
              <li><a href="#">Sales</a></li>
              <li><a href="#">Customers</a></li>
              <li><a href="#">Settings</a></li>
              <li><a href="#">Support</a></li>
            </ul>

            <div className="profile-item">
              <div className="profile">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Admin" />
                <div>
                  <strong>Alex Rivera</strong>
                  <small>Admin</small>
                </div>
              </div>
              <button className="logout">⎋</button>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <label htmlFor="sidebar-toggle" className="hamburger">&#9776;</label>
            <input className="search" placeholder="Search anything..." />

            <div className="topbar-actions">
              <button className="notification">🔔</button>

              <button className="btn">+ Add New Asset</button>
            </div>
          </div>

          <h2>Admin Dashboard Overview</h2>
          <p className="subtitle">Welcome back, Admin. Here's what's happening today.</p>

          <section className="cards">
            <div className="card"><span>Total Revenue</span><h3>$124,500</h3></div>
            <div className="card"><span>Total Projects</span><h3>24</h3></div>
            <div className="card"><span>Total Customers</span><h3>1,284</h3></div>
            <div className="card"><span>Avg. Order Value</span><h3>$1,500</h3></div>
          </section>

          <section className="content">
            <div className="box">
              <h4>Sales Overview</h4>
              <div className="chart">
                <div className="bar" style={{height: '40%'}} data-label="Jan"></div>
                <div className="bar" style={{height: '50%'}} data-label="Feb"></div>
                <div className="bar highlight" style={{height: '80%'}} data-label="Mar"></div>
                <div className="bar" style={{height: '60%'}} data-label="Apr"></div>
                <div className="bar" style={{height: '70%'}} data-label="May"></div>
                <div className="bar" style={{height: '90%'}} data-label="Jun"></div>
              </div>
            </div>

            <div className="box">
              <h4>Recent Activities</h4>
              <ul className="activities">
                <li>New Sale: E-commerce SaaS</li>
                <li>Asset Updated: Foodie Express</li>
                <li>New Customer Registered</li>
                <li>Audit Completed</li>
                <li>New Project Added</li>
              </ul>
            </div>
          </section>

          <section className="box orders">
            <div className="orders-header">
              <h4>Recent Orders</h4>
              <button className="export">Export CSV</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>E-commerce SaaS Template</td>
                  <td>Enterprise Solution Inc.</td>
                  <td>Oct 24, 2023</td>
                  <td>$999</td>
                  <td><span className="status completed">Completed</span></td>
                  <td className="actions">
                    <button>👁</button>
                    <button>⚙</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;

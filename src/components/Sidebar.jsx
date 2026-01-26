import logo from "../assets/certicodeicon.png";
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="Certicode Logo" />
      </div>

      <label htmlFor="sidebar-toggle" className="close-btn">
        &times;
      </label>

      <div className="menu">
        {/* MAIN MENU */}
        <ul className="menu-top">
          <li className="active">
            <a href="#">Dashboard</a>
          </li>
          <li>
            <a href="#">Inventory</a>
          </li>
          <li>
            <a href="#">Sales</a>
          </li>
          <li>
            <a href="#">Customers</a>
          </li>
        </ul>

        {/* SYSTEM LABEL */}
        <div className="menu-section-label">SYSTEM</div>

        {/* SYSTEM MENU */}
        <ul className="menu-bottom">
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <a href="#">Support</a>
          </li>
        </ul>

        {/* PROFILE */}
        <div className="profile-item">
          <div className="profile">
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              alt="Admin"
            />
            <div>
              <strong>Alex Rivera</strong>
              <small> Admin</small>
            </div>
          </div>
          <button className="logout">⎋</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

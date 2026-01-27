import SearchIcon from "../assets/lucide_search.png";
import MoonIcon from "../assets/lucide_moon.png";
import "../styles/nav.css";
import CerticodeLogo from "../assets/certicodeicon.png";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__brand">
          <img src={CerticodeLogo} alt="certicode" className="certicode-logo" />
        </div>

        <nav className="nav__links">
          <NavLink
            className={({ isActive }) =>
              `nav__link${isActive ? " is-active" : ""}`
            }
            to="/"
            end
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav__link${isActive ? " is-active" : ""}`
            }
            to="/marketplace"
          >
            Marketplace
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav__link${isActive ? " is-active" : ""}`
            }
            to="/categories"
          >
            Categories
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav__link${isActive ? " is-active" : ""}`
            }
            to="/how-it-works"
          >
            How It Works
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav__link${isActive ? " is-active" : ""}`
            }
            to="/fa"
          >
            FAQ
          </NavLink>
        </nav>

        <div className="nav__actions">
          <button className="iconBtn" aria-label="Search" type="button">
            <img className="iconImg" src={SearchIcon} alt="" />
          </button>

          <button className="iconBtn" aria-label="Theme" type="button">
            <img className="iconImg" src={MoonIcon} alt="" />
          </button>

          <button className="btn btn--ghost" type="button">
            Login
          </button>
          <button className="btn btn--light" type="button">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

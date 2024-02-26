// src/components/Header.tsx

import React from "react";
import { useAuth } from "../AuthContext/AuthContext";
import logo from "../assets/LOGO.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate , Link} from "react-router-dom";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Google-style Logo and Search Bar on the left */}
        <Link className="navbar-brand" to="/dashboard">
          <img alt="Google Logo" height="30" className="me-2" src={logo} />
        </Link>

        {/* Search Bar */}
        <form className="d-flex">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search..."
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>

        {/* User Profile, Cart, and Logout on the right */}
        <div className="d-flex align-items-center">
          {/* Cart icon */}
          <Link
            to="/view-cart"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <i
              className="fas fa-shopping-cart me-3 text-dark"
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
            ></i>
          </Link>

          {/* Logout button */}
          <button className="btn btn-outline-dark me-3" onClick={handleLogout}>
            Logout
          </button>

          {/* User Profile */}
          <Link
            to="/user-profile"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <i
              className="fas fa-user-circle me-3 text-dark"
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
            ></i>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;

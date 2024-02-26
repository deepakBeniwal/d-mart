// src/LoginForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { loginUser } from "../Services/authService";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, userEmail } = useAuth();

  const [formData, setFormData] = useState({
    username: userEmail ?? "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Make API request to authenticate user using the service
      const accessToken = await loginUser(formData);

      // Set the access token in the AuthContext
      login(accessToken, formData.username);

      // Redirect to the dashboard or another page upon successful login
      navigate("/dashboard");
    } catch (error) {
      console.error("Error authenticating user:", error);

      // Set login error message
      setLoginError("Error authenticating user");
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Login</h2>

      {loginError && (
        <div className="alert alert-danger" role="alert">
          {loginError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <div className="col-12 mt-3">
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

// src/RegistrationForm.tsx
import React, { useState } from "react";
import ConfirmationForm from "./ConfirmationForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Services/authService";

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone_number: "+91", // Add +91 prefix to phone number
    address: "",
    gender: "male", // Default to male, you can change this if needed
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      gender: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);

      setUserEmail(response.user.email);

      // Set registration success to true
      setRegistrationSuccess(true);

      // Reset the form after successful registration
      setFormData({
        email: "",
        password: "",
        name: "",
        phone_number: "+91",
        address: "",
        gender: "male",
      });

      // Show the confirmation form after successful registration
      setShowConfirmationForm(true);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const switchToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      {showConfirmationForm ? (
        <ConfirmationForm email={userEmail} />
      ) : (
        <>
          <h2>User Registration</h2>

          {registrationSuccess && (
            <div className="alert alert-success" role="alert">
              User registered successfully! Please check your email for the
              confirmation code.
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
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

            <div className="col-md-4">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Phone Number:</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Address:</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Gender:</label>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleGenderChange}
                  required
                />
                <label className="form-check-label">Male</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleGenderChange}
                  required
                />
                <label className="form-check-label">Female</label>
              </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>

          {!registrationSuccess && (
            <div className="col-12 mt-3">
              <button className="btn btn-secondary" onClick={switchToLogin}>
                Login
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RegistrationForm;

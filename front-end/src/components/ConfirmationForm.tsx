import React, { useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import { confirmUser } from "../Services/authService";
import { ConfirmationFormProps } from "../interface/ConfirmationFormProps";

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ email }) => {
  const { login } = useAuth(); // Use the login function from the context
  const [editedEmail, setEditedEmail] = useState(email);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const showToast = (message: string) => {
    toast(message, { position: "top-right", autoClose: 5000, type: "info" });
  };

  useEffect(() => {
    showToast("Please check your email for the confirmation code");
    showToast("Also, confirm the email to AWS for Purchase Receipt");
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.disabled) {
      setEditedEmail(e.target.value);
    }
  };

  const handleConfirmationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmationCode(e.target.value);
  };

  const handleConfirmation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await confirmUser(editedEmail, confirmationCode);

      // Set confirmation success to true
      setConfirmationSuccess(true);

      showToast("User confirmed successfully!");

      // Set the email in the context
      login("", editedEmail);

      navigate("/login");
    } catch (error) {
      console.error("Error confirming user:", error);
      setError("Invalid confirmation code. Please try again.");
      showToast("Error confirming user. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Confirmation Code</h2>

      {confirmationSuccess && (
        <div className="alert alert-success" role="alert">
          User confirmed successfully!
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleConfirmation}>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmation Code:</label>
          <input
            type="text"
            className="form-control"
            name="confirmationCode"
            value={confirmationCode}
            onChange={handleConfirmationCodeChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Confirm
        </button>
      </form>
    </div>
  );
};

export default ConfirmationForm;

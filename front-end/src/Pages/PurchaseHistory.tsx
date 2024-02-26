import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import { baseURL } from "../config/apiConfig";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { UserPurchaseHistory } from "../interface/PurchaseHistory";



const PurchaseHistory: React.FC = () => {
  const { accessToken, logout } = useAuth();
  const [purchaseHistory, setPurchaseHistory] = useState<UserPurchaseHistory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchaseHistory();
  }, [accessToken]);

  const fetchPurchaseHistory = async () => {
    try {
      const response = await axios.get(`${baseURL}/purchase-history`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setPurchaseHistory(response.data);
    } catch (error) {
      console.error("Error fetching purchase history:", error);

      // Handle error, e.g., redirect to login page
      if (error) {
        logout();
      }
    }
  };

  const handleRowClick = async (purchaseId: number) => {
    navigate(`/purchase-history/${purchaseId}`);
  };

  return (
    <div className="container mt-5">
      <h2>Purchase History</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Items</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {purchaseHistory.map((purchase) => (
            <tr key={purchase.id} onClick={() => handleRowClick(purchase.id)}>
              <td>
                {moment(purchase.createdAt).format("DD MMM YYYY [at] hh:mm A")}
              </td>
              <td>{purchase.totalItems}</td>
              <td>${purchase.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Continue Shopping Button */}
      <div className="text-center">
        <Link to="/dashboard" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PurchaseHistory;

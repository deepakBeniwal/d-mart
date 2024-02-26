import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import { useParams } from "react-router-dom";
import { baseURL } from "../config/apiConfig";
import { UserPurchaseHistory } from "../interface/PurchaseHistory";



const PurchaseHistoryView: React.FC = () => {
  const { accessToken } = useAuth();
  const { purchaseId } = useParams<{ purchaseId: string }>();
  const [purchaseHistory, setPurchaseHistory] =
    useState<UserPurchaseHistory | null>(null);

  useEffect(() => {
    fetchPurchaseHistoryWithID();
  }, []);

  const fetchPurchaseHistoryWithID = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/purchase-history/${purchaseId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPurchaseHistory(response.data);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };

  return (
    <div className="container py-4">
      {purchaseHistory && (
        <div>
          <h2 className="mb-4">Purchase History Details</h2>
          <p>
            <strong>Date:</strong>{" "}
            {moment(purchaseHistory.createdAt).format(
              "DD MMM YYYY [at] hh:mm A"
            )}
          </p>
          <p>
            <strong>Total Items:</strong> {purchaseHistory.totalItems}
          </p>
          <p>
            <strong>Total Price:</strong> ${purchaseHistory.totalPrice}
          </p>
          <h3 className="mt-4">Products:</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory.products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.product.name}</td>
                    <td>{product.quantity}</td>
                    <td>${product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryView;

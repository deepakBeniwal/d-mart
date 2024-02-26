import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseURL } from "../config/apiConfig";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartItem } from "../interface/Cart";

const ViewCart: React.FC = () => {
  const { accessToken } = useAuth();
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart details when the component mounts
    const getCartDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/cart/view-cart`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          setCart(response?.data?.products);
        } else {
          setCart(null);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };

    getCartDetails();
  }, [accessToken]);

  const getCartDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/cart/view-cart`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        setCart(response?.data?.products);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const handleUpdateCart = async (productId: number, quantity: number) => {
    try {
      await axios.put(
        `${baseURL}/cart/update-cart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      getCartDetails();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?"
      )
    ) {
      try {
        await axios.delete(`${baseURL}/cart/remove-from-cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        getCartDetails();
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleViewPurchaseHistory = () => {
    navigate("/purchase-history");
  };
  console.log(cart, "cart");
  return (
    <div className="container mt-5">
      <h2 className="display-4 font-weight-bold">Your Cart</h2>
      <br />
      {cart != null ? (
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart?.map((item) => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>{item.productDescription}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      handleUpdateCart(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  {item.quantity}
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() =>
                      handleUpdateCart(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                </td>
                <td>${item.price}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveFromCart(item.productId)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          {" "}
          <h3 className="display-4 font-weight-bold text-center">
            Please add items to your cart
          </h3>
        </>
      )}
      <div className="d-flex justify-content-end">
        {cart != null && (
          <button className="btn btn-success" onClick={handleCheckout}>
            Checkout
          </button>
        )}
        {cart === null && (
          <button
            className="btn btn-primary ms-2 btn-lg"
            onClick={handleViewPurchaseHistory}
          >
            View Purchase History
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewCart;

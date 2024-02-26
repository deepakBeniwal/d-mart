import React from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { checkoutProducts, fetchCartProducts } from "../Services/cartService";
import { User } from "../interface/User";
import { CartProduct } from "../interface/Cart";


const Checkout: React.FC = () => {
  const { accessToken, logout } = useAuth();
  const [cartProducts, setCartProducts] = React.useState<CartProduct[]>([]);

  const [user, setUser] = React.useState<User>({
    id: Number,
    address: "",
    email: "",
    phone_number: 0,
  });

  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchCartData();
  }, [accessToken]);

  const fetchCartData = async () => {
    try {
      const { products, user } = await fetchCartProducts(accessToken);
      setCartProducts(products);
      setUser(user);

      // Calculate total items and total price
      const items = products.reduce(
        (total: any, product: { quantity: any }) => total + product.quantity,
        0
      );
      setTotalItems(items);

      const price = products.reduce(
        (total: number, product: { quantity: number; price: number }) =>
          total + product.quantity * product.price,
        0
      );
      setTotalPrice(price);
    } catch (error) {
      console.error("Error fetching cart products:", error);

      // Handle error, e.g., redirect to login page
      if (error) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleProceedToBuy = async () => {
    try {
      await checkoutProducts(accessToken, user.id, cartProducts);
      // Navigate to the purchase history page
      navigate("/purchase-history");
    } catch (error) {
      console.error("Error processing purchase:", error);
    }
  };
  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Description</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {cartProducts.map((product) => (
            <tr key={product.productId}>
              <td>{product.productName}</td>
              <td>{product.productDescription}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <h4>User Details</h4>
        <p>Address - {user.address}</p>
        <p>Phone Number - {user.phone_number}</p>
        <p>Email - {user.email}</p>

        <h4>Total Items: {totalItems}</h4>
        <h4>Total Price: ${totalPrice}</h4>

        <button className="btn btn-primary mt-3" onClick={handleProceedToBuy}>
          Proceed to Buy
        </button>
      </div>
    </div>
  );
};

export default Checkout;

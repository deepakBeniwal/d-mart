import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "../styles/ProductDetails.css";
import { fetchProductDetails } from "../Services/productService";
import { addToCart, fetchCartProducts } from "../Services/cartService";
import { Products } from "../interface/Products";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [product, setProduct] = useState<Products | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartProducts, setCartProducts] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProductDetails(id, accessToken);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }

      try {
        const cartData = await fetchCartProducts(accessToken);
        if (cartData) {
          const productIds = cartData.map((item: any) => item.productId);
          setCartProducts(productIds);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchData();
  }, [id, accessToken]);

  const handleAddToCart = async (productId: number) => {
    try {
      const response = await addToCart(productId, quantity, accessToken);
      console.log("Product added to cart:", response);

      // Add the productId to the cartProducts state
      setCartProducts((prevCartProducts) => [...prevCartProducts, productId]);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    // If the product is in the cart, enable the button
    if (product && cartProducts.includes(product.id)) {
      setCartProducts((prevCartProducts) =>
        prevCartProducts.filter((id) => id !== product.id)
      );
    }
  };

  return (
    <div className="container mt-5">
      {product && (
        <div className="row">
          <div className="col-md-4 mb-4 img-container">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="img-fluid rounded shadow"
              style={{ maxHeight: "400px" }}
            />
          </div>
          <div className="col-md-8 mb-4">
            <h2>{product.name}</h2>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category.name}</p>
            <p>Category Description: {product.category.description}</p>

            {/* Quantity Input */}
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
              />
            </div>

            {/* Add to Cart Button */}
            <button
              className="btn btn-primary mt-3"
              onClick={() => handleAddToCart(product.id)}
              disabled={!product || cartProducts.includes(product.id)}
            >
              {cartProducts.includes(product.id)
                ? "Added to Cart"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

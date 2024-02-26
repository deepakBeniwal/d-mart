import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { baseURL } from "../config/apiConfig";
import {
  getAllProducts,
  getProductsByCategory,
} from "../Services/productService";
import { addToCart } from "../Services/cartService";
import { Category, Product } from "../interface/Products";

const ProductList: React.FC = () => {
  const { accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = React.useMemo(() => 9, []);
  const [totalPages, setTotalPages] = useState(1);
  const [cartProducts, setCartProducts] = useState<number[]>([]);
  const [productQuantities, setProductQuantities] = useState<{
    [productId: number]: number;
  }>({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts(currentPage);
    fetchAllCategories();
  }, [accessToken, currentPage]);

  const fetchAllProducts = async (page: number) => {
    try {
      if (accessToken) {
        const data = await getAllProducts(accessToken, page, productsPerPage);
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      if (error) {
        navigate("/login");
      }
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = async (categoryId: number) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);

    try {
      let data;
      if (categoryId === 0) {
        // Fetch all products
        if (accessToken) {
          data = await getAllProducts(
            accessToken,
            currentPage,
            productsPerPage
          );
        }
        setProducts(data.products);
      } else {
        console.log("Fetching products for category:", categoryId);
        // Fetch products for the selected category
        if (accessToken) {
          data = await getProductsByCategory(accessToken, categoryId);
        }
        setProducts(data);
      }

      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error
      );
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (productId: number) => {
    try {
      // Call the addToCart service with the productId and quantity
      const response = await addToCart(
        productId,
        productQuantities[productId] || 1,
        accessToken
      );

      console.log("Product added to cart:", response.data);

      // Add the productId to the cartProducts state
      setCartProducts((prevCartProducts) => [...prevCartProducts, productId]);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));

    // Remove the product from cartProducts if the quantity is increased
    if (cartProducts.includes(productId) && newQuantity > 1) {
      setCartProducts((prevCartProducts) =>
        prevCartProducts.filter((id) => id !== productId)
      );
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h2 className="display-4 font-weight-bold">All Products</h2>
        </div>
        <div className="d-flex align-items-center">
          <label htmlFor="categorySelect" className="me-2">
            Filter by Category:
          </label>
          <select
            id="categorySelect"
            className="form-select border-0 shadow-sm"
            onChange={(e) => handleCategoryChange(Number(e.target.value))}
            value={selectedCategory || ""}
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {products?.length === 0 ? (
          <div className="col-12 text-center">
            <p>No products available. Products will be added soon...</p>
          </div>
        ) : (
          products?.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div
                className="card border shadow-sm"
                onClick={() => handleProductClick(product.id)}
                style={{ cursor: "pointer", borderRadius: "10px" }}
              >
                <img
                  src={
                    product.imageUrl
                      ? product.imageUrl
                      : `https://via.placeholder.com/300x400`
                  }
                  className="card-img-top"
                  alt={product.name}
                  style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    height: "200px",
                    objectFit: "contain",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">${product.price}</p>
                </div>
              </div>
              <div className="input-group mt-2">
                <input
                  type="number"
                  className="form-control"
                  value={productQuantities[product.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product.id, Number(e.target.value))
                  }
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={cartProducts.includes(product.id)}
                >
                  {cartProducts.includes(product.id)
                    ? "Added to Cart"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ProductList;

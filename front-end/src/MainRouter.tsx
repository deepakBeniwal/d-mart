// MainRoute.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConfirmationForm from "./components/ConfirmationForm";

import ProductDetails from "./components/ProductDetails";
import Header from "./components/Header";
import ViewCart from "./Pages/ViewCart";
import Checkout from "./Pages/Checkout";
import PurchaseHistory from "./Pages/PurchaseHistory";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import PurchaseHistoryView from "./Pages/PurchaseHistoryView";

const MainRoute = () => {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/confirm" element={<ConfirmationForm email="" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/view-cart" element={<ViewCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
        <Route
          path="/purchase-history/:purchaseId"
          element={<PurchaseHistoryView />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoute;

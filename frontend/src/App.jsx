import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Verify from "./pages/Verify";
import Profile from "./pages/Profile";
import ScrollUp from "./components/ScrollUp";

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : "");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await api.get('/api/user/info');
        } catch (error) {
          if (error.response?.status === 401) {
            try {
              // Пытаемся обновить токен
              const response = await api.get('/api/user/refresh-token');
              if (response.data.success) {
                setToken(response.data.accessToken);
              } else {
                handleLogout();
              }
            } catch (refreshError) {
              handleLogout();
            }
          }
        }
      }
    };

    checkAuth();
  }, [token]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-20">
      <ToastContainer />
      <Navbar scrolled={scrolled} />
      <ScrollUp scrolled={scrolled} />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
      <Footer />
    </div>
  )
};

export default App;
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { currency } from "../App";
import api from "../services/apiService";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const backendUrl = import.meta.env.PROD ? '' : import.meta.env.VITE_BACKEND_URL_DEV;
  //const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("adminToken")) {
      setToken(localStorage.getItem("adminToken"));
    }
  }, []);

  const value = {
    products, currency, navigate, backendUrl, setToken, token,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
};

export default ShopContextProvider;
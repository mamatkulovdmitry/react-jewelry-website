import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "./hooks/UseClickOutside";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Products from "./pages/Products";
import AddUser from "./pages/AddUser";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
import api from "./services/apiService";

import Dashboard from "./pages/Dashboard";

export const backendUrl = import.meta.env.PROD ? '' : import.meta.env.VITE_BACKEND_URL_DEV;
//export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₽";

const App = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [token, setToken] = useState(localStorage.getItem("adminToken") ? localStorage.getItem("adminToken") : "");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

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
        localStorage.removeItem("adminToken");
        navigate("/admin");
    };

    return (
        <div className="min-h-screen bg-slate-100 transition-colors">
            <ToastContainer />
            {token === ""
                ? <Login setToken={setToken} />
                :
                <>
                    <Sidebar ref={sidebarRef} collapsed={collapsed} />
                    <div className={`${collapsed ? "md:ml-[70px]" : "md:ml-[240px]"} transition-[margin] duration-300`}>
                        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} setToken={setToken} token={token} />
                        <div className="h-[calc(100vh-60px)] mx-auto p-6 text-gray-600 text-base overflow-x-hidden overflow-y-auto">
                            <Routes>
                                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                                <Route path="/admin/dashboard" element={<Dashboard token={token} />} />
                                <Route path="/admin/new-product" element={<AddProduct token={token} />} />
                                <Route path="/admin/new-user" element={<AddUser token={token} />} />
                                <Route path="/admin/edit-product/:id" element={<EditProduct token={token} />} />
                                <Route path="/admin/edit-user/:id" element={<EditUser token={token} />} />
                                <Route path="/admin/products" element={<Products token={token} />} />
                                <Route path="/admin/orders" element={<Orders token={token} />} />
                                <Route path="/admin/users" element={<Users token={token} />} />
                            </Routes>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default App;
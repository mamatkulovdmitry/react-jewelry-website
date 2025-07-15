import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../services/apiService";

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const backendUrl = import.meta.env.PROD ? '' : import.meta.env.VITE_BACKEND_URL_DEV;
    //const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [userData, setUserData] = useState([]);
    const [ordersCount, setOrdersCount] = useState("");
    const [token, setToken] = useState("");

    const fetchUserData = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await api.get(
                "/api/user/info",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                setUserData(response.data.userData);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const fetchUserOrders = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await api.get(
                "/api/order/userorders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                if (response.data.orders === null) {
                    setOrdersCount(0);
                }
                else {
                    const activeOrders = response.data.orders.filter(order =>
                        !["Completed", "Returned", "Cancelled"].includes(order.status)
                    );
                    setOrdersCount(activeOrders.length);
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    useEffect(() => {
        fetchUserData();
        fetchUserOrders();
    }, [token]);

    const value = {
        userData, backendUrl, setToken, token,
        ordersCount,
    };

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )
};

export default UserContextProvider;
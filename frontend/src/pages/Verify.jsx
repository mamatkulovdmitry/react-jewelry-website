import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "../services/apiService";

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const verifyPayment = async () => {
        try {
            if (!token) {
                return null;
            }
            const response = await api.post(
                "/api/order/verifyYookassa",
                { success, orderId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                setCartItems({});
                navigate("/orders");
                toast.success("Оплата прошла успешно. Заказ оформлен");
            }
            else {
                navigate("/cart");
                toast.error("Произошла ошибка при оформлении заказа. Попробуйте снова");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [token]);

    return (
        <div>

        </div>
    )
};

export default Verify;
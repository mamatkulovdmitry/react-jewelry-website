import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/apiService";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "₽";
    const delivery_fee = 0;
    const [deliveryMethod, setDeliveryMethod] = useState("pickup");
    const backendUrl = import.meta.env.PROD ? '' : import.meta.env.VITE_BACKEND_URL_DEV;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const getDeliveryFee = () => {
        return deliveryMethod === "pickup" ? 0 : 300;
    };

    const addToCart = async (itemId, size = null) => {
        // Проверяем, требуется ли для товара размер
        const product = products.find(p => p.uuid === itemId);
        const requiresSize = product && ["Кольца", "Цепи", "Браслеты"].includes(product.category);

        if (requiresSize && !size) {
            toast.error("Выберите размер");
            return;
        }

        let cartData = structuredClone(cartItems);

        // Для товаров без размера используем ключ 'no_size'
        const sizeKey = size || 'no_size';

        if (cartData[itemId]) {
            if (cartData[itemId][sizeKey]) {
                cartData[itemId][sizeKey] += 1;
            } else {
                cartData[itemId][sizeKey] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][sizeKey] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await api.post(
                    "/api/cart/add",
                    { itemId, size: sizeKey },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                toast.success("Товар добавлен в корзину");
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await api.post(
                    "/api/cart/update",
                    { itemId, size, quantity },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInformation = products.find((product) => product.uuid === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInformation.price * cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalAmount;
    };

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

    const getUserCart = async (tokenParam = token) => {
        try {
            const response = await api.get(
                "/api/cart/get",
                {
                    headers: {
                        Authorization: `Bearer ${tokenParam}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                const cartData = response.data.cartData.cart_data;
                const formattedCartData = {};
                for (const itemId in cartData) {
                    formattedCartData[itemId] = cartData[itemId];
                }
                setCartItems(formattedCartData);
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
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            getUserCart(localStorage.getItem("token"));
        }
    }, []);

    const value = {
        products, currency,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, setToken, token,
        delivery_fee: getDeliveryFee(), deliveryMethod,
        setDeliveryMethod, getUserCart,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
};

export default ShopContextProvider;
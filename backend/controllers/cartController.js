import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";

const addToCart = async (request, response) => {
    try {
        const { userId, itemId, size } = request.body;
        const userData = await User.getInfo(userId);

        if (!userData) {
            return response.status(404).json({ success: false, message: "Пользователь не найден" });
        }

        let cartData = await Cart.exists(userData.id);

        if (!cartData) {
            cartData = {};
        }
        else {
            cartData = cartData.cart_data;
        }

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        const newCart = new Cart(userId, JSON.stringify(cartData));
        await newCart.save()
        response.json({ success: true, message: "Товар добавлен в корзину" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const updateCart = async (request, response) => {
    try {
        const { userId, itemId, size, quantity } = request.body;
        const userData = await User.getInfo(userId);
        if (!userData) {
            return response.status(404).json({ success: false, message: "Пользователь не найден" });
        }

        let cartData = await Cart.exists(userData.id);
        if (!cartData) {
            return response.status(404).json({ success: false, message: "Данные о корзине не найдены" });
        }

        let cartDataObject = cartData.cart_data;
        if (typeof cartDataObject !== 'object') {
            try {
                cartDataObject = JSON.parse(cartDataObject);
            } catch (error) {
                console.error("Failed to parse cart_data", error);
                return response.status(500).json({ success: false, message: "Неверный формат данных корзины" });
            }
        }

        if (!cartDataObject[itemId]) {
            return response.status(404).json({ success: false, message: "Товар не найден в корзине" });
        }

        if (quantity > 0) {
            cartDataObject[itemId][size] = quantity;
        } else {
            delete cartDataObject[itemId][size];
            if (Object.keys(cartDataObject[itemId]).length === 0) {
                delete cartDataObject[itemId];
            }
        }

        await Cart.update(userId, JSON.stringify(cartDataObject));
        response.json({ success: true, message: "Корзина обновлена" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const getUserCart = async (request, response) => {
    try {
        const { userId } = request.body;
        const userData = await User.getInfo(userId);
        if (!userData) {
            return response.status(404).json({ success: false, message: "Пользователь не найден" });
        }

        let cartData = await Cart.exists(userData.id);
        if (!cartData) {
            cartData = {};
        }

        response.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

export {
    addToCart,
    updateCart,
    getUserCart,
}
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Stripe from "stripe";

const currency = "rub";
//const deliveryCharge = 300;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[^\d+]/g, "");
    const formatted = cleaned.replace(/^8/, "+7");
    return formatted.replace(
        /^(\+7)(\d{3})(\d{3})(\d{2})(\d{2})$/,
        "$1 ($2) $3-$4-$5"
    );
};

const placeOrder = async (request, response) => {
    try {
        const { userId, products, amount, deliveryMethod, shippingAddress } = request.body;
        const formattedPhone = formatPhoneNumber(shippingAddress.phone);
        shippingAddress.phone = formattedPhone;

        const orderData = {
            userId,
            amount: Number(amount),
            status: "Placed",
            paymentMethod: "COD",
            payment: false,
            products,
            deliveryMethod,
            shippingAddress,
        }

        const order = new Order(
            orderData.userId,
            orderData.amount,
            orderData.status,
            orderData.paymentMethod,
            orderData.payment,
            orderData.products,
            orderData.deliveryMethod,
            orderData.shippingAddress,
        );
        await order.save();
        await Cart.delete(userId);

        return response.json({ success: true, message: "Заказ оформлен" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const placeOrderStripe = async (request, response) => {
    try {
        const { userId, products, amount, deliveryMethod, shippingAddress } = request.body;
        const { origin } = request.headers;
        const formattedPhone = formatPhoneNumber(shippingAddress.phone);
        shippingAddress.phone = formattedPhone;

        const deliveryCharge = deliveryMethod === "courier" ? 300 : 0;

        const orderData = {
            userId,
            amount: Number(amount),
            status: "Placed",
            paymentMethod: "Online",
            payment: false,
            products,
            deliveryMethod,
            shippingAddress,
        }

        const order = new Order(
            orderData.userId,
            orderData.amount,
            orderData.status,
            orderData.paymentMethod,
            orderData.payment,
            orderData.products,
            orderData.deliveryMethod,
            orderData.shippingAddress,
        );

        const orderId = await order.save();

        const line_items = products.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Стоимость доставки"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${orderId}`,
            cancel_url: `${origin}/verify?success=false&orderId=${orderId}`,
            line_items,
            mode: "payment",
        })

        return response.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const verifyYookassa = async (request, response) => {
    try {
        const { orderId, success, userId } = request.body;

        if (success === "true") {
            await Order.updatePaymentStatus(orderId, 1);
            await Cart.delete(userId);
            response.json({ success: true });
        } else {
            await Order.delete(orderId);
            response.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const allOrders = async (request, response) => {
    try {
        const orders = await Order.getList();
        return response.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const userOrders = async (request, response) => {
    try {
        const { userId } = request.body;
        const orders = await Order.getUserOrders(userId);
        return response.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const updateStatus = async (request, response) => {
    try {
        const { orderId, status } = request.body;
        await Order.updateStatus(orderId, status);
        return response.json({ success: true, message: "Статус обновлён" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const removeOrder = async (request, response) => {
    try {
        const orderId = request.body.id;
        await Order.delete(orderId);
        response.json({ success: true, message: "Заказ удалён" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const removeMultipleOrders = async (request, response) => {
    try {
        const { ids } = request.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response.json({ success: false, message: "Не выбраны заказы для удаления" });
        }

        await Order.deleteMultiple(ids);
        response.json({ success: true, message: "Выбранные заказы успешно удалены" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

export {
    placeOrder,
    placeOrderStripe,
    allOrders,
    userOrders,
    updateStatus,
    verifyYookassa,
    removeOrder,
    removeMultipleOrders,
}
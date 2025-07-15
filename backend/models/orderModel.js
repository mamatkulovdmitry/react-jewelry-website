import connectDB from "../config/database.js";

class Order {
    constructor(user_id, amount, status, payment_method, payment, products, delivery_method, shipping_address) {
        this.user_id = user_id,
        this.amount = amount,
        this.status = status,
        this.payment_method = payment_method,
        this.payment = payment,
        this.products = products,
        this.delivery_method = delivery_method,
        this.shipping_address = shipping_address
    };

    async save() {
        const dbConnection = await connectDB();
        try {
            const query = "INSERT INTO orders (user_id, amount, status, payment_method, payment, products, order_date, delivery_method, shipping_address) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)";
            const [order] = await dbConnection.execute(query, [this.user_id, this.amount, this.status, this.payment_method, this.payment, this.products, this.delivery_method, this.shipping_address]);
            return order.insertId;
        }
        finally {
            await dbConnection.end();
        }
    };

    static async getUserOrders(userId) {
        const dbConnection = await connectDB();
        try {
            const query = "SELECT * FROM orders WHERE user_id = ?";
            const [orders] = await dbConnection.execute(query, [userId]);
            return orders.length > 0 ? orders : null;
        }
        finally {
            await dbConnection.end();
        }
    };

    static async getList() {
        const dbConnection = await connectDB();
        try {
            const query = "SELECT * FROM orders ORDER BY id";
            const [orders] = await dbConnection.execute(query, []);
            return orders.length > 0 ? orders : null;
        }
        finally {
            await dbConnection.end();
        }
    };

    static async delete(orderId) {
        const dbConnection = await connectDB();
        try {
            const query = "DELETE FROM orders WHERE id = ?";
            const [result] = await dbConnection.execute(query, [orderId]);
        }
        finally {
            await dbConnection.end();
        }
    };

    static async deleteMultiple(ids) {
        const dbConnection = await connectDB();
        try {
            if (ids.length === 0) return true;
            const placeholders = ids.map(() => '?').join(',');
            const query = `DELETE FROM orders WHERE id IN (${placeholders})`;
            await dbConnection.execute(query, ids);
            return true;
        } catch (error) {
            throw error;
        } finally {
            if (dbConnection) await dbConnection.end();
        }
    };

    static async updateStatus(orderId, status) {
        const dbConnection = await connectDB();
        try {
            const query = "UPDATE orders SET status = ? WHERE id = ?";
            const [order] = await dbConnection.execute(query, [status, orderId]);
        }
        finally {
            await dbConnection.end();
        }
    };

    static async updatePaymentStatus(orderId, paymentStatus) {
        const dbConnection = await connectDB();
        try {
            const query = "UPDATE orders SET payment = ? WHERE id = ?";
            const [order] = await dbConnection.execute(query, [paymentStatus, orderId]);
        }
        finally {
            await dbConnection.end();
        }
    };
};

export default Order;
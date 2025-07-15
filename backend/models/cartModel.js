import connectDB from "../config/database.js";

class Cart {
    constructor(user_id, cart_data) {
        this.user_id = user_id,
        this.cart_data = cart_data
    };

    static async exists(userId) {
        const dbConnection = await connectDB();
        try {
            const query = "SELECT * FROM carts WHERE user_id = ?";
            const [cart] = await dbConnection.execute(query, [userId]);
            return cart.length > 0 ? cart[0] : null;
        }
        finally {
            await dbConnection.end();
        }
    };

    async save() {
        const dbConnection = await connectDB();
        try {
            const existingCart = await Cart.exists(this.user_id);
            if (existingCart) {
                const query = "UPDATE carts SET cart_data = ? WHERE user_id = ?";
                await dbConnection.execute(query, [this.cart_data, this.user_id]);
            } else {
                const query = "INSERT INTO carts (user_id, cart_data) VALUES (?, ?)";
                await dbConnection.query(query, [this.user_id, this.cart_data]);
            }
        }
        finally {
            await dbConnection.end();
        }
    };

    static async update(userId, cartData) {
        const dbConnection = await connectDB();
        try {
            const query = "UPDATE carts SET cart_data = ? WHERE user_id = ?";
            const [cart] = await dbConnection.execute(query, [cartData, userId]);
        }
        finally {
            await dbConnection.end();
        }
    };

    static async delete(userId) {
        const dbConnection = await connectDB();
        try {
            const query = "DELETE FROM carts WHERE user_id = ?";
            const [result] = await dbConnection.execute(query, [userId]);
        }
        finally {
            await dbConnection.end();
        }
    };
};

export default Cart;
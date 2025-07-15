import connectDB from "../config/database.js";

class User {
    constructor(first_name, last_name, email, phone, birth_date, password, is_admin) {
        this.first_name = first_name,
        this.last_name = last_name,
        this.email = email,
        this.phone = phone,
        this.birth_date = birth_date,
        this.password = password,
        this.is_admin = is_admin
    };

    static async exists(phone, email) {
        const dbConnection = await connectDB();
        try {
            const query = "SELECT * FROM users WHERE phone = ? OR email = ?";
            const [existingUsers] = await dbConnection.execute(query, [phone, email]);
            return existingUsers.length > 0 ? existingUsers[0] : null;
        }
        finally {
            await dbConnection.end();
        }
    };

    async save() {
        const dbConnection = await connectDB();
        try {
            const query = "INSERT INTO users (first_name, last_name, email, phone, birth_date, password, is_admin, created_at, last_activity) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
            const [user] = await dbConnection.execute(query, [this.first_name, this.last_name, this.email, this.phone, this.birth_date, this.password, this.is_admin]);
            return user.insertId;
        }
        finally {
            await dbConnection.end();
        }
    };

    static async updateRecentActivity(userId) {
        const dbConnection = await connectDB();
        try {
            const query = "UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE id = ?";
            const [user] = await dbConnection.execute(query, [userId]);
        }
        finally {
            await dbConnection.end();
        }
    };

    static async getInfo(userId) {
        const dbConnection = await connectDB();
        try {
            const query = "SELECT * FROM users WHERE id = ?";
            const [user] = await dbConnection.execute(query, [userId]);
            return user.length > 0 ? user[0] : null;
        }
        finally {
            await dbConnection.end();
        }
    };

    static async getInfoByEmail(email) {
        const dbConnection = await connectDB();
        try {
            const query = "SELECT * FROM users WHERE email = ?";
            const [user] = await dbConnection.execute(query, [email]);
            return user.length > 0 ? user[0] : null;
        }
        finally {
            await dbConnection.end();
        }
    };

    static async getList() {
        const dbConnection = await connectDB();
        try {
            const query = "SELECT * FROM users ORDER BY id";
            const [users] = await dbConnection.execute(query, []);
            return users.length > 0 ? users : null;
        }
        finally {
            await dbConnection.end();
        }
    };

    static async delete(userId) {
        const dbConnection = await connectDB();
        try {
            const query = "DELETE FROM users WHERE id = ?";
            const [result] = await dbConnection.execute(query, [userId]);
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
            const query = `DELETE FROM users WHERE id IN (${placeholders})`;
            await dbConnection.execute(query, ids);
            return true;
        } catch (error) {
            throw error;
        } finally {
            if (dbConnection) await dbConnection.end();
        }
    };

    static async update(userId, updateData) {
        const dbConnection = await connectDB();
        try {
            const query = `
                UPDATE users 
                SET
                    first_name = ?,
                    last_name = ?,
                    email = ?,
                    phone = ?,
                    birth_date = ?,
                    is_admin = ?
                WHERE id = ?
            `;
            const [result] = await dbConnection.execute(query, [
                updateData.first_name,
                updateData.last_name,
                updateData.email,
                updateData.phone,
                updateData.birth_date,
                updateData.is_admin,
                userId
            ]);
            return result;
        } finally {
            await dbConnection.end();
        }
    }

    static async updateProfile(userId, updateData) {
        const dbConnection = await connectDB();
        try {
            const query = `
                UPDATE users 
                SET
                    first_name = ?,
                    last_name = ?,
                    phone = ?
                WHERE id = ?
            `;
            const [result] = await dbConnection.execute(query, [
                updateData.first_name,
                updateData.last_name,
                updateData.phone,
                userId
            ]);
            return result;
        } finally {
            await dbConnection.end();
        }
    }

    static async updateSecurityProfile(userId, updateData) {
        const dbConnection = await connectDB();
        try {
            const query = `
                UPDATE users 
                SET
                    email = ?,
                    password = ?
                WHERE id = ?
            `;
            const [result] = await dbConnection.execute(query, [
                updateData.email,
                updateData.hashedPassword,
                userId
            ]);
            return result;
        } finally {
            await dbConnection.end();
        }
    }
};

export default User;
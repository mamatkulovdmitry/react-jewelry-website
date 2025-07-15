import connectDB from "../config/database.js";

class Product {
    constructor(uuid, category, material, name, description, weight, sex, sizes, price, is_bestseller, is_visible, image) {
        this.uuid = uuid;
        this.category = category;
        this.material = material;
        this.name = name;
        this.description = description;
        this.weight = weight;
        this.sex = sex;
        this.sizes = sizes;
        this.price = price;
        this.is_bestseller = is_bestseller;
        this.is_visible = is_visible;
        this.image = image;
    };

    static async getList() {
        const dbConnection = await connectDB();
        try {
            const query = `SELECT 
                products.id,
                products.uuid,
                products.name,
                products.description,
                products.category,
                products.material,
                products.weight,
                CASE 
                    WHEN products.sex = "Man" THEN "Для мужчин"
                    WHEN products.sex = "Woman" THEN "Для женщин"
                    WHEN products.sex = "Kids" THEN "Для детей"
                    ELSE "Не указан"
                END AS sex,
                products.sizes,
                products.price,
                products.is_bestseller,
                products.is_visible,
                products.image
                FROM products
            `;
            const [products] = await dbConnection.execute(query, []);
            return products;
        }
        finally {
            await dbConnection.end();
        }
    };

    async save() {
        const dbConnection = await connectDB();
        try {
            const query = `INSERT INTO products 
                (uuid, category, material, name, description, weight, sex, sizes, price, is_bestseller, is_visible, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            await dbConnection.execute(query, [
                this.uuid,
                this.category,
                this.material,
                this.name,
                this.description,
                this.weight,
                this.sex,
                JSON.stringify(this.sizes),
                this.price,
                this.is_bestseller,
                this.is_visible,
                JSON.stringify(this.image)
            ]);
        } finally {
            await dbConnection.end();
        }
    }

    async update() {
        const dbConnection = await connectDB();
        try {
            const query = `
                UPDATE products 
                SET
                    category = ?,
                    material = ?,
                    name = ?,
                    description = ?,
                    weight = ?,
                    sex = ?,
                    sizes = ?,
                    price = ?,
                    is_bestseller = ?,
                    is_visible = ?,
                    image = ?
                WHERE uuid = ?
            `;
            await dbConnection.execute(query, [
                this.category,
                this.material,
                this.name,
                this.description,
                this.weight,
                this.sex,
                JSON.stringify(this.sizes),
                this.price,
                this.is_bestseller,
                this.is_visible,
                JSON.stringify(this.image),
                this.uuid
            ]);
        } finally {
            await dbConnection.end();
        }
    }

    static async delete(productId) {
        const dbConnection = await connectDB();
        try {
            const query = "DELETE FROM products WHERE id = ?";
            const [result] = await dbConnection.execute(query, [productId]);
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
            const query = `DELETE FROM products WHERE id IN (${placeholders})`;
            await dbConnection.execute(query, ids);
            return true;
        } catch (error) {
            throw error;
        } finally {
            if (dbConnection) await dbConnection.end();
        }
    };

    static async getInfo(productId) {
        const dbConnection = await connectDB();
        try {
            const query = "SELECT * FROM products WHERE id = ?";
            const [product] = await dbConnection.execute(query, [productId]);
            return product.length > 0 ? product[0] : null;
        }
        finally {
            await dbConnection.end();
        }
    };

    static async getInfoByUuid(productId) {
        const dbConnection = await connectDB();
        try {
            const query = "SELECT * FROM products WHERE uuid = ?";
            const [product] = await dbConnection.execute(query, [productId]);
            return product.length > 0 ? product[0] : null;
        }
        finally {
            await dbConnection.end();
        }
    };
};

export default Product;
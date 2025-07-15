import mysql from "mysql2/promise";

async function connectDB() {
    try {
        const dbConnection = await mysql.createConnection(`${process.env.DATABASE_URL}`);
        console.log("Connected to database.");
        return dbConnection;
    } catch (error) {
        console.error("Error connecting to database: ", error.message);
    }
};

export default connectDB;
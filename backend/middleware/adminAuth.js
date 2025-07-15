import jwt from "jsonwebtoken";

const adminAuth = async (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return response.status(401).json({
                success: false,
                message: "Пожалуйста, авторизуйтесь и попробуйте снова"
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return response.status(401).json({
                success: false,
                message: "Пожалуйста, авторизуйтесь и попробуйте снова"
            });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

        if (tokenDecode.role !== 'admin') {
            return response.status(403).json({
                success: false,
                message: "Доступ запрещён"
            });
        }

        request.user = tokenDecode;
        next();
    } catch (error) {
        console.log(error);

        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return response.status(401).json({
                success: false,
                message: "Токен недействителен или истёк"
            });
        }

        response.status(500).json({
            success: false,
            message: "Ошибка сервера"
        });
    }
};

export default adminAuth;
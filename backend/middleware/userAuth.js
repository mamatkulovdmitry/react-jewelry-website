import jwt from "jsonwebtoken";

const userAuth = async (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return response.status(401).json({
                success: false,
                message: "Требуется авторизация"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return response.status(401).json({
                success: false,
                message: "Токен отсутствует"
            });
        }

        try {
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

            request.user = tokenDecode;
            request.body.userId = tokenDecode.id;

            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return response.status(401).json({
                    success: false,
                    message: "Токен истёк"
                });
            }

            if (error.name === "JsonWebTokenError") {
                return response.status(401).json({
                    success: false,
                    message: "Неверный токен"
                });
            }
            throw error;
        }
    } catch (error) {
        console.error("Ошибка в userAuth:", error);

        return response.status(500).json({
            success: false,
            message: "Ошибка сервера при проверке авторизации"
        });
    }
};

export default userAuth;
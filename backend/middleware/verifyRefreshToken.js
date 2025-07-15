import jwt from "jsonwebtoken";

export const verifyRefreshToken = (request, response, next) => {
    try {
        const refreshToken = request.cookies.refreshToken;

        if (!refreshToken) {
            return response.status(403).json({ message: "Refresh токен не найден" });
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        request.user = payload;
        next();
    } catch (error) {
        console.log(error);
        return response.status(403).json({ success: false, message: "Неверный refresh токен" });
    }
};
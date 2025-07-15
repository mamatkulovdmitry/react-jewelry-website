import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createAccessToken = (id, role) => {
    const payload = { id, role };
    const expiresIn = role === "admin" ? "1h" : "15m";
    //const expiresIn = role === "admin" ? "2m" : "2m";
    const options = {
        expiresIn,
        algorithm: "HS256",
    }
    const secret = role === "admin" ? process.env.JWT_ADMIN_SECRET : process.env.JWT_SECRET;
    return jwt.sign(payload, secret, options);
};

const createRefreshToken = (id, role) => {
    const payload = { id, role };
    const options = {
        expiresIn: "7d",
        algorithm: "HS256",
    }
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, options);
};

const refreshAccessToken = (request, response) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        console.log("Refresh token from cookies:", refreshToken);

        if (!refreshToken) {
            return response.status(403).json({ message: "Refresh токен не найден" });
        };

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (!payload.role) {
            return response.status(403).json({ success: false, message: "В токене не найдена роль пользователя" });
        };

        const accessToken = createAccessToken(payload.id, payload.role);
        response.json({ success: true, accessToken });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const loginUser = async (request, response) => {
    try {
        const { loginEmail, loginPassword } = request.body;

        const user = await User.exists(null, loginEmail);
        if (!user) {
            return response.json({ success: false, message: "Неверный email или пароль" });
        }

        if (user.is_admin) {
            return response.json({
                success: false,
                message: "Доступ запрещен. Пройти авторизацию можно только пользователям"
            });
        }

        const isMatch = await bcrypt.compare(loginPassword, user.password);
        if (isMatch) {
            const accessToken = createAccessToken(user.id, "user");
            const refreshToken = createRefreshToken(user.id, "user");

            response.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            await User.updateRecentActivity(user.id);
            response.json({ success: true, accessToken });
        }
        else {
            return response.json({ success: false, message: "Неверный email или пароль" });
        }
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const registerUser = async (request, response) => {
    try {
        const { firstName, lastName, email, phone, date, password } = request.body;

        const exists = await User.exists(phone, email);
        if (exists) {
            return response.json({ success: false, message: "Неверный email или пароль" });
        }

        if (!validator.isEmail(email)) {
            return response.json({ success: false, message: "Пожалуйста, введите правильный email" });
        }
        if (password.length < 8) {
            return response.json({ success: false, message: "Пожалуйста, введите надёжный пароль" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User(firstName, lastName, email, phone, date, hashedPassword, "user" === 0);
        const user = await newUser.save();

        const accessToken = createAccessToken(user, "user");
        const refreshToken = createRefreshToken(user, "user");

        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        response.json({ success: true, accessToken });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const editUser = async (request, response) => {
    try {
        const userId = request.params.id;
        const { first_name, last_name, email, phone, birth_date, is_admin } = request.body;

        if (!first_name || !email) {
            return response.status(400).json({
                success: false,
                message: 'Имя и email являются обязательными полями'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return response.status(400).json({
                success: false,
                message: 'Неверный формат email'
            });
        }

        const existingUser = await User.exists(phone, email);
        if (existingUser && existingUser.id !== parseInt(userId)) {
            return response.status(400).json({
                success: false,
                message: 'Этот email или телефон уже используется другим пользователем'
            });
        }

        const updateData = {
            first_name,
            last_name: last_name || null,
            email,
            phone: phone || null,
            birth_date: birth_date || null,
            is_admin: is_admin ? 1 : 0,
            updated_at: new Date()
        };

        const result = await User.update(userId, updateData);

        if (result.affectedRows === 0) {
            return response.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        const updatedUser = await User.getInfo(userId);
        response.json({
            success: true,
            message: 'Данные пользователя успешно обновлены',
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return response.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const addUser = async (request, response) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            birth_date,
            password,
            role
        } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                success: false,
                message: "Email и пароль являются обязательными для заполнения"
            });
        }

        if (!validator.isEmail(email)) {
            return response.status(400).json({
                success: false,
                message: "Пожалуйста, введите правильный email"
            });
        }

        if (password.length < 8) {
            return response.status(400).json({
                success: false,
                message: "Пожалуйста, введите надёжный пароль"
            });
        }

        const exists = await User.exists(email, phone);
        if (exists) {
            return response.status(409).json({
                success: false,
                message: "Этот email или телефон уже используется другим пользователем"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User(
            first_name,
            last_name,
            email,
            phone,
            birth_date,
            hashedPassword,
            role === 'admin'
        );

        const user = await newUser.save();

        response.status(201).json({
            success: true,
            message: "Пользователь успешно добавлен",
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.is_admin ? 'admin' : 'user',
            },
        });
    } catch (error) {
        console.error("Error adding user:", error);
        response.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const getUserDataById = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await User.getInfo(id);
        response.json({ success: true, user });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const getUserDataForProfile = async (request, response) => {
    try {
        const { userId } = request.body;
        const user = await User.getInfo(userId);
        response.json({ success: true, user });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const updateUserDataForProfile = async (request, response) => {
    try {
        const { userId, first_name, last_name, phone } = request.body;

        const updateData = {
            first_name,
            last_name: last_name || null,
            phone: phone || null,
        };

        const user = await User.updateProfile(userId, updateData);
        response.json({ success: true, user });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const updateUserDataForSecurityProfile = async (request, response) => {
    try {
        const { userId, email, current_password, new_password } = request.body;

        const user = await User.exists(null, email);
        if (!user) {
            return response.json({ success: false, message: "Пользователь не существует" });
        }

        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
            return response.json({ success: false, message: "Неверные данные" });
        }

        if (!validator.isEmail(email)) {
            return response.json({ success: false, message: "Пожалуйста, введите правильный email" });
        }

        if (new_password.length < 8) {
            return response.json({ success: false, message: "Пожалуйста, введите надёжный пароль" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        const updateData = {
            email,
            hashedPassword,
        };

        const newUserData = await User.updateSecurityProfile(userId, updateData);
        response.json({ success: true, newUserData });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const adminLogin = async (request, response) => {
    try {
        const { email, password } = request.body;

        const user = await User.getInfoByEmail(email);
        if (!user) {
            return response.json({ success: false, message: "Неверный email или пароль" });
        }

        if (!user.is_admin) {
            return response.json({
                success: false,
                message: "Доступ запрещен. Недостаточно прав"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return response.json({
                success: false,
                message: "Неверный email или пароль"
            });
        }

        const accessToken = createAccessToken(user.id, "admin");
        const refreshToken = createRefreshToken(user.id, "admin");

        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        response.json({ success: true, accessToken });
    } catch (error) {
        console.error('Ошибка входа:', error);
        response.status(500).json({
            success: false,
            message: "Произошла ошибка при входе в систему"
        });
    }
};

const removeUser = async (request, response) => {
    try {
        const userId = request.body.id;
        await User.delete(userId);
        response.json({ success: true, message: "Пользователь удалён" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: "Произошла ошибка при удалении пользователя. Возможно, есть заказы, связанные с данным пользователем" });
    }
};

const removeMultipleUsers = async (request, response) => {
    try {
        const { ids } = request.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response.json({ success: false, message: "Не выбраны пользователи для удаления" });
        }

        await User.deleteMultiple(ids);
        response.json({ success: true, message: "Выбранные пользователи успешно удалены" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: "Произошла ошибка при удалении выбранных пользователей. Возможно, есть заказы, связанные с данными пользователями" });
    }
};

const getUserData = async (request, response) => {
    try {
        const { userId } = request.body;
        const userData = await User.getInfo(userId);
        response.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const getUserList = async (request, response) => {
    try {
        const userList = await User.getList();
        response.json({ success: true, userList });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

export {
    loginUser,
    registerUser,
    adminLogin,
    getUserData,
    addUser,
    removeUser,
    removeMultipleUsers,
    getUserList,
    getUserDataById,
    editUser,
    getUserDataForProfile,
    updateUserDataForProfile,
    updateUserDataForSecurityProfile,
    refreshAccessToken,
};
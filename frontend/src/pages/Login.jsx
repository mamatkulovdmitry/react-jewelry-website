import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import InputMask from "@mona-health/react-input-mask";
import api from "../services/apiService";

const Login = () => {
    const [currentState, setCurrentState] = useState("Авторизация");
    const { token, setToken, navigate, backendUrl, getUserCart } = useContext(ShopContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [date, setDate] = useState("");
    const [displayDate, setDisplayDate] = useState("");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const formSwitchVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 }
    };

    const handleChangePhone = (event) => {
        setPhone(event.target.value);
    };

    const handleDateChange = (e) => {
        const inputDate = e.target.value;
        setDisplayDate(inputDate);

        if (inputDate.length === 10) {
            const [day, month, year] = inputDate.split('.');
            const apiDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            setDate(apiDate);
        } else {
            setDate("");
        }
    };

    const validateAge = (birthDate) => {
        if (!birthDate) return false;

        const [year, month, day] = birthDate.split('-');
        const birthDateObj = new Date(`${year}-${month}-${day}`);
        const currentDate = new Date();

        let age = currentDate.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDateObj.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDateObj.getDate())) {
            age--;
        }

        return age >= 18;
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (currentState === "Регистрация") {
                if (phone.includes("_") || phone.length < 17) {
                    toast.error("Введите корректный номер телефона");
                    return;
                }

                if (!validateAge(date)) {
                    toast.error("Вы должны быть не моложе 18 лет");
                    return;
                }

                const response = await api.post("/api/user/register", {
                    firstName,
                    lastName,
                    email,
                    phone,
                    date,
                    password
                });

                if (response.data.success) {
                    setToken(response.data.accessToken);
                    localStorage.setItem("token", response.data.accessToken);
                    await getUserCart(response.data.accessToken);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const response = await api.post("/api/user/login", { loginEmail, loginPassword });
                if (response.data.success) {
                    setToken(response.data.accessToken);
                    localStorage.setItem("token", response.data.accessToken);
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        if (token) {
            getUserCart(token).then(() => {
                navigate("/");
            });
        }
    }, [token]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
        >
            <motion.form
                className={`flex flex-col items-center w-[90%] ${currentState === "Авторизация" ? "sm:max-w-96" : "sm:max-w-xl"} m-auto mt-14 gap-4 text-gray-800`}
                onSubmit={onSubmitHandler}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="inline-flex items-center gap-2 mb-2 mt-10"
                    variants={itemVariants}
                >
                    <p className="prata-regular text-3xl">{currentState}</p>
                    <motion.hr
                        className="border-none h-[1.5px] w-8 bg-gray-800"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3 }}
                    />
                </motion.div>
                <AnimatePresence mode="wait">
                    {currentState === "Авторизация" ? (
                        <motion.div
                            key="login"
                            variants={formSwitchVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full"
                        >
                            <motion.div className="w-full" variants={itemVariants}>
                                <label className="block font-medium text-sm mb-2">
                                    Email
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    onChange={(event) => setLoginEmail(event.target.value)}
                                    value={loginEmail}
                                    required
                                />
                            </motion.div>
                            <motion.div className="w-full mt-4" variants={itemVariants}>
                                <label className="block font-medium text-sm mb-2">
                                    Пароль
                                </label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={(event) => setLoginPassword(event.target.value)}
                                    value={loginPassword}
                                    required
                                />
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            variants={formSwitchVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full"
                        >
                            <motion.div
                                className="w-full grid grid-cols-none gap-4 sm:grid-cols-2"
                                variants={containerVariants}
                            >
                                <motion.div className="w-full" variants={itemVariants}>
                                    <label className="block font-medium text-sm mb-2">
                                        Фамилия
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                                        type="text"
                                        placeholder="Иванов"
                                        onChange={(event) => setLastName(event.target.value)}
                                        value={lastName}
                                        required
                                    />
                                </motion.div>
                                <motion.div className="w-full" variants={itemVariants}>
                                    <label className="block font-medium text-sm mb-2">
                                        Имя
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                                        type="text"
                                        placeholder="Иван"
                                        onChange={(event) => setFirstName(event.target.value)}
                                        value={firstName}
                                        required
                                    />
                                </motion.div>
                                <motion.div className="w-full" variants={itemVariants}>
                                    <label className="block font-medium text-sm mb-2">
                                        Email
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                                        type="email"
                                        placeholder="example@gmail.com"
                                        onChange={(event) => setEmail(event.target.value)}
                                        value={email}
                                        required
                                    />
                                </motion.div>
                                <motion.div className="w-full" variants={itemVariants}>
                                    <label className="block font-medium text-sm mb-2">
                                        Телефон
                                    </label>
                                    <InputMask
                                        mask={"+7 (999) 999-99-99"}
                                        value={phone}
                                        onChange={handleChangePhone}
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                                        placeholder="+7 (___) ___-__-__"
                                        required
                                    />
                                </motion.div>
                                <motion.div className="w-full" variants={itemVariants}>
                                    <label className="block font-medium text-sm mb-2">
                                        Дата рождения
                                    </label>
                                    <InputMask
                                        mask="99.99.9999"
                                        value={displayDate}
                                        onChange={handleDateChange}
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                                        placeholder="ДД.ММ.ГГГГ"
                                        required
                                    />
                                    {date && !validateAge(date) && (
                                        <motion.p
                                            className="text-red-500 text-xs mt-1"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            Вы должны быть не моложе 18 лет
                                        </motion.p>
                                    )}
                                </motion.div>
                                <motion.div className="w-full" variants={itemVariants}>
                                    <label className="block font-medium text-sm mb-2">
                                        Пароль
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                                        type="password"
                                        placeholder="••••••••"
                                        onChange={(event) => setPassword(event.target.value)}
                                        value={password}
                                        required
                                    />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    className={`w-full flex text-sm mt-[-8px] justify-end`}
                    variants={itemVariants}
                >
                    {currentState === "Авторизация" ? (
                        <motion.p
                            className="cursor-pointer hover:underline"
                            onClick={() => setCurrentState("Регистрация")}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Создать аккаунт
                        </motion.p>
                    ) : (
                        <motion.p
                            className="cursor-pointer hover:underline"
                            onClick={() => setCurrentState("Авторизация")}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Уже есть аккаунт?
                        </motion.p>
                    )}
                </motion.div>
                <motion.button
                    className="bg-black text-white font-light px-8 py-2 mt-4"
                    variants={itemVariants}
                    whileHover={{
                        scale: 1.03,
                        boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
                    }}
                    whileTap={{ scale: 0.97 }}
                >
                    {currentState === "Авторизация" ? "Войти" : "Зарегистрироваться"}
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default Login;
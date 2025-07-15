import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import InputMask from "@mona-health/react-input-mask";
import validator from "validator";
import api from "../services/apiService";

const AddUser = ({ token }) => {
    const initialFormState = {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        birth_date: "",
        password: "",
        role: "user"
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const buttonVariants = {
        hover: {
            scale: 1.03,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        },
        tap: { scale: 0.98 }
    };

    const handleDateChange = (e) => {
        const inputDate = e.target.value;
        setDisplayDate(inputDate);

        if (inputDate.length === 10) {
            const [day, month, year] = inputDate.split('.');
            const apiDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            setFormData(prev => ({
                ...prev,
                birth_date: apiDate
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                birth_date: ""
            }));
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        setFormData(initialFormState);
        setDisplayDate("");
        toast.info("Форма очищена");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAge(formData.birth_date)) {
            toast.error("Пользователь должен быть не моложе 18 лет");
            return;
        }

        // Валидация
        if (!formData.email || !formData.password) {
            toast.warning("Пожалуйста, заполните обязательные поля");
            setIsSubmitting(false);
            return;
        }

        if (!validator.isEmail(formData.email)) {
            toast.warning("Пожалуйста, введите корректный email");
            setIsSubmitting(false);
            return;
        }

        if (formData.password.length < 8) {
            toast.warning("Пароль должен содержать минимум 8 символов");
            setIsSubmitting(false);
            return;
        }

        try {
            setIsSubmitting(true);

            const userData = {
                ...formData,
                is_admin: formData.role === "admin",
                phone: formData.phone
            };

            const response = await api.post(`/api/user/add`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                toast.success("Пользователь успешно добавлен");
                setFormData(initialFormState);
                setDisplayDate("");
            } else {
                toast.error(response.data.message || "Ошибка при добавлении пользователя");
            }
        } catch (error) {
            console.error("Ошибка при отправке формы:", error);
            toast.error(error.response?.data?.message || "Произошла ошибка при добавлении пользователя");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className="p-4 md:p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.h1
                className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                Добавление пользователя
            </motion.h1>
            <motion.form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg border border-slate-300 p-4 md:p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" variants={containerVariants}>
                    <motion.div variants={itemVariants}>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Имя
                        </label>
                        <motion.input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            disabled={isSubmitting}
                            whileFocus={{ scale: 1 }}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Фамилия
                        </label>
                        <motion.input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            disabled={isSubmitting}
                            whileFocus={{ scale: 1 }}
                        />
                    </motion.div>
                </motion.div>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" variants={containerVariants}>
                    <motion.div variants={itemVariants}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                            disabled={isSubmitting}
                            whileFocus={{ scale: 1 }}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Телефон
                        </label>
                        <motion.div whileFocus={{ scale: 1 }}>
                            <InputMask
                                type="tel"
                                id="phone"
                                name="phone"
                                mask="+7 (999) 999-99-99"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="+7 (___) ___-__-__"
                                disabled={isSubmitting}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" variants={containerVariants}>
                    <motion.div variants={itemVariants}>
                        <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                            Дата рождения
                        </label>
                        <motion.div whileFocus={{ scale: 1 }}>
                            <InputMask
                                mask="99.99.9999"
                                value={displayDate}
                                onChange={handleDateChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="ДД.ММ.ГГГГ"
                                disabled={isSubmitting}
                            />
                        </motion.div>
                        <AnimatePresence>
                            {formData.birth_date && !validateAge(formData.birth_date) && (
                                <motion.p
                                    className="text-red-500 text-xs mt-1"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    Пользователь должен быть не моложе 18 лет
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Пароль <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                            minLength="8"
                            disabled={isSubmitting}
                            whileFocus={{ scale: 1 }}
                        />
                    </motion.div>
                </motion.div>
                <motion.div className="mb-6" variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Роль пользователя <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["user", "admin"].map(role => (
                            <motion.label
                                key={role}
                                className="flex items-center space-x-2 cursor-pointer"
                                whileHover={{ x: 5 }}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={role}
                                    checked={formData.role === role}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    disabled={isSubmitting}
                                    required
                                />
                                <span className="text-sm text-gray-700">
                                    {role === "admin" ? "Администратор" : "Пользователь"}
                                </span>
                            </motion.label>
                        ))}
                    </div>
                </motion.div>
                <motion.div
                    className="flex justify-end gap-4 mt-8 flex-col sm:flex-row"
                    variants={itemVariants}
                >
                    <motion.button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        disabled={isSubmitting}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Отмена
                    </motion.button>
                    <motion.button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                        disabled={isSubmitting || !formData.email || !formData.password}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <motion.svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </motion.svg>
                                Добавление...
                            </span>
                        ) : 'Добавить пользователя'}
                    </motion.button>
                </motion.div>
            </motion.form>
        </motion.div>
    );
};

export default AddUser;
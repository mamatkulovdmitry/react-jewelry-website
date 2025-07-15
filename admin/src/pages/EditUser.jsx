import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import InputMask from "@mona-health/react-input-mask";
import api from "../services/apiService";

const EditUser = ({ token }) => {
    const [date, setDate] = useState("");
    const [displayDate, setDisplayDate] = useState("");
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        birth_date: "",
        is_admin: false
    });

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

    const errorVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 }
    };

    const handleDateChange = (e) => {
        const inputDate = e.target.value;
        setDisplayDate(inputDate);

        if (inputDate.length === 10) {
            const [day, month, year] = inputDate.split('.');
            const apiDate = `${year}-${month}-${day}`;
            setDate(apiDate);
            setFormData(prev => ({
                ...prev,
                birth_date: apiDate
            }));
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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/api/user/single/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const user = response.data.user;

                setFormData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    birth_date: user.birth_date ? formatUTCToLocalDate(user.birth_date) : "",
                    is_admin: user.is_admin === 1 || user.is_admin === true
                });
                setDisplayDate(user.birth_date ? new Date(user.birth_date).toLocaleDateString('ru-RU') : "")

            } catch (error) {
                console.error("Ошибка загрузки пользователя:", error);
                toast.error("Не удалось загрузить данные пользователя");
                navigate('/admin/users');
            } finally {
                setIsLoading(false);
            }
        };

        function formatUTCToLocalDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        fetchUser();
    }, [id, navigate, token]);

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.birth_date && !validateAge(formData.birth_date)) {
            toast.error("Пользователь должен быть не моложе 18 лет");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await api.patch(
                `/api/user/update/${id}`,
                {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone: formData.phone,
                    birth_date: formData.birth_date,
                    is_admin: formData.is_admin
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success("Данные пользователя успешно обновлены");
                navigate('/admin/users');
            } else {
                toast.error(response.data.message || "Ошибка при обновлении пользователя");
            }
        } catch (error) {
            console.error("Ошибка при отправке формы:", error);
            toast.error(error.response?.data?.message || "Произошла ошибка при обновлении пользователя");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <motion.div
                className="flex justify-center items-center min-h-[300px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
            </motion.div>
        );
    }

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
                Редактирование пользователя
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
                            Имя <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
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
                <motion.div className="mb-6" variants={itemVariants}>
                    <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                        Дата рождения
                    </label>
                    <motion.div whileFocus={{ scale: 1 }}>
                        <InputMask
                            mask="99.99.9999"
                            value={displayDate}
                            onChange={handleDateChange}
                            disabled={isSubmitting}
                            placeholder="ДД.ММ.ГГГГ"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        />
                    </motion.div>
                    <AnimatePresence>
                        {formData.birth_date && !validateAge(formData.birth_date) && (
                            <motion.p
                                className="text-red-500 text-xs mt-1"
                                variants={errorVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                Пользователь должен быть не моложе 18 лет
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
                <motion.div className="flex items-center mb-8" variants={itemVariants}>
                    <div className="flex items-center h-5">
                        <motion.input
                            id="is_admin"
                            name="is_admin"
                            type="checkbox"
                            checked={formData.is_admin}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    </div>
                    <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-700">
                        Администратор
                    </label>
                </motion.div>
                <motion.div
                    className="flex justify-end space-x-4"
                    variants={itemVariants}
                >
                    <motion.button
                        type="button"
                        onClick={() => navigate('/admin/users')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Отмена
                    </motion.button>
                    <motion.button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Сохранение...
                            </span>
                        ) : 'Сохранить изменения'}
                    </motion.button>
                </motion.div>
            </motion.form>
        </motion.div>
    );
};

export default EditUser;
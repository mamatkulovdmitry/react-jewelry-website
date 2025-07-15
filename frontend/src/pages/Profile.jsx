import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import InputMask from "@mona-health/react-input-mask";
import { FiEdit, FiSave, FiX } from "react-icons/fi";
import Title from "../components/Title";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/apiService";

const Profile = () => {
    const { backendUrl, token } = useContext(ShopContext);
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        created_at: ""
    });

    const [editMode, setEditMode] = useState({
        profile: false,
        security: false
    });

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        current_password: "",
        new_password: "",
        confirm_password: ""
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const user = response.data.user || response.data;
                setUserData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    created_at: user.created_at || ""
                });

                setFormData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    current_password: "",
                    new_password: "",
                    confirm_password: ""
                });

            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
                toast.error("Не удалось загрузить данные профиля");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

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

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.patch(
                `/api/user/profile`,
                {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setUserData(prev => ({
                    ...prev,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone
                }));
                setEditMode(prev => ({ ...prev, profile: false }));
                toast.success("Данные профиля успешно обновлены");
            } else {
                toast.error(response.data.message || "Ошибка при обновлении профиля");
            }
        } catch (error) {
            console.error("Ошибка при обновлении профиля:", error);
            toast.error(error.response?.data?.message || "Произошла ошибка при обновлении профиля");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSecuritySubmit = async (e) => {
        e.preventDefault();

        if (formData.new_password !== formData.confirm_password) {
            toast.error("Новые пароли не совпадают");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await api.patch(
                `/api/user/security-profile`,
                {
                    email: formData.email,
                    current_password: formData.current_password,
                    new_password: formData.new_password
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setUserData(prev => ({
                    ...prev,
                    email: formData.email
                }));
                setFormData(prev => ({
                    ...prev,
                    current_password: "",
                    new_password: "",
                    confirm_password: ""
                }));
                setEditMode(prev => ({ ...prev, security: false }));
                toast.success("Данные безопасности успешно обновлены");
            } else {
                toast.error(response.data.message || "Ошибка при обновлении данных");
            }
        } catch (error) {
            console.error("Ошибка при обновлении данных:", error);
            toast.error(error.response?.data?.message || "Произошла ошибка при обновлении данных");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-4 sm:py-8"
        >
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="text-xl sm:text-2xl mb-3"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Title text1={"МОЙ"} text2={"ПРОФИЛЬ"} />
                </motion.div>
                <motion.div
                    className="bg-white rounded-lg overflow-hidden border border-gray-300"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="p-4 sm:p-6 border-b border-gray-300">
                        <motion.div
                            className="flex flex-col items-start justify-between gap-4 mb-4 sm:mb-6 sm:flex-row sm:items-center"
                            variants={itemVariants}
                        >
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                                Основная информация
                            </h2>
                            {!editMode.profile ? (
                                <motion.button
                                    onClick={() => setEditMode(prev => ({ ...prev, profile: true }))}
                                    className="border border-black text-xs sm:text-sm hover:bg-black hover:text-white transition-all duration-500 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <FiEdit size={16} />
                                    Редактировать
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={() => setEditMode(prev => ({ ...prev, profile: false }))}
                                    className="border-black text-xs sm:text-sm duration-500 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <FiX size={16} />
                                    Отменить
                                </motion.button>
                            )}
                        </motion.div>
                        <AnimatePresence mode="wait">
                            {!editMode.profile ? (
                                <motion.div
                                    key="profile-view"
                                    variants={formSwitchVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                                >
                                    <motion.div className="min-w-0" variants={itemVariants}>
                                        <p className="text-xs sm:text-sm text-gray-500">Имя</p>
                                        <p className="text-base sm:text-lg font-medium text-gray-800 truncate">
                                            {userData.first_name || "Не указано"}
                                        </p>
                                    </motion.div>
                                    <motion.div className="min-w-0" variants={itemVariants}>
                                        <p className="text-xs sm:text-sm text-gray-500">Фамилия</p>
                                        <p className="text-base sm:text-lg font-medium text-gray-800 truncate">
                                            {userData.last_name || "Не указана"}
                                        </p>
                                    </motion.div>
                                    <motion.div className="min-w-0" variants={itemVariants}>
                                        <p className="text-xs sm:text-sm text-gray-500">Телефон</p>
                                        <p className="text-base sm:text-lg font-medium text-gray-800 truncate">
                                            {userData.phone || "Не указан"}
                                        </p>
                                    </motion.div>
                                    <motion.div className="min-w-0" variants={itemVariants}>
                                        <p className="text-xs sm:text-sm text-gray-500">Дата регистрации</p>
                                        <p className="text-base sm:text-lg font-medium text-gray-800">
                                            {formatDate(userData.created_at)}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="profile-edit"
                                    onSubmit={handleProfileSubmit}
                                    variants={formSwitchVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-4 sm:space-y-6"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <motion.div variants={itemVariants}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Имя</label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-800"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={itemVariants}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-800"
                                            />
                                        </motion.div>
                                        <motion.div variants={itemVariants}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Телефон</label>
                                            <InputMask
                                                type="tel"
                                                name="phone"
                                                mask="+7 (999) 999-99-99"
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-800"
                                                placeholder="+7 (___) ___-__-__"
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.div
                                        className="flex justify-end"
                                        variants={itemVariants}
                                    >
                                        <motion.button
                                            type="submit"
                                            className="bg-black text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1 sm:gap-2 transition-colors disabled:opacity-50"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Сохранение...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSave size={16} className="sm:h-4 sm:w-4" />
                                                    Сохранить изменения
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="p-4 sm:p-6">
                        <motion.div
                            className="flex flex-col items-start justify-between gap-4 mb-4 sm:mb-6 sm:flex-row sm:items-center"
                            variants={itemVariants}
                        >
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                                Безопасность
                            </h2>
                            {!editMode.security ? (
                                <motion.button
                                    onClick={() => setEditMode(prev => ({ ...prev, security: true }))}
                                    className="border border-black text-xs sm:text-sm hover:bg-black hover:text-white transition-all duration-500 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <FiEdit size={16} />
                                    Изменить
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={() => setEditMode(prev => ({ ...prev, security: false }))}
                                    className="border-black text-xs sm:text-sm duration-500 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <FiX size={16} />
                                    Отменить
                                </motion.button>
                            )}
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {!editMode.security ? (
                                <motion.div
                                    key="security-view"
                                    variants={formSwitchVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                                >
                                    <motion.div className="min-w-0" variants={itemVariants}>
                                        <p className="text-xs sm:text-sm text-gray-500">Email</p>
                                        <p className="text-base sm:text-lg font-medium text-gray-800 break-all">
                                            {userData.email}
                                        </p>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <p className="text-xs sm:text-sm text-gray-500">Пароль</p>
                                        <p className="text-base sm:text-lg font-medium text-gray-800">••••••••</p>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="security-edit"
                                    onSubmit={handleSecuritySubmit}
                                    variants={formSwitchVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-4 sm:space-y-6"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <motion.div className="sm:col-span-2" variants={itemVariants}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-800"
                                                required
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.div
                                        className="space-y-3 sm:space-y-4"
                                        variants={itemVariants}
                                    >
                                        <h3 className="text-base sm:text-lg font-medium text-gray-800">Смена пароля</h3>
                                        <motion.div variants={itemVariants}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Текущий пароль</label>
                                            <input
                                                type="password"
                                                name="current_password"
                                                value={formData.current_password}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-800"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={itemVariants}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
                                            <input
                                                type="password"
                                                name="new_password"
                                                value={formData.new_password}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-800"
                                                required
                                            />
                                        </motion.div>
                                        <motion.div variants={itemVariants}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Подтвердите новый пароль</label>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                                className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-800"
                                                required
                                            />
                                        </motion.div>
                                    </motion.div>
                                    <motion.div
                                        className="flex justify-end"
                                        variants={itemVariants}
                                    >
                                        <motion.button
                                            type="submit"
                                            className="bg-black text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1 sm:gap-2 transition-colors disabled:opacity-50"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Сохранение...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSave size={16} className="sm:h-4 sm:w-4" />
                                                    Сохранить изменения
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Profile;
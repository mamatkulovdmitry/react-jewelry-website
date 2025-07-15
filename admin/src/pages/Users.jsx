import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import api from "../services/apiService";

const Users = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [filterUsers, setFilterUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const usersPerPage = 10;

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

    const tableRowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3
            }
        }),
        hover: {
            backgroundColor: "rgba(243, 244, 246, 0.5)",
            transition: { duration: 0.2 }
        }
    };

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/api/user/list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setUsers(response.data.userList || []);
                setFilterUsers(response.data.userList || []);
                setSelectedUsers([]);
                setSelectAll(false);
            } else {
                toast.error("Не удалось загрузить пользователей. Пожалуйста, попробуйте снова.");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilter = () => {
        if (!users || users.length === 0) {
            setFilterUsers([]);
            return;
        }

        let usersCopy = [...users];

        if (search) {
            const searchTerm = search.toLowerCase();
            usersCopy = usersCopy.filter(item =>
                (item.first_name && item.first_name.toLowerCase().includes(searchTerm)) ||
                (item.last_name && item.last_name.toLowerCase().includes(searchTerm)) ||
                (item.email && item.email.toLowerCase().includes(searchTerm)) ||
                (item.phone && item.phone.toLowerCase().includes(searchTerm))
            );
        }

        setFilterUsers(usersCopy);
        setCurrentPage(1);
        setSelectAll(false);
        setSelectedUsers([]);
    };

    const removeUser = async (id) => {
        try {
            const response = await api.delete(
                "/api/user/remove",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    data: { id },
                }
            );
            if (response.data.success) {
                toast.success("Пользователь успешно удалён");
                await fetchUsers();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeSelectedUsers = async () => {
        if (selectedUsers.length === 0) {
            toast.warning("Не выбрано ни одного пользователя для удаления");
            return;
        }

        try {
            const response = await api.delete(
                "/api/user/remove-multiple",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    data: { ids: selectedUsers },
                }
            );
            if (response.data.success) {
                toast.success("Выбранные пользователи успешно удалены");
                await fetchUsers();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            const currentUserIds = getCurrentUsers().map(user => user.id);
            setSelectedUsers(currentUserIds);
        }
        setSelectAll(!selectAll);
    };

    const getCurrentUsers = () => {
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        return filterUsers.slice(indexOfFirstUser, indexOfLastUser);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSelectAll(false);
    };

    const getPageNumbers = () => {
        const totalPages = Math.ceil(filterUsers.length / usersPerPage);

        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        let pages = [];
        if (currentPage <= 3) {
            pages = [1, 2, 3, 4, '...', totalPages];
        } else if (currentPage >= totalPages - 2) {
            pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }

        return pages;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Не указана";
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPhone = (phone) => {
        if (!phone) return "Не указан";
        if (phone.includes('(')) return phone;
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
        }
        return phone;
    };

    const formatBirthDate = (dateString) => {
        try {
            if (!dateString) return "-";

            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "-";

            const months = {
                January: 'января',
                February: 'февраля',
                March: 'марта',
                April: 'апреля',
                May: 'мая',
                June: 'июня',
                July: 'июля',
                August: 'августа',
                September: 'сентября',
                October: 'октября',
                November: 'ноября',
                December: 'декабря'
            };

            const day = date.getDate();
            const month = months[date.toLocaleString('en-US', { month: 'long' })];
            const year = date.getFullYear();

            return `${day} ${month} ${year} г.`;
        } catch (e) {
            console.error('Ошибка форматирования даты:', e);
            return "-";
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [search, users]);

    useEffect(() => {
        const currentUserIds = getCurrentUsers().map(user => user.id);
        const allSelected = currentUserIds.length > 0 &&
            currentUserIds.every(id => selectedUsers.includes(id));
        setSelectAll(allSelected);
    }, [selectedUsers, currentPage, filterUsers]);

    const currentUsers = getCurrentUsers();
    const pageNumbers = getPageNumbers();
    const totalPages = Math.ceil(filterUsers.length / usersPerPage);

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
            className="flex flex-col gap-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.h1
                className="text-3xl font-semibold text-slate-900 transition-colors"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                Пользователи
            </motion.h1>
            <motion.div
                className="flex flex-col gap-y-4 rounded-lg border border-slate-300 bg-white p-4 transition-colors"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col items-start justify-between gap-x-4 lg:flex-row">
                    <div className="pb-4 bg-white dark:bg-gray-900">
                        <motion.div className="relative mt-1" variants={itemVariants}>
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full max-w-80 h-10 ps-10 pe-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Поиск по имени, email или телефону"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </motion.div>
                    </div>
                    <AnimatePresence>
                        {selectedUsers.length > 0 && (
                            <motion.button
                                onClick={removeSelectedUsers}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-800"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaRegTrashAlt className="flex-shrink-0 text-lg" />
                                Удалить выбранные ({selectedUsers.length})
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
                <div className="relative overflow-x-auto sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-0 focus:ring-offset-0 dark:bg-gray-700 dark:border-gray-600"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                        />
                                        <label className="sr-only">Выбрать все</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Имя
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Телефон
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Дата рождения
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Администратор
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Дата регистрации
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                                            variants={tableRowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            custom={index}
                                            exit="exit"
                                            whileHover="hover"
                                            layout
                                        >
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-0 focus:ring-offset-0 dark:bg-gray-700 dark:border-gray-600"
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={() => toggleUserSelection(user.id)}
                                                    />
                                                    <label className="sr-only">Выбрать пользователя</label>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.last_name || "-"} {user.first_name || "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatPhone(user.phone)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatBirthDate(user.birth_date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_admin ? "Да" : "Нет"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <motion.button
                                                    className="cursor-pointer text-lg"
                                                    onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiEdit className="text-lg cursor-pointer" />
                                                </motion.button>
                                                <motion.button
                                                    className="cursor-pointer text-lg ml-4"
                                                    onClick={() => removeUser(user.id)}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FaRegTrashAlt className="text-red-600 hover:text-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-800" />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <motion.tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            Пользователи не найдены
                                        </td>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    <motion.nav
                        className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                            На странице <span className="font-semibold text-gray-900 dark:text-white">
                                {(currentPage - 1) * usersPerPage + 1}-{Math.min(currentPage * usersPerPage, filterUsers.length)}
                            </span> из <span className="font-semibold text-gray-900 dark:text-white">{filterUsers.length}</span>
                        </span>
                        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                            <motion.li whileHover={{ scale: 1.05 }}>
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Предыдущая
                                </button>
                            </motion.li>
                            {pageNumbers.map((number, index) => (
                                <motion.li key={index} whileHover={{ scale: 1.05 }}>
                                    {number === '...' ? (
                                        <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => paginate(number)}
                                            className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === number ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'} border border-gray-300`}
                                        >
                                            {number}
                                        </button>
                                    )}
                                </motion.li>
                            ))}
                            <motion.li whileHover={{ scale: 1.05 }}>
                                <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Следующая
                                </button>
                            </motion.li>
                        </ul>
                    </motion.nav>
                </div>
            </motion.div>
        </motion.div>
    )
};

export default Users;
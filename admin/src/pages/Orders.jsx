import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import api from "../services/apiService";

const Orders = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [filterOrders, setFilterOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const ordersPerPage = 10;

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

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/api/order/list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setOrders(response.data.orders);
                setSelectedOrders([]);
                setSelectAll(false);
                setFilterOrders(response.data.orders || []);
                setCurrentPage(1);
            } else {
                toast.error("Не удалось загрузить заказы. Пожалуйста, попробуйте снова.");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilter = () => {
        if (!orders) return;
        let ordersCopy = [...orders];

        if (search) {
            ordersCopy = ordersCopy.filter(order => {
                const shippingAddress = order.shipping_address ? JSON.parse(order.shipping_address) : {};
                return (
                    order.id.toString().includes(search.toLowerCase()) ||
                    (shippingAddress.firstName && shippingAddress.firstName.toLowerCase().includes(search.toLowerCase())) ||
                    (shippingAddress.email && shippingAddress.email.toLowerCase().includes(search.toLowerCase()))
                );
            });
        }

        setFilterOrders(ordersCopy);
        setCurrentPage(1);
        setSelectAll(false);
        setSelectedOrders([]);
    };

    const getStringPrice = (price) => {
        let priceString = price.toLocaleString("ru-RU", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        priceString = priceString.replace(",", ".");

        if (price % 1 !== 0) {
            priceString = priceString.replace(/(\d)(?=(\d{3})+\.)/g, "$1 ");
        } else {
            priceString = priceString.replace(/(\d)(?=(\d{3})+\b)/g, "$1 ");
        }
        return priceString;
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await api.post(
                "/api/order/status",
                { orderId, status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                toast.success("Статус заказа успешно обновлён");
                await fetchOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeOrder = async (id) => {
        try {
            const response = await api.delete(
                "/api/order/remove",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    data: { id },
                }
            );
            if (response.data.success) {
                toast.success("Заказ успешно удалён");
                await fetchOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeSelectedOrders = async () => {
        if (selectedOrders.length === 0) {
            toast.warning("Не выбрано ни одного заказа для удаления");
            return;
        }

        try {
            const response = await api.delete(
                "/api/order/remove-multiple",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    data: { ids: selectedOrders },
                }
            );
            if (response.data.success) {
                toast.success("Выбранные заказы успешно удалены");
                await fetchOrders();
                setSelectedOrders([]);
                setSelectAll(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const toggleOrderSelection = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedOrders([]);
        } else {
            const currentOrderIds = getCurrentOrders().map(order => order.id);
            setSelectedOrders(currentOrderIds);
        }
        setSelectAll(!selectAll);
    };

    const getCurrentOrders = () => {
        const indexOfLastOrder = currentPage * ordersPerPage;
        const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
        return filterOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSelectAll(false);
    };

    const getPageNumbers = () => {
        const totalPages = Math.ceil(filterOrders.length / ordersPerPage);

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
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    const parseShippingAddress = (address) => {
        try {
            return typeof address === 'string' ? JSON.parse(address) : address;
        } catch (e) {
            return {};
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [search, orders]);

    useEffect(() => {
        const currentOrderIds = getCurrentOrders().map(order => order.id);
        const allSelected = currentOrderIds.length > 0 &&
            currentOrderIds.every(id => selectedOrders.includes(id));
        setSelectAll(allSelected);
    }, [selectedOrders, currentPage, filterOrders]);

    const currentOrders = getCurrentOrders();
    const pageNumbers = getPageNumbers();
    const totalPages = Math.ceil(filterOrders.length / ordersPerPage);

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
                Заказы
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
                                placeholder="Поиск по номеру, имени или email"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </motion.div>
                    </div>
                    <AnimatePresence>
                        {selectedOrders.length > 0 && (
                            <motion.button
                                onClick={removeSelectedOrders}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-800"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaRegTrashAlt className="flex-shrink-0 text-lg" />
                                Удалить выбранные ({selectedOrders.length})
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
                                    Номер заказа
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Товары
                                </th>
                                <th scope="col" className="px-6 py-3 text-nowrap">
                                    Количество
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Доставка
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Оплата
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Дата
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Сумма
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Покупатель
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Статус
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {currentOrders.length > 0 ? (
                                    currentOrders.map((order, index) => {
                                        const shippingAddress = parseShippingAddress(order.shipping_address);
                                        return (
                                            <motion.tr
                                                key={order.id}
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
                                                            checked={selectedOrders.includes(order.id)}
                                                            onChange={() => toggleOrderSelection(order.id)}
                                                        />
                                                        <label className="sr-only">Выбрать заказ</label>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div>{order.id}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        {order.products.map((product, i) => (
                                                            <div key={i} className="flex items-center gap-2">
                                                                {product.image && (
                                                                    <motion.img
                                                                        className="w-8 h-8 rounded"
                                                                        src={typeof product.image === 'string' ? JSON.parse(product.image)[0] : product.image[0]}
                                                                        alt={product.name}
                                                                        initial={{ scale: 0.9 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ type: "spring", stiffness: 300 }}
                                                                    />
                                                                )}
                                                                <span>
                                                                    {product.name}
                                                                    {product.size && product.size !== 'no_size' && ` (Размер: ${product.size})`}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        {order.products.map((product, i) => (
                                                            <div key={i}>{product.quantity || 1} шт.</div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.delivery_method === "pickup" ? (
                                                        "Самовывоз из магазина"
                                                    ) : shippingAddress ? (
                                                        <div className="flex flex-col">
                                                            <span>Адрес доставки:</span>
                                                            <span className="text-sm text-gray-500">
                                                                {shippingAddress.street}, {shippingAddress.city}
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span>{order.payment_method === 'COD' ? 'Наличными при получении' : 'Онлайн'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDate(order.order_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStringPrice(parseInt(order.amount))} {currency}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {shippingAddress && (
                                                        <div className="flex flex-col">
                                                            <span>{shippingAddress.firstName} {shippingAddress.lastName}</span>
                                                            <span className="text-sm text-gray-500">{shippingAddress.email}</span>
                                                            <span className="text-sm text-gray-500">{shippingAddress.phone}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        className="w-full whitespace-nowrap min-w-[140px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    >
                                                        <option value="Placed" className="whitespace-nowrap">Оформлен</option>
                                                        <option value="Confirmed" className="whitespace-nowrap">Подтверждён</option>
                                                        <option value="In Transit" className="whitespace-nowrap">В пути</option>
                                                        <option value="Completed" className="whitespace-nowrap">Завершён</option>
                                                        <option value="Cancelled" className="whitespace-nowrap">Отменён</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <motion.button
                                                        className="cursor-pointer text-lg"
                                                        onClick={() => removeOrder(order.id)}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FaRegTrashAlt className="text-red-600 hover:text-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-800" />
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                ) : (
                                    <motion.tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td colSpan="11" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            Заказы не найдены
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
                                {(currentPage - 1) * ordersPerPage + 1}-{Math.min(currentPage * ordersPerPage, filterOrders.length)}
                            </span> из <span className="font-semibold text-gray-900 dark:text-white">{filterOrders.length}</span>
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

export default Orders;
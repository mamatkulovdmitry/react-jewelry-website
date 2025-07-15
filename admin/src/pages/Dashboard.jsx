import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import { FiShoppingBag, FiPackage, FiUsers } from "react-icons/fi";
import { TbMoneybag } from "react-icons/tb";
import api from "../services/apiService";

const Dashboard = ({ token }) => {
    const { products, currency } = useContext(ShopContext);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
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
        })
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get("/api/user/list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setUsers(response.data.userList);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get("/api/order/list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setOrders(response.data.orders || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTopSellingProducts = (orders, products) => {
        if (!orders?.length || !products?.length) {
            setTopSellingProducts([]);
            return;
        }

        const productSales = {};
        orders.forEach(order => {
            if (order.products && Array.isArray(order.products)) {
                order.products.forEach(product => {
                    const productId = product.id || product.uuid;
                    if (productId) {
                        productSales[productId] = (productSales[productId] || 0) + (product.quantity || 1);
                    }
                });
            }
        });

        const sortedProducts = [...products].sort((a, b) => {
            const salesA = productSales[a.id || a.uuid] || 0;
            const salesB = productSales[b.id || b.uuid] || 0;
            return salesB - salesA;
        });

        const topProducts = sortedProducts.slice(0, 10).map(product => ({
            ...product,
            salesCount: productSales[product.id || product.uuid] || 0
        }));

        setTopSellingProducts(topProducts);
    };

    const getStringPrice = (price) => {
        if (price === undefined || price === null) return "0";

        let priceString = Number(price).toLocaleString("ru-RU", {
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

    const getTotalOrdersAmount = () => {
        try {
            return orders.reduce((total, order) => {
                return total + parseInt(order.amount || 0);
            }, 0);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            return 0;
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchOrders();
    }, []);

    useEffect(() => {
        calculateTopSellingProducts(orders, products);
    }, [orders, products]);

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
                Главная
            </motion.h1>
            <motion.div
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="flex flex-col gap-y-4 rounded-lg border border-slate-300 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900"
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <div className="flex items-center gap-x-2">
                        <motion.div
                            className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600"
                            whileHover={{ rotate: 15 }}
                        >
                            <FiShoppingBag className="text-[26px]" />
                        </motion.div>
                        <p className="font-medium text-slate-900 transition-colors dark:text-slate-50">Всего товаров</p>
                    </div>
                    <div className="flex flex-col gap-y-2 rounded-lg p-4 bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {products.length > 0 ? products.length : 0}
                        </p>
                    </div>
                </motion.div>
                <motion.div
                    className="flex flex-col gap-y-4 rounded-lg border border-slate-300 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900"
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <div className="flex items-center gap-x-2">
                        <motion.div
                            className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600"
                            whileHover={{ rotate: 15 }}
                        >
                            <TbMoneybag className="text-[26px]" />
                        </motion.div>
                        <p className="font-medium text-slate-900 transition-colors dark:text-slate-50">Общая сумма заказов</p>
                    </div>
                    <div className="flex flex-col gap-y-2 rounded-lg p-4 bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {orders ? getStringPrice(getTotalOrdersAmount()) : 0} {currency}
                        </p>
                    </div>
                </motion.div>
                <motion.div
                    className="flex flex-col gap-y-4 rounded-lg border border-slate-300 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900"
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <div className="flex items-center gap-x-2">
                        <motion.div
                            className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600"
                            whileHover={{ rotate: 15 }}
                        >
                            <FiUsers className="text-[26px]" />
                        </motion.div>
                        <p className="font-medium text-slate-900 transition-colors dark:text-slate-50">Количество пользователей</p>
                    </div>
                    <div className="flex flex-col gap-y-2 rounded-lg p-4 bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {users.length > 0 ? users.length : 0}
                        </p>
                    </div>
                </motion.div>
                <motion.div
                    className="flex flex-col gap-y-4 rounded-lg border border-slate-300 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900"
                    variants={cardVariants}
                    whileHover="hover"
                >
                    <div className="flex items-center gap-x-2">
                        <motion.div
                            className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600"
                            whileHover={{ rotate: 15 }}
                        >
                            <FiPackage className="text-[26px]" />
                        </motion.div>
                        <p className="font-medium text-slate-900 transition-colors dark:text-slate-50">Заказов</p>
                    </div>
                    <div className="flex flex-col gap-y-2 rounded-lg p-4 bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {orders ? orders.length : 0}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
            <motion.div
                className="flex flex-col gap-y-4 rounded-lg border border-slate-300 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-x-2">
                    <p className="font-medium text-slate-900 transition-colors dark:text-slate-50">Самые продаваемые товары</p>
                </div>
                <div className="flex flex-col gap-y-2 rounded-lg p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="h-full w-full text-slate-900 dark:text-slate-50">
                            <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr className="border-b border-slate-300 transition-colors last:border-none dark:border-slate-700">
                                    <th className="h-12 px-4 text-start">#</th>
                                    <th className="h-12 px-4 text-start">Товар</th>
                                    <th className="h-12 px-4 text-start">Цена</th>
                                    <th className="h-12 px-4 text-start">Категория</th>
                                    <th className="h-12 px-4 text-start">Кол-во продаж</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {topSellingProducts.length > 0 ? (
                                        topSellingProducts.map((product, index) => {
                                            const imageUrl = product.image && Array.isArray(JSON.parse(product.image))
                                                ? JSON.parse(product.image)[0]
                                                : product.image || '';

                                            return (
                                                <motion.tr
                                                    key={product.id || product.uuid}
                                                    className="border-b border-slate-300 transition-colors last:border-none dark:border-slate-700"
                                                    variants={tableRowVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    custom={index}
                                                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                                                >
                                                    <td className="w-fit whitespace-nowrap p-4 font-medium">{index + 1}</td>
                                                    <td className="w-fit whitespace-nowrap p-4 font-medium">
                                                        <div className="flex w-max gap-x-4">
                                                            {imageUrl && (
                                                                <motion.img
                                                                    src={imageUrl}
                                                                    alt={product.name}
                                                                    className="size-14 rounded-lg object-cover"
                                                                    initial={{ scale: 0.9 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 300 }}
                                                                />
                                                            )}
                                                            <div className="flex items-center">
                                                                <p>{product.name}</p>
                                                                {/*<p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p>*/}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="w-fit whitespace-nowrap p-4 font-medium">{getStringPrice(product.price)} {currency}</td>
                                                    <td className="w-fit whitespace-nowrap p-4 font-medium">{product.category}</td>
                                                    <td className="w-fit whitespace-nowrap p-4 font-medium">{product.salesCount}</td>
                                                </motion.tr>
                                            );
                                        })
                                    ) : (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <td colSpan="5" className="p-4 text-center">Нет данных о продажах</td>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
            <Footer />
        </motion.div>
    );
};

export default Dashboard;
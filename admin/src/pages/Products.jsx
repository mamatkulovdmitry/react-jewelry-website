import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import api from "../services/apiService";

const Products = ({ token }) => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [filterProducts, setFilterProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const productsPerPage = 10;

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
        },
        exit: { opacity: 0, x: -50 }
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
        hover: { backgroundColor: "rgba(243, 244, 246, 0.5)" }
    };

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/api/product/list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setProducts(response.data.products);
                setSelectedProducts([]);
                setSelectAll(false);
            } else {
                toast.error("Не удалось загрузить товары. Пожалуйста, попробуйте снова.");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilter = () => {
        let productsCopy = products.slice();

        if (search) {
            productsCopy = productsCopy.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilterProducts(productsCopy);
        setCurrentPage(1);
        setSelectAll(false);
        setSelectedProducts([]);
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

    const removeProduct = async (id) => {
        try {
            const response = await api.delete(
                "/api/product/remove",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    data: { id },
                }
            );
            if (response.data.success) {
                toast.success("Товар успешно удалён");
                await fetchProducts();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeSelectedProducts = async () => {
        if (selectedProducts.length === 0) {
            toast.warning("Не выбрано ни одного товара для удаления");
            return;
        }

        try {
            const response = await api.delete(
                "/api/product/remove-multiple",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    data: { ids: selectedProducts },
                }
            );
            if (response.data.success) {
                toast.success("Выбранные товары успешно удалены");
                await fetchProducts();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedProducts([]);
        } else {
            const currentProductIds = getCurrentProducts().map(product => product.id);
            setSelectedProducts(currentProductIds);
        }
        setSelectAll(!selectAll);
    };

    const getCurrentProducts = () => {
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        return filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSelectAll(false);
    };

    const getPageNumbers = () => {
        const totalPages = Math.ceil(filterProducts.length / productsPerPage);

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

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [search, products]);

    useEffect(() => {
        const currentProductIds = getCurrentProducts().map(product => product.id);
        const allSelected = currentProductIds.length > 0 &&
            currentProductIds.every(id => selectedProducts.includes(id));
        setSelectAll(allSelected);
    }, [selectedProducts, currentPage, filterProducts]);

    const currentProducts = getCurrentProducts();
    const pageNumbers = getPageNumbers();
    const totalPages = Math.ceil(filterProducts.length / productsPerPage);

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
                Товары
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
                                placeholder="Поиск"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </motion.div>
                    </div>
                    <AnimatePresence>
                        {selectedProducts.length > 0 && (
                            <motion.button
                                onClick={removeSelectedProducts}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-800"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaRegTrashAlt className="flex-shrink-0 text-lg" />
                                Удалить выбранные ({selectedProducts.length})
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
                                    Название
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Изображение
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Категория
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Цена
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Артикул
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Видимость
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((item, index) => {
                                        const images = JSON.parse(item.image);
                                        return (
                                            <motion.tr
                                                key={item.id}
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
                                                            checked={selectedProducts.includes(item.id)}
                                                            onChange={() => toggleProductSelection(item.id)}
                                                        />
                                                        <label className="sr-only">Выбрать товар</label>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <motion.img
                                                        className="w-12"
                                                        src={images[0]}
                                                        alt="Product Image"
                                                        initial={{ scale: 0.9 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.category}
                                                </td>
                                                <td className="text-nowrap px-6 py-4">
                                                    {getStringPrice(item.price)} {currency}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.uuid}
                                                </td>
                                                <td className="text-nowrap px-6 py-4">
                                                    {item.is_visible ? "Виден" : "Скрыт"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <motion.button
                                                        className="cursor-pointer text-lg"
                                                        onClick={() => navigate(`/admin/edit-product/${item.uuid}`)}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FiEdit className="text-lg cursor-pointer" />
                                                    </motion.button>
                                                    <motion.button
                                                        className="cursor-pointer text-lg ml-4"
                                                        onClick={() => removeProduct(item.id)}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FaRegTrashAlt className="text-red-600 hover:text-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-800" />
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        )
                                    })
                                ) : (
                                    <motion.tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            Товары не найдены
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
                                {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, filterProducts.length)}
                            </span> из <span className="font-semibold text-gray-900 dark:text-white">{filterProducts.length}</span>
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

export default Products;
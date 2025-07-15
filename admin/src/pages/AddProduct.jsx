import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import api from "../services/apiService";

const AddProduct = ({ token }) => {
    // Категории товаров
    const embeddedCategories = [
        { id: "1", name: "Кольца" },
        { id: "2", name: "Серьги" },
        { id: "3", name: "Подвески" },
        { id: "4", name: "Браслеты" },
        { id: "5", name: "Цепи" }
    ];

    // Материалы изделий
    const embeddedMaterials = [
        { id: "1", name: "Серебро" },
        { id: "2", name: "Золото" },
        { id: "3", name: "Платина" },
        { id: "4", name: "Титан" },
        { id: "5", name: "Сталь" }
    ];

    // Состояние формы
    const [formData, setFormData] = useState({
        name: "",
        category: embeddedCategories[0].name,
        material: embeddedMaterials[0].name,
        price: "",
        weight: "",
        description: "",
        sex: "Woman",
        sizes: [],
        isBestseller: false,
        isVisible: true,
        images: []
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Размеры для разных категорий
    const ringSizes = ["15", "15.5", "16", "16.5", "17", "17.5", "18", "18.5",
        "19", "19.5", "20", "20.5", "21", "21.5", "22", "22.5",
        "23", "23.5", "24"];
    const chainSizes = ["40", "45", "50", "55", "60", "65", "70"];
    const braceletSizes = ["16", "16.5", "17"];

    // Анимации
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

    const imagePreviewVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300
            }
        },
        exit: { scale: 0.8, opacity: 0 }
    };

    // Проверяем, нужны ли размеры для выбранной категории
    const categoryHasSizes = () => {
        return ["Кольца", "Цепи", "Браслеты"].includes(formData.category);
    };

    // Получаем доступные размеры для текущей категории
    const getAvailableSizes = () => {
        switch (formData.category) {
            case "Кольца": return ringSizes;
            case "Цепи": return chainSizes;
            case "Браслеты": return braceletSizes;
            default: return [];
        }
    };

    // Обработчики событий
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            category: value,
            sizes: [] // Сбрасываем размеры при смене категории
        }));
    };

    const handleSizeChange = (size) => {
        setFormData(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];

            return {
                ...prev,
                sizes: newSizes
            };
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files).slice(0, 4 - previewImages.length);

        if (files.length === 0) {
            toast.warning("Максимум можно загрузить 4 изображения");
            return;
        }

        const newPreviewImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name
        }));

        setPreviewImages(prev => [...prev, ...newPreviewImages]);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        const newImages = [...previewImages];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);

        setPreviewImages(newImages);
        setFormData(prev => ({
            ...prev,
            images: newImages.map(img => img.file)
        }));
    };

    const resetForm = () => {
        previewImages.forEach(img => URL.revokeObjectURL(img.preview));

        setFormData({
            name: "",
            category: embeddedCategories[0].name,
            material: embeddedMaterials[0].name,
            price: "",
            weight: "",
            description: "",
            sex: "Woman",
            sizes: [],
            isBestseller: false,
            isVisible: true,
            images: []
        });
        setPreviewImages([]);
    };

    const handleCancel = () => {
        resetForm();
        toast.info("Форма очищена");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Валидация
        if (formData.images.length === 0) {
            toast.warning("Пожалуйста, загрузите хотя бы одно изображение");
            setIsSubmitting(false);
            return;
        }

        if (categoryHasSizes() && formData.sizes.length === 0) {
            toast.warning("Пожалуйста, выберите хотя бы один размер");
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Добавляем данные формы
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('material', formData.material);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('weight', formData.weight);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('sex', formData.sex);

            // Добавляем размеры только если они нужны для категории
            if (categoryHasSizes()) {
                formData.sizes.forEach(size => formDataToSend.append('sizes[]', size));
            }

            formDataToSend.append('isBestseller', formData.isBestseller);
            formDataToSend.append('isVisible', formData.isVisible);

            // Добавляем изображения
            formData.images.forEach((image, index) => {
                formDataToSend.append(`image${index + 1}`, image);
            });

            // Отправка данных
            const response = await api.post(`/api/product/add`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success("Товар успешно добавлен");
                resetForm();
            } else {
                toast.error(response.data.message || "Ошибка при добавлении товара");
            }
        } catch (error) {
            console.error("Ошибка при отправке формы:", error);
            toast.error(error.response?.data?.message || "Произошла ошибка при добавлении товара");
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
                Добавление товара
            </motion.h1>

            <motion.form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg border border-slate-300 p-4 md:p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Название товара */}
                <motion.div className="mb-6" variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Название товара <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                        disabled={isSubmitting}
                    />
                </motion.div>

                {/* Категория и материал */}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" variants={itemVariants}>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Категория <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleCategoryChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                            disabled={isSubmitting}
                        >
                            {embeddedCategories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">
                            Материал <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="material"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                            disabled={isSubmitting}
                        >
                            {embeddedMaterials.map((mat) => (
                                <option key={mat.id} value={mat.name}>{mat.name}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Цена и вес */}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" variants={itemVariants}>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                            Цена (руб) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                            Вес изделия (г) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            min="0"
                            step="0.1"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                </motion.div>

                {/* Описание */}
                <motion.div className="mb-6" variants={itemVariants}>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Описание товара <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                        disabled={isSubmitting}
                    ></textarea>
                </motion.div>

                {/* Пол */}
                <motion.div className="mb-6" variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Для кого предназначен товар <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["Woman", "Man", "Kids"].map(gender => (
                            <motion.label
                                key={gender}
                                className="flex items-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                            >
                                <input
                                    type="radio"
                                    name="sex"
                                    value={gender}
                                    checked={formData.sex === gender}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    disabled={isSubmitting}
                                />
                                <span className="text-sm text-gray-700">
                                    {gender === "Woman" ? "Для женщин" :
                                        gender === "Man" ? "Для мужчин" : "Для детей"}
                                </span>
                            </motion.label>
                        ))}
                    </div>
                </motion.div>

                {/* Размеры (только для определенных категорий) */}
                {categoryHasSizes() && (
                    <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Доступные размеры <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {getAvailableSizes().map(size => (
                                <motion.button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeChange(size)}
                                    className={`px-3 py-1 rounded-md border text-sm ${formData.sizes.includes(size)
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {size}
                                </motion.button>
                            ))}
                        </div>
                        {formData.sizes.length > 0 && (
                            <motion.div
                                className="mt-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span className="text-sm text-gray-500">Выбрано: </span>
                                <span className="text-sm font-medium">
                                    {formData.sizes.join(", ")}
                                </span>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Изображения */}
                <motion.div className="mb-6" variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Изображения товара (макс. 4) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <AnimatePresence>
                            {previewImages.map((image, index) => (
                                <motion.div
                                    key={index}
                                    className="relative group"
                                    variants={imagePreviewVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                >
                                    <img
                                        src={image.preview}
                                        alt={`Preview ${index}`}
                                        className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                    />
                                    <motion.button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        ×
                                    </motion.button>
                                    <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                        {image.name}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <motion.label
                        className={`flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <span className="text-sm font-medium">Выберите файлы</span>
                        <span className="text-xs text-gray-500 mt-1">
                            {previewImages.length > 0 ?
                                `Добавлено ${previewImages.length} из 4` :
                                'До 4 изображений'}
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isSubmitting || previewImages.length >= 4}
                        />
                    </motion.label>
                </motion.div>

                {/* Дополнительные опции */}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={itemVariants}>
                    <div className="flex items-center">
                        <div className="flex items-center h-5">
                            <input
                                id="isBestseller"
                                name="isBestseller"
                                type="checkbox"
                                checked={formData.isBestseller}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                        </div>
                        <label htmlFor="isBestseller" className="ml-2 block text-sm text-gray-700">
                            Бестселлер
                        </label>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center h-5">
                            <input
                                id="isVisible"
                                name="isVisible"
                                type="checkbox"
                                checked={formData.isVisible}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                        </div>
                        <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-700">
                            Показывать товар
                        </label>
                    </div>
                </motion.div>

                {/* Кнопки отправки формы */}
                <motion.div
                    className="flex justify-end gap-4 flex-col sm:flex-row"
                    variants={itemVariants}
                >
                    <motion.button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Отмена
                    </motion.button>
                    <motion.button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                        disabled={isSubmitting || formData.images.length === 0 || (categoryHasSizes() && formData.sizes.length === 0)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Добавление...
                            </span>
                        ) : 'Добавить товар'}
                    </motion.button>
                </motion.div>
            </motion.form>
        </motion.div>
    );
};

export default AddProduct;
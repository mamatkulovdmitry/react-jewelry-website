import { v4 as uuidv4 } from "uuid";
import { uploadToUploadcare } from "../config/uploadcare.js";
import Product from "../models/productModel.js";

const addProduct = async (request, response) => {
    try {
        const { category, material, name, description, weight, sex, sizes, price, isBestseller, isVisible } = request.body;

        // Проверяем обязательные поля
        if (!name || !category || !material || !price || !weight || !description || !sex) {
            return response.status(400).json({
                success: false,
                message: "Все обязательные поля должны быть заполнены"
            });
        }

        // Определяем, нужны ли размеры для этой категории
        const categoryHasSizes = ["Кольца", "Цепи", "Браслеты"].includes(category);

        let processedSizes = [];
        if (categoryHasSizes) {
            // Обрабатываем размеры только для категорий, где они нужны
            if (typeof sizes === 'string') {
                try {
                    processedSizes = JSON.parse(sizes);
                } catch (e) {
                    console.error('Error parsing sizes:', e);
                    processedSizes = sizes.split(',').map(s => s.trim());
                }
            } else if (Array.isArray(sizes)) {
                processedSizes = sizes;
            }

            if (!Array.isArray(processedSizes)) {
                return response.status(400).json({
                    success: false,
                    message: 'Размеры должны быть в виде массива'
                });
            }

            // Проверяем допустимые размеры для категории
            let allowedSizes = [];
            switch (category) {
                case "Кольца":
                    allowedSizes = ["15", "15.5", "16", "16.5", "17", "17.5", "18", "18.5",
                        "19", "19.5", "20", "20.5", "21", "21.5", "22", "22.5",
                        "23", "23.5", "24"];
                    break;
                case "Цепи":
                    allowedSizes = ["40", "45", "50", "55", "60", "65", "70"];
                    break;
                case "Браслеты":
                    allowedSizes = ["16", "16.5", "17"];
                    break;
            }

            // Проверяем, что все указанные размеры допустимы
            const invalidSizes = processedSizes.filter(size => !allowedSizes.includes(size));
            if (invalidSizes.length > 0) {
                return response.status(400).json({
                    success: false,
                    message: `Недопустимые размеры для категории ${category}: ${invalidSizes.join(', ')}`
                });
            }

            if (processedSizes.length === 0) {
                return response.status(400).json({
                    success: false,
                    message: 'Для этой категории необходимо указать хотя бы один размер'
                });
            }
        }

        // Загружаем изображения
        let images = [];
        if (request.files) {
            const uploadedFiles = Object.values(request.files).flat();
            const filesToProcess = uploadedFiles.slice(0, 4);
            const uploadPromises = filesToProcess.map(file =>
                uploadToUploadcare(file.path)
            );
            images = await Promise.all(uploadPromises);
        }

        if (images.length === 0) {
            return response.status(400).json({
                success: false,
                message: "Необходимо загрузить хотя бы одно изображение"
            });
        }

        const uuid = uuidv4();

        // Сортируем размеры для категорий, где это имеет значение
        const sortSizes = (sizesArray) => {
            return sizesArray.map(size => parseFloat(size))
                .sort((a, b) => a - b)
                .map(size => size.toString());
        };

        const sortedSizes = categoryHasSizes ? sortSizes(processedSizes) : [];

        // Создаем продукт
        const product = new Product(
            uuid,
            category,
            material,
            name,
            description,
            weight,
            sex,
            sortedSizes, // передаем отсортированные размеры или пустой массив
            Number(price),
            isBestseller === "true" ? "1" : "0",
            isVisible === "true" ? "1" : "0",
            images,
        );

        await product.save();

        return response.json({
            success: true,
            message: "Товар добавлен",
            productId: uuid,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        return response.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const editProduct = async (request, response) => {
    try {
        const { id } = request.params;

        if (!request.body.name || !request.body.category) {
            return response.status(400).json({
                success: false,
                message: "Отсутствуют обязательные поля"
            });
        }

        const {
            name,
            category,
            material,
            description,
            weight,
            sex,
            price,
            isBestseller,
            isVisible
        } = request.body;

        // Определяем, нужны ли размеры для этой категории
        const categoryHasSizes = ["Кольца", "Цепи", "Браслеты"].includes(category);

        let sizes = [];
        if (categoryHasSizes) {
            try {
                sizes = request.body.sizes ? JSON.parse(request.body.sizes) : [];
            } catch (e) {
                console.error('Error parsing sizes:', e);
                sizes = [];
            }

            // Проверяем допустимые размеры для категории
            let allowedSizes = [];
            switch (category) {
                case "Кольца":
                    allowedSizes = ["15", "15.5", "16", "16.5", "17", "17.5", "18", "18.5",
                        "19", "19.5", "20", "20.5", "21", "21.5", "22", "22.5",
                        "23", "23.5", "24"];
                    break;
                case "Цепи":
                    allowedSizes = ["40", "45", "50", "55", "60", "65", "70"];
                    break;
                case "Браслеты":
                    allowedSizes = ["16", "16.5", "17"];
                    break;
            }

            // Проверяем, что все указанные размеры допустимы
            const invalidSizes = sizes.filter(size => !allowedSizes.includes(size));
            if (invalidSizes.length > 0) {
                return response.status(400).json({
                    success: false,
                    message: `Недопустимые размеры для категории ${category}: ${invalidSizes.join(', ')}`
                });
            }

            if (sizes.length === 0) {
                return response.status(400).json({
                    success: false,
                    message: 'Для этой категории необходимо указать хотя бы один размер'
                });
            }
        }

        // Обработка изображений
        let existingImages = [];
        try {
            existingImages = request.body.existingImages ? JSON.parse(request.body.existingImages) : [];
        } catch (e) {
            console.error('Error parsing existingImages:', e);
            existingImages = [];
        }

        let newImages = [];
        if (request.files && request.files.newImages) {
            const filesToProcess = Array.isArray(request.files.newImages)
                ? request.files.newImages
                : [request.files.newImages];

            newImages = await Promise.all(
                filesToProcess.map(file => uploadToUploadcare(file.path))
            );
        }

        const allImages = [...existingImages, ...newImages]
            .filter(img => img)
            .slice(0, 4);

        if (allImages.length === 0) {
            return response.status(400).json({
                success: false,
                message: "Необходимо загрузить хотя бы одно изображение"
            });
        }

        // Сортируем размеры для категорий, где это имеет значение
        const sortSizes = (sizesArray) => {
            return sizesArray.map(size => parseFloat(size))
                .sort((a, b) => a - b)
                .map(size => size.toString());
        };

        const sortedSizes = categoryHasSizes ? sortSizes(sizes) : [];

        const updatedProduct = new Product(
            id,
            category,
            material,
            name,
            description,
            weight,
            sex,
            sortedSizes,
            Number(price),
            isBestseller === "true" ? "1" : "0",
            isVisible === "true" ? "1" : "0",
            allImages
        );

        await updatedProduct.update();

        return response.json({
            success: true,
            message: "Товар успешно обновлён",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Error updating product:", error);
        return response.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const listProducts = async (request, response) => {
    try {
        const products = await Product.getList();
        const formattedProducts = products.map(product => ({
            ...product,
            price: Number(product.price),
        }));
        response.json({ success: true, products: formattedProducts });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const removeProduct = async (request, response) => {
    try {
        const productId = request.body.id;
        await Product.delete(productId);
        response.json({ success: true, message: "Товар удалён" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: "Произошла ошибка при удалении товара" });
    }
};

const removeMultipleProducts = async (request, response) => {
    try {
        const { ids } = request.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return response.json({ success: false, message: "Не выбраны товары для удаления" });
        }

        await Product.deleteMultiple(ids);
        response.json({ success: true, message: "Выбранные товары успешно удалены" });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const singleProduct = async (request, response) => {
    try {
        const { productId } = request.body;
        const product = await Product.getInfo(productId);
        response.json({ success: true, product });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

const singleProductById = async (request, response) => {
    try {
        const { id } = request.params;
        const product = await Product.getInfoByUuid(id);

        if (!product) {
            return response.status(404).json({
                success: false,
                message: "Товар не найден"
            });
        }

        // Обработка размеров
        let productSizes = [];
        if (product.sizes) {
            try {
                productSizes = typeof product.sizes === 'string'
                    ? JSON.parse(product.sizes)
                    : product.sizes;
            } catch (e) {
                console.error("Error parsing sizes:", e);
                productSizes = [];
            }
        }

        response.json({
            success: true,
            product: {
                ...product,
                sizes: productSizes,
            }
        });
    } catch (error) {
        console.log(error);
        response.json({ success: false, message: error.message });
    }
};

export {
    addProduct,
    editProduct,
    listProducts,
    removeProduct,
    removeMultipleProducts,
    singleProduct,
    singleProductById,
};
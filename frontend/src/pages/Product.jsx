import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [isAdded, setIsAdded] = useState(false);

  const fetchProductData = async () => {
    const product = products.find((item) => item.uuid === productId);
    if (product) {
      try {
        // Обработка изображений
        const images = Array.isArray(product.image)
          ? product.image
          : JSON.parse(product.image);

        // Обработка размеров
        let productSizes = [];
        if (product.sizes) {
          try {
            productSizes = typeof product.sizes === 'string'
              ? JSON.parse(product.sizes)
              : product.sizes;
            // Если sizes пустая строка или null, устанавливаем пустой массив
            if (!productSizes) productSizes = [];
          } catch (e) {
            console.error("Error parsing sizes:", e);
            productSizes = [];
          }
        }

        setProductData({ ...product, image: images, sizes: productSizes });
        setImage(images[0]);
      } catch (error) {
        console.error("Не удалось загрузить данные товара:", error);
      }
    }
  };

  const getStringPrice = (price) => {
    let priceString = price.toLocaleString("ru-RU", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 20
    });
    priceString = priceString.replace(",", ".");

    if (price % 1 !== 0) {
      priceString = priceString.replace(/(\d)(?=(\d{3})+\.)/g, "$1 ");
    } else {
      priceString = priceString.replace(/(\d)(?=(\d{3})+\b)/g, "$1 ");
    }
    return priceString;
  };

  const handleAddToCart = () => {
    if (productData.sizes && productData.sizes.length > 0 && !size) {
      toast.error("Выберите размер");
      return;
    }
    addToCart(productData.uuid, size);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (!productData) {
    return (
      <motion.div
        className="opacity-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="border-t-2 pt-10"
    >
      <motion.div
        className="flex gap-12 sm:gap-12 flex-col sm:flex-row"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <motion.div
            className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {productData.image.map((item, index) => (
              <motion.img
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                src={item}
                key={index}
                alt="Product Image"
                onClick={() => setImage(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              />
            ))}
          </motion.div>
          <motion.div
            className="w-full sm:w-[80%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.img
              className="w-full h-auto"
              src={image}
              alt="Product Image"
              key={image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.h1
            className="font-medium text-2xl mt-2"
            whileHover={{ x: 5 }}
          >
            {productData.name}
          </motion.h1>
          <motion.p
            className="mt-5 text-3xl font-medium"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {getStringPrice(productData.price)} {currency}
          </motion.p>

          {/* Обновленная секция размеров */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className="flex flex-col gap-4 my-8">
              <p>Размеры</p>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((item, index) => (
                  <motion.button
                    className={`border py-2 px-4 bg-gray-100 ${item === size ? "border-orange-500" : ""
                      }`}
                    key={index}
                    onClick={() => setSize(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          <div className="relative">
            <motion.button
              className={`px-8 py-3 text-sm font-medium w-full sm:w-auto transition-all ${isAdded
                ? "bg-transparent text-black border border-black"
                : "bg-black text-white hover:bg-gray-800"
                } ${productData.sizes && productData.sizes.length > 0 && !size
                  ? "opacity-50"
                  : "cursor-pointer"
                }
                ${productData.sizes && productData.sizes.length > 0 ? "" : "my-8"}`
              }
              onClick={handleAddToCart}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: productData.sizes && productData.sizes.length > 0 && !size
                  ? 1
                  : 1.05,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
              }}
            >
              {isAdded ? (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ✓ ДОБАВЛЕНО
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ДОБАВИТЬ В КОРЗИНУ
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex">
          <motion.button
            className={`border px-5 py-3 text-sm ${activeTab === "description" ? "bg-gray-100" : ""
              }`}
            onClick={() => setActiveTab("description")}
            whileHover={{ backgroundColor: "#f5f5f5" }}
          >
            Описание
          </motion.button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-gray-500 flex flex-col gap-1">
              <p>Тип украшения: {productData.category}</p>
              <p>Металл: {productData.material}</p>
              <p>Вес: {productData.weight} г.</p>
              <p>Пол: {productData.sex}</p>
            </div>
            <p>{productData.description}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ delay: 0.2 }}
      >
        <RelatedProducts
          category={productData.category}
          subCategory={productData.material}
          sex={productData.sex}
        />
      </motion.div>
    </motion.div>
  );
};

export default Product;
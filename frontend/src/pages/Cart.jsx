import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";

const Cart = () => {
  const { token, products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

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

  const getStringPrice = (price) => {
    let priceString = price.toLocaleString("ru-RU", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 2 });
    priceString = priceString.replace(",", ".");

    if (price % 1 !== 0) {
      priceString = priceString.replace(/(\d)(?=(\d{3})+\.)/g, "$1 ");
    } else {
      priceString = priceString.replace(/(\d)(?=(\d{3})+\b)/g, "$1 ");
    }
    return priceString;
  };

  // Проверяем, требуется ли для товара размер
  const requiresSize = (category) => {
    return ["Кольца", "Цепи", "Браслеты"].includes(category);
  };

  useEffect(() => {
    if (products.length > 0) {
      const temporaryData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            temporaryData.push({
              id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(temporaryData);
    }
  }, [products, cartItems]);

  const handleCheckout = () => {
    if (!token) {
      toast.error("Для оформления заказа, пожалуйста, авторизуйтесь");
      return null;
    }

    if (cartData.length === 0) {
      toast.error("Ваша корзина пуста. Пожалуйста, добавьте товары в корзину");
    } else {
      navigate("/place-order");
    }
  };

  const handleRemoveItem = (id, size) => {
    updateQuantity(id, size, 0);
    toast.success("Товар удалён из корзины");
  };

  return (
    <motion.div
      className="pt-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-2xl mb-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Title text1={"ВАША"} text2={"КОРЗИНА"} />
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cartData.length > 0 ? (
          <AnimatePresence>
            {cartData.map((item, index) => {
              const productData = products.find((product) => product.uuid === item.id);
              const images = JSON.parse(productData.image);
              const showSize = requiresSize(productData.category) && item.size !== 'no_size';

              return (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                  variants={itemVariants}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                  exit="exit"
                  layout
                >
                  <div className="flex items-start gap-6">
                    <motion.img
                      className="w-16 sm:w-20"
                      src={images[0]}
                      alt="Product Image"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <div>
                      <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                      <motion.div
                        className="flex items-center gap-5 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p>{getStringPrice(productData.price)} {currency}</p>
                        {showSize && (
                          <motion.p
                            className="px-2 sm:px-3 sm:py-1 border bg-slate-50"
                            whileHover={{ scale: 1.05 }}
                          >
                            {item.size}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  </div>
                  <motion.input
                    className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(event) => event.target.value === "" || event.target.value === "0" ? null : updateQuantity(item.id, item.size, Number(event.target.value))}
                    whileFocus={{ scale: 1.05, borderColor: "#000" }}
                  />
                  <motion.img
                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                    src={assets.bin_icon}
                    onClick={() => handleRemoveItem(item.id, item.size)}
                    alt="Bin Icon"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.h2
            className="text-gray-700 font-medium text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ваша корзина пуста
          </motion.h2>
        )}
      </motion.div>
      <motion.div
        className="flex justify-end my-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <motion.button
              className="bg-black text-white text-sm my-8 px-8 py-3 hover:bg-gray-800 transition-colors"
              onClick={handleCheckout}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              ПЕРЕЙТИ К ОФОРМЛЕНИЮ
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Cart;
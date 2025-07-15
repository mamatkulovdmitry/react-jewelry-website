import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";
import api from "../services/apiService";

const Orders = () => {
  const { token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Проверяем, нужен ли размер для товара
  const requiresSize = (category) => {
    return ["Кольца", "Цепи", "Браслеты"].includes(category);
  };

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

  const statusDotVariants = {
    initial: { scale: 0.8 },
    animate: { scale: 1 },
    hover: { scale: 1.2 }
  };

  const loadOrderData = async () => {
    try {
      setRefreshing(true);
      if (!token) return null;

      const response = await api.get("/api/order/userorders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        let allOrdersItem = [];
        if (response.data.orders === null) {
          setOrderData(allOrdersItem);
          return;
        };
        response.data.orders.forEach((order) => {
          order.products.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              delivery_method: order.delivery_method,
              payment_method: order.payment_method,
              order_date: order.order_date
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Ошибка при загрузке заказов");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const getStringPrice = (price) => {
    let priceString = price.toLocaleString("ru-RU", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return priceString.replace(",", ".");
  };

  // Остальные вспомогательные функции остаются без изменений
  const translateStatus = (status) => {
    const statusTranslations = {
      Placed: "Оформлен",
      Confirmed: "Подтверждён",
      "Being Prepared": "Собирается",
      "On Hold": "Заморожен",
      "Handed Over for Delivery": "Передан в доставку",
      "In Transit": "В пути",
      Delivered: "Доставлен",
      Completed: "Завершён",
      Returned: "Возвращён",
      Cancelled: "Отменён",
    };
    return statusTranslations[status] || status;
  };

  const translateDeliveryMethod = (deliveryMethod) => {
    const deliveryMethodTranslations = {
      courier: "Курьером",
      pickup: "Самовывоз из магазина",
    };
    return deliveryMethodTranslations[deliveryMethod] || deliveryMethod;
  };

  const translatePaymentMethod = (paymentMethod) => {
    const paymentMethodTranslations = {
      COD: "При получении",
      Online: "Онлайн",
    };
    return paymentMethodTranslations[paymentMethod] || paymentMethod;
  };

  const getStatusColor = (status) => {
    const colors = {
      Placed: "bg-blue-500",
      Confirmed: "bg-green-500",
      "Being Prepared": "bg-yellow-500",
      "On Hold": "bg-orange-500",
      "Handed Over for Delivery": "bg-purple-500",
      "In Transit": "bg-indigo-500",
      Delivered: "bg-green-600",
      Completed: "bg-green-700",
      Returned: "bg-red-400",
      Cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (isLoading) {
    return (
      <motion.div
        className="border-t pt-14 flex justify-center items-center min-h-[300px]"
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
      className="border-t pt-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-2xl mb-3 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1] // Плавное замедление в конце
        }}
      >
        <Title text1={"МОИ"} text2={"ЗАКАЗЫ"} />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {orderData.length > 0 ? (
          <AnimatePresence>
            {orderData.map((item, index) => {
              const images = Array.isArray(item.image) ? item.image : JSON.parse(item.image);
              const statusColor = getStatusColor(item.status);
              const showSize = requiresSize(item.category) && item.size !== 'no_size';

              return (
                <motion.div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  variants={itemVariants}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.3)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <motion.img
                      className="w-16 sm:w-20"
                      src={images[0]}
                      alt="Product Image"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    />
                    <div>
                      <p className="sm:text-base font-medium">{item.name}</p>
                      <motion.div
                        className="flex items-center gap-3 mt-1 text-base text-gray-700 flex-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                      >
                        <p>{getStringPrice(item.price)} {currency}</p>
                        <p>Количество: {item.quantity}</p>
                        {showSize && <p>Размер: {item.size}</p>}
                      </motion.div>
                      <motion.p
                        className="mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.15 }}
                      >
                        Дата: <span className="text-gray-400">
                          {new Date(item.order_date).toLocaleDateString("ru-RU", {
                            weekday: "long",
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                          })}
                        </span>
                      </motion.p>
                      <motion.p
                        className="mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        Способ доставки: <span className="text-gray-400">
                          {translateDeliveryMethod(item.delivery_method)}
                        </span>
                      </motion.p>
                      <motion.p
                        className="mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.25 }}
                      >
                        Способ оплаты: <span className="text-gray-400">
                          {translatePaymentMethod(item.payment_method)}
                        </span>
                      </motion.p>
                      <motion.p
                        className="mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
                      >
                        Статус оплаты: <span className="text-gray-400">
                          {item.payment ? "Оплачен" : "Ожидает оплаты"}
                        </span>
                      </motion.p>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-between">
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.35 }}
                    >
                      <motion.span
                        className={`min-w-2 h-2 rounded-full ${statusColor}`}
                        variants={statusDotVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                      />
                      <p className="text-sm md:text-base">
                        {translateStatus(item.status)}
                      </p>
                    </motion.div>
                    <motion.button
                      className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100 transition-colors"
                      onClick={loadOrderData}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.4 }}
                    >
                      {refreshing ? "Обновление..." : "Отследить заказ"}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.h2
            className="text-gray-700 font-medium text-xl mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Нет заказов
          </motion.h2>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Orders;
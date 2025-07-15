import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import InputMask from "@mona-health/react-input-mask";
import api from "../services/apiService";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cash-on-delivery");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    deliveryMethod,
    setDeliveryMethod
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

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

  const paymentMethodVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    hover: { scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
  };

  const addressFieldsVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        when: "afterChildren"
      }
    }
  };

  const handleChangePhone = (event) => {
    setFormData(data => ({ ...data, phone: event.target.value }));
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleDeliveryMethodChange = (newMethod) => {
    setDeliveryMethod(newMethod);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product.uuid === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      };

      let orderData = {
        amount: getCartAmount() + delivery_fee,
        products: orderItems,
        deliveryMethod: deliveryMethod,
        shippingAddress: formData,
      };

      switch (method) {
        case "cash-on-delivery":
          const response = await api.post(
            "/api/order/place",
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
            toast.success("Заказ оформлен");
          } else {
            toast.error("Произошла ошибка при оформлении заказа. Попробуйте снова");
          }
          break;

        case "online":
          const responseYookassa = await api.post(
            "/api/order/yookassa",
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (responseYookassa.data.success) {
            const { session_url } = responseYookassa.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseYookassa.data.message);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <motion.form
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      onSubmit={onSubmitHandler}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col gap-4 w-full sm:max-w-[480px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-xl sm:text-2xl my-3" variants={itemVariants}>
          <Title text1={"ИНФОРМАЦИЯ"} text2={"О ДОСТАВКЕ"} />
        </motion.div>
        <motion.div className="flex gap-3 mb-4" variants={itemVariants}>
          <motion.div
            className={`flex-1 border p-3 text-center cursor-pointer ${deliveryMethod === "pickup" ? "bg-black text-white" : "bg-white"}`}
            onClick={() => handleDeliveryMethodChange("pickup")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Самовывоз
          </motion.div>
          <motion.div
            className={`flex-1 border p-3 text-center cursor-pointer ${deliveryMethod === "courier" ? "bg-black text-white" : "bg-white"}`}
            onClick={() => handleDeliveryMethodChange("courier")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Курьером
          </motion.div>
        </motion.div>
        <motion.div className="flex gap-3" variants={itemVariants}>
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Фамилия"
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            required
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Имя"
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            required
          />
        </motion.div>
        <motion.input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email"
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          required
          variants={itemVariants}
        />
        <AnimatePresence>
          {deliveryMethod === "courier" && (
            <motion.div
              variants={addressFieldsVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
            >
              <motion.input
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="Улица"
                onChange={onChangeHandler}
                name="street"
                value={formData.street}
                required
                variants={itemVariants}
              />
              <motion.div className="flex gap-3 mt-2" variants={itemVariants}>
                <input
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="Город"
                  onChange={onChangeHandler}
                  name="city"
                  value={formData.city}
                  required
                />
                <input
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="Область"
                  onChange={onChangeHandler}
                  name="state"
                  value={formData.state}
                  required
                />
              </motion.div>
              <motion.div className="flex gap-3 mt-2" variants={itemVariants}>
                <input
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  maxLength="6"
                  placeholder="Индекс"
                  onChange={onChangeHandler}
                  onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault() } }}
                  name="zipcode"
                  value={formData.zipcode}
                  required
                />
                <input
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="Страна"
                  onChange={onChangeHandler}
                  name="country"
                  value={formData.country}
                  required
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div variants={itemVariants}>
          <InputMask
            mask={"+7 (999) 999-99-99"}
            value={formData.phone}
            onChange={handleChangePhone}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="+7 (___) ___-__-__"
            required
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div className="mt-8">
          <CartTotal />
        </motion.div>
        <motion.div className="mt-12" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Title text1={"СПОСОБ"} text2={"ОПЛАТЫ"} />
          </motion.div>
          <motion.div className="flex gap-3 flex-col lg:flex-row mt-4">
            <motion.div
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              onClick={() => setMethod("online")}
              variants={paymentMethodVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "online" ? "bg-green-400" : ""}`}
                animate={method === "online" ? { scale: 1.2 } : { scale: 1 }}
              />
              <p className="text-gray-500 text-sm font-medium mx-4">ОНЛАЙН <br></br> VISA, MasterCard, СБП, SperPay</p>
            </motion.div>
            <motion.div
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              onClick={() => setMethod("cash-on-delivery")}
              variants={paymentMethodVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            >
              <motion.div
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "cash-on-delivery" ? "bg-green-400" : ""}`}
                animate={method === "cash-on-delivery" ? { scale: 1.2 } : { scale: 1 }}
              />
              <p className="text-gray-500 text-sm font-medium mx-4">ПРИ ПОЛУЧЕНИИ <br></br> Оплата наличными или по карте</p>
            </motion.div>
          </motion.div>
          <motion.div
            className="w-full text-end mt-8"
            variants={itemVariants}
          >
            <motion.button
              className="bg-black text-white px-16 py-3 text-sm hover:bg-gray-800 transition-colors"
              type="submit"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              ОФОРМИТЬ ЗАКАЗ
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.form>
  )
};

export default PlaceOrder;
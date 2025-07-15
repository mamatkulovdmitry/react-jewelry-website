import React from "react";
import { motion } from "framer-motion";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "anticipate"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"СВЯЗАТЬСЯ"} text2={"С НАМИ"} />
      </div>
      <motion.div
        className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28"
        variants={containerVariants}
      >
        <motion.img
          className="w-full md:max-w-[480px] md:max-h-80 lg:max-h-fit"
          src={assets.contact_us}
          alt="Contact Image"
          variants={imageVariants}
        />
        <motion.div
          className="flex flex-col justify-center items-start gap-6 max-w-lg"
          variants={containerVariants}
        >
          <motion.p className="font-semibold text-xl text-gray-600" variants={itemVariants}>
            Наш магазин
          </motion.p>
          <motion.p className="text-gray-500" variants={itemVariants}>
            ул. Вайнера, 14 <br /> г. Екатеринбург, Свердловская обл., Россия
          </motion.p>
          <motion.p className="text-gray-500" variants={itemVariants}>
            Телефон: <a href="tel:+79126017918" className="hover:text-gray-700 transition-colors">+7 (912) 601-79-18</a> <br />
            Email: <a href="mailto:info@uvelir.com" className="hover:text-gray-700 transition-colors">info@uvelir.com</a>
          </motion.p>
          <motion.p className="font-semibold text-xl text-gray-600" variants={itemVariants}>
            Карьера в Центр Ювелир
          </motion.p>
          <motion.p className="text-gray-500" variants={itemVariants}>
            Присоединяйтесь к нашей команде и станьте частью компании, которая ценит талант, стремится к инновациям и создает уникальные ювелирные произведения искусства.
          </motion.p>
          <motion.a
            className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500"
            href="mailto:info@uvelir.com"
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Связаться с нами
          </motion.a>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <NewsletterBox />
      </motion.div>
    </motion.div>
  )
};

export default Contact;
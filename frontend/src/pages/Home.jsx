import React, { useEffect } from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3
    }
  }
};

const sectionVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
      </motion.div>
      <motion.section
        variants={sectionVariants}
        viewport={{ once: true, margin: "-100px" }}
        whileInView="visible"
        initial="hidden"
      >
        <LatestCollection />
      </motion.section>
      <motion.section
        variants={sectionVariants}
        viewport={{ once: true, margin: "-100px" }}
        whileInView="visible"
        initial="hidden"
        transition={{ delay: 0.2 }}
      >
        <BestSeller />
      </motion.section>
      <motion.section
        variants={sectionVariants}
        viewport={{ once: true, margin: "-100px" }}
        whileInView="visible"
        initial="hidden"
        transition={{ delay: 0.3 }}
      >
        <OurPolicy />
      </motion.section>
      <motion.section
        variants={{
          hidden: { y: 100, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }
          }
        }}
        viewport={{ once: true, margin: "-100px" }}
        whileInView="visible"
        initial="hidden"
      >
        <NewsletterBox />
      </motion.section>
    </motion.div>
  )
};

export default Home;
import React from "react";
import { motion } from "framer-motion";

const ScrollUp = ({ scrolled }) => {
    return (
        <motion.button
            className="fixed right-4 bottom-12 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center z-40"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            aria-label="Наверх"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
            >
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </motion.button>
    )
};

export default ScrollUp;
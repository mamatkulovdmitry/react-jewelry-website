import React, { useState } from "react";
import { toast } from "react-toastify";

const NewsletterBox = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        toast.success("Спасибо, что подписались на нашу рассылку!");

        setTimeout(() => {
            setIsSubmitted(false);
        }, 3000);
    };

    return (
        <div className="text-center">
            <p className="text-2xl font-medium text-gray-800">Подпишитесь и получите скидку 20%</p>
            <p className="text-gray-400 mt-3">
                Узнайте первыми о наших новинках, акциях и уникальных предложениях.
            </p>
            <form className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3" onSubmit={onSubmitHandler}>
                <input
                    className="w-full sm:flex-1 outline-none"
                    type="email"
                    placeholder="Email"
                    required
                />
                <button
                    className={`
                        ${isSubmitted ?
                            "bg-green-500 text-white" :
                            "bg-black text-white hover:bg-gray-800"}
                        text-sm font-medium 
                        px-8 py-4
                        transition-all duration-300
                        flex items-center justify-center gap-2
                        whitespace-nowrap
                        ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}
                    `}
                    type="submit"
                    disabled={isSubmitted}
                >
                    {isSubmitted ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            УСПЕШНО
                        </>
                    ) : (
                        "ПОДПИСАТЬСЯ"
                    )}
                </button>
            </form>
        </div>
    );
};

export default NewsletterBox;
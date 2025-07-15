import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img className="w-12 m-auto mb-5" src={assets.exchange_icon} alt="Exchange Icon" />
        <p className="font-semibold">Пожизненная гарантия</p>
        <p className="text-gray-400">Ваши украшения — наша вечная забота</p>
      </div>
      <div>
        <img className="w-12 m-auto mb-5" src={assets.quality_icon} alt="Quality Icon" />
        <p className="font-semibold">Качество и оригинальность</p>
        <p className="text-gray-400">Мы гарантируем подлинность и высокое качество наших изделий</p>
      </div>
      <div>
        <img className="w-12 m-auto mb-5" src={assets.support_img} alt="Support Icon" />
        <p className="font-semibold">Надёжность и удобство</p>
        <p className="text-gray-400">Ваш комфорт — наш приоритет. Надёжно и прозрачно</p>
      </div>
    </div>
  )
};

export default OurPolicy;
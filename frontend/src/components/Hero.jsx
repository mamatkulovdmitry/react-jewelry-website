import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="flex flex-col sm:flex-row border border-gray-400">
            <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
                <div className="text-[#414141]">
                    <div className="flex items-center gap-2">
                        <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                        <p className="font-medium text-sm md:text-base">НАШИ БЕСТСЕЛЛЕРЫ</p>
                    </div>
                    <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">Последние поступления</h1>
                    <div className="flex items-center gap-2">
                        <Link to="/collection"><p className="font-semibold text-sm md:text-base">ПЕРЕЙТИ К ПОКУПКАМ</p></Link>
                        <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
                    </div>
                </div>
            </div>
            <img className="w-full sm:w-1/2" src={assets.hero_img} alt="Hero Image" />
        </div>
    )
};

export default Hero;
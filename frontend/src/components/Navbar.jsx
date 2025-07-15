import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = ({ scrolled }) => {
  const [visible, setVisible] = useState(false);
  const { showSearch, setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
  const location = useLocation();

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const handleSearchButton = () => {
    if (location.pathname !== "/collection") {
      navigate("/collection");
      setShowSearch(true);
    } else {
      setShowSearch(!showSearch);
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''} px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]`}>
      <div className="flex items-center justify-between py-5 font-medium max-w-[1920px] mx-auto">
        <Link to="/"><img className="w-32 sm:w-36 lg:w-full max-h-10" src={assets.logo} alt="Logo" /></Link>
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink className="flex flex-col items-center gap-1" to="/">
            <p>ГЛАВНАЯ</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink className="flex flex-col items-center gap-1" to="/collection">
            <p>КОЛЛЕКЦИИ</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink className="flex flex-col items-center gap-1" to="/about">
            <p>О НАС</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink className="flex flex-col items-center gap-1" to="/contact">
            <p>КОНТАКТЫ</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>
        <div className="flex items-center gap-6">
          <img className="w-5 cursor-pointer" src={assets.search_icon} alt="Search Icon" onClick={handleSearchButton} />
          <div className="group relative z-10">
            <img className="w-5 cursor-pointer" src={assets.profile_icon} onClick={() => token ? navigate("/profile") : navigate("/login")} alt="Profile Icon" />
            {
              token &&
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p className="cursor-pointer hover:text-black" onClick={() => navigate("/profile")}>Мой профиль</p>
                  <p className="cursor-pointer hover:text-black" onClick={() => navigate("/orders")}>Заказы</p>
                  <p className="cursor-pointer hover:text-black" onClick={logout}>Выйти</p>
                </div>
              </div>
            }
          </div>
          <Link className="relative" to="/cart">
            <img className="w-5 min-w-5" src={assets.cart_icon} alt="Cart Icon" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">{getCartCount()}</p>
          </Link>
          <img className="w-5 cursor-pointer sm:hidden" src={assets.menu_icon} onClick={() => setVisible(true)} alt="Menu Icon" />
        </div>
        <div className={`fixed top-0 right-0 bottom-0 h-screen w-full bg-white transition-all duration-300 ease-in-out transform ${visible ? "translate-x-0" : "translate-x-full"
          } z-20`}>
          <div className="flex flex-col h-full text-gray-600">
            <div className="flex items-center gap-4 p-3 cursor-pointer border-b" onClick={() => setVisible(false)}>
              <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Dropdown Icon" />
              <p>Назад</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavLink
                className="block py-2 pl-6 border-b hover:bg-gray-50"
                onClick={() => setVisible(false)}
                to="/"
              >
                ГЛАВНАЯ
              </NavLink>
              <NavLink
                className="block py-2 pl-6 border-b hover:bg-gray-50"
                onClick={() => setVisible(false)}
                to="/collection"
              >
                КОЛЛЕКЦИИ
              </NavLink>
              <NavLink
                className="block py-2 pl-6 border-b hover:bg-gray-50"
                onClick={() => setVisible(false)}
                to="/about"
              >
                О НАС
              </NavLink>
              <NavLink
                className="block py-2 pl-6 border-b hover:bg-gray-50"
                onClick={() => setVisible(false)}
                to="/contact"
              >
                КОНТАКТЫ
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Navbar;
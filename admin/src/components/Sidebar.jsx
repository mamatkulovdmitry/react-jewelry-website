import React, { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

import { FiHome } from "react-icons/fi";
import { TbShoppingBag } from "react-icons/tb";
import { TbShoppingBagPlus } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FiShoppingBag } from "react-icons/fi";

const Sidebar = forwardRef(({ collapsed }, ref) => {
  return (
    <div className={`fixed z-20 flex h-full w-[240px] flex-col overflow-x-hidden border-r [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] border-slate-300 bg-white ${collapsed ? "md:w-[70px] md:items-center max-md:-left-full" : "md:w-[240px] max-md:left-0"}`} ref={ref}>
      <div className="flex gap-x-3 p-3">
        <img className="w-[max(10%,240px)]" src={assets.logo} alt="Logo" />
      </div>
      <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
        <nav className={`flex w-full flex-col gap-y-2 ${collapsed ? "md:items-center" : ""}`}>
          <p className={`overflow-hidden text-ellipsis text-sm font-medium text-slate-600" ${collapsed ? "md:w-[45px]" : ""}`}>Главная</p>
          <NavLink className={({ isActive }) => `flex h-[40px] w-full flex-shrink-0 items-center gap-x-3 rounded-lg p-3 text-base font-medium text-slate-900 transition-colors  ${isActive ? "bg-blue-500 !text-slate-50" : "hover:bg-blue-50"} ${collapsed ? "md:w-[45px]" : ""}`} to="/admin/dashboard">
            <FiHome className="flex-shrink-0 text-xl" />
            {!collapsed && <p className="whitespace-nowrap">Главная</p>}
          </NavLink>
        </nav>
        <nav className={`flex w-full flex-col gap-y-2 ${collapsed ? "md:items-center" : ""}`}>
          <p className={`overflow-hidden text-ellipsis text-sm font-medium text-slate-600" ${collapsed ? "md:w-[45px]" : ""}`}>Товары</p>
          <NavLink className={({ isActive }) => `flex h-[40px] w-full flex-shrink-0 items-center gap-x-3 rounded-lg p-3 text-base font-medium text-slate-900 transition-colors  ${isActive ? "bg-blue-500 !text-slate-50" : "hover:bg-blue-50"} ${collapsed ? "md:w-[45px]" : ""}`} to="/admin/products">
            <TbShoppingBag className="flex-shrink-0 text-xl" />
            {!collapsed && <p className="whitespace-nowrap">Товары</p>}
          </NavLink>
          <NavLink className={({ isActive }) => `flex h-[40px] w-full flex-shrink-0 items-center gap-x-3 rounded-lg p-3 text-base font-medium text-slate-900 transition-colors  ${isActive ? "bg-blue-500 !text-slate-50" : "hover:bg-blue-50"} ${collapsed ? "md:w-[45px]" : ""}`} to="/admin/new-product">
            <TbShoppingBagPlus className="flex-shrink-0 text-xl" />
            {!collapsed && <p className="whitespace-nowrap">Добавить товар</p>}
          </NavLink>
        </nav>
        <nav className={`flex w-full flex-col gap-y-2 ${collapsed ? "md:items-center" : ""}`}>
          <p className={`overflow-hidden text-ellipsis text-sm font-medium text-slate-600" ${collapsed ? "md:w-[45px]" : ""}`}>Клиенты</p>
          <NavLink className={({ isActive }) => `flex h-[40px] w-full flex-shrink-0 items-center gap-x-3 rounded-lg p-3 text-base font-medium text-slate-900 transition-colors  ${isActive ? "bg-blue-500 !text-slate-50" : "hover:bg-blue-50"} ${collapsed ? "md:w-[45px]" : ""}`} to="/admin/users">
            <LuUsers className="flex-shrink-0 text-xl" />
            {!collapsed && <p className="whitespace-nowrap">Клиенты</p>}
          </NavLink>
          <NavLink className={({ isActive }) => `flex h-[40px] w-full flex-shrink-0 items-center gap-x-3 rounded-lg p-3 text-base font-medium text-slate-900 transition-colors  ${isActive ? "bg-blue-500 !text-slate-50" : "hover:bg-blue-50"} ${collapsed ? "md:w-[45px]" : ""}`} to="/admin/new-user">
            <AiOutlineUsergroupAdd className="flex-shrink-0 text-xl" />
            {!collapsed && <p className="whitespace-nowrap">Добавить клиента</p>}
          </NavLink>
        </nav>
        <nav className={`flex w-full flex-col gap-y-2 ${collapsed ? "md:items-center" : ""}`}>
          <p className={`overflow-hidden text-ellipsis text-sm font-medium text-slate-600" ${collapsed ? "md:w-[45px]" : ""}`}>Заказы</p>
          <NavLink className={({ isActive }) => `flex h-[40px] w-full flex-shrink-0 items-center gap-x-3 rounded-lg p-3 text-base font-medium text-slate-900 transition-colors  ${isActive ? "bg-blue-500 !text-slate-50" : "hover:bg-blue-50"} ${collapsed ? "md:w-[45px]" : ""}`} to="/admin/orders">
            <FiShoppingBag className="flex-shrink-0 text-xl" />
            {!collapsed && <p className="whitespace-nowrap">Заказы</p>}
          </NavLink>
        </nav>
      </div>
    </div>
  )
});

export default Sidebar;
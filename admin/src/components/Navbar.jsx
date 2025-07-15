import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronsLeft } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { LuCircleUser } from "react-icons/lu";
import api from "../services/apiService";

const Navbar = ({ collapsed, setCollapsed, setToken, token }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    loading: true
  });
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await api.get(`/api/user/single/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const user = response.data.user;
        setUserData({
          name: `${user.last_name} ${user.first_name}`.trim(),
          role: user.is_admin ? "Администратор" : "Менеджер",
          loading: false
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
      toast.error("Не удалось загрузить данные пользователя");
      setUserData({
        name: "Пользователь",
        role: "Неизвестно",
        loading: false
      });
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchUserData(decoded.id);
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
        setUserData({
          name: "Пользователь",
          role: "Неизвестно",
          loading: false
        });
      }
    } else {
      setUserData({
        name: "Гость",
        role: "Гость",
        loading: false
      });
    }
  }, [token]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");
    navigate('/admin');
  };

  const showLoader = userData.loading && !minLoadingComplete;

  return (
    <div className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md">
      <div className="flex items-center gap-x-3">
        <button
          className="flex w-10 h-10 flex-shrink-0 items-center justify-center gap-x-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-slate-500"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FiChevronsLeft className={`${collapsed ? "rotate-180" : ""} text-2xl`} />
        </button>
      </div>
      <div className="flex items-center gap-x-3">
        {showLoader ? (
          <div className="w-10 h-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
          </div>
        ) : (
          <div className="group relative z-10">
            <button className="flex w-10 h-10 flex-shrink-0 items-center justify-center gap-x-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-slate-500">
              <LuCircleUser className="w-6 h-6" />
            </button>
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <h3 className="text-base font-medium w-max">
                      {userData.name || "Пользователь"}
                    </h3>
                    <p className="text-sm opacity-70">
                      {userData.role}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="flex items-center gap-3 cursor-pointer hover:text-black">
                  <p onClick={handleLogout}>Выйти</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
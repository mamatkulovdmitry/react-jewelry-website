import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import api from "../services/apiService";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const response = await api.post("/api/user/admin", { email, password });

      if (response.data.success) {
        setToken(response.data.accessToken);
        navigate("/admin/dashboard");
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Админ панель</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
            <input className="w-full px-3 py-2 border border-gray-800 focus:ring-1 focus:ring-gray-800 focus:border-gray-800 transition" type="email" placeholder="example@email.com" onChange={(event) => setEmail(event.target.value)} value={email} required />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Пароль</p>
            <input className="w-full px-3 py-2 border border-gray-800 focus:ring-1 focus:ring-gray-800 focus:border-gray-800 transition" type="password" placeholder="••••••••" onChange={(event) => setPassword(event.target.value)} value={password} required />
          </div>
          <button className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black" type="submit">Войти</button>
        </form>
      </div>
    </div>
  )
}

export default Login;
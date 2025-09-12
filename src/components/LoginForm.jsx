import React, { useState } from "react";
import "./LoginForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {   // ✅ parent se onLogin prop le rahe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("Email:", email);
    console.log("Password:", password);

    e.preventDefault();
    try {
      const res = await axios.post("https://task-manager-backend-production-e3a6.up.railway.app/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      },
        {
          headers: {
            "Content-Type": "application/json",
          }
        });

      if (res.data?.token) {
        //parent ko token bheja (App.jsx ke setToken ko call karega)
        onLogin(res.data.token);

        //Login ke baad dashboard pe redirect
        navigate("/");
        alert("Login successful!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;

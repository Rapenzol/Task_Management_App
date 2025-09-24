import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();


  // ✅ Send OTP function
  const sendOtp = async () => {
    if (!email) {
      alert("Enter email first!");
      return;
    }

    try {
      await axios.post("https://task-manager-backend-production-e3a6.up.railway.app/api/auth/send-otp", {
        email: email.trim().toLowerCase()
      });
      alert("OTP sent to your email!");
      setOtpSent(true);
    } catch (err) {
      console.error("Send OTP error:", err.response?.data || err.message);
      alert("Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    if (!otpSent) {
      alert("Please request OTP first!");
      return;
    }

    try {
      const res = await axios.post("https://task-manager-backend-production-e3a6.up.railway.app/api/auth/signup", {
        name,
        email: email.trim().toLowerCase(),
        password: password.trim(),
        otp: otp.trim()
      });
      console.log("Signup success:", res.data);
      alert("Registration successful!");
      // Redirect to login page
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed!");
      console.error("Signup error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <label>Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <label>OTP</label>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="button" onClick={sendOtp}>Send OTP</button>

        <p className="login-link">
          Already have an account?{" "}
          <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default Register;

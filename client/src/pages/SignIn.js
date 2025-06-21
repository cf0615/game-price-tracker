// src/pages/SignIn.js
import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import bg from "../assets/games.jpg";

export default function SignIn() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/signin", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));  // ✅ Make sure user.id is returned from server

      setMsg("✅ Login successful.");
      navigate("/");
    } catch (err) {
      setMsg(err.response.data.msg || "❌ Login failed.");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Sign In</h2>
        <input name="username" onChange={handleChange} placeholder="Username" required style={styles.input} />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>
        <p style={styles.message}>{msg}</p>
      </form>
    </div>
  );
}

const styles = {
  container: {
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},
  form: {
    backgroundColor: "#1e1e1e",
    padding: "2rem",
    borderRadius: "8px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "1rem",
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "4px",
  },
  button: {
    backgroundColor: "#2196f3",
    color: "#fff",
    padding: "0.75rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    color: "#ccc",
    textAlign: "center",
  }
};
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API = "https://student-crud-app-v7pd.onrender.com/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, form);
      localStorage.setItem("token", res.data.token);
      window.location = "/dashboard";
      navigate("/dashboard");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button onClick={login}>Login</button>
      <p onClick={() => window.location="/register"}>Go to Register</p>
    </div>
  );
}

export default Login;
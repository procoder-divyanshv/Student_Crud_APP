import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API = "https://student-crud-app-v7pd.onrender.com/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", course: ""
  });

  const register = async () => {
    try {
      await axios.post(`${API}/register`, form);
      alert("Registered successfully");
      window.location = "/";
      navigate("/login");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <input placeholder="Course" onChange={e => setForm({...form, course: e.target.value})} />
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;
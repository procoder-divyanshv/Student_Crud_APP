import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://student-crud-app-v7pd.onrender.com/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [course, setCourse] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location = "/";
      return;
    }

    axios.get(`${API}/me`, {
      headers: { Authorization: token }
    })
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        window.location = "/";
      });
  }, []);

  // ✅ update password
  const handleUpdatePassword = async () => {
    try {
      const res = await axios.put(`${API}/update-password`, {
        oldPassword,
        newPassword
      }, {
        headers: { Authorization: token }
      });

      alert(`${res.data.message}` || "Password updated");
    } catch (err) {
      alert(err?.response?.data?.message || "Error");
    }
  };

  // ✅ update course
  const updateCourse = async () => {
    try {
      await axios.put(`${API}/update-course`, { course }, {
        headers: { Authorization: token }
      });
      alert("Course updated");
    } catch (err) {
      alert("Error updating course");
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };


  return user && (
    <div className="container">

  <div className="card user-info">
    <h2>Dashboard</h2>
    <p>Name: {user.name}</p>
    <p>Email: {user.email}</p>
    <p>Course: {user.course}</p>
    <button className="logout-btn" onClick={logout}>Logout</button>
  </div>

  <div className="card section">
    <h3>Update Password</h3>
    <input placeholder="Old Password" onChange={(e) => setOldPassword(e.target.value)} />
    <input placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} />
    <button onClick={handleUpdatePassword}>Update Password</button>
  </div>

  <div className="card section">
    <h3>Update Course</h3>
    <select onChange={(e) => setCourse(e.target.value)}>
      <option value="">Select Course</option>
      <option value="B.Tech">B.Tech</option>
      <option value="BCA">BCA</option>
      <option value="MCA">MCA</option>
    </select>
    <button onClick={updateCourse}>Update Course</button>
  </div>

</div>)

}

export default Dashboard;
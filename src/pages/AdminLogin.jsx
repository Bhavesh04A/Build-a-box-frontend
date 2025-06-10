// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import validator from "validator";
import toast from "react-hot-toast";
import axios from "axios";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!validator.isEmail(form.email)) errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = e => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate());
  };



const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validate();
  setErrors(errs);
  setTouched({ email: true, password: true });
  if (Object.keys(errs).length === 0) {
    setLoading(true);
    try {
      await login(form.email, form.password, false, true); // <-- यही सही है
      setLoading(false);
      toast.success("Admin Login successful! Welcome admin");
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 100);
    } catch (error) {
      setLoading(false);
      toast.error("Invalid admin credentials");
      console.error(error);
    }
  }
};




  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fade-in"
        autoComplete="off"
      >
        <h2 className="text-3xl font-bold text-blue-400 mb-2 text-center">Admin Login</h2>
        <p className="text-gray-500 mb-2 text-center">Admin access only</p>
        <div className="mb-4 text-center text-sm bg-blue-50 border border-blue-300 rounded p-2">
          <div><b>Demo Credentials</b></div>
          <div>Email: <span className="font-mono">admin@gmail.com</span></div>
          <div>Password: <span className="font-mono">admin123</span></div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className={`w-full px-4 py-2 rounded border transition focus:ring-2 focus:ring-blue-400 ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}`}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="admin@gmail.com"
          />
          {errors.email && touched.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            className={`w-full px-4 py-2 rounded border transition focus:ring-2 focus:ring-blue-400 ${errors.password && touched.password ? "border-red-500" : "border-gray-300"}`}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your password"
          />
          {errors.password && touched.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-1000 transition font-semibold text-lg flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg>
              Logging In...
            </>
          ) : "Login as Admin"}
        </button>
        <p className="text-center mt-4 text-gray-600">
          Not an admin?{" "}
          <Link to="/user-login" className="text-blue-400 hover:underline">User Login</Link>
        </p>
      </form>
    </div>
  );
}

export default AdminLogin;

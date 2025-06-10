import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import validator from "validator";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!validator.isEmail(form.email)) errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!form.confirm) errs.confirm = "Confirm your password";
    else if (form.confirm !== form.password) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = e => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate());
  };


  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        const res = await axios.post(`${API_URL}/api/auth/signup`, {
          name: form.name,
          email: form.email,
          password: form.password
        });
        toast.success("Signup successful! Welcome " + res.data.name);
        setLoading(false);
        navigate("/user-login");
      } catch (err) {
        setLoading(false);
        toast.error(err.response?.data?.error || "Signup failed");
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
        <h2 className="text-3xl font-bold text-blue-400 mb-2 text-center">Sign Up</h2>
        <p className="text-gray-500 mb-6 text-center">Create your account</p>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            className={`w-full px-4 py-2 rounded border transition focus:ring-2 focus:ring-blue-300 ${errors.name && touched.name ? "border-red-500" : "border-gray-300"}`}
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your Name"
          />
          {errors.name && touched.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className={`w-full px-4 py-2 rounded border transition focus:ring-2 focus:ring-blue-300 ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}`}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@email.com"
          />
          {errors.email && touched.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            className={`w-full px-4 py-2 rounded border transition focus:ring-2 focus:ring-blue-300 ${errors.password && touched.password ? "border-red-500" : "border-gray-300"}`}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="At least 8 characters"
          />
          {errors.password && touched.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirm"
            className={`w-full px-4 py-2 rounded border transition focus:ring-2 focus:ring-blue-300 ${errors.confirm && touched.confirm ? "border-red-500" : "border-gray-300"}`}
            value={form.confirm}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Re-enter password"
          />
          {errors.confirm && touched.confirm && <span className="text-red-500 text-sm">{errors.confirm}</span>}
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-500 transition font-semibold text-lg flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg>
              Signing Up...
            </>
          ) : "Sign Up"}
        </button>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/user-login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;

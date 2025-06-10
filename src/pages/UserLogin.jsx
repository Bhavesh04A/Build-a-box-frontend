import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import validator from "validator";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    let errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!validator.isEmail(form.email)) errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleBlur = e => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate());
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ email: true, password: true });
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await login(form.email, form.password, form.rememberMe);
        toast.success("Login successful!");
        setLoading(false);
        navigate("/"); // Ya dashboard
      } catch (err) {
        setLoading(false);
        toast.error(err.response?.data?.error || "Login failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fade-in"
        autoComplete="on" // Enable browser autofill
      >
        <h2 className="text-3xl font-bold text-blue-400 mb-2 text-center">User Login</h2>
        <p className="text-gray-500 mb-6 text-center">Login to your account</p>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            autoComplete="username" // Important for autofill
            className={`w-full px-4 py-2 rounded border transition focus:ring-2 focus:ring-blue-300 ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}`}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@email.com"
            required
          />
          {errors.email && touched.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password" // Important for autofill
            className={`w-full px-4 py-2 rounded border transition focus:ring-2 focus:ring-blue-300 ${errors.password && touched.password ? "border-red-500" : "border-gray-300"}`}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your password"
            required
          />
          {errors.password && touched.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>
        {/* Remember Me */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-sm">Remember Me</label>
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-500 transition font-semibold text-lg flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/></svg>
              Logging In...
            </>
          ) : "Login"}
        </button>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default UserLogin;

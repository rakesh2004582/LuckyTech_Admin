import React, { useState } from "react";
import { toast } from "react-toastify";
import adminsData from "../data/admin.json";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const admin = adminsData.admins.find(
      (a) =>
        a.adminEmail === email &&
        a.adminPassword === password
    );

    // if (admin) {
    //   toast.success(`Welcome ${admin.adminName}`);
    //   // navigate to admin dashboard or another page
    //   navigation("/admin/dashboard");
    // } else {
    //   toast.error("Invalid email or password");
    // }
    if (admin) {
  toast.success(`Welcome ${admin.adminName}`);

  // ✅ save login
  localStorage.setItem("admin", JSON.stringify(admin));

  navigation("/admin/dashboard");
} else {
  toast.error("Invalid email or password");
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;

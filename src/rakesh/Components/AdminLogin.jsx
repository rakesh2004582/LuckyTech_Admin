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
          {/* Admin Login */}
          <img src="/logo.webp" alt="Logo" className="mx-auto w-auto h-19" />
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












// import React, { useState } from "react";

// const App = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [adminName, setAdminName] = useState("");

//   // Mock admin data (since we can't use external JSON files)
//   const mockAdmins = [
//     {
//       adminEmail: "admin@luckytech.com",
//       adminPassword: "secure123",
//       adminName: "Rajesh Kumar"
//     },
//     {
//       adminEmail: "superuser@luckytech.com",
//       adminPassword: "lucky@2026",
//       adminName: "Priya Sharma"
//     }
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");

//     const admin = mockAdmins.find(
//       (a) => a.adminEmail === email && a.adminPassword === password
//     );

//     if (admin) {
//       setAdminName(admin.adminName);
//       setIsLoggedIn(true);
//     } else {
//       setError("Invalid email or password. Please try again.");
//     }
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setEmail("");
//     setPassword("");
//     setAdminName("");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       {!isLoggedIn ? (
//         // Login Form
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
//           <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-center">
//             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-indigo-700 text-3xl font-bold">LT</span>
//             </div>
//             <h1 className="text-2xl font-bold text-white">Lucky Tech Admin Portal</h1>
//             <p className="text-indigo-100 mt-1">Secure access to your dashboard</p>
//           </div>
          
//           <div className="p-8">
//             {error && (
//               <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center">
//                 <span className="mr-2">⚠️</span>
//                 {error}
//               </div>
//             )}
            
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <span>✉️</span>
//                   </div>
//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                     placeholder="admin@luckytech.com"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <span>🔒</span>
//                   </div>
//                   <input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                     placeholder="••••••••"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md"
//               >
//                 Sign In to Dashboard
//               </button>
//             </form>
            
//             <div className="mt-6 pt-6 border-t border-gray-200 text-center">
//               <p className="text-sm text-gray-500">
//                 Contact support if you don't have credentials
//               </p>
//               <p className="text-sm font-medium text-indigo-600 mt-1">support@luckytech.com</p>
//             </div>
//           </div>
//         </div>
//       ) : (
//         // Dashboard View
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
//           <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
//             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-green-600 text-3xl font-bold">✓</span>
//             </div>
//             <h1 className="text-2xl font-bold text-white">Welcome, {adminName}!</h1>
//             <p className="text-green-100 mt-1">You're securely logged in</p>
//           </div>
          
//           <div className="p-8 text-center">
//             <div className="mb-8">
//               <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">
//                 Admin Portal
//               </div>
//               <h2 className="text-3xl font-bold text-gray-800 mt-4">Lucky Tech Systems</h2>
//               <p className="text-gray-600 mt-2 max-w-xs mx-auto">
//                 Access management dashboard, user analytics, and system controls
//               </p>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 mb-8">
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                 <div className="text-2xl font-bold text-indigo-600 mb-1">24</div>
//                 <div className="text-sm text-gray-600">Active Users</div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                 <div className="text-2xl font-bold text-indigo-600 mb-1">98%</div>
//                 <div className="text-sm text-gray-600">System Uptime</div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                 <div className="text-2xl font-bold text-indigo-600 mb-1">156</div>
//                 <div className="text-sm text-gray-600">Total Orders</div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                 <div className="text-2xl font-bold text-indigo-600 mb-1">₹2.4M</div>
//                 <div className="text-sm text-gray-600">Revenue</div>
//               </div>
//             </div>
            
//             <button
//               onClick={handleLogout}
//               className="w-full bg-white border-2 border-indigo-600 text-indigo-600 font-medium py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300"
//             >
//               Sign Out
//             </button>
            
//             <p className="text-xs text-gray-500 mt-4">
//               Session active • Lucky Tech Admin Portal v2.6
//             </p>
//           </div>
//         </div>
//       )}
      
//       <footer className="absolute bottom-4 text-center text-gray-600 text-sm">
//         <p>© 2026 Lucky Tech Solutions. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default App;

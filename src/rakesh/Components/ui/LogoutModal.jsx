import React from "react";
import { LogOut } from "lucide-react";

const LogoutModal = ({ onClose, onLogout }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut className="text-red-600" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
        <p className="text-gray-600 text-sm mb-6">Are you sure you want to logout from your account?</p>
        <div className="flex space-x-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
            Cancel
          </button>
          <button onClick={onLogout} className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default LogoutModal;
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${bgColor} text-white flex items-center space-x-2`}>
      {type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <XCircle size={16} />
      </button>
    </div>
  );
};

export default Toast;
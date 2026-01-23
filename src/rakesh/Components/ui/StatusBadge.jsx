import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Inactive": return "bg-red-100 text-red-800 border-red-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
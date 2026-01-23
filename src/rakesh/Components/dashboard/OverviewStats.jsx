import React from "react";
import { 
  GraduationCap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen, 
  Users 
} from "lucide-react";

const OverviewStats = ({ overviewStats }) => {
  const stats = [
    { 
      title: "Total Students", 
      value: overviewStats.totalStudents, 
      icon: GraduationCap, 
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      title: "Active Students", 
      value: overviewStats.activeStudents, 
      icon: CheckCircle, 
      color: "bg-green-100 text-green-600" 
    },
    { 
      title: "Inactive Students", 
      value: overviewStats.inactiveStudents, 
      icon: XCircle, 
      color: "bg-red-100 text-red-600" 
    },
    { 
      title: "Pending Students", 
      value: overviewStats.pendingStudents, 
      icon: Clock, 
      color: "bg-yellow-100 text-yellow-600" 
    },
    { 
      title: "Courses Offered", 
      value: overviewStats.coursesOffered, 
      icon: BookOpen, 
      color: "bg-purple-100 text-purple-600" 
    },
    { 
      title: "Faculty Members", 
      value: overviewStats.facultyMembers, 
      icon: Users, 
      color: "bg-indigo-100 text-indigo-600" 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className={`p-2 ${stat.color} rounded-lg`}>
              <stat.icon size={20} />
            </div>
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.title}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;
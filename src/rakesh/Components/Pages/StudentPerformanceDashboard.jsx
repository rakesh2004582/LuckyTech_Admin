// StudentPerformanceDashboard.jsx
import { ImageOff } from 'lucide-react';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {resultData as studentResultData} from '../../data/resultData';
import {placementData as studentPlacementData} from '../../data/placementData';
/**
 * StudentPerformanceDashboard component
 * 
 * Displays a comprehensive dashboard for student performance and placement tracking
 * 
 * Props:
 * - activeTab: string, the active tab to show
 * - setActiveTab: function, sets the active tab
 * - resultData: array, the student result data
 * - setResultData: function, sets the student result data
 * - placementData: array, the placement records
 * - tabs: array, the tabs to show
 * 
 * Returns:
 * - JSX of the StudentPerformanceDashboard component
 */
const StudentPerformanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('results');
  
  // Mock data
 const [resultData , setResultData] = useState(studentResultData);

  const [placementData,setPlacementData] = useState(studentPlacementData); // Mock placementData 

  const chartData = [
    { subject: 'Math', score: 92 },
    { subject: 'Science', score: 88 },
    { subject: 'English', score: 95 },
    { subject: 'History', score: 85 },
    { subject: 'Art', score: 90 },
  ];

  const tabs = [
    { id: 'results', label: 'Results', icon: '📊' },
    { id: 'placements', label: 'Placements', icon: '💼' },
    { id: 'grades', label: 'Grade Chart', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2 animate-fade-in">
            Student Performance Dashboard
          </h1>
          <p className="text-gray-600">Comprehensive analytics and placement tracking</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          {/* Results Table */}
          {activeTab === 'results' && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📊</span> Academic Results
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resultData.map((student, index) => (
                      <tr 
                        key={student.id} 
                        className={`transition-all duration-300 hover:bg-indigo-50 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{student.course}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {student.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{student.gpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Placement List */}
          {activeTab === 'placements' && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">💼</span> Placement Records
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {placementData.map((placement) => (
                  <div 
                    key={placement.id} 
                    className={`p-4 rounded-xl border-l-4 ${
                      placement.status === 'Placed' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-yellow-500 bg-yellow-50'
                    } transition-transform duration-300 hover:scale-[1.02]`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{placement.company}</h3>
                        <p className="text-gray-600">{placement.role}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        placement.status === 'Placed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {placement.status}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-indigo-700 font-medium">{placement.package}</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grade Chart */}
          {activeTab === 'grades' && (
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📈</span> Subject-wise Performance
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="subject" 
                      stroke="#4f46e5" 
                      fontWeight="600"
                    />
                    <YAxis 
                      stroke="#4f46e5" 
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="score" 
                      name="Score (%)"
                      fill="#6366f1" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Students', value: '1,248', change: '+12%' },
            { label: 'Avg GPA', value: '3.42', change: '+0.2' },
            { label: 'Placement Rate', value: '87%', change: '+5%' },
            { label: 'Top Company', value: 'Google', change: '12 offers' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-xl shadow-md border border-indigo-100 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold text-indigo-700">{stat.value}</span>
                <span className="ml-2 text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPerformanceDashboard;
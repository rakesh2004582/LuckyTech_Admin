import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Calendar, Users, BookOpen, Clock, AlertCircle, ChevronRight, Check, Download } from 'lucide-react';

// Helper function to generate Excel file with all attendance data
const generateExcelFile = (courses, students, attendanceData) => {
  let worksheetContent = '';
  
  // Group students by course
  const studentsByCourse = {};
  students.forEach(student => {
    if (!studentsByCourse[student.course]) {
      studentsByCourse[student.course] = [];
    }
    studentsByCourse[student.course].push(student);
  });
  
  // Get all unique dates across all courses
  const allDates = new Set();
  Object.keys(attendanceData).forEach(key => {
    const date = key.split('_')[1];
    allDates.add(date);
  });
  
  // Sort dates chronologically
  const sortedDates = Array.from(allDates).sort();
  
  // Generate header row
  worksheetContent += '<table><tr><th>Course</th><th>Student ID</th><th>Student Name</th>';
  sortedDates.forEach(date => {
    worksheetContent += `<th>${date}</th>`;
  });
  worksheetContent += '</tr>';
  
  // Add student rows for each course
  courses.forEach(course => {
    const courseStudents = studentsByCourse[course.course_name] || [];
    if (courseStudents.length === 0) return;
    
    courseStudents.forEach((student, index) => {
      worksheetContent += `<tr><td>${index === 0 ? course.course_name : ''}</td><td>${student.id}</td><td>${student.name}</td>`;
      
      sortedDates.forEach(date => {
        const attendanceKey = `${course.course_name}_${date}`;
        const status = attendanceData[attendanceKey]?.[student.id] 
          ? 'P' 
          : 'A';
        worksheetContent += `<td style="text-align:center;background-color:${status === 'P' ? '#dcfce7' : '#fee2e2'}">${status}</td>`;
      });
      
      worksheetContent += '</tr>';
    });
  });
  
  worksheetContent += '</table>';
  
  return URL.createObjectURL(new Blob([`
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8"/>
        <xml><x:ExcelWorkbook><x:ExcelWorksheets>
          <x:ExcelWorksheet><x:Name>Attendance Master</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
        </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #999; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: bold; }
        </style>
      </head>
      <body>${worksheetContent}</body>
    </html>
  `], { type: 'application/vnd.ms-excel' }));
};

const StudentAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const downloadUrlRef = useRef(null);
  
  // Load courses from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(stored);
  }, []);

  // Load students from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("students");
    setStudents(stored ? JSON.parse(stored) : []);
  }, []);

  // Cleanup download URL on unmount
  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current);
      }
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const toggleAttendance = (studentId) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, present: !student.present } : student
    ));
  };

  const submitAttendance = () => {
    if (!selectedCourse) return;
    
    const courseStudents = students.filter(student => student.course === selectedCourse.course_name);
    const presentCount = courseStudents.filter(s => s.present).length;
    const totalCount = courseStudents.length;
    
    if (presentCount === 0) {
      showToast('Please mark at least one student as present before submitting!', 'error');
      return;
    }
    
    // Save attendance data in structured format
    const attendanceKey = `${selectedCourse.course_name}_${selectedDate}`;
    const attendanceRecord = {};
    courseStudents.forEach(student => {
      attendanceRecord[student.id] = student.present;
    });
    
    // Update attendance submitted state
    setAttendanceSubmitted(prev => ({ 
      ...prev, 
      [attendanceKey]: attendanceRecord 
    }));
    
    showToast(`Attendance submitted successfully for ${selectedCourse.course_name}!\n${presentCount}/${totalCount} students present`);
  };

  const resetAttendance = () => {
    if (!selectedCourse) return;
    
    setStudents(prev => prev.map(student => 
      student.course === selectedCourse.course_name ? { ...student, present: false } : student
    ));
    
    const attendanceKey = `${selectedCourse.course_name}_${selectedDate}`;
    setAttendanceSubmitted(prev => {
      const newStatus = { ...prev };
      delete newStatus[attendanceKey];
      return newStatus;
    });
    showToast('Attendance reset successfully!', 'warning');
  };

  const groupCoursesByCategory = () => {
    const grouped = {};
    courses.forEach(course => {
      if (!grouped[course.category]) {
        grouped[course.category] = [];
      }
      grouped[course.category].push(course);
    });
    return grouped;
  };

  const groupedCourses = groupCoursesByCategory();

  const getCourseStudents = () => {
    if (!selectedCourse) return [];
    return students.filter(student => student.course === selectedCourse.course_name);
  };

  const handleDownload = () => {
    // Create download URL with all attendance data
    const url = generateExcelFile(courses, students, attendanceSubmitted);
    downloadUrlRef.current = url;
    
    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `LuckyTech_Academy_Master_Attendance.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    downloadUrlRef.current = null;
    showToast('Master attendance file downloaded successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white font-medium ${
          toast.type === 'success' ? 'bg-green-500' : 
          toast.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        }`}>
          {toast.message.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Lucky Tech Academy - Attendance System</h1>
          <p className="text-gray-600">Manage daily attendance for all courses</p>
        </div>

        {/* Course Selection */}
        {!selectedCourse ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BookOpen className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">Select Course</h2>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar size={20} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedCourses).map(([category, coursesInCategory]) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gray-50 p-2 rounded">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coursesInCategory.map((course, index) => {
                      const attendanceKey = `${course.course_name}_${selectedDate}`;
                      const isSubmitted = attendanceSubmitted[attendanceKey];
                      
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedCourse(course)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            isSubmitted 
                              ? 'border-green-400 bg-green-50 hover:shadow-lg' 
                              : 'border-gray-200 hover:shadow-md hover:border-blue-400'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">{course.course_name}</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>{course.duration_months} months</span>
                                </div>
                                <div>₹{course.monthly_fees}/month</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isSubmitted && (
                                <Check className="text-green-500 bg-green-100 rounded-full p-1" size={24} />
                              )}
                              <ChevronRight className={isSubmitted ? "text-green-500" : "text-blue-500"} size={20} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Attendance Interface */
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setSelectedCourse(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <ChevronRight className="transform rotate-180" size={20} />
                <span>Back to Courses</span>
              </button>
              <div className="flex items-center space-x-3 text-gray-700">
                <Calendar size={20} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCourse.course_name}</h2>
                    <p className="text-blue-100">{selectedCourse.category}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <span>Duration: {selectedCourse.duration_months} months</span>
                      <span>Fee: ₹{selectedCourse.monthly_fees}/month</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {getCourseStudents().filter(s => s.present).length} / {getCourseStudents().length}
                    </div>
                    <div className="text-blue-100">Present</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users size={20} />
                  <span className="font-medium">
                    {getCourseStudents().filter(s => s.present).length} / {getCourseStudents().length} Students Present
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={submitAttendance}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle size={18} />
                    <span>Submit Attendance</span>
                  </button>
                  <button
                    onClick={resetAttendance}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <XCircle size={18} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Student List */}
              {getCourseStudents().length > 0 ? (
                <div className="space-y-3">
                  {getCourseStudents().map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{student.name}</h3>
                          <p className="text-gray-600 text-sm">Roll: {student.id}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`p-2 rounded-full transition-colors ${
                          student.present 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {student.present ? <CheckCircle size={20} /> : <XCircle size={20} />}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="mx-auto mb-2" size={48} />
                  <p>No students enrolled in this course yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual Download Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            <Download size={20} />
            <span className="font-medium">Download Master Attendance File</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="text-blue-500" size={16} />
            <span>Master file includes all courses • Updates automatically</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;


// //-----------------------44444444444444444444444444-------------------------
// import React, { useState, useEffect } from 'react';
// import { CheckCircle, XCircle, Calendar, Users, BookOpen, Clock, AlertCircle, ChevronRight, Check } from 'lucide-react';

// const StudentAttendance = () => {
//   const [courses, setCourses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [attendanceSubmitted, setAttendanceSubmitted] = useState({});
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

//   // Load courses from localStorage
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("courses")) || [];
//     setCourses(stored);
//   }, []);

//   // Load students from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("students");
//     setStudents(stored ? JSON.parse(stored) : []);
//   }, []);

//   const showToast = (message, type = 'success') => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
//   };

//   const toggleAttendance = (studentId) => {
//     setStudents(prev => prev.map(student => 
//       student.id === studentId ? { ...student, present: !student.present } : student
//     ));
//   };

//   const submitAttendance = () => {
//     if (!selectedCourse) return;
    
//     // Filter students by 'course' field (not 'course_name')
//     const courseStudents = students.filter(student => student.course === selectedCourse.course_name);
//     const presentCount = courseStudents.filter(s => s.present).length;
//     const totalCount = courseStudents.length;
    
//     if (presentCount === 0) {
//       showToast('Please mark at least one student as present before submitting!', 'error');
//       return;
//     }
    
//     // Mark this course as submitted for the selected date
//     const attendanceKey = `${selectedCourse.course_name}_${selectedDate}`;
//     setAttendanceSubmitted(prev => ({ ...prev, [attendanceKey]: true }));
    
//     showToast(`Attendance submitted successfully for ${selectedCourse.course_name}!\n${presentCount}/${totalCount} students present`);
//   };

//   const resetAttendance = () => {
//     if (!selectedCourse) return;
    
//     setStudents(prev => prev.map(student => 
//       // Filter by 'course' field (not 'course_name')
//       student.course === selectedCourse.course_name ? { ...student, present: false } : student
//     ));
    
//     // Remove submission status when reset
//     const attendanceKey = `${selectedCourse.course_name}_${selectedDate}`;
//     setAttendanceSubmitted(prev => {
//       const newStatus = { ...prev };
//       delete newStatus[attendanceKey];
//       return newStatus;
//     });
//     showToast('Attendance reset successfully!', 'warning');
//   };

//   const groupCoursesByCategory = () => {
//     const grouped = {};
//     courses.forEach(course => {
//       if (!grouped[course.category]) {
//         grouped[course.category] = [];
//       }
//       grouped[course.category].push(course);
//     });
//     return grouped;
//   };

//   const groupedCourses = groupCoursesByCategory();

//   // Get students for the selected course - using 'course' field
//   const getCourseStudents = () => {
//     if (!selectedCourse) return [];
//     return students.filter(student => student.course === selectedCourse.course_name);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       {/* Toast Notification */}
//       {toast.show && (
//         <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white font-medium ${
//           toast.type === 'success' ? 'bg-green-500' : 
//           toast.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
//         }`}>
//           {toast.message.split('\n').map((line, i) => (
//             <div key={i}>{line}</div>
//           ))}
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Lucky Tech Academy - Attendance System</h1>
//           <p className="text-gray-600">Manage daily attendance for all courses</p>
//         </div>

//         {/* Course Selection */}
//         {!selectedCourse ? (
//           <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center space-x-3">
//                 <BookOpen className="text-blue-600" size={28} />
//                 <h2 className="text-2xl font-bold text-gray-800">Select Course</h2>
//               </div>
//               <div className="flex items-center space-x-2 text-gray-600">
//                 <Calendar size={20} />
//                 <input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="space-y-6">
//               {Object.entries(groupedCourses).map(([category, coursesInCategory]) => (
//                 <div key={category} className="border border-gray-200 rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gray-50 p-2 rounded">{category}</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {coursesInCategory.map((course, index) => {
//                       const attendanceKey = `${course.course_name}_${selectedDate}`;
//                       const isSubmitted = attendanceSubmitted[attendanceKey];
                      
//                       return (
//                         <div
//                           key={index}
//                           onClick={() => setSelectedCourse(course)}
//                           className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
//                             isSubmitted 
//                               ? 'border-green-400 bg-green-50 hover:shadow-lg' 
//                               : 'border-gray-200 hover:shadow-md hover:border-blue-400'
//                           }`}
//                         >
//                           <div className="flex items-start justify-between">
//                             <div>
//                               <h4 className="font-semibold text-gray-800 mb-2">{course.course_name}</h4>
//                               <div className="space-y-1 text-sm text-gray-600">
//                                 <div className="flex items-center space-x-1">
//                                   <Clock size={14} />
//                                   <span>{course.duration_months} months</span>
//                                 </div>
//                                 <div>₹{course.monthly_fees}/month</div>
//                               </div>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               {isSubmitted && (
//                                 <Check className="text-green-500 bg-green-100 rounded-full p-1" size={24} />
//                               )}
//                               <ChevronRight className={isSubmitted ? "text-green-500" : "text-blue-500"} size={20} />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           /* Attendance Interface */
//           <div className="space-y-6">
//             {/* Back Button */}
//             <div className="flex items-center space-x-4 mb-6">
//               <button
//                 onClick={() => setSelectedCourse(null)}
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
//               >
//                 <ChevronRight className="transform rotate-180" size={20} />
//                 <span>Back to Courses</span>
//               </button>
//               <div className="flex items-center space-x-3 text-gray-700">
//                 <Calendar size={20} />
//                 <input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Course Header */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold mb-2">{selectedCourse.course_name}</h2>
//                     <p className="text-blue-100">{selectedCourse.category}</p>
//                     <div className="flex items-center space-x-4 mt-3 text-sm">
//                       <span>Duration: {selectedCourse.duration_months} months</span>
//                       <span>Fee: ₹{selectedCourse.monthly_fees}/month</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold">
//                       {getCourseStudents().filter(s => s.present).length} / {getCourseStudents().length}
//                     </div>
//                     <div className="text-blue-100">Present</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Attendance Actions */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center space-x-2 text-gray-600">
//                   <Users size={20} />
//                   <span className="font-medium">
//                     {getCourseStudents().filter(s => s.present).length} / {getCourseStudents().length} Students Present
//                   </span>
//                 </div>
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={submitAttendance}
//                     className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
//                   >
//                     <CheckCircle size={18} />
//                     <span>Submit Attendance</span>
//                   </button>
//                   <button
//                     onClick={resetAttendance}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
//                   >
//                     <XCircle size={18} />
//                     <span>Reset</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Student List */}
//               {getCourseStudents().length > 0 ? (
//                 <div className="space-y-3">
//                   {getCourseStudents().map((student) => (
//                     <div
//                       key={student.id}
//                       className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
//                     >
//                       <div className="flex items-center space-x-4">
//                         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                           <span className="text-blue-600 font-bold">
//                             {student.name.split(' ').map(n => n[0]).join('')}
//                           </span>
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-gray-800">{student.name}</h3>
//                           <p className="text-gray-600 text-sm">Roll: {student.id}</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => toggleAttendance(student.id)}
//                         className={`p-2 rounded-full transition-colors ${
//                           student.present 
//                             ? 'bg-green-100 text-green-600 hover:bg-green-200' 
//                             : 'bg-red-100 text-red-600 hover:bg-red-200'
//                         }`}
//                       >
//                         {student.present ? <CheckCircle size={20} /> : <XCircle size={20} />}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <AlertCircle className="mx-auto mb-2" size={48} />
//                   <p>No students enrolled in this course yet</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="mt-8 text-center text-gray-600">
//           <div className="flex items-center justify-center space-x-2">
//             <Clock className="text-blue-500" size={16} />
//             <span>Attendance system updated in real-time • Coaching Center Management</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentAttendance;

import React, { useState, useEffect } from "react";
import studentsData from "../../data/student.json";
import coursesData from "../../data/course.json";

const StudentEnrollment = () => {
  const [currentPayment, setCurrentPayment] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    studentId: "",
    courseName: "",
    totalFees: 0,
    monthlyFees: 0,
    duration: 0,
    paidFees: 0,
    remainingFees: 0,
  });

  /* 🔹 Load students from localStorage */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("students")) ||
      studentsData.students;

    setStudents(stored);
  }, []);

  /* 🔹 When student changes → auto-select course */
  useEffect(() => {
    if (!formData.studentId) return;

    const selectedStudent = students.find(
      (s) => s.id === formData.studentId
    );

    if (selectedStudent?.course) {
      setFormData((prev) => ({
        ...prev,
        courseName: selectedStudent.course,
      }));
    }
  }, [formData.studentId, students]);

  /* 🔹 Load course details */
  useEffect(() => {
    if (!formData.courseName) return;

    const course = coursesData.courses.find(
      (c) => c.course_name === formData.courseName
    );

    if (course) {
      setFormData((prev) => ({
        ...prev,
        totalFees: course.total_fees,
        monthlyFees: course.monthly_fees,
        duration: course.duration_months,
        paidFees: 0,
        remainingFees: course.total_fees,
      }));
    }
  }, [formData.courseName]);

  /* 🔹 Load existing enrollment */
  useEffect(() => {
    if (!formData.studentId || !formData.courseName) return;

    const stored =
      JSON.parse(localStorage.getItem("enrollments")) || [];

    const existing = stored.find(
      (e) =>
        e.studentId === formData.studentId &&
        e.courseName === formData.courseName
    );

    if (existing) {
      // Only update if values differ to avoid unnecessary renders
      setFormData((prev) => {
        if (prev.paidFees === existing.paidFees && prev.remainingFees === existing.remainingFees) {
          return prev;
        }
        return {
          ...prev,
          paidFees: existing.paidFees,
          remainingFees: existing.remainingFees,
        };
      });
    }
  }, [formData.studentId, formData.courseName]);

  /* 🔹 Generate Enrollment ID */
  const generateEnrollmentId = (enrollments) => {
    const nums = enrollments.map((e) =>
      parseInt(e.enrollmentId.replace("EN", ""), 10)
    );
    const max = nums.length ? Math.max(...nums) : 0;
    return `EN${String(max + 1).padStart(3, "0")}`;
  };

  /* 🔹 Save Payment */
  const handleSubmit = () => {
    if (!formData.studentId || !formData.courseName) {
      alert("Select student and course");
      return;
    }

    if (currentPayment <= 0) {
      alert("Enter valid amount");
      return;
    }

    const stored =
      JSON.parse(localStorage.getItem("enrollments")) || [];

    const student = students.find(
      (s) => s.id === formData.studentId
    );

    const today = new Date().toISOString().split("T")[0];

    const index = stored.findIndex(
      (e) =>
        e.studentId === formData.studentId &&
        e.courseName === formData.courseName
    );

    let updated;

    if (index !== -1) {
      if (currentPayment > stored[index].remainingFees) {
        alert("Payment exceeds remaining");
        return;
      }

      stored[index].paidFees += currentPayment;
      stored[index].remainingFees -= currentPayment;
      updated = stored[index];
    } else {
      updated = {
        enrollmentId: generateEnrollmentId(stored),
        studentId: formData.studentId,
        studentName: student?.name || "",
        courseName: formData.courseName,
        totalFees: formData.totalFees,
        monthlyFees: formData.monthlyFees,
        paidFees: currentPayment,
        remainingFees: formData.totalFees - currentPayment,
        enrollmentDate: today,
      };
      stored.push(updated);
    }

    localStorage.setItem("enrollments", JSON.stringify(stored));

    setLastPayment({
      studentName: updated.studentName,
      courseName: updated.courseName,
      amount: currentPayment,
      date: today,
      totalFees: updated.totalFees,
      paidFees: updated.paidFees,
      remainingFees: updated.remainingFees,
    });

    setShowReceipt(true);
    setCurrentPayment(0);

    setFormData((p) => ({
      ...p,
      paidFees: updated.paidFees,
      remainingFees: updated.remainingFees,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        Student Enrollment / Fees
      </h2>

      {/* Student */}
      <select
        className="w-full border p-2 mb-3"
        value={formData.studentId}
        onChange={(e) =>
          setFormData({ ...formData, studentId: e.target.value })
        }
      >
        <option value="" disabled>
          Select Student
        </option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* Course (AUTO SELECTED) */}
      <select
        className="w-full border p-2 mb-3 bg-gray-100"
        value={formData.courseName}
        disabled
      >
        <option>{formData.courseName || "Course"}</option>
      </select>

      {/* Info */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input disabled value={`Total: ₹${formData.totalFees}`} className="border p-2 bg-gray-100" />
        <input disabled value={`Paid: ₹${formData.paidFees}`} className="border p-2 bg-gray-100" />
        <input disabled value={`Remaining: ₹${formData.remainingFees}`} className="border p-2 bg-gray-100" />
        <input disabled value={`Duration: ${formData.duration} months`} className="border p-2 bg-gray-100" />
      </div>

      <input
        type="number"
        placeholder="Enter payment amount"
        className="w-full border p-2 mb-4"
        value={currentPayment}
        onChange={(e) => setCurrentPayment(Number(e.target.value))}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Save Payment
      </button>

      {/* Receipt */}
      {/* {showReceipt && lastPayment && (
        <div className="mt-6 border p-4">
          <h3 className="text-center font-bold mb-2">
            Fee Receipt
          </h3>
          <p>Student: {lastPayment.studentName}</p>
          <p>Course: {lastPayment.courseName}</p>
          <p>Date: {lastPayment.date}</p>
          <hr className="my-2" />
          <p>Paid Now: ₹{lastPayment.amount}</p>
          <p>Total Paid: ₹{lastPayment.paidFees}</p>
          <p>Remaining: ₹{lastPayment.remainingFees}</p>

          <button
            onClick={() => window.print()}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded"
          >
            Print Receipt
          </button>
        </div>
      )} */}
      {showReceipt && lastPayment && (
  <div id="receipt" className="mt-6 border p-4">
    <h1 className="text-center text-xl text-blue-800 my-1 font-bold">Lucky Tech Academy</h1>
    <h3 className="text-center font-bold mb-2">
      Fee Receipt
    </h3>
    
    <p>Student: {lastPayment.studentName}</p>
    <p>Course: {lastPayment.courseName}</p>
    <p>Date: {lastPayment.date}</p>
    <hr className="my-2" />
    <p>Paid Now: ₹{lastPayment.amount}</p>
    <p>Total Paid: ₹{lastPayment.paidFees}</p>
    <p>Remaining: ₹{lastPayment.remainingFees}</p>

    <button
      onClick={() => window.print()}
      className="mt-3 w-full bg-green-600 text-white py-2 rounded"
    >
      Print Receipt
    </button>
    <div>
    <div className="text-center mt-5 mb-5">
      <span className="inline-block w-1/3 border-t"></span>
      <span className="mx-2 text-sm">Signature</span>
      <span className="inline-block w-1/3 border-t"></span>
    </div>
      </div>
   </div>
)}

    </div>
  );
};

export default StudentEnrollment;


//////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import studentsData from "../../data/student.json";
// import coursesData from "../../data/course.json";

// const StudentEnrollment = () => {
//   const [currentPayment, setCurrentPayment] = useState(0);
//   const [showReceipt, setShowReceipt] = useState(false);
//   const [lastPayment, setLastPayment] = useState(null);

//   const [formData, setFormData] = useState({
//     studentId: "",
//     courseName: "",
//     totalFees: 0,
//     monthlyFees: 0,
//     duration: 0,
//     paidFees: 0,
//     remainingFees: 0,
//   });

//   /* 🔹 Load course details */
//   useEffect(() => {
//     if (!formData.courseName) return;

//     const course = coursesData.courses.find(
//       (c) => c.course_name === formData.courseName
//     );

//     if (course) {
//       setFormData((prev) => ({
//         ...prev,
//         totalFees: course.total_fees,
//         monthlyFees: course.monthly_fees,
//         duration: course.duration_months,
//         paidFees: 0,
//         remainingFees: course.total_fees,
//       }));
//     }
//   }, [formData.courseName]);

//   /* 🔹 Load existing enrollment */
//   useEffect(() => {
//     if (!formData.studentId || !formData.courseName) return;

//     const stored =
//       JSON.parse(localStorage.getItem("enrollments")) || [];

//     const existing = stored.find(
//       (e) =>
//         e.studentId === formData.studentId &&
//         e.courseName === formData.courseName
//     );

//     if (existing) {
//       setFormData((prev) => ({
//         ...prev,
//         totalFees: existing.totalFees,
//         monthlyFees: existing.monthlyFees,
//         paidFees: existing.paidFees,
//         remainingFees: existing.remainingFees,
//       }));
//     }
//   }, [formData.studentId, formData.courseName]);

//   /* 🔹 Generate Enrollment ID */
//   const generateEnrollmentId = (enrollments) => {
//     const nums = enrollments.map((e) =>
//       parseInt(e.enrollmentId.replace("EN", ""), 10)
//     );
//     const max = nums.length ? Math.max(...nums) : 0;
//     return `EN${String(max + 1).padStart(3, "0")}`;
//   };

//   /* 🔹 Save Payment */
//   const handleSubmit = () => {
//     if (!formData.studentId || !formData.courseName) {
//       alert("Please select student and course");
//       return;
//     }

//     if (currentPayment <= 0) {
//       alert("Enter valid payment amount");
//       return;
//     }

//     const stored =
//       JSON.parse(localStorage.getItem("enrollments")) || [];

//     const student = studentsData.students.find(
//       (s) => s.id === formData.studentId
//     );

//     const today = new Date().toISOString().split("T")[0];

//     const index = stored.findIndex(
//       (e) =>
//         e.studentId === formData.studentId &&
//         e.courseName === formData.courseName
//     );

//     let updatedEnrollment;

//     if (index !== -1) {
//       // 🔹 Existing enrollment
//       if (currentPayment > stored[index].remainingFees) {
//         alert("Payment exceeds remaining fees");
//         return;
//       }

//       stored[index].paidFees += currentPayment;
//       stored[index].remainingFees -= currentPayment;

//       updatedEnrollment = stored[index];
//     } else {
//       // 🔹 New enrollment
//       if (currentPayment > formData.totalFees) {
//         alert("Payment exceeds total fees");
//         return;
//       }

//       updatedEnrollment = {
//         enrollmentId: generateEnrollmentId(stored),
//         studentId: formData.studentId,
//         studentName: student?.name || "",
//         courseName: formData.courseName,
//         totalFees: formData.totalFees,
//         monthlyFees: formData.monthlyFees,
//         paidFees: currentPayment,
//         remainingFees: formData.totalFees - currentPayment,
//         enrollmentDate: today,
//       };

//       stored.push(updatedEnrollment);
//     }

//     localStorage.setItem("enrollments", JSON.stringify(stored));

//     /* 🔹 Receipt data */
//     setLastPayment({
//       studentName: updatedEnrollment.studentName,
//       courseName: updatedEnrollment.courseName,
//       amount: currentPayment,
//       date: today,
//       totalFees: updatedEnrollment.totalFees,
//       paidFees: updatedEnrollment.paidFees,
//       remainingFees: updatedEnrollment.remainingFees,
//     });

//     setShowReceipt(true);
//     setCurrentPayment(0);

//     setFormData((prev) => ({
//       ...prev,
//       paidFees: updatedEnrollment.paidFees,
//       remainingFees: updatedEnrollment.remainingFees,
//     }));
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
//       <h2 className="text-lg font-semibold mb-4">
//         Student Enrollment / Fees
//       </h2>

//       {/* Student */}
//       <select
//         className="w-full border p-2 mb-3"
//         value={formData.studentId}
//         onChange={(e) =>
//           setFormData({ ...formData, studentId: e.target.value })
//         }
//       >
//         <option value="" disabled>
//           Select Student
//         </option>
//         {studentsData.students.map((s) => (
//           <option key={s.id} value={s.id}>
//             {s.name}
//           </option>
//         ))}
//       </select>

//       {/* Course */}
//       <select
//         className="w-full border p-2 mb-3"
//         value={formData.courseName}
//         onChange={(e) =>
//           setFormData({ ...formData, courseName: e.target.value })
//         }
//       >
//         <option value="" disabled>
//           Select Course
//         </option>
//         {coursesData.courses.map((c) => (
//           <option key={c.course_name} value={c.course_name}>
//             {c.course_name}
//           </option>
//         ))}
//       </select>

//       {/* Info */}
//       <div className="grid grid-cols-2 gap-3 mb-3">
//         <input disabled value={`Total Fees: ₹${formData.totalFees}`} className="border p-2 bg-gray-100" />
//         <input disabled value={`Paid Fees: ₹${formData.paidFees}`} className="border p-2 bg-gray-100" />
//         <input disabled value={`Remaining Fees: ₹${formData.remainingFees}`} className="border p-2 bg-gray-100" />
//         <input disabled value={`Duration: ${formData.duration} months`} className="border p-2 bg-gray-100" />
//       </div>

//       {/* Payment */}
//       <input
//         type="number"
//         placeholder="Enter payment amount"
//         className="w-full border p-2 mb-4"
//         value={currentPayment}
//         onChange={(e) => setCurrentPayment(Number(e.target.value))}
//       />

//       <button
//         onClick={handleSubmit}
//         className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//       >
//         Save Payment
//       </button>

//       {/* RECEIPT */}
//       {showReceipt && lastPayment && (
//         <div id="receipt" className="mt-6 border p-4">
//           <h3 className="text-lg font-bold text-center mb-3">
//             Fee Payment Receipt
//           </h3>

//           <p><b>Student:</b> {lastPayment.studentName}</p>
//           <p><b>Course:</b> {lastPayment.courseName}</p>
//           <p><b>Date:</b> {lastPayment.date}</p>

//           <hr className="my-2" />

//           <p><b>Paid Now:</b> ₹{lastPayment.amount}</p>
//           <p><b>Total Fees:</b> ₹{lastPayment.totalFees}</p>
//           <p><b>Total Paid:</b> ₹{lastPayment.paidFees}</p>
//           <p><b>Remaining:</b> ₹{lastPayment.remainingFees}</p>

//           <button
//             onClick={() => window.print()}
//             className="mt-4 w-full bg-green-600 text-white py-2 rounded"
//           >
//             Print Receipt
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentEnrollment;

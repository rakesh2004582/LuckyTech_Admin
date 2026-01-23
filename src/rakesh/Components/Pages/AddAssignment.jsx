import { useEffect, useState } from "react";

const AddAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  // Load courses from localStorage
  useEffect(() => {
    const storedCourses =
      JSON.parse(localStorage.getItem("courses")) || [];
    console.log("Courses:", storedCourses);
    setCourses(storedCourses);
  }, []);

  // Convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourseName || !title || !file) {
      alert("Please fill all required fields");
      return;
    }

    const base64File = await convertToBase64(file);

    const newAssignment = {
      id: Date.now().toString(),
      title,
      description,
      fileName: file.name,
      fileType: file.type,
      fileData: base64File,
      createdAt: new Date().toISOString(),
    };

    const updatedCourses = courses.map((course) =>
      course.course_name === selectedCourseName
        ? {
            ...course,
            assignments: [
              ...(course.assignments || []),
              newAssignment,
            ],
          }
        : course
    );

    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses);

    // Reset form
    setSelectedCourseName("");
    setTitle("");
    setDescription("");
    setFile(null);

    alert("Assignment added successfully ✅");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Add Assignment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        {/* Course Select */}
        <div>
          <label className="block font-medium mb-1">
            Select Course
          </label>
          <select
            value={selectedCourseName}
            onChange={(e) =>
              setSelectedCourseName(e.target.value)
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course, index) => (
              <option
                key={index}
                value={course.course_name}
              >
                {course.course_name}
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Title */}
        <div>
          <label className="block font-medium mb-1">
            Assignment Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter assignment title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Optional description"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block font-medium mb-1">
            Upload File (PDF / DOC / TXT)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
            className="w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Assignment
        </button>
      </form>
    </div>
  );
};

export default AddAssignment;

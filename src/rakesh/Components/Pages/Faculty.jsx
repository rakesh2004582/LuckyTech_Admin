// import React from "react";

// export const Faculty = () => {
//   const faculty = [
//     {
//       id: 1,
//       image: "/src/assets/images/team/Lucky.jpeg",
//       name: "Lucky Rajput",
//       position: "Software Consultant",
//       education: "BCA · MCA",
//     },
//     {
//       id: 2,
//       image: "/src/assets/images/team/Ajay.jpeg",
//       name: "Ajay Shakya",
//       position: "Sr. Software Developer",
//     },
//     {
//       id: 3,
//       image: "/src/assets/images/team/Ramniwas.jpg",
//       name: "Ramniwas Verma",
//       position: "Software Developer",
//     },
//     {
//       id: 4,
//       image: "/src/assets/images/team/Anil.jpeg",
//       name: "Anil Kumar",
//       position: "Software Developer",
//     },
//     {
//       id: 5,
//       image: "/src/assets/images/team/Devendra.jpg",
//       name: "Devendra Singh",
//       position: "DSA Expert",
//     },
//     {
//       id: 6,
//       image: "/src/assets/images/team/CV.jpeg",
//       name: "C.V. Singh",
//       position: "English Communication Trainer",
//     },
//   ];

//   return (
//     <>
//       {/* Title */}
//       <div className="w-full py-12 text-center">
//         <h3 className="text-4xl font-extrabold text-gray-800 tracking-wide">
//           Our Faculty
//         </h3>
//         <p className="mt-2 text-gray-500">
//           Learn from industry professionals
//         </p>
//       </div>

//       {/* Faculty Grid */}
//       <div className="max-w-7xl mx-auto px-4 pb-20">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center">
//           {faculty.map((item) => (
//             <div
//               key={item.id}
//               className="group relative w-52 h-52 rounded-full overflow-hidden cursor-pointer
//                          transform transition-all duration-500 hover:-translate-y-3 hover:scale-105"
//             >
//               {/* Glow Ring */}
//               <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500"></div>

//               {/* Image */}
//               <img
//                 src={item.image}  
//                 alt={item.name}
//                 className="relative z-10 w-full h-full rounded-full object-cover
//                            transition-transform duration-700 ease-out group-hover:scale-110"
//               />

//               {/* Overlay */}
//               <div
//                 className="absolute inset-0 z-20 rounded-full
//                            bg-gradient-to-t from-black/80 via-black/40 to-transparent
//                            flex flex-col items-center justify-center text-center
//                            opacity-0 group-hover:opacity-100 transition-all duration-500"
//               >
//                 <h4 className="text-white text-lg font-bold translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
//                   {item.name}
//                 </h4>
//                 <p className="text-sm text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
//                   {item.position}
//                 </p>
//                 {item.education && (
//                   <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
//                     {item.education}
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };



import React from "react";
import faculty from "../../data/facultyData";
export const Faculty = () => {
  return (
    <>
      {/* Title */}
      <div className="w-full py-16 text-center px-4">
        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
          Our Faculty
        </h3>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Learn from industry professionals
        </p>
      </div>

      {/* Faculty Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {faculty.map((item) => (
            <div
              key={item.id}
              className="group relative w-48 h-48 rounded-full overflow-hidden cursor-pointer
                         transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03]"
            >
              {/* Glow Ring (subtle & elegant) */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-500"></div>

              {/* Image with better object fit */}
              <img
                src={item.image}
                alt={item.name}
                className="relative z-10 w-full h-full rounded-full object-cover
                           transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay with smoother reveal */}
              <div
                className="absolute inset-0 z-20 rounded-full
                           bg-gradient-to-t from-black/90 via-black/30 to-transparent
                           flex flex-col items-center justify-end pb-4 text-center
                           opacity-0 group-hover:opacity-100 transition-all duration-500"
              >
                <h4 className="text-white text-base font-bold px-2 leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-200 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {item.position}
                </p>
                {item.education && (
                  <p className="text-[10px] text-gray-300 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {item.education}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
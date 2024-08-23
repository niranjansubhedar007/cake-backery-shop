// "use client"
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

// import Navbar from "../components/Navbar";

// const LiquorCategory = () => {
//   const [barMenus, setBarMenus] = useState([]);
//   const [editMode, setEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [newBarMenu, setNewBarMenu] = useState({ liquorCategory: "" });
//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   useEffect(() => {
//     // Fetch all BarMenus on component mount
//     axios
//       .get("http://localhost:5000/api/liquorCategory/barMenus")
//       .then((response) => setBarMenus(response.data));
//   }, []);

//   const handleCreateOrUpdateBarMenu = () => {
//     if (editMode && editId) {
//       // Update existing BarMenu
//       axios
//         .put(
//           `http://localhost:5000/api/liquorCategory/barMenus/${editId}`,
//           newBarMenu
//         )
//         .then((response) => {
//           setBarMenus((prevBarMenus) =>
//             prevBarMenus.map((barMenu) =>
//               barMenu._id === response.data._id ? response.data : barMenu
//             )
//           );
//           setEditMode(false);
//           setEditId(null);
//           setNewBarMenu({ liquorCategory: "" });
//         });
//     } else {
//       // Create a new BarMenu
//       axios
//         .post("http://localhost:5000/api/liquorCategory", newBarMenu)
//         .then((response) => {
//           setBarMenus((prevBarMenus) => [...prevBarMenus, response.data]);
//           setNewBarMenu({ liquorCategory: "" });
//         });
//          // setIsNewModalOpen(false);
//          setIsSuccessModalOpen(true);
//          setTimeout(() => {
//              setIsSuccessModalOpen(null);
//          }, 2000);
//     }
//   };

//   const handleDeleteBarMenu = (id) => {
//     setShowDeletePopup(true);
//     setDeleteId(id);
//   };

//   const confirmDelete = () => {
//     // Delete a BarMenu by ID
//     axios
//       .delete(`http://localhost:5000/api/liquorCategory/barMenus/${deleteId}`)
//       .then(() => {
//         setBarMenus((prevBarMenus) =>
//           prevBarMenus.filter((barMenu) => barMenu._id !== deleteId)
//         );
//         setShowDeletePopup(false);
//       });
//   };

//   const handleEditBarMenu = (id) => {
//     const barMenuToEdit = barMenus.find((barMenu) => barMenu._id === id);
//     setEditMode(true);
//     setEditId(id);
//     setNewBarMenu(barMenuToEdit);
//   };

//   return (
//     <>
//       <Navbar/>
//       <div className="max-w-lg mx-auto mt-20 container shadow-md font-sans">
//         <div className="mr-2">
//           <label
//             htmlFor="gstPercentage"
//             className="block text-lg font-medium text-orange-500 ml-4"
//           >
//             Liquor Category
//           </label>
//           <input
//             type="text"
//             value={newBarMenu.liquorCategory}
//             onChange={(e) => setNewBarMenu({ liquorCategory: e.target.value })}
//             className="mt-1 p-2 border rounded-md w-72 focus:outline-none capitalize ml-4 focus:ring focus:border-blue-300"
//             required
//           />
//            <div className="flex justify-between">
//                         <button
//                             type="button"
//                             className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
//             onClick={handleCreateOrUpdateBarMenu}
           
//           >
//             {editMode ? "Save" : "Create Menu"}
//         </button>
//         </div>
//         </div>

//         <div>
//           <table className="min-w-full  border border-gray-300 mb-4 mx-auto mt-4 ">
//             <thead className="text-base bg-zinc-100 text-yellow-700 border">
//               <tr>
//                 <th className="p-2">Sr </th>
//                 <th className="p-2">Bar Menu </th>
//                 <th className="p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {barMenus.map((barMenu, index) => (
//                 <tr key={barMenu._id} className="mb-2">
//                   <td className="p-1 text-center">{index + 1}</td>
//                   <td className="p-1 text-center">{barMenu.liquorCategory}</td>
//                   <td className="p-1 text-center">
//                      <button
//                       onClick={() => handleEditBarMenu(barMenu._id)}
//                       className="text-gray-600 ml-4 focus:outline-none font-sans font-medium p-2 py-1 rounded-full  text-sm shadow-md"
//                       style={{ background: "#ffff" }}
//                     >
//                       <FontAwesomeIcon
//                         icon={faPenToSquare}
//                         color="blue"
//                         className=" text-center"
//                       />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteBarMenu(barMenu._id)}
//                       className="text-gray-600  focus:outline-none font-sans font-medium p-2 py-1 rounded-full  text-sm shadow-md"
//                       style={{ background: "#ffff" }}
//                     >
//                       <FontAwesomeIcon
//                         icon={faTrash}
//                         color="red"
//                         className=" text-center"
//                       />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {isSuccessModalOpen && (
//                     <div className="fixed inset-0 flex items-center justify-center">
//                         <div className="bg-white border border-green-500 rounded p-7 shadow-md z-50 absolute">
//                             <p className="text-green-500 font-semibold text-center text-xl">
//                                 Category added successfully!
//                             </p>
//                         </div>
//                     </div>
//                 )}
//         {showDeletePopup && (
//           <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-gray-700 bg-opacity-75 font-sans">
//             <div className="bg-white p-4 rounded-md">
//               <p className="text-lg font-semibold mb-4">
//                 Are you sure you want to delete this Category?
//               </p>
//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={() => setShowDeletePopup(false)}
//                   className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className=" bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default LiquorCategory;




"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../components/Navbar";

const LiquorCategory = () => {
  const [barMenus, setBarMenus] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newBarMenu, setNewBarMenu] = useState({ liquorCategory: "" });
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteSuccessPopupOpen, setIsDeleteSuccessPopupOpen] =
    useState(false);
  const [isEditSuccessPopupOpen, setIsEditSuccessPopupOpen] = useState(false);

  useEffect(() => {
    // Fetch all BarMenus on component mount
    axios
      .get("http://localhost:5000/api/liquorCategory/barMenus")
      .then((response) => setBarMenus(response.data));
  }, []);

  const handleCreateOrUpdateBarMenu = () => {
    if (editMode && editId) {
      // Update existing BarMenu
      axios
        .put(
          `http://localhost:5000/api/liquorCategory/barMenus/${editId}`,
          newBarMenu
        )
        .then((response) => {
          setBarMenus((prevBarMenus) =>
            prevBarMenus.map((barMenu) =>
              barMenu._id === response.data._id ? response.data : barMenu
            )
          );
          setEditMode(false);
          setEditId(null);
          setNewBarMenu({ liquorCategory: "" });
        });
        // Show delete success popup
      setIsEditSuccessPopupOpen(true);
      // Close the delete success popup after 3 seconds
      setTimeout(() => {
        setIsEditSuccessPopupOpen(false);
      }, 2000);
    } else {
      // Create a new BarMenu
      axios
        .post("http://localhost:5000/api/liquorCategory", newBarMenu)
        .then((response) => {
          setBarMenus((prevBarMenus) => [...prevBarMenus, response.data]);
          setNewBarMenu({ liquorCategory: "" });
        });
      // setIsNewModalOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(null);
      }, 2000);
      
    }
  };

  const handleDeleteBarMenu = (id) => {
    setShowDeletePopup(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    // Delete a BarMenu by ID
    axios
      .delete(`http://localhost:5000/api/liquorCategory/barMenus/${deleteId}`)
      .then(() => {
        setBarMenus((prevBarMenus) =>
          prevBarMenus.filter((barMenu) => barMenu._id !== deleteId)
        );
        setShowDeletePopup(false);
        // Show delete success popup
        setIsDeleteSuccessPopupOpen(true);
        // Close the delete success popup after 3 seconds
        setTimeout(() => {
          setIsDeleteSuccessPopupOpen(false);
        }, 2000);
      });
  };

  const handleEditBarMenu = (id) => {
    const barMenuToEdit = barMenus.find((barMenu) => barMenu._id === id);
    setEditMode(true);
    setEditId(id);
    setNewBarMenu(barMenuToEdit);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-20 container shadow-md font-sans">
        <div className="mr-2">
          <label
            htmlFor="gstPercentage"
            className="block text-lg font-medium text-orange-500 ml-4"
          >
            Liquor Category
          </label>
          <input
            type="text"
            value={newBarMenu.liquorCategory}
            onChange={(e) => setNewBarMenu({ liquorCategory: e.target.value })}
            className="mt-1 p-2 border rounded-md w-72 focus:outline-none capitalize ml-4 focus:ring focus:border-blue-300"
            required
          />
          <div className="flex justify-between">
            <button
              type="button"
              className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
              onClick={handleCreateOrUpdateBarMenu}
            >
              {editMode ? "Save" : "Create Category"}
            </button>
          </div>
        </div>

        <div>
          <table className="min-w-full  border border-gray-300 mb-4 mx-auto mt-4 ">
            <thead className="text-base bg-zinc-100 text-yellow-700 border">
              <tr>
                <th className="p-2">Sr </th>
                <th className="p-2 text-left pl-32">Bar Menu </th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {barMenus.map((barMenu, index) => (
                <tr
                  key={barMenu._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100 "}
                >
                  <td className="p-1 text-center">{index + 1}</td>
                  <td className="p-1 text-left pl-32">
                    {barMenu.liquorCategory.charAt(0).toUpperCase() +
                      barMenu.liquorCategory.slice(1)}
                  </td>
                  <td className="p-1 text-center">
                    <button
                      onClick={() => handleEditBarMenu(barMenu._id)}
                      className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md"
                      style={{ background: "#ffff" }}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        color="orange"
                        className="cursor-pointer"
                      />{" "}
                    </button>

                    <button
                      onClick={() => handleDeleteBarMenu(barMenu._id)}
                      className="text-gray-600  focus:outline-none font-sans font-medium p-2 py-1 rounded-full  text-sm shadow-md"
                      style={{ background: "#ffff" }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        color="red"
                        className="cursor-pointer"
                      />{" "}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white border border-green-500 rounded p-7 shadow-md z-50 absolute">
              <p className="text-green-500 font-semibold text-center text-xl">
                Category added successfully!
              </p>
            </div>
          </div>
        )}
        {showDeletePopup && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 font-sans "
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="bg-white p-4 rounded-md">
              <p className="text-lg font-semibold mb-4">
                Are you sure you want to delete this Category?
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={confirmDelete}
                  className="mr-2 bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full "
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteSuccessPopupOpen && (
          <div className="font-sans fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md max-w-md relative">
              <p className="text-2xl mb-4 text-red-500">
                Category Deleted successfully.
              </p>
            </div>
          </div>
        )}

        {isEditSuccessPopupOpen && (
          <div className="font-sans fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md max-w-md relative">
              <p className="text-2xl mb-4 text-green-500">
                Category Edited successfully.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LiquorCategory;
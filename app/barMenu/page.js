"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faSearch,
  faHouse,
  faPenToSquare,
  faPlus,
  faTrash,
  faAnglesLeft,
  faAnglesRight,
  faUpload,
  faTimes,
  faArrowDown,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

//new edit modal
// const NewEditModal = ({ isOpen, onClose }) => {
//   const [liquorBrands, setLiquorBrands] = useState([]);
//   const [selectedLiquorBrand, setSelectedLiquorBrand] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     barSubmenuId: "",
//     liquorCategory: "",
//     childMenus: [],
//   });
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup

//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/liquorBrand/barSubmenu/list`)
//       .then((response) => {
//         setLiquorBrands(response.data);
//       })
//       .catch((error) => {
//         console.error("There was an error fetching the liquor brands!", error);
//       });
//   }, []);

//   useEffect(() => {
//     if (selectedLiquorBrand) {
//       axios
//         .get(
//           `http://localhost:5000/api/liquorBrand/getMenu/${selectedLiquorBrand}`
//         )
//         .then((response) => {
//           setFormData(response.data);
//         })
//         .catch((error) => {
//           console.error("There was an error fetching the menu data!", error);
//         });
//     }
//   }, [selectedLiquorBrand]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handlePriceChange = (e, childMenuIndex, key) => {
//     const { value } = e.target;
//     setFormData((prevState) => {
//       const updatedChildMenus = [...prevState.childMenus];
//       updatedChildMenus[childMenuIndex] = {
//         ...updatedChildMenus[childMenuIndex],
//         pricePer: {
//           ...updatedChildMenus[childMenuIndex].pricePer,
//           [key]: value,
//         },
//       };
//       return { ...prevState, childMenus: updatedChildMenus };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // console.log(combinedData)
//       await axios.put(
//         `http://localhost:5000/api/liquorBrand/barSubmenu/${selectedLiquorBrand}`,
//         formData
//       );

//       console.log("Menu updated successfully");
//       setShowSuccessPopup(true); // Show success popup
//       setTimeout(() => {
//         setShowSuccessPopup(false); // Hide success popup after 3 seconds
//         onClose(); // Close the modal
//       }, 3000);
//     } catch (error) {
//       console.error("There was an error updating the menu!", error);
//     }
//   };





//   return (
//     <>
//       <div
//         className={`modal-container bg-white p-6 rounded-md shadow-md relative font-sans ${isOpen ? "block" : "hidden"
//           }`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
//         >
//           <FontAwesomeIcon icon={faTimes} size="lg" />
//         </button>
//         <div className="p-1 text-left">
//           <h1 className="text-2xl font-bold mb-5 mt-5 text-orange-500">
//             Edit Bar Menu
//           </h1>
//           <div className="mb-4">
//             <label
//               htmlFor="liquorBrand"
//               className="block text-gray-700 text-sm font-bold mb-2"
//             >
//               Select Liquor Brand:
//             </label>
//             <div className="relative w-full">
//               <select
//                 id="liquorBrand"
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm cursor-pointer pr-10"
//                 onChange={(e) => setSelectedLiquorBrand(e.target.value)}
//               >
//                 <option value="">Select</option>
//                 {liquorBrands.map((brand, index) => (
//                   <option key={index} value={brand._id}>
//                     {brand.name}
//                   </option>
//                 ))}
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <svg
//                   className="fill-current h-4 w-4"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//           {selectedLiquorBrand && (
//             <div>
//               <div className="mb-4 ">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Name:
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>
//               <form
//                 onSubmit={handleSubmit}
//                 className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 w-full gap-6 p-1"
//               >
//                 {formData.childMenus.map((childMenu, index) => (
//                   <div key={index} className="mb-4 text-sm">
//                     <h3 className="font-semibold mb-2">{childMenu.name}</h3>
//                     {Object.entries(childMenu.pricePer).map(([key, value]) => (
//                       <div key={key} className="mb-2">
//                         <label className="block text-gray-700 text-sm font-bold mb-1">
//                           {key}
//                         </label>
//                         <input
//                           type="text"
//                           name={`${index}.${key}`}
//                           value={value}
//                           onChange={(e) => handlePriceChange(e, index, key)}
//                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//                 <div>
//                   <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                   >
//                     Update Menu
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//       {showSuccessPopup && (
//         <div className="font-sans fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-8 rounded shadow-md max-w-md relative">
//             <p className="text-xl mb-4">Menu updated successfully.</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };


const NewEditModal = ({ isOpen, onClose }) => {
  const [liquorBrands, setLiquorBrands] = useState([]);
  const [selectedLiquorBrand, setSelectedLiquorBrand] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    barSubmenuId: "",
    liquorCategory: "",
    childMenus: [],
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/liquorBrand/barSubmenu/list`)
      .then((response) => {
        setLiquorBrands(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the liquor brands!", error);
      });
  }, []);

  useEffect(() => {
    if (selectedLiquorBrand) {
      axios
        .get(`http://localhost:5000/api/liquorBrand/getMenu/${selectedLiquorBrand}`)
        .then((response) => {
          setFormData(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the menu data!", error);
        });
    }
  }, [selectedLiquorBrand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePriceChange = (e, childMenuIndex, key) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedChildMenus = [...prevState.childMenus];
      updatedChildMenus[childMenuIndex] = {
        ...updatedChildMenus[childMenuIndex],
        pricePer: {
          ...updatedChildMenus[childMenuIndex].pricePer,
          [key]: value,
        },
      };
      return { ...prevState, childMenus: updatedChildMenus };
    });
  };

  const handleLessStockChange = (e, childMenuIndex) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedChildMenus = [...prevState.childMenus];
      updatedChildMenus[childMenuIndex] = {
        ...updatedChildMenus[childMenuIndex],
        lessStock: value,
      };
      return { ...prevState, childMenus: updatedChildMenus };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/liquorBrand/barSubmenu/${selectedLiquorBrand}`,
        formData
      );

      console.log("Menu updated successfully");
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("There was an error updating the menu!", error);
    }
  };

  return (
    <>
      <div
        className={`modal-container bg-white p-6 rounded-md shadow-md relative font-sans ${isOpen ? "block" : "hidden"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <div className="p-1 text-left">
          <h1 className="text-2xl font-bold mb-5 mt-5 text-orange-500">
            Edit Bar Menu
          </h1>
          <div className="mb-4">
            <label
              htmlFor="liquorBrand"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select Liquor Brand:
            </label>
            <div className="relative w-full">
              <select
                id="liquorBrand"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm cursor-pointer pr-10"
                onChange={(e) => setSelectedLiquorBrand(e.target.value)}
              >
                <option value="">Select</option>
                {liquorBrands.map((brand, index) => (
                  <option key={index} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
          {selectedLiquorBrand && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <form
                onSubmit={handleSubmit}
                className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 w-full gap-6 p-1"
              >
                {formData.childMenus.map((childMenu, index) => (
                  <div key={index} className="mb-4 text-sm">
                    <h3 className="font-semibold mb-2">{childMenu.name}</h3>
                    {Object.entries(childMenu.pricePer).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-1">
                          {key}
                        </label>
                        <input
                          type="text"
                          name={`${index}.${key}`}
                          value={value}
                          onChange={(e) => handlePriceChange(e, index, key)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    ))}
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Less Stock
                      </label>
                      <input
                        type="number"
                        name={`lessStock${index}`}
                        value={childMenu.lessStock}
                        onChange={(e) => handleLessStockChange(e, index)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        min={0}
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Update Menu
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      {showSuccessPopup && (
        <div className="font-sans fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md max-w-md relative">
            <p className="text-xl mb-4">Menu updated successfully.</p>
          </div>
        </div>
      )}
    </>
  );
};


//close edit modal//

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 font-sans"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="modal-container border border-red-600 bg-white w-96 p-6 rounded shadow-lg "
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-lg text-red-600 font-semibold">
          Are You really want to Delete ?
        </p>
        <div className="flex justify-end mt-4">
          <button
            className=" bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const BarList = () => {
  const [menus, setMenus] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [mainCategories, setMainCategories] = useState([]); // Added state for main categories
  const [pageNumber, setPageNumber] = useState(0);
  const [barCategories, setBarCategories] = useState([]);
  const [completeImageUrl, setPreviewImageUrl] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [menuToEdit, setMenuToEdit] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [menuToView, setMenuToView] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lessStockData, setLessStockData] = useState({});
  const [isDeleteSuccessPopupOpen, setIsDeleteSuccessPopupOpen] =
    useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const filterMenus = () => {
    const regex = new RegExp(searchQuery, "i");

    return menus.filter((menu) => {
      const lowerCaseName = menu.name?.toLowerCase() || "";
      const lowerCaseUniqueId = menu.barSubmenuId
        ? menu.barSubmenuId.toString().toLowerCase()
        : "";

      return regex.test(lowerCaseName) || regex.test(lowerCaseUniqueId);
    });
  };

  const exportToSampleExcel = (isExportMenu) => {
    // Create an empty worksheet
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "name",
        "pricePer30ml",
        "LessStock30ml",
        "pricePer60ml",
        "LessStock60ml",
        "pricePer90ml",
        "LessStock90ml",
        "pricePer180ml",
        "LessStock180ml",
        "pricePer360ml",
        "LessStock360ml",
        "pricePer750ml",
        "LessStock750ml",
      ],
    ]);

    // Check if exporting menu data
    if (isExportMenu) {
      // Add menu data to the worksheet (assuming menus is an array of menu objects)
      menus.forEach((menu, index) => {
        const menuData = [
          menu.name,
          menu.pricePer30ml,
          menu.pricePer60ml,
          menu.pricePer90ml,
          menu.pricePer180ml,
          menu.pricePer360ml,
          menu.pricePer750ml,
        ];
        XLSX.utils.sheet_add_aoa(ws, [menuData], { origin: index + 1 });
      });
    }

    // Set the column width for the 'name' and 'price' columns (1-based index)
    ws["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ]; // Adjust the width (20 is just an example)

    // Create an empty workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      isExportMenu ? "Menus" : "Sample_BarMenus"
    );

    // Generate a binary string from the workbook
    const wbBinary = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert the binary string to a Blob
    const blob = new Blob([s2ab(wbBinary)], {
      type: "application/octet-stream",
    });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = isExportMenu ? "menus.xlsx" : "sample_BarMenus.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to convert a string to an ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };


  const exportToExcel = () => {
    // Create an empty worksheet
    const ws = {};

    ws["!cols"] = [
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },  // lessStock column width
    ]; // Adjust the width (20 is just an example)

    // Extract all unique bar categories
    const barCategories = new Set();
    menus.forEach((menu) => {
      menu.childMenus.forEach((childMenu) => {
        barCategories.add(childMenu.barCategory);
      });
    });

    // Create the header row with "pricePer" and "LessStock" prefixes
    const headerRow = ["name"];
    barCategories.forEach((category) => {
      headerRow.push(`pricePer${category}`);
      headerRow.push(`LessStock${category}`); // Add LessStock header for each category
    });

    // Add the header row to the worksheet
    XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 0 });

    // Add menu data
    menus.forEach((menu, rowIndex) => {
      const rowData = [menu.name];

      // Populate menu prices and lessStock for each bar category
      barCategories.forEach((category) => {
        const childMenu = menu.childMenus.find(
          (item) => item.barCategory === category
        );
        if (childMenu) {
          const priceKey = `pricePer${category}`;
          rowData.push(childMenu.pricePer[priceKey] || 0);
          rowData.push(childMenu.lessStock || 0); // Add lessStock value
        } else {
          rowData.push(0); // If no price found, default to 0
          rowData.push(0); // If no lessStock found, default to 0
        }
      });

      // Add the row data to the worksheet
      XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: rowIndex + 1 });
    });

    // Center align all cells
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);

        if (!ws[cell_ref]) continue;

        ws[cell_ref].s = {
          alignment: {
            vertical: "center",
            horizontal: "center"
          }
        };
      }
    }

    // Create an empty workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MenuPrices");

    // Generate a binary string from the workbook
    const wbBinary = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert the binary string to a Blob
    const blob = new Blob([s2ab2(wbBinary)], {
      type: "application/octet-stream",
    });

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "BarMenus.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Helper function to convert a string to an ArrayBuffer
  const s2ab2 = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newMenuData, setNewMenuData] = useState({
    name: "",
    stockLimit: "",
    liquorCategory: "",
    barSubmenuId: "",
    image: null,
    ...barCategories.reduce(
        (acc, category) => ({
            ...acc,
            [`pricePer${category}`]: "",
            [`lessStockPer${category}`]: "" // Initialize lessStockPer fields
        }),
        {}
    ),
});

  const handleDelete = (menu) => {
    // Set the menu to be deleted in the state
    setMenuToDelete(menu);
    // Open the delete confirmation modal
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Proceed with the delete operation
      const response = await axios.delete(
        `http://localhost:5000/api/liquorBrand/barSubmenu/${menuToDelete._id}`
      );
      console.log("Menu deleted successfully:", response.data);

      // Update the menus state by filtering out the deleted menu
      setMenus((prevMenus) =>
        prevMenus.filter((m) => m._id !== menuToDelete._id)
      );

      // Close the delete confirmation modal
      setIsDeleteModalOpen(false);
      // Clear the menu to be deleted from the state
      setMenuToDelete(null);

      // Show delete success popup
      setIsDeleteSuccessPopupOpen(true);
      // Close the delete success popup after 3 seconds
      setTimeout(() => {
        setIsDeleteSuccessPopupOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  const cancelDelete = () => {
    // Close the delete confirmation modal without deleting
    setIsDeleteModalOpen(false);
    // Clear the menu to be deleted from the state
    setMenuToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    // If the input is a file (image input), set the image field in a different way
    if (type === "file") {
      setNewMenuData((prevData) => ({
        ...prevData,
        [name]: files[0], // Assuming you only want to handle one file
      }));
    } else {
      setNewMenuData((prevData) => ({
        ...prevData,
        [name]: capitalizeFirstLetter(value),
      }));
    }
  };

  const handleLessStockChange = (e, category) => {
    const { value } = e.target;
    setNewMenuData({
        ...newMenuData,
        [`lessStockPer${category}`]: value
    });
};


  const capitalizeFirstLetter = (input) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };

  const openExcelUpload = () => {
    setIsExcelUploadOpen(true);
  };

  const closeExcelUpload = () => {
    setIsExcelUploadOpen(false);
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupOpen(false);

    // Reload the page
    window.location.reload();
  };

  const fetchMenus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/liquorBrand/barSubmenu/list"
      );
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };


  const [errorMessage, setErrorMessage] = useState(null);


  // const addNewMenu = async () => {
  //   if (!newMenuData.name) {
  //     setErrorMessage("Name and Price are required.");
  //     setTimeout(() => {
  //       setErrorMessage(null);
  //     }, 2000);
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     // Append static form data
  //     formData.append("name", newMenuData.name);
  //     formData.append("stockLimit", newMenuData.stockLimit);
  //     formData.append("lessStock", newMenuData.lessStock);
  //     formData.append("liquorCategory", newMenuData.liquorCategory);
  //     formData.append("barSubmenuId", newMenuData.barSubmenuId);
  //     formData.append("image", newMenuData.image);

  //     console.log(formData)
  //     // Append dynamic form data (prices and categories)
  //     barCategories.forEach((category) => {
  //       const price = newMenuData[`pricePer${category}`] || 0;
  //       formData.append(`pricePer${category}`, price);
  //     });

  //     // Append barCategories as a string
  //     formData.append("barCategories", JSON.stringify(barCategories));

  //     const response = await axios.post(
  //       "http://localhost:5000/api/liquorBrand/barSubmenu",
  //       formData
  //     );

  //     console.log("Menu added successfully:", response.data);

  //     // Reset form data
  //     setNewMenuData({
  //       name: "",
  //       lessStock: "",
  //       stockLimit: "",
  //       sizeMl: "",
  //       liquorCategory: "",
  //       barSubmenuId: "",
  //       imageUrl: null,
  //       ...barCategories.reduce(
  //         (acc, category) => ({
  //           ...acc,
  //           [`pricePer${category}`]: "",
  //         }),
  //         {}
  //       ),
  //     });

  //     setIsSuccessModalOpen(true);
  //     setTimeout(() => {
  //       setIsSuccessModalOpen(false);
  //       setIsNewModalOpen(false);
  //       setIsModalOpen(false);
  //     }, 2000);

  //     setErrorMessage(null);
  //     fetchMenus();
  //   } catch (error) {
  //     console.error("Error adding menu:", error);
  //     let errorMessage = "Error adding menu. Please try again later.";

  //     if (error.response && error.response.status === 400) {
  //       const specificErrorMessage = error.response.data.message;
  //       if (specificErrorMessage) {
  //         if (specificErrorMessage.includes("uniqueId")) {
  //           if (/[a-zA-Z]/.test(newMenuData.uniqueId)) {
  //             errorMessage = "Menu ID should be a numeric value.";
  //           } else {
  //             errorMessage = "Menu ID is already taken.";
  //           }
  //         }
  //       }
  //     }

  //     setErrorMessage(errorMessage);
  //     setTimeout(() => {
  //       setErrorMessage(null);
  //     }, 2000);

  //     setIsErrorModalOpen(true);
  //     setTimeout(() => {
  //       setIsErrorModalOpen(false);
  //     }, 2000);
  //   }
  // };


  const addNewMenu = async () => {
    if (!newMenuData.name) {
        setErrorMessage("Name and Price are required.");
        setTimeout(() => {
            setErrorMessage(null);
        }, 2000);
        return;
    }

    try {
        const formData = new FormData();
        // Append static form data
        formData.append("name", newMenuData.name);
        formData.append("stockLimit", newMenuData.stockLimit);
        formData.append("liquorCategory", newMenuData.liquorCategory);
        formData.append("barSubmenuId", newMenuData.barSubmenuId);
        formData.append("image", newMenuData.image);

        // Collect and append dynamic form data (prices and lessStock values)
        const lessStockData = {};
        barCategories.forEach((category) => {
            const price = newMenuData[`pricePer${category}`] || 0;
            formData.append(`pricePer${category}`, price);

            const lessStock = newMenuData[`lessStockPer${category}`] || 0;
            lessStockData[category] = lessStock;
        });

        // Append barCategories and lessStockData as strings
        formData.append("barCategories", JSON.stringify(barCategories));
        formData.append("lessStockData", JSON.stringify(lessStockData));

        const response = await axios.post(
            "http://localhost:5000/api/liquorBrand/barSubmenu",
            formData
        );

        console.log("Menu added successfully:", response.data);

        // Reset form data
        setNewMenuData({
            name: "",
            stockLimit: "",
            liquorCategory: "",
            barSubmenuId: "",
            image: null,
            ...barCategories.reduce(
                (acc, category) => ({
                    ...acc,
                    [`pricePer${category}`]: "",
                    [`lessStockPer${category}`]: ""
                }),
                {}
            ),
        });

        setIsSuccessModalOpen(true);
        setTimeout(() => {
            setIsSuccessModalOpen(false);
            setIsNewModalOpen(false);
            setIsModalOpen(false);
        }, 2000);

        setErrorMessage(null);
        fetchMenus();
    } catch (error) {
        console.error("Error adding menu:", error);
        let errorMessage = "Error adding menu. Please try again later.";

        if (error.response && error.response.status === 400) {
            const specificErrorMessage = error.response.data.message;
            if (specificErrorMessage) {
                if (specificErrorMessage.includes("uniqueId")) {
                    if (/[a-zA-Z]/.test(newMenuData.uniqueId)) {
                        errorMessage = "Menu ID should be a numeric value.";
                    } else {
                        errorMessage = "Menu ID is already taken.";
                    }
                }
            }
        }

        setErrorMessage(errorMessage);
        setTimeout(() => {
            setErrorMessage(null);
        }, 2000);

        setIsErrorModalOpen(true);
        setTimeout(() => {
            setIsErrorModalOpen(false);
        }, 2000);
    }
};





  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/liquorBrand/barSubmenu/list"
        );
        setMenus(response.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, []);

  // useEffect(() => {
  //   // Fetch barCategory values from backend API when the component mounts
  //   axios
  //     .get("http://localhost:5000/api/liquorBrand/barCategory/list")
  //     .then((response) => {
  //       // Update the barCategories state with the received values
  //       setBarCategories(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching barCategory values:", error);
  //     });
  // }, []);


  useEffect(() => {
    // Fetch barCategory values from backend API when the component mounts
    axios
      .get('http://localhost:5000/api/liquorBrand/barCategory/list')
      .then((response) => {
        // Update the barCategories state with the received values
        setBarCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching barCategory values:', error);
      });

    // Fetch displayMenus data from backend API or any other source
    // axios
    //   .get('http://localhost:5000/api/liquorBrand/menu/list')
    //   .then((response) => {
    //     // Process the data to ensure each item has a lessStock value, defaulting to 0 if not provided
    //     const processedMenus = response.data.map((menu) => {
    //       const updatedMenu = { ...menu };
    //       barCategories.forEach((category) => {
    //         if (typeof updatedMenu[`${category}LessStock`] === 'undefined') {
    //           updatedMenu[`${category}LessStock`] = 0;
    //         }
    //       });
    //       return updatedMenu;
    //     });
    //     setDisplayMenus(processedMenus);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching menu data:', error);
    //   });
  }, [barCategories]);

  const handleFileUpload = async () => {
    try {
      if (!file) {
        console.error("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      // Make a POST request to upload the Excel file
      const response = await axios.post(
        "http://localhost:5000/api/liquorBrand/upload-excel",
        formData
      );

      console.log(response.data); // Handle the response data as needed

      // Fetch the updated list of menus after successful upload
      const updatedMenusResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/barSubmenu/list"
      );

      // Update the menus state with the updated list of menus
      setMenus(updatedMenusResponse.data);

      setIsSuccessPopupOpen(true);
      // Set a timeout to automatically close the success popup after 3 seconds (adjust as needed)
      // setTimeout(() => {
      //   closeSuccessPopup();
      // }, 3000);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  const menusPerPage = 10; // Change this to set the number of menus per page

  const pageCount = Math.ceil(menus.length / menusPerPage);



  const displayMenus = filterMenus()
    .slice(pageNumber * menusPerPage, (pageNumber + 1) * menusPerPage)
    .map((menu, index) => (
      <tr key={menu._id.$oid} className={index % 2 === 0 ? "bg-white" : "bg-gray-100 text-sm"}>
        <td className="p-2 text-center text-gray">{pageNumber * menusPerPage + index + 1}</td>
        <td className="text-left text-green-950 lg:pl-10 pl-4 text-sm p-1">{menu.name}</td>

        {barCategories.map((category, catIndex) => (
          <React.Fragment key={`${menu._id.$oid}-${category}-${catIndex}`}>
            {/* Check if the menu has child menus for this category */}
            {menu.childMenus.some(childMenu => childMenu.barCategory === category) ? (
              <>
                {/* Find the child menu for the current category */}
                {menu.childMenus.map((childMenu, childIndex) => {
                  if (childMenu.barCategory === category) {
                    return (
                      <React.Fragment key={`${childMenu._id.$oid}`}>
                        <td className="p-1 text-center text-gray text-sm">{childMenu.pricePer ? childMenu.pricePer[`pricePer${category}`] || 0 : 0}</td>
                        <td className="p-1 text-center text-gray text-sm">{childMenu.lessStock || 0}</td>
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </>
            ) : (
              // Display blank cells for the category if no child menus are found
              <React.Fragment key={`empty-${category}`}>
                <td className="p-1 text-center text-gray text-sm">0</td>
                <td className="p-1 text-center text-gray text-sm">0</td>
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
        <td className="py-1 text-center">
          <button
            className="text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm shadow-md"
            style={{ background: "#ffff" }}
            onClick={() => handleDelete(menu)}
          >
            <FontAwesomeIcon
              icon={faTrash}
              color="red"
              className="cursor-pointer"
            />{" "}
          </button>
        </td>
      </tr>
    ));


  const modalContent = (
    <div
      className="modal-container bg-white p-6 rounded-md shadow-md relative font-sans w-3/4"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setIsNewModalOpen(false)}
        className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
      <div className="p-1 text-left">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-left ml-2">
          Add New Bar-Menu
        </h3>
        {errorMessage && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white rounded p-7 shadow-md z-50 absolute">
              <p className="text-red-500 font-semibold text-center text-xl">
                {errorMessage}
              </p>
            </div>
          </div>
        )}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white border border-green-500 rounded p-7 shadow-md z-50 absolute">
              <p className="text-green-500 font-semibold text-center text-xl">
                Menu added successfully!
              </p>
            </div>
          </div>
        )}
        <form>
          <div className=" flex lg:flex-row flex-col md:flex-row gap-2 font-sans">
            <label className="block text-base text-gray-600 dark:text-gray-400 whitespace-nowrap ml-2 font-bold">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newMenuData.name}
              autoComplete="off"
              onChange={handleInputChange}
              className="w-72 p-1 mb-2 border-2 rounded-md -mt-2 ml-5"
              required
            />
          </div>

          {/* <div className=" flex lg:flex-row flex-col md:flex-row gap-2 font-sans">
            <label className="block text-base text-gray-600 dark:text-gray-400 whitespace-nowrap ml-2 font-bold">
              Less Stock
            </label>
            <input
              type="text"
              name="lessStock"
              value={newMenuData.lessStock}
              autoComplete="off"
              onChange={handleInputChange}
              className="w-72 p-1 mb-2 border-2 rounded-md -mt-2 ml-5"
              required
            />
          </div> */}

          <hr />
          <div className="ml-2 font-extrabold mt-2">
            Fill the required Prices{" "}
          </div>
          {/* Dynamically generated input fields for each barCategory */}
          <div className=" grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 mt-5">
            {barCategories.map((category, index) => (
              <div className="flex flex-col w-full mb-4 px-2" key={index}>
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400 font-bold">
                  {category}
                </label>
                <input
                  type="number"
                  name={`pricePer${category}`}
                  value={newMenuData[`pricePer${category}`] || 0}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full p-1 border rounded-md border-gray-300"
                  min={0}
                />


                <label className="block text-gray-700 text-sm font-bold mt-1 -mb-1">
                  Less Stock
                </label>
                <input
                  type="number" // Changed to "number" type for lessStock
                  name={`lessStock${category}`}
                  placeholder="lessStock"
                  value={newMenuData[`lessStockPer${category}`] || 0}
                  autoComplete="off"
                  onChange={(e) => handleLessStockChange(e, category)}
                  className="w-full p-1 mb-2 border-2 rounded-md mt-1 "
                  required
                  min={0}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
              onClick={addNewMenu}
            >
              Add Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      <Navbar />
      <div className="container mx-auto p-2 mt-12 overflow-x-auto  border-gray-300 shadow-md font-sans max-w-7xl">
        <div className="fixed justify-between mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <h1 className="text-xl font-bold font-sans mb-2 md:mb-0 text-orange-600">
              Bar Brands List
            </h1>
            <div className="flex flex-col md:flex-row items-center lg:pl-96 md:pl-24">
              <div className="relative mb-2 md:mb-0 md:mr-3">
                <input
                  className="border-2 border-gray-300 pl-2 rounded-full bg-white h-9 text-sm focus:outline-non"
                  id="searchInput"
                  type="text"
                  name="searchInput"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-0 mr-2 top-1">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-700" />
                </button>
              </div>
              <div className="flex justify-between">
                <button
                  className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
                  onClick={() => exportToExcel(true)}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-1" />
                  Export
                </button>
                <button
                  className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
                  onClick={openExcelUpload}
                >
                  <FontAwesomeIcon icon={faUpload} className="mr-1" />
                  Import
                </button>
                <button
                  className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
                  onClick={() => exportToSampleExcel(false)}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-1" />
                  Sample
                </button>
                <button
                  className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
                  onClick={() => setIsNewModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add
                </button>
                <button
                  className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faPen} className="mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        <table className=" max-w-5xl mx-auto mt-40 lg:mt-20 md:mt-20">
          <thead className="text-sm bg-zinc-100 text-yellow-700 border">
            <tr>
              <th className="p-2 whitespace-nowrap border">Sr No.</th>
              <th className="text-left text-gray lg:pl-10 pl-4 border">
                Menu Name
              </th>
              {/* <th className="text-left pl-8">Image</th> */}
              {/* <th className="p-2 pl-4 border">MenuID</th> */}
              {/* Generate dynamic headers for each category */}
              {barCategories.map((category, index) => (
                <>
                  <th key={index} className="p-3 border">{`${category} Price`}</th>
                  <th key={`${category}-lessStock`} className="p-3 border">{`${category} LessStock`}</th>
                </>
              ))}
              {/* <th className="p-2 border">Stock Limit</th> */}
              {/* <th className="p-2 border">Size Ml</th> */}
              {/* <th className="p-2 border">Liquor Category</th> */}
              <th className="p-2 text-center">Actions</th>
            </tr >
          </thead>
          <tbody className="text-md font-sans font-bold whitespace-nowrap">
            {displayMenus}
          </tbody>
        </table>

        <div className="flex flex-col items-center mt-1">
          <span className="text-xs text-gray-700 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {pageNumber * menusPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min((pageNumber + 1) * menusPerPage, menus.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {menus.length}
            </span>{" "}
            Menus
          </span>
          <div className="inline-flex mt-1 xs:mt-0">
            <button
              className={`${pageNumber === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                } flex items-center justify-center px-3 h-8 text-xs font-medium text-white bg-gray-800 border-gray-700 rounded-s`}
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
              disabled={pageNumber === 0}
            >
              <FontAwesomeIcon icon={faAnglesLeft} />
            </button>
            <button
              className={`${pageNumber === pageCount - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                } flex items-center justify-center px-3 h-8 text-xs font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e`}
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, pageCount - 1))
              }
              disabled={pageNumber === pageCount - 1}
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </button>
          </div>
        </div>
      </div>

      {isPreviewModalOpen && (
        <div
          className="font-sans fixed inset-0 flex items-center justify-center z-50 m-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-container bg-white w-72 p-6 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setIsPreviewModalOpen(false)}
            ></button>
            <div className="p-1 text-center">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
                Image Preview
              </h3>
              <Image
                src={completeImageUrl}
                alt="Preview"
                width={500}
                height={500}
              />
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded-full mt-4 mr-2"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isNewModalOpen && (
        <div
          className="font-sans fixed inset-0 flex items-center justify-center z-50 m-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          {modalContent}
        </div>
      )}

      {/* {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            setMenuToEdit(null);
          }}
          onEdit={(editedMenu) => {
            // Update the menus state with the edited menu
            setMenus((prevMenus) =>
              prevMenus.map((menu) =>
                menu._id === editedMenu._id ? editedMenu : menu
              )
            );
          }}
          menuToEdit={menuToEdit}
          mainCategories={mainCategories}
        />
      )} */}

      {isExcelUploadOpen && (
        <div className="font-sans fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md max-w-md relative">
            <button
              onClick={closeExcelUpload}
              className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h1 className="text-2xl font-semibold mb-6">Upload Excel File</h1>
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-4 p-3 border border-gray-300 rounded w-full"
            />
            <button
              onClick={() => {
                handleFileUpload();
                closeExcelUpload();
              }}
              className="bg-orange-100 text-orange-600 p-3 rounded-full w-full hover:bg-orange-200 font-semibold"
            >
              Upload To Excel
            </button>
          </div>
        </div>
      )}

      {isSuccessPopupOpen && (
        <div className="font-sans fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md max-w-md relative">
            <button
              onClick={closeSuccessPopup}
              className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h1 className="text-2xl font-semibold mb-6">Success!</h1>
            <p className="text-lg mb-4">Menus uploaded successfully.</p>
          </div>
        </div>
      )}

      {isDeleteSuccessPopupOpen && (
        <div className="font-sans fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md max-w-md relative">
            <p className="text-xl mb-4 text-red-500 font-semibold">
              Menu Deleted successfully.
            </p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="font-sans fixed inset-0 flex items-center justify-center z-50 m-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <NewEditModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default BarList;

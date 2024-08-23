"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faTrash,
    faTimes,
    faXmark,
    faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";



//unit modal//

const NewUnitModal = ({ isOpen, onClose }) => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newUnit, setNewUnit] = useState("");
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const authToken = localStorage.getItem("EmployeeAuthToken");
        if (!authToken) {
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/unit/units"
                );
                setUnits(response.data);
            } catch (error) {
                console.error("Error fetching units:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, []);

    const handleEditClick = (unit) => {
        setSelectedUnit(unit);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (unit) => {
        setSelectedUnit(unit);
        setIsDeleteModalOpen(true);
    };

    const handleEditSubmit = async (e, updatedUnit) => {
        e.preventDefault();

        // Check if updated unit is empty
        if (!updatedUnit.unit.trim()) {
            setErrorMessage("Updated unit cannot be empty.");
            setErrorModalOpen(true);
            // Automatically close the error modal after 2 seconds
            setTimeout(() => {
                setErrorModalOpen(false);
                setErrorMessage("");
            }, 2000);
            return;
        }

        try {
            // Make an API request using Axios to update the unit
            await axios.patch(
                `http://localhost:5000/api/unit/units/${selectedUnit._id}`,
                {
                    unit: updatedUnit.unit, // Use 'unit' instead of 'updatedUnit.units'
                }
            );

            // Update the local state after a successful edit
            setUnits((prevUnits) =>
                prevUnits.map((unit) =>
                    unit._id === selectedUnit._id ? updatedUnit : unit
                )
            );
        } catch (error) {
            console.error("Error updating unit:", error);
        } finally {
            setIsEditModalOpen(false);
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            await axios.delete(
                `http://localhost:5000/api/unit/units/${selectedUnit._id}`
            );
            // Remove the deleted unit from the local state
            setUnits((prevUnits) =>
                prevUnits.filter((unit) => unit._id !== selectedUnit._id)
            );
        } catch (error) {
            console.error("Error deleting unit:", error);
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make an API request using Axios to post the new unit
            await axios.post("http://localhost:5000/api/unit/units", {
                unit: newUnit,
            });

            // Fetch the updated list of units
            const response = await axios.get("http://localhost:5000/api/unit/units");
            setUnits(response.data);

            // Reset the new unit input field
            setNewUnit("");

            // Open the success popup
            setIsSuccessPopupOpen(true);

            // Close the success popup after a few seconds (e.g., 3 seconds)
            setTimeout(() => {
                setIsSuccessPopupOpen(false);
            }, 1000);
        } catch (error) {
            console.error("Error submitting form:", error.message);
            // Handle the error as needed
        }
    };


    return (
        <div
            className={`fixed inset-0 z-40 flex items-center justify-center ${isOpen ? "" : "hidden"
                }`}
        >
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black opacity-50"></div>

            {/* Modal Content */}
            <div className="relative z-40 bg-white p-6 rounded-md shadow-lg w-96">
                <button
                    type="button"
                    className="absolute text-sm top-4 right-4 bg-red-100 text-red-800 hover:bg-red-200 p-2 py-1 rounded-full text-center"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2 className="text-base font-bold mb-4 text-orange-500">Add Unit</h2>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-4 mt-4">
                        <label
                            htmlFor="newUnit"
                            className="block text-sm font-semibold text-gray-600"
                        >
                            Unit :
                        </label>
                        <input
                            type="text"
                            id="newUnit"
                            name="newUnit"
                            value={newUnit}
                            onChange={(e) => setNewUnit(e.target.value)}
                            className="mt-1 p-1 border rounded-md  focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    <div className="col-span-2 flex justify-center mt-1">
                        <button
                            type="submit"
                            className=" bg-orange-200 text-orange-700 hover:bg-orange-300 text-gray font-semibold p-2 px-4 rounded-full w-72 mx-auto"
                        >
                            Add Unit
                        </button>
                    </div>
                </form>
                <div className="max-h-56 custom-scrollbars overflow-y-auto mt-4">
                    <table className="min-w-full ">
                        <thead className="text-sm bg-zinc-100 text-yellow-700 border">
                            <tr>
                                <th className="p-1 text-center text-gray">Units</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-sans font-semibold">
                            {units.map((unit, index) => (
                                <tr
                                    key={unit._id}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100 "}
                                >
                                    <td className="p-1 text-center text-gray">{unit.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

//vat modal
const VatModal = ({ isOpen, onClose }) => {
    const [vatPercentage, setVatPercentage] = useState('');
    const [vatList, setVatList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deletingItemId, setDeletingItemId] = useState(null);
  
    const router = useRouter()
    useEffect(() => {
      const authToken = localStorage.getItem("EmployeeAuthToken");
      if (!authToken) {
        router.push("/login");
      }
    }, []);
  
    const handleConfirmDelete = async () => {
      try {
        // Send a delete request to the server
        await axios.delete(`http://localhost:5000/api/purchaseVAT/vat/${deletingItemId}`);
        // Fetch the updated VAT list after deletion
        fetchVatList();
      } catch (error) {
        console.error('Error deleting VAT item:', error.message);
      }
  
      // Close the popup after deletion
      setShowDeletePopup(false);
      setDeletingItemId(null);
    };
  
    useEffect(() => {
      fetchVatList();
    }, []);
  
    const fetchVatList = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/purchaseVAT/vat');
        setVatList(response.data || []);
      } catch (error) {
        console.error('Error fetching VAT list:', error.message);
      }
    };
  
    const handleInputChange = (e) => {
      setVatPercentage(e.target.value);
    };
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
  
      try {
        await axios.post('http://localhost:5000/api/purchaseVAT/vat', { vatPercentage });
        fetchVatList();
        setVatPercentage('');
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          setErrorMessage(errorMessage);
          setShowModal(true);
          // Close the modal after 2 seconds
          setTimeout(() => {
            setShowModal(false);
            setErrorMessage('');
          }, 2000);
        } else {
          console.error('Error submitting VAT form:', error.message);
        }
      }
    };
  
    const handleDeleteClick = (itemId) => {
      setDeletingItemId(itemId);
      setShowDeletePopup(true);
    };
  
    const closeModal = () => {
      setShowModal(false);
      setErrorMessage('');
    };
  
    const handleCancelDelete = () => {
      // Cancel the delete action
      setShowDeletePopup(false);
      setDeletingItemId(null);
    };
  
    return (
      <>
  



        <div className={`fixed lg:w-1/3 md:w-1/2 w-96 inset-0 z-40 max-w-5xl h-fit mx-auto mt-20 container shadow-md font-sans rounded-md bg-white ${isOpen ? "" : "hidden"
                }`} >
          <form onSubmit={handleFormSubmit} className="mb-4 flex items-center ml-3">
            <div className="text-sm font-semibold font-sans md:mb-0 p-3">
            <button
                    type="button"
                    className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
            <h1 className="text-base font-bold font-sans mb-2 md:mb-0 text-orange-600">VAT For Purchase</h1>
              <label htmlFor="vatPercentage" className="block text-sm font-bold text-gray-600 mt-4">
                VAT Percentage (%)
              </label>
              <input
                type="text"
                id="vatPercentage"
                name="vatPercentage"
                value={vatPercentage}
                onChange={handleInputChange}
                className="mt-1 p-0.5 border rounded-md focus:outline-none focus:ring focus:border-blue-300 w-28"
                required
              />
              <div className='flex justify-center mt-4'>
                 <button
                type="submit"
                className="bg-orange-200 hover:bg-orange-300 text-orange-700 font-bold py-2 px-4 rounded-full
                 w-48 mx-auto mb-3 lg:ml-48 md:ml-40 text-base"
              >
                Save
              </button>
              </div>
            </div>
          </form>
          
          <div>
            <table className="min-w-full border border-gray-300 mb-4 mx-auto -mt-2 ">
              <thead className='text-base bg-zinc-100 text-yellow-700 border'>
                <tr>
                  <th className="text-left text-gray lg:pl-16 pl-4 text-sm">VAT Percentages</th>
                  <th className="p-2 text-center text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vatList.map((vat,index) => (
                  <tr key={vat._id }
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 '}
  
                  >
                    <td className=" p-1 text-left text-gray lg:pl-16 pl-4 text-sm">{vat.vatPercentage}</td>
                    <td className="p-1 text-center text-gray">
                      <button
                        onClick={() => handleDeleteClick(vat._id)}
                        className="text-gray-600  focus:outline-none font-sans font-medium p-2 py-1 rounded-full text-sm shadow-md" style={{ background: "#ffff" }}
                      >
                        <FontAwesomeIcon icon={faTrash} color="red" className=" text-center" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Delete Confirmation Popup */}
          {showDeletePopup && (
            <div className="fixed inset-0 bg-gray-400 bg-opacity-80 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-red-500 mb-4">Are you sure you want to Delete?</p>
                <button
                  onClick={handleConfirmDelete}
                  className=" bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelDelete} 
                  className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
                >
                  No
                </button>
              </div>
            </div>
          )}
  
          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-green-800">VAT already added</h2>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };
//close vat modal

//vendor modal//
const NewVendorModal = ({ isOpen, onClose }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [editedSupplier, setEditedSupplier] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
        useState(false);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false); // New state for success popup
    const [error, setError] = useState("");

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const [formData, setFormData] = useState({
        vendorName: "",
        address: "",
        contactNumber: "",
        email: "",
        gstNumber: "",
        openingBalance: "",
    });

    const router = useRouter();
    useEffect(() => {
        const authToken = localStorage.getItem("EmployeeAuthToken");
        if (!authToken) {
            router.push("/login");
        }
    }, []);

    // Function to handle input changes and capitalize the first letter
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Capitalize the first letter if the input is not empty
        let capitalizedValue =
            value !== "" && (name === "vendorName" || name === "address")
                ? capitalizeFirstLetter(value)
                : value;

        // If the input is a contact number, update the value with only numeric characters
        if (name === "contactNumber") {
            // Remove non-numeric characters from the value
            const numericValue = value.replace(/[^0-9]/g, "");

            // Trim the value to 10 digits
            capitalizedValue = numericValue.slice(0, 10);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: capitalizedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate form fields
            if (formData.contactNumber.length !== 10) {
                throw new Error("Contact number must be exactly 10 digits long");
            }

            // Remove email field if it is empty
            if (formData.email === "") {
                delete formData.email;
            }

            // Make POST request to add supplier
            const response = await axios.post(
                "http://localhost:5000/api/supplier/suppliers",
                formData
            );

            // Handle successful response
            console.log("Supplier added successfully:", response.data);

            // Fetch updated list of suppliers
            const updatedSuppliersResponse = await axios.get(
                "http://localhost:5000/api/supplier/suppliers"
            );
            setSuppliers(updatedSuppliersResponse.data);

            // Reset form data
            setFormData({
                vendorName: "",
                address: "",
                contactNumber: "",
                email: "",
                gstNumber: "",
                openingBalance: "",
            });

            // Open success popup
            setIsSuccessPopupOpen(true);

            // Close success popup after a few seconds
            setTimeout(() => {
                setIsSuccessPopupOpen(false);
            }, 3000);
        } catch (error) {
            console.error("Error adding supplier:", error.message);
            // Clear error message after 2 seconds
            setTimeout(() => {
                setError("");
            }, 2000);
        }
    };

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/supplier/suppliers"
                );
                setSuppliers(response.data);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };

        fetchSuppliers();
    }, []);

    const handleEdit = (supplier) => {
        setEditedSupplier(supplier);
        setIsEditModalOpen(true);
    };

    const handleDelete = (supplier) => {
        setEditedSupplier(supplier);
        setIsDeleteConfirmationModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validation check for contact number
            if (formData.contactNumber.length !== 10) {
                console.error(
                    "Error adding supplier: Contact number must be a 10-digit number"
                );
                setIsContactModalOpen(true);

                // Set a timer to close the error modal after 2000 milliseconds (2 seconds)
                setTimeout(() => {
                    setIsContactModalOpen(false);
                }, 2000);
                return; // Exit the function early if validation fails
            }
            const response = await axios.patch(
                `http://localhost:5000/api/supplier/suppliers/${editedSupplier._id}`,
                editedSupplier
            );

            // Assuming the API returns the updated supplier
            const updatedSupplier = response.data;

            // Update the state with the updated supplier
            setSuppliers((prevSuppliers) =>
                prevSuppliers.map((supplier) =>
                    supplier._id === updatedSupplier._id ? updatedSupplier : supplier
                )
            );

            // Close the edit modal
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating supplier:", error);
        }
    };

    const handleDeleteConfirmed = async () => {
        try {
            // Assuming the API returns the deleted supplier
            await axios.delete(
                `http://localhost:5000/api/supplier/suppliers/${editedSupplier._id}`
            );

            // Update the state by removing the deleted supplier
            setSuppliers((prevSuppliers) =>
                prevSuppliers.filter((supplier) => supplier._id !== editedSupplier._id)
            );

            // Close the delete modal
            setIsDeleteConfirmationModalOpen(false);
        } catch (error) {
            console.error("Error deleting supplier:", error);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-40 flex items-center justify-center ${isOpen ? "" : "hidden"
                }`}
        >
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black opacity-50"></div>

            {/* Modal Content */}
            <div className="relative z-40 bg-white p-6 rounded-md shadow-lg md:w-2/3 w-72 lg:w-2/3">
                <button
                    type="button"
                    className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <h2 className="text-xl font-bold mb-4 text-orange-500">Add Vendor</h2>
                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="mx-auto mt-4">
                    {error && (
                        <div className="text-red-500 mb-4 text-center">{error}</div>
                    )}
                    <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-2">
                        <div className="lg:mb-4 md:mb-4 mb-0">
                            <label
                                htmlFor="vendorName"
                                className="block text-sm font-medium text-gray-600"
                            >
                                Vendor Name: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="vendorName"
                                name="vendorName"
                                value={formData.vendorName}
                                onChange={handleChange}
                                className="mt-1 p-1  border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>

                        <div className="lg:mb-4 md:mb-4 mb-0">
                            <label
                                htmlFor="contactNumber"
                                className="block text-sm font-medium text-gray-600 -ml-2 lg:ml-0 md:ml-0"
                            >
                                Contact Number: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="contactNumber"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>

                        <div className="lg:mb-4 md:mb-4 mb-0">
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-600"
                            >
                                Address:
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>

                        <div className="lg:mb-4 md:mb-4 mb-0">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-600"
                            >
                                Email ID:
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>

                        <div className="lg:mb-4 md:mb-4 mb-0">
                            <label
                                htmlFor="gstNumber"
                                className="block text-sm font-medium text-gray-600"
                            >
                                GST Number:
                            </label>
                            <input
                                type="text"
                                id="gstNumber"
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>

                        <div className="lg:mb-4 md:mb-4 mb-0">
                            <label
                                htmlFor="openingBalance"
                                className="block text-sm font-medium text-gray-600"
                            >
                                Opening Balance:
                            </label>
                            <input
                                type="text"
                                id="openingBalance"
                                name="openingBalance"
                                value={formData.openingBalance}
                                onChange={handleChange}
                                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        

                        
                    </div>
                    <div className="col-span-2 flex justify-center mt-1 ">
                        <button
                            type="submit"
                            className="bg-orange-200 text-orange-800 hover:bg-orange-300 text-gray font-semibold p-2 px-4 rounded-full mt-4 md:w-72 w-full mx-auto"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                <div className="max-h-44 custom-scrollbars overflow-y-auto mt-4">
                    <table className="min-w-full">
                        <thead className="text-sm bg-zinc-100 text-yellow-600 border">
                            <tr>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                    Name
                                </th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                    Address
                                </th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                    Contact No.
                                </th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                    Email
                                </th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                    GST
                                </th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                    Opening Bal.
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-sans font-semibold">
                            {suppliers.map((supplier, index) => (
                                <tr
                                    key={supplier._id}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100 "}
                                >
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                        {supplier.vendorName}
                                    </td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                        {supplier.address}
                                    </td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                        {supplier.contactNumber}
                                    </td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                        {supplier.email}
                                    </td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                        {supplier.gstNumber}
                                    </td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                                        {supplier.openingBalance}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
//close vendor modal//

const BarPurchaseForm = () => {
    const [itemTotals, setItemTotals] = useState({});
    const [lastItemIndex, setLastItemIndex] = useState(-1);
    const [stockQty, setStockQty] = useState(0);
    const [stockQtyMl, setStockQtyMl] = useState(0);
    const [discount, setDiscount] = useState(""); // Step 1
    const [grandTotal, setGrandTotal] = useState(""); // New state for grand total
    const [gst, setGst] = useState(0);
    const [vat, setVat] = useState(0);
    const [isGSTModalOpen, setIsGSTModalOpen] = useState(false);
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
    const [currentItemVat, setCurrentItemVat] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [itemIndexToDelete, setItemIndexToDelete] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isNewUnitModalOpen, setIsNewUnitModalOpen] = useState(false);
    const [isVatModalOpen, setIsVatModalOpen] = useState(false);
    const [isNewVendorModalOpen, setIsNewVendorModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [productNames, setProductNames] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [childMenuNames, setChildMenuNames] = useState([]);
    const [selectedChildMenu, setSelectedChildMenu] = useState('');
    const [categories, setCategories] = useState([]);

    const calculateItemTotal = (item) => {
        const quantity = parseFloat(item.quantity);
        const pricePerQty = parseFloat(item.pricePerQty);
        const subtotal = quantity * pricePerQty;


        if (parseFloat(item.vat) === 0) {
            return subtotal;
        } else {
            const itemVat = parseFloat(item.vat);
            const vatAmount = (subtotal * itemVat) / 100;
            return subtotal + vatAmount;
        }
    };


    // Calculate grand total
    const calculateGrandTotal = () => {
        const itemSubtotals = Object.values(itemTotals);
        const subtotal = itemSubtotals.reduce((total, itemSubtotal) => total + itemSubtotal, 0);
        const totalWithHandlesAndFrights = subtotal + parseFloat(formData.handleAmount || 0) + parseFloat(formData.frightAmount || 0);
        return Math.round(totalWithHandlesAndFrights);
    };



    const router = useRouter();
    useEffect(() => {
        const authToken = localStorage.getItem("EmployeeAuthToken");
        if (!authToken) {
            router.push("/login");
        }
    }, []);



    const handleEditItem = (index) => {
        // Get the item to be edited
        const editedItem = items[index];

        // Populate the form fields with the values of the selected item
        setFormData({
            date: editedItem.date,
            dueDate: editedItem.dueDate,
            tpDate: editedItem.tpDate,
            billNo: editedItem.billNo,
            tpNo: editedItem.tpNo,
            vendor: editedItem.vendor,
            name: editedItem.name,
            quantity: editedItem.quantity,
            unit: editedItem.unit,
            pricePerQty: editedItem.pricePerQty,
            // bottlePrice: editedItem.bottlePrice,
            vat: editedItem.vat,
            vatAmount: editedItem.vatAmount,
            paidAmount: editedItem.paidAmount,
            handleAmount: editedItem.handleAmount,
            frightAmount: editedItem.frightAmount,
        });

        // Set the discount value
        setDiscount(parseFloat(editedItem.discount || 0));

        // Remove the edited item from the items list
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };



    const handleConfirmDelete = () => {
        // Get the index of the item to be deleted
        const index = itemToDeleteIndex;

        // Logic to handle item deletion
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);

        // Recalculate totals and set discount to 0
        const newTotals = updatedItems.reduce((totals, item) => {
            totals[item.name] = calculateItemTotal(item);
            return totals;
        }, {});

        // Set the discount to 0
        setDiscount(0);

        // Set the updated totals to the state
        setItemTotals(newTotals);

        // Clear the form data
        setFormData({
            date: "",
            dueDate: "",
            tpDate: "",
            billNo: "",
            tpNo: "",
            vendor: "",
            name: "",
            quantity: "",
            unit: "",
            pricePerQty: "",
            // bottlePrice: "",
            vat: "",
            vatAmount: "",
            paidAmount: "",

            handleAmount: "",
            frightAmount: "",
        });

        // Hide the delete confirmation popup
        setDeleteConfirmation(false);
        setItemToDeleteIndex(null);
    };

    const handleDeleteClick = (index) => {
        // Set the index of the item to be deleted and show the delete confirmation popup
        setItemToDeleteIndex(index);
        setDeleteConfirmation(true);
    };

    const handleCancelDelete = () => {
        // Clear the itemToDeleteIndex and hide the delete confirmation popup
        setItemToDeleteIndex(null);
        setDeleteConfirmation(false);
    };

    // Function to open the GST form modal
    const openGSTModal = () => {
        setIsGSTModalOpen(true);
    };

    // Function to close the GST form modal
    const closeGSTModal = () => {
        setIsGSTModalOpen(false);
    };

    const openUnitModal = () => {
        setIsUnitModalOpen(true);
    };

    // Function to close the GST form modal
    const closeUnitModal = () => {
        setIsUnitModalOpen(false);
    };

    const openProductModal = () => {
        setIsProductModalOpen(true);
    };

    // Function to close the GST form modal
    const closeProductModal = () => {
        setIsProductModalOpen(false);
    };

    const openVendorModal = () => {
        setIsVendorModalOpen(true);
    };

    // Function to close the GST form modal
    const closeVendorModal = () => {
        setIsVendorModalOpen(false);
    };

    const [formData, setFormData] = useState({
        billNo: "",
        tpNo: "",
        date: getCurrentDate(),
        dueDate: calculateDueDate(),
        tpDate: getCurrentDate(),
        vendor: "",
        name: "",
        quantity: "",
        unit: "",
        pricePerQty: "",
        vat: "",
        vatAmount: "",
        paidAmount: "",
        handleAmount: "",
        frightAmount: "",
    });

    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [units, setUnits] = useState([]);
    const [vats, setVats] = useState([]);
    const [items, setItems] = useState([]);
    const sortedProducts = products
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
    console.log(sortedProducts)

    // const handleProductChange = (e) => {
    //     setSelectedProduct(e.target.value);
    // };

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function calculateDueDate() {
        const currentDate = new Date();
        const dueDate = new Date(currentDate.setDate(currentDate.getDate() + 25));
        return formatDate(dueDate);
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    
    useEffect(() => {
        const fetchVendors = async () => {
          try {
            const response = await axios.get(
              "http://localhost:5000/api/supplier/suppliers"
            );
            const sortedVendors = response.data.sort((a, b) =>
              a.vendorName.localeCompare(b.vendorName)
            );
            setVendors(sortedVendors);
          } catch (error) {
            console.error("Error fetching vendors:", error);
          }
        };
        fetchVendors();
      }, []);
    

    // const handleCategoryChange = (e) => {
    //     setSelectedCategory(e.target.value);
    // };

    // const handleChildMenuChange = (e) => {
    //     setSelectedChildMenu(e.target.value);
    // };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/liquorBrand/barSubmenu/all"
                );
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);


    useEffect(() => {
        const fetchChildMenuNames = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/liquorBrand/childmenus/list`
                );

                console.log(response.data)
                setProducts(response.data);

            } catch (error) {
                console.error("Error fetching child menu names:", error);
            }
        };

        fetchChildMenuNames();
    }, []);




    useEffect(() => {
        const fetchGSTList = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/purchaseVAT/vat");
                setVats(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching Products:", error);
            }
        };
        fetchGSTList();
    }, []);



    useEffect(() => {
        const fetchUnitList = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/unit/units"
                );
                setUnits(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching Products:", error);
            }
        };

        fetchUnitList();
    }, []);



    useEffect(() => {
        const subtotal = Object.values(itemTotals).reduce(
            (total, itemTotal) => total + (itemTotal || 0),
            0
        );
        const discountAmount = parseFloat(discount) || 0;
        const calculatedGrandTotal = subtotal - discountAmount;

        setGrandTotal(calculatedGrandTotal.toFixed(2));
    }, [itemTotals, discount]);




    useEffect(() => {
        const fetchStockQty = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/barPurchase/purchase/childMenuStockQty?name=${formData.name}`
                );
                console.log("stock Quantity", response.data.stockQtyMl);
                setStockQty(response.data.stockQty);
                setStockQtyMl(response.data.stockQtyMl);
            } catch (error) {
                console.error("Error fetching stock quantity:", error);
            }
        };

        if (formData.name) {
            fetchStockQty();
        }
    }, [formData.name]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "discount") {
            setDiscount(value);
            const newDiscount = parseFloat(value || 0);
            const newBalance = Math.round(parseFloat(calculateGrandTotal()) - newDiscount - parseFloat(formData.paidAmount || 0)).toFixed(2);
            setBalance(newBalance);
        } else if (name === "paidAmount") {
            const newPaidAmount = parseFloat(value || 0);
            const newBalance = Math.round(parseFloat(calculateGrandTotal()) - parseFloat(discount) - newPaidAmount).toFixed(2);
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value !== undefined ? value : "",
            }));
            setBalance(newBalance);
        } else if (name === "handleAmount" || name === "frightAmount") {
            const newValue = parseFloat(value || 0);
            const newGrandTotal = calculateGrandTotal() + newValue;
            const newBalance = Math.round(newGrandTotal - parseFloat(formData.paidAmount || 0)).toFixed(2);
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value !== undefined ? value : 0,
            }));
            setGrandTotal(newGrandTotal.toFixed(2));
            setBalance(newBalance);
        } else if (name === "vat") {
            // Update VAT amount for the current item
            const selectedProduct = products.find((product) => product.name === formData.name);
            const vatPercentage = parseFloat(value);

            if (selectedProduct && !isNaN(vatPercentage)) {
                const vatAmount =
                    (parseFloat(formData.quantity) *
                        parseFloat(formData.pricePerQty) *
                        vatPercentage) /
                    100;
                setCurrentItemVat(vatAmount);
            } else {
                setCurrentItemVat(0);
            }

            setFormData((prevFormData) => ({
                ...prevFormData,
                vat: value !== undefined ? value : 0,
            }));
        } else {
            // For other fields, update formData while keeping the rest intact
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
        console.log("Updated name:", formData);
    };





    // useEffect(() => {
    //     const newItemTotal = calculateItemTotal(formData);
    //     setItemTotals((prevItemTotals) => ({
    //         ...prevItemTotals,
    //         [formData.name]: newItemTotal,
    //     }));
    // }, [formData, discount]);

    useEffect(() => {
        // Calculate item total when there's a change in quantity, price, or VAT
        const newItemTotal = calculateItemTotal(formData);
        setItemTotals((prevItemTotals) => ({
            ...prevItemTotals,
            [formData.name]: newItemTotal,
        }));
    }, [formData.quantity, formData.pricePerQty, formData.vat]);




    const handleAddItem = () => {
        // Check if the GST percentage is 0
        if (parseFloat(formData.vat) === 0) {
            // GST is 0, proceed to add the item without checking other required fields
            const newItem = createNewItem({
                ...formData,
                vat: 0, // Set GST to 0
                vatAmount: 0, // Set GST amount to 0
            });

            if (items.some((item) => item.name === newItem.name)) {
                setErrorMessage(
                    "Item already added in the list. Please choose a different item."
                );
                setShowErrorModal(true);
                return;
            }

            // Update state
            setItems((prevItems) => [...prevItems, newItem]);
            setFormData({
                date: formData.date,
                dueDate: formData.dueDate,
                tpDate: formData.tpDate,
                billNo: formData.billNo,
                tpNo: formData.tpNo,
                vendor: formData.vendor,
                name: formData.name,
                quantity: parseFloat(formData.quantity),
                unit: "",
                pricePerQty: "",
                // bottlePrice: "",
                vat: "", // Reset GST in the form
                vatAmount: "", // Reset GST amount in the form
                paidAmount: "",
                handleAmount: "",
                frightAmount: "",
            });
            setLastItemIndex((prevLastItemIndex) => prevLastItemIndex + 1);
        } else {
            if (
                !formData.billNo ||
                !formData.tpNo ||
                !formData.date ||
                !formData.dueDate ||
                !formData.tpDate ||
                !formData.vendor ||
                !formData.name ||
                !formData.quantity ||
                !formData.unit ||
                !formData.pricePerQty ||
                // !formData.bottlePrice ||
                !formData.vat
            ) {
                console.error("Please fill in all required fields.");
                return;
            }

            // Calculate GST amount for the current item
            const vatPercentage = parseFloat(formData.vat);
            const vatAmount =
                (parseFloat(formData.quantity) *
                    parseFloat(formData.pricePerQty) *
                    vatPercentage) /
                100;

            // Create a new item object
            const newItem = createNewItem({
                ...formData,
                vat: vatPercentage, // Use GST as GST percentage
                vatAmount: vatAmount.toFixed(2), // Store GST amount in the item
            });

            if (items.some((item) => item.name === newItem.name)) {
                console.error(
                    "Item already added in the list. Please choose a different item."
                );
                return;
            }

            // Update state
            setItems((prevItems) => [...prevItems, newItem]);
            setFormData({
                date: formData.date,
                dueDate: formData.dueDate,
                tpDate: formData.tpDate,
                billNo: formData.billNo,
                tpNo: formData.tpNo,
                vendor: formData.vendor,
                name: formData.name,
                quantity: parseFloat(formData.quantity),
                unit: "",
                pricePerQty: "",
                // bottlePrice: "",
                vat: "", // Reset GST in the form
                vatAmount: "", // Reset GST amount in the form
                paidAmount: "",
                handleAmount: "",
                frightAmount: "",
                stockQty: "",
            });
            setLastItemIndex((prevLastItemIndex) => prevLastItemIndex + 1);
        }
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
        setErrorMessage("");
    };


    // Helper function to create a new item object
    const createNewItem = (formData) => ({
        billNo: formData.billNo,
        tpNo: formData.tpNo,
        date: formData.date,
        dueDate: formData.dueDate,
        tpDate: formData.tpDate,
        vendor: formData.vendor,
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        pricePerQty: formData.pricePerQty,
        // bottlePrice: formData.bottlePrice,
        vat: formData.vat,
        vatAmount: formData.vatAmount,
        barCategory: formData.barCategory
    });

    const handleSave = async () => {
        try {
            // Calculate the GST amount based on the individual items
            const calculatedVat = parseFloat(vat).toFixed(2); // Use calculated GST
            const calculatedSubtotal = parseFloat(
                Object.values(itemTotals)
                    .reduce((total, itemTotal) => total + (itemTotal || 0), 0)
                    .toFixed(2)
            );
            const grandTotal = calculateGrandTotal();
            const calculatedBalance = grandTotal - parseFloat(formData.paidAmount || 0) - parseFloat(discount || 0);


            const formattedItems = items.map((item) => {
                const barCategory = sortedProducts.find(product => product.name === item.name)?.barCategory || '';
                return {
                    name: item.name,
                    quantity: parseFloat(item.quantity),
                    unit: item.unit,
                    pricePerQty: parseFloat(item.pricePerQty),
                    vatAmount: item.vatAmount,
                    barCategory: barCategory
                };
            });



            const data = {
                date: formData.date || "",
                dueDate: formData.dueDate || "",
                tpDate: formData.tpDate || "",
                billNo: formData.billNo || "",
                tpNo: formData.tpNo || "",
                vendor: formData.vendor || "",
                name: formData.name || "",
                quantity: parseFloat(formData.quantity) || "",
                subtotal: isNaN(calculatedSubtotal) ? 0 : calculatedSubtotal,
                vat: isNaN(calculatedVat) ? 0 : calculatedVat,
                vatAmount: parseFloat(currentItemVat).toFixed(2), // Use currentItemGst
                paidAmount: parseFloat(formData.paidAmount || 0).toFixed(2),
                discount: parseFloat(discount || 0).toFixed(2),
                barCategory: formData.barCategory,
                handleAmount: parseFloat(formData.handleAmount || 0).toFixed(2),
                frightAmount: parseFloat(formData.frightAmount || 0).toFixed(2),
                items: formattedItems,
                grandTotal: grandTotal.toFixed(2), // Use the calculated grand total
                balance: calculatedBalance.toFixed(2), // Use the calculated balance // Include balance in the data
            };

            // Log the data to be saved
            console.log("Data to be saved:", data);

            // Make a POST request to save the bill
            const response = await axios.post(
                "http://localhost:5000/api/barPurchase/bar/purchase/savebill",
                data
            );

            // Log the response after saving
            console.log("Bill saved successfully:", response.data);

            const vendorName = response.data.vendorName; // Assuming the response contains the supplier ID

            if (parseFloat(data.total) > 0) {
                // If there is a paid amount, update the supplier's debit balance
                await axios.post("http://localhost:5000/api/supplier/supplier/debit", {
                    vendorName,
                    amount: parseFloat(data.paidAmount),
                });
            } else {
                // If there is no paid amount, update the supplier's credit balance
                await axios.post("http://localhost:5000/api/supplier/supplier/credit", {
                    vendorName,
                    amount: parseFloat(data.balance),
                });
            }
            // Reset the form and item list after saving
            setFormData({
                billNo: "",
                tpNo: "",
                // date: "",
                // dueDate: "",
                // tpDate: "",
                vendor: "",
                name: "",
                quantity: "",
                unit: "",
                pricePerQty: "",
                // bottlePrice: "",
                vat: "",
                vatAmount: "",
                stockQty: "",
                paidAmount: "",
                grandTotal: "",
                handleAmount: "",
                frightAmount: "",
            });
            setItems([]);
            setItemTotals({});
            setVat(0); // Reset the GST amount
            setCurrentItemVat(0); // Reset currentItemGst

            // Show success popup
            setShowSuccessPopup(true);
            // Hide duplicate popup if it was shown before
            setShowDuplicatePopup(false);

            // Automatically close success popup after 3 seconds (adjust duration as needed)
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 3000);
        } catch (error) {
            console.error(
                "Error saving the bill:",
                error.response ? error.response.data : error.message
            );

            // Show duplicate popup if duplicate bill number error occurs
            if (error.response && error.response.status === 400) {
                setShowDuplicatePopup(true);

                // Automatically close duplicate popup after 3 seconds (adjust duration as needed)
                setTimeout(() => {
                    setShowDuplicatePopup(false);
                }, 3000);
            }
            // Hide success popup if it was shown before
            setShowSuccessPopup(false);
        }
    };

    useEffect(() => {
        if (lastItemIndex !== -1) {
            // Initialize itemTotals with empty objects for each item in items array
            const initialItemTotals = items.reduce((totals, item) => {
                totals[item.name] = calculateItemTotal(item);
                return totals;
            }, {});
            setItemTotals(initialItemTotals);
            setLastItemIndex(-1); // Reset lastItemIndex
        }
    }, [items, lastItemIndex]);

    const [balance, setBalance] = useState(calculateGrandTotal().toFixed(2));


    return (
        <>
            <Navbar />

            <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow-md font-sans mt-8">
                <h2 className="text-xl text-orange-500 font-semibold mb-3">Bar-Purchase Form</h2>

                {/* Add Item Form */}
                <div className="mb-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {/* Date Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="mt-1 p-1 w-full border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className="mt-1 p-1 w-full border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                T.P. Date
                            </label>
                            <input
                                type="date"
                                name="tpDate"
                                value={formData.tpDate}
                                onChange={handleInputChange}
                                className="mt-1 p-1 w-full border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Bill Number
                            </label>
                            <input
                                type="text"
                                name="billNo"
                                value={formData.billNo}
                                onChange={handleInputChange}
                                className="mt-1 p-1 w-full border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                TP Number
                            </label>
                            <input
                                type="text"
                                name="tpNo"
                                value={formData.tpNo}
                                onChange={handleInputChange}
                                className="mt-1 p-1 w-full border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <button
                                onClick={() => setIsNewVendorModalOpen(true)}
                                className="text-red-700  align-middle bg-red-200 rounded-full px-1 float-right font-bold "
                            >
                                <FontAwesomeIcon icon={faPlus} className="" />
                            </button>
                            <label className="block text-sm font-medium text-gray-600">
                                Vendor Name
                            </label>
                            <select
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleInputChange}
                                className=" p-1 w-full border rounded-md text-sm"
                                required
                            >
                                <option value="" disabled>
                                    Select Vendor
                                </option>
                                {vendors.map((vendor) => (
                                    <option key={vendor._id} value={vendor.vendorName}>
                                        {vendor.vendorName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            {showSuccessPopup && (
                                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-green-100 border border-green-400 rounded shadow-md z-10">
                                    <p className="text-green-700">Bill saved successfully!</p>
                                </div>
                            )}

                            {showDuplicatePopup && (
                                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-red-100 border border-red-400 rounded shadow-md z-10">
                                    <p className="text-red-700">
                                        Duplicate bill number found for the same Vendor ! Try another Bill Number.

                                    </p>
                                </div>
                            )}

                            <label className="block text-sm font-medium text-gray-600">
                                Product Name
                            </label>
                            <select
                                name='name'
                                id="category"
                                onChange={handleInputChange}
                                value={formData.name}
                                className=" p-1 w-full border rounded-md text-sm"
                            >
                                <option value="">Select Product</option>
                                {sortedProducts
                                    .filter(category => {
                                        // Assuming pricePer is an object, check all its properties
                                        return Object.values(category.pricePer).some(price => price > 1);
                                    })
                                    .map((category, index) => (
                                        <option key={index} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                            </select>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Bottle Size
                            </label>
                            <input
                                type="text"
                                value={sortedProducts.find(product => product.name === formData.name)?.barCategory || ''}
                                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-200"
                                readOnly
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Stock Quantity
                            </label>
                            <input
                                type="text"
                                value={stockQty}
                                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                                readOnly
                            />
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Left Stock Qty (Nos)
                            </label>
                            <input
                                type="text"
                                // value={stockQty}
                                // value={formData.name ? ((parseFloat(stockQty) * parseInt(sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '')) || 0) + ' / ' + sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '')) : ''}

                                // value={formData.name ? (parseFloat(stockQtyMl) / parseInt(sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '') || 1)) : ''}

                                // run well
                                // value={formData.name ? `${parseInt(stockQtyMl / parseInt(sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '') || 1))} + ${stockQtyMl % parseInt(sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '') || 1)} ml` : ''}

                                value={formData.name ? `${parseInt(stockQtyMl / parseInt(sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '') || 1))}${stockQtyMl % parseInt(sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '') || 1) > 0 ? ` + ${stockQtyMl % parseInt(sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '') || 1)} ml` : ''}` : ''}

                                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-200"
                                readOnly
                            />

                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Left Stock Qty (ML)
                            </label>
                            <input
                                type="text"
                                // value={(parseFloat(stockQty) * parseInt(sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '')) || 0)}
                                value={stockQtyMl}
                                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-200"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Desired Stock Qty (ML)
                            </label>
                            <input
                                type="text"
                                value={(parseFloat(formData.quantity) * parseInt(sortedProducts.find(product => product.name === formData.name)?.barCategory.replace('ml', '')) || 0)}
                                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-200"
                                readOnly
                            />
                        </div>




                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Desired Qty (Nos)
                            </label>
                            <input
                                type="Number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="mt-1 p-1 w-full border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Unit Name
                                <button
                                    onClick={() => setIsNewUnitModalOpen(true)}
                                    className="text-red-700 align-middle bg-red-200 rounded-full px-1 float-right font-bold "
                                >
                                    <FontAwesomeIcon icon={faPlus} className="" />
                                </button>
                            </label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleInputChange}
                                className="mt-1 p-1 w-full border rounded-md text-sm"
                                required
                            >
                                <option value="" disabled>
                                    Select Unit
                                </option>
                                {units.map((unit) => (
                                    <option key={unit._id} value={unit.unit}>
                                        {unit.unit}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Price Per Unit
                            </label>
                            <input
                                type="text"
                                name="pricePerQty"
                                value={formData.pricePerQty}
                                onChange={handleInputChange}
                                className="mt-1 p-1 w-full border rounded-md text-sm"
                                required
                            />
                        </div>
                        <div>
                            VAT
                            <button
                                onClick={() => setIsVatModalOpen(true)}
                                className="text-red-700 align-middle bg-red-200 rounded-full px-1 float-right font-bold "
                            >
                                <FontAwesomeIcon icon={faPlus} className="" />
                            </button>
                            <select
                                name="vat"
                                value={formData.vat}
                                onChange={handleInputChange}
                                className="mt-1 p-1 w-full border rounded-md text-sm"
                                required
                            >
                                <option value="" disabled>
                                    Select VAT
                                </option>
                                {vats.map((vat) => (
                                    <option key={vat._id} value={vat.vatPercentage}>
                                        {vat.vatPercentage}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                VAT Amount
                            </label>
                            <input
                                type="text"
                                value={currentItemVat.toFixed(2)}
                                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-200"
                                readOnly
                            />

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Total for {formData.name}
                            </label>
                            <input
                                type="text"
                                value={
                                    itemTotals[formData.name]
                                        ? itemTotals[formData.name].toFixed(2)
                                        : "0.00"
                                }
                                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                                readOnly
                            />
                        </div>

                    </div>

                    <div className="flex justify-between mt-2">
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
                        >
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Display Added Items */}
                <div className=" mx-auto lg:p-8 lg:-mt-8 md:p-8 p-0 font-sans lg:flex ">
                    <div className=" overflow-x-auto flex-col flex overflow-y-auto h-auto">
                        <table className="w-full">
                            <thead className="text-sm bg-zinc-100 text-yellow-600 border">
                                <tr>
                                    <th className="p-3 text-left text-gray lg:pl-4 pl-4  whitespace-nowrap">
                                        Sr No.
                                    </th>
                                    <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">
                                        Item Name
                                    </th>
                                    <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">
                                        Quantity
                                    </th>
                                    <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">
                                        Unit
                                    </th>
                                    <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">
                                        Price Per Qty
                                    </th>
                                    <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">
                                        VAT
                                    </th>
                                    <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">
                                        Total
                                    </th>
                                    <th className="p-3 text-center whitespace-nowrap">Actions</th>
                                    {/* New column for total */}
                                    {/* Add more columns for other item details */}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-1 text-left text-gray lg:pl-4 pl-4">
                                            {index + 1}
                                        </td>
                                        <td className="p-1 text-left text-gray lg:pl-4 pl-4 w-20">
                                            {item.name}
                                        </td>
                                        <td className="p-1 text-left text-gray lg:pl-4 pl-4">
                                            {item.quantity}
                                        </td>
                                        <td className="p-1 text-left text-gray lg:pl-4 pl-4">
                                            {item.unit}
                                        </td>
                                        <td className="p-1 text-left text-gray lg:pl-4 pl-4">
                                            {item.pricePerQty}
                                        </td>
                                        <td className="p-1 text-left text-gray lg:pl-4 pl-4">
                                            {item.vat}
                                        </td>
                                        <td className="p-1 text-left text-gray lg:pl-4 pl-4">
                                            {calculateItemTotal(item).toFixed(2)}
                                        </td>
                                        <td className="p-1 text-center">
                                            <button
                                                onClick={() => handleEditItem(index)}
                                                className="text-gray-600 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md"
                                                style={{ background: "#ffff" }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPenToSquare}
                                                    color="orange"
                                                    className="cursor-pointer"
                                                />{" "}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteClick(index)}
                                                className="text-gray-600 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md"
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
                                {itemToDeleteIndex !== null && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                        <div className="bg-white p-6 rounded shadow-lg">
                                            <p>Are you sure you want to delete?</p>
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    onClick={handleConfirmDelete}
                                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={handleCancelDelete}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </tbody>
                        </table>
                    </div>


                    <div className="flex-1 lg:ml-24 mt-28 lg:mt-0 md:mt-24">
                        <div className="flex container">
                            {/* SubTotal */}
                            <div className="flex-1 mr-2">
                                <label className="block text-sm font-medium text-gray-600">
                                    Handling Charges
                                </label>
                                <input
                                    type="text"
                                    name="handleAmount"
                                    value={formData.handleAmount}
                                    onChange={handleInputChange}
                                    className="mt-1 p-1 w-full border rounded-md text-sm"
                                />
                            </div>
                            <div className=" flex-1 mr-2">
                                <label className="block text-sm font-medium text-gray-600">
                                    Fright Charges
                                </label>
                                <input
                                    type="text"
                                    name="frightAmount"
                                    value={formData.frightAmount}
                                    onChange={handleInputChange}
                                    className="mt-1 p-1 w-full border rounded-md text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex container">

                            {/* SubTotal */}
                            <div className="flex-1 mr-2">
                                <label className="block text-sm font-medium text-gray-600">
                                    SubTotal
                                </label>
                                <input
                                    type="text"
                                    value={Object.values(itemTotals)
                                        .reduce((total, itemTotal) => total + (itemTotal || 0), 0)
                                        .toFixed(2)}
                                    className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                                    readOnly
                                />
                            </div>
                            <div className=" flex-1 mr-2 ">
                                <label className="block text-sm font-medium text-gray-600">
                                    Grand Total
                                </label>
                                <input
                                    type="text"
                                    value={Math.round(calculateGrandTotal())}
                                    className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="flex container">
                            {/* Discount */}
                            <div className="flex-1   mr-2 ">
                                <label className="block text-sm font-medium text-gray-600">
                                    Discount
                                </label>
                                <input
                                    type="text"
                                    name="discount"
                                    value={discount}
                                    onChange={handleInputChange}
                                    className="mt-1 p-1 w-full border rounded-md text-sm"
                                />
                            </div>


                            <div className="flex-1 mr-2">
                                <label className="block text-sm font-medium text-gray-600">
                                    Balance
                                </label>
                                <input
                                    type="text"
                                    value={Math.round(
                                        parseFloat(calculateGrandTotal()) -
                                        parseFloat(discount || 0) -
                                        parseFloat(formData.paidAmount || 0)
                                    ).toFixed(2)}
                                    className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                                    readOnly
                                />
                            </div>

                        </div>

                        {/* Balance */}
                        <div className="flex container">
                            <div className=" flex-1 mr-2">
                                <label className="block text-sm font-medium text-gray-600">
                                    Paid Amount
                                </label>
                                <input
                                    type="text"
                                    name="paidAmount"
                                    value={formData.paidAmount}
                                    onChange={handleInputChange}
                                    className="mt-1 p-1 w-full border rounded-md text-sm"
                                />
                            </div>
                        </div>

                        {/* Save and Print Button */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleSave}
                                className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-1 px-4 rounded-full mt-4  mx-auto"
                            >
                                Save Bill
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showErrorModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto top-36">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        {/* Modal content */}
                        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        {/* Icon or any visual indication */}
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Not Allowed
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">{errorMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleCloseErrorModal}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {isNewUnitModalOpen && (
                <div
                    className="font-sans fixed inset-0 flex items-center justify-center z-50 m-1"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <NewUnitModal
                        isOpen={isNewUnitModalOpen}
                        onClose={() => setIsNewUnitModalOpen(false)}
                    />
                </div>
            )}

            {isVatModalOpen && (
                <div
                    className="font-sans fixed inset-0 flex items-center justify-center z-50 m-1"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <VatModal
                        isOpen={isVatModalOpen}
                        onClose={() => setIsVatModalOpen(false)}
                    />
                </div>
            )}
            {isNewVendorModalOpen && (
                <div
                    className="font-sans fixed inset-0 flex items-center justify-center z-50 m-1 bg-black"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <NewVendorModal
                        isOpen={isNewVendorModalOpen}
                        onClose={() => setIsNewVendorModalOpen(false)}
                    />
                </div>
            )}
        </>
    );
};

export default BarPurchaseForm
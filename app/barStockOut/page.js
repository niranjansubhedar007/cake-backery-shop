"use client";

// components/StockOutwardForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Unit from "../unit/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faTimes,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Modal from "react-modal";
import ItemPage from "../itemForm/page";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";

const BarStockOut = () => {
  const [waiterName, setWaiterName] = useState("");
  const [productName, setProductName] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [waitersList, setWaitersList] = useState([]);
  const [stockOutwardList, setStockOutwardList] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [insufficientStockPopup, setInsufficientStockPopup] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [productsWithSubmenus, setProductsWithSubmenus] = useState([]);
  const [parentMenuId, setParentMenuId] = useState("");

  const router = useRouter();

  useEffect(() => {
      const authToken = localStorage.getItem("EmployeeAuthToken");
      if (!authToken) {
          router.push("/login");
      }
  }, []);

  const openInsufficientStockPopup = () => {
      setInsufficientStockPopup(true);
      setTimeout(() => {
          setInsufficientStockPopup(false);
      }, 2000);
  };

  const closeInsufficientStockPopup = () => {
      setInsufficientStockPopup(false);
  };

  const fetchProductNames = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/liquorBrand/barSubmenu/list");
          setProductsWithSubmenus(response.data);
      } catch (error) {
          console.error("Error fetching product names:", error.response ? error.response.data : error.message);
      }
  };

  const fetchStockOutwardList = async () => {
      // Add code to fetch stock outward list if needed
  };

  const fetchWaitersList = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/waiter");
          setWaitersList(response.data);
      } catch (error) {
          console.error("Error fetching waiters list:", error.response ? error.response.data : error.message);
      }
  };

  useEffect(() => {
      fetchStockOutwardList();
      fetchWaitersList();
      fetchProductNames();
  }, []);

  const handleInputChange = async (e) => {
      const { name, value } = e.target;
      try {
          if (name === "waiterName") {
              setWaiterName(value);
              const response = await axios.get(`http://localhost:5000/api/waiter/waiter/mobile?name=${value}`);
              setMobileNumber(response.data.mobileNumber);
          } else if (name === "productName") {
              setProductName(value);
              // Fetch and update available quantity based on the selected product name
              const response = await axios.get(`http://localhost:5000/api/barStockOut/purchase/childMenuStockQty?name=${value}`);
              setAvailableQuantity(response.data.stockQty || 0);
              setUnit(response.data.unit || "");
              // Fetch parentMenuId based on the selected product name
              const parentMenuResponse = await axios.get(`http://localhost:5000/api/barStockOut/getParentMenuId?productName=${value}`);
              setParentMenuId(parentMenuResponse.data.parentMenuId);
          } else if (name === "stockQty") {
              setStockQty(Number(value)); // Ensure stockQty is a number
          }
      } catch (error) {
          console.error("Error:", error.response ? error.response.data : error.message);
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const requiredQuantity = Number(stockQty);

          if (requiredQuantity > availableQuantity) {
              openInsufficientStockPopup();
              return;
          }

          // Calculate the new available quantity after stock is taken out
          const newAvailableQuantity = availableQuantity - requiredQuantity;

          // Make API call to add items to stock outward entries
          const responseAddItems = await axios.post("http://localhost:5000/api/barStockOut/stockOut/addItems", {
              waiterName,
              productName,
              stockQty: requiredQuantity,
              availableQuantity,
          });

          console.log(responseAddItems.data);

          // Make API call to update stock quantity
          const response = await axios.post("http://localhost:5000/api/barStockOut/barStockOut", {
              parentMenuId, // Use parentMenuId dynamically fetched
              requiredQuantity,
          });

          console.log(response.data);

          await fetchStockOutwardList();

          // Clear the form fields
          setWaiterName("");
          setProductName("");
          setStockQty("");
          setAvailableQuantity(newAvailableQuantity); // Update the state with new available quantity
      } catch (error) {
          console.error("Error adding items to stock outward entries:", error.message);
      }
  };

  return (
      <>
          <Navbar />
          <div className="max-w-5xl mx-auto bg-white p-2 rounded shadow-md font-sans mt-12">
              <h2 className="text-xl font-semibold mb-3 text-orange-500">
                  Stock Outward Form
              </h2>

              {insufficientStockPopup && (
                  <div className="fixed inset-0 flex items-center justify-center">
                      <div className="bg-white border border-red-500 rounded p-7 shadow-md z-50 absolute">
                          <p className="text-red-500 font-semibold text-center text-xl">
                              Insufficient stock quantity!
                          </p>
                      </div>
                  </div>
              )}

              <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-600">
                              Waiter Name
                          </label>
                          <select
                              name="waiterName"
                              value={waiterName}
                              onChange={handleInputChange}
                              className="mt-1 p-1 w-full border rounded-md text-sm"
                              required
                          >
                              <option value="" disabled>
                                  Select Waiter
                              </option>
                              {waitersList.map((waiter) => (
                                  <option key={waiter._id} value={waiter.waiterName}>
                                      {waiter.waiterName}
                                  </option>
                              ))}
                          </select>
                      </div>

                      <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-600">
                              Mobile Number
                          </label>
                          <input
                              type="text"
                              name="mobileNumber"
                              value={mobileNumber}
                              className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                              readOnly
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-600">
                              <div className="relative">
                                  <button
                                      onClick={() => setIsNewModalOpen(true)}
                                      className="text-red-700 align-middle bg-red-200 rounded-full px-1 float-right font-bold "
                                  >
                                      <FontAwesomeIcon icon={faPlus} className="" />
                                  </button>
                              </div>
                              Product Name
                          </label>
                          <select
                              name="productName"
                              value={productName}
                              onChange={handleInputChange}
                              className="mt-1 p-1 w-full border rounded-md text-sm"
                              required
                          >
                              <option value="" disabled>
                                  Select Product
                              </option>

                              {productsWithSubmenus.map((product) => (
                                  <React.Fragment key={product._id}>
                                      <option value={product.name}>{product.name}</option>
                                      {product.childMenus.map((submenu) => (
                                          <option key={submenu._id} value={submenu.name}>
                                              {submenu.name}
                                          </option>
                                      ))}
                                  </React.Fragment>
                              ))}
                          </select>
                      </div>

                      <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-600">
                              Required Quantity
                          </label>
                          <input
                              type="number"
                              name="stockQty"
                              value={stockQty}
                              onChange={handleInputChange}
                              className="mt-1 p-1 w-full border rounded-md text-sm"
                              required
                              min={0}
                          />
                      </div>

                      <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-600">
                              Available Quantity
                          </label>
                          <input
                              type="text"
                              name="availableQuantity"
                              value={`${availableQuantity} ${unit}`}
                              className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                              readOnly
                          />
                      </div>
                  </div>

                  <div className="flex justify-center">
                      <button
                          type="submit"
                          className="bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
                      >
                          Add Item
                      </button>
                  </div>
              </form>
              <div className="max-h-80 custom-scrollbars overflow-y-auto mt-4">
                    <table className="w-full border-collapse">
                        <thead className="text-sm bg-zinc-100 text-yellow-600 border">
                            <tr className="bg-gray-200">
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">SR No.</th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Waiter Name</th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Product Name</th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Stock Taken</th>
                                <th className="p-1 whitespace-nowrap text-center text-gray lg:pl-6 pl-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockOutwardList.map((entry, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 text-sm">{index + 1}</td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 text-sm">{entry.waiterName}</td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 text-sm">{entry.productName}</td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 text-sm">{entry.stockQty}</td>
                                    <td className="p-1 whitespace-nowrap text-center text-gray lg:pl-6 text-sm">{new Date(entry.date).toLocaleString("en-GB", {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        second: "numeric",
                                        hour12: true,
                                    })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
      </>
  );
};

export default BarStockOut;
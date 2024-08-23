"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PaymentModal from "../payment/page";
import Try from "../test/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faCircleMinus,
  faTimes,
  faTableColumns,
  faBell,
  faObjectUngroup,
  faHouse,
  faObjectGroup,
} from "@fortawesome/free-solid-svg-icons";

const Billing = ({ tableId, acPercentage }) => {
  const [categories, setCategories] = useState([]);
  const [barCategories, setBarCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [menus, setMenus] = useState([]);
  const [barMenus, setBarMenus] = useState([]);
  const [itemCount, setItemCount] = useState(0); // State for item count

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBarCategory, setSelectedBarCategory] = useState(null);

  const [selectedBarMenuItem, setSelectedBarMenuItem] = useState(null);
  const [selectedBrandMenuItem, setSelectedBrandMenuItem] = useState(null);
  const [showBarMenus, setShowBarMenus] = useState(true);
  const [showBrandMenus, setShowBrandMenus] = useState(true);
  const [showBrandCategoryMenus, setShowBrandCategoryMenus] = useState(true);

  const [currentOrder, setCurrentOrder] = useState([]);
  const [tableInfo, setTableInfo] = useState(null); // New state for table information
  const [hotelInfo, setHotelInfo] = useState(null); // New state for hotel information
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef(null); // Create a ref for the search input element
  const menuItemRefs = useRef([]);
  const router = useRouter();
  const [isACEnabled, setIsACEnabled] = useState(true);
  const [isGSTEnabled, setIsGSTEnabled] = useState(true); // State for enabling/disabling GST
  const [isVATEnabled, setIsVATEnabled] = useState(true); // State for enabling/disabling GST
  const [selectedOrder, setSelectedOrder] = useState(null); // Add selectedOrder state
  const [tableNames, setTableNames] = useState({});
  const [orderNumber, setOrderNumber] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tastes, setTastes] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedTastes, setSelectedTastes] = useState({});
  const [newTastes, setNewTastes] = useState({});
  const [lastAllOrders, setLastAllOrders] = useState([]);
  const [isCloseTablesModalOpen, setIsCloseTablesModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMenuNames, setSelectedMenuNames] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [sections, setSections] = useState([]); // Add state for sections
  const [sectionId, setSectionId] = useState(""); // Add state to track the selected section for creating tables
  const [sectionName, setSectionName] = useState(""); // Add state to track the selected section for creating tables
  const [destinationTableId, setDestinationTableId] = useState("");
  const [sourceTableId, setSourceTableId] = useState("");
  const [mainTableName, setMainTableName] = useState("");
  const [numberOfSubtablesToShow, setNumberOfSubtablesToShow] = useState("");
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreTableName, setRestoreTableName] = useState("");
  const [items, setItems] = useState([]);
  const itemsToShow = showAll ? items : items.slice(0, 9);
  const [showCategoryMenus, setShowCategoryMenus] = useState(true);
  const [showBarCategoryMenus, setShowBarCategoryMenus] = useState(true);
  // const [showBrands, setShowBrands] = useState(true);
  const [waiterName, setWaiterName] = useState("");
  const [waitersList, setWaitersList] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedOptionForBar, setSelectedOptionForBar] = useState(null);

  const handleParentMenuSelect = (event) => {
    const selectedParentId = event.target.value;
    setSelectedParentId(selectedParentId);

    // Update state holding the selectedParentId
    setSelectedOptionForBar(selectedParentId);

    // Store selected parent menu ID in local storage
    localStorage.setItem("selectedParentId", selectedParentId);

    // Get the selected item
    const selectedValue = event.target.options[event.target.selectedIndex].text;

    // Store selected item in local storage
    localStorage.setItem("selectedItem", selectedValue);

    // Retrieve the existing array from local storage
    const existingItems =
      JSON.parse(localStorage.getItem("selectedItems")) || [];

    // Add the new selected item to the array
    const updatedItems = [...existingItems, selectedValue];

    // Store the updated array in local storage
    localStorage.setItem("selectedItems", JSON.stringify(updatedItems));
  };

  useEffect(() => {
    setSelectedOptionForBar(null);
  }, [selectedBarMenuItem, selectedBrandMenuItem]);

  const handleClickBarMenuItem = (product) => {
    setSelectedBarMenuItem(product);
    setShowBarMenus(false);
  };

  const handleClickBrandMenuItem = (product) => {
    // console.log(product);
    setSelectedBrandMenuItem(product);
    setShowBrandCategoryMenus(false);
    // setShowBarMenus(false);
    setShowBrandMenus(true);
    // setShowBrands(true)
  };

  const handleResetTable = async (sectionName, mainTableName) => {
    try {
      // Call the API to get the tableId for the mainTableName
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/bySection/${sectionName}/${mainTableName}`
      );
      // console.log(tableResponse);
      const mainTableId = tableResponse.data._id;

      // Check if mainTableId is obtained successfully
      if (!mainTableId) {
        console.error("Main table ID not found");
        return;
      }

      const sectionResponse = await axios.get(
        `http://localhost:5000/api/table/section/byName/${sectionName}`
      );
      // console.log(sectionResponse);
      const sectionId = sectionResponse.data.sectionId;

      // Check if sectionId is obtained successfully
      if (!sectionId) {
        console.error("Section ID not found");
        return;
      }

      // Call the reset-subtables endpoint with the retrieved mainTableId and sectionId
      const response = await axios.put(
        `http://localhost:5000/api/table/${sectionId}/${mainTableId}/reset-subtables`
      );

      if (response.status === 200) {
        // Handle success
        console.log(response.data.message);
        setIsRestoreModalOpen(false);
        setSectionName("");
        setMainTableName("");
      } else {
        // Handle errors
        console.error("Failed to reset subtables");
      }
    } catch (error) {
      console.error("Error resetting subtables:", error);
    }
  };

  const handleShowSubmit = async (
    sectionName,
    mainTableName,
    numberOfSubtablesToShow
  ) => {
    try {
      // Call the API to get the tableId for the mainTableName
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/bySection/${sectionName}/${mainTableName}`
      );
      console.log(tableResponse);
      const mainTableId = tableResponse.data._id;

      // Check if mainTableId is obtained successfully
      if (!mainTableId) {
        console.error("Main table ID not found");
        return;
      }

      const sectionResponse = await axios.get(
        `http://localhost:5000/api/table/section/byName/${sectionName}`
      );
      console.log(sectionResponse);
      const sectionId = sectionResponse.data.sectionId;

      // Check if sectionId is obtained successfully
      if (!sectionId) {
        console.error("Section ID not found");
        return;
      }

      // Call the show-subtables endpoint with the retrieved mainTableId and numberOfSubtablesToShow
      const response = await axios.put(
        `http://localhost:5000/api/table/${sectionId}/${mainTableId}/show-subtables`,
        {
          numberOfSubtablesToShow: parseInt(numberOfSubtablesToShow),
        }
      );

      if (response.status === 200) {
        // Handle success
        console.log(response.data.message);
        setIsShowModalOpen(false);
        setMainTableName("");
        setNumberOfSubtablesToShow("");
        setSectionName("");
      } else {
        // Handle errors
        console.error("Failed to update subtables");
      }
    } catch (error) {
      console.error("Error showing subtables:", error);
    }
  };

  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  const handleCancelKOT = async () => {
    try {
      // Extract the names of selected menu items
      console.log("Selected menu names to cancel:", selectedMenuNames);

      if (selectedMenuNames.length === 0) {
        console.log("No items selected to cancel.");
        return;
      }

      // Delete selected menus from KOT collection
      await axios.delete(`http://localhost:5000/api/kot/${tableId}`, {
        data: { canceledItemNames: selectedMenuNames },
      });

      // removeItemsFromLocalStorage(tableId);
      selectedMenuNames.forEach((itemName) => {
        removeItemFromLocalStorage(tableId, itemName);
      });

      // Filter out selected menus from current order
      const updatedOrder = currentOrder.filter(
        (orderItem) => !selectedMenuNames.includes(orderItem.name)
      );

      // Update the current order
      setCurrentOrder(updatedOrder);

      // Clear selected menu names
      setSelectedMenuNames([]);

      // Optionally, you can show a success message or perform other actions after cancellation

      // HTML code for printing canceled items
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Please allow pop-ups to print the canceled items.");
        return;
      }

      const canceledItemsContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
        <div>
          <title>Cancel KOT</title>
          <style>
            @page {
              margin: 2mm; /* Adjust the margin as needed */
            }
            /* Add your custom styles for KOT print here */
            body {
              font-family: Arial, sans-serif;
              margin:0;
              padding:0;
              margin-top:-2px;
         
            }
            .kot-header {
              text-align: center;
            }
         
            .kot-table {
              width: 100%;
              border-collapse: collapse;
            }
            .kot-table th, .kot-table td {
              border-top: 1px dotted black;
              border-bottom: 1px dotted black;
              border-left: 1px dotted black;
              border-right: 1px dotted black;
               text-align: left;
              padding: 3px;
            }
       
            .table-name{
              display:flex
           
             
            }
       
            .table-name {
              text-align: center;
           
            }
         
            .sections {
              display: flex;
              align-items: center;
            }
           
            .space {
              margin: 0 50px; /* Adjust the margin as needed */
            }
            .datetime-container{
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
             .datetime-container p{
            font-size:10px
            }
            .label{
              margin-top:-1rem
              font-size:12px
            }
            .table-name{
              margin: 0 2px;
            }
          </style>
        </head>
            <body>
                <div class="kot-header">
                    Cancel KOTs
                </div>

                <div class="sections">
                    <span class="table-name">
                        TABLE- ${
                          tableInfo ? tableInfo.tableName : "Table Not Found"
                        }
                    </span>
                    <span class="space"></span>
                </div>

                <div class="datetime-container">
                    <span class="label">Date:<span id="date" class="datetime"></span></span>
                    <span class="datetime-space"> </span>
                    <span class="label">Time:<span id="time" class="datetime"></span></span>
                </div>

                <div>
                    <span>Waiter: ${waiterName}</span>
                </div>

                <div class="kot-date-time" id="date-time"></div>

                <div class="kot-items">
                    <table class="kot-table">
                        <thead>
                            <tr>
                                <th> Sr</th>
                                <th>Items</th>
                                <th>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
    ${selectedMenuNames
      .map((itemName, index) => {
        // Find the corresponding item in currentOrder
        const selectedItem = currentOrder.find(
          (item) => item.name === itemName
        );

        // Display the quantity if the item is found, otherwise default to 1
        const quantity = selectedItem ? selectedItem.quantity : 1;

        return `
            <tr>
                <td>${index + 1}</td>
                <td class="kot-item-name">${itemName}</td>
                <td>${quantity}</td>
            </tr>
        `;
      })
      .join("")}
</tbody>
                    </table>
                </div>

                <script>
                    // Function to update KOT date
                    function updateKOTDate() {
                        const dateElement = document.getElementById('date');
                        const now = new Date();

                        // Check if the current hour is before 3 AM (hour 3 in 24-hour format)
                        if (now.getHours() < 3) {
                            // If before 3 AM, use the previous date
                            now.setDate(now.getDate() - 1);
                        }

                        // Format date as dd/mm/yyyy
                        const day = String(now.getDate()).padStart(2, '0');
                        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                        const year = now.getFullYear();
                        const formattedDate = day + '/' + month + '/' + year;

                        // Update the content of the element for KOT date
                        dateElement.textContent = formattedDate;

                        // Return the formatted date
                        return formattedDate;
                    }

                    // Function to update actual current time
                    function updateActualTime() {
                        const timeElement = document.getElementById('time');
                        const now = new Date();

                        // Format time as hh:mm:ss
                        const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
                        const formattedTime = now.toLocaleTimeString('en-US', options);

                        // Update the content of the element for actual time
                        timeElement.textContent = formattedTime;
                    }

                    // Function to update both KOT date and actual current time
                    function updateDateTime() {
                        const kotDate = updateKOTDate(); // Update KOT date
                        updateActualTime(); // Update actual current time

                        // Optionally, you can call this function every second to update time dynamically
                        setTimeout(updateDateTime, 1000);
                    }

                    // Call the function to update both KOT date and actual current time
                    updateDateTime();
                </script>
            </body>
            </html>
        `;

      // Write the content to the new window or iframe
      printWindow.document.write(canceledItemsContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
    } catch (error) {
      console.error("Error cancelling KOT:", error);
      // Optionally, you can show an error message or perform other error handling
    }
  };

  const removeItemFromLocalStorage = (tableId, itemName) => {
    const localStorageKey = `savedBills_${tableId}`;
    const savedBills = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // Find the bill with the matching tableId
    const billToUpdate = savedBills.find((bill) => bill.tableId === tableId);

    if (billToUpdate) {
      // Filter out the item with the matching name
      const updatedItems = billToUpdate.items.filter(
        (item) => item.name !== itemName
      );
      const updatedBill = { ...billToUpdate, items: updatedItems };

      // Update localStorage
      const updatedBills = savedBills.map((bill) => {
        if (bill.tableId === tableId) {
          return updatedBill;
        }
        return bill;
      });

      localStorage.setItem(localStorageKey, JSON.stringify(updatedBills));
    }
  };

  // ========taste fuctionality=======//
  useEffect(() => {
    const fetchTastes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/taste/tastes"
        );
        setTastes(response.data);
        // Set the selected option to the first taste in the list (change as needed)
        if (response.data.length > 0) {
          setSelectedOption(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching tastes:", error);
      }
    };

    fetchTastes();
  }, []);

  // taste and other slection valid code
  const handleSelectChange = (orderId, tasteId) => {
    setSelectedTastes((prevSelectedTastes) => ({
      ...prevSelectedTastes,
      [orderId]: tasteId,
    }));
  };

  const handleNewTasteChange = (orderId, newTaste) => {
    setNewTastes((prevNewTastes) => ({
      ...prevNewTastes,
      [orderId]: newTaste,
    }));
  };

  // console.log(modifiedCurrentOrder)
  const modifiedCurrentOrder = currentOrder.map((orderItem) => {
    const selectedTasteId = selectedTastes[orderItem._id];
    const selectedTaste =
      selectedTasteId === "other"
        ? { _id: "other", taste: newTastes[orderItem._id] || "" }
        : tastes.find((taste) => taste.taste === selectedTasteId) || {
            _id: null,
            taste: selectedTasteId,
          }; // Include selectedTasteId as taste if not "other" or not found in tastes

    return {
      ...orderItem,
      selectedTaste,
    };
  });

  const openCloseTablesModal = () => {
    setIsCloseTablesModalOpen(true);
  };

  const handleCloseTablesModal = () => {
    setIsCloseTablesModalOpen(false);
  };

  // waiter fuctionality
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWaiterName(value);
    // ... your existing code for handling other input changes
  };

  const fetchWaitersList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/waiter");
      setWaitersList(response.data);
    } catch (error) {
      console.error(
        "Error fetching waiters list:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchWaitersList();
  }, []);

  const handleConfirmCloseTables = () => {
    // Add logic to perform the closing of tables
    // For example, call an API endpoint or dispatch an action
    setIsCloseTablesModalOpen(false);
    router.push("/bill"); // Redirect to the bill page after confirming
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = lastAllOrders.filter((order) =>
    order.orderNumber.includes(searchQuery)
  );

  const [greetings, setGreetings] = useState([]);
  useEffect(() => {
    const fetchGreetings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/greet/greet"
        );
        setGreetings(response.data);
      } catch (error) {
        console.error("Error fetching greetings:", error);
      }
    };

    fetchGreetings();
  }, []);

  useEffect(() => {
    // Function to fetch the next order number from your backend
    const fetchNextOrderNumber = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/order/get-next-order-number"
        );
        const nextOrderNumber = response.data.nextOrderNumber;
        setOrderNumber(nextOrderNumber);
      } catch (error) {
        console.error("Error fetching next order number:", error);
      }
    };

    // Call the function when the component mounts
    fetchNextOrderNumber();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    fetchLastAllOrders();
  }, []);

  const fetchLastAllOrders = async () => {
    try {
      const ordersResponse = await axios.get(
        "http://localhost:5000/api/order/latest-orders"
      );
      const orders = ordersResponse.data;

      // Fetch table names for each order
      const tableNamesPromises = orders.map(async (order) => {
        const tableResponse = await axios.get(
          `http://localhost:5000/api/table/tables/${order.tableId}`
        );
        const tableName = tableResponse.data?.tableName || "";
        return { ...order, tableName };
      });

      const ordersWithTableNames = await Promise.all(tableNamesPromises);

      // Sort the orders by order date in descending order
      const sortedOrders = ordersWithTableNames.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setLastAllOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching latest orders:", error);
    }
  };

  const handleOrderClick = (order) => {
    if (order.orderNumber) {
      setSelectedOrder(order);
      setCurrentOrder(order.items || []);

      // Redirect to the edit page with the selected order ID
      const orderNumber = order.orderNumber;
      router.push(`/edit/${orderNumber}`);
    } else {
      console.error("Order Number is undefined");
      // Handle the error or provide feedback to the user
    }
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        // Redirect to the dashboard or any desired location
        router.push("/order");
      }
    },
    [router]
  );

  const handleSearchInputKeyDown = (event) => {
    if (event.key === "+") {
      event.preventDefault();
      // Set focus on the first menu item
      if (menuItemRefs.current.length > 0) {
        menuItemRefs.current[0].focus();
      }
    }
  };

  // Search filter
  const filterMenus = (menu) => {
    const searchTerm = searchInput.toLowerCase().trim();

    // If the search term is empty, show all menus
    if (searchTerm === "") {
      return true;
    }

    // Check if the search term is a number
    const searchTermIsNumber = !isNaN(searchTerm);

    // If the search term is a number, filter based on menu's uniqueId
    if (searchTermIsNumber) {
      return menu.uniqueId === searchTerm;
    }

    // Split the search term into words
    const searchLetters = searchTerm.split("");

    // Check if the first letters of both words match the beginning of words in the menu's name
    const firstAlphabetsMatch = searchLetters.every((letter, index) => {
      const words = menu.name.toLowerCase().split(" ");
      const firstAlphabets = words.map((word) => word[0]);
      return firstAlphabets[index] === letter;
    });

    // Check if the full search term is included in the menu's name
    const fullWordIncluded = menu.name.toLowerCase().includes(searchTerm);

    return firstAlphabetsMatch || fullWordIncluded;
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const saveBill = async () => {
    try {
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          console.log(foundItem);
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              stockQty: foundItem.stockQty,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock : ${stockDetails.stockQty} Bottles`
            );
            return; // Exit the function if stock is insufficient
          }
        }
      }

      const acPercentageAmount = isACEnabled
        ? calculateTotal().acPercentageAmount
        : 0;

      const itemsWithBarCategory = modifiedCurrentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = modifiedCurrentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      const orderData = {
        tableId,
        waiterName,
        items: modifiedCurrentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        itemsWithBarCategory: itemsWithBarCategory.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
        })),
        itemsWithoutBarCategory: itemsWithoutBarCategory.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
        })),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        VAT: calculateTotal().VAT, // Apply VAT for items with barCategory
        acPercentageAmount,
        acPercentage: acPercentage, // Include AC percentage
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0, // Include VAT percentage
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
      };

      if (
        orderData.itemsWithBarCategory.length === 0 &&
        orderData.itemsWithoutBarCategory.length === 0
      ) {
        console.warn("No items in the order. Not saving or printing KOT.");
        return;
      }

      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        const orderIdToUpdate = existingBill[0]._id;
        existingItems = existingBill[0].items;
        const updateResponse = await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
      } else {
        const createResponse = await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const newItemsWithBarCategory = orderData.itemsWithBarCategory.filter(
        (newItem) =>
          !existingItems.some(
            (existingItem) => existingItem.name === newItem.name
          )
      );
      const updatingItemsWithBarCategory = orderData.itemsWithBarCategory
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0);

      const uniqueItemsWithBarCategory = [
        ...newItemsWithBarCategory,
        ...updatingItemsWithBarCategory,
      ];
      const uniqueItemsWithBarCategorySet = new Set(
        uniqueItemsWithBarCategory.map((item) => item.name)
      );

      const newItemsWithoutBarCategory =
        orderData.itemsWithoutBarCategory.filter(
          (newItem) =>
            !existingItems.some(
              (existingItem) => existingItem.name === newItem.name
            )
        );
      const updatingItemsWithoutBarCategory = orderData.itemsWithoutBarCategory
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0);

      const uniqueItemsWithoutBarCategory = [
        ...newItemsWithoutBarCategory,
        ...updatingItemsWithoutBarCategory,
      ];
      const uniqueItemsWithoutBarCategorySet = new Set(
        uniqueItemsWithoutBarCategory.map((item) => item.name)
      );

      const kotData = {
        tableId,
        waiterName,
        items: modifiedCurrentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        itemsWithBarCategory: [...uniqueItemsWithBarCategorySet].map(
          (itemName, index) => {
            const orderItem = uniqueItemsWithBarCategory.find(
              (item) => item.name === itemName
            );
            const tasteInfo = modifiedCurrentOrder.find(
              (item) => item.name === itemName
            );
            return {
              name: orderItem.name,
              quantity: orderItem.quantity,
              price: orderItem.price
                ? orderItem.price
                : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
              taste:
                tasteInfo && tasteInfo.selectedTaste
                  ? tasteInfo.selectedTaste.taste
                  : "",
              barCategory: orderItem.barCategory ? orderItem.barCategory : null,
            };
          }
        ),
        itemsWithoutBarCategory: [...uniqueItemsWithoutBarCategorySet].map(
          (itemName, index) => {
            const orderItem = uniqueItemsWithoutBarCategory.find(
              (item) => item.name === itemName
            );
            const tasteInfo = modifiedCurrentOrder.find(
              (item) => item.name === itemName
            );
            return {
              name: orderItem.name,
              quantity: orderItem.quantity,
              price: orderItem.price
                ? orderItem.price
                : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
              taste:
                tasteInfo && tasteInfo.selectedTaste
                  ? tasteInfo.selectedTaste.taste
                  : "",
              barCategory: orderItem.barCategory ? orderItem.barCategory : null,
            };
          }
        ),
        orderNumber,
      };

      if (
        kotData.itemsWithBarCategory.length === 0 &&
        kotData.itemsWithoutBarCategory.length === 0
      ) {
        console.warn("No items in the KOT. Not saving or printing KOT.");
        return;
      }

      if (
        kotData.itemsWithBarCategory &&
        kotData.itemsWithBarCategory.length > 0
      ) {
        // Make an API call to save the BOT
        const BOTResponse = await axios.post(
          `http://localhost:5000/api/bot/botOrder/${tableId}`,
          kotData
        );

        console.log("BOTResponse:", BOTResponse);

        // Check if the BOT was successfully saved
        if (BOTResponse.status !== 200) {
          console.error("Failed to save BOT.");
          return;
        }
      }
      console.log("kotData:", kotData);

      // Make an API call to save the KOT
      const KOTResponse = await axios.post(
        `http://localhost:5000/api/kot/kotOrder/${tableId}`,
        kotData
      );

      console.log("KOTResponse:", KOTResponse);
      // Check if the KOT was successfully saved
      if (KOTResponse.status !== 200) {
        console.error("Failed to save KOT.");
        return;
      }

      const printBOT = (items, tableInfo, waiterName) => {
        const printWindow = window.open("", "_self");

        if (!printWindow) {
          alert("Please allow pop-ups to print the BOT.");
          return;
        }

        const botContent = generateOrderContent(
          items,
          tableInfo,
          waiterName,
          "BOT"
        );
        printWindow.document.write(botContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      };

      printBOT(kotData.itemsWithBarCategory, tableInfo, waiterName);

      const printKOT = (items, tableInfo, waiterName) => {
        const printWindow = window.open("", "_self");

        if (!printWindow) {
          alert("Please allow pop-ups to print the KOT.");
          return;
        }

        const kotContent = generateOrderContent(
          items,
          tableInfo,
          waiterName,
          "KOT"
        );
        printWindow.document.write(kotContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      };

      printKOT(kotData.itemsWithoutBarCategory, tableInfo, waiterName);

      const savedBills =
        JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
      savedBills.push(orderData);
      localStorage.setItem(`savedBills_${tableId}`, JSON.stringify(savedBills));

      console.log(selectedParentId);
      if (!selectedParentId) {
        console.error("Error: Parent ID not found");
        return;
      }

      // Call the sellLiquor API only if selectedParentId exists
      if (selectedParentId) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut/${selectedParentId}`,
          {
            selectedMenus: currentOrder.map((orderItem) => ({
              _id: orderItem.id, // Assuming the menu item ID is stored as 'id'
              quantity:
                orderItem.quantity *
                parseInt(orderItem.barCategory?.replace("ml", "")),
            })),
          }
        );
      }

      setCurrentOrder([]);
      router.push("/order");
    } catch (error) {
      console.error("Error saving bill:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";
      setShowPopup(true);
      setProductName(productName);
    }
  };

  const generateOrderContent = (items, tableInfo, waiterName, orderType) => {
    const orderHeading = orderType === "BOT" ? "BOT" : "KOT";

    if (items.length === 0) {
      console.warn(
        `No items in the ${orderHeading}. Not generating empty preview.`
      );
      return ""; // Return empty string if no items
    }

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${orderHeading} - Bar Order Ticket</title>
        <style>
          /* Add your custom styles for BOT/KOT print here */
          .counter-content {
            page-break-after: always;
        }
          @page {
            margin: 2mm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            margin-top: -2px;
          }
          .kot-header {
            text-align: center;
          }
          .kot-table {
            width: 100%;
            border-collapse: collapse;
          }
          .kot-table th, .kot-table td {
            border-top: 1px dotted black;
            border-bottom: 1px dotted black;
            border-left: 1px dotted black;
            border-right: 1px dotted black;
            text-align: left;
            padding: 3px;
          }
          .table-name {
            text-align: center;
            margin-bottom:1rem
          }
          .sections {
            display: flex;
            align-items: center;
          }
          .space {
            margin: 0 50px;
          }
          .datetime-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 10px;

          }
          .datetime-container p {
            font-size: 10px;
          }
          .label {
            margin-top: -1rem;
            font-size: 12px;
          }
          .table-name {
            margin: 0 0px;
            margin-bottom:1rem

          }
        </style>
      </head>
      <body>
      <div class="counter-content">
      <div class="kot-header">
        ${orderHeading}
      </div>
      <div class="sections">
        <span class="table-name">
          Table - ${tableInfo ? tableInfo.tableName : "Table Not Found"}
          Section - ${tableInfo ? tableInfo.section.name : "Table Not Found"}
        </span>
        <span class="space"></span>
      </div>
      <div class="datetime-container">
        <span class="label">Date:<span id="date" class="datetime"></span></span>
        <span class="datetime-space"> </span>
        <span class="label">Time:<span id="time" class="datetime"></span></span>
      </div>
      <div>
        <span>Waiter: ${waiterName}</span>
      </div>
      <div class="kot-date-time" id="date-time"></div>
      <div class="kot-items">
        <table class="kot-table">
          <thead>
            <tr>
              <th> Sr</th>
              <th>Items</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td class="kot-item-name">${item.name}${
                  item.taste ? `<br>Taste - ${item.taste}` : ""
                }</td>
                <td>${item.quantity}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
   
        <script>
          function updateKOTDate() {
            const dateElement = document.getElementById('date');
            const now = new Date();
            if (now.getHours() < 3) {
              now.setDate(now.getDate() - 1);
            }
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const formattedDate = day + '/' + month + '/' + year;
            dateElement.textContent = formattedDate;
            return formattedDate;
          }
          function updateActualTime() {
            const timeElement = document.getElementById('time');
            const now = new Date();
            const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const formattedTime = now.toLocaleTimeString('en-US', options);
            timeElement.textContent = formattedTime;
          }
          function updateDateTime() {
            const kotDate = updateKOTDate();
            updateActualTime();
            setTimeout(updateDateTime, 1000);
          }
          updateDateTime();
        </script>
      </body>
    </html>
  `;
  };

  const saveKot = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingKOTResponse = await axios.get(
        `http://localhost:5000/api/kot/kot/${tableId}`
      );
      const existingKOT = existingKOTResponse.data;
      console.log(existingKOT);

      if (!existingKOT) {
        console.error("No existing bill found.");
        return;
      }

      const existingItems = existingKOT.itemsWithoutBarCategory || [];
      if (existingItems.length === 0) {
        console.log("No Items in KOT");
        return;
      }
      const printWindow = window.open("", "_blank");
      // console.log(existingItems);
      if (!printWindow) {
        alert("Please allow pop-ups to print the KOT.");
        return;
      }

      const kotContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Re-Kitchen Order Ticket (RE-KOT)</title>
            <style>
            @page {
              margin: 2mm; /* Adjust the margin as needed */
            }
            /* Add your custom styles for KOT print here */
            body {
              font-family: Arial, sans-serif;
              margin:0;
              padding:0;
              margin-top:-2px;
         
            }
            .kot-header {
              text-align: center;
            }
         
            .kot-table {
              width: 100%;
              border-collapse: collapse;
            }
            .kot-table th, .kot-table td {
              border-top: 1px dotted black;
              border-bottom: 1px dotted black;
              border-left: 1px dotted black;
              border-right: 1px dotted black;
               text-align: left;
              padding: 3px;
            }
       
            .table-name{
              display:flex
           
             
            }
       
            .table-name {
              text-align: center;
           
            }
         
            .sections {
              display: flex;
              align-items: center;
            }
           
            .space {
              margin: 0 50px; /* Adjust the margin as needed */
            }
            .datetime-container{
              display: flex;
              align-items: center;
              justify-content: space-between;
            font-size:10px

            }
             .datetime-container p{
            font-size:10px
            }
            .label{
              margin-top:-1rem
              font-size:12px
            }
            .table-name{
              margin: 0 2px;
            }
          </style>
          </head>
          <body>
            <div class="kot-header">
              Re-KOT
            </div>
            <div class="sections">
              <span class="table-name">
                TABLE- ${tableInfo ? tableInfo.tableName : "Table Not Found"}
              </span>
              <span class="space"></span>
            </div>
            <div class="datetime-container">
              <span class="label">Date:<span id="date" class="datetime"></span></span>
              <span class="datetime-space"></span>
              <span class="label">Time:<span id="time" class="datetime"></span></span>
            </div>
            <div>
           <span>Waiter: ${existingKOT.waiterName}</span>
          </div>
            <div class="kot-items">
              <table class="kot-table">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Items</th>
                    <th>Qty</th>
                  </tr>
                </thead>

                <tbody>
            ${existingItems
              .map(
                (orderItem, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td class="kot-item-name">${orderItem.name}${
                  orderItem.taste ? `<br>Taste - ${orderItem.taste}` : ""
                }</td>
                  <td>${orderItem.quantity}</td>
                </tr>
              `
              )
              .join("")}
</tbody>
               
              </table>
            </div>
            <script>
              function updateDateTime() {
                const dateElement = document.getElementById('date');
                const timeElement = document.getElementById('time');
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const formattedDate = day + '/' + month + '/' + year;
                const options = { hour: 'numeric', minute: 'numeric' };
                const formattedTime = now.toLocaleTimeString('en-US', options);
                dateElement.textContent = formattedDate;
                timeElement.textContent = formattedTime;
              }
              updateDateTime();
              setInterval(updateDateTime, 1000);
            </script>


           
          </body>
        </html>
      `;

      // Write the content to the new window or iframe
      printWindow.document.write(kotContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      router.push("/order");
    } catch (error) {
      console.error("Error saving KOT:", error);
    }
  };

  const saveBot = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingBOTResponse = await axios.get(
        `http://localhost:5000/api/bot/bot/${tableId}`
      );
      const existingBOT = existingBOTResponse.data;
      console.log(existingBOT);

      if (!existingBOT) {
        console.error("No existing bill found.");
        return;
      }

      const existingItems = existingBOT.itemsWithBarCategory || [];
      if (existingItems.length === 0) {
        console.log("No Items in BOT");
        return;
      }
      const printWindow = window.open("", "_blank");
      // console.log(existingItems);
      if (!printWindow) {
        alert("Please allow pop-ups to print the KOT.");
        return;
      }

      const botContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Re-Bar Order Ticket (RE-KOT)</title>
            <style>
            @page {
              margin: 2mm; /* Adjust the margin as needed */
            }
            /* Add your custom styles for KOT print here */
            body {
              font-family: Arial, sans-serif;
              margin:0;
              padding:0;
              margin-top:-2px;
         
            }
            .bot-header {
              text-align: center;
            }
         
            .bot-table {
              width: 100%;
              border-collapse: collapse;
            }
            .bot-table th, .bot-table td {
              border-top: 1px dotted black;
              border-bottom: 1px dotted black;
              border-left: 1px dotted black;
              border-right: 1px dotted black;
               text-align: left;
              padding: 3px;
            }
       
            .table-name{
              display:flex
           
             
            }
       
            .table-name {
              text-align: center;
           
            }
         
            .sections {
              display: flex;
              align-items: center;
            }
           
            .space {
              margin: 0 50px; /* Adjust the margin as needed */
            }
            .datetime-container{
              display: flex;
              align-items: center;
              justify-content: space-between;
            font-size:10px

            }
             .datetime-container p{
            font-size:10px
            }
            .label{
              margin-top:-1rem
              font-size:12px
            }
            .table-name{
              margin: 0 2px;
            }
          </style>
          </head>
          <body>
            <div class="bot-header">
              Re-BOT
            </div>
            <div class="sections">
              <span class="table-name">
                TABLE- ${tableInfo ? tableInfo.tableName : "Table Not Found"}
              </span>
              <span class="space"></span>
            </div>
            <div class="datetime-container">
              <span class="label">Date:<span id="date" class="datetime"></span></span>
              <span class="datetime-space"></span>
              <span class="label">Time:<span id="time" class="datetime"></span></span>
            </div>
            <div>
           <span>Waiter: ${existingBOT.waiterName}</span>
          </div>
            <div class="bot-items">
              <table class="bot-table">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Items</th>
                    <th>Qty</th>
                  </tr>
                </thead>

                <tbody>
            ${existingItems
              .map(
                (orderItem, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td class="bot-item-name">${orderItem.name}${
                  orderItem.taste ? `<br>Taste - ${orderItem.taste}` : ""
                }</td>
                  <td>${orderItem.quantity}</td>
                </tr>
              `
              )
              .join("")}
</tbody>
               
              </table>
            </div>
            <script>
              function updateDateTime() {
                const dateElement = document.getElementById('date');
                const timeElement = document.getElementById('time');
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const formattedDate = day + '/' + month + '/' + year;
                const options = { hour: 'numeric', minute: 'numeric' };
                const formattedTime = now.toLocaleTimeString('en-US', options);
                dateElement.textContent = formattedDate;
                timeElement.textContent = formattedTime;
              }
              updateDateTime();
              setInterval(updateDateTime, 1000);
            </script>


           
          </body>
        </html>
      `;

      // Write the content to the new window or iframe
      printWindow.document.write(botContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      router.push("/order");
    } catch (error) {
      console.error("Error saving BOT:", error);
    }
  };

  const WaitingBill = async () => {
    try {
      // stock error message
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          console.log(foundItem);
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock : ${stockDetails.stockQtyMl} ml`
            );
            return; // Exit the function if stock is insufficient
          }
        }
      }

      // Stock msg End

      const acPercentageAmount = isACEnabled
        ? calculateTotal().acPercentageAmount
        : 0;

      const orderData = {
        tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
        })),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage, // Include AC percentage
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0, // Include VAT percentage
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        // If an existing bill is found, get the orderId
        const orderIdToUpdate = existingBill[0]._id;

        // Get existing menu items
        existingItems = existingBill[0].items;

        // Update the existing order by orderId
        const updateResponse = await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
        // console.log("Update Response:", updateResponse.data);
      } else {
        // If no existing bill is found, create a new one
        const createResponse = await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
        // console.log("Create Response:", createResponse.data);
      }

      // Identify newly added items
      const newItems = orderData.items.filter(
        (newItem) =>
          !existingItems.some(
            (existingItem) => existingItem.name === newItem.name
          )
      );

      // Identify items with updating quantities for existing items
      const updatingItems = orderData.items
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0); // Filter out items with quantity 0

      // Combine newItems and updatingItems into a set of unique items
      const uniqueItems = [...newItems, ...updatingItems];
      const uniqueItemsSet = new Set(uniqueItems.map((item) => item.name));

      const savedBills =
        JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
      savedBills.push(orderData);
      localStorage.setItem(`savedBills_${tableId}`, JSON.stringify(savedBills));

      console.log(selectedParentId);
      if (!selectedParentId) {
        console.error("Error: Parent ID not found");
        return;
      }

      // Call the sellLiquor API only if selectedParentId exists
      if (selectedParentId) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut/${selectedParentId}`,
          {
            selectedMenus: currentOrder.map((orderItem) => ({
              _id: orderItem.id, // Assuming the menu item ID is stored as 'id'
              quantity:
                orderItem.quantity *
                parseInt(orderItem.barCategory?.replace("ml", "")),
            })),
          }
        );
      }

      // // Check if stockQty is available (modify this condition based on your actual check)
      // if (!stockQtyAvailable) {
      //   openPopup(); // Open the error popup
      //   return;
      // }
      // Optionally, you can reset the current order or perform other actions
      setCurrentOrder([]);
      router.push("/order");
    } catch (error) {
      console.error("Error saving bill:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  const handlePrintBill = async () => {
    try {
      // Bar stock Error msg
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          console.log(foundItem);
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock : ${stockDetails.stockQtyMl} ml`
            );
            return; // Exit the function if stock is insufficient
          }
        }
      }

      // stock msg end

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      console.log(existingBill);
      const orderNo = orderNumber;

      // Find the index of the first temporary order (if any)
      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );

      // Separate items into two arrays based on barCategory presence
      const itemsWithBarCategory = currentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = currentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      // Calculate subtotal for items with barCategory
      const barCategorySubtotal = itemsWithBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Calculate subtotal for items without barCategory
      const noBarCategorySubtotal = itemsWithoutBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      const grandTotal = barCategorySubtotal + noBarCategorySubtotal;

      // Use the tableId from the order data
      const orderData = {
        tableId: existingBill.tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        isTemporary: true, // Set isTemporary to false explicitly
        isPrint: 1,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage, // Include AC percentage
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0, // Include VAT percentage
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      // console.log(orderItem)
      if (temporaryOrderIndex !== -1) {
        // If an existing temporary order is found, update it
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          {
            ...orderData,
            isTemporary: true, // Ensure isTemporary is set to false in the update request
            isPrint: 1,
          }
        );

        await axios.patch(
          `http://localhost:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        // If no existing temporary order is found, create a new one
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      console.log(selectedParentId);
      // if (!selectedParentId) {
      //   console.error("Error: Parent ID not found");
      //   return;
      // }

      // Call the sellLiquor API only if selectedParentId exists
      if (selectedParentId) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut/${selectedParentId}`,
          {
            selectedMenus: currentOrder.map((orderItem) => ({
              _id: orderItem.id, // Assuming the menu item ID is stored as 'id'
              quantity:
                orderItem.quantity *
                parseInt(orderItem.barCategory?.replace("ml", "")),
            })),
          }
        );
      }

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);

      // await new Promise((resolve) => setTimeout(resolve, 500));
      // console.log("document ready for printing");

      const printWindow = window.open("", "_self");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }

      const printContent = `
          <html>
              <head>
                  <title>Bill</title>
                  <style>
      @page {
        margin: 2mm; /* Adjust the margin as needed */
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        box-sizing: border-box;
     
      }
      * {
       
      box-sizing: border-box;
    }
      .container {
        max-width: 600px;
        padding: 10px 10px;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #fff;
        box-shadow: 0 0 10px black;
      }
     
      .hotel-details p {
        text-align: center;
        margin-top: -10px;
        font-size: 12px;
      }
     
      .order_details_border {
        margin-left: 10px;
        position: relative;
        top: 2rem;
      }
     
      .container .total-section {
        justify-content: space-between;
        display: flex;
      }
     
      .margin_left_container {
        margin-left: -2rem;
      }
     
      .container {
        margin: 1rem;
        align-items: center;
        height: fit-content; /* Changed 'fit' to 'fit-content' */
      }
     
      .contact-details p {
        display: inline-block;
      }
     
      .hotel-details {
        text-align: center;
        margin-bottom: -10px;
      }
     
      .hotel-details h4 {
        font-size: 20px;
        margin-bottom: 10px;
      }
     
      .hotel-details .address {
        font-size: 12px;
        margin-bottom: 10px;
      }
     
      .hotel-details p {
        font-size: 12px;
      }
     
      .contact-details {
        align-items: center;
        text-align: center;
        width: 100%;
        display: flex;
        font-size: 12.8px;
        justify-content: space-between;
      }
     
      .bill-no {
        font-size: 12.8px;
        border-top: 1px dotted gray;
      }
     
      .tableno p {
        font-size: 12.8px;
      }
     
      .waiterno p {
        font-size: 12.8px;
      }
     
      .tableAndWaiter {
        display: flex;
        align-items: center;
        font-size: 12.8px;
        justify-content: space-between;
        border-top: 1px dotted gray;
      }
     
      .waiterno {
        /* Missing 'display: flex;' */
        display: flex;
        font-size: 12.8px;
      }
     
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        font-size: 12.8px;
        border-top: 1px dotted gray;
      }
         
    .order-details{
     margin-top:14px
     font-size: 12.8px;

    }

      .order-details th {
        padding: 8px;
        text-align: left;
        font-size: 12.8px;
        border-top: 1px dotted gray;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 4px;
        font-size: 12.8px;
      }
     
   
     
      .margin_left_container {
        margin-left: 20px;
        font-size: 12.8px;
      }
     
      .thdots {
        border-top: 1px dotted gray;
        padding-top: 2px;
      }
     
      .itemsQty {
        border-top: 1px dotted gray;
        margin-top: 5px;
        margin-bottom: 5px;
        font-size: 12.8px;
      }
     
      .itemsQty p {
        margin-top: 2px;
        font-size: 12.8px;
      }
     
      .subtotal
     {
        margin-top:14px;
        font-size: 11px;
        padding-top:5px
      }
      .datas
      {
         margin-top:8px;
         font-size: 11px;
       }
      .datas {
        text-align: right;
      }
     
      .subtotal p {
        margin-top: -2px;
        margin-bottom: 5px;
        float: left;
        clear: left; /* Clear the float to ensure each heading starts on a new line */
    }
     
      .datas p {
        margin-top: -9px;
   
      }
     
      .subtotalDatas {
        display: flex;
        border-top: 1px dotted gray;
        justify-content: space-between;
        margin-top: -9px;
      }
     
      .grandTotal {
        font-size: 15px;
        float:right
        margin-top: 45px
     
      }
     
      .totalprice {
        text-align: right;
      }
     
      .table-class th {
        font-weight: 400;
      }
     
      .table-class th {
        align-items: center;
        text-align: left;
      }
     
      .tableAndWaiter p {
        margin-top: -10px;
      }
     
      .billNo {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
      .billNo p {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
      .footer {
     
        flex-direction: column;
        align-items: center;
        text-align: center;
       
      }
     
      .footer p {
        margin-top: 2px;
      }
     
      .datetime-containers {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12.8px;
        margin-bottom: 10px; /* Adjust the margin as needed */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .datetime-containers p {
        font-size: 10px;
        margin: 0; /* Remove default margin for paragraphs inside .datetime-containers */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .footerss {
        margin-top: 29px;
      }
     
   
      .tableAndWaiter {
        margin-top: -7px;
      }
     
      .tableno {
        border-top: 1px dotted gray;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .tableno p{
        margin-top:4px
      }
      /* Align the Price column to the right */
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        text-align: right;
      }
     
      /* Center the SR column */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1) {
        text-align: center;
      }
     
      /* Set a fixed width for the SR and Price columns if needed */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1),
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        width: 31px; /* Adjust the width as needed */
      }
     .table-class{
      margin-bottom: -11px;
    }
     }
        .reduce-space {
        margin-bottom: 8px;
      }
          .reduce-margin-top {
        margin-top: -10px;
      }
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        border-top: 1px dotted gray;
      }
     
     
    .order-details{
     margin-top:-24px
     position:absolute

    }

      .order-details th {
        padding: 8px;
        text-align: left;
        border-top: 1px dotted gray;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 2px;
      }
     
      .big-text {
        display: flex;
        flex-direction: column;
      }
      .big-text span{
        font-size:12.5px
      }
        .small-text {
          font-size: 10px; /* Adjust the font size as needed */
        }
        .order-details tbody {
          margin-top: 0px; /* Set margin-top to 0 to remove extra margin */
        }

        .order-details td,
        .order-details th {
          vertical-align: middle;
        }
        .table-class td:nth-child(1) {
          text-align: left;
        }
        .table-class th:nth-child(1) {
          text-align: left;
      }
      .table-class th:nth-child(3) {
        text-align: left;
    }
    .brab{
      margin-top:-20px
    }
    .waiterName{
      margin-top: -11px;
      float: left;
      margin-bottom: -10px;

   
   
    }
    .waiterName p{
      margin-top: -1px;
      float: left;
      font-size:12.5px
   
    }
    .subtotal{
      border-top: 1px dotted gray;

    }


  </style>
  </head>
  <div class="container">
    <div class="hotel-details">

    <h4>${hotelInfo ? hotelInfo.hotelName : "Hotel Not Found"}</h4>
  
    <img class="logo" src="http://localhost:5000/${
      hotelInfo.hotelLogo
    }" alt="Hotel Logo" style="max-height: 100px;max-width: 100px" />

     
        <p class="address">${
          hotelInfo ? hotelInfo.address : "Address Not Found"
        }</p>
        <p>Phone No: ${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.gstNo ? "display: none;" : ""
        }">GSTIN: ${hotelInfo ? hotelInfo.gstNo : "GSTIN Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.sacNo ? "display: none;" : ""
        }">SAC No: ${hotelInfo ? hotelInfo.sacNo : "SAC No Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.fssaiNo ? "display: none;" : ""
        }">FSSAI No: ${hotelInfo ? hotelInfo.fssaiNo : "FSSAI Not Found"}</p>
    </div>
   
    <!-- Content Section -->
        <!-- Table and Contact Details Section -->
        <div class="tableno reduce-space">
            <div class="billNo">
                <p>Bill No: ${
                  existingBill.length > 0
                    ? existingBill[0].orderNumber
                      ? existingBill[0].orderNumber
                      : orderNo
                    : orderNo
                }</p>
            </div>
            <p class="numberstable">Table No: ${
              tableInfo ? tableInfo.tableName : "Table Not Found"
            }</p>
        </div>
       
        <!-- Date and Time Containers Section -->
        <div class="datetime-containers">
            <span class="label">Date: <span id="date" class="datetime"></span></span>
            <span class="datetime-space"></span>
            <span class="label">Time: <span id="time" class="datetime"></span></span>
        </div>
       
        <!-- Waiter Name Section -->
        <div class="waiterName">
            <p>Waiter Name: ${waiterName}</p>
        </div>

        

               ${
                 itemsWithoutBarCategory.length > 0
                   ? `
       

        <div class="order-details reduce-margin-top">
            <table class="table-class">
                <thead>
                    <tr>
                        <th>SR</th>
                        <th>Items</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsWithoutBarCategory
                      .map(
                        (orderItem, index) => `<tr key=${orderItem._id}>
                                <td>${index + 1}</td>
                                <td>${orderItem.name}</td>
                                <td>${orderItem.quantity}</td>
                                <td class="totalprice">${
                                  (orderItem.price
                                    ? orderItem.price
                                    : orderItem.pricePer[
                                        `pricePer${orderItem.barCategory}`
                                      ]) * orderItem.quantity.toFixed(2)
                                }</td>
                            </tr>`
                      )
                      .join("")}
                </tbody>
            </table>
            <div class="subtotal">
                <p>Subtotal : </p>
                ${
                  hotelInfo && hotelInfo.gstPercentage > 0
                    ? `<p>CGST (${hotelInfo.gstPercentage / 2}%)</p> 
                     <p>SGST (${hotelInfo.gstPercentage / 2}%)</p>
                     <p class="grandTotal">Total</p>
                     ${acPercentage > 0 ? `<p>AC (${acPercentage}%)</p>` : ""}

                     `
                    : ""
                }
               
            </div>

            <div class="datas">
            <p> ${noBarCategorySubtotal.toFixed(2)}</p>
            ${
              hotelInfo && hotelInfo.gstPercentage > 0
                ? `<p>${calculateTotal().CGST}</p><p>${
                    calculateTotal().SGST
                  }</p>`
                : ""
            }

            ${
              acPercentage > 0
                ? `<p>${calculateTotal().acPercentageAmount}</p>`
                : ""
            }
            <p class="grandTotal">${Math.round(calculateTotal().grandTotal)}</p>
            </div>
        </div>
        `
                   : ""
               }

        <div class="footerss">
  <div class="footer">
    <p>
      <span class="big-text">
        ${greetings.map((index) => {
          return `<span class="">
            ${index.greet}
          </span>
          <span style="${index.message ? "" : "display: none;"}">
            ${index.message}
          </span>`;
        })}
        <span class="small-text">AB Software Solution: 8888732973</span>
      </span>

    </p>


     </div>
   </div>
        </div>
        <!-- Footer Section -->
</div>

<script>
  // Function to update KOT date
  function updateKOTDate() {
    const dateElement = document.getElementById('date');
    const now = new Date();

    // Check if the current hour is before 3 AM (hour 3 in 24-hour format)
    if (now.getHours() < 3) {
      // If before 3 AM, use the previous date
      now.setDate(now.getDate() - 1);
    }

    // Format date as dd/mm/yyyy
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const formattedDate = day + '/' + month + '/' + year;

    // Update the content of the element for KOT date
    dateElement.textContent = formattedDate;

    // Return the formatted date
    return formattedDate;
  }

  // Function to update actual current time
  function updateActualTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();

    // Format time as hh:mm:ss
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = now.toLocaleTimeString('en-US', options);

    // Update the content of the element for actual time
    timeElement.textContent = formattedTime;
  }

  // Function to update both KOT date and actual current time
  function updateDateTime() {
    const kotDate = updateKOTDate(); // Update KOT date
    updateActualTime(); // Update actual current time

    // Optionally, you can call this function every second to update time dynamically
    setTimeout(updateDateTime, 1000);
  }

  // Call the function to update both KOT date and actual current time
  updateDateTime();
</script>
  </html>
      `;

      // Write the content to the new window or iframe
      printWindow.document.write(printContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      router.push("/order");
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      // Handle errors
      console.error("Error preparing order:", error);
    }
  };

  const handleSave = async () => {
    try {
      // Bar stock Error msg
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          console.log(foundItem);
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock : ${stockDetails.stockQtyMl} ml`
            );
            return; // Exit the function if stock is insufficient
          }
        }
      }

      // stock msg end

      // console.log("Current Order:", currentOrder);

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      // Find the index of the first temporary order (if any)
      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );

      // Use the tableId from the order data
      const orderData = {
        tableId: existingBill.tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        isTemporary: true, // Set isTemporary to false explicitly
        isPrint: 1,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage, // Include AC percentage
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0, // Include VAT percentage
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      if (temporaryOrderIndex !== -1) {
        // If an existing temporary order is found, update it
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          {
            ...orderData,
            isTemporary: true, // Ensure isTemporary is set to false in the update request
            isPrint: 1,
          }
        );
        await axios.patch(
          `http://localhost:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        // If no existing temporary order is found, create a new one
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      console.log(selectedParentId);
      if (selectedParentId) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut/${selectedParentId}`,
          {
            selectedMenus: currentOrder.map((orderItem) => ({
              _id: orderItem.id, // Assuming the menu item ID is stored as 'id'
              quantity:
                orderItem.quantity *
                parseInt(orderItem.barCategory?.replace("ml", "")),
            })),
          }
        );
      }

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);

      router.push("/order");

      // openPaymentModal();
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  const handleAfterPrint = () => {
    window.removeEventListener("afterprint", handleAfterPrint);
    window.close();
  };

  const updateOrder = (updatedOrderItem) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = prevOrder.map((item) =>
        item.name === updatedOrderItem.name ? updatedOrderItem : item
      );
      console.log(updatedOrder); // Log the updated order
      return updatedOrder;
    });
  };

  const handleQuantityChange = (e, orderItem) => {
    let newQuantity = e.target.value;

    // Handle backspace
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      newQuantity = newQuantity.slice(0, -1);
    }

    if (newQuantity === "" || isNaN(newQuantity) || newQuantity < 0) {
      newQuantity = "";
    } else {
      newQuantity = parseInt(newQuantity, 10);
    }

    const updatedOrderItem = { ...orderItem, quantity: newQuantity };
    console.log(updatedOrderItem);
    updateOrder(updatedOrderItem);
  };

  const addToOrder = useCallback(
    (product) => {
      // Update the current order
      setCurrentOrder((prevOrder) => {
        // Check if the product already exists in the order
        const existingItem = prevOrder.find(
          (item) => item.name === product.name
        );

        console.log("Product:", product);
        console.log("Existing Item:", existingItem);

        if (existingItem && existingItem.name === product.name) {
          console.log("Existing item found. Increasing quantity.");
          // If the same menu item is selected, increase its quantity
          const updatedOrder = prevOrder.map((item) =>
            item.name === existingItem.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          console.log("Updated Order:", updatedOrder);
          return updatedOrder;
        } else {
          console.log("Adding new item to the order.");
          // If neither name nor barSubmenuName exists in the order, add it separately
          const newOrder = [...prevOrder, { ...product, quantity: 1 }];
          console.log("New Order:", newOrder);
          return newOrder;
        }
      });
    },
    [setCurrentOrder]
  );

  const removeFromOrder = (product) => {
    setCurrentOrder((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.name === product.name);

      if (existingItem) {
        const updatedOrder = prevOrder.map((item) =>
          item.name === existingItem.name
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
            : item
        );

        // Filter out items with quantity greater than 0
        const filteredOrder = updatedOrder.filter((item) => item.quantity > 0);

        return filteredOrder;
      } else {
        // console.log("Item not found in order:", product);
        return prevOrder;
      }
    });
  };

  useEffect(() => {
    // Recalculate total when isACEnabled changes
    setCurrentOrder((prevOrder) => [...prevOrder]); // Trigger a re-render
  }, [isACEnabled]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Fetch categories
    axios
      .get("http://localhost:5000/api/main/hide")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    axios
      .get("http://localhost:5000/api/liquorCategory/barMenus")
      .then((response) => {
        setBarCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Fetch products
    axios
      .get("http://localhost:5000/api/menu/menus/list")
      .then((response) => {
        // console.log(response.data);
        const menusArray = response.data; // Ensure menus is an array
        setMenus(menusArray);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    // axios
    //   .get("http://localhost:5000/api/liquorBrand/barSubmenu/list")
    //   .then((response) => {
    //     console.log(response.data);
    //     const menusArray = response.data; // Ensure menus is an array
    //     setBarMenus(menusArray);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching products:", error);
    //   });

    if (tableId) {
      axios
        .get(`http://localhost:5000/api/table/tables/${tableId}`)
        .then((response) => {
          setTableInfo(response.data);

          // Fetch saved bills for the table from the API
          axios
            .get(`http://localhost:5000/api/order/savedBills/${tableId}`)
            .then((response) => {
              const savedBills = response.data;
              if (savedBills.length > 0) {
                // Assuming you want to load the latest saved bill
                const latestOrder = savedBills[savedBills.length - 1];
                setCurrentOrder(latestOrder.items || []); // Initialize currentOrder with the saved items
              }
            })
            .catch((error) => {
              console.error("Error fetching saved bills:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching table information:", error);
        });
    }

    document.addEventListener("keydown", handleKeyDown);
    // document.addEventListener('keydown', handleSlashKey);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // document.removeEventListener('keydown', handleSlashKey);
    };
  }, [tableId, handleKeyDown]);

  useEffect(() => {
    const handleStarKey = (event) => {
      if (event.key === "*") {
        event.preventDefault();
        handlePrintBill();
      }
    };
    document.addEventListener("keydown", handleStarKey);
    return () => {
      document.removeEventListener("keydown", handleStarKey);
    };
  }, [handlePrintBill]);

  useEffect(() => {
    const handleSlashKey = (event) => {
      if (event.key === "/") {
        event.preventDefault();
        saveBill();
      }
    };
    document.addEventListener("keydown", handleSlashKey);
    return () => {
      document.removeEventListener("keydown", handleSlashKey);
    };
  }, [saveBill]);

  useEffect(() => {
    const handleHomeKey = (event) => {
      if (event.key === "Home") {
        event.preventDefault();
        WaitingBill(); // Call your end function here
      }
    };
    document.addEventListener("keydown", handleHomeKey);

    return () => {
      document.removeEventListener("keydown", handleHomeKey);
    };
  }, [WaitingBill]);

  useEffect(() => {
    const handleDotKey = (event) => {
      if (event.key === ".") {
        event.preventDefault();
        saveKot(); // Call your function here
      }
    };

    document.addEventListener("keydown", handleDotKey);

    return () => {
      document.removeEventListener("keydown", handleDotKey);
    };
  }, [saveKot]);

  useEffect(() => {
    const handlePageUpKey = (event) => {
      if (event.key === "PageUp") {
        event.preventDefault();
        handleSave(); // Call your function here
      }
    };

    document.addEventListener("keydown", handlePageUpKey);

    return () => {
      document.removeEventListener("keydown", handlePageUpKey);
    };
  }, [handleSave]);

  useEffect(() => {
    const handlePageDownKey = (event) => {
      if (event.key === "PageDown") {
        event.preventDefault();
        openCloseTablesModal(); // Call your function here
      }
    };

    document.addEventListener("keydown", handlePageDownKey);

    return () => {
      document.removeEventListener("keydown", handlePageDownKey);
    };
  }, [openCloseTablesModal]);

  useEffect(() => {
    // Fetch menus based on the selected category
    if (selectedCategory) {
      axios
        .get(`http://localhost:5000/api/menu/${selectedCategory._id}`)
        .then((response) => {
          console.log(response.data);
          const menusArray = response.data || []; // Ensure menus is an array
          setMenus(menusArray);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Fetch menus based on the selected category
    if (selectedBarCategory) {
      axios
        .get(`http://localhost:5000/api/liquorBrand/${selectedBarCategory._id}`)
        .then((response) => {
          // console.log(response.data);
          const menusArray = response.data || []; // Ensure menus is an array
          setBarMenus(menusArray);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  }, [selectedBarCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedBarCategory(null); // Reset bar category
    setShowCategoryMenus(true); // Set this to true to ensure category menus are shown
    setShowBarCategoryMenus(false); // Set this to false to hide bar category menus
    setSelectedBarMenuItem(false);
    setShowBrandMenus(false);

    // If the category is null (All items), fetch all menus
    if (category === null) {
      axios
        .get("http://localhost:5000/api/menu/menus/list")
        .then((response) => {
          console.log(response.data);
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    } else {
      // Fetch menus based on the selected category
      axios
        .get(`http://localhost:5000/api/menu/menulist/${category._id}`)
        .then((response) => {
          console.log(response.data);
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  };

  const handleBarCategoryClick = (category) => {
    setSelectedBarCategory(category);
    setSelectedCategory(null); // Reset regular category
    setShowCategoryMenus(false); // Set this to false to hide category menus when selecting from bar categories
    setShowBarCategoryMenus(true); // Set this to false to hide bar category menus
    setShowBarMenus(true);
    setSelectedBarMenuItem(false);
    setShowBrandCategoryMenus(true);
    // setShowBrands(false)
    setShowBrandMenus(false);

    // If the category is null (All items), fetch all menus
    if (category === null) {
      axios
        .get("http://localhost:5000/api/liquorBrand/barSubmenu/list")
        .then((response) => {
          console.log(response.data);
          setBarMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    } else {
      // Fetch menus based on the selected category
      axios
        .get(`http://localhost:5000/api/liquorBrand/${category._id}`)
        .then((response) => {
          console.log(response.data);
          setBarMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  };

  // const calculateTotal = () => {
  //   const subtotal = currentOrder.reduce(
  //     (acc, orderItem) => {
  //       const price = orderItem.price ? orderItem.price : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
  //       return acc + (price * orderItem.quantity);
  //     },
  //     0
  //   );

  //   // const GSTRate = gstPercentage / 100; // GST rate of 2.5%
  //   const GSTRate = isGSTEnabled ? gstPercentage / 100 : 0; // Use GST percentage if enabled

  //   const CGST = (GSTRate / 2) * subtotal; // Half of the GST for CGST
  //   const SGST = (GSTRate / 2) * subtotal; // Half of the GST for SGST

  //   // Include acPercentage in the total calculation
  //   const acPercentageAmount = isACEnabled
  //     ? subtotal * (acPercentage / 100)
  //     : 0;

  //   const total = subtotal + CGST + SGST + acPercentageAmount;
  //   const totalQuantity = currentOrder.reduce(
  //     (acc, orderItem) => acc + orderItem.quantity,
  //     0
  //   );

  //   return {
  //     subtotal: subtotal.toFixed(2),
  //     SGST: SGST.toFixed(2),
  //     CGST: CGST.toFixed(2),
  //     acPercentageAmount: acPercentageAmount.toFixed(2), // AC percentage amount based on subtotal
  //     total: total.toFixed(2),
  //     totalQuantity: totalQuantity,
  //   };
  // };

  const calculateTotal = () => {
    const itemsWithBarCategory = currentOrder.filter(
      (orderItem) => orderItem.barCategory
    );
    const itemsWithoutBarCategory = currentOrder.filter(
      (orderItem) => !orderItem.barCategory
    );

    // Calculate subtotal for items with barCategory and items without barCategory separately
    const subtotalWithBarCategory = itemsWithBarCategory.reduce(
      (acc, orderItem) => {
        const price = orderItem.price
          ? orderItem.price
          : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
        return acc + price * orderItem.quantity;
      },
      0
    );

    const subtotalWithoutBarCategory = itemsWithoutBarCategory.reduce(
      (acc, orderItem) => {
        const price = orderItem.price
          ? orderItem.price
          : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
        return acc + price * orderItem.quantity;
      },
      0
    );

    // Calculate VAT for items with barCategory
    const VATRate = isVATEnabled ? vatPercentage / 100 : 0; // Use VAT percentage if enabled
    const VAT = VATRate * subtotalWithBarCategory;

    // Calculate GST for items without barCategory
    const GSTRate = isGSTEnabled ? gstPercentage / 100 : 0; // Use GST percentage if enabled
    const CGST = (GSTRate / 2) * subtotalWithoutBarCategory; // Half of the GST for CGST
    const SGST = (GSTRate / 2) * subtotalWithoutBarCategory; // Half of the GST for SGST

    // Include acPercentage in the total calculation
    const acPercentageAmount = isACEnabled
      ? (subtotalWithBarCategory + subtotalWithoutBarCategory) *
        (acPercentage / 100)
      : 0;

    const menuTotal = subtotalWithoutBarCategory + CGST + SGST;
    const total = subtotalWithBarCategory + VAT;
    const grandTotal = menuTotal + total + acPercentageAmount;

    const totalQuantity = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.quantity,
      0
    );

    return {
      subtotal: subtotalWithoutBarCategory.toFixed(2),
      barSubtotal: subtotalWithBarCategory.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      VAT: VAT.toFixed(2),
      SGST: SGST.toFixed(2),
      CGST: CGST.toFixed(2),
      acPercentageAmount: acPercentageAmount.toFixed(2), // AC percentage amount based on subtotal
      total: total.toFixed(2),
      menuTotal: menuTotal.toFixed(2),
      totalQuantity: totalQuantity,
    };
  };

  const handleMenuItemKeyDown = (event, product) => {
    if (event.key === "Enter") {
      addToOrder(product);
    } else if (event.key === "+") {
      event.preventDefault();
      setSearchInput("");

      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else if (event.key === "-") {
      event.preventDefault();
      removeFromOrder(product);
    }
  };

  const [gstPercentage, setGSTPercentage] = useState(0); // Add this line for the GST percentage
  const [vatPercentage, setVATPercentage] = useState(0); // Add this line for the GST percentage

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        // Fetch all hotels
        const allHotelsResponse = await axios.get(
          "http://localhost:5000/api/hotel/get-all"
        );
        const allHotels = allHotelsResponse.data;

        // Assuming you want to use the first hotel's ID (you can modify this logic)
        const defaultHotelId = allHotels.length > 0 ? allHotels[0]._id : null;

        if (defaultHotelId) {
          // Fetch information for the first hotel
          const response = await axios.get(
            `http://localhost:5000/api/hotel/get/${defaultHotelId}`
          );
          const hotelInfo = response.data;
          // console.log(hotelInfo);
          setHotelInfo(hotelInfo);
          setGSTPercentage(hotelInfo.gstPercentage || 0);
          setVATPercentage(hotelInfo.vatPercentage || 0);
        } else {
          console.error("No hotels found.");
        }
      } catch (error) {
        console.error("Error fetching hotel information:", error);
      }
    };

    fetchHotelInfo();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const [ProductName, setProductName] = useState("");

  //run well
  const handleCheckboxChange = (itemName) => {
    setSelectedMenuNames((prevSelectedMenuNames) => {
      const isSelected = prevSelectedMenuNames.includes(itemName);
      return isSelected
        ? prevSelectedMenuNames.filter((name) => name !== itemName)
        : [...prevSelectedMenuNames, itemName];
    });
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsResponse = await axios.get(
          "http://localhost:5000/api/section"
        );
        setSections(sectionsResponse.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);

  const displaySectionsForSelection = sections.map((section) => (
    <option key={section._id} value={section._id}>
      {section.name}
    </option>
  ));

  const displaySectionsForSelectionSplit = sections.map((section) => (
    <option key={section._id} value={section.name}>
      {section.name}
    </option>
  ));

  const handleMergeTables = async (
    sectionId,
    destinationTableName,
    sourceTableName
  ) => {
    try {
      // Perform a lookup in the Table collection to retrieve tableId for destinationTableName
      const destinationTableResponse = await axios.get(
        `http://localhost:5000/api/table/table/bySectionAndName/${sectionId}/${destinationTableName}`
      );
      const destinationTableId = destinationTableResponse.data._id;

      // Perform a lookup in the Table collection to retrieve tableId for sourceTableName
      const sourceTableResponse = await axios.get(
        `http://localhost:5000/api/table/table/bySectionAndName/${sectionId}/${sourceTableName}`
      );
      const sourceTableId = sourceTableResponse.data._id;

      // Call the mergeTables endpoint with the retrieved tableIds
      const response = await axios.patch(
        "http://localhost:5000/api/order/mergeTables",
        {
          destinationTableId,
          sourceTableId,
        }
      );
      console.log(response.data); // Handle response data as needed
      setIsNewModalOpen(false);
    } catch (error) {
      console.error("Error merging tables:", error);
    }
  };

  const home = () => {
    router.push("/dashboard");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  // console.log("selectedBarMenuItem:", selectedBarMenuItem);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch items when component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/item/items/equal-low-stock"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        console.log("Fetched items:", data); // Debug: log the fetched data
        setItems(data);
        setItemCount(data.length); // Update the item count based on fetched items
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []); // Empty dependency array ensures this runs once when component mounts
  return (
    <div className=" font-sans mt-2 ">
    
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-2xl z-50 rounded-lg border border-blue-700">
          <div className="text-center">
            <p className="mb-4">
              Stock Quantity is not available for{" "}
              <b>
                <i>{ProductName}</i>
              </b>
              !{" "}
            </p>
            <button
              className=" bg-blue-200  hover:bg-blue-300 text-blue-700 font-bold py-2 px-4 rounded-full mr-2"
              onClick={closePopup}
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {/* <!-- component --> */}
      <div className="container  mx-auto ">
        <div className="flex lg:flex-row shadow-lg">
          <div className="w-full lg:w-1/2  bg-gray-200 -mt-3 md:w-96 relative  ">
            {/* Header */}
            <div className=" lg:flex mb-2">
              <div className="font-bold text-sm px-3 flex mt-2 whitespace-nowrap">
                <div className="relative mt-1 mr-4">
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faBell}
                      onClick={openModal}
                      className="cursor-pointer text-2xl text-gray-400 "
                    />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  {isModalOpen && (
                    <div
                      className="fixed inset-0 flex items-start justify-end z-10 text-xs "
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Adjust '2rem' as needed
                      onClick={closeModal}
                    >
                      <div
                        className="modal-container absolute bg-white w-auto  left-0 md:w-auto p-2 md:p-6  custom-sidescrollbars rounded shadow-lg  overflow-y-auto ml-2 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-2 text-center text-sm md:text-base relative">
                          <h3 className="mb-3 text-base font-semibold text-gray-800 dark:text-gray-400">
                            Low Stock Items
                          </h3>
                          {/* Hotel Items */}
                          <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Backery Items
                          </h4>
                          <ul className="text-left font-sans text-sm">
                            {Array.isArray(items) && items.length > 0 ? (
                              itemsToShow.filter(
                                (item) => item.itemType === "Item"
                              ).length > 0 ? (
                                itemsToShow
                                  .filter((item) => item.itemType === "Item")
                                  .map((item, index) => (
                                    <li
                                      key={index}
                                      className="flex justify-between text-black text-base font-sans p-0.5"
                                    >
                                      <span>
                                        {index + 1}. {item.name}
                                      </span>
                                      <span className="text-red-500 lg:ml-7 md:ml-3 ml-2 ">
                                        QTY: {item.stockQty}
                                      </span>
                                    </li>
                                  ))
                              ) : (
                                <li>No Backery items found</li>
                              )
                            ) : (
                              <li>No Backery items found</li>
                            )}
                          </ul>

                          {/*   <h4 className="text-xl font-bold text-gray-700 dark:text-gray-300 mt-4">Bar Items</h4>
                    <ul className="text-left font-sans">
                      {Array.isArray(items) && items.length > 0 ? (
                        itemsToShow.filter(item => item.itemType !== 'Item').length > 0 ? (
                          itemsToShow.filter(item => item.itemType !== 'Item').map((item, index) => (
                            <li key={index} className="flex justify-between text-black text-base font-sans p-0.5">
                              <span>{index + 1}. {item.menuName}</span>
                              <span className="text-red-500">QTY: {item.stockQty}</span>
                            </li>
                          ))
                        ) : (
                          <li>No bar items found</li>
                        )
                      ) : (
                        <li>No items found</li>
                      )}
                    </ul> */}

                          {items.length > 5 &&
                            !showAll && ( // Adjust the number 5 to the number of items you want to show initially
                              <button
                                type="button"
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-32 rounded mt-4 text-sm"
                                onClick={() => setShowAll(true)}
                              >
                                See All
                              </button>
                            )}
                          {/* <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={closeModal}
              >
                Close
              </button> */}
                        </div>
                      </div>
                      <button
                        onClick={closeModal}
                        className="absolute top-3 left-3 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 px-2 rounded-full text-center"
                      >
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mr-5 lg:ml-2">
                  <FontAwesomeIcon
                    icon={faHouse}
                    onClick={home}
                    className=" cursor-pointer text-2xl text-gray-400 flex item-center"
                  />
                </div>
                <div className="mt-1">Last Bills</div>
                <div className="mt-1 mb-1 lg:ml-2 float-right">
                  <input
                    type="text"
                    placeholder="Search Bill No..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="p-1 rounded-lg ml-1 px-0.5 w-20 -mt-1 sm:w-32 md:w-15 lg:w-28 pl-2 font-medium"
                  />
                </div>

                <div
                  className="md:hidden cursor-pointer mr-4 absolute right-0 mb-2 rounded-md"
                  onClick={handleToggle}
                >
                  <svg viewBox="0 0 10 8" width="30">
                    <path
                      d="M1 1h8M1 4h 8M1 7h8"
                      stroke="#000000"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/*  <div className=" grid grid-cols-3 lg:grid-cols-3 md:grid-cols-3 text-left ml-3 mt-1 lg:mt-2 mb-2">
                <button
                  className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400 "
                  onClick={() => setIsNewModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faObjectUngroup} className="mr-1" />
                  Merge
                </button>

                <button
                  className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400"
                  onClick={() => setIsShowModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faTableColumns} className="mr-1" />
                  Split
                </button>

                <button
                  className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400"
                  onClick={() => setIsRestoreModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faObjectGroup} className="mr-1" />
                  UnSplit
                </button>
              </div>*/}
            </div>

            <div className="flex flex-row items-center justify-between lg:px-2">
              <div className="font-semibold text-sm custom-scrollbars overflow-x-auto lg:w-full md:w-96 sm:w-80">
                <div className="flex flex-row mb-1 cursor-pointer">
                  {filteredOrders
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((order) => (
                      <div
                        key={order._id}
                        className="flex-shrink-0 mr-3  p-1 bg-white rounded-lg shadow-md hover:shadow-lg"
                        onClick={() => handleOrderClick(order)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-orange-100 px-4">
                            <span className="font-semibold text-sm text-orange-400">
                              {order.orderNumber.replace(/\D/g, "")}
                            </span>
                          </div>
                          <span className="font-semibold text-xs">
                            ₹{Math.round(order.grandTotal?.toFixed(2))}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {tableInfo ? (
              <div>
                <div className="font-bold lg:text-xl text-sm md:text-xl px-5 flex sm:text-lg">
                  {tableInfo ? ` ${tableInfo.section.name}` : " "}
                  <p className="lg:ml-8">
                    {tableInfo ? ` Table # ${tableInfo.tableName}` : " "}
                  </p>

                  <select
                    name="waiterName"
                    value={waiterName}
                    onChange={handleInputChange}
                    className="mt-1 p-1 border rounded-md text-xs text-gray-600 lg:ml-5 md:ml-4 ml-20 cursor-pointer"
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

                {/* <!-- end header --> */}
                {/* <!-- order list --> */}
                <div className="p-1 custom-scrollbars overflow-y-auto h-52 lg:h-80 md:h-40  max-h-[calc(80vh-1rem)] lg:text-sm md:text-sm text-xs lg:pl-1">
                  {currentOrder.map((orderItem) => (
                    <div key={orderItem._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`checkbox_${orderItem.name}`}
                        name={`checkbox_${orderItem.name}`}
                        className="mr-1 lg:ml-2 cursor-pointer"
                        checked={selectedMenuNames.includes(orderItem.name)}
                        onChange={() => handleCheckboxChange(orderItem.name)}
                      />

                      <div className="flex flex-row items-center ">
                        <div className="flex items-center h-full">
                          <span className="font-semibold lg:w-72 md:w-44 w-20 sm:text-xs md:text-xs lg:text-base lg:ml-1 md:-ml-1 text-xs ">
                            {orderItem.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex md:flex-row items-center lg:text-sm md:text-sm text-xs sm:flex">
                        {/* Use input element with datalist */}
                        <input
                          id={`tasteSelect_${orderItem._id}`}
                          name={`tasteSelect_${orderItem._id}`}
                          placeholder="Add Taste "
                          list={`tasteDatalist_${orderItem._id}`}
                          value={selectedTastes[orderItem._id] || ""}
                          onChange={(e) =>
                            handleSelectChange(orderItem._id, e.target.value)
                          }
                          className="cursor-pointer mt-1 p-1 lg:-ml-3  lg:w-32 w-20  md:-ml-7 sm:ml-0 align-middle  text-center border-2 rounded-md text-xs  text-gray-500 lg:text-sm md:text-xs ml-4 "
                          required
                        />

                        {/* Datalist containing the options for tastes */}
                        <datalist id={`tasteDatalist_${orderItem._id}`}>
                          {/* Add a default option */}
                          <option value="" disabled>
                            Select taste
                          </option>
                          {tastes.map((taste) => (
                            <option key={taste._id} value={taste.taste}>
                              {taste.taste}
                            </option>
                          ))}
                          {/* Add an option for "Other" */}
                          {/* <option value="other">Other</option> */}
                        </datalist>

                        {/* Display input field when "Other" is selected */}
                        {selectedTastes[orderItem._id] === "other" && (
                          <input
                            type="text"
                            value={newTastes[orderItem._id] || ""}
                            onChange={(e) =>
                              handleNewTasteChange(
                                orderItem._id,
                                e.target.value
                              )
                            }
                            placeholder="Enter new taste"
                            className="mt-1 p-1 border rounded-md text-sm lg:w-22   text-gray-500"
                            required
                          />
                        )}

                        <div className="float-right flex justify-between md:ml-1 mt-2">
                          <span
                            className="rounded-md cursor-pointer  align-middle text-center  
                         font-bold p-1 lg:w-4 lg:text-md md:w-4 sm:w-4 ml-2 lg:-mt-0.5"
                            onClick={() => removeFromOrder(orderItem)}
                          >
                            <FontAwesomeIcon
                              icon={faCircleMinus}
                              size="lg"
                              style={{ color: "red" }}
                            />
                          </span>
                          <input
                            type="number"
                            value={orderItem.quantity}
                            onChange={(e) => handleQuantityChange(e, orderItem)}
                            className="font-semibold lg:w-10  w-10 justify-center flex text-center rounded-md align-center ml-3 mr-3 md:text-xs pl-0 curs"
                            min={1}
                          />
                          <span
                            className="rounded-md cursor-pointer sm:w-2 lg:w-6 justify-center flex align-middle text-center md:w-4 font-bold p-1 sm:p-0 lg:text-md lg:mt-1 lg:pr-5"
                            onClick={() => addToOrder(orderItem)}
                          >
                            <FontAwesomeIcon
                              icon={faCirclePlus}
                              size="lg"
                              style={{ color: "red" }}
                            />
                          </span>
                        </div>
                      </div>
                      {/* <div className="font-semibold  lg:text-base md:text-md text-xs mt-1 text-right lg:-ml-2 ml-1 lg:mt-2  md:mt-0 sm:mt-0 sm:text-xs sm:w-10 lg:mr-1 md:mr-2 ">
                          {`₹${(orderItem[`pricePer${orderItem.barCategory}`] * orderItem.quantity)}`}
                      </div> */}
                      {/* <div className="font-semibold lg:text-base md:text-md text-xs mt-1 text-right lg:-ml-2 ml-1 lg:mt-2 md:mt-0 sm:mt-0 sm:text-xs sm:w-10 lg:mr-1 md:mr-2 ">
                        {orderItem.price ?
                          `₹${(orderItem.price * orderItem.quantity)}` :
                          (orderItem.pricePer[`pricePer${orderItem.barCategory}`] ?
                            `₹${(orderItem.pricePer[`pricePer${orderItem.barCategory}`] * orderItem.quantity)}` :
                            "Price not available"
                          )
                        }
                      </div> */}
                      <div className="font-semibold lg:text-base md:text-md text-xs mt-1 text-right lg:-ml-2 ml-1 lg:mt-2 md:mt-0 sm:mt-0 sm:text-xs sm:w-10 lg:mr-1 md:mr-2">
                        {orderItem.price
                          ? `₹${orderItem.price * orderItem.quantity}`
                          : orderItem.pricePer?.[
                              `pricePer${orderItem.barCategory}`
                            ]
                          ? `₹${
                              orderItem.pricePer[
                                `pricePer${orderItem.barCategory}`
                              ] * orderItem.quantity
                            }`
                          : "Price not available"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* <!-- end order list --> */}
                {/* <!-- totalItems --> */}
                <div className="px-5 font-bold lg:pt-10 mt-2 lg:ml-0 md:-ml-1 ml-0 lg:text-sm md:text-sm text-xs sm:ml-2">
                  <div className="py-1 rounded-md shadow-md bg-white  ">
                    <div className="px-4 flex justify-between ">
                      <span className="font-bold text-xs lg:text-sm">
                        Menu Subtotal
                      </span>
                      <span className="font-bold text-xs lg:text-sm">
                        ₹{calculateTotal().subtotal}
                      </span>
                    </div>

                    {acPercentage > 0 && (
                      <div className="px-4 flex justify-between ">
                        <span className="font-bold text-xs lg:text-sm">AC</span>
                        <span className="font-bold"></span>
                        <span className="font-bold text-xs lg:text-sm">
                          ( {acPercentage}% ) ₹
                          {calculateTotal().acPercentageAmount}
                        </span>
                      </div>
                    )}

                    {isGSTEnabled && gstPercentage > 0 && (
                      <div>
                        <div className="px-4 flex justify-between mt-1">
                          <span className="font-bold text-xs lg:text-sm">
                            CGST
                          </span>
                          <span className="font-bold">
                            ({gstPercentage / 2}%) ₹{calculateTotal().CGST}
                          </span>
                        </div>
                        <div className="px-4 flex justify-between mt-1 mb-2">
                          <span className="font-bold text-xs lg:text-sm">
                            SGST
                          </span>

                          <span className="font-bold">
                            ({gstPercentage / 2}%) ₹{calculateTotal().SGST}
                          </span>
                        </div>
                      </div>
                    )}

                    {isVATEnabled && vatPercentage > 0 && (
                      <div>
                        <div className="px-4 flex justify-between ">
                          <span className="font-bold text-xs lg:text-sm">
                            VAT
                          </span>
                          <span className="font-bold">
                            ({vatPercentage}%) ₹{calculateTotal().VAT}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="border-t-2 lg:py-2 lg:px-4 py-1 px-1 flex items-center justify-between ">
                      <span className=" font-bold text-sm lg:text-2xl -mt-1 lg:-mt-1 md:ml-2 lg:ml-0 ml-2">
                        Total
                      </span>
                      <span className="font-semibold text-sm lg:text-2xl lg:mr-0 md:mr-2 lg:-mt-1 -mt-1 mr-3">
                        {/* ₹{(calculateTotal().total)} */}₹
                        {Math.round(calculateTotal().grandTotal) || 0}
                      </span>
                      {/* <span className="font-bold text-2xl">₹{Math.ceil(Number(calculateTotal().total)).toFixed(2)}</span> */}
                    </div>
                    <div className="px-5 text-left text-xs lg:text-sm text-gray-600 font-sans font-bold lg:ml-0 -ml-2 -mt-1 lg:mt-0 ">
                      Total Items: {calculateTotal().totalQuantity}
                    </div>
                  </div>
                </div>
                {/* <!-- end total --> */}

                {/* <!-- button pay--> */}
                <div className="w-full lg:ml-0">
                  <div className=" grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 mt-2 gap-2 pl-2 pr-2">
                    <div className="w-auto mb-0 lg:mb-2 sm:mr-2">
                      <div
                        className="px-3 py-1.5 lg:py-2 text-center rounded-md bg-blue-700 text-white font-bold cursor-pointer text-xs"
                        onClick={saveBill}
                      >
                        KOT ( / )
                      </div>
                    </div>

                    <div className=" sm:w-auto mb-0 lg:mb-2  sm:mr-2">
                      <div
                        className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-red-600 text-white font-bold cursor-pointer text-xs"
                        onClick={saveKot}
                      >
                        Re-KOT ( . )
                      </div>
                    </div>

                    {/*    <div className=" sm:w-auto mb-0 lg:mb-2  sm:mr-2">
                      <div
                        className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-red-600 text-white font-bold cursor-pointer text-xs"
                        onClick={saveBot}
                      >
                        Re-BOT
                      </div>
                    </div> */}

                    <div className=" sm:w-auto mb-0 lg:mb-2 sm:mr-2 ">
                      <div
                        className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-green-600 text-white font-bold cursor-pointer text-xs"
                        onClick={WaitingBill}
                      >
                        Wait (Home)
                      </div>
                    </div>

                    <div className=" sm:w-auto mb-0 lg:mb-2 sm:mr-2 ">
                      <div
                        className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-violet-700 text-white font-bold cursor-pointer text-xs"
                        onClick={handleSave}
                      >
                        Save-Bill (PgUp)
                      </div>
                    </div>
                    

                    <div className=" sm:w-auto mb-0 lg:mb-2 sm:mr-2 ">
                      <div
                        className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-orange-600 text-white font-bold cursor-pointer text-xs"
                        onClick={handlePrintBill}
                      >
                        Print-Bill( * )
                      </div>
                    </div>

                    <div className=" sm:w-auto mb-0 lg:mb-2 sm:mr-2 ">
                      <div
                        className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-gray-500 text-white font-bold cursor-pointer text-xs"
                        onClick={handleCancelKOT}
                      >
                        Cancel KOT
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="font-extrabold lg:text-xl text-sm md:text-xl lg:px-28 px-20 mt-32 flex sm:text-xs whitespace-nowrap lg:ml-3">
                Please Select a Table !
              </div>
            )}

            
            {isCloseTablesModalOpen && (
            <>
              <div
                className="fixed inset-0 flex items-center justify-center z-50 "
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="bg-white border rounded p-5 shadow-md z-50 absolute">
                  <p className="text-gray-700 font-semibold text-center text-xl">
                    <p>Are you sure you want to close the table?</p>
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      className=" bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2"
                      onClick={() => handleConfirmCloseTables()}
                    >
                      Yes
                    </button>
                    <button
                      className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
                      onClick={() => handleCloseTablesModal()}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
              </>
            )}

            {isRestoreModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div
                  className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg text-sm md:text-base"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200 rounded-full text-center float-right"
                    onClick={() => setIsRestoreModalOpen(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                  <div className="p-1 text-sm md:text-base">
                    <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">
                      Restore MainTable
                    </h3>
                    {/* Add section name field */}

                    <div className="mb-4">
                      <label
                        htmlFor="sectionName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Section Name
                      </label>
                      <select
                        id="sectionName"
                        name="sectionName"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      >
                        <option value="" disabled>
                          Select a section
                        </option>
                        {displaySectionsForSelectionSplit}
                      </select>
                    </div>

                    {/* <div className="mb-4">
                      <label htmlFor="sectionName" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Section Name
                      </label>
                      <input
                        type="text"
                        id="sectionName"
                        name="sectionName"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div> */}
                    <div className="mb-4">
                      <label
                        htmlFor="mainTableName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Main TableName / TableNumber
                      </label>
                      <input
                        type="text"
                        id="mainTableName"
                        name="mainTableName"
                        value={mainTableName}
                        onChange={(e) => setMainTableName(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="text-center text-sm md:text-base">
                      <button
                        type="button"
                        className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mt-4"
                        onClick={() =>
                          handleResetTable(sectionName, mainTableName)
                        } // Pass the sectionName and mainTableName to the reset function
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isShowModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div
                  className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg text-sm md:text-base"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200 rounded-full text-center float-right"
                    onClick={() => setIsShowModalOpen(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                  <div className="p-1 text-sm md:text-base">
                    <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">
                      Split Table
                    </h3>
                    <div className="mb-4">
                      <label
                        htmlFor="mainTableName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Main TableName / TableNumber
                      </label>
                      <input
                        type="text"
                        id="mainTableName"
                        name="mainTableName"
                        value={mainTableName}
                        onChange={(e) => setMainTableName(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="numberOfSubtablesToShow"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Number of Splits
                      </label>
                      <input
                        type="number"
                        id="numberOfSubtablesToShow"
                        name="numberOfSubtablesToShow"
                        value={numberOfSubtablesToShow}
                        onChange={(e) =>
                          setNumberOfSubtablesToShow(e.target.value)
                        }
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        min={0}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="sectionName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Section Name
                      </label>
                      <select
                        id="sectionName"
                        name="sectionName"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      >
                        <option value="" disabled>
                          Select a section
                        </option>
                        {displaySectionsForSelectionSplit}
                      </select>
                    </div>
                    <div className="text-center text-sm md:text-base">
                      <button
                        type="button"
                        className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mt-4"
                        onClick={() =>
                          handleShowSubmit(
                            sectionName,
                            mainTableName,
                            numberOfSubtablesToShow
                          )
                        } // Pass arguments to handleShowSubmit
                      >
                        Split
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isNewModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div
                  className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg text-sm md:text-base"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200 rounded-full text-center float-right"
                    onClick={() => setIsNewModalOpen(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                  <div className="p-1 text-sm md:text-base">
                    <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">
                      Merge Table
                    </h3>
                    <div className="mb-4">
                      <label
                        htmlFor="destinationTableId"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        To Table
                      </label>
                      <input
                        type="text"
                        id="destinationTableId"
                        name="destinationTableId"
                        value={destinationTableId}
                        onChange={(e) => setDestinationTableId(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="sourceTableId"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        From Table
                      </label>
                      <input
                        type="text"
                        id="sourceTableId"
                        name="sourceTableId"
                        value={sourceTableId}
                        onChange={(e) => setSourceTableId(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="sectionSelection"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Section Name
                      </label>
                      <select
                        id="sectionSelection"
                        name="sectionSelection"
                        value={sectionId}
                        onChange={(e) => setSectionId(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      >
                        <option value="" disabled>
                          Select a section
                        </option>
                        {displaySectionsForSelection}
                      </select>
                    </div>
                    <div className="text-center text-sm md:text-base">
                      <button
                        type="button"
                        className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mt-4"
                        onClick={() =>
                          handleMergeTables(
                            sectionId,
                            destinationTableId,
                            sourceTableId
                          )
                        }
                      >
                        Merge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isPaymentModalOpen && (
              <PaymentModal
                onClose={() => setIsPaymentModalOpen(false)}
                tableName={tableInfo ? tableInfo.tableName : "Table Not Found"}
                totalAmount={calculateTotal().total}
                tableId={tableId}
              />
            )}
          </div>
          {isMobile && (
            <div className=" absolute right-0 top-0 w-80 mt-8 bg-white rounded-md">
              <div className="pt-4">
                <Try />
              </div>
              <div className=" flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap">
                <span
                  key="all-items"
                  className={`cursor-pointer px-2  py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${
                    selectedCategory === null ? "bg-yellow-500 text-white" : ""
                  }`}
                  onClick={() => handleCategoryClick(null)}
                >
                  All Menu
                </span>
                {categories.map((category) => (
                  <span
                    key={category._id}
                    className={`whitespace-nowrap cursor-pointer px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${
                      selectedCategory === category
                        ? "bg-yellow-500 text-white "
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              {/*   <div className=" flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap mt-1">
                <span
                  key="all-items"
                  className={`cursor-pointer px-2  py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${selectedBarCategory === null
                    ? "bg-yellow-500 text-white"
                    : ""
                    }`}
                  onClick={() => handleBarCategoryClick(null)}
                >
                  All Bar Menu
                </span>

                {barCategories.map((category) => (
                  <span
                    key={category._id}
                    className={`whitespace-nowrap cursor-pointer px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${selectedBarCategory === category
                      ? "bg-yellow-500 text-white"
                      : ""
                      }`}
                    onClick={() => handleBarCategoryClick(category)}
                  >
                    {category.liquorCategory}
                  </span>
                ))}
              </div>*/}

              <div className=" flex justify-start px-5  mt-3">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Menu / Id..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchInputKeyDown}
                  className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500 w-18 lg:w-48 md:w-44
               text-xs -ml-4 lg:ml-0 md:ml-0 lg:text-sm md:text-sm"
                />
              </div>

              {showCategoryMenus && (
                <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(67vh-1rem)] md:max-h-[calc(55vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                  {(menus.menus || menus)
                    .filter(filterMenus) // Apply the filterMenus function
                    .map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-sm lg:h-32 md:h-20 cursor-pointer"
                        onClick={() => addToOrder(product)}
                        tabIndex={0}
                        ref={(el) => (menuItemRefs.current[index] = el)} // Save the ref to the array
                        onKeyDown={(e) => handleMenuItemKeyDown(e, product)} // Handle keydown event
                      >
                        <div>
                          <div className="lg:-mt-3 ">
                            <span className="text-orange-500 md:text-xs text-xs font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap ">
                              {product.uniqueId}
                            </span>
                            <span
                              className="float-right text-green-700 text-xs md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap "
                              style={{ fontSize: "12px" }}
                            >
                              ₹{product.price}
                            </span>
                          </div>

                          <div className="justify-center flex">
                            <img
                              src={
                                product.imageUrl
                                  ? `http://localhost:5000/${product.imageUrl}`
                                  : `/tray.png`
                              }
                              className={`object-cover rounded-md ${
                                product.imageUrl
                                  ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                  : "lg:w-12 lg:h-10 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-4 md:mt-4 "
                              } hidden lg:block `}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                          <span
                            className="md:text-xs sm:text-xs lg:mb-1 flex"
                            style={{ fontSize: "12px" }}
                          >
                            <i>{product.name}</i>
                          </span>
                          <span>
                            {product.stockQty > 0 && (
                              <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                Q: {product.stockQty}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {showBarCategoryMenus && showBarMenus && (
                <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                  {(
                    barMenus &&
                    (Array.isArray(barMenus) ? barMenus : barMenus.barMenus)
                  )
                    ?.filter(filterMenus)
                    .map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-sm lg:h-32 md:h-20"
                        tabIndex={0}
                        onClick={() => handleClickBarMenuItem(product)}
                      >
                        <div>
                          <div className="lg:-mt-3">
                            <span className="text-orange-500 md:text-xs text-xs font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap">
                              {/* {product.uniqueId} */}
                            </span>
                            <span
                              className="float-right text-green-700 text-xs md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap"
                              style={{ fontSize: "12px" }}
                            >
                              {/* ₹{product.pricePer1Bottle} */}
                            </span>
                          </div>
                          <div className="justify-center flex">
                            <img
                              src={
                                product.imageUrl
                                  ? `http://localhost:5000/${product.imageUrl}`
                                  : `/wine.jpg`
                              }
                              className={`object-cover rounded-md ${
                                product.imageUrl
                                  ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                  : "lg:w-16 lg:h-14 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-4 md:mt-4"
                              } hidden lg:block`}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                          <span
                            className="md:text-xs sm:text-xs lg:mb-1 flex font-bold"
                            style={{ fontSize: "12px" }}
                          >
                            <i>{product.name}</i>
                          </span>
                          <span>
                            {product.stockQty > 0 && (
                              <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                Q: {product.stockQty}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {selectedBarMenuItem && (
                <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] ">
                  {/* Render prices grid here */}

                  <div className="mb-2 ml-5 flex">
                    <p className="text-left font-bold mt-">
                      Choose Bottle to Sell / Pour
                    </p>
                    <select
                      className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer ml-4"
                      onChange={handleParentMenuSelect} // Event handler for capturing the selected childMenuId
                    >
                      <option value="">Select Bottle to Sell / Pour </option>
                      {selectedBarMenuItem.childMenus
                        .filter(
                          (childMenu) =>
                            parseInt(childMenu.barCategory.replace("ml", "")) >=
                              90 &&
                            Object.values(childMenu.pricePer).some(
                              (price) => price > 1
                            )
                        ) // Filter based on barCategory > 90ml
                        .map((childMenu) => (
                          <option key={childMenu._id} value={childMenu.name}>
                            {childMenu.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {selectedOptionForBar && (
                    <div
                      className="grid grid-cols-4 gap-4 p-4"
                      key={selectedBarMenuItem._id}
                    >
                      {/* Render child menu prices */}
                      {selectedBarMenuItem.childMenus.map((childMenu) => {
                        if (
                          childMenu.barCategory &&
                          childMenu.pricePer[
                            `pricePer${childMenu.barCategory}`
                          ] > 0
                        ) {
                          // Check if stockQtyStr exists and is not undefined
                          const stockQtyStr = childMenu.stockQtyStr
                            ? childMenu.stockQtyStr
                            : "0";

                          // Split the stockQtyStr into bottles and ml
                          const [stockQtyBottles, stockQtyMl] =
                            stockQtyStr.split(".");

                          // Check if stockQtyBottles is greater than 0
                          const stockQty = parseInt(stockQtyBottles);
                          const showStockQty = stockQty > 0;

                          return (
                            <div
                              key={childMenu._id}
                              className="bg-gray-300 hover:bg-gray-400 p-2 rounded-md text-gray-900 text-sm cursor-pointer"
                              onClick={() => addToOrder(childMenu)}
                            >
                              {showStockQty && (
                                <p className="text-center font-bold text-xs text-red-800 mb-1 bg-white rounded-md">
                                  <i>
                                    {stockQtyBottles} Bottles{" "}
                                    {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                  </i>
                                </p>
                              )}
                              <p className="text-center font-bold">
                                <i>{selectedBarMenuItem.name}</i>
                              </p>
                              <p className="text-center font-semibold text-white">
                                {childMenu.barCategory}
                              </p>
                              {/* Render the price dynamically */}
                              <p className="text-center font-semibold text-red-900">
                                ₹
                                {
                                  childMenu.pricePer[
                                    `pricePer${childMenu.barCategory}`
                                  ]
                                }
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              )}

              {showBrandCategoryMenus && (
                <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                  {selectedBarCategory &&
                    barMenus.brands?.map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-base lg:h-32 md:h-20"
                        onClick={() => handleClickBrandMenuItem(product)}
                        tabIndex={0}
                        ref={(el) => (menuItemRefs.current[index] = el)}
                        onKeyDown={(e) => handleMenuItemKeyDown(e, product)}
                      >
                        <div>
                          <div className="lg:-mt-3">
                            <span className="text-orange-500 md:text-xs text-sm font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap">
                              {product.uniqueId}
                            </span>
                            <span
                              className="float-right text-green-700 text-sm md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap"
                              style={{ fontSize: "12px" }}
                            >
                              {product.price}
                            </span>
                          </div>
                          <div className="justify-center flex">
                            <img
                              src={
                                product.imageUrl
                                  ? `http://localhost:5000/${product.imageUrl}`
                                  : `/wine.jpg`
                              }
                              className={`object-cover rounded-md ${
                                product.imageUrl
                                  ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                  : "lg:w-16 lg:h-14 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-4 md:mt-4"
                              } hidden lg:block`}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                          <span
                            className="md:text-sm sm:text-xs lg:mb-1 flex"
                            style={{ fontSize: "12px" }}
                          >
                            <i>{product.name}</i>
                          </span>
                          <span>
                            {product.stockQty > 0 && (
                              <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                Q: {product.stockQty}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {selectedBrandMenuItem && showBrandMenus && (
                <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] cursor-pointer">
                  <div className="mb-2 ml-5">
                    <p className="text-left font-bold">
                      Choose Bottle to Sell / Pour
                    </p>
                    <select
                      className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                      onChange={handleParentMenuSelect} // Event handler for capturing the selected parentMenuId
                    >
                      <option value="">Select Bottle to Sell / Pour</option>

                      {selectedBrandMenuItem.prices
                        .filter(
                          (price) =>
                            price.price > 0 &&
                            price.barCategory.endsWith("ml") &&
                            parseFloat(price.barCategory) >= 90
                        )
                        .map((price) => (
                          <option key={price._id} value={price.name}>
                            {" "}
                            {/* Assuming price.parentMenuId contains the parentMenuId */}
                            {price.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {selectedOptionForBar && (
                    <div
                      className="grid grid-cols-4 gap-4 p-4"
                      key={selectedBrandMenuItem?._id}
                    >
                      {/* Render child menu prices */}
                      {selectedBrandMenuItem?.prices &&
                        selectedBrandMenuItem.prices.map((price) => {
                          if (price && price.price > 0) {
                            // Check if stockQtyStr exists and is not undefined
                            const stockQtyStr = price.stockQtyStr || "0";

                            // Split the stockQtyStr into bottles and ml
                            const [stockQtyBottles, stockQtyMl] =
                              stockQtyStr.split(".");

                            // Check if stockQtyBottles is greater than 0
                            const stockQty = parseInt(stockQtyBottles);
                            const showStockQty = stockQty > 0;

                            return (
                              <div
                                key={price._id}
                                className="bg-gray-300 hover:bg-gray-400 p-2 rounded-md text-gray-900 text-sm cursor-pointer"
                                onClick={() => addToOrder(price)}
                              >
                                {showStockQty && (
                                  <p className="text-center font-bold text-xs text-red-800 mb-1 bg-white rounded-md">
                                    <i>
                                      {stockQtyBottles} Bottles{" "}
                                      {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                    </i>
                                  </p>
                                )}
                                <p className="text-center font-bold">
                                  <i>{selectedBrandMenuItem.name}</i>
                                </p>
                                <p className="text-center font-extrabold text-white">
                                  {price.barCategory}
                                </p>
                                {/* Render the price dynamically */}
                                <p className="text-center font-semibold text-red-900">
                                  ₹{price.price}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}{" "}
          {/* <!-- Right section --> */}
          <div className=" w-56 lg:w-3/5  min-h-screen  md:w-96 lg:pl-3 hidden md:block bg-white ">
            <div className="">
              <Try />
            </div>

            <div className=" flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap">
              <span
                key="all-items"
                className={`cursor-pointer px-2  py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${
                  selectedCategory === null ? "bg-yellow-500 text-white" : ""
                }`}
                onClick={() => handleCategoryClick(null)}
              >
                All Menu
              </span>
              {categories.map((category) => (
                <span
                  key={category._id}
                  className={`whitespace-nowrap cursor-pointer px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${
                    selectedCategory === category
                      ? "bg-yellow-500 text-white"
                      : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </span>
              ))}
            </div>

            {/*  <div className=" flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap mt-1">
              <span
                key="all-items"
                className={`cursor-pointer px-2  py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${selectedBarCategory === null ? "bg-yellow-500 text-white" : ""
                  }`}
                onClick={() => handleBarCategoryClick(null)}
              >
                All Bar Menu
              </span>

              {barCategories.map((category) => (
                <span
                  key={category._id}
                  className={`whitespace-nowrap cursor-pointer px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${selectedBarCategory === category
                    ? "bg-yellow-500 text-white"
                    : ""
                    }`}
                  onClick={() => handleBarCategoryClick(category)}
                >
                  {category.liquorCategory}
                </span>
              ))}
            </div>*/}

            <div className=" flex justify-start px-5  mt-3">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Menu / Id..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchInputKeyDown}
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500 w-18 lg:w-48 md:w-44
               text-xs -ml-4 lg:ml-0 md:ml-0 lg:text-sm md:text-sm"
              />
            </div>

            {showCategoryMenus && (
              <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(67vh-1rem)] md:max-h-[calc(55vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                {(menus.menus || menus)
                  .filter(filterMenus) // Apply the filterMenus function
                  .map((product, index) => (
                    <div
                      key={product._id}
                      className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-sm lg:h-32 md:h-20 cursor-pointer"
                      onClick={() => addToOrder(product)}
                      tabIndex={0}
                      ref={(el) => (menuItemRefs.current[index] = el)} // Save the ref to the array
                      onKeyDown={(e) => handleMenuItemKeyDown(e, product)} // Handle keydown event
                    >
                      <div>
                        <div className="lg:-mt-3 ">
                          <span className="text-orange-500 md:text-xs text-xs font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap ">
                            {product.uniqueId}
                          </span>
                          <span
                            className="float-right text-green-700 text-xs md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap "
                            style={{ fontSize: "12px" }}
                          >
                            ₹{product.price}
                          </span>
                        </div>

                        <div className="justify-center flex">
                          <img
                            src={
                              product.imageUrl
                                ? `http://localhost:5000/${product.imageUrl}`
                                : `/tray.png`
                            }
                            className={`object-cover rounded-md ${
                              product.imageUrl
                                ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                : "lg:w-12 lg:h-10 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-4 md:mt-4 "
                            } hidden lg:block `}
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                        <span
                          className="md:text-xs sm:text-xs lg:mb-1 flex"
                          style={{ fontSize: "12px" }}
                        >
                          <i>{product.name}</i>
                        </span>
                        <span>
                          {product.stockQty > 0 && (
                            <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                              Q: {product.stockQty}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {showBarCategoryMenus && showBarMenus && (
              <>
                <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                  {(
                    barMenus &&
                    (Array.isArray(barMenus) ? barMenus : barMenus.barMenus)
                  )
                    ?.filter(filterMenus)
                    .map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-sm lg:h-32 md:h-20"
                        tabIndex={0}
                        onClick={() => handleClickBarMenuItem(product)}
                      >
                        <div>
                          <div className="lg:-mt-3">
                            <span className="text-orange-500 md:text-xs text-xs font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap">
                              {/* {product.uniqueId} */}
                            </span>
                            <span
                              className="float-right text-green-700 text-xs md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap"
                              style={{ fontSize: "12px" }}
                            >
                              {/* ₹{product.pricePer1Bottle} */}
                            </span>
                          </div>
                          <div className="justify-center flex">
                            <img
                              src={
                                product.imageUrl
                                  ? `http://localhost:5000/${product.imageUrl}`
                                  : `/wine.jpg`
                              }
                              className={`object-cover rounded-md ${
                                product.imageUrl
                                  ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                  : "lg:w-16 lg:h-14 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-4 md:mt-4"
                              } hidden lg:block`}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                          <span
                            className="md:text-xs sm:text-xs lg:mb-1 flex font-bold"
                            style={{ fontSize: "12px" }}
                          >
                            <i>{product.name}</i>
                          </span>
                          <span>
                            {product.stockQty > 0 && (
                              <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                Q: {product.stockQty}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {selectedBarMenuItem && (
              <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] ">
                {/* Render prices grid here */}

                <div className="mb-4 ml-5 flex">
                  <p className="text-left font-bold mt-1">
                    Choose Bottle to Sell / Pour
                  </p>
                  <select
                    className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer ml-4"
                    onChange={handleParentMenuSelect} // Event handler for capturing the selected childMenuId
                  >
                    <option value="">Select Bottle to Sell / Pour</option>

                    {selectedBarMenuItem.childMenus
                      .filter(
                        (childMenu) =>
                          parseInt(childMenu.barCategory.replace("ml", "")) >=
                            90 &&
                          childMenu.stockQty > 0 &&
                          Object.values(childMenu.pricePer).some(
                            (price) => price > 1
                          )
                      ) // Filter based on barCategory > 90ml
                      .map((childMenu) => (
                        <option key={childMenu._id} value={childMenu.name}>
                          {childMenu.name}
                        </option>
                      ))}
                  </select>
                </div>
                {selectedOptionForBar && (
                  <div
                    className="grid grid-cols-4 gap-4 p-4"
                    key={selectedBarMenuItem._id}
                  >
                    {/* Render child menu prices */}
                    {selectedBarMenuItem.childMenus.map((childMenu) => {
                      if (
                        childMenu.barCategory &&
                        childMenu.pricePer[`pricePer${childMenu.barCategory}`] >
                          0
                      ) {
                        // Check if stockQtyStr exists and is not undefined
                        const stockQtyStr = childMenu.stockQtyStr
                          ? childMenu.stockQtyStr
                          : "0";

                        // Split the stockQtyStr into bottles and ml
                        const [stockQtyBottles, stockQtyMl] =
                          stockQtyStr.split(".");

                        // Check if stockQtyBottles is greater than 0
                        const stockQty = parseInt(stockQtyBottles);
                        const showStockQty = stockQty > 0;

                        return (
                          <div
                            key={childMenu._id}
                            className="bg-orange-600 hover:bg-orange-500 p-2 rounded-md text-gray-900 text-sm cursor-pointer"
                            onClick={() => addToOrder(childMenu)}
                          >
                            {showStockQty && (
                              <p className="text-center font-bold text-xs text-black mb-1 bg-white rounded-md">
                                <i>
                                  {stockQtyBottles} Bottles{" "}
                                  {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                </i>
                              </p>
                            )}
                            <p className="text-center font-bold">
                              <i>{selectedBarMenuItem.name}</i>
                            </p>
                            <p className="text-center font-semibold text-white">
                              {childMenu.barCategory}
                            </p>
                            {/* Render the price dynamically */}
                            <p className="text-center font-semibold text-gray-900">
                              ₹
                              {
                                childMenu.pricePer[
                                  `pricePer${childMenu.barCategory}`
                                ]
                              }
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            )}

            {showBrandCategoryMenus && (
              <>
                <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                  {selectedBarCategory &&
                    barMenus.brands?.map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-base lg:h-32 md:h-20"
                        onClick={() => handleClickBrandMenuItem(product)}
                        tabIndex={0}
                        ref={(el) => (menuItemRefs.current[index] = el)}
                        onKeyDown={(e) => handleMenuItemKeyDown(e, product)}
                      >
                        <div>
                          <div className="lg:-mt-3">
                            <span className="text-orange-500 md:text-xs text-sm font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap">
                              {product.uniqueId}
                            </span>
                            <span
                              className="float-right text-green-700 text-sm md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap"
                              style={{ fontSize: "12px" }}
                            >
                              {product.price}
                            </span>
                          </div>
                          <div className="justify-center flex">
                            <img
                              src={
                                product.imageUrl
                                  ? `http://localhost:5000/${product.imageUrl}`
                                  : `/wine.jpg`
                              }
                              className={`object-cover rounded-md ${
                                product.imageUrl
                                  ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                  : "lg:w-16 lg:h-14 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-4 md:mt-4"
                              } hidden lg:block`}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                          <span
                            className="md:text-sm sm:text-xs lg:mb-1 flex"
                            style={{ fontSize: "12px" }}
                          >
                            <i>{product.name}</i>
                          </span>
                          <span>
                            {product.stockQty > 0 && (
                              <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                Q: {product.stockQty}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {selectedBrandMenuItem && showBrandMenus && (
              <>
                <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] cursor-pointer">
                  <div className="mb-2 ml-5 flex">
                    <p className="text-left font-bold">
                      Choose Bottle to Sell / Pour
                    </p>
                    <select
                      className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ml-4 cursor-pointer"
                      onChange={handleParentMenuSelect} // Event handler for capturing the selected parentMenuId
                    >
                      <option value="">Select Bottle to Sell / Pour</option>

                      {selectedBrandMenuItem.prices
                        .filter(
                          (price) =>
                            parseInt(price.barCategory.replace("ml", "")) >=
                              90 && price.stockQty > 0 // Filter condition to check if stockQty is greater than 0
                        )
                        .map((price) => (
                          <option
                            key={price._id}
                            value={price.name}
                            className="cursor-pointer"
                          >
                            {" "}
                            {price.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {selectedOptionForBar && (
                    <div
                      className="grid grid-cols-4 gap-4 p-4"
                      key={selectedBrandMenuItem?._id}
                    >
                      {/* Render child menu prices */}
                      {selectedBrandMenuItem?.prices &&
                        selectedBrandMenuItem.prices.map((price) => {
                          if (price && price.price > 0) {
                            // Check if stockQtyStr exists and is not undefined
                            const stockQtyStr = price.stockQtyStr || "0";

                            // Split the stockQtyStr into bottles and ml
                            const [stockQtyBottles, stockQtyMl] =
                              stockQtyStr.split(".");

                            // Check if stockQtyBottles is greater than 0
                            const stockQty = parseInt(stockQtyBottles);
                            const showStockQty = stockQty > 0;

                            return (
                              <div
                                key={price._id}
                                className="bg-orange-600 hover:bg-orange-500 p-2 rounded-md text-gray-900 text-sm cursor-pointer"
                                onClick={() => addToOrder(price)}
                              >
                                {showStockQty && (
                                  <p className="text-center font-bold text-xs text-black mb-1 bg-white rounded-md">
                                    <i>
                                      {stockQtyBottles} Bottles{" "}
                                      {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                    </i>
                                  </p>
                                )}
                                <p className="text-center font-bold">
                                  <i>{selectedBrandMenuItem.name}</i>
                                </p>
                                <p className="text-center font-extrabold text-white">
                                  {price.barCategory}
                                </p>
                                {/* Render the price dynamically */}
                                <p className="text-center font-semibold text-black">
                                  ₹{price.price}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {/* <!-- end products --> */}
      </div>
    </div>
  );
};

export default Billing;

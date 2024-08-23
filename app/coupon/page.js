"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PaymentModal from "../payment/page";
import Try from "../test/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import CounterPaymentModal from "../counterPayment/page";

const Coupon = ({ acPercentage }) => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [hotelInfo, setHotelInfo] = useState(null); // New state for hotel information
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef(null); // Create a ref for the search input element
  const menuItemRefs = useRef([]);
  const router = useRouter();
  const [isACEnabled, setIsACEnabled] = useState(true);
  const [isGSTEnabled, setIsGSTEnabled] = useState(true); // State for enabling/disabling GST
  const [searchQuery, setSearchQuery] = useState("");
  const [tastes, setTastes] = useState([]);
  const [selectedTastes, setSelectedTastes] = useState({});
  const [newTastes, setNewTastes] = useState({});
  const [lastAllOrders, setLastAllOrders] = useState([]);
  const [isCloseTablesModalOpen, setIsCloseTablesModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State variable to manage modal visibility
  const [openPrint, setOpenPrint] = useState(false); // State variable to manage modal visibility

  const calculateTotal = () => {
    const subtotal = currentOrder.reduce(
      (acc, orderItem) =>
        acc + (orderItem.price || 0) * (orderItem.quantity || 0),
      0
    );

    const GSTRate = isGSTEnabled ? (gstPercentage || 0) / 100 : 0;

    const CGST = (GSTRate / 2) * subtotal || 0;
    const SGST = (GSTRate / 2) * subtotal || 0;

    const acPercentageAmount = isACEnabled
      ? subtotal * ((acPercentage || 0) / 100)
      : 0;

    const total = subtotal + CGST + SGST + acPercentageAmount || 0;

    const totalQuantity = currentOrder.reduce(
      (acc, orderItem) => acc + (orderItem.quantity || 0),
      0
    );

    return {
      subtotal: subtotal.toFixed(2),
      SGST: SGST.toFixed(2),
      CGST: CGST.toFixed(2),
      acPercentageAmount: acPercentageAmount.toFixed(2),
      total: total.toFixed(2),
      totalQuantity: totalQuantity,
    };
  };

  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  // ========taste fuctionality=======//

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

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        // Redirect to the dashboard or any desired location
        router.push("/coupon");
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

  const handleAfterPrint = () => {
    window.removeEventListener("afterprint", handleAfterPrint);
    window.close();
  };

  const addToOrder = useCallback(
    (product) => {
      // console.log("Adding to order:", product);
      // Update the current order
      setCurrentOrder((prevOrder) => {
        const existingItem = prevOrder.find(
          (item) => item.name === product.name
        );

        if (existingItem) {
          // console.log("Adding to existing item:", existingItem);
          const updatedOrder = prevOrder.map((item) =>
            item.name === existingItem.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          // console.log("Updated Order:", updatedOrder);
          return updatedOrder;
        } else {
          // console.log("Adding new item:", product);
          return [...prevOrder, { ...product, quantity: 1 }];
        }
      });

      // Optionally, you can trigger the KOT print here or use the `kotData` as needed.
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
  }, []);

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

          setHotelInfo(hotelInfo);
          setGSTPercentage(hotelInfo.gstPercentage || 0);
        } else {
          console.error("No hotels found.");
        }
      } catch (error) {
        console.error("Error fetching hotel information:", error);
      }
    };

    fetchHotelInfo();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const updateOrder = (updatedOrderItem) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = prevOrder.map((item) =>
        item.name === updatedOrderItem.name ? updatedOrderItem : item
      );
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
    updateOrder(updatedOrderItem);
  };

  const [ProductName, setProductName] = useState("");

  const [selectedCounterName, setSelectedCounterName] = useState("");

  const [selectedCounterNumber, setSelectedCounterNumber] = useState("");
  const [counterName, setCounterName] = useState(""); // Add state for coupon name

  const handlePrintBill = async () => {
    try {
      const [couponResponse, counterResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/coupon/coupon/latest"),
        axios.get("http://localhost:5000/api/counter")
      ]);

      const couponNumber = couponResponse.data.orderNumber;
      const counters = counterResponse.data;

      const saveData = {
        items: modifiedCurrentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          taste: orderItem.taste, // Adding 'taste' property as per schema
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
      };

      // Extract couponNumber from latestCoupon data


      // Prepare print content
      const printContent = `
          <html>
      <head>
        <title>Bill</title>
        <style>
          @page {
            margin: 2mm; /* Adjust the margin as needed */
          }
          body {
            font-family: Arial , sans-serif ; /* Specify a more common Courier font */
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
            font-size: 11.8px;
            justify-content: space-between;
          }
          .bill-no {
            font-size: 11.8px;
            border-top: 1px dotted gray;
          }
          .tableno p {
            font-size: 11.8px;
          }
          .waiterno p {
            font-size: 11.8px;
          }
          .tableAndWaiter {
            display: flex;
            align-items: center;
            font-size: 11.8px;
            justify-content: space-between;
            border-top: 1px dotted gray;
          }
          .waiterno {
            /* Missing 'display: flex;' */
            display: flex;
            font-size: 11.8px;
          }
          .order-details table {
            border-collapse: collapse;
            width: 100%;
            font-size: 11.8px;
            border-top: 1px dotted gray;
          }
        .order-details{
         margin-top:14px
         font-size: 11.8px;
        }
          .order-details th {
            padding: 8px;
            text-align: left;
            font-size: 11.8px;
            border-top: 1px dotted gray;
          }
          .order-details td,
          .order-details th {
            border-bottom: none;
            text-align: left;
            padding: 4px;
            font-size: 11.8px;
          }
          .margin_left_container {
            margin-left: 20px;
            font-size: 11.8px;
          }
          .thdots {
            border-top: 1px dotted gray;
            padding-top: 2px;
          }
          .itemsQty {
            border-top: 1px dotted gray;
            margin-top: 5px;
            margin-bottom: 5px;
            font-size: 11.8px;
          }
          .itemsQty p {
            margin-top: 2px;
            font-size: 11.8px;
          }
          .subtotal,
          .datas {
            margin-top: 18px;
            font-size: 11.8px;
          }
          .datas {
            text-align: right;
          }
          .subtotal p {
            margin-top: -11px;
          }
          .datas p {
            margin-top: -11px;
          }
          .subtotalDatas {
            display: flex;
            border-top: 1px dotted gray;
            justify-content: space-between;
            margin-top: -9px;
          }
          .grandTotal {
            font-size: 19px;
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
            border-top: 1px dotted gray;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-top: -2.6rem;
          }
          .footer p {
            margin-top: 2px;
          }
          .datetime-containers {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11px;
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
            margin-top: 25px;
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
            .reduce-space {
            margin-bottom: 4px;
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
          margin-top:-20px
        }
        .waiterName p{
          font-size:12.5px
        }
      </style>
            </head>
            <body>
            <!-- Hotel Details Section -->
            <div class="hotel-details">
              <h4>${hotelInfo ? hotelInfo.hotelName : "Hotel Not Found"}</h4>
              <p class="address">${hotelInfo ? hotelInfo.address : "Address Not Found"
        }</p>
              <p>Phone No: ${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"
        }</p>
             <p style="${!hotelInfo || !hotelInfo.gstNo ? "display: none;" : ""
        }">GSTIN: ${hotelInfo ? hotelInfo.gstNo : "GSTIN Not Found"}</p>
    <p style="${!hotelInfo || !hotelInfo.sacNo ? "display: none;" : ""}">SAC No: ${hotelInfo ? hotelInfo.sacNo : "SAC No Not Found"
        }</p>
              <p style="${!hotelInfo || !hotelInfo.fssaiNo ? "display: none;" : ""
        }">FSSAI No: ${hotelInfo ? hotelInfo.fssaiNo : "FSSAI Not Found"}</p>
     </div>
            <!-- Content Section -->
            <!-- Table and Contact Details Section -->
            <div class="tableno reduce-space">
              <div class="billNo">
                <p>Coupon No: ${couponNumber}</p>
              </div>
            </div>
            <!-- Date and Time Containers Section -->
            <div class="datetime-containers">
              <span class="label">Date: <span id="date" class="datetime"></span></span>
              <span class="datetime-space"></span>
              <span class="label">Time: <span id="time" class="datetime"></span></span>
              </div>
            <!-- Order Details Section -->
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
              ${currentOrder
          .map(
            (orderItem, index) => `<tr key=${orderItem._id}>
                      <td>${index + 1}</td>
                      <td>${orderItem.name}</td>
                      <td>${orderItem.quantity}</td>
                      <td class="totalprice">${(
                orderItem.price * orderItem.quantity
              ).toFixed(2)}</td>
                    </tr>`
          )
          .join("")}
              </tbody>
            </table>
          </div>
          <!-- Items Quantity Section -->
          <div class="itemsQty">
            <p>Total Items: ${calculateTotal().totalQuantity}</p>
          </div>
          <!-- AC Section (Display only if acPercentage > 0) -->
          ${acPercentage > 0
          ? `
              <div class="margin_left_container">
              </div>
              <div class="datas">
              </div>
          `
          : ""
        }
          <!-- Subtotal Data Section -->
          <div class="subtotalDatas">
        <div class="subtotal">
            <p>Subtotal: </p>
            ${acPercentage > 0 ? `<p>AC (${acPercentage}%)</p>` : ""}
            ${hotelInfo && hotelInfo.gstPercentage > 0
          ? `<p>CGST (${hotelInfo.gstPercentage / 2}%)</p> <p>SGST (${hotelInfo.gstPercentage / 2
          }%)</p>`
          : ""
        }
            <p class="grandTotal">Grand Total: </p>
        </div>
        <div class="datas">
            <!-- Include content or styling for AC section if needed -->
            <p>${calculateTotal().subtotal}</p>
            ${acPercentage > 0
          ? `<p>${calculateTotal().acPercentageAmount}</p>`
          : ""
        }
            ${hotelInfo && hotelInfo.gstPercentage > 0
          ? `<p>${calculateTotal().CGST}</p><p>${calculateTotal().SGST}</p>`
          : ""
        }
            <p class="grandTotal">${Math.round(calculateTotal().total)}</p>
        </div>
    </div>
            <!-- Footer Section -->
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
      // Open a new window for printing
      const printWindow = window.open("", "_self");
      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }
      // Write the print content to the new window
      printWindow.document.write(printContent);
      // Trigger the print action
      printWindow.document.close();
      printWindow.print();
      // Close the print window
      printWindow.close();
      // Redirect to the coupon page
      router.push("/coupon");
    } catch (error) {
      // Handle errors
      console.error("Error printing bill:", error);
      // Optionally display an error message to the user
    }
  };

  const [couponResponseData, setCouponResponseData] = useState(null);

  const handleCounterCoupon = async () => {
    try {
      const saveData = {
        items: modifiedCurrentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          taste: orderItem.taste,
          price:orderItem.price
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
      };

      const saveCouponResponse = await axios.post(
        "http://localhost:5000/api/coupon/billCouponOrder",
        saveData
      );

      const { orderNumber } = saveCouponResponse.data;

      const getCouponResponse = await axios.get(
        `http://localhost:5000/api/coupon/orderNumber/${orderNumber}`
      );

      const fetchedCouponData = getCouponResponse.data;
      console.log("Fetched coupon:", fetchedCouponData);
      setCouponResponseData(fetchedCouponData);
      setModalOpen(true);

    } catch (error) {
      console.error("Error handling counter coupon:", error);
      // Handle specific error cases
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/counter")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    axios
      .get("http://localhost:5000/api/menu/menus/list")
      .then((response) => {
        setMenus(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    axios
      .get("http://localhost:5000/api/table/tables")
      .then((response) => {
        // Process table information
      })
      .catch((error) => {
        console.error("Error fetching table information:", error);
      });

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`http://localhost:5000/api/counter/${selectedCategory._id}`)
        .then((response) => {
          const menusArray = response.data || [];
          setMenus(menusArray);
          console.log(response);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    if (category === null) {
      axios
        .get("http://localhost:5000/api/menu/menus/list")
        .then((response) => {
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    } else {
      axios
        .get(`http://localhost:5000/api/menu/menulist/${category._id}`)
        .then((response) => {
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
      setSelectedCounterName(category.countername);
      setCounterName(category.countername); // Update counterName state with the selected counter name
    }
  };



  const [couponData, setCouponData] = useState(null);

  const printCoupon = async () => {
    try {
      const saveData = {
        CounterName: selectedCounterName,
        items: modifiedCurrentOrder.map((orderItem) => ({
          name: orderItem.name || "null",
          quantity: orderItem.quantity, // Default quantity to 0
          isCanceled: false,
         
        })),

      };

      // Ensure that saveData.menus is properly initialized and populated
      saveData.menus = saveData.items.map((item) => item.name);

      // Fetch counters data from the API
      const countersResponse = await axios.get(
        "http://localhost:5000/api/counter"
      );
      const counters = countersResponse.data; // Assuming the response contains an array of counters

      // Fetch the latest coupon record from the API based on CouponDate
      const latestCouponResponse = await axios.get(
        "http://localhost:5000/api/coupon/coupon/latest"
      );
      const latestCoupon = latestCouponResponse.data; // Assuming the response contains the latest coupon record

      // Check if latestCoupon.mainCategory is defined
      const couponItems = latestCoupon.mainCategory ? latestCoupon.mainCategory.items : [];

      const currentDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, "-")
      const currentTime = new Date().toLocaleTimeString("en-US");
      // Generate print content for all counters with selected menus
      let printContent = "";
      for (const counter of counters) {
        const counterName = counter.mainCategory?.name;
        const counterCode = counter.countername;
        const counterMenus = counter.menus;

        // Filter counter menus based on modifiedCurrentOrder
        const selectedMenus = counterMenus.filter((item) => {
          // Check if saveData.menus is properly initialized and populated
          return saveData.menus && saveData.menus.some(
            (selectedItemName) => selectedItemName === item.name
          );
        });

        // Generate print content for the counter only if there are selected menus
        if (selectedMenus.length > 0) {
          printContent += `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Coupon</title>
              <style>
                @page {
                  margin: 2mm; /* Adjust the margin as needed */
                }
                /* Add your custom styles for KOT print here */
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
                .kot-table th,
                .kot-table td {
                  border-top: 1px dotted black;
                  border-bottom: 1px dotted black;
                  border-left: 1px dotted black;
                  border-right: 1px dotted black;
                  text-align: left;
                  padding: 3px;
                }
                .table-name {
                  display: flex;
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
                .datetime-container {
                  display: flex;
                  align-items: center;
                  font-size: 9px;
                  justify-content: space-around;
                }
                .label {
                  margin-top: -1rem;
                  font-size: 60px;
                }
                .table-name {
                  margin: 0 2px;
                }
                .countername {
                  font-size: 28px;
                }
                .counternames {
                }
                .maincategory {
                  font-size: 20px;
                }
                .date_time {
                  display: flex;
                  justify-content: space-between;
                }
              </style>
            </head>
            <body>
              <div class="kot-header">
                <div class="counter-content">
                  <div class="countername">${counterCode}</div>
                  <div class="maincategory">${counterName}</div>
                  <div class="counternames"></div>
                  <div class="date_time">
                    <div>${currentDate}</div>
                    <div>${currentTime}</div>
                  </div>
               
                <div class="kot-date-time" id="date-time"></div>
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
                    ${selectedMenus.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.name}</td>
                      <td>${saveData.items.find((menu) => menu.name === item.name)?.quantity || 0}</td>
                 
                    </tr>
                  `).join("")}
                    </tbody>
                  </table>
                  </div>
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
              </div>
            </body>
          </html>
         

                `;
        }
      }

      // Open a new window, write the combined print content, and print it
      const printWindow = window.open("", "_self");
      if (!printWindow) {
        alert("Please allow pop-ups to print the KOT.");
        return;
      }
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Coupon</title>
            <style>
            .counter-content {
              page-break-after: always;
          }
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
              font-size:6px
         
              justify-content: space-between;
            }
             .datetime-container p{
            font-size:6px
            }
            .label{
              margin-top:-1rem
              font-size:60px
            }
            .table-name{
              margin: 0 2px;
            }
            .countername{
              font-size:28px
            }
            .counternames{
              margin-bottom:10px
            }
          </style>
          </head>
          <body>
            ${printContent}
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
      `);

      printWindow.document.close();
      printWindow.print();
      printWindow.close();

      // Reset current order and redirect
      setCurrentOrder([]);
      router.push("/coupon");
    } catch (error) {
      console.error("Error handling counter coupon:", error);
      // Handle specific error cases
    }
  };



  return (
    <>

      <div className=" font-sans mt-2">
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
        <div className="container mx-auto">
          <div className="flex lg:flex-row shadow-lg ">
            <div className=" w-full lg:w-2/5 bg-gray-200 -mt-3 md:w-96 relative  min-h-screen">
              {/* Header */}

              <div>
                <div className="font-bold lg:text-xl text-sm md:text-xl px-5 flex  sm:text-lg"></div>

                <div className="p-1 custom-scrollbars overflow-y-auto h-96 lg:h-96 md:h-1/2  max-h-[calc(80vh-1rem)] lg:text-sm md:text-sm text-xs">
                  {currentOrder.map((orderItem) => (
                    <div key={orderItem._id} className="flex items-center mb-2">
                      <div className="flex flex-row items-center ">
                        <div className="flex items-center h-full">
                          <span className=" font-semibold  lg:w-48 md:w-44 w-28 sm:text-xs md:text-xs   lg:text-base lg:ml-1 md:-ml-1 text-xs">
                            {orderItem.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex md:flex-row items-center lg:text-sm md:text-sm text-xs sm:flex">
                        {/* Use input element with datalist */}
                        <input
                          id={`tasteSelect_${orderItem._id}`}
                          name={`tasteSelect_${orderItem._id}`}
                          placeholder="Add Taste"
                          list={`tasteDatalist_${orderItem._id}`}
                          value={selectedTastes[orderItem._id] || ""}
                          onChange={(e) =>
                            handleSelectChange(orderItem._id, e.target.value)
                          }
                          className="mt-1 p-1 lg:-ml-3  lg:w-32 w-28  md:-ml-7 sm:ml-0 align-middle  text-center border rounded-md text-xs  text-gray-500 lg:text-sm md:text-xs ml-4 "
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

                        <div className="float-right flex justify-between  md:ml-1 mt-2">
                          <span
                            className="rounded-md cursor-pointer  align-middle text-center  
                         font-bold p-1 lg:w-4 lg:text-md md:w-4 sm:w-4 ml-2"
                            onClick={() => removeFromOrder(orderItem)}
                          >
                            <FontAwesomeIcon
                              icon={faCircleMinus}
                              size="lg"
                              style={{ color: "#f25236" }}
                            />
                          </span>
                          <input
                            type="number"
                            value={orderItem.quantity}
                            onChange={(e) => handleQuantityChange(e, orderItem)}
                            className="font-semibold lg:w-10  w-10 justify-center flex text-center rounded-md align-center ml-3 mr-3 md:text-xs pl-0"
                            min={1}
                          />
                          <span
                            className="rounded-md cursor-pointer  sm:w-4  lg:w-6 justify-center flex align-middle text-center md:w-4 font-bold p-1 sm:p-0 lg:text-md lg:mt-1 lg:pr-3"
                            onClick={() => addToOrder(orderItem)}
                          >
                            <FontAwesomeIcon
                              icon={faCirclePlus}
                              size="lg"
                              style={{ color: "#f25236" }}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="font-semibold  lg:text-base md:text-md text-xs mt-1 text-right lg:-ml-3  ml-1 lg:mt-0  md:mt-0 sm:mt-0  sm:text-xs sm:w-20 lg:mr-1 md:mr-2 ">
                        {`₹${orderItem.price * orderItem.quantity}`}
                      </div>
                    </div>
                  ))}
                </div>

                {/* <!-- end order list --> */}
                {/* <!-- totalItems --> */}
                <div className="px-5 lg:mt-24 mt-4 lg:ml-0 md:-ml-1 ml-0 lg:text-sm md:text-sm text-xs sm:ml-2">
                  <div className="py-1 rounded-md shadow-md bg-white  ">
                    <div className="px-4 flex justify-between ">
                      <span className="font-semibold text-sm">Subtotal</span>
                      <span className="font-semibold">
                        ₹{calculateTotal().subtotal}
                      </span>
                    </div>

                    {acPercentage > 0 && (
                      <div className="px-4 flex justify-between ">
                        <span className="font-semibold text-sm">AC</span>
                        <span className="font-bold"></span>
                        <span className="font-bold">
                          ( {acPercentage}% ) ₹
                          {calculateTotal().acPercentageAmount}
                        </span>
                      </div>
                    )}

                    {isGSTEnabled && gstPercentage > 0 && (
                      <div>
                        <div className="px-4 flex justify-between ">
                          <span className="font-semibold text-sm">CGST</span>
                          <span className="font-semibold">
                            ({gstPercentage / 2}%) ₹{calculateTotal().CGST}
                          </span>
                        </div>
                        <div className="px-4 flex justify-between ">
                          <span className="font-semibold text-sm">SGST</span>

                          <span className="font-semibold">
                            ({gstPercentage / 2}%) ₹{calculateTotal().SGST}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="border-t-2 lg:py-1 lg:px-4 py-1 px-1 flex items-center justify-between ">
                      <span className=" font-semibold text-xl lg:text-2xl lg:-mt-1 md:ml-2 lg:ml-0">
                        Total
                      </span>
                      <span className="font-semibold text-xl lg:text-2xl lg:mr-0 md:mr-2 lg:-mt-1">
                        {/* ₹{(calculateTotal().total)} */}₹
                        {Math.round(calculateTotal().total) || 0}
                      </span>
                      {/* <span className="font-bold text-2xl">₹{Math.ceil(Number(calculateTotal().total)).toFixed(2)}</span> */}
                    </div>
                    <div className="px-5 text-left text-sm  text-gray-500 font-sans font-semibold -ml-4 ">
                      Total Items: {calculateTotal().totalQuantity}
                    </div>
                  </div>
                </div>
                {/* <!-- end total --> */}

                {/* <!-- button pay--> */}
                <div className="flex flex-wrap px-1 mt-2 justify-center md:gap-1  lg:gap-1  sm:gap-1 gap-1">
             

                  <div className=" sm:w-auto ">
                    <div
                      className="px-3 py-2 rounded-md shadow-md text-center bg-blue-500 text-white font-bold cursor-pointer text-xs"
                      onClick={handleCounterCoupon}
                    >
                      Print & Payment
                    </div>
                  </div>
               

                  {modalOpen && (
                    <CounterPaymentModal
                      onClose={() => setModalOpen(false)}
                      totalAmount={calculateTotal().total}
                      printCoupon={printCoupon}
                      handlePrintBill={handlePrintBill}
                      orderNumber={
                        couponResponseData
                          ? couponResponseData.orderNumber
                          : null
                      }
                    // Other props you need to pass to the modal component
                    />
                  )}

                  <div className=" sm:w-auto ">
                    <div
                      className="px-3 py-2 rounded-md shadow-md text-center bg-red-500 text-white font-bold cursor-pointer text-xs"
                      onClick={() => openCloseTablesModal()}
                    >
                      Exit (Pg Dn)
                    </div>
                  </div>
                </div>
              </div>

              {isCloseTablesModalOpen && (
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
              )}
            </div>
            <div
              className="md:hidden cursor-pointer mr-4 absolute right-0 top-2 mb-2 rounded-md"
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
            {isMobile && (
              <div className=" absolute right-0 top-0 w-80 mt-8 bg-white rounded-md min-h-screen">
                <div className=" flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap">
                  <span
                    key="all-items"
                    className={`cursor-pointer px-2  py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${selectedCategory === null
                      ? "bg-yellow-500 text-white"
                      : ""
                      }`}
                    onClick={() => handleCategoryClick(null)}
                  >
                    All Menu
                  </span>
                  {categories.map((category) => (
                    <span
                      key={category._id}
                      className={`whitespace-nowrap cursor-pointer px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${selectedCategory === category
                        ? "bg-yellow-500 text-white "
                        : ""
                        }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.countername}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex justify-start px-5">
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

                <div
                  className="cursor-pointer grid grid-cols-3 bg-white gap-3
                px-2 mt-3 custom-sidescrollbars overflow-scroll max-h-[calc(60vh-1rem)]"
                >
                  {(menus.menus || menus)
                    .filter(filterMenus) // Apply the filterMenus function
                    .map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md
                     justify-between text-sm lg:h-32 md:h-20 "
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
                              className={`object-cover rounded-md ${product.imageUrl
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
                            style={{ fontSize: "13px" }}
                          >
                            {product.name}
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
                {/* <!-- end products --> */}
              </div>
            )}{" "}
            {/* <!-- left section --> */}
            <div className=" w-56 lg:w-3/5 md:w-96 hidden md:block bg-white ">
              <div className=" flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap">
                <span
                  key="all-items"
                  className={`cursor-pointer px-2  py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${selectedCategory === null ? "bg-yellow-500 text-white" : ""
                    }`}
                  onClick={() => handleCategoryClick(null)}
                >
                  All Menu
                </span>
                {categories.map((category) => (
                  <span
                    key={category._id}
                    className={`whitespace-nowrap cursor-pointer px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${selectedCategory === category
                      ? "bg-yellow-500 text-white "
                      : ""
                      }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.countername}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex justify-start px-5">
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

              <div
                className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3
               lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(57vh-1rem)]
               md:max-h-[calc(60vh-1rem)]  max-h-[calc(90vh-1rem)] sm:max-h-[calc(80vh-1rem)]  min-h-screen"
              >
                {(menus.menus || menus)
                  .filter(filterMenus) // Apply the filterMenus function
                  .map((product, index) => (
                    <div
                      key={product._id}
                      className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md
                     justify-between text-sm lg:h-32 md:h-20 "
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
                            className={`object-cover rounded-md ${product.imageUrl
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
                          style={{ fontSize: "13px" }}
                        >
                          {product.name}
                        </span>
                        <span>
                          {product.stockQty ? (
                            <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full ">
                              Q: {product.stockQty}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Coupon;
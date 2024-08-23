
'use client'
import Login from './login/page';


export default function Home() {

  return (
    <Login />
  );
}






// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";

// const LiquorStockReport = () => {
//   const [selectedDate, setSelectedDate] = useState("");
//   const [barPurchaseData, setBarPurchaseData] = useState([]);
//   const [orderData, setOrderData] = useState([]);
//   const [openingBalanceData, setOpeningBalanceData] = useState([]);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const sizes = [
//     "1000ml", "120ml", "150ml", "180ml", "30ml", "375ml",
//     "45ml", "50ml", "60ml", "650ml", "750ml", "90ml", "1bottle"
//   ];

//   const [differenceItems, setDifferenceItems] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (selectedDate) {
//         try {
//           const response = await axios.get(
//             "http://localhost:5000/api/barPurchase/opening-balance",
//             { params: { date: selectedDate } }
//           );
//           setDifferenceItems(response.data.differenceItems || []);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           setDifferenceItems([]);
//         }
//       } else {
//         setDifferenceItems([]);
//       }
//     };

//     fetchData();
//   }, [selectedDate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (selectedDate) {
//         try {
//           const [barPurchaseResponse, orderResponse] = await Promise.all([
//             axios.get(
//               "http://localhost:5000/api/barPurchase/barPurchase/items/quantities",
//               { params: { date: selectedDate } }
//             ),
//             axios.get(
//               "http://localhost:5000/api/order/items/quantities",
//               { params: { date: selectedDate } }
//             ),
//           ]);

//           setBarPurchaseData(barPurchaseResponse.data);
//           setOrderData(orderResponse.data[selectedDate] || { items: [] });
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           setBarPurchaseData([]);
//           setOrderData([]);
//         }
//       } else {
//         setBarPurchaseData([]);
//         setOrderData([]);
//       }
//     };

//     fetchData();
//   }, [selectedDate]);

//   useEffect(() => {
//     const updateCurrentTime = () => {
//       setCurrentTime(new Date());
//     };

//     const intervalId = setInterval(updateCurrentTime, 60000);

//     return () => clearInterval(intervalId);
//   }, []);

//   const aggregateData = () => {
//     const aggregatedData = {};

//     if (barPurchaseData && barPurchaseData.items) {
//       barPurchaseData.items.forEach((item) => {
//         const key = item.name;
//         if (!aggregatedData[key]) {
//           aggregatedData[key] = {};
//           sizes.forEach((size) => {
//             aggregatedData[key][size] = {
//               totalPurchaseQty: 0,
//               totalSaleQty: 0,
//               closingBalance: 0,
//             };
//           });
//         }
//         const size = item.name.match(/\d+/);
//         if (size && sizes.includes(size[0] + "ml")) {
//           aggregatedData[key][size[0] + "ml"].totalPurchaseQty += item.quantity;
//         }
//       });
//     }

//     if (orderData && orderData.items) {
//       orderData.items.forEach((item) => {
//         const itemName = item.name.trim();
//         const sizeMatch = itemName.match(/\d+/);
//         if (sizeMatch && sizes.includes(sizeMatch[0] + "ml")) {
//           const size = sizeMatch[0] + "ml";
//           if (!aggregatedData[itemName]) {
//             aggregatedData[itemName] = {};
//           }
//           if (!aggregatedData[itemName][size]) {
//             aggregatedData[itemName][size] = {
//               totalPurchaseQty: 0,
//               totalSaleQty: 0,
//               closingBalance: 0,
//             };
//           }
//           aggregatedData[itemName][size].totalSaleQty += item.quantity;
//         }
//       });
//     }

//     for (const key in aggregatedData) {
//       sizes.forEach((size) => {
//         aggregatedData[key][size].closingBalance =
//           aggregatedData[key][size].totalPurchaseQty -
//           aggregatedData[key][size].totalSaleQty;
//       });
//     }

//     return aggregatedData;
//   };

//   const aggregatedData = aggregateData();
//   const hasData = Object.keys(aggregatedData).length > 0;





//   const handlePrint = () => {
//     // Function to generate HTML table from data
//     const generateTable = (data, title, type) => {
//       let table = `<h2 class="title">${title}</h2>`;
//       table += '<table>';
//       // Add table headers
//       table += '<tr>';
//       table += `<th>Sr</th>`;
//       table += `<th>Item Name</th>`;
//       sizes.forEach((size, index) => {
//         table += `<th key=${index} class="p-2">${size}</th>`;
//       });
//       table += '</tr>';
 
//       // Add table rows
//       Object.keys(data).forEach((itemName, index) => {
//         table += '<tr>';
//         table += `<td>${index + 1}</td>`;
//         table += `<td>${itemName}</td>`;
//         sizes.forEach((size) => {
//           if (type === "totalPurchaseQty" || type === "totalSaleQty" || type === "closingBalance") {
//             table += `<td>${data[itemName][size][type]}</td>`;
//           } else {
//             table += `<td>${data[itemName][size]}</td>`;
//           }
//         });
//         table += '</tr>';
//       });
 
//       table += '</table>';
//       return table;
//     };
 
//     // Generate printable content for each table
//     const printableContent = `
//       <style>
//         table {
//           width: 100%;
//           border-collapse: collapse;
//         }
//         th, td {
//           border: 1px solid #dddddd;
//           padding: 8px;
//           text-align: left;
//         }
//         th {
//           background-color: #f2f2f2;
//         }
//         .title {
//           font-size: 1.5em;
//           font-weight: bold;
//           margin-top: 20px;
//         }
//       </style>
//       <h1>Liquor Stock Report</h1>
//       ${generateTable(differenceItems, 'Opening Balance')}
//       ${generateTable(aggregatedData, 'Total Purchase Quantity', 'totalPurchaseQty')}
//       ${generateTable(aggregatedData, 'Total Sale Quantity', 'totalSaleQty')}
//       ${generateTable(aggregatedData, 'Closing Balance', 'closingBalance')}
//     `;
 
//     // Open print dialog with the printable content
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(printableContent);
//     printWindow.document.close();
//     printWindow.print();
//   };
 



//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto max-w-full p-2 mt-10 font-sans">
//         <h1 className="md:text-xl text-md font-bold mb-4 text-start text-orange-500">
//           Liquor Brand Stock Report
//         </h1>
//         <div className="flex flex-col items-center mb-4 text-left">
//           <label className="mr-2 text-gray-600 md:text-base text-sm">
//             Select Date:
//           </label>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="border rounded-md p-1 text-gray-700 mb-2 sm:mb-0 w-fit justify-center flex md:text-sm text-sm"
//           />
//                  <button
//           onClick={handlePrint}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//         >
//           Print Report
//         </button>
//         </div>

//         <div className="table-container max-h-[400px] overflow-x-auto w-full md:text-base text-sm font-sans">
//           {hasData ? (
//             <>
//               <h2 className="text-lg font-semibold mb-2">Opening Balance</h2>
//               <table className="min-w-full bg-white border border-gray-300 text-left align-middle overflow-x-auto mb-4">
//                 <thead className="bg-gray-200 text-yellow-700 md:text-base text-sm">
//                   <tr>
//                     <th className="p-2">Sr</th>
//                     <th className="p-2">Item Name</th>
//                     {sizes.map((size, index) => (
//                       <th key={index} className="p-2">{size}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>

//                   {differenceItems.map((item, index) => (
//                     <tr key={index}>
//                       <td className="p-2">{index + 1}</td>
//                       <td className="p-2">{item.name}</td>
//                       {sizes.map((size, index) => (
//                         <td key={index} className="p-2">
//                           {item.size === size ? item.quantity : 0}
//                         </td>
//                       ))}

//                     </tr>
//                   ))}
//                 </tbody>


//               </table>
//               <h2 className="text-lg font-semibold mb-2">Total Purchase Quantity</h2>
//               <table className="min-w-full bg-white border border-gray-300 text-left align-middle overflow-x-auto mb-4">
//                 {/* Table for total purchase quantity */}
//                 <thead className="bg-gray-200 text-yellow-700 md:text-base text-sm">
//                   <tr>
//                     <th className="p-2">Sr</th>
//                     <th className="p-2">Date</th>
//                     <th className="p-2">Item Name</th>
//                     {sizes.map((size) => (
//                       <th key={size} className="p-2">{size} ml</th>
//                     ))}
//                     <th className="p-2">Total Purchase Qty</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.keys(aggregatedData).map((itemName, index) => (
//                     <tr key={index}>
//                       <td className="p-2">{index + 1}</td>
//                       <td className="p-2">{selectedDate}</td>
//                       <td className="p-2">{itemName}</td>
//                       {sizes.map((size) => (
//                         <td key={size} className="p-2 ">
//                           {aggregatedData[itemName][size].totalPurchaseQty}
//                         </td>
//                       ))}
//                       <td className="p-2 bg-gray-200">
//                         {/* Calculate total purchase quantity for the item */}
//                         {Object.values(aggregatedData[itemName]).reduce(
//                           (acc, curr) => acc + curr.totalPurchaseQty,
//                           0
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <h2 className="text-lg font-semibold mb-2">Total Sale Quantity</h2>
//               <table className="min-w-full bg-white border border-gray-300 text-left align-middle overflow-x-auto mb-4">
//                 {/* Table for total sale quantity */}
//                 <thead className="bg-gray-200 text-yellow-700 md:text-base text-sm">
//                   <tr>
//                     <th className="p-2">Sr</th>
//                     <th className="p-2">Date</th>
//                     <th className="p-2">Item Name</th>
//                     {sizes.map((size) => (
//                       <th key={size} className="p-2">{size} ml</th>
//                     ))}
//                     <th className="p-2">Total Sale Qty</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.keys(aggregatedData).map((itemName, index) => (
//                     <tr key={index}>
//                       <td className="p-2">{index + 1}</td>
//                       <td className="p-2">{selectedDate}</td>
//                       <td className="p-2">{itemName}</td>
//                       {sizes.map((size) => (
//                         <td key={size} className="p-2">
//                           {aggregatedData[itemName][size].totalSaleQty}
//                         </td>
//                       ))}
//                       <td className="p-2 bg-gray-200">
//                         {/* Calculate total sale quantity for the item */}
//                         {Object.values(aggregatedData[itemName]).reduce(
//                           (acc, curr) => acc + curr.totalSaleQty,
//                           0
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <h2 className="text-lg font-semibold mb-2">Closing Balance</h2>
//               <table className="min-w-full bg-white border border-gray-300 text-left align-middle overflow-x-auto mb-4">
//                 {/* Table for closing balance */}
//                 <thead className="bg-gray-200 text-yellow-700 md:text-base text-sm">
//                   <tr>
//                     <th className="p-2">Sr</th>
//                     <th className="p-2">Date</th>
//                     <th className="p-2">Item Name</th>
//                     {sizes.map((size) => (
//                       <th key={size} className="p-2">{size} ml</th>
//                     ))}
//                     <th className="p-2">Closing Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.keys(aggregatedData).map((itemName, index) => (
//                     <tr key={index}>
//                       <td className="p-2">{index + 1}</td>
//                       <td className="p-2">{selectedDate}</td>
//                       <td className="p-2">{itemName}</td>
//                       {sizes.map((size) => (
//                         <td key={size} className="p-2">
//                           {aggregatedData[itemName][size].closingBalance}
//                         </td>
//                       ))}
//                       <td className="p-2 bg-gray-200">
//                         {/* Calculate closing balance for the item */}
//                         {Object.values(aggregatedData[itemName]).reduce(
//                           (acc, curr) => acc + (curr.totalPurchaseQty - curr.totalSaleQty),
//                           0
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </>
//           ) : (
//             <p className="text-center text-gray-500">
//               No data available for the selected date.
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default LiquorStockReport;
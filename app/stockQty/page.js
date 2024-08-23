// pages/menus.js

'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

const Menus = () => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menu/menus/stockQty');
        setMenuData(response.data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenuData();
  }, []);

  const handlePrint = () => {
    const printableContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Menu Stock Quantity</title>
        <style>
          @page {
            margin: 0;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            margin: 20px;
            border: 1px solid #ccc;
            padding: 20px;
            font-size:10px
          }
          .container h1 {
            margin-left:-1rem
          }
          .table {
            width: 100%;
            border-collapse: collapse;
          }
          .table th, .table td , .table tr{
            border: 1px solid black;
            padding: 8px;
            text-align: left;
            font-size:12px
          }

        </style>
      </head>
      <body>
        <div class="container">
          <h1>Menu Stock Quantity</h1>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>O</th>
                <th>R</th>
                <th>S</th>
                <th>C</th>
              </tr>
            </thead>
            <tbody>
              ${menuData.map(menu => `
                <tr>
                  <td>${menu.name}</td>
                  <td>${menu.openingStock}</td>
                  <td>${menu.purchasedQuantity}</td>
                  <td>${menu.totalSoldQuantity}</td>
                  <td>${menu.stockQty}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">Menu Stock Quantity</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlePrint}>Print</button>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Stock</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchased Qty</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sold Qty</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closing Stock</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {menuData.map((menu) => (
            <tr key={menu._id}>
              <td className="px-2 py-4 whitespace-nowrap">{menu.name}</td>
              <td className="px-2 py-4 whitespace-nowrap">{menu.openingStock}</td>
              <td className="px-2 py-4 whitespace-nowrap">{menu.purchasedQuantity}</td>
              <td className="px-2 py-4 whitespace-nowrap">{menu.totalSoldQuantity}</td>
              <td className="px-2 py-4 whitespace-nowrap">{menu.stockQty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Menus;

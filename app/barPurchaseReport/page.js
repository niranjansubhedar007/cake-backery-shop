'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import * as XLSX from 'xlsx'; // Import xlsx package

const BarPurchaseReport = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(currentDate);
    const [endDate, setEndDate] = useState(currentDate);
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState("");
    const [purchaseData, setPurchaseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totals, setTotals] = useState({ paidAmount: 0, balance: 0, grandTotal: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/barPurchase/barpurchase/all?startDate=${startDate}&endDate=${endDate}`
                );
                setPurchaseData(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/supplier/suppliers");
                setVendors(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    useEffect(() => {
        const calculateTotals = () => {
            const paidAmountTotal = purchaseData.reduce((total, item) => total + item.paidAmount, 0);
            const balanceTotal = purchaseData.reduce((total, item) => total + item.balance, 0);
            const grandTotalTotal = purchaseData.reduce((total, item) => total + item.grandTotal, 0);
            setTotals({ paidAmount: paidAmountTotal, balance: balanceTotal, grandTotal: grandTotalTotal });
        };

        calculateTotals();
    }, [purchaseData]);

    const handleVendorChange = (event) => {
        setSelectedVendor(event.target.value);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/barPurchase/barpurchase/all", {
                params: {
                    startDate,
                    endDate,
                    vendorName: selectedVendor
                }
            });
            setPurchaseData(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const exportToExcel = () => {
        const filename = 'Bar_Purchase_Report.xlsx';

        const formattedData = purchaseData.map(item => [
            formatDate(item.date),
            item.billNo,
            item.vendorName,
            item.items.map(subItem => `${subItem.name} (${subItem.quantity} ${subItem.unit})`).join(', '),
            item.subtotal,
            item.frightAmount,
            item.handleAmount,
            item.grandTotal,
            item.vat,
            item.vatAmount,
            item.paidAmount,
            item.discount,
            item.balance
        ]);

        const ws = XLSX.utils.aoa_to_sheet([
            ['Date', 'Bill No', 'Vendor Name', 'Items', 'Subtotal', 'Freight Amount', 'Handle Amount', 'Grand Total', 'VAT', 'VAT Amount', 'Paid Amount', 'Discount', 'Balance'],
            ...formattedData
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bar_Purchase_Report");
        XLSX.writeFile(wb, filename);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-10 p-2 bg-white rounded-md shadow-md font-sans">
                <h1 className="text-xl font-bold mb-2">Bar Purchase Report</h1>
                <div className="mb-4 flex flex-wrap items-center">
                    <label className="mr-2 text-gray-600">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="border rounded-md p-1 text-gray-700 text-sm"
                    />
                    <div>
                        <label className="mx-2 text-gray-600">End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            className="border rounded-md text-gray-700 p-1 text-sm"
                        />
                    </div>
                    <button
                        className="bg-blue-100 text-blue-600 text-sm px-4 py-1 rounded-full font-bold hover:bg-blue-200 focus:outline-none focus:shadow-outline-blue ml-2"
                        onClick={exportToExcel}
                    >
                        Export to Excel
                    </button>
                    <div>
                        <label className="mr-2 text-gray-600">Vendor:</label>
                        <select
                            className="border rounded-md p-1 text-gray-700 text-sm ml-2"
                            value={selectedVendor}
                            onChange={handleVendorChange}
                        >
                            <option value="">Select a Vendor</option>
                            {vendors.map((vendor) => (
                                <option key={vendor.id} value={vendor.vendorName}>
                                    {vendor.vendorName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="bg-blue-100 text-blue-600 text-sm px-4 py-1 rounded-full font-bold hover:bg-blue-200 focus:outline-none focus:shadow-outline-blue ml-2"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                <div className="table-container overflow-x-auto overflow-y-auto text-sm">
                    <table className="min-w-full bg-white border border-gray-300 text-left align-middle">
                        <thead className="bg-gray-200">
                            <tr className="text-sm bg-zinc-100 text-yellow-700 border">
                                <th className="border border-gray-300 px-4 py-1">Date</th>
                                <th className="border border-gray-300 px-4 py-1">Bill No</th>
                                <th className="border border-gray-300 px-4 py-1">Vendor Name</th>
                                <th className="border border-gray-300 px-4 py-1">Items</th>
                                <th className="border border-gray-300 px-4 py-1">Subtotal</th>
                                <th className="border border-gray-300 px-4 py-1">Freight Amount</th>
                                <th className="border border-gray-300 px-4 py-1">Handle Amount</th>
                                <th className="border border-gray-300 px-4 py-1">VAT Amount</th>
                                <th className="border border-gray-300 px-4 py-1">Paid Amount</th>
                                <th className="border border-gray-300 px-4 py-1">Discount</th>
                                
                                <th className="border border-gray-300 px-4 py-1">Balance</th>
                                <th className="border border-gray-300 px-4 py-1">Grand Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseData.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-1">{formatDate(item.date)}</td>
                                    <td className="border border-gray-300 px-4 py-1">{item.billNo}</td>
                                    <td className="border border-gray-300 px-4 py-1">{item.vendorName}</td>
                                    <td className="border border-gray-300 px-4 py-1">{item.items.map(subItem => `${subItem.name} (${subItem.quantity} ${subItem.unit})`).join(', ')}</td>
                                    <td className="border border-gray-300 px-4 py-1">{(item.subtotal - item.vatAmount).toFixed(2)}</td>
                                    <td className="border border-gray-300 px-4 py-1">{item.frightAmount}</td>
                                    <td className="border border-gray-300 px-4 py-1">{item.handleAmount}</td>
                                    <td className="border border-gray-300 px-4 py-1">{item.vatAmount}</td>
                                    <td className="border border-gray-300 px-4 py-1">{item.paidAmount}</td>
                                    <td className="border border-gray-300 px-4 py-1">{item.discount}</td>
                                    
                                    <td className="border border-gray-300 px-4 py-1">{item.balance}</td>
                                    <td className="border border-gray-300 px-4 py-1">{item.grandTotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-2 sm:float-right border p-4 flex md:text-sm text-sm font-bold">
    {selectedVendor && (
        <div className="mr-4">
            <h2 className="">Vendor: </h2>
            <p className="font-bold text-green-600">{selectedVendor}</p>
        </div>
    )}
    <div className="mr-4">
        <h2 className="">Total Paid Amount: </h2>
        <p className="font-bold text-green-600">{totals.paidAmount.toFixed(2)}</p>
    </div>
    <div className="mr-4">
        <h2 className="">Total Balance: </h2>
        <p className="font-bold text-green-600">{totals.balance.toFixed(2)}</p>
    </div>
    <div className="">
        <h2>Grand Total: </h2>
        <p className="font-bold text-green-600">{totals.grandTotal.toFixed(2)}</p>
    </div>
</div>
            </div>
        </>
    );
};
  
  export default BarPurchaseReport;
'use client'


import React, { useState } from "react";
import axios from "axios";

const Flag = () => {
    const [loading, setLoading] = useState(false); // State to manage loading status
    const [error, setError] = useState(null); // State to manage error messages
    const [success, setSuccess] = useState(false); // State to manage success status

    const handleUpdateOrders = async () => {
        setLoading(true); // Set loading to true when the button is clicked
        setError(null); // Reset error state
        setSuccess(false); // Reset success state

        try {
            // Make a request to the backend API to update orders with flag true
            const response = await axios.put("http://localhost:5000/api/order/orders/flag");
            console.log(response); // Log the response to the console

            // Handle success
            setSuccess(true); // Set success to true
            setLoading(false); // Set loading to false after the request is complete
        } catch (error) {
            // Handle error
            setError("No order found"); // Set error message
            setLoading(false); // Set loading to false after the request is complete
        }
    };

    return (
        <div className="font-sans  cursor-pointer opacity-5 text-center">
            <button
                onClick={handleUpdateOrders} // Call handleUpdateOrders function when the button is clicked
                disabled={loading} // Disable the button when loading is true
                className="bg-white text-white font-bold py-2 px-4 rounded-sm "
            >
                {loading ? "Updating..." : "Update"} {/* Display appropriate text based on loading status */}
            </button>

        </div>
    );
};

export default Flag;

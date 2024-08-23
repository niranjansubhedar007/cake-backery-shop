'use client'

// Assuming you have a component named GSTForm.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';


const VATForm = ({ onSubmit }) => {
    const [hotel, setHotel] = useState({});
    const [vatPercentage, setVATPercentage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchHotelAndVATPercentage = async () => {
            try {
                const hotelsResponse = await axios.get('http://localhost:5000/api/hotel/get-all');

                if (hotelsResponse.data.length > 0) {
                    setHotel(hotelsResponse.data[0]);
                }
            } catch (error) {
                console.error('Error fetching hotels:', error.message);
            }
        };

        fetchHotelAndVATPercentage();
    }, []);

    const router = useRouter()
    useEffect(() => {
        const authToken = localStorage.getItem("EmployeeAuthToken");
        if (!authToken) {
          router.push("/login");
        }
      }, []);
     

    useEffect(() => {
        const fetchVATPercentage = async () => {
            try {
                if (hotel._id) {
                    const vatResponse = await axios.get(`http://localhost:5000/api/hotel/get/${hotel._id}`);
                    setVATPercentage(vatResponse.data.vatPercentage.toString());
                }
            } catch (error) {
                console.error('Error fetching VAT Percentage:', error.message);
            }
        };

        fetchVATPercentage();
    }, [hotel]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hotel._id && vatPercentage !== '') {
            try {
                await axios.patch(`http://localhost:5000/api/hotel/vat/${hotel._id}`, {
                    vatPercentage: parseFloat(vatPercentage),
                });
                setSuccessMessage('VAT Percentage added successfully');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 2000); // Close the success message after 2 seconds
            } catch (error) {
                console.error('Error adding VAT Percentage:', error.message);
            }
        }
    };

    return (
        <>
            <Navbar />

            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-32 shadow-md font-sans">
            <div className="text-xl font-bold font-sans md:mb-0 text-orange-600 text-left ml-5">
            <span> VAT Master (BAR)</span>
            </div>
                {/* <div className="mb-4 ml-4 mr-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotelNameInput">
                    </label>
                    <input
                        id="hotelNameInput"
                        type="text"
                        value={hotel.hotelName || ''}
                        readOnly
                        className="block appearance-none w-full font-semibold text-center text-xl rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div> */}

                <div className="mb-4 ml-4 mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vatPercentageInput">
                        VAT Percentage (%)
                    </label>
                    <input
                        id="vatPercentageInput"
                        type="number"
                        value={vatPercentage}
                        onChange={(e) => setVATPercentage(e.target.value)}
                        min="0"
                        className="block appearance-none w-md border border-gray-300 rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="text-center">
                {successMessage && (
                        <div className="fixed inset-0 flex items-center justify-center">
                            <div className="bg-white border border-green-500 rounded p-7 shadow-md z-50 absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <p className="text-green-500 font-semibold text-center text-xl">
                                    VAT Updated Successfully
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mb-3"
                    >
                        Save
                    </button>
                </div>
            </form>
        </>
    );
};

export default VATForm;
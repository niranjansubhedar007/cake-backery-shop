"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faTrash, faAngleLeft, faAngleRight, faPen } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import Navbar from "../components/Navbar";

const CounterList = () => {
  const [counters, setCounters] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCounterName, setNewCounterName] = useState("");
  const [counterToDeleteId, setCounterToDeleteId] = useState(null);
  const [editCounter, setEditCounter] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleEdit = (counter) => {
    setEditCounter(counter);
    setIsEditModalOpen(true);
  };
  
  const updateCounter = async () => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/counter/${editCounter._id}`, {
        countername: editCounter.countername,
      });
      const updatedCounterIndex = counters.findIndex(counter => counter._id === editCounter._id);
      if (updatedCounterIndex !== -1) {
        const updatedCounters = [...counters];
        updatedCounters[updatedCounterIndex] = response.data;
        setCounters(updatedCounters);
      }
      setIsEditModalOpen(false);
      setEditCounter(null);
    } catch (error) {
      console.error("Error updating counter:", error);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/counter");
      setCounters(response.data);
    } catch (error) {
      console.error("Error fetching counters:", error);
    }
  };

  const addCounter = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/counter", {
        countername: newCounterName,
      });
      setCounters([...counters, response.data]);
      setIsAddModalOpen(false);
      setNewCounterName("");
    } catch (error) {
      console.error("Error adding counter:", error);
    }
  };

  const deleteCounter = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/counter/${counterToDeleteId}`);
      if (response.status === 200) {
        setCounters(counters.filter(counter => counter._id !== counterToDeleteId)); // Assuming the ID field is "_id"
        setIsDeleteConfirmationModalOpen(false);
        setCounterToDeleteId(null); // Reset the counterToDeleteId after successful deletion
      } else {
        console.error("Error deleting counter:", response.data);
      }
    } catch (error) {
      console.error("Error deleting counter:", error);
    }
  };

  const confirmDelete = (counterId) => {
    setCounterToDeleteId(counterId);
    setIsDeleteConfirmationModalOpen(true);
  };

  const pageCount = Math.ceil(counters.length / 10); // Assuming 10 counters per page

  const displayCounters = counters
    .slice(pageNumber * 10, (pageNumber + 1) * 10)
    .map((counter, index) => (
      <tr key={counter._id}>
        <td className="text-center">{index + 1}</td>
        <td className="text-center">{counter.countername}</td>
        <td>
          <FontAwesomeIcon icon={faPen} onClick={() => handleEdit(counter)} className="text-center"/>
          <FontAwesomeIcon icon={faTrash} onClick={() => confirmDelete(counter._id)} className="text-right ml-4" />
        </td>
      </tr>
    ));

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-2 w-full mt-12 overflow-x-auto border-gray-300 shadow-md font-sans max-w-5xl">
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-xl font-bold font-sans mb-2 md:mb-0 text-orange-600">
            Counters
          </h1>
          <div className="flex justify-center">
            <div className="relative mx-auto text-gray-600 justify-center flex float-right">
              <input
                className="border-2 mr-2 capitalize border-gray-300 bg-white h-9 rounded-full pl-3 text-sm focus:outline-none"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search"
              />
              <button type="submit" className="absolute right-0 top-2 mr-2">
                <FontAwesomeIcon icon={faSearch} className="text-gray-700 mr-2" />
              </button>
            </div>
            <div className="flex justify-end mr-1">
              <button
                className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-1 p-1 px-4 shadow-md"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="" />
                Add
              </button>
            </div>
          </div>
        </div>

        <table className="min-w-full mt-4">
          <thead className="text-base bg-zinc-100 text-yellow-700 border ">
            <tr>
              <th>SR no</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-md font-sans font-bold">{displayCounters}</tbody>
        </table>
        <div className="flex">
        <ReactPaginate
          previousLabel={<FontAwesomeIcon icon={faAngleLeft} />}
          nextLabel={<FontAwesomeIcon icon={faAngleRight} />}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
        </div>
      </div>

      {isDeleteConfirmationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 font-sans" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg border border-red-600" onClick={(e) => e.stopPropagation()}>
            <div className="p-1 text-center">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Delete Counter</h3>
              <p className="mb-5 text-sm text-gray-700 dark:text-gray-400">Are you sure you want to delete this counter?</p>
              <button type="button" className="hover:bg-red-300 text-red-600 bg-red-100 font-bold py-2 px-4 rounded-full mr-2" onClick={deleteCounter}>Yes</button>
              <button type="button" className="hover:bg-gray-400 text-gray-700 bg-gray-200 font-bold py-2 px-4 rounded-full" onClick={() => {
                setIsDeleteConfirmationModalOpen(false);
                setCounterToDeleteId(null);
              }}>No</button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 font-sans" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg border border-green-600" onClick={(e) => e.stopPropagation()}>
            <div className="p-1 text-center">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Add Counter</h3>
              <input
                type="text"
                value={newCounterName}
                onChange={(e) => setNewCounterName(e.target.value)}
                className="border border-gray-400 rounded-md w-full h-10 pl-3 pr-10 sm:text-sm"
                placeholder="Counter Name"
              />
              <div className="mt-4">
                <button type="button" className="hover:bg-green-300 text-green-600 bg-green-100 font-bold py-2 px-4 rounded-full mr-2" onClick={addCounter}>Add</button>
                <button type="button" className="hover:bg-gray-400 text-gray-700 bg-gray-200 font-bold py-2 px-4 rounded-full" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && editCounter && (
        <div className="fixed inset-0 flex items-center justify-center z-50 font-sans" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg border border-blue-600" onClick={(e) => e.stopPropagation()}>
            <div className="p-1 text-center">
              <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">Edit Counter</h3>
              <input
                type="text"
                value={editCounter.name}
                onChange={(e) => setEditCounter({ ...editCounter, countername: e.target.value })}
                className="border border-gray-400 rounded-md w-full h-10 pl-3 pr-10 sm:text-sm"
                placeholder="Counter Name"
              />
              <div className="mt-4">
                <button type="button" className="hover:bg-blue-300 text-blue-600 bg-blue-100 font-bold py-2 px-4 rounded-full mr-2" onClick={updateCounter}>Update</button>
                <button type="button" className="hover:bg-gray-400 text-gray-700 bg-gray-200 font-bold py-2 px-4 rounded-full" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CounterList;


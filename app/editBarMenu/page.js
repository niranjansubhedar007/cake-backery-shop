"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const UpdateMenu = () => {
  const [liquorBrands, setLiquorBrands] = useState([]);
  const [selectedLiquorBrand, setSelectedLiquorBrand] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    barSubmenuId: "",
    liquorCategory: "",
    childMenus: [],
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/liquorBrand/barSubmenu/list`)
      .then((response) => {
        setLiquorBrands(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the liquor brands!", error);
      });
  }, []);

  useEffect(() => {
    if (selectedLiquorBrand) {
      axios
        .get(
          `http://localhost:5000/api/liquorBrand/getMenu/${selectedLiquorBrand}`
        )
        .then((response) => {
          setFormData(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the menu data!", error);
        });
    }
  }, [selectedLiquorBrand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePriceChange = (e, childMenuIndex, key) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedChildMenus = [...prevState.childMenus];
      updatedChildMenus[childMenuIndex] = {
        ...updatedChildMenus[childMenuIndex],
        pricePer: {
          ...updatedChildMenus[childMenuIndex].pricePer,
          [key]: value,
        },
      };
      return { ...prevState, childMenus: updatedChildMenus };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/liquorBrand/barSubmenu/${selectedLiquorBrand}`,
        formData
      );
      console.log("Menu updated successfully");
    } catch (error) {
      console.error("There was an error updating the menu!", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-1 font-sans text-sm p-5">
        <h1 className="text-2xl font-bold mb-5 mt-5 text-orange-500">
          Edit Bar Menu
        </h1>
        <div className="mb-4">
          <label
            htmlFor="liquorBrand"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Select Liquor Brand:
          </label>
          <div className="relative w-1/3">
            <select
              id="liquorBrand"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm cursor-pointer pr-10"
              onChange={(e) => setSelectedLiquorBrand(e.target.value)}
            >
              <option value="">Select</option>
              {liquorBrands.map((brand, index) => (
                <option key={index} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
        {selectedLiquorBrand && (
          <div>
            <div className="mb-4 ">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 w-full gap-6 p-1"
            >
              {formData.childMenus.map((childMenu, index) => (
                <div key={index} className="mb-4 text-sm">
                  <h3 className="font-semibold mb-2">{childMenu.name}</h3>
                  {Object.entries(childMenu.pricePer).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        {key}
                      </label>
                      <input
                        type="text"
                        name={`${index}.${key}`}
                        value={value}
                        onChange={(e) => handlePriceChange(e, index, key)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  ))}
                </div>
              ))}
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Menu
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
    </>
  );
};

export default UpdateMenu;


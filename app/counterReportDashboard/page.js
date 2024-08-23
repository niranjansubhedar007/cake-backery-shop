"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar";
import Link from "next/link";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faClock, faObjectUngroup,faMoneyBill, faList, faCubes, faShoppingCart, faChair, faMoneyCheckAlt, faTasks, faReceipt, faSignOutAlt, faRectangleXmark} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken"; // Import jwt library for decoding JWT tokens
import { decode } from 'jsonwebtoken';


const Report = () => {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Retrieve user role from local storage
    const counterToken = localStorage.getItem("counterToken");
    if (counterToken) {
      const decodedToken = jwt.decode(counterToken);
      if (decodedToken && decodedToken.role) {
        const userRole = decodedToken.role.toLowerCase(); // Normalize to lowercase
        setUserRole(userRole);
      }
    }
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   if (!loading && userRole !== "counterAdmin") {
  //     router.push("/counterReportLogin");
  //   }
  // }, [loading, userRole]);

  // if (loading) {
  //   return <div>Loading...</div>; // Render a loading indicator until user role is determined
  // }

  useEffect(() => {
    const token = localStorage.getItem("counterToken");
    if (!token) {
      router.push("/counterReportLogin");
    } else {
      const decodedToken = decode(token);
      if (!decodedToken || decodedToken.role !== "counterAdmin") {
        router.push("/counterReportLogin");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("counterToken")
    router.push("/dashboard");
  };

  return (
    <>
      <Navbar />
      <div>
        <section className="text-gray-600 body-font m-5 p-5 justify-center font-sans mt-10 text-sm">
          <div className="container px-5 py-1 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">
              <div className="p-4 md:p-6">
                <Link href="/couponDailyReports">
                  <div className="relative h-40 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faClock}
                        size="2x"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Daily Coupon Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4 md:p-6">
                <Link href="/couponMenuReport">
                  <div className="relative h-40 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faReceipt}
                        size="2x"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">Menu Report</h3>
                    </div>
                  </div>
                </Link>
              </div>

            
            </div>
          </div>
        </section>

        <div className="fixed bottom-3 right-4 z-30">
          <button
            onClick={handleLogout}
            className="bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-red font-bold"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Report;
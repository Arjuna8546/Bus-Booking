import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useNavigate } from 'react-router-dom'
import { getAllBus } from '../../endpoints/API'
import { Bus, MapPin, Clock, User, Phone } from "lucide-react";

function AdminHome() {
  const nav = useNavigate()
  const [allBus,setAllBus] = useState([])
  useEffect(()=>{
    const fetchAllBus = async()=>{
      const res = await getAllBus()
      if(res){
        setAllBus(res)
      }
    }
    fetchAllBus();
  },[])
  return (
    <div>
      <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6 bg-black text-white min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold tracking-wide">Available Buses</h2>
        <button
          onClick={() => nav("/add-bus")}
          className="bg-white text-black px-5 py-2 rounded-full font-medium hover:bg-gray-300 transition duration-200"
        >
          + Add Bus
        </button>
      </div>

      {/* Bus List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allBus.length > 0 ? (
          allBus.map((bus, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700 hover:scale-105 transition duration-200"
            >
              {/* Bus Name */}
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <Bus className="w-5 h-5 mr-2 text-gray-300" /> {bus.bus_name}
              </h3>

              {/* Route */}
              <p className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Route:</span> {bus.start_stop} → {bus.destination_stop}
              </p>

              {/* Timing */}
              <p className="flex items-center text-gray-500 mt-2">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Timing:</span> {bus.start_time} - {bus.reach_time}
              </p>

              {/* Owner Name */}
              <p className="flex items-center text-gray-600 mt-2">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Owner:</span> {bus.owner_name}
              </p>

              {/* Contact */}
              <p className="flex items-center text-gray-600 mt-2">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Contact:</span> {bus.owner_phone}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3 text-lg">
            No buses available. Add one to get started.
          </p>
        )}
      </div>
    </main>
      <Footer />
    </div>
    </div>
  )
}

export default AdminHome
